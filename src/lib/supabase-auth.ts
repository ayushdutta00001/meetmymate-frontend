/**
 * Supabase Authentication Service
 * Handles all authentication operations with Supabase Auth
 */

import { setAccessToken, clearAccessToken, ApiResponse } from './api';

const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
const SUPABASE_ANON_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';

// Check if we're in demo mode (no Supabase configured)
const DEMO_MODE = !SUPABASE_URL || SUPABASE_URL === '';

export interface AuthUser {
  id: string;
  email?: string;
  phone?: string;
  role?: 'user' | 'admin';
  user_metadata?: any;
}

export interface SignUpCredentials {
  email?: string;
  phone?: string;
  password: string;
  userData?: any;
}

export interface SignInCredentials {
  email?: string;
  phone?: string;
  password: string;
}

/**
 * Initialize Supabase Auth client
 */
async function authRequest(endpoint: string, method: string, body?: any) {
  if (DEMO_MODE) {
    console.warn('Auth in demo mode - Supabase not configured');
    // Return mock auth response for demo
    return {
      user: {
        id: 'demo-user-id',
        email: body?.email || 'demo@meetmymate.com',
        phone: body?.phone,
        user_metadata: body?.data || {},
      },
      access_token: 'demo-access-token',
      session: { access_token: 'demo-access-token' }
    };
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error_description || data.msg || 'Authentication failed');
  }

  return data;
}

/**
 * Sign up a new user
 */
export async function signUp(credentials: SignUpCredentials): Promise<{ user: AuthUser; session: any }> {
  const { email, phone, password, userData } = credentials;
  
  const body: any = {
    password,
  };

  if (email) {
    body.email = email;
  } else if (phone) {
    body.phone = phone;
  } else {
    throw new Error('Email or phone is required');
  }

  if (userData) {
    body.data = userData;
  }

  try {
    const data = await authRequest('signup', 'POST', body);
    
    // Store access token
    if (data.access_token) {
      setAccessToken(data.access_token);
    }

    return {
      user: data.user,
      session: data.session,
    };
  } catch (error) {
    console.error('Sign up failed:', error);
    // In demo mode, still allow signup
    if (DEMO_MODE) {
      const demoUser: AuthUser = {
        id: 'demo-user-' + Date.now(),
        email: email,
        phone: phone,
        user_metadata: userData
      };
      setAccessToken('demo-access-token');
      return { user: demoUser, session: { access_token: 'demo-access-token' } };
    }
    throw error;
  }
}

/**
 * Sign in an existing user
 */
export async function signIn(credentials: SignInCredentials): Promise<{ user: AuthUser; session: any }> {
  const { email, phone, password } = credentials;
  
  const body: any = {
    password,
  };

  if (email) {
    body.email = email;
  } else if (phone) {
    body.phone = phone;
  } else {
    throw new Error('Email or phone is required');
  }

  try {
    const data = await authRequest('token?grant_type=password', 'POST', body);
    
    // Store access token
    if (data.access_token) {
      setAccessToken(data.access_token);
    }

    return {
      user: data.user,
      session: data,
    };
  } catch (error) {
    console.error('Sign in failed:', error);
    // In demo mode, allow any login
    if (DEMO_MODE) {
      const demoUser: AuthUser = {
        id: 'demo-user-' + Date.now(),
        email: email || 'demo@meetmymate.com',
        phone: phone,
        role: email === 'admin@meetmymate.com' ? 'admin' : 'user',
        user_metadata: { role: email === 'admin@meetmymate.com' ? 'admin' : 'user' }
      };
      setAccessToken('demo-access-token');
      return { user: demoUser, session: { access_token: 'demo-access-token' } };
    }
    throw error;
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  try {
    if (DEMO_MODE) {
      clearAccessToken();
      return;
    }

    const accessToken = sessionStorage.getItem('access_token');
    
    if (accessToken) {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    }
  } catch (error) {
    // Ignore errors during sign out
    console.error('Sign out error:', error);
  } finally {
    clearAccessToken();
  }
}

/**
 * Request password reset
 */
export async function resetPassword(email: string): Promise<void> {
  if (DEMO_MODE) {
    console.log('Demo mode: Password reset simulated for', email);
    return;
  }
  await authRequest('recover', 'POST', { email });
}

/**
 * Update user password with reset token
 */
export async function updatePassword(newPassword: string): Promise<void> {
  const accessToken = sessionStorage.getItem('access_token');
  
  if (!accessToken) {
    throw new Error('No active session');
  }

  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ password: newPassword }),
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error_description || data.msg || 'Password update failed');
  }
}

/**
 * Get current user from session
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const accessToken = sessionStorage.getItem('access_token');
  
  if (!accessToken) {
    return null;
  }

  // In demo mode, return a demo user
  if (DEMO_MODE) {
    return {
      id: 'demo-user-id',
      email: 'demo@meetmymate.com',
      role: 'user',
      user_metadata: { role: 'user' }
    };
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      clearAccessToken();
      return null;
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error('Get current user failed:', error);
    clearAccessToken();
    return null;
  }
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.user_metadata?.role === 'admin' || user?.role === 'admin';
}