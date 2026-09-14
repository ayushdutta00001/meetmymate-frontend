import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Logo } from '../Logo';
import { Mail, Lock, Phone, AlertCircle } from 'lucide-react';
import { BackButton } from '../ui/BackButton';
import { useAuth } from '../../lib/auth-context';
import { handleApiError } from '../../lib/api';
import { supabase } from '../../supabase';

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
        ? { email: '', phone: emailOrPhone.trim(), password }
        : { email: emailOrPhone.trim(), phone: '', password };
      
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
async function handleForgotPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) {
    alert(error.message);
  } else {
    alert("Password reset link sent to your email");
  }
}

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
  onClick={() => handleForgotPassword(emailOrPhone)}
  className="text-sm text-blue-600 hover:underline"
>
  Forgot password?
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
                Founder : Ayush Dutta 
              </span>
            </div>

           
          </motion.form>
        </div>
      </div>
    </div>
  );
}