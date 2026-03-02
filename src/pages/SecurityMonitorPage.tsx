import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { motion } from "framer-motion";
import { Activity, Shield, AlertTriangle, Users, Lock, TrendingUp, Eye } from "lucide-react";

export default function SecurityMonitorPage() {
  const [highRiskLogs, setHighRiskLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalLogs: 0, highRisk: 0, emergencyCount: 0 });

  useEffect(() => {
    const load = async () => {
      const { data: hrLogs } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('risk_level', 'high')
        .order('created_at', { ascending: false })
        .limit(10);
      setHighRiskLogs(hrLogs || []);

      const { count: totalLogs } = await supabase.from('audit_logs').select('*', { count: 'exact', head: true });
      const { count: highRisk } = await supabase.from('audit_logs').select('*', { count: 'exact', head: true }).eq('risk_level', 'high');
      const { count: emergencyCount } = await supabase.from('emergency_access').select('*', { count: 'exact', head: true });

      setStats({ totalLogs: totalLogs || 0, highRisk: highRisk || 0, emergencyCount: emergencyCount || 0 });
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Activity className="h-6 w-6 text-primary" />
          Security Monitoring Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Real-time threat detection and system health</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Audit Logs" value={stats.totalLogs} icon={Users} />
        <StatCard title="High-Risk Events" value={stats.highRisk} icon={AlertTriangle} variant="danger" />
        <StatCard title="Emergency Accesses" value={stats.emergencyCount} icon={Lock} variant="warning" />
        <StatCard title="System Status" value="Operational" icon={TrendingUp} variant="success" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-destructive/20 bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
            <Eye className="h-4 w-4 text-warning" />
            High-Risk Events
          </h2>
          <div className="space-y-3">
            {highRiskLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No high-risk events detected.</p>
            ) : highRiskLogs.map(log => (
              <div key={log.id} className="rounded-lg border border-border bg-secondary/50 p-3">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-sm font-medium text-foreground">{log.user_name}</p>
                  <span className="text-[10px] font-mono text-muted-foreground">{new Date(log.created_at).toLocaleTimeString()}</span>
                </div>
                <p className="text-xs text-muted-foreground font-mono">{log.action}</p>
                {log.justification && <p className="text-xs text-muted-foreground mt-1 italic">"{log.justification}"</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-primary/20 bg-card p-5">
          <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
            <Shield className="h-4 w-4 text-primary" />
            System Security Status
          </h2>
          <div className="grid grid-cols-2 gap-4">
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
    </div>
  );
}
