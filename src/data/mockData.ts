// Mock data for the MedGuard system

export const mockAuditLogs = [
  { id: '1', userId: '2', userName: 'Dr. James Wilson', role: 'doctor', action: 'VIEW_RECORD', patientId: 'P001', patientName: 'Alice Brown', riskLevel: 'low' as const, timestamp: '2026-02-25T08:30:00Z', ip: '192.168.1.45', deviceId: 'DEV-001', previousHash: '0000', currentHash: 'a3f2b1' },
  { id: '2', userId: '2', userName: 'Dr. James Wilson', role: 'doctor', action: 'EMERGENCY_ACCESS', patientId: 'P003', patientName: 'Carlos Mendez', riskLevel: 'high' as const, justification: 'Patient in cardiac arrest, need immediate access to medication history', timestamp: '2026-02-25T09:15:00Z', ip: '192.168.1.45', deviceId: 'DEV-001', previousHash: 'a3f2b1', currentHash: 'b7d4e2' },
  { id: '3', userId: '3', userName: 'Emily Rodriguez', role: 'nurse', action: 'VIEW_VITALS', patientId: 'P001', patientName: 'Alice Brown', riskLevel: 'low' as const, timestamp: '2026-02-25T09:45:00Z', ip: '192.168.1.52', deviceId: 'DEV-003', previousHash: 'b7d4e2', currentHash: 'c9e5f3' },
  { id: '4', userId: '1', userName: 'Sarah Chen', role: 'admin', action: 'USER_CREATED', patientId: null, patientName: null, riskLevel: 'low' as const, timestamp: '2026-02-25T10:00:00Z', ip: '192.168.1.10', deviceId: 'DEV-005', previousHash: 'c9e5f3', currentHash: 'd1f6a4' },
  { id: '5', userId: '2', userName: 'Dr. James Wilson', role: 'doctor', action: 'UPDATE_PRESCRIPTION', patientId: 'P002', patientName: 'Bob Davis', riskLevel: 'medium' as const, timestamp: '2026-02-25T10:30:00Z', ip: '10.0.0.5', deviceId: 'DEV-007', previousHash: 'd1f6a4', currentHash: 'e2a7b5' },
  { id: '6', userId: '2', userName: 'Dr. James Wilson', role: 'doctor', action: 'VIEW_RECORD', patientId: 'P004', patientName: 'Diana Foster', riskLevel: 'low' as const, timestamp: '2026-02-25T11:00:00Z', ip: '192.168.1.45', deviceId: 'DEV-001', previousHash: 'e2a7b5', currentHash: 'f3b8c6' },
  { id: '7', userId: '5', userName: 'Dr. Mark Stevens', role: 'doctor', action: 'LOGIN_FAILED', patientId: null, patientName: null, riskLevel: 'high' as const, timestamp: '2026-02-25T11:15:00Z', ip: '203.0.113.42', deviceId: 'UNKNOWN', previousHash: 'f3b8c6', currentHash: 'g4c9d7' },
  { id: '8', userId: '4', userName: 'Michael Thompson', role: 'patient', action: 'REVOKE_CONSENT', patientId: 'P005', patientName: 'Michael Thompson', riskLevel: 'low' as const, timestamp: '2026-02-25T11:30:00Z', ip: '192.168.1.100', deviceId: 'DEV-010', previousHash: 'g4c9d7', currentHash: 'h5d0e8' },
];

export const mockConsents = [
  { id: 'C1', doctorId: '2', doctorName: 'Dr. James Wilson', patientId: '4', status: 'active' as const, expiryDate: '2026-06-01', createdAt: '2026-01-15', specialty: 'Cardiology' },
  { id: 'C2', doctorId: '6', doctorName: 'Dr. Lisa Park', patientId: '4', status: 'active' as const, expiryDate: '2026-04-15', createdAt: '2026-02-01', specialty: 'Neurology' },
  { id: 'C3', doctorId: '7', doctorName: 'Dr. Robert Kim', patientId: '4', status: 'revoked' as const, expiryDate: '2026-03-01', createdAt: '2025-12-10', specialty: 'Orthopedics' },
  { id: 'C4', doctorId: '8', doctorName: 'Dr. Anna Schmidt', patientId: '4', status: 'expired' as const, expiryDate: '2026-02-01', createdAt: '2025-11-01', specialty: 'Dermatology' },
];

export const mockEmergencyAccess = [
  { id: 'E1', doctorId: '2', doctorName: 'Dr. James Wilson', patientId: 'P003', patientName: 'Carlos Mendez', justification: 'Patient in cardiac arrest, need immediate access to medication history', startTime: '2026-02-25T09:15:00Z', expiryTime: '2026-02-25T09:45:00Z', status: 'expired' as const },
  { id: 'E2', doctorId: '6', doctorName: 'Dr. Lisa Park', patientId: 'P007', patientName: 'Grace Lee', justification: 'Severe allergic reaction, need allergy history urgently', startTime: '2026-02-25T14:00:00Z', expiryTime: '2026-02-25T14:30:00Z', status: 'active' as const },
];

export const mockSecurityStats = {
  totalLogins: 342,
  failedLogins: 18,
  emergencyAccesses: 5,
  highRiskEvents: 12,
  activeSessions: 47,
  anomaliesDetected: 3,
  averageRiskScore: 2.1,
  consentRevocations: 8,
};

export const mockAnomalies = [
  { id: 'A1', type: 'EXCESSIVE_ACCESS', userId: '9', userName: 'Dr. Unknown', description: 'Accessed 15 patient records in 4 minutes', timestamp: '2026-02-25T13:00:00Z', severity: 'high' as const },
  { id: 'A2', type: 'OFF_HOURS_ACCESS', userId: '2', userName: 'Dr. James Wilson', description: 'Login attempt at 3:42 AM outside hospital hours', timestamp: '2026-02-25T03:42:00Z', severity: 'medium' as const },
  { id: 'A3', type: 'REPEATED_EMERGENCY', userId: '6', userName: 'Dr. Lisa Park', description: '3 emergency overrides in 24 hours', timestamp: '2026-02-25T14:00:00Z', severity: 'high' as const },
];

export const mockActiveSessions = [
  { id: 'S1', userName: 'Dr. James Wilson', role: 'doctor', ip: '192.168.1.45', device: 'Chrome / macOS', loginTime: '2026-02-25T08:00:00Z', riskLevel: 'low' as const },
  { id: 'S2', userName: 'Emily Rodriguez', role: 'nurse', ip: '192.168.1.52', device: 'Firefox / Windows', loginTime: '2026-02-25T08:30:00Z', riskLevel: 'low' as const },
  { id: 'S3', userName: 'Dr. Lisa Park', role: 'doctor', ip: '10.0.0.15', device: 'Safari / iPad', loginTime: '2026-02-25T09:00:00Z', riskLevel: 'medium' as const },
  { id: 'S4', userName: 'Michael Thompson', role: 'patient', ip: '192.168.1.100', device: 'Chrome / Android', loginTime: '2026-02-25T10:00:00Z', riskLevel: 'low' as const },
];
