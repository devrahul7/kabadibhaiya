'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import api from '@/lib/axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/me')
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = (userData) => setUser(userData);
  const logout = async () => {
    try { await api.post('/auth/logout'); } catch (err) {}
    setUser(null);
    window.location.href = '/';
  };

  return <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
