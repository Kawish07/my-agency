import React, { createContext, useContext, useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'));
  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem('admin_user') || 'null'); } catch (e) { return null; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem('admin_token', token);
    } else {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
    }
  }, [token]);

  useEffect(() => {
    if (admin) localStorage.setItem('admin_user', JSON.stringify(admin));
  }, [admin]);

  const signup = async ({ email, password, name }) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/signup`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Signup failed');
      setToken(data.token);
      setAdmin(data.admin);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    } finally { setLoading(false); }
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/admin/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      setToken(data.token);
      setAdmin(data.admin);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.message };
    } finally { setLoading(false); }
  };

  const logout = () => { setToken(null); setAdmin(null); };

  const value = { token, admin, loading, signup, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
