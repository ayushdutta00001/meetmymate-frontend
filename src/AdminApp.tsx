console.log('ADMIN APP LOADED');

import React, { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { isAdminUser } from './lib/admin-auth';
import { registerAdminPushNotifications } from './lib/admin-push';
import { AdminLoginScreen } from './components/screens/admin/AdminLoginScreen';
import { AdminSignupScreen, AdminSignupData } from './components/screens/admin/AdminSignupScreen';
import { AdminForgotPasswordScreen } from './components/screens/admin/AdminForgotPasswordScreen';
import { AdminPortal } from './components/screens/admin/AdminPortal';

export default function AdminApp() {
 const [session, setSession] = useState<any>(null);
const [authLoading, setAuthLoading] = useState(true);

const [isAdmin, setIsAdmin] = useState(false);
const [adminLoading, setAdminLoading] = useState(true);
const [showSignup, setShowSignup] = useState(false);
const [showForgotPassword, setShowForgotPassword] = useState(false);

  // 🧪 TEMP DEBUG — REMOVE AFTER FIX CONFIRMED
  useEffect(() => {
    console.log('ADMIN STATE', {
      authLoading,
      adminLoading,
      sessionExists: !!session,
      userId: session?.user?.id,
      isAdmin,
    });
  }, [authLoading, adminLoading, session, isAdmin]);

  // 1️⃣ Get session + listen for auth changes
 useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setSession(data.session);
    setAuthLoading(false);
  });

 const { data: listener } = supabase.auth.onAuthStateChange(
  (_event, session) => {
    setSession(session);
    setAuthLoading(false); // ✅ CRITICAL
  }
);


  return () => {
    listener.subscription.unsubscribe();
  };
}, []);


  // 2️⃣ Check admin_users table
 useEffect(() => {
  if (authLoading) return; // ⛔ WAIT for auth to stabilize

  async function checkAdmin() {
    if (!session?.user) {
      setIsAdmin(false);
      setAdminLoading(false);
      return;
    }

    setAdminLoading(true);

    const allowed = await isAdminUser(session.user.id);
    setIsAdmin(allowed);

    setAdminLoading(false);
  }

  checkAdmin();
}, [session, authLoading]);

useEffect(() => {
  if (!isAdmin || !session?.user) return;

  registerAdminPushNotifications();
}, [isAdmin, session]);

 // 🔄 Still checking auth
if (authLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Checking session…
    </div>
  );
}

// ❌ Not logged in
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
      onCreateAccount={() => setShowSignup(true)}
      onForgotPassword={() => setShowForgotPassword(true)}
    />
  );
}

// 🔄 Logged in but checking admin role
if (adminLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Verifying admin access…
    </div>
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
return <AdminPortal onLogout={() => supabase.auth.signOut()} />;

  
}
