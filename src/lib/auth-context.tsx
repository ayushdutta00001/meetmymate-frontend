/**
 * Authentication Context
 * FINAL – matches Meet My Mate in rules
 */

import { supabase } from '../supabase';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

import {
  signIn as authSignIn,
  signOut as authSignOut,
  getCurrentUser,
  AuthUser,
  SignInCredentials,
  resetPassword,
} from './supabase-auth';

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  emailVerified: boolean;   // 👈 ADD THIS
  isLoading: boolean;
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
const [emailVerified, setEmailVerified] = useState<boolean>(false);

  // --------------------------------------------------
  // INITIAL LOAD (NO REFRESH TOKEN ASSUMPTION)
  // --------------------------------------------------
  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const currentUser = await getCurrentUser();
        if (mounted) {
          setUser(currentUser);
        }
      } catch {
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      const authUser = session?.user ?? null;

setUser(authUser);
setEmailVerified(!!authUser?.email_confirmed_at);

    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // --------------------------------------------------
  // SIGN IN (ONLY PLACE SESSION IS CREATED)
  // --------------------------------------------------
  async function signIn(credentials: SignInCredentials) {
    const { user } = await authSignIn(credentials);
    setUser(user);
  }

  // --------------------------------------------------
  // SIGN OUT
  // --------------------------------------------------
  async function signOut() {
    await authSignOut();
    setUser(null);
  }

  // --------------------------------------------------
  // RESET PASSWORD
  // --------------------------------------------------
  async function handleResetPassword(email: string) {
    await resetPassword(email);
  }

  async function refreshUser() {
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  }

 const value: AuthContextType = {
  user,
  isAuthenticated: !!user,
  emailVerified,          // 👈 ADD THIS
  isLoading,
  signIn,
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
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
