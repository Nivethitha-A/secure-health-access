import { supabase } from '@/integrations/supabase/client';

export interface AuditLogEntry {
  user_name: string;
  role: string;
  action: string;
  patient_id?: string;
  patient_name?: string;
  risk_level: 'low' | 'medium' | 'high';
  justification?: string;
  ip_address?: string;
  device_id?: string;
}

export async function createAuditLog(entry: AuditLogEntry) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase.from('audit_logs').insert({
    user_id: user.id,
    user_name: entry.user_name,
    role: entry.role,
    action: entry.action,
    patient_id: entry.patient_id || null,
    patient_name: entry.patient_name || null,
    risk_level: entry.risk_level,
    justification: entry.justification || null,
    ip_address: entry.ip_address || null,
    device_id: entry.device_id || navigator.userAgent.slice(0, 50),
  });

  if (error) console.error('Audit log error:', error);
}

export async function fetchAuditLogs() {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw error;
  return data || [];
}

export async function verifyAuditChain(): Promise<{ is_valid: boolean; broken_at: string | null }> {
  const { data, error } = await supabase.rpc('verify_audit_chain');
  if (error) throw error;
  const result = data?.[0] || { is_valid: true, broken_at: null };
  return result;
}
