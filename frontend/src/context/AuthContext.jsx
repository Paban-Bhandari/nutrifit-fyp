import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true); // true while checking session on mount

  // ── Restore session on app mount ────────────────────────────────────────────
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await api.get('/api/accounts/me/');
        setUser(data.user);
        setProfile(data.profile);
      } catch {
        // Not authenticated — clear any stale data
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();
  }, []);

  // ── Login ────────────────────────────────────────────────────────────────────
  const login = useCallback(async (username, password) => {
    const { data } = await api.post('/api/accounts/login/', { username, password });
    setUser(data.user);
    setProfile(data.profile);
    return data;
  }, []);

  // ── Logout ───────────────────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    try {
      await api.post('/api/accounts/logout/');
    } catch {
      // Even if logout fails server-side, clear client state
    } finally {
      setUser(null);
      setProfile(null);
    }
  }, []);

  // ── Update profile locally after PATCH ──────────────────────────────────────
  const updateProfile = useCallback((newProfile) => {
    setProfile(newProfile);
  }, []);

  // ── Refresh profile from server ──────────────────────────────────────────────
  const refreshProfile = useCallback(async () => {
    try {
      const { data } = await api.get('/api/accounts/me/');
      setUser(data.user);
      setProfile(data.profile);
      return data;
    } catch {
      return null;
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout, updateProfile, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
