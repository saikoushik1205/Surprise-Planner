import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { authService } from '@/services/authService';
import { ApiError } from '@/services/api';
import { AuthError, type AuthUser, type CrewRegisterInput, type LoginInput, type SignupInput } from '@/types/auth';

type AuthContextValue = {
  user: AuthUser | null;
  isReady: boolean;
  login: (input: LoginInput) => Promise<AuthUser>;
  signup: (input: SignupInput) => Promise<AuthUser>;
  registerCrew: (input: CrewRegisterInput) => Promise<AuthUser>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void authService
      .getCurrentUser()
      .then((current) => {
        if (!cancelled) {
          setUser(current);
          setIsReady(true);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setUser(null);
          setIsReady(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const nextUser = await authService.login(input);
    setUser(nextUser);
    return nextUser;
  }, []);

  const signup = useCallback(async (input: SignupInput) => {
    const nextUser = await authService.signup(input);
    setUser(nextUser);
    return nextUser;
  }, []);

  const registerCrew = useCallback(async (input: CrewRegisterInput) => {
    return authService.registerCrew(input);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isReady,
      login,
      signup,
      registerCrew,
      logout,
    }),
    [isReady, login, logout, registerCrew, signup, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }
  return context;
}

export function getAuthErrorMessage(error: unknown): string {
  if (error instanceof ApiError && error.status === 0) {
    return 'Something went wrong. Please try again.';
  }
  if (error instanceof AuthError || error instanceof ApiError) {
    return error.message || 'Something went wrong. Please try again.';
  }
  if (error instanceof Error) {
    return error.message || 'Something went wrong. Please try again.';
  }
  return 'Something went wrong. Please try again.';
}
