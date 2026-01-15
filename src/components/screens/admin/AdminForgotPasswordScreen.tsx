import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../../Logo';
import { Mail, Phone, Lock, KeyRound, CheckCircle, AlertCircle, Shield } from 'lucide-react';

interface AdminForgotPasswordScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

type Step = 'identifier' | 'otp' | 'newPassword' | 'success';

export function AdminForgotPasswordScreen({ onBack, onSuccess }: AdminForgotPasswordScreenProps) {
  const [currentStep, setCurrentStep] = useState<Step>('identifier');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Detect if input is phone number or email
  const isPhoneNumber = (value: string) => {
    const phonePattern = /^[\d\s\-\+\(\)]+$/;
    return phonePattern.test(value.trim());
  };

  // Get input icon
  const getInputIcon = () => {
    if (!identifier) return <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />;
    if (isPhoneNumber(identifier)) return <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />;
    return <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />;
  };

  // Get placeholder
  const getPlaceholder = () => {
    if (!identifier) return 'Email or Phone Number';
    if (isPhoneNumber(identifier)) return '+91 98765 43210';
    return 'admin@meetmymate.com';
  };

  // Handle identifier submission
  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      setCurrentStep('otp');
    }, 1500);
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`admin-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  // Handle OTP verification
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      setError('Please enter complete OTP');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      if (otpCode === '123456') {
        setCurrentStep('newPassword');
      } else {
        setError('Invalid OTP. Try: 123456');
      }
    }, 1500);
  };

  // Handle new password submission
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    setTimeout(() => {
      setLoading(false);
      setCurrentStep('success');
    }, 1500);
  };

  // Resend OTP
  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    alert(`Admin verification code resent to ${identifier}`);
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

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-8 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo />
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Enter Email/Phone */}
            {currentStep === 'identifier' && (
              <motion.div
                key="identifier"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-8 h-8 text-[#3C82F6]" />
                  </div>
                  <h2 className="mb-2">Admin Password Reset</h2>
                  <p className="text-sm text-gray-600">
                    Enter your admin email or phone to receive a verification code
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleIdentifierSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm mb-2" style={{ fontWeight: 600 }}>
                      Email or Phone Number
                    </label>
                    <div className="relative">
                      {getInputIcon()}
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => {
                          setIdentifier(e.target.value);
                          setError('');
                        }}
                        placeholder={getPlaceholder()}
                        className="w-full pl-12 pr-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-[#3C82F6] focus:bg-white transition-all outline-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontWeight: 600 }}
                  >
                    {loading ? 'Sending...' : 'Send Verification Code'}
                  </motion.button>

                  <button
                    type="button"
                    onClick={onBack}
                    className="w-full text-center text-sm text-gray-600 hover:text-[#3C82F6] transition-colors"
                  >
                    Back to Admin Login
                  </button>
                </form>
              </motion.div>
            )}

            {/* Step 2: Verify OTP */}
            {currentStep === 'otp' && (
              <motion.div
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-8 h-8 text-[#3C82F6]" />
                  </div>
                  <h2 className="mb-2">Verify Admin Code</h2>
                  <p className="text-sm text-gray-600 mb-1">
                    Enter the 6-digit code sent to
                  </p>
                  <p className="text-[#3C82F6] font-medium text-sm">
                    {identifier}
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  {/* OTP Input */}
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`admin-otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !digit && index > 0) {
                            const prevInput = document.getElementById(`admin-otp-${index - 1}`);
                            prevInput?.focus();
                          }
                        }}
                        className="w-12 h-14 text-center text-2xl font-bold bg-white/70 rounded-xl border-2 border-gray-200 focus:border-[#3C82F6] focus:bg-white outline-none transition-all"
                      />
                    ))}
                  </div>

                  {/* Demo Hint */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
                    <p className="text-xs text-blue-900 font-medium">
                      Demo Admin Code: <span className="font-mono font-bold">123456</span>
                    </p>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontWeight: 600 }}
                  >
                    {loading ? 'Verifying...' : 'Verify Code'}
                  </motion.button>

                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      Didn't receive the code?{' '}
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-[#3C82F6] hover:underline font-medium"
                      >
                        Resend
                      </button>
                    </p>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Set New Password */}
            {currentStep === 'newPassword' && (
              <motion.div
                key="newPassword"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-green-600" />
                  </div>
                  <h2 className="mb-2">Create New Password</h2>
                  <p className="text-sm text-gray-600">
                    Enter a strong admin password
                  </p>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2"
                  >
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </motion.div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2" style={{ fontWeight: 600 }}>
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          setError('');
                        }}
                        placeholder="Min. 8 characters"
                        className="w-full pl-12 pr-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-[#3C82F6] focus:bg-white transition-all outline-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-2" style={{ fontWeight: 600 }}>
                      Confirm Password
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          setError('');
                        }}
                        placeholder="Re-enter password"
                        className="w-full pl-12 pr-4 py-3 bg-white/50 border-2 border-gray-200 rounded-xl focus:border-[#3C82F6] focus:bg-white transition-all outline-none text-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
                    <p className="text-xs text-blue-900 font-medium mb-2">
                      Admin Password Requirements:
                    </p>
                    <ul className="text-xs text-blue-800 space-y-1">
                      <li className="flex items-center gap-2">
                        <span className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                          {newPassword.length >= 8 ? '✓' : '○'}
                        </span>
                        At least 8 characters
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                          {/[A-Z]/.test(newPassword) ? '✓' : '○'}
                        </span>
                        One uppercase letter
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                          {/[0-9]/.test(newPassword) ? '✓' : '○'}
                        </span>
                        One number
                      </li>
                      <li className="flex items-center gap-2">
                        <span className={/[!@#$%^&*]/.test(newPassword) ? 'text-green-600' : ''}>
                          {/[!@#$%^&*]/.test(newPassword) ? '✓' : '○'}
                        </span>
                        One special character
                      </li>
                    </ul>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3.5 bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ fontWeight: 600 }}
                  >
                    {loading ? 'Resetting...' : 'Reset Admin Password'}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Step 4: Success */}
            {currentStep === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </motion.div>

                <h2 className="mb-2">Admin Password Reset!</h2>
                <p className="text-sm text-gray-600 mb-8">
                  Your admin password has been successfully reset. You can now sign in with your new credentials.
                </p>

                <motion.button
                  onClick={onSuccess}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all"
                  style={{ fontWeight: 600 }}
                >
                  Back to Admin Login
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
