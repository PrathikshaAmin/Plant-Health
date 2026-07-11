# Plant Health Knowledge & Diagnosis System — Backend API

Backend service for the Plant Health mobile app and admin portal. Handles authentication,
disease/symptom/treatment data, the diagnosis rule engine, image uploads, and diagnosis history.

## Tech Stack
- Node.js + Express.js
- MongoDB (via Mongoose)
- JWT authentication

## Prerequisites
- Node.js (LTS) installed
- A MongoDB connection string (free tier via MongoDB Atlas works fine)

## Setup

1. Clone the repo and install dependencies:
   ```
   npm install
   ```

2. Copy the environment template and fill in real values:
   ```
   cp .env.example .env
   ```
   - `MONGO_URI` — your MongoDB connection string
   - `JWT_SECRET` — any long random string (used to sign login tokens)

3. Run the server in development mode (auto-restarts on file changes):
   ```
   npm run dev
   ```
   Or in standard mode:
   ```
   npm start
   ```

4. Confirm it's running by visiting `http://localhost:5000` — you should see a JSON
   message confirming the API is live.

## Project Structure
```
config/       Database connection setup
models/       Mongoose schemas (data shapes)
routes/       API endpoint definitions
controllers/  Business logic behind each route
middleware/   Auth checks, error handling, etc.
uploads/      Stored plant images
```

## Features Implemented So Far
- User registration and login with hashed passwords and JWT-based authentication
- Full MongoDB schema design for Users, Diseases, Symptoms, Treatments, Diagnosis Rules,
  Diagnosis History, and Uploaded Images

## Features In Progress
- Disease, Symptom, and Treatment management APIs
- Diagnosis rule engine
- Image upload handling
- Diagnosis history tracking
- Admin web portal
- Mobile application

## API Documentation
See `docs/API_DOCUMENTATION.md` for endpoint details.

## Database Documentation
See `docs/DATABASE_DOCUMENTATION.md` for schema details.
