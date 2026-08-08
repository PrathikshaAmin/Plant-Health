# Plant Health Knowledge & Diagnosis System

A full-stack system for diagnosing plant diseases: a mobile app for end
users, an admin portal for managing reference data, and a shared backend
API with a rule-based diagnosis engine.

## Project Structure
```
backend/        Node.js + Express + MongoDB API
mobile-app/     Expo / React Native app
admin-portal/   React + Vite admin web app
docs/           API and database documentation, dataset sources
```

## Tech Stack
- **Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT authentication
- **Mobile App:** Expo / React Native
- **Admin Portal:** React, Vite, Tailwind CSS

## Features
- User registration and login (by email or mobile number), with hashed
  passwords and JWT-based authentication
- Single-admin-account access control for the admin portal, enforced
  server-side
- Disease, Symptom, Treatment, and Diagnosis Rule management (full CRUD)
  via the admin portal
- Rule-based diagnosis engine — matches user-selected symptoms against
  admin-managed rules in the database; nothing about the matching logic
  is hardcoded
- Plant image upload (camera or gallery) with per-user storage
- Diagnosis history tracking per user
- Reference data seeded from real sources (PlantVillage / Kaggle's New
  Plant Diseases Dataset) — see `docs/DATASET_SOURCES.md`

---

## Setup — Backend

**Prerequisites:** Node.js (LTS), a MongoDB connection string (MongoDB
Atlas free tier works fine).

1. ```
   cd backend
   npm install
   ```

2. Copy the environment template and fill in real values:
   ```
   cp .env.example .env
   ```
   - `MONGO_URI` — your MongoDB connection string
   - `JWT_SECRET` — any long random string (used to sign login tokens)
   - `JWT_EXPIRES_IN` — how long tokens stay valid (e.g. `7d`)

3. Run the server:
   ```
   npm run dev
   ```
   (auto-restarts on file changes) or `npm start`.

4. Confirm it's running at `http://localhost:5000` — you should see a
   JSON message confirming the API is live.

5. **Seed sample data** (diseases, symptoms, treatments, diagnosis rules —
   sourced from real datasets, see `docs/DATASET_SOURCES.md`):
   ```
   npm run seed
   ```
   Safe to re-run any time — wipes and reloads those four collections
   only, never touches Users.

6. **Create your admin account** (required before the admin portal will
   let anyone log in):
   ```
   node createAdmin.js <email> <password> <name> <mobileNumber>
   ```
   If that email is already registered (e.g. through the mobile app),
   this promotes it to admin and resets its password to the one you
   pass in — drop the name/mobileNumber args in that case.

**Backend project structure:**
```
config/       Database connection setup
models/       Mongoose schemas (data shapes)
routes/       API endpoint definitions
controllers/  Business logic behind each route
middleware/   JWT auth checks (protect, requireAdmin)
uploads/      Stored plant images
seed.js       Loads sample disease/symptom/treatment/rule data
createAdmin.js  Creates or promotes the single admin account
```

---

## Setup — Admin Portal

**Prerequisites:** Node.js (LTS), backend running on `http://localhost:5000`.

1. ```
   cd admin-portal
   npm install
   npm run dev
   ```
   Vite prints a local URL (typically `http://localhost:5173`) — open it
   in your browser.

2. Log in at `/login` with the admin account you created in the backend
   setup above. Only that one account can access this portal — accounts
   registered through the mobile app are rejected here.

**Admin portal project structure:**
```
src/pages/       Login, Dashboard, and CRUD pages (Diseases, Symptoms, Treatments, Rules)
src/api.js       Shared axios instance — attaches your admin token to every request,
                 and redirects to /login automatically if the token expires
src/components/  Shared UI (Navbar, etc.)
```

---

## Setup — Mobile App

**Prerequisites:** Node.js (LTS), Expo Go app on your phone (or an
Android/iOS emulator), backend running and reachable on your network.

1. ```
   cd mobile-app
   npm install
   ```

2. Point the app at your backend. Open `config.ts` and set `API_URL` to
   your computer's local network IP (not `localhost` — your phone can't
   reach that):
   ```ts
   export const API_URL = "http://<your-computer-ip>:5000/api";
   ```
   Find your IP with `ipconfig` (Windows) or `ifconfig`/`ip addr`
   (Mac/Linux) — use the IPv4 address on your WiFi adapter. **Your phone
   and computer must be on the same WiFi network.**

3. ```
   npx expo start
   ```
   Then scan the QR code with Expo Go, or press `a`/`i` for an emulator.

4. Register a new account from the app, or log in with an existing one
   (email or mobile number both work).

**Mobile app project structure:**
```
app/            Screens (file-based routing — each file is a route)
utils/api.ts    Shared axios instance — attaches your login token to every request
config.ts       Backend API_URL configuration
```

---

## Documentation
- [`docs/API_DOCUMENTATION.md`](docs/API_DOCUMENTATION.md) — every
  endpoint, request/response examples, auth requirements
- [`docs/DATABASE_DOCUMENTATION.md`](docs/DATABASE_DOCUMENTATION.md) —
  schema details
- [`docs/DATASET_SOURCES.md`](docs/DATASET_SOURCES.md) — where the seeded
  reference data comes from