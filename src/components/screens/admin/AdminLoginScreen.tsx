import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Logo } from '../../Logo';
import { Mail, Lock, AlertCircle, Phone } from 'lucide-react';
import { useAuth } from '../../../lib/auth-context';
import { handleApiError } from '../../../lib/api';

interface AdminLoginScreenProps {
  onLogin: () => void;
  onCreateAccount: () => void;
  onForgotPassword: () => void;
}

export function AdminLoginScreen({ onLogin, onCreateAccount, onForgotPassword }: AdminLoginScreenProps) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();

  // Detect if input is phone number or email
  const isPhoneNumber = (value: string) => {
    const phonePattern = /^[\d\s\-\+\(\)]+$/;
    return phonePattern.test(value.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // Check if Supabase is configured
      const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
      const supabaseConfigured = supabaseUrl && supabaseUrl !== 'https://your-project.supabase.co';
      
      if (!supabaseConfigured) {
        // Demo mode - allow hardcoded credentials
        if ((emailOrPhone === 'admin@meetmymate.com' || emailOrPhone === '+919876543210') && password === 'admin123') {
          onLogin();
          return;
        } else {
          setError('Demo mode: Use admin@meetmymate.com or +919876543210 / admin123');
          return;
        }
      }
      
      // Production mode - use Supabase Auth
      const credentials = isPhoneNumber(emailOrPhone)
        ? { phone: emailOrPhone.trim(), password }
        : { email: emailOrPhone.trim(), password };
      
      await signIn(credentials);
      onLogin();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  };

  // Determine which icon to show
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F4F7] via-[#E8EBF0] to-[#F2F4F7] flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#3C82F6]/20 to-[#3758FF]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#8EA8FF]/20 to-[#3C82F6]/20 rounded-full blur-3xl"
        />
      </div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Glassmorphic Card */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="mb-2">Admin Portal</h2>
            <p className="text-sm text-gray-600">
              Sign in to manage Meet my Mate platform
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </motion.div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email or Phone Input */}
            <div>
              <label className="block text-sm mb-2" style={{ fontWeight: 600 }}>
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
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-[#3C82F6] focus:bg-white transition-all outline-none text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm mb-2" style={{ fontWeight: 600 }}>
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
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-[#3C82F6] focus:bg-white transition-all outline-none text-sm"
                  required
                />
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-[#3C82F6] focus:ring-[#3C82F6]"
                />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-[#3C82F6] hover:underline"
                onClick={onForgotPassword}
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
              style={{ fontWeight: 600 }}
            >
              Login as Admin
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Don't have an account?{' '}
              <button
                onClick={onCreateAccount}
                className="text-[#3C82F6] hover:underline"
                style={{ fontWeight: 600 }}
              >
                Create Admin Account
              </button>
            </p>
            <p className="text-xs text-gray-500">
              Protected by enterprise-grade security
            </p>
          </div>
        </div>

        {/* Demo Credentials */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 p-4 backdrop-blur-xl bg-white/50 border border-white/40 rounded-2xl"
        >
          <p className="text-xs text-gray-600 text-center mb-2" style={{ fontWeight: 600 }}>
            Demo Credentials:
          </p>
          <p className="text-xs text-gray-500 text-center">
            Email: admin@meetmymate.com
          </p>
          <p className="text-xs text-gray-500 text-center">
            Password: admin123
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}