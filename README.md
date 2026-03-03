# 🏥 Secure Health Access
### Zero Trust Healthcare Access Control System
DEMO VIDEO URL: https://drive.google.com/file/d/1w55lgr78igkJ1_OdSUN1UzoG1nt01ENP/view?usp=sharing
PPT URL: https://docs.google.com/presentation/d/12DkXJIlsybgWVbG3SMItXwY0YV4iz5Bv/edit?usp=sharing&ouid=112183929649404340498&rtpof=true&sd=true

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
secure-health-access/
│
├── src/
│ ├── components/
│ ├── pages/
│ ├── services/
│ ├── hooks/
│ └── main.tsx
│
├── public/
├── package.json
├── vite.config.ts
└── README.md

---

# ⚙️ Installation & Setup

## 1️⃣ Clone the Repository

```bash
git clone "https://github.com/Nivethitha-A/secure-health-access"
```
2️⃣ Install Dependencies
```
npm install
```
3️⃣ Configure Environment Variables

Create a .env file in the root directory:
```
VITE_DATABASE_URL=your_database_url
VITE_API_KEY=your_api_key
```

4️⃣ Run Development Server
```
npm run dev
```

The application will run at:
```
http://localhost:5173
```
## 🔐 Security Architecture

Every protected action follows the Zero Trust model:

Authentication verification

Risk evaluation

Role-based access check

Consent validation

Emergency override validation

Audit logging

Principle:

Never trust. Always verify.

📜 API Overview
Authentication

Login

Session validation

Patient

View patient record

Grant consent

Revoke consent

Emergency access request

Admin

View audit logs

Verify log integrity

Monitor suspicious activity

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
