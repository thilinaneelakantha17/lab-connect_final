/**
 * Canonical roster used by local development fixtures and database seed tooling.
 * The password for every seeded user is password123.
 */

const passwordHash = '$2b$10$j1JwaLEOGhLKxGNTPj7OQeSA/sZTpbTJbWa3k7jNOdH1QnQuMQ4kS';

const schools = [
  { id: 'SCH-101', name: 'Royal College', province: 'Western', district: 'Colombo', zone: 'Colombo Central', labsCount: 4 },
  { id: 'SCH-102', name: 'Padukka Siri Piyarathana Vidyalaya', province: 'Western', district: 'Colombo', zone: 'Homagama', labsCount: 1 },
  { id: 'SCH-103', name: 'Dharmaraja College', province: 'Central', district: 'Kandy', zone: 'Kandy', labsCount: 3 },
  { id: 'SCH-104', name: 'Hasalaka Gamini Maha Vidyalaya', province: 'Central', district: 'Kandy', zone: 'Teldeniya', labsCount: 0 },
  { id: 'SCH-105', name: 'Richmond College', province: 'Southern', district: 'Galle', zone: 'Galle', labsCount: 3 }
];

const user = (id, name, email, school, role) => {
  const schoolRecord = schools.find((item) => item.id === school);
  return {
    id,
    name,
    email,
    schoolId: school,
    role,
    province: schoolRecord.province,
    district: schoolRecord.district,
    zone: schoolRecord.zone,
    passwordHash
  };
};

module.exports = {
  schools,
  users: [
    user('USR-001', 'Mr. S. Alwis', 's.alwis@moe.gov.lk', 'SCH-101', 'teacher'),
    user('USR-002', 'Mrs. N. Bandara', 'n.bandara@moe.gov.lk', 'SCH-102', 'teacher'),
    user('USR-003', 'Mr. A. B. Dissanayake', 'a.dissanayake@moe.gov.lk', 'SCH-103', 'teacher'),
    user('USR-004', 'Mr. T. Herath', 't.herath@moe.gov.lk', 'SCH-104', 'teacher'),
    user('USR-005', 'Mrs. M. K. Fernando', 'm.fernando@moe.gov.lk', 'SCH-105', 'teacher'),
    user('USR-006', 'Mr. K. Jayawardena', 'k.jayawardena@moe.gov.lk', 'SCH-101', 'manager'),
    user('USR-007', 'Mr. P. Kumara', 'p.kumara@moe.gov.lk', 'SCH-102', 'manager'),
    user('USR-008', 'Mrs. S. Ratnayake', 's.ratnayake@moe.gov.lk', 'SCH-103', 'manager'),
    user('USR-009', 'Mr. D. Wickramasinghe', 'd.wickramasinghe@moe.gov.lk', 'SCH-105', 'manager'),
    user('USR-010', 'Dr. Ruwan Wijesinghe', 'r.wijesinghe@moe.gov.lk', 'SCH-101', 'admin')
  ],
  labs: [
    { id: 'LAB-CMB-01', name: 'Advanced Chemistry & Instrumentation Lab', hostSchool: 'Royal College', province: 'Western', district: 'Colombo', zone: 'Colombo Central', manager: 'Mr. K. Jayawardena' },
    { id: 'LAB-KDY-02', name: 'Central Province Life Sciences & Microscopy Hub', hostSchool: 'Dharmaraja College', province: 'Central', district: 'Kandy', zone: 'Kandy', manager: 'Mrs. S. Ratnayake' },
    { id: 'LAB-GLE-03', name: 'Southern Physics, Optics & Electronics Lab', hostSchool: 'Richmond College', province: 'Southern', district: 'Galle', zone: 'Galle', manager: 'Mr. D. Wickramasinghe' }
  ],
  bookings: [],
  sessions: [],
  damageReports: [],
  equipment: [],
  auditLogs: []
};
