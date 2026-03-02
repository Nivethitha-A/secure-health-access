import { useState } from "react";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { Shield, UserPlus, AlertTriangle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const roles: { value: UserRole; label: string }[] = [
  { value: 'patient', label: 'Patient' },
  { value: 'doctor', label: 'Doctor' },
  { value: 'nurse', label: 'Nurse' },
  { value: 'admin', label: 'Admin' },
];

export default function SignupPage() {
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('patient');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signup(email, password, displayName, role);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="pointer-events-none fixed inset-0 opacity-[0.03]" style={{
        backgroundImage: 'linear-gradient(hsl(173 80% 40%) 1px, transparent 1px), linear-gradient(90deg, hsl(173 80% 40%) 1px, transparent 1px)',
        backgroundSize: '60px 60px'
      }} />

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary glow-primary">
            <Shield className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">Create Account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join the MedGuard Zero Trust System</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-lg">
          {success ? (
            <div className="text-center py-6">
              <CheckCircle className="mx-auto h-12 w-12 text-success mb-3" />
              <p className="font-semibold text-foreground">Check your email</p>
              <p className="text-sm text-muted-foreground mt-1">
                We've sent a verification link to <strong>{email}</strong>. Please verify your email to sign in.
              </p>
              <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Full Name</label>
                <input type="text" value={displayName} onChange={e => setDisplayName(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="Enter your full name" required />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Email</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="Enter your email" required />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  placeholder="Min 6 characters" required minLength={6} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-muted-foreground">Role</label>
                <div className="grid grid-cols-2 gap-2">
                  {roles.map(r => (
                    <button key={r.value} type="button" onClick={() => setRole(r.value)}
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                        role === r.value
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border bg-secondary text-muted-foreground hover:border-primary/50'
                      }`}>
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive">
                  <AlertTriangle className="h-4 w-4 shrink-0" />{error}
                </motion.div>
              )}

              <button type="submit" disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-lg gradient-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50">
                {loading ? 'Creating Account...' : 'Create Account'}
                {!loading && <UserPlus className="h-4 w-4" />}
              </button>
            </form>
          )}

          {!success && (
            <div className="mt-4 text-center">
              <Link to="/" className="text-sm text-primary hover:underline">Already have an account? Sign In</Link>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
