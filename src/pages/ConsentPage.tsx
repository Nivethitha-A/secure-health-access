import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { createAuditLog } from "@/services/auditService";
import { motion } from "framer-motion";
import { HeartHandshake, Plus, X, Check, Clock } from "lucide-react";

export default function ConsentPage() {
  const { user } = useAuth();
  const [consents, setConsents] = useState<any[]>([]);
  const [showGrant, setShowGrant] = useState(false);
  const [doctorEmail, setDoctorEmail] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [loading, setLoading] = useState(true);

  const loadConsents = async () => {
    if (!user) return;
    const { data } = await supabase.from('patient_consents').select('*').order('created_at', { ascending: false });
    setConsents(data || []);
    setLoading(false);
  };

  useEffect(() => { loadConsents(); }, [user]);

  const revokeConsent = async (id: string) => {
    await supabase.from('patient_consents').update({ status: 'revoked', revoked_at: new Date().toISOString() }).eq('id', id);
    if (user) {
      await createAuditLog({ user_name: user.name, role: user.role, action: 'REVOKE_CONSENT', risk_level: 'low' });
    }
    loadConsents();
  };

  const grantAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await supabase.from('patient_consents').insert({
      patient_id: user.id,
      doctor_id: user.id, // In production, look up doctor by email
      doctor_name: doctorEmail,
      expiry_date: expiryDate,
      status: 'active',
    });

    await createAuditLog({ user_name: user.name, role: user.role, action: 'GRANT_CONSENT', risk_level: 'low' });
    setShowGrant(false);
    setDoctorEmail('');
    setExpiryDate('');
    loadConsents();
  };

  const statusColors: Record<string, string> = {
    active: 'text-success border-success/20 bg-success/10',
    revoked: 'text-destructive border-destructive/20 bg-destructive/10',
    expired: 'text-muted-foreground border-border bg-secondary/50',
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <HeartHandshake className="h-6 w-6 text-primary" />
          Consent Management
        </h1>
        <p className="text-sm text-muted-foreground mt-1">Control who has access to your medical records</p>
      </motion.div>

      <button onClick={() => setShowGrant(!showGrant)}
        className="flex items-center gap-2 rounded-lg gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity">
        <Plus className="h-4 w-4" /> Grant New Access
      </button>

      {showGrant && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="rounded-lg border border-primary/30 bg-card p-5">
          <h3 className="font-semibold text-foreground mb-4">Grant Doctor Access</h3>
          <form onSubmit={grantAccess} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Doctor Name/Email</label>
              <input value={doctorEmail} onChange={e => setDoctorEmail(e.target.value)} required
                className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Enter doctor name or email" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Expiry Date</label>
              <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} required
                className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <button type="submit" className="flex items-center gap-2 rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
                <Check className="h-4 w-4" /> Grant Access
              </button>
              <button type="button" onClick={() => setShowGrant(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading consents...</p>
        ) : consents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No consents found. Grant access to a doctor above.</p>
        ) : consents.map((consent, i) => (
          <motion.div key={consent.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
            className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-foreground">{consent.doctor_name}</p>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusColors[consent.status] || ''}`}>
                    {consent.status}
                  </span>
                </div>
                {consent.specialty && <p className="text-xs text-muted-foreground">{consent.specialty}</p>}
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono mt-2">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Granted: {new Date(consent.created_at).toLocaleDateString()}</span>
                  <span>Expires: {consent.expiry_date}</span>
                </div>
              </div>
              {consent.status === 'active' && (
                <button onClick={() => revokeConsent(consent.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors">
                  <X className="h-3 w-3" /> Revoke
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
