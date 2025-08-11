import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<User>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<User>;
  logout: () => void;
  loading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000';

  const mapBackendUserToFrontend = (backendUser: any): User => {
    return {
      id: backendUser._id || backendUser.id,
      email: backendUser.email,
      name: backendUser.name,
      role: backendUser.role as UserRole,
      avatar: backendUser.avatar || undefined,
      created_at: backendUser.createdAt || new Date().toISOString(),
      updated_at: backendUser.updatedAt || new Date().toISOString(),
    };
  };

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok || body?.success === false) {
        throw new Error(body?.message || 'Invalid email or password');
      }

      const backendUser = body.data?.user;
      const token = body.data?.token;
      const refreshToken = body.data?.refreshToken;

      const mappedUser = mapBackendUserToFrontend(backendUser);
      setUser(mappedUser);
      localStorage.setItem('user', JSON.stringify(mappedUser));
      if (token) localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      return mappedUser;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: UserRole): Promise<User> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      });

      const body = await response.json().catch(() => ({}));
      if (!response.ok || body?.success === false) {
        throw new Error(body?.message || 'Registration failed');
      }

      const backendUser = body.data?.user;
      const token = body.data?.token;
      const refreshToken = body.data?.refreshToken;

      const mappedUser = mapBackendUserToFrontend(backendUser);
      setUser(mappedUser);
      localStorage.setItem('user', JSON.stringify(mappedUser));
      if (token) localStorage.setItem('token', token);
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      return mappedUser;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    loading,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};