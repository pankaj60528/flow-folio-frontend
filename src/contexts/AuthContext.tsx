import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string, password: string, remember: boolean) => { success: boolean; error?: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const VALID_EMAIL = 'intern@demo.com';
const VALID_PASSWORD = 'intern123';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('auth_session') || sessionStorage.getItem('auth_session');
    if (stored) {
      try {
        const session = JSON.parse(stored);
        setIsAuthenticated(true);
        setUserEmail(session.email);
      } catch {
        localStorage.removeItem('auth_session');
        sessionStorage.removeItem('auth_session');
      }
    }
  }, []);

  const login = (email: string, password: string, remember: boolean) => {
    if (!email.trim()) return { success: false, error: 'Email is required' };
    if (!password.trim()) return { success: false, error: 'Password is required' };
    if (email !== VALID_EMAIL || password !== VALID_PASSWORD) {
      return { success: false, error: 'Invalid email or password' };
    }
    
    const session = JSON.stringify({ email });
    if (remember) {
      localStorage.setItem('auth_session', session);
    } else {
      sessionStorage.setItem('auth_session', session);
    }
    setIsAuthenticated(true);
    setUserEmail(email);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem('auth_session');
    sessionStorage.removeItem('auth_session');
    setIsAuthenticated(false);
    setUserEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
