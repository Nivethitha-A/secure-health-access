import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { createAuditLog } from "@/services/auditService";
import { RiskBadge } from "@/components/RiskBadge";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, FileWarning, Siren } from "lucide-react";

export default function EmergencyAccessPage() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [justification, setJustification] = useState('');
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [history, setHistory] = useState<any[]>([]);

  const loadHistory = async () => {
    const { data } = await supabase.from('emergency_access').select('*').order('start_time', { ascending: false });
    setHistory(data || []);
  };

  useEffect(() => { loadHistory(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await supabase.from('emergency_access').insert({
      doctor_id: user.id,
      doctor_name: user.name,
      patient_id: patientId,
      patient_name: patientName,
      justification,
      status: 'active',
    });

    await createAuditLog({
      user_name: user.name,
      role: user.role,
      action: 'EMERGENCY_ACCESS',
      patient_id: patientId,
      patient_name: patientName,
      risk_level: 'high',
      justification,
    });

    setSubmitted(true);
    loadHistory();
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setJustification('');
      setPatientId('');
      setPatientName('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Siren className="h-6 w-6 text-destructive" />
          Emergency Break-Glass Access
        </h1>
        <p className="text-sm text-muted-foreground mt-1">For life-threatening situations only. All actions are logged and monitored.</p>
      </motion.div>

      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-destructive mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="font-semibold text-destructive">Critical Override Protocol</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>• Access is logged as <strong className="text-destructive">HIGH RISK</strong></li>
              <li>• Admin is immediately notified</li>
              <li>• Access auto-expires after <strong className="text-foreground">30 minutes</strong></li>
              <li>• Patient will see this in their access history</li>
            </ul>
          </div>
        </div>
      </div>

      {!showForm && (
        <button onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg gradient-danger px-6 py-3 text-sm font-semibold text-destructive-foreground hover:opacity-90 transition-opacity animate-pulse-red">
          <FileWarning className="h-4 w-4" /> Request Emergency Access
        </button>
      )}

      {showForm && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="rounded-lg border border-destructive/30 bg-card p-6">
          {submitted ? (
            <div className="text-center py-4">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <Clock className="h-6 w-6 text-success" />
              </div>
              <p className="font-semibold text-foreground">Emergency Access Granted</p>
              <p className="text-sm text-muted-foreground mt-1">Expires in 30 minutes. Admin notified.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-semibold text-foreground">Emergency Access Request</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Patient ID</label>
                  <input type="text" value={patientId} onChange={e => setPatientId(e.target.value)} required
                    className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-destructive focus:outline-none focus:ring-1 focus:ring-destructive"
                    placeholder="Enter patient ID" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Patient Name</label>
                  <input type="text" value={patientName} onChange={e => setPatientName(e.target.value)} required
                    className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-destructive focus:outline-none focus:ring-1 focus:ring-destructive"
                    placeholder="Enter patient name" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Medical Justification (Required)</label>
                <textarea value={justification} onChange={e => setJustification(e.target.value)} required minLength={20}
                  className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-destructive focus:outline-none focus:ring-1 focus:ring-destructive min-h-[100px]"
                  placeholder="Describe the life-threatening situation requiring emergency access..." />
              </div>
              <div className="flex gap-3">
                <button type="submit" className="flex items-center gap-2 rounded-lg gradient-danger px-4 py-2 text-sm font-semibold text-destructive-foreground">
                  <Siren className="h-4 w-4" /> Confirm Emergency Override
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors">Cancel</button>
              </div>
            </form>
          )}
        </motion.div>
      )}

      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-foreground flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" /> Emergency Access History
        </h2>
        <div className="space-y-3">
          {history.length === 0 ? (
            <p className="text-sm text-muted-foreground">No emergency access records.</p>
          ) : history.map(ea => (
            <div key={ea.id} className="rounded-lg border border-border bg-secondary/50 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-medium text-foreground">{ea.doctor_name}</p>
                  <p className="text-xs text-muted-foreground">Patient: {ea.patient_name}</p>
                </div>
                <RiskBadge level={ea.status === 'active' ? 'high' : 'medium'} />
              </div>
              <p className="text-sm text-muted-foreground italic">"{ea.justification}"</p>
              <div className="mt-2 flex items-center gap-4 text-xs font-mono text-muted-foreground">
                <span>Start: {new Date(ea.start_time).toLocaleString()}</span>
                <span>Expiry: {new Date(ea.expiry_time).toLocaleString()}</span>
                <span className={ea.status === 'active' ? 'text-destructive font-semibold uppercase' : 'text-muted-foreground capitalize'}>{ea.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
