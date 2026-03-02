import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { StatCard } from "@/components/StatCard";
import { RiskBadge } from "@/components/RiskBadge";
import { motion } from "framer-motion";
import {
  Shield, Users, AlertTriangle, Activity, FileText,
  HeartHandshake, Clock, Eye, Lock
} from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const [recentLogs, setRecentLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalLogs: 0, highRisk: 0, emergencyCount: 0, consentCount: 0 });

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      // Load recent audit logs (for the user or all if admin)
      const { data: logs } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentLogs(logs || []);

      // Load stats
      const { count: totalLogs } = await supabase.from('audit_logs').select('*', { count: 'exact', head: true });
      const { count: highRisk } = await supabase.from('audit_logs').select('*', { count: 'exact', head: true }).eq('risk_level', 'high');
      const { count: emergencyCount } = await supabase.from('emergency_access').select('*', { count: 'exact', head: true });
      const { count: consentCount } = await supabase.from('patient_consents').select('*', { count: 'exact', head: true }).eq('status', 'active');

      setStats({
        totalLogs: totalLogs || 0,
        highRisk: highRisk || 0,
        emergencyCount: emergencyCount || 0,
        consentCount: consentCount || 0,
      });
    };

    loadData();
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
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

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Audit Logs" value={stats.totalLogs} icon={FileText} />
        <StatCard title="High-Risk Events" value={stats.highRisk} icon={AlertTriangle} variant="danger" />
        <StatCard title="Emergency Accesses" value={stats.emergencyCount} icon={Activity} variant="warning" />
        <StatCard title="Active Consents" value={stats.consentCount} icon={HeartHandshake} variant="success" />
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-foreground">
          <Clock className="h-4 w-4 text-primary" />
          Recent Activity
        </h2>
        <div className="space-y-2">
          {recentLogs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity. Actions will appear here as they are logged.</p>
          ) : recentLogs.map(log => (
            <div key={log.id} className="flex items-center justify-between rounded-lg border border-border bg-secondary/50 p-3">
              <div>
                <p className="text-sm font-medium text-foreground">{log.action?.replace(/_/g, ' ')}</p>
                <p className="text-xs text-muted-foreground">
                  {log.user_name} {log.patient_name ? `• Patient: ${log.patient_name}` : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <RiskBadge level={log.risk_level as 'low' | 'medium' | 'high'} />
                <span className="text-xs text-muted-foreground font-mono">{new Date(log.created_at).toLocaleTimeString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
