import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'admin' | 'doctor' | 'nurse' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ riskLevel: 'low' | 'medium' | 'high' }>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mockUsers: Record<string, User> = {
  'admin@medguard.io': { id: '1', name: 'Sarah Chen', email: 'admin@medguard.io', role: 'admin' },
  'doctor@medguard.io': { id: '2', name: 'Dr. James Wilson', email: 'doctor@medguard.io', role: 'doctor' },
  'nurse@medguard.io': { id: '3', name: 'Emily Rodriguez', email: 'nurse@medguard.io', role: 'nurse' },
  'patient@medguard.io': { id: '4', name: 'Michael Thompson', email: 'patient@medguard.io', role: 'patient' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, _password: string) => {
    const foundUser = mockUsers[email.toLowerCase()];
    if (!foundUser) throw new Error('Invalid credentials');
    
    // Simulate risk evaluation
    const risks: Array<'low' | 'medium' | 'high'> = ['low', 'low', 'medium'];
    const riskLevel = risks[Math.floor(Math.random() * risks.length)];
    
    setUser(foundUser);
    return { riskLevel };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
