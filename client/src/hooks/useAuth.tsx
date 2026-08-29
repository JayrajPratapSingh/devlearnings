import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { endpoints } from '../services/endpoints';
import { tokenStore } from '../services/api';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  /** True until the initial session check finishes — prevents a login flash. */
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  /** Drops the client session locally (used after account deletion). */
  clearSession: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On boot the access token is gone (it only lived in memory), but the refresh
  // cookie may still be valid — so try to restore the session silently.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const { user: me } = await endpoints.auth.me();
        if (!cancelled) setUser(me);
      } catch {
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    tokenStore.onExpired(() => setUser(null));
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await endpoints.auth.login({ email, password });
    tokenStore.set(res.accessToken);
    setUser(res.user);
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    const res = await endpoints.auth.register({ name, email, password });
    tokenStore.set(res.accessToken);
    setUser(res.user);
  }, []);

  const logout = useCallback(async () => {
    try {
      await endpoints.auth.logout();
    } finally {
      tokenStore.set(null);
      setUser(null);
    }
  }, []);

  /**
   * Clears the client session without calling the API. Used after the account
   * has been deleted — the server has already dropped the cookie, and calling
   * /auth/logout would just 401 against a user that no longer exists.
   */
  const clearSession = useCallback(() => {
    tokenStore.set(null);
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const { user: me } = await endpoints.auth.me();
      setUser(me);
    } catch {
      /* session already handled by the interceptor */
    }
  }, []);

  // Memoised so consumers do not re-render on every provider render.
  const value = useMemo<AuthState>(
    () => ({ user, loading, login, register, logout, clearSession, refreshUser }),
    [user, loading, login, register, logout, clearSession, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
