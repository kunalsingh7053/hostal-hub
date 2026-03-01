# Hostel Hub

A full-stack hostel management web app built for a college student’s final-year presentation. This is my second client website delivery, designed to demonstrate modern product polish while staying simple to run for evaluation.

## What it does
- Unified dashboards for admin, wardens, and students
- Role-based authentication and protected routes
- Room allocation and listings
- Attendance tracking for students and wardens
- Complaint submission and resolution workflow
- Notices and daily menu publishing
- Profile overviews (read-only) per role

## Tech stack
- **Frontend:** React + Vite, Tailwind-style utility classes
- **State/Auth:** React Context, protected & role routes
- **HTTP:** Axios with bearer token interceptor
- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Auth:** JWT with role claims and middleware guards

## Project structure
```
backend/    Express API, routes, controllers, models
frontend/   React UI, layouts, pages, components, hooks
```

## Running locally
1) Install dependencies
```
cd backend && npm install
cd ../frontend && npm install
```

2) Set environment variables
- Backend: create a `.env` inside `backend` with `MONGO_URI` and `JWT_SECRET`.
- Frontend: set `VITE_API_URL` in `frontend/.env` (defaults to `http://localhost:3000/api`).

3) Start the servers (in two terminals)
```
# backend
cd backend
npm run dev

# frontend
cd frontend
npm run dev
```
Frontend runs on Vite’s dev server (default 5173); backend defaults to 3000.

## API highlights
- `POST /api/student/auth/login` – student login
- `POST /api/warden/auth/login` – warden login
- `POST /api/admin/login` – admin login
- `GET /api/students/me` – student profile (read-only)
- `GET /api/warden/me` – warden profile (read-only)
- `GET /api/admin/me` – admin profile (read-only)
- `GET /api/rooms` – list rooms
- `GET /api/complaints` and `POST /api/complaints` – complaints flow

## Production notes
- JWT is stored client-side; the Axios interceptor attaches it automatically.
- CORS is enabled on the API; adjust for your deployment origin.
- Approval gates: new users/wardens stay pending until an admin approves.

## Presentation tips
- Start by logging in as admin to showcase approvals, notices, and menu updates.
- Switch to warden to demonstrate attendance and complaints triage.
- End with student view for room assignment, attendance, and submitting a complaint.

## Author & context
This repository is delivered as my second client website. The client is a college student needing a polished, defendable project for a final-year presentation. Built to be clear, maintainable, and easy to demo.
