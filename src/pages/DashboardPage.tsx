import { useAuth } from "@/contexts/AuthContext";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { mockAuditLogs, mockSecurityStats, mockAnomalies, mockActiveSessions } from "@/data/mockData";
import { motion } from "framer-motion";
import {
  Shield, Users, AlertTriangle, Activity, FileText,
  HeartHandshake, Clock, Eye, Lock
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  if (!user) return null;

  const recentLogs = mockAuditLogs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, <span className="text-gradient">{user.name.split(' ')[0]}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {user.role === 'admin' && 'System security overview and monitoring'}
          {user.role === 'doctor' && 'Your patient access and activity summary'}
          {user.role === 'nurse' && 'Your assigned patients and vitals overview'}
          {user.role === 'patient' && 'Your health records and access history'}
        </p>
      </motion.div>

      {/* Admin Stats */}
      {user.role === 'admin' && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Active Sessions" value={mockSecurityStats.activeSessions} icon={Users} variant="default" />
            <StatCard title="Failed Logins" value={mockSecurityStats.failedLogins} icon={Lock} variant="warning" trend="Last 24h" />
            <StatCard title="Emergency Accesses" value={mockSecurityStats.emergencyAccesses} icon={AlertTriangle} variant="danger" trend="Last 7 days" />
            <StatCard title="Anomalies Detected" value={mockSecurityStats.anomaliesDetected} icon={Activity} variant="danger" />
          </div>

          {/* Anomalies */}
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Active Anomalies
            </h2>
            <div className="space-y-3">
              {mockAnomalies.map(a => (
                <div key={a.id} className="flex items-start justify-between rounded-lg border border-border bg-secondary/50 p-3">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">{a.userName}</p>
                    <p className="text-xs text-muted-foreground">{a.description}</p>
                    <p className="text-xs text-muted-foreground font-mono">{new Date(a.timestamp).toLocaleString()}</p>
                  </div>
                  <RiskBadge level={a.severity} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Doctor Dashboard */}
      {user.role === 'doctor' && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Assigned Patients" value={12} icon={Users} />
            <StatCard title="Records Accessed Today" value={5} icon={Eye} />
            <StatCard title="Active Consents" value={8} icon={HeartHandshake} variant="success" />
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
              <Clock className="h-4 w-4 text-primary" />
              Recent Activity
            </h2>
            <div className="space-y-2">
              {recentLogs.filter(l => l.role === 'doctor').map(log => (
                <div key={log.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{log.action.replace(/_/g, ' ')}</p>
                    {log.patientName && <p className="text-xs text-muted-foreground">Patient: {log.patientName}</p>}
                  </div>
                  <div className="flex items-center gap-3">
                    <RiskBadge level={log.riskLevel} />
                    <span className="text-xs text-muted-foreground font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Patient Dashboard */}
      {user.role === 'patient' && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Active Consents" value={2} icon={HeartHandshake} variant="success" />
            <StatCard title="Record Accesses" value={7} icon={Eye} trend="Last 30 days" />
            <StatCard title="Security Score" value="A+" icon={Shield} variant="success" />
          </div>
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-5">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-destructive">
              <AlertTriangle className="h-4 w-4" />
              Emergency Access Alert
            </h2>
            <p className="text-sm text-foreground">
              Dr. James Wilson accessed your records via emergency override on Feb 25, 2026 at 9:15 AM.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Justification: "Patient in cardiac arrest, need immediate access to medication history"
            </p>
          </div>
        </>
      )}

      {/* Nurse Dashboard */}
      {user.role === 'nurse' && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <StatCard title="Assigned Patients" value={8} icon={Users} />
            <StatCard title="Vitals Checked Today" value={15} icon={Activity} variant="success" />
            <StatCard title="Pending Tasks" value={3} icon={FileText} variant="warning" />
          </div>
        </>
      )}

      {/* Active Sessions for admin */}
      {user.role === 'admin' && (
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
            <Users className="h-4 w-4 text-primary" />
            Active Sessions
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 font-medium text-muted-foreground">User</th>
                  <th className="pb-3 font-medium text-muted-foreground">Role</th>
                  <th className="pb-3 font-medium text-muted-foreground">Device</th>
                  <th className="pb-3 font-medium text-muted-foreground">IP</th>
                  <th className="pb-3 font-medium text-muted-foreground">Risk</th>
                </tr>
              </thead>
              <tbody>
                {mockActiveSessions.map(s => (
                  <tr key={s.id} className="border-b border-border/50">
                    <td className="py-3 font-medium text-foreground">{s.userName}</td>
                    <td className="py-3 capitalize text-muted-foreground">{s.role}</td>
                    <td className="py-3 text-muted-foreground font-mono text-xs">{s.device}</td>
                    <td className="py-3 text-muted-foreground font-mono text-xs">{s.ip}</td>
                    <td className="py-3"><RiskBadge level={s.riskLevel} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
