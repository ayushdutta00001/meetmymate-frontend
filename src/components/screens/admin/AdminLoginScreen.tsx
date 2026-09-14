import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Logo } from '../../Logo';
import { Mail, Lock, AlertCircle, Phone } from 'lucide-react';
import { supabase } from '../../../supabase';

import { handleApiError } from '../../../lib/api';

interface AdminLoginScreenProps {
  onCreateAccount: () => void;
  onForgotPassword: () => void;
}

export function AdminLoginScreen({
  onCreateAccount,
  onForgotPassword,
}: AdminLoginScreenProps) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  

  // ---------------- HELPERS ----------------

  const isPhoneNumber = (value: string) =>
    /^[\d\s\-\+\(\)]+$/.test(value.trim());

  const getInputIcon = () => {
    if (isPhoneNumber(emailOrPhone)) {
      return (
        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      );
    }
    return (
      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
    );
  };

  // ---------------- SUBMIT ----------------

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setIsLoading(true);

  try {
    const email = emailOrPhone.trim();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // ✅ DO NOTHING ELSE
    // AdminApp will detect session via supabase.auth.onAuthStateChange
  } catch (err: any) {
    setError(err.message || 'Login failed');
  } finally {
    setIsLoading(false);
  }
};


  // ---------------- UI ----------------

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F4F7] via-[#E8EBF0] to-[#F2F4F7] flex items-center justify-center p-4">
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
              Sign in with your admin account
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
                Email or Phone
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
                  className="w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none"
                  placeholder="admin@meetmymate.com"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white rounded-xl"
            >
              {isLoading ? 'Signing in…' : 'Login'}
            </button>
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
