import { mockSecurityStats, mockAnomalies, mockActiveSessions, mockAuditLogs } from "@/data/mockData";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { motion } from "framer-motion";
import { Activity, Shield, AlertTriangle, Users, Lock, TrendingUp, Eye } from "lucide-react";

export default function SecurityMonitorPage() {
  const highRiskLogs = mockAuditLogs.filter(l => l.riskLevel === 'high');

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          Security Monitoring Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time threat detection and system health</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Logins (24h)" value={mockSecurityStats.totalLogins} icon={Users} />
        <StatCard title="Failed Logins" value={mockSecurityStats.failedLogins} icon={Lock} variant="warning" />
        <StatCard title="High-Risk Events" value={mockSecurityStats.highRiskEvents} icon={AlertTriangle} variant="danger" />
        <StatCard title="Avg Risk Score" value={mockSecurityStats.averageRiskScore.toFixed(1)} icon={TrendingUp} variant="success" trend="Out of 10" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Anomaly Detection */}
        <div className="rounded-lg border border-destructive/20 bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Anomaly Detection
          </h2>
          <div className="space-y-3">
            {mockAnomalies.map(a => (
              <div key={a.id} className="rounded-lg border border-border bg-secondary/50 p-3">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{a.userName}</p>
                  <RiskBadge level={a.severity} />
                </div>
                <p className="text-xs text-muted-foreground">{a.description}</p>
                <p className="text-[10px] font-mono text-muted-foreground mt-1">{a.type} • {new Date(a.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* High Risk Events */}
        <div className="rounded-lg border border-border bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
            <Eye className="h-4 w-4 text-warning" />
            High-Risk Events
          </h2>
          <div className="space-y-3">
            {highRiskLogs.map(log => (
              <div key={log.id} className="rounded-lg border border-border bg-secondary/50 p-3">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{log.userName}</p>
                  <span className="text-[10px] font-mono text-muted-foreground">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">{log.action}</p>
                {log.justification && <p className="text-xs text-muted-foreground mt-1 italic">"{log.justification}"</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="rounded-lg border border-primary/20 bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
          <Shield className="h-4 w-4 text-primary" />
          System Security Status
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'Auth Service', status: 'Operational' },
            { label: 'RBAC Engine', status: 'Operational' },
            { label: 'Audit Logger', status: 'Operational' },
            { label: 'Hash Chain', status: 'Verified' },
          ].map(item => (
            <div key={item.label} className="rounded-lg border border-success/20 bg-success/5 p-3 text-center">
              <p className="text-xs text-muted-foreground">{item.label}</p>
              <p className="mt-1 text-sm font-semibold text-success">{item.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
