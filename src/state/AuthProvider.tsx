import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

import { AuthError, authService } from '@/services/authService';
import type { Credentials, Session, SignUpPayload } from '@/services/authService';
import { storageKeys } from '@/services/storage';

type AuthStatus = 'loading' | 'signed-out' | 'signed-in';

type AuthValue = {
  status: AuthStatus;
  session: Session | null;
  /** True once the user has swiped through onboarding at least once. */
  onboardingSeen: boolean;
  signIn: (c: Credentials) => Promise<void>;
  signUp: (p: SignUpPayload) => Promise<void>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<void>;
  completeOnboarding: () => Promise<void>;
};

const AuthContext = createContext<AuthValue | null>(null);

/**
 * Session + onboarding state.
 *
 * `status` starts as 'loading' and stays there until storage has been read, so
 * the root layout can avoid flashing the sign-in screen for an already-signed-in
 * user on cold start.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [session, setSession] = useState<Session | null>(null);
  const [onboardingSeen, setOnboardingSeen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [rawSession, seen] = await Promise.all([
          AsyncStorage.getItem(storageKeys.auth),
          AsyncStorage.getItem(storageKeys.onboardingSeen),
        ]);
        if (cancelled) return;

        const parsed = rawSession ? (JSON.parse(rawSession) as Session) : null;
        const valid = parsed && parsed.expiresAt > Date.now() ? parsed : null;

        setSession(valid);
        setOnboardingSeen(seen === 'true');
        setStatus(valid ? 'signed-in' : 'signed-out');
        if (parsed && !valid) {
          await AsyncStorage.removeItem(storageKeys.auth);
        }
      } catch {
        if (!cancelled) setStatus('signed-out');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = useCallback(async (credentials: Credentials) => {
    const next = await authService.signIn(credentials);
    await AsyncStorage.setItem(storageKeys.auth, JSON.stringify(next));
    setSession(next);
    setStatus('signed-in');
  }, []);

  const signUp = useCallback(async (payload: SignUpPayload) => {
    const next = await authService.signUp(payload);
    await AsyncStorage.setItem(storageKeys.auth, JSON.stringify(next));
    setSession(next);
    setStatus('signed-in');
  }, []);

  const signOut = useCallback(async () => {
    await authService.signOut();
    await AsyncStorage.removeItem(storageKeys.auth);
    setSession(null);
    setStatus('signed-out');
  }, []);

  const requestPasswordReset = useCallback((email: string) => {
    return authService.requestPasswordReset(email);
  }, []);

  const completeOnboarding = useCallback(async () => {
    await AsyncStorage.setItem(storageKeys.onboardingSeen, 'true');
    setOnboardingSeen(true);
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      status,
      session,
      onboardingSeen,
      signIn,
      signUp,
      signOut,
      requestPasswordReset,
      completeOnboarding,
    }),
    [status, session, onboardingSeen, signIn, signUp, signOut, requestPasswordReset, completeOnboarding],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}

export { AuthError };