import { useState } from "react";
import { mockConsents } from "@/data/mockData";
import { motion } from "framer-motion";
import { HeartHandshake, Plus, X, Check, Clock } from "lucide-react";

export default function ConsentPage() {
  const [consents, setConsents] = useState(mockConsents);
  const [showGrant, setShowGrant] = useState(false);

  const revokeConsent = (id: string) => {
    setConsents(prev => prev.map(c => c.id === id ? { ...c, status: 'revoked' as const } : c));
  };

  const statusColors = {
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
        <p className="text-sm text-muted-foreground mt-1">
          Control who has access to your medical records
        </p>
      </motion.div>

      <button
        onClick={() => setShowGrant(!showGrant)}
        className="flex items-center gap-2 rounded-lg gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
      >
        <Plus className="h-4 w-4" />
        Grant New Access
      </button>

      {showGrant && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="rounded-lg border border-primary/30 bg-card p-5"
        >
          <h3 className="font-semibold text-foreground mb-4">Grant Doctor Access</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Doctor ID</label>
              <input className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Enter doctor ID" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Expiry Date</label>
              <input type="date" className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div className="mt-4 flex gap-3">
            <button className="flex items-center gap-2 rounded-lg gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
              <Check className="h-4 w-4" /> Grant Access
            </button>
            <button onClick={() => setShowGrant(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-secondary transition-colors">Cancel</button>
          </div>
        </motion.div>
      )}

      {/* Consents List */}
      <div className="space-y-3">
        {consents.map((consent, i) => (
          <motion.div
            key={consent.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <p className="font-medium text-foreground">{consent.doctorName}</p>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusColors[consent.status]}`}>
                    {consent.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">{consent.specialty}</p>
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-mono mt-2">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Granted: {consent.createdAt}</span>
                  <span>Expires: {consent.expiryDate}</span>
                </div>
              </div>
              {consent.status === 'active' && (
                <button
                  onClick={() => revokeConsent(consent.id)}
                  className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors"
                >
                  <X className="h-3 w-3" />
                  Revoke
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
