# 🏥 MedGuard – Zero Trust Healthcare Access Control System

## 📌 Project Overview

MedGuard is a secure, zero-trust healthcare access management system designed to protect sensitive patient information.

The system enforces:

- Role-Based Access Control (RBAC)
- Risk-Based Authentication
- Emergency “Break-Glass” Access
- Patient-Controlled Consent
- Tamper-Evident Audit Logging
- Security Monitoring Dashboard

This project focuses on healthcare data protection, accountability, and privacy-by-design principles.

---

# 🚀 Features

## 🔐 Secure Authentication
- JWT-based login
- Password hashing (bcrypt)
- Device tracking
- Risk scoring (Low / Medium / High)
- OTP verification for risky logins
- Session management

---

## 🛡 Role-Based Access Control (RBAC)

Supported roles:
- Admin
- Doctor
- Nurse
- Patient

Access is strictly controlled based on role and assignment.

---

## 👤 Patient Consent Management
- Patients can grant access to doctors
- Patients can revoke access anytime
- Time-limited consent support
- Consent validation before record access

---

## 🚨 Emergency Break-Glass Access
- Doctors can request emergency access
- Justification required
- Temporary access granted
- Auto-expiry
- Fully logged and flagged as high-risk

---

## 📜 Tamper-Evident Audit Logs
- All sensitive actions are logged
- Hash chaining for tamper detection
- Integrity verification endpoint
- No update/delete allowed on logs

---

## 📊 Security Monitoring Dashboard
- View high-risk logins
- Monitor emergency access usage
- Detect suspicious behavior
- Verify audit integrity

---

# 🏗 Tech Stack

## Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn-ui

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt

---

# 📂 Project Structure
```
medguard/
│
├── frontend/
│ ├── src/
│ └── ...
│
├── backend/
│ ├── config/
│ ├── routes/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── services/
│ └── server.js
│
└── README.md
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone <YOUR_GIT_URL>
cd medguard
```
2️⃣ Install Dependencies
Backend
```bash
cd backend
npm install
```
Frontend
```bash
cd frontend
npm install
```
3️⃣ Configure Environment Variables

Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
4️⃣ Run the Project
Start Backend
```bash
cd backend
npm run dev
```
Start Frontend
```bash
cd frontend
npm run dev
```

Frontend runs on:
```
http://localhost:5173
```
Backend runs on:
```
http://localhost:5000
```

🛡 Security Architecture Overview

Every protected request follows this pipeline:

JWT Authentication

Risk Evaluation

RBAC Check

Consent Validation

Emergency Override Check

Audit Logging

Zero Trust principle:

Never trust. Always verify.

📜 API Overview
Auth

POST /api/auth/login

Patient

GET /api/patient/:id

POST /api/patient/grant-consent

POST /api/patient/revoke-consent

POST /api/patient/emergency-access

Admin

GET /api/admin/logs

GET /api/admin/verify-logs

🏆 Innovation Highlights

Zero Trust Healthcare Architecture

Patient-Centric Privacy Model

Emergency Accountability Framework

Tamper-Evident Logging Without Blockchain

Context-Aware Risk Authentication

📌 Future Improvements

Biometric authentication

Blockchain anchoring for logs

AI-based anomaly detection

Hospital system integration

👥 Team

Built by a 3-member team for secure healthcare innovation.
