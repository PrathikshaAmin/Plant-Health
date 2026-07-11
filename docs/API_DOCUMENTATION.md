# API Documentation — Plant Health Diagnosis System

Base URL (local development): `http://localhost:5000/api`

---

## Authentication

### Register User
**POST** `/auth/register`

Request Body:
```json
{
  "name": "Test User",
  "mobileNumber": "9876543210",
  "email": "test@example.com",
  "password": "password123"
}
```

Success Response — `201 Created`:
```json
{
  "_id": "665f1234abcd5678ef901234",
  "name": "Test User",
  "email": "test@example.com",
  "mobileNumber": "9876543210",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Error Responses:
- `400` — missing required fields, or user already exists with this email

---

### Login User
**POST** `/auth/login`

Request Body:
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

Success Response — `200 OK`:
```json
{
  "_id": "665f1234abcd5678ef901234",
  "name": "Test User",
  "email": "test@example.com",
  "mobileNumber": "9876543210",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Error Responses:
- `400` — missing email or password
- `401` — invalid email or password

---

## Notes
- Passwords are hashed using bcrypt before storage; plain-text passwords are never stored or returned.
- The `token` returned on register/login is a JWT and should be included in the `Authorization` header (`Bearer <token>`) for future protected routes.

## Coming Soon
- Disease Management endpoints
- Symptom Management endpoints
- Treatment Management endpoints
- Diagnosis Engine endpoints
- Image Upload endpoints
- Diagnosis History endpoints
