console.log('ADMIN APP LOADED');

import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { isAdminUser } from './lib/admin-auth';

import { AdminLoginScreen } from './components/screens/admin/AdminLoginScreen';
import { AdminSignupScreen, AdminSignupData } from './components/screens/admin/AdminSignupScreen';
import { AdminForgotPasswordScreen } from './components/screens/admin/AdminForgotPasswordScreen';
import { AdminPortal } from './components/screens/admin/AdminPortal';

export default function AdminApp() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // 1️⃣ Get session + listen for auth changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // 2️⃣ Check admin_users table
  useEffect(() => {
    async function checkAdmin() {
      if (!session?.user) {
        setIsAdmin(false);
        return;
      }

      const allowed = await isAdminUser(session.user.id);
      setIsAdmin(allowed);
    }

    checkAdmin();
  }, [session]);

  // ⏳ Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking admin access...
      </div>
    );
  }

  // ❌ Not logged in → show auth screens
  if (!session) {
    if (showForgotPassword) {
      return (
        <AdminForgotPasswordScreen
          onBack={() => setShowForgotPassword(false)}
          onSuccess={() => setShowForgotPassword(false)}
        />
      );
    }

    if (showSignup) {
      return (
        <AdminSignupScreen
          onSignup={() => setShowSignup(false)}
          onBackToLogin={() => setShowSignup(false)}
        />
      );
    }

    return (
      <AdminLoginScreen
        onLogin={() => {}}
        onCreateAccount={() => setShowSignup(true)}
        onForgotPassword={() => setShowForgotPassword(true)}
      />
    );
  }

  // ❌ Logged in but NOT admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-semibold mb-2">Access Denied</h1>
        <p className="text-gray-600 mb-4">
          You are not authorized to access the Admin Portal.
        </p>
        <button
          className="px-4 py-2 bg-black text-white rounded"
          onClick={() => supabase.auth.signOut()}
        >
          Go Back
        </button>
      </div>
    );
  }

  // ✅ Logged in + admin
  return (
    <AdminPortal
      onLogout={() => supabase.auth.signOut()}
    />
  );
}
