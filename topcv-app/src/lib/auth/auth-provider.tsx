import { createContext, ReactNode, useContext, useEffect, useMemo, useSyncExternalStore } from 'react';

import {
  clearAuthTokens,
  getAuthState,
  hydrateAuthTokens,
  setAuthTokens,
  subscribeAuthState,
} from '@/src/lib/auth/token-store';

type AuthContextValue = {
  hydrated: boolean;
  isAuthenticated: boolean;
  setTokens: typeof setAuthTokens;
  clearTokens: typeof clearAuthTokens;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authState = useSyncExternalStore(subscribeAuthState, getAuthState, getAuthState);

  useEffect(() => {
    hydrateAuthTokens().catch(() => {
      void clearAuthTokens();
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      hydrated: authState.hydrated,
      isAuthenticated: Boolean(authState.accessToken && authState.refreshToken),
      setTokens: setAuthTokens,
      clearTokens: clearAuthTokens,
    }),
    [authState.hydrated, authState.accessToken, authState.refreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
}
