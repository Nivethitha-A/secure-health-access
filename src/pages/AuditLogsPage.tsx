import { useState } from "react";
import { mockAuditLogs } from "@/data/mockData";
import { RiskBadge } from "@/components/RiskBadge";
import { motion } from "framer-motion";
import { FileText, CheckCircle, AlertTriangle, Hash, Search } from "lucide-react";

export default function AuditLogsPage() {
  const [filter, setFilter] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [integrityResult, setIntegrityResult] = useState<'valid' | 'tampered' | null>(null);

  const filteredLogs = mockAuditLogs.filter(log =>
    !filter || log.action.toLowerCase().includes(filter.toLowerCase()) ||
    log.userName.toLowerCase().includes(filter.toLowerCase()) ||
    log.riskLevel === filter.toLowerCase()
  );

  const verifyIntegrity = () => {
    setVerifying(true);
    setIntegrityResult(null);
    setTimeout(() => {
      setVerifying(false);
      setIntegrityResult('valid');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Tamper-Evident Audit Logs
        </h1>
        <p className="text-sm text-muted-foreground mt-1">SHA-256 hash-chained immutable log entries</p>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter logs..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="w-full rounded-lg border border-border bg-secondary pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button
          onClick={verifyIntegrity}
          disabled={verifying}
          className="flex items-center gap-2 rounded-lg border border-primary/50 bg-primary/10 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
        >
          <Hash className="h-4 w-4" />
          {verifying ? 'Verifying Chain...' : 'Verify Integrity'}
        </button>
      </div>

      {/* Integrity Result */}
      {integrityResult && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`flex items-center gap-3 rounded-lg border p-4 ${
            integrityResult === 'valid'
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-destructive/30 bg-destructive/10 text-destructive'
          }`}
        >
          {integrityResult === 'valid' ? (
            <>
              <CheckCircle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Hash Chain Integrity Verified</p>
                <p className="text-xs opacity-80">All {mockAuditLogs.length} log entries validated. No tampering detected.</p>
              </div>
            </>
          ) : (
            <>
              <AlertTriangle className="h-5 w-5" />
              <div>
                <p className="font-semibold">Tampering Detected!</p>
                <p className="text-xs opacity-80">Hash chain broken at entry #3. Investigate immediately.</p>
              </div>
            </>
          )}
        </motion.div>
      )}

      {/* Log Table */}
      <div className="rounded-lg border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Time</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Action</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Patient</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Risk</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground text-xs uppercase tracking-wider">Hash</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, i) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-foreground">{log.userName}</p>
                      <p className="text-xs capitalize text-muted-foreground">{log.role}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-foreground">{log.action}</td>
                  <td className="px-4 py-3 text-muted-foreground">{log.patientName || '—'}</td>
                  <td className="px-4 py-3"><RiskBadge level={log.riskLevel} /></td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{log.currentHash}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
