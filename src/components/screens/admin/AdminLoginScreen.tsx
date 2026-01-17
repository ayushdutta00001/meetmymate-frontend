import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Logo } from '../../Logo';
import { Mail, Lock, AlertCircle, Phone } from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';
import { handleApiError } from '../../../lib/api';

interface AdminLoginScreenProps {
  onLogin: () => void;              // used ONLY for demo mode
  onCreateAccount: () => void;
  onForgotPassword: () => void;
}

export function AdminLoginScreen({
  onLogin,
  onCreateAccount,
  onForgotPassword,
}: AdminLoginScreenProps) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { signIn } = useAuth();

  // ---------------- HELPERS ----------------

  const isPhoneNumber = (value: string) => {
    const phonePattern = /^[\d\s\-\+\(\)]+$/;
    return phonePattern.test(value.trim());
  };

  const getInputIcon = () => {
    if (!emailOrPhone) return <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />;
    if (isPhoneNumber(emailOrPhone)) return <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />;
    return <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />;
  };

  const getPlaceholder = () => {
    if (!emailOrPhone) return 'Email or Phone Number';
    if (isPhoneNumber(emailOrPhone)) return '+91 98765 43210';
    return 'admin@meetmymate.com';
  };

  // ---------------- SUBMIT ----------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL || '';
      const supabaseConfigured =
        supabaseUrl && supabaseUrl !== 'https://your-project.supabase.co';

      // ================= DEMO MODE =================
      if (!supabaseConfigured) {
        if (
          (emailOrPhone === 'admin@meetmymate.com' ||
            emailOrPhone === '+919876543210') &&
          password === 'admin123'
        ) {
          onLogin(); // demo-only local login
          return;
        } else {
          setError(
            'Demo mode: Use admin@meetmymate.com or +919876543210 / admin123'
          );
          return;
        }
      }

      // ================= PRODUCTION MODE =================
      const credentials = isPhoneNumber(emailOrPhone)
        ? { phone: emailOrPhone.trim(), password }
        : { email: emailOrPhone.trim(), password };

      // IMPORTANT:
      // This creates the Supabase session.
      // DO NOT manually set login state here.
      await signIn(credentials);

      // MainLauncher will automatically:
      // - detect logged-in user
      // - check admin_users table
      // - allow admin portal
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // ---------------- UI ----------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F4F7] via-[#E8EBF0] to-[#F2F4F7] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#3C82F6]/20 to-[#3758FF]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#8EA8FF]/20 to-[#3C82F6]/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-8 shadow-2xl">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          <div className="text-center mb-8">
            <h2 className="mb-2">Admin Portal</h2>
            <p className="text-sm text-gray-600">
              Sign in to manage Meet my Mate platform
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-2 font-semibold">
                Email or Phone Number
              </label>
              <div className="relative">
                {getInputIcon()}
                <input
                  type="text"
                  value={emailOrPhone}
                  onChange={(e) => {
                    setEmailOrPhone(e.target.value);
                    setError('');
                  }}
                  placeholder={getPlaceholder()}
                  className="w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2 font-semibold">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  className="w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none"
                  required
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white rounded-xl"
            >
              {isLoading ? 'Signing in…' : 'Login as Admin'}
            </motion.button>
          </form>

          <div className="mt-6 text-center text-sm">
            <button onClick={onCreateAccount} className="text-blue-600 mr-4">
              Create Admin Account
            </button>
            <button onClick={onForgotPassword} className="text-blue-600">
              Forgot Password?
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
