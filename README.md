# Lab Connect — Sri Lanka School Laboratory Resource Sharing System

A responsive full-stack web application built with **React**, **Tailwind CSS**, and **Express.js** to support the **Ministry of Education Sri Lanka** initiative connecting rural schools with laboratory facilities in urban 1AB host schools.

## Architecture Overview
- **Frontend (`/frontend`)**: React 18 + Tailwind CSS + Lucide Icons. Includes 19 desktop screens, 4 mobile view adaptations, and 3 supporting modals/drawers across Science Teacher, Host School Lab Manager, and System Administrator workspaces.
- **Backend (`/backend`)**: Node.js + Express.js REST API providing endpoints for laboratory search, booking coordination, attendance verification, equipment inventory, damage incident reporting, school verification, and national utilization analytics.

## Quick Start

### 0. Create the MySQL database
1. Start **WampServer** and make sure the MySQL service is running.
2. Open `http://localhost/phpmyadmin`.
3. If this is a fresh database, import [`backend/data/auth-schema.sql`](./backend/data/auth-schema.sql).
4. If `lab_connect` already contains the old `users` or `schools` tables, first import [`backend/data/migrate-legacy.sql`](./backend/data/migrate-legacy.sql), then import [`backend/data/auth-schema.sql`](./backend/data/auth-schema.sql). The migration renames old tables to `legacy_users` and `legacy_schools`; it does not delete them.
5. Copy [`backend/.env.example`](./backend/.env.example) to `backend/.env` and set your local MySQL values. WampServer commonly uses `root` with an empty password.

### 1. Run Express.js API Server
```bash
cd backend
npm install
npm run dev
# Server runs at http://localhost:5000
```

The API now uses MySQL through a connection pool in [`backend/db.js`](./backend/db.js). It does not use the old in-memory seed store. Never commit `backend/.env`.

### 2. Run React + Tailwind Frontend
```bash
cd frontend
npm install
npm run dev
# App runs at http://localhost:5173
```

## REST API Endpoints Summary
- `GET /api/health` — Service health & Ministry metadata
- `POST /api/auth/signup` — Create a user account; System Admin requires secret code `111111`
- `POST /api/auth/login` — Authenticate an active user by email, password, and role
- `GET /api/labs` — Filter laboratories by province, subject, equipment, or keyword
- `PUT /api/labs/:id/profile` — Update host laboratory profile, operating slots, and safety rules
- `GET /api/bookings` — Retrieve booking requests across rural and host schools
- `POST /api/bookings` — Submit a new laboratory booking request from a rural school
- `PATCH /api/bookings/:id/status` — Approve, reschedule, reject, or verify student attendance
- `POST /api/sessions` — Record completed practical sessions and syllabus hours
- `POST /api/damage-reports` — Log equipment breakage or bench incident reports
- `PATCH /api/equipment/:id` — Adjust equipment stock, calibration status, or maintenance flag
- `PATCH /api/schools/:id/verify` — Verify rural/host school registration via MoE Census ID
- `GET /api/audit-logs` — Inspect immutable national system activity logs
