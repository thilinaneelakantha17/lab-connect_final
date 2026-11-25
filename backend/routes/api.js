const express = require('express');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { pool } = require('../db');

const router = express.Router();
const asyncRoute = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
const makeId = (prefix) => `${prefix}-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
const parseJson = (value, fallback = []) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const hashPassword = (password) => bcrypt.hash(password, 10);
const verifyPassword = (password, storedHash) => bcrypt.compare(password, storedHash);

async function writeAudit(actor, role, action, target, status = 'Success') {
  await pool.execute(
    `INSERT INTO audit_logs (id, actor, role, action, target, status)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [makeId('AUD'), actor, role, action, target, status]
  );
}

async function loadLabs(where = '', params = []) {
  const [labs] = await pool.execute(
    `SELECT l.*, COALESCE(
       (SELECT JSON_ARRAYAGG(ls.subject) FROM lab_subjects ls WHERE ls.lab_id = l.id), JSON_ARRAY()
     ) AS subjects,
     COALESCE(
       (SELECT JSON_ARRAYAGG(leh.equipment_name) FROM lab_equipment_highlights leh WHERE leh.lab_id = l.id),
       JSON_ARRAY()
     ) AS equipmentHighlights
     FROM labs l ${where} ORDER BY l.name`,
    params
  );
  return labs.map((lab) => ({
    id: lab.id,
    name: lab.name,
    hostSchool: lab.host_school,
    province: lab.province,
    district: lab.district,
    zone: lab.zone_name,
    subjects: parseJson(lab.subjects),
    capacity: lab.capacity,
    benches: lab.benches,
    utilization: Number(lab.utilization),
    distanceKm: lab.distance_km === null ? null : Number(lab.distance_km),
    manager: lab.manager_name,
    phone: lab.phone,
    rating: lab.rating === null ? null : Number(lab.rating),
    safetyRules: parseJson(lab.safety_rules),
    equipmentHighlights: parseJson(lab.equipmentHighlights),
  }));
}

async function loadBooking(id) {
  const [rows] = await pool.execute(
    `SELECT b.*, l.name AS lab_name, l.host_school
     FROM bookings b JOIN labs l ON l.id = b.lab_id WHERE b.id = ?`,
    [id]
  );
  if (!rows.length) return null;
  const booking = rows[0];
  return {
    id: booking.id,
    labId: booking.lab_id,
    labName: booking.lab_name,
    hostSchool: booking.host_school,
    visitingSchool: booking.visiting_school,
    teacherName: booking.teacher_name,
    grade: booking.grade,
    subject: booking.subject,
    practicalUnit: booking.practical_unit,
    date: booking.booking_date,
    slot: booking.slot,
    studentsCount: booking.students_count,
    attendedCount: booking.attended_count,
    equipmentRequested: parseJson(booking.equipment_requested),
    notes: booking.notes || '',
    managerRemark: booking.manager_remark,
    status: booking.status,
    attendanceVerified: Boolean(booking.attendance_verified),
    createdAt: booking.created_at,
  };
}

router.get('/health', asyncRoute(async (req, res) => {
  await pool.query('SELECT 1');
  res.json({ status: 'OK', database: 'MySQL', service: 'Lab Connect Sri Lanka API' });
}));

router.get('/geo', asyncRoute(async (req, res) => {
  const [schools] = await pool.execute(
    `SELECT id, name, province, district, zone_name AS zone
     FROM schools ORDER BY province, district, zone_name, name`
  );
  const provinces = [...new Set(schools.map((school) => school.province))];
  const districts = [...new Set(schools.map((school) => `${school.province}|${school.district}`))]
    .map((value) => {
      const [province, name] = value.split('|');
      return { province, name };
    });
  const zones = [...new Set(schools.map((school) => `${school.province}|${school.district}|${school.zone}`))]
    .map((value) => {
      const [province, district, name] = value.split('|');
      return { province, district, name };
    });
  res.json({ provinces, districts, zones, schools });
}));

router.post('/auth/signup', asyncRoute(async (req, res) => {
  const { name, email, schoolName, role, password, secretCode, province, district, zone } = req.body;
  if (!name || !email || !schoolName || !role || !province || !district || !zone || !password) {
    return res.status(400).json({ error: 'Name, email, role, province, district, zone, school, and password are required' });
  }
  if (!['teacher', 'manager', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }
  if (role === 'admin' && secretCode !== '111111') {
    return res.status(403).json({ error: 'Invalid System Admin secret code' });
  }
  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);
  try {
    await pool.execute(
      `INSERT INTO users (id, full_name, email, school_id, role, province, district, zone_name, password_hash)
       VALUES (?, ?, LOWER(?), ?, ?, ?, ?, ?, ?)`,
      [id, name.trim(), email.trim(), schoolName.trim(), role, province, district, zone, passwordHash]
    );
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email is already registered' });
    throw error;
  }
  res.status(201).json({
    message: 'Account created',
    data: { id, name: name.trim(), email, schoolName: schoolName.trim(), role, province, district, zone }
  });
}));

router.post('/auth/login', asyncRoute(async (req, res) => {
  const { email, password, role } = req.body;
  const [rows] = await pool.execute(
    `SELECT u.id, u.full_name, u.email, u.school_id, s.name AS school_name, u.role,
       u.province, u.district, u.zone_name AS zone, u.password_hash
     FROM users u LEFT JOIN schools s ON s.id = u.school_id
     WHERE u.email = LOWER(?) AND u.role = ? AND u.is_active = TRUE`,
    [email, role]
  );
  if (!rows.length || !(await verifyPassword(password, rows[0].password_hash))) {
    return res.status(401).json({ error: 'Invalid email, password, or role' });
  }
  await pool.execute('UPDATE users SET last_login_at = NOW() WHERE id = ?', [rows[0].id]);
  res.json({
    data: {
      id: rows[0].id,
      name: rows[0].full_name,
      email: rows[0].email,
      schoolId: rows[0].school_id,
      schoolName: rows[0].school_name || rows[0].school_id,
      role: rows[0].role,
      province: rows[0].province,
      district: rows[0].district,
      zone: rows[0].zone
    }
  });
}));

router.get('/labs', asyncRoute(async (req, res) => {
  const { province, district, zone, subject, search } = req.query;
  const conditions = [];
  const params = [];
  if (province && province !== 'All') {
    conditions.push('l.province = ?');
    params.push(province);
  }
  if (district && district !== 'All') {
    conditions.push('l.district = ?');
    params.push(district);
  }
  if (zone && zone !== 'All') {
    conditions.push('l.zone_name = ?');
    params.push(zone);
  }
  if (subject && subject !== 'All') {
    conditions.push('EXISTS (SELECT 1 FROM lab_subjects filter_subject WHERE filter_subject.lab_id = l.id AND filter_subject.subject = ?)');
    params.push(subject);
  }
  if (search) {
    conditions.push('(l.name LIKE ? OR l.host_school LIKE ? OR l.district LIKE ?)');
    const query = `%${search}%`;
    params.push(query, query, query);
  }
  const labs = await loadLabs(conditions.length ? `WHERE ${conditions.join(' AND ')}` : '', params);
  res.json({ count: labs.length, data: labs });
}));

router.get('/labs/:id', asyncRoute(async (req, res) => {
  const labs = await loadLabs('WHERE l.id = ?', [req.params.id]);
  if (!labs.length) return res.status(404).json({ error: 'Laboratory not found' });
  res.json(labs[0]);
}));

router.put('/labs/:id/profile', asyncRoute(async (req, res) => {
  const allowed = {
    name: 'name',
    hostSchool: 'host_school',
    province: 'province',
    district: 'district',
    zone: 'zone_name',
    capacity: 'capacity',
    benches: 'benches',
    utilization: 'utilization',
    distanceKm: 'distance_km',
    manager: 'manager_name',
    phone: 'phone',
    rating: 'rating',
    safetyRules: 'safety_rules',
  };
  const fields = [];
  const values = [];
  for (const [key, column] of Object.entries(allowed)) {
    if (req.body[key] !== undefined) {
      fields.push(`${column} = ?`);
      values.push(key === 'safetyRules' ? JSON.stringify(req.body[key]) : req.body[key]);
    }
  }
  if (!fields.length) return res.status(400).json({ error: 'No valid profile fields supplied' });
  values.push(req.params.id);
  const [result] = await pool.execute(`UPDATE labs SET ${fields.join(', ')} WHERE id = ?`, values);
  if (!result.affectedRows) return res.status(404).json({ error: 'Laboratory not found' });
  const lab = (await loadLabs('WHERE l.id = ?', [req.params.id]))[0];
  await writeAudit(lab.manager || 'Lab Manager', 'Lab Manager', 'Updated Lab Profile & Safety Rules', lab.name);
  res.json({ message: 'Laboratory profile updated', data: lab });
}));

router.get('/bookings', asyncRoute(async (req, res) => {
  const { status, labId, visitingSchool, province, district, zone } = req.query;
  const conditions = [];
  const params = [];
  if (status && status !== 'All') { conditions.push('b.status = ?'); params.push(status); }
  if (labId) { conditions.push('b.lab_id = ?'); params.push(labId); }
  if (visitingSchool) { conditions.push('b.visiting_school LIKE ?'); params.push(`%${visitingSchool}%`); }
  if (province || district || zone) {
    conditions.push(`EXISTS (
      SELECT 1 FROM labs scoped_lab
      WHERE scoped_lab.id = b.lab_id
      ${province ? 'AND scoped_lab.province = ?' : ''}
      ${district ? 'AND scoped_lab.district = ?' : ''}
      ${zone ? 'AND scoped_lab.zone_name = ?' : ''}
    )`);
    if (province) params.push(province);
    if (district) params.push(district);
    if (zone) params.push(zone);
  }
  const [rows] = await pool.execute(
    `SELECT b.id FROM bookings b ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''} ORDER BY b.created_at DESC`,
    params
  );
  const data = (await Promise.all(rows.map((row) => loadBooking(row.id)))).filter(Boolean);
  res.json({ count: data.length, data });
}));

router.post('/bookings', asyncRoute(async (req, res) => {
  const {
    labId, visitingSchool, teacherName, grade, subject, practicalUnit, date, slot,
    studentsCount, equipmentRequested, notes,
  } = req.body;
  if (!labId || !date || !slot || !visitingSchool || !teacherName) {
    return res.status(400).json({ error: 'Lab, date, slot, visiting school, and teacher are required' });
  }
  const id = makeId('BK');
  await pool.execute(
    `INSERT INTO bookings
      (id, lab_id, visiting_school, teacher_name, grade, subject, practical_unit, booking_date,
       slot, students_count, equipment_requested, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, labId, visitingSchool, teacherName, grade || null, subject || null, practicalUnit || null,
      date, slot, Number(studentsCount) || 0, JSON.stringify(equipmentRequested || []), notes || null]
  );
  const data = await loadBooking(id);
  await writeAudit(teacherName, 'Science Teacher', 'Created Lab Booking Request', `${id} (${data.labName})`, 'Created');
  res.status(201).json({ message: 'Booking request submitted', data });
}));

router.patch('/bookings/:id/status', asyncRoute(async (req, res) => {
  const { status, managerRemark, attendedCount } = req.body;
  const data = await loadBooking(req.params.id);
  if (!data) return res.status(404).json({ error: 'Booking not found' });
  await pool.execute(
    `UPDATE bookings SET status = ?, manager_remark = ?, attended_count = ?,
     attendance_verified = ? WHERE id = ?`,
    [status, managerRemark === undefined ? data.managerRemark : managerRemark,
      attendedCount === undefined ? data.attendedCount : Number(attendedCount),
      attendedCount === undefined ? data.attendanceVerified : true, req.params.id]
  );
  const updated = await loadBooking(req.params.id);
  await writeAudit('Lab Manager', 'Lab Manager', `Booking Status -> ${status}`, req.params.id);
  res.json({ message: `Booking ${req.params.id} updated to ${status}`, data: updated });
}));

router.get('/sessions', asyncRoute(async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT id, teacher, unit_name AS unit, payload, recorded_at AS recordedAt
     FROM sessions ORDER BY recorded_at DESC, id DESC`
  );
  const data = rows.map((row) => ({ ...row, ...parseJson(row.payload, {}) }));
  res.json({ count: data.length, data });
}));

router.post('/sessions', asyncRoute(async (req, res) => {
  const id = makeId('SES');
  const { teacher, unit, recordedAt, ...payload } = req.body;
  await pool.execute(
    `INSERT INTO sessions (id, teacher, unit_name, payload, recorded_at)
     VALUES (?, ?, ?, ?, COALESCE(?, CURRENT_DATE))`,
    [id, teacher || null, unit || null, JSON.stringify(payload), recordedAt || null]
  );
  const data = { id, ...req.body, recordedAt: recordedAt || new Date().toISOString().slice(0, 10) };
  await writeAudit(teacher || 'Science Teacher', 'Science Teacher', 'Logged Practical Session & Hours', unit || '');
  res.status(201).json({ message: 'Practical session logged', data });
}));

router.get('/damage-reports', asyncRoute(async (req, res) => {
  const [data] = await pool.execute(
    `SELECT id, item_name AS itemName, lab_name AS labName, reported_by AS reportedBy,
      report_date AS date, severity, qty_affected AS qtyAffected, description, status
     FROM damage_reports ORDER BY report_date DESC, id DESC`
  );
  res.json({ count: data.length, data });
}));

router.post('/damage-reports', asyncRoute(async (req, res) => {
  const id = makeId('DMG');
  const report = {
    id,
    status: 'Open',
    reportedAt: new Date().toISOString().slice(0, 10),
    ...req.body,
  };
  await pool.execute(
    `INSERT INTO damage_reports
      (id, item_name, lab_name, reported_by, report_date, severity, qty_affected, description, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, report.itemName, report.labName || null, report.reportedBy || 'Science Teacher',
      report.date || report.reportedAt, report.severity, Number(report.qtyAffected) || 1,
      report.description || null, report.status]
  );
  await writeAudit(report.reportedBy || 'Science Teacher', 'Science Teacher', 'Reported Equipment Incident', report.itemName);
  res.status(201).json({ message: 'Damage report filed', data: report });
}));

router.get('/equipment', asyncRoute(async (req, res) => {
  const [rows] = await pool.execute(
    `SELECT id, lab_id AS labId, name, category, total_qty AS totalQty, available_qty AS availableQty,
      condition_name AS condition, calibration_status AS calibrationStatus, maintenance_flag AS maintenanceFlag
     FROM equipment ORDER BY name`
  );
  res.json({ count: rows.length, data: rows });
}));

router.patch('/equipment/:id', asyncRoute(async (req, res) => {
  const fields = [];
  const values = [];
  const mapping = { name: 'name', category: 'category', totalQty: 'total_qty', availableQty: 'available_qty', condition: 'condition_name', calibrationStatus: 'calibration_status', maintenanceFlag: 'maintenance_flag' };
  for (const [key, column] of Object.entries(mapping)) {
    if (req.body[key] !== undefined) { fields.push(`${column} = ?`); values.push(req.body[key]); }
  }
  if (!fields.length) return res.status(400).json({ error: 'No valid equipment fields supplied' });
  values.push(req.params.id);
  const [result] = await pool.execute(`UPDATE equipment SET ${fields.join(', ')} WHERE id = ?`, values);
  if (!result.affectedRows) return res.status(404).json({ error: 'Equipment item not found' });
  const [rows] = await pool.execute('SELECT * FROM equipment WHERE id = ?', [req.params.id]);
  res.json({ message: 'Equipment updated', data: rows[0] });
}));

router.get('/schools', asyncRoute(async (req, res) => {
  const conditions = [];
  const params = [];
  for (const [queryKey, column] of [['province', 'province'], ['district', 'district'], ['zone', 'zone_name']]) {
    if (req.query[queryKey]) {
      conditions.push(`${column} = ?`);
      params.push(req.query[queryKey]);
    }
  }
  const [data] = await pool.execute(
    `SELECT id, census_id AS censusId, name, school_type AS type, province, district,
      zone_name AS zone, labs_count AS labsCount, status, coordinator FROM schools
      ${conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''} ORDER BY name`,
    params
  );
  res.json({ count: data.length, data });
}));

router.patch('/schools/:id/verify', asyncRoute(async (req, res) => {
  const status = req.body.status || 'Verified';
  const [result] = await pool.execute('UPDATE schools SET status = ? WHERE id = ?', [status, req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ error: 'School not found' });
  const [rows] = await pool.execute('SELECT name FROM schools WHERE id = ?', [req.params.id]);
  await writeAudit('System Admin', 'System Admin', `School Verification: ${status}`, rows[0].name);
  res.json({ message: 'School status updated', data: { id: req.params.id, status } });
}));

router.get('/users', asyncRoute(async (req, res) => {
  const [data] = await pool.execute(
    `SELECT id, full_name AS name, email, role, school_id AS schoolId, province, district,
      zone_name AS zone, is_active AS active
     FROM users ORDER BY full_name`
  );
  res.json({ count: data.length, data });
}));

router.patch('/users/:id/status', asyncRoute(async (req, res) => {
  const [result] = await pool.execute('UPDATE users SET is_active = ? WHERE id = ?', [Boolean(req.body.active), req.params.id]);
  if (!result.affectedRows) return res.status(404).json({ error: 'User not found' });
  const [rows] = await pool.execute('SELECT full_name FROM users WHERE id = ?', [req.params.id]);
  await writeAudit('System Admin', 'System Admin', `User Active Toggled: ${Boolean(req.body.active)}`, rows[0].full_name);
  res.json({ message: 'User updated', data: { id: req.params.id, active: Boolean(req.body.active) } });
}));

router.get('/audit-logs', asyncRoute(async (req, res) => {
  const [data] = await pool.execute(
    `SELECT id, DATE_FORMAT(logged_at, '%Y-%m-%d %H:%i') AS timestamp, actor, role, action, target, status
     FROM audit_logs ORDER BY logged_at DESC LIMIT 500`
  );
  res.json({ count: data.length, data });
}));

module.exports = router;
