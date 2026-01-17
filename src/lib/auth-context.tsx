/**
 * Authentication Context
 * Manages authentication state across the application
 * (NO admin authorization logic here)
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

import {
  signIn as authSignIn,
  signUp as authSignUp,
  signOut as authSignOut,
  getCurrentUser,
  AuthUser,
  SignInCredentials,
  SignUpCredentials,
  resetPassword,
} from './supabase-auth';

import { clearAccessToken } from './api';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signUp: (credentials: SignUpCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // --------------------------------------------------
  // Load user on app start
  // --------------------------------------------------
  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Failed to load user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }

  // --------------------------------------------------
  // Sign in
  // --------------------------------------------------
  async function signIn(credentials: SignInCredentials) {
    try {
      const { user: newUser } = await authSignIn(credentials);
      setUser(newUser);
    } catch (error) {
      console.error('Sign in failed:', error);
      throw error;
    }
  }

  // --------------------------------------------------
  // Sign up
  // --------------------------------------------------
  async function signUp(credentials: SignUpCredentials) {
    try {
      const { user: newUser } = await authSignUp(credentials);
      setUser(newUser);
    } catch (error) {
      console.error('Sign up failed:', error);
      throw error;
    }
  }

  // --------------------------------------------------
  // Sign out
  // --------------------------------------------------
  async function signOut() {
    try {
      await authSignOut();
    } finally {
      setUser(null);
      clearAccessToken();
    }
  }

  // --------------------------------------------------
  // Reset password
  // --------------------------------------------------
  async function handleResetPassword(email: string) {
    await resetPassword(email);
  }

  async function refreshUser() {
    await loadUser();
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword: handleResetPassword,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
