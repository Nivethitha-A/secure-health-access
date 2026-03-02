import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Shield, LayoutDashboard, FileText, AlertTriangle,
  HeartHandshake, Activity, LogOut, Lock
} from "lucide-react";

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', roles: ['admin', 'doctor', 'nurse', 'patient'] },
  { label: 'Audit Logs', icon: FileText, path: '/audit-logs', roles: ['admin'] },
  { label: 'Emergency Access', icon: AlertTriangle, path: '/emergency-access', roles: ['admin', 'doctor'] },
  { label: 'Consent Management', icon: HeartHandshake, path: '/consent', roles: ['patient', 'admin'] },
  { label: 'Security Monitor', icon: Activity, path: '/security', roles: ['admin'] },
];

export function AppSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const filteredNav = navItems.filter(item => user && item.roles.includes(user.role));

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-sidebar">
      <div className="flex items-center gap-3 border-b border-border px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
          <Shield className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-base font-bold text-foreground">MedGuard</h1>
          <p className="text-[10px] font-medium uppercase tracking-widest text-primary">Zero Trust</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3 overflow-y-auto scrollbar-thin">
        {filteredNav.map(item => {
          const active = location.pathname === item.path;
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-all",
                active ? "bg-primary/10 text-primary glow-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}>
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {user && (
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
              <p className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                <Lock className="h-2.5 w-2.5" />{user.role}
              </p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
            <LogOut className="h-4 w-4" /> Sign Out
          </button>
        </div>
      )}
    </aside>
  );
}
