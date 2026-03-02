import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/AppLayout";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import AuditLogsPage from "./pages/AuditLogsPage";
import EmergencyAccessPage from "./pages/EmergencyAccessPage";
import ConsentPage from "./pages/ConsentPage";
import SecurityMonitorPage from "./pages/SecurityMonitorPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/audit-logs" element={<ProtectedRoute roles={['admin']}><AuditLogsPage /></ProtectedRoute>} />
              <Route path="/emergency-access" element={<ProtectedRoute roles={['admin', 'doctor']}><EmergencyAccessPage /></ProtectedRoute>} />
              <Route path="/consent" element={<ProtectedRoute roles={['patient', 'admin']}><ConsentPage /></ProtectedRoute>} />
              <Route path="/security" element={<ProtectedRoute roles={['admin']}><SecurityMonitorPage /></ProtectedRoute>} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
