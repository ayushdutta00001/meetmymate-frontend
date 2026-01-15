import React, { useState } from 'react';
import { AdminLoginScreen } from './components/screens/admin/AdminLoginScreen';
import { AdminSignupScreen, AdminSignupData } from './components/screens/admin/AdminSignupScreen';
import { AdminForgotPasswordScreen } from './components/screens/admin/AdminForgotPasswordScreen';
import { AdminPortal } from './components/screens/admin/AdminPortal';

export default function AdminApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [adminData, setAdminData] = useState<AdminSignupData | null>(null);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setShowSignup(false);
    setShowForgotPassword(false);
  };

  const handleSignup = (data: AdminSignupData) => {
    setAdminData(data);
    setIsLoggedIn(true);
    setShowSignup(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowSignup(false);
    setShowForgotPassword(false);
    setAdminData(null);
  };

  if (!isLoggedIn) {
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
          onSignup={handleSignup}
          onBackToLogin={() => setShowSignup(false)}
        />
      );
    }
    return (
      <AdminLoginScreen
        onLogin={handleLogin}
        onCreateAccount={() => setShowSignup(true)}
        onForgotPassword={() => setShowForgotPassword(true)}
      />
    );
  }

  return <AdminPortal onLogout={handleLogout} />;
}