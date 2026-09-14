/**
 * Supabase Authentication Service
 * FINAL – compatible with Supabase Auth v2
 */

import { supabase } from '../supabase';
import type { User } from '@supabase/supabase-js';

export interface AuthUser extends User {
  /**
   * Role awareness flags
   * These are derived from backend (Edge Functions / joins)
   * NOT from Supabase Auth directly
   */
  is_admin?: boolean;
  is_provider?: boolean;
}


export interface SignUpCredentials {
  email: string;
  password: string;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

/**
 * Sign up
 */
export async function signUp(
  credentials: SignUpCredentials
): Promise<{ user: AuthUser }> {
  const { email, password } = credentials;

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error('Signup failed');
  }

  return { user: data.user as AuthUser };
}

/**
 * Sign in (EMAIL ONLY)
 */
export async function signIn(
  credentials: SignInCredentials
): Promise<{ user: AuthUser }> {
  const { email, password } = credentials;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    throw new Error('Invalid login credentials');
  }

  // 🚫 HARD RULE: user MUST exist in users table
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id')
    .eq('id', data.user.id)
    .maybeSingle();

  if (profileError) {
    await supabase.auth.signOut();
    throw new Error('Unable to verify user profile');
  }

  if (!profile) {
    // Kill session immediately
    await supabase.auth.signOut();
    throw new Error(
      'Please complete profile setup before signing in.'
    );
  }

  return { user: data.user as AuthUser };
}

/**
 * Sign out
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/**
 * Get current user (session-based)
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (user as AuthUser) ?? null;

}

/**
 * Reset password
 */
export async function resetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}
