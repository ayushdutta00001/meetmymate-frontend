import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Logo } from '../Logo';
import { Mail, Lock, Phone, AlertCircle } from 'lucide-react';
import { BackButton } from '../ui/BackButton';
import { useAuth } from '../../lib/auth-context';
import { handleApiError } from '../../lib/api';

interface SignInScreenProps {
  onSignIn: () => void;
  onBack: () => void;
  onForgotPassword: () => void;
}

export function SignInScreen({ onSignIn, onBack, onForgotPassword }: SignInScreenProps) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn } = useAuth();

  // Detect if input is phone number or email
  const isPhoneNumber = (value: string) => {
    // Check if value contains only digits, +, -, spaces, or parentheses
    const phonePattern = /^[\d\s\-\+\(\)]+$/;
    return phonePattern.test(value.trim());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Check if Supabase is configured
      const supabaseUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
      const supabaseConfigured = supabaseUrl && supabaseUrl !== 'https://your-project.supabase.co';
      
      if (!supabaseConfigured) {
        // Demo mode - simulate login
        setTimeout(() => {
          setLoading(false);
          onSignIn();
        }, 1000);
        return;
      }
      
      // Production mode - use Supabase Auth
      const credentials = isPhoneNumber(emailOrPhone)
        ? { phone: emailOrPhone.trim(), password }
        : { email: emailOrPhone.trim(), password };
      
      await signIn(credentials);
      onSignIn();
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  // Determine which icon to show based on input
  const getInputIcon = () => {
    if (!emailOrPhone) return <Mail className="w-5 h-5" />;
    if (isPhoneNumber(emailOrPhone)) return <Phone className="w-5 h-5" />;
    return <Mail className="w-5 h-5" />;
  };

  // Determine input type and placeholder
  const getInputType = () => {
    if (!emailOrPhone) return 'text';
    if (isPhoneNumber(emailOrPhone)) return 'tel';
    return 'email';
  };

  const getPlaceholder = () => {
    if (!emailOrPhone) return 'Email or Phone Number';
    if (isPhoneNumber(emailOrPhone)) return '+91 98765 43210';
    return 'your@email.com';
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#3C82F6] to-[#1F3C88] opacity-20 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      <div className="relative z-10 min-h-screen flex flex-col px-4 py-6 overflow-y-auto">
        {/* Back button */}
        <BackButton onClick={onBack} />

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-6"
          >
            <Logo size="small" />
            <h2 className="mt-4 text-center">Welcome Back!</h2>
            <p className="text-gray-600 dark:text-gray-400 text-center mt-1">
              Sign in to continue your journey
            </p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <Input
              type={getInputType()}
              label="Email or Phone"
              placeholder={getPlaceholder()}
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              icon={getInputIcon()}
              required
            />

            <Input
              type="password"
              label="Password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="w-5 h-5" />}
              required
            />

            <button
              type="button"
              onClick={onForgotPassword}
              className="text-sm text-[#3C82F6] dark:text-[#3758FF] hover:underline"
            >
              Forgot Password?
            </button>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2"
              >
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </motion.div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
            >
              Sign In
            </Button>

            <div className="relative flex items-center justify-center my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <span className="relative px-4 bg-[#F2F4F7] dark:bg-[#0A0F1F] text-sm text-gray-500">
                or continue with
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                className="p-4 glass dark:glass-dark rounded-2xl hover:scale-105 transition-transform"
              >
                <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              </button>
              <button
                type="button"
                className="p-4 glass dark:glass-dark rounded-2xl hover:scale-105 transition-transform"
              >
                <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" className="text-[#1877F2]"/>
                </svg>
              </button>
              <button
                type="button"
                className="p-4 glass dark:glass-dark rounded-2xl hover:scale-105 transition-transform"
              >
                <svg className="w-6 h-6 mx-auto" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" className="text-black dark:text-white"/>
                </svg>
              </button>
            </div>
          </motion.form>
        </div>
      </div>
    </div>
  );
}