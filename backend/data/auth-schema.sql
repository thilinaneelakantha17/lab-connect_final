-- Lab Connect Sri Lanka schema and roster seed.
-- Run this file in phpMyAdmin after selecting a MySQL 8+ server.

CREATE DATABASE IF NOT EXISTS lab_connect
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE lab_connect;

SET FOREIGN_KEY_CHECKS = 0;

CREATE TABLE IF NOT EXISTS schools (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  census_id VARCHAR(80) NOT NULL UNIQUE,
  name VARCHAR(160) NOT NULL,
  school_type VARCHAR(80) NOT NULL,
  province VARCHAR(80) NOT NULL,
  district VARCHAR(80) NOT NULL,
  zone_name VARCHAR(120) NOT NULL,
  labs_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  status VARCHAR(40) NOT NULL DEFAULT 'Pending Verification',
  coordinator VARCHAR(160) NULL,
  INDEX schools_geo_idx (province, district, zone_name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) NOT NULL PRIMARY KEY,
  full_name VARCHAR(160) NOT NULL,
  email VARCHAR(254) NOT NULL UNIQUE,
  school_id VARCHAR(160) NOT NULL,
  role ENUM('teacher', 'manager', 'admin') NOT NULL,
  province VARCHAR(80) NOT NULL,
  district VARCHAR(80) NOT NULL,
  zone_name VARCHAR(120) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  email_verified_at DATETIME NULL,
  last_login_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX users_school_id_idx (school_id),
  INDEX users_geo_idx (province, district, zone_name),
  INDEX users_role_idx (role)
) ENGINE=InnoDB;

-- Keeps typed school names from being truncated in existing installations.
ALTER TABLE users MODIFY COLUMN school_id VARCHAR(160) NOT NULL;

CREATE TABLE IF NOT EXISTS labs (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  host_school VARCHAR(160) NOT NULL,
  province VARCHAR(80) NOT NULL,
  district VARCHAR(80) NOT NULL,
  zone_name VARCHAR(120) NOT NULL,
  capacity SMALLINT UNSIGNED NOT NULL,
  benches SMALLINT UNSIGNED NOT NULL,
  utilization DECIMAL(5,2) NOT NULL DEFAULT 0,
  distance_km DECIMAL(7,2) NULL,
  manager_name VARCHAR(160) NULL,
  phone VARCHAR(40) NULL,
  rating DECIMAL(3,2) NULL,
  safety_rules JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX labs_geo_idx (province, district, zone_name)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lab_subjects (
  lab_id VARCHAR(40) NOT NULL,
  subject VARCHAR(80) NOT NULL,
  PRIMARY KEY (lab_id, subject),
  CONSTRAINT lab_subjects_lab_fk FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lab_equipment_highlights (
  lab_id VARCHAR(40) NOT NULL,
  equipment_name VARCHAR(160) NOT NULL,
  PRIMARY KEY (lab_id, equipment_name),
  CONSTRAINT lab_equipment_highlights_lab_fk FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS equipment (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  lab_id VARCHAR(40) NOT NULL,
  name VARCHAR(160) NOT NULL,
  category VARCHAR(100) NULL,
  total_qty INT UNSIGNED NOT NULL DEFAULT 0,
  available_qty INT UNSIGNED NOT NULL DEFAULT 0,
  condition_name VARCHAR(60) NOT NULL DEFAULT 'Operational',
  calibration_status VARCHAR(80) NULL,
  maintenance_flag BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT equipment_lab_fk FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lab_slots (
  id CHAR(36) NOT NULL PRIMARY KEY,
  lab_id VARCHAR(40) NOT NULL,
  slot_date DATE NULL,
  day_name VARCHAR(20) NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status ENUM('available', 'reserved', 'maintenance', 'closed') NOT NULL DEFAULT 'available',
  CONSTRAINT lab_slots_lab_fk FOREIGN KEY (lab_id) REFERENCES labs(id) ON DELETE CASCADE,
  INDEX lab_slots_lookup_idx (lab_id, slot_date, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  lab_id VARCHAR(40) NOT NULL,
  visiting_school VARCHAR(160) NOT NULL,
  teacher_name VARCHAR(160) NOT NULL,
  grade VARCHAR(80) NULL,
  subject VARCHAR(80) NULL,
  practical_unit VARCHAR(255) NULL,
  booking_date DATE NOT NULL,
  slot VARCHAR(60) NOT NULL,
  students_count SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  attended_count SMALLINT UNSIGNED NULL,
  equipment_requested JSON NULL,
  notes TEXT NULL,
  manager_remark TEXT NULL,
  status ENUM('Pending', 'Approved', 'Rescheduled', 'Rejected', 'Completed') NOT NULL DEFAULT 'Pending',
  attendance_verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT bookings_lab_fk FOREIGN KEY (lab_id) REFERENCES labs(id),
  INDEX bookings_status_idx (status),
  INDEX bookings_date_idx (booking_date)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS sessions (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  teacher VARCHAR(160) NULL,
  unit_name VARCHAR(255) NULL,
  payload JSON NULL,
  recorded_at DATE NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS damage_reports (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  item_name VARCHAR(160) NOT NULL,
  lab_name VARCHAR(160) NULL,
  reported_by VARCHAR(160) NOT NULL,
  report_date DATE NOT NULL,
  severity VARCHAR(40) NOT NULL,
  qty_affected INT UNSIGNED NOT NULL DEFAULT 1,
  description TEXT NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'Open'
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS audit_logs (
  id VARCHAR(40) NOT NULL PRIMARY KEY,
  logged_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  actor VARCHAR(160) NOT NULL,
  role VARCHAR(40) NOT NULL,
  action VARCHAR(255) NOT NULL,
  target VARCHAR(255) NULL,
  status VARCHAR(40) NOT NULL
) ENGINE=InnoDB;

INSERT INTO schools
  (id, census_id, name, school_type, province, district, zone_name, labs_count, status, coordinator)
VALUES
  ('SCH-101', 'MOE-WP-0112', 'Royal College', '1AB Host School', 'Western', 'Colombo', 'Colombo Central', 4, 'Verified', 'Mr. K. Jayawardena'),
  ('SCH-102', 'MOE-WP-0481', 'Padukka Siri Piyarathana Vidyalaya', 'Type 1C Rural School', 'Western', 'Colombo', 'Homagama', 1, 'Verified', 'Mr. P. Kumara'),
  ('SCH-103', 'MOE-CP-0234', 'Dharmaraja College', '1AB Host School', 'Central', 'Kandy', 'Kandy', 3, 'Verified', 'Mrs. S. Ratnayake'),
  ('SCH-104', 'MOE-CP-0891', 'Hasalaka Gamini Maha Vidyalaya', 'Type 2 Rural School', 'Central', 'Kandy', 'Teldeniya', 0, 'Verified', 'Mr. T. Herath'),
  ('SCH-105', 'MOE-SP-0341', 'Richmond College', '1AB Host School', 'Southern', 'Galle', 'Galle', 3, 'Verified', 'Mr. D. Wickramasinghe')
ON DUPLICATE KEY UPDATE
  name = VALUES(name), province = VALUES(province), district = VALUES(district),
  zone_name = VALUES(zone_name), labs_count = VALUES(labs_count),
  coordinator = VALUES(coordinator), status = VALUES(status);

-- password123, bcrypt cost 10
INSERT INTO users
  (id, full_name, email, school_id, role, province, district, zone_name, password_hash, is_active, email_verified_at)
VALUES
  ('USR-001', 'Mr. S. Alwis', 's.alwis@moe.gov.lk', 'SCH-101', 'teacher', 'Western', 'Colombo', 'Colombo Central', '$2b$10$j1JwaLEOGhLKxGNTPj7OQeSA/sZTpbTJbWa3k7jNOdH1QnQuMQ4kS', 1, NOW()),
  ('USR-002', 'Mrs. N. Bandara', 'n.bandara@moe.gov.lk', 'SCH-102', 'teacher', 'Western', 'Colombo', 'Homagama', '$2b$10$j1JwaLEOGhLKxGNTPj7OQeSA/sZTpbTJbWa3k7jNOdH1QnQuMQ4kS', 1, NOW()),
  ('USR-003', 'Mr. A. B. Dissanayake', 'a.dissanayake@moe.gov.lk', 'SCH-103', 'teacher', 'Central', 'Kandy', 'Kandy', '$2b$10$j1JwaLEOGhLKxGNTPj7OQeSA/sZTpbTJbWa3k7jNOdH1QnQuMQ4kS', 1, NOW()),
  ('USR-004', 'Mr. T. Herath', 't.herath@moe.gov.lk', 'SCH-104', 'teacher', 'Central', 'Kandy', 'Teldeniya', '$2b$10$j1JwaLEOGhLKxGNTPj7OQeSA/sZTpbTJbWa3k7jNOdH1QnQuMQ4kS', 1, NOW()),
  ('USR-005', 'Mrs. M. K. Fernando', 'm.fernando@moe.gov.lk', 'SCH-105', 'teacher', 'Southern', 'Galle', 'Galle', '$2b$10$j1JwaLEOGhLKxGNTPj7OQeSA/sZTpbTJbWa3k7jNOdH1QnQuMQ4kS', 1, NOW()),
  ('USR-006', 'Mr. K. Jayawardena', 'k.jayawardena@moe.gov.lk', 'SCH-101', 'manager', 'Western', 'Colombo', 'Colombo Central', '$2b$10$j1JwaLEOGhLKxGNTPj7OQeSA/sZTpbTJbWa3k7jNOdH1QnQuMQ4kS', 1, NOW()),
  ('USR-007', 'Mr. P. Kumara', 'p.kumara@moe.gov.lk', 'SCH-102', 'manager', 'Western', 'Colombo', 'Homagama', '$2b$10$j1JwaLEOGhLKxGNTPj7OQeSA/sZTpbTJbWa3k7jNOdH1QnQuMQ4kS', 1, NOW()),
  ('USR-008', 'Mrs. S. Ratnayake', 's.ratnayake@moe.gov.lk', 'SCH-103', 'manager', 'Central', 'Kandy', 'Kandy', '$2b$10$j1JwaLEOGhLKxGNTPj7OQeSA/sZTpbTJbWa3k7jNOdH1QnQuMQ4kS', 1, NOW()),
  ('USR-009', 'Mr. D. Wickramasinghe', 'd.wickramasinghe@moe.gov.lk', 'SCH-105', 'manager', 'Southern', 'Galle', 'Galle', '$2b$10$j1JwaLEOGhLKxGNTPj7OQeSA/sZTpbTJbWa3k7jNOdH1QnQuMQ4kS', 1, NOW()),
  ('USR-010', 'Dr. Ruwan Wijesinghe', 'r.wijesinghe@moe.gov.lk', 'SCH-101', 'admin', 'Western', 'Colombo', 'Colombo Central', '$2b$10$j1JwaLEOGhLKxGNTPj7OQeSA/sZTpbTJbWa3k7jNOdH1QnQuMQ4kS', 1, NOW())
ON DUPLICATE KEY UPDATE
  full_name = VALUES(full_name), school_id = VALUES(school_id), role = VALUES(role),
  province = VALUES(province), district = VALUES(district), zone_name = VALUES(zone_name),
  password_hash = VALUES(password_hash), is_active = VALUES(is_active);

INSERT INTO labs
  (id, name, host_school, province, district, zone_name, capacity, benches, utilization, distance_km, manager_name, phone, rating, safety_rules)
VALUES
  ('LAB-CMB-01', 'Advanced Chemistry & Instrumentation Lab', 'Royal College', 'Western', 'Colombo', 'Colombo Central', 40, 10, 84.50, 6.20, 'Mr. K. Jayawardena', '011-2691029', 4.90, '["Wear laboratory coats and safety goggles.", "Use fume hoods for concentrated acids."]'),
  ('LAB-CMB-02', 'Royal College Physics Laboratory', 'Royal College', 'Western', 'Colombo', 'Colombo Central', 36, 9, 72.00, 6.20, 'Mr. K. Jayawardena', '011-2691029', 4.70, '["Inspect circuits before energizing benches."]'),
  ('LAB-CMB-03', 'Royal College Biology Laboratory', 'Royal College', 'Western', 'Colombo', 'Colombo Central', 32, 8, 68.00, 6.20, 'Mr. K. Jayawardena', '011-2691029', 4.70, '["Use bio-waste disposal bins."]'),
  ('LAB-CMB-04', 'Royal College ICT Laboratory', 'Royal College', 'Western', 'Colombo', 'Colombo Central', 30, 8, 65.00, 6.20, 'Mr. K. Jayawardena', '011-2691029', 4.60, '["Keep equipment dry and secured."]'),
  ('LAB-PAD-01', 'Padukka School Science Laboratory', 'Padukka Siri Piyarathana Vidyalaya', 'Western', 'Colombo', 'Homagama', 28, 7, 61.00, 12.00, 'Mr. P. Kumara', '011-2854000', 4.50, '["Follow teacher safety instructions."]'),
  ('LAB-KDY-02', 'Central Province Life Sciences & Microscopy Hub', 'Dharmaraja College', 'Central', 'Kandy', 'Kandy', 36, 9, 78.00, 14.50, 'Mrs. S. Ratnayake', '081-2224491', 4.80, '["Clean microscope objectives with lens tissue."]'),
  ('LAB-KDY-03', 'Dharmaraja Chemistry Laboratory', 'Dharmaraja College', 'Central', 'Kandy', 'Kandy', 34, 8, 70.00, 14.50, 'Mrs. S. Ratnayake', '081-2224491', 4.70, '["Label all chemical waste."]'),
  ('LAB-KDY-04', 'Dharmaraja Physics Laboratory', 'Dharmaraja College', 'Central', 'Kandy', 'Kandy', 34, 8, 66.00, 14.50, 'Mrs. S. Ratnayake', '081-2224491', 4.70, '["Inspect apparatus before use."]'),
  ('LAB-GLE-03', 'Southern Physics, Optics & Electronics Lab', 'Richmond College', 'Southern', 'Galle', 'Galle', 32, 8, 72.00, 11.80, 'Mr. D. Wickramasinghe', '091-2234812', 4.90, '["Switch off meters before changing circuits."]'),
  ('LAB-GLE-04', 'Richmond College Chemistry Laboratory', 'Richmond College', 'Southern', 'Galle', 'Galle', 32, 8, 67.00, 11.80, 'Mr. D. Wickramasinghe', '091-2234812', 4.70, '["Use labelled neutralization jars."]'),
  ('LAB-GLE-05', 'Richmond College Biology Laboratory', 'Richmond College', 'Southern', 'Galle', 'Galle', 30, 7, 64.00, 11.80, 'Mr. D. Wickramasinghe', '091-2234812', 4.70, '["Dispose of biological samples safely."]')
ON DUPLICATE KEY UPDATE
  name = VALUES(name), host_school = VALUES(host_school), zone_name = VALUES(zone_name),
  manager_name = VALUES(manager_name);

SET FOREIGN_KEY_CHECKS = 1;
