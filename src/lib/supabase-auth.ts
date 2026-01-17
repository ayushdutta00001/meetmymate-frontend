/**
 * Supabase Authentication Service
 * FINAL – compatible with Supabase Auth v2
 */

import { supabase } from '../supabase';
import type { User } from '@supabase/supabase-js';

export type AuthUser = User;

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

  return { user: data.user };
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

  if (error) {
    throw error;
  }

  if (!data.user) {
    throw new Error('Authentication failed');
  }

  return { user: data.user };
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

  return user ?? null;
}

/**
 * Reset password
 */
export async function resetPassword(email: string): Promise<void> {
  const { error } = await supabase.auth.resetPasswordForEmail(email);
  if (error) throw error;
}
