# 🏥 Secure Health Access
### Zero Trust Healthcare Access Control System

---

## 📌 Overview

Secure Health Access is a Zero Trust-based healthcare security platform designed to protect sensitive patient information through strict access control, risk-based authentication, and tamper-evident logging.

The system ensures:

- 🔐 Secure authentication
- 🛡 Role-Based Access Control (RBAC)
- 🚨 Emergency "Break-Glass" access
- 👤 Patient-controlled consent
- 📜 Tamper-evident audit logs
- 📊 Security monitoring dashboard

This project was built to demonstrate modern healthcare cybersecurity principles.

---

## 🚀 Key Features

### 🔐 Authentication & Risk Control
- Secure login system
- Risk-based authentication
- Device tracking
- Session validation

---

### 🛡 Role-Based Access Control (RBAC)

Supported roles:
- Admin
- Doctor
- Nurse
- Patient

Access to patient data is strictly controlled based on role and assignment.

---

### 👤 Patient Consent System
- Patients can grant doctor access
- Patients can revoke access anytime
- Time-limited consent permissions
- Consent validation before record access

---

### 🚨 Emergency Access (Break-Glass)
- Doctor must provide justification
- Temporary access granted
- Automatically expires
- Fully logged as high-risk activity

---

### 📜 Tamper-Evident Audit Logging
- All sensitive actions are logged
- Log hash chaining for integrity
- Audit verification system
- No modification allowed on logs

---

### 📊 Admin Security Dashboard
- Monitor high-risk logins
- Track emergency access
- View suspicious activity
- Verify audit integrity

---

## 🏗 Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend / Database
- PostgreSQL
- PLpgSQL (for database-level logic)

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
git clone "https://github.com/Nivethitha-A/secure-health-access"
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
