'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '@/lib/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      if (res.data?.success && res.data?.user) {
        setUser(res.data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser, refetchUser: fetchCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
