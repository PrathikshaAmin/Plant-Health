# API Documentation — Plant Health Diagnosis System

Base URL (local development): `http://localhost:5000/api`

## Authentication

Most write operations and all user-specific data (history, images, diagnosis)
require a JWT. Register or log in to get a `token`, then send it on every
protected request as a header:

```
Authorization: Bearer <token>
```

Routes marked **Public** need no token. Routes marked **Protected** need any
valid logged-in user's token. Routes marked **Admin only** need a token
belonging to a user with `isAdmin: true` (see `backend/createAdmin.js`).

---

## Auth

### Register
**POST** `/auth/register` — Public

Request Body:
```json
{
  "name": "Test User",
  "mobileNumber": "9876543210",
  "email": "test@example.com",
  "password": "password123"
}
```

Success — `201 Created`:
```json
{
  "_id": "665f1234abcd5678ef901234",
  "name": "Test User",
  "email": "test@example.com",
  "mobileNumber": "9876543210",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Errors: `400` missing fields, email already registered, or mobile number already registered.

---

### Login
**POST** `/auth/login` — Public

Accepts either `email` or `mobileNumber` (send whichever the user typed):
```json
{ "email": "test@example.com", "password": "password123" }
```
or
```json
{ "mobileNumber": "9876543210", "password": "password123" }
```

Success — `200 OK`: same shape as Register's response.

Errors: `400` missing identifier/password, `401` invalid credentials.

---

### Admin Login
**POST** `/auth/admin-login` — Public (but only succeeds for admin accounts)

```json
{ "email": "admin@planthealth.com", "password": "yourpassword" }
```

Success — `200 OK`:
```json
{
  "_id": "665f1234abcd5678ef901234",
  "name": "Admin",
  "email": "admin@planthealth.com",
  "isAdmin": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Errors: `401` invalid credentials, `403` account exists but isn't an admin.

---

### Forgot Password
**POST** `/auth/forgot-password` — Public
```json
{ "email": "test@example.com" }
```
Generates a reset token for the account (delivery mechanism is up to you — e.g. email it out).

### Reset Password
**POST** `/auth/reset-password` — Public
```json
{ "token": "reset-token-from-forgot-password-step", "newPassword": "newPassword123" }
```
Errors: `400` invalid or expired token.

---

## Diseases

### Get Diseases
**GET** `/diseases` — Public

Query params (all optional): `search` (matches disease name or symptoms text), `category`, `affectedArea`.

```
GET /diseases?search=blight&category=Fungal&affectedArea=Leaf
```

Success — `200 OK`: array of disease objects.

### Get Disease by ID
**GET** `/diseases/:id` — Public

### Create Disease
**POST** `/diseases` — Admin only
```json
{
  "diseaseName": "Tomato Early Blight",
  "scientificName": "Alternaria solani",
  "category": "Fungal",
  "affectedArea": ["Leaf", "Stem"],
  "description": "...",
  "symptoms": "...",
  "causes": "...",
  "preventionMethods": "..."
}
```
Success — `201 Created`: the created disease.

### Update Disease
**PUT** `/diseases/:id` — Admin only — same body shape, partial updates allowed.

### Delete Disease
**DELETE** `/diseases/:id` — Admin only

---

## Symptoms

### Get Symptoms
**GET** `/symptoms` — Public — optional `?affectedArea=Leaf`

### Get Symptom by ID
**GET** `/symptoms/:id` — Public

### Create Symptom
**POST** `/symptoms` — Admin only
```json
{ "symptomName": "Yellowing", "description": "...", "affectedArea": "Leaf" }
```

### Update Symptom
**PUT** `/symptoms/:id` — Admin only

### Delete Symptom
**DELETE** `/symptoms/:id` — Admin only

---

## Treatments

### Get Treatments
**GET** `/treatments` — Public — optional `?disease=<diseaseId>&category=Chemical`

### Get Treatment by ID
**GET** `/treatments/:id` — Public

### Create Treatment
**POST** `/treatments` — Admin only
```json
{
  "treatmentName": "Copper Spray",
  "category": "Organic",
  "description": "...",
  "dosage": "As per label",
  "applicationMethod": "Foliar spray",
  "immediateActions": "Isolate affected plant, remove infected leaves",
  "additionalNotes": "...",
  "disease": "<diseaseId>"
}
```
`category` must be one of `Chemical`, `Organic`, `Biological`.

### Update Treatment
**PUT** `/treatments/:id` — Admin only

### Delete Treatment
**DELETE** `/treatments/:id` — Admin only

---

## Diagnosis Rules

Used internally by the diagnosis engine — admins manage these so the matcher
has data to work with; nothing about the matching logic itself is hardcoded.

### Get Rules
**GET** `/diagnosis-rules` — Public — optional `?affectedArea=Leaf&severity=Medium`

### Get Rule by ID
**GET** `/diagnosis-rules/:id` — Public

### Create Rule
**POST** `/diagnosis-rules` — Admin only
```json
{
  "affectedArea": "Leaf",
  "symptoms": ["<symptomId1>", "<symptomId2>"],
  "severity": "Medium",
  "disease": "<diseaseId>",
  "matchScore": 80
}
```

### Update Rule
**PUT** `/diagnosis-rules/:id` — Admin only

### Delete Rule
**DELETE** `/diagnosis-rules/:id` — Admin only

---

## Diagnosis

### Run Diagnosis Match
**POST** `/diagnosis/match` — Protected

```json
{
  "affectedArea": "Leaf",
  "symptoms": ["<symptomId1>", "<symptomId2>"],
  "severity": "Medium"
}
```

Scores every stored rule for the given `affectedArea` against the symptoms
you selected (weighted by how much overlap there is, and whether severity
matches), and returns the best match.

Success — `200 OK`:
```json
{
  "disease": { "_id": "...", "diseaseName": "Tomato Early Blight", "...": "..." },
  "matchScore": 80,
  "severity": "Medium",
  "affectedArea": "Leaf"
}
```

Errors: `400` missing fields, `404` no matching diagnosis found.

---

## History

### Save Diagnosis to History
**POST** `/history` — Protected

The owner is taken from your token — don't send a `user` field.
```json
{
  "symptomsSelected": ["<symptomId1>", "<symptomId2>"],
  "affectedArea": "Leaf",
  "severity": "Medium",
  "suggestedDisease": "<diseaseId>",
  "matchScore": 80
}
```
Success — `201 Created`: the saved history entry.

### Get User History
**GET** `/history/user/:userId` — Protected

`:userId` must match the logged-in user's own ID (from the token) — otherwise `403`.

Success — `200 OK`: array of history entries, most recent first, with
`symptomsSelected` and `suggestedDisease` populated.

---

## Images

### Upload Image
**POST** `/images/upload` — Protected

`multipart/form-data` body:
- `image` (file, required) — JPG or PNG, max 10MB
- `relatedDiagnosis` (string, optional) — a history entry's `_id`

The owner is taken from your token — don't send a `userId` field.

Success — `201 Created`: the saved image record (`imageUrl` is served from `/uploads/<filename>`).

Errors: `400` no file provided, or wrong file type.

### Get User Images
**GET** `/images/user/:userId` — Protected

`:userId` must match the logged-in user's own ID — otherwise `403`.

Success — `200 OK`: array of image records.

---

## Notes

- Passwords are hashed with bcrypt before storage; plain-text passwords are never stored or returned.
- The `token` returned on register/login/admin-login is a JWT (default expiry: see `JWT_EXPIRES_IN` in `.env`).
- GET routes on Diseases/Symptoms/Treatments/Diagnosis Rules are intentionally public so the mobile app can browse the library before/without logging in.
- All error responses follow the shape `{ "message": "..." }`, sometimes with an added `"error"` field for the underlying exception message.