import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../Button';
import { Input } from '../Input';
import { Logo } from '../Logo';
import { Mail, Phone, Lock, KeyRound, CheckCircle, ArrowLeft } from 'lucide-react';
import { BackButton } from '../ui/BackButton';

interface ForgotPasswordScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

type Step = 'identifier' | 'otp' | 'newPassword' | 'success';

export function ForgotPasswordScreen({ onBack, onSuccess }: ForgotPasswordScreenProps) {
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
    if (!identifier) return <Mail className="w-5 h-5" />;
    if (isPhoneNumber(identifier)) return <Phone className="w-5 h-5" />;
    return <Mail className="w-5 h-5" />;
  };

  // Get placeholder
  const getPlaceholder = () => {
    if (!identifier) return 'Email or Phone Number';
    if (isPhoneNumber(identifier)) return '+91 98765 43210';
    return 'your@email.com';
  };

  // Handle identifier submission
  const handleIdentifierSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Demo: Accept any email or phone
      setCurrentStep('otp');
    }, 1500);
  };

  // Handle OTP input
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
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

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      // Demo: Accept any 6-digit OTP
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

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setCurrentStep('success');
    }, 1500);
  };

  // Resend OTP
  const handleResendOtp = () => {
    setOtp(['', '', '', '', '', '']);
    setError('');
    // In real app, call API to resend OTP
    alert(`OTP resent to ${identifier}`);
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
        {currentStep !== 'success' && <BackButton onClick={onBack} />}

        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full py-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center mb-6"
          >
            <Logo size="small" />
          </motion.div>

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
                  <h2 className="mb-2">Forgot Password?</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter your email or phone number to receive a verification code
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <form onSubmit={handleIdentifierSubmit} className="space-y-4">
                  <Input
                    type="text"
                    label="Email or Phone"
                    placeholder={getPlaceholder()}
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    icon={getInputIcon()}
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    fullWidth
                    loading={loading}
                  >
                    Send Verification Code
                  </Button>

                  <button
                    type="button"
                    onClick={onBack}
                    className="w-full text-center text-sm text-gray-600 dark:text-gray-400 hover:text-[#3C82F6] dark:hover:text-[#3758FF] transition-colors"
                  >
                    Back to Sign In
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
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <KeyRound className="w-8 h-8 text-[#3C82F6]" />
                  </div>
                  <h2 className="mb-2">Verify Code</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter the 6-digit code sent to
                  </p>
                  <p className="text-[#3C82F6] dark:text-[#3758FF] font-medium mt-1">
                    {identifier}
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <form onSubmit={handleOtpSubmit} className="space-y-6">
                  {/* OTP Input */}
                  <div className="flex justify-center gap-2">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Backspace' && !digit && index > 0) {
                            const prevInput = document.getElementById(`otp-${index - 1}`);
                            prevInput?.focus();
                          }
                        }}
                        className="w-12 h-14 text-center text-2xl font-bold glass dark:glass-dark rounded-xl border-2 border-gray-200 dark:border-gray-700 focus:border-[#3C82F6] dark:focus:border-[#3758FF] outline-none transition-all"
                      />
                    ))}
                  </div>

                  {/* Demo Hint */}
                  <div className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Demo Code: <span className="font-mono font-semibold">123456</span>
                    </p>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    fullWidth
                    loading={loading}
                  >
                    Verify Code
                  </Button>

                  {/* Resend OTP */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Didn't receive the code?{' '}
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-[#3C82F6] dark:text-[#3758FF] hover:underline font-medium"
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
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="mb-2">Create New Password</h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter a strong password for your account
                  </p>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <Input
                    type="password"
                    label="New Password"
                    placeholder="Min. 8 characters"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setError('');
                    }}
                    icon={<Lock className="w-5 h-5" />}
                    required
                  />

                  <Input
                    type="password"
                    label="Confirm Password"
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      setError('');
                    }}
                    icon={<Lock className="w-5 h-5" />}
                    required
                  />

                  {/* Password Requirements */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <p className="text-xs text-blue-900 dark:text-blue-200 font-medium mb-2">
                      Password must contain:
                    </p>
                    <ul className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
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
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="large"
                    fullWidth
                    loading={loading}
                  >
                    Reset Password
                  </Button>
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
                  className="w-20 h-20 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
                </motion.div>

                <h2 className="mb-2">Password Reset Successful!</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Your password has been successfully reset. You can now sign in with your new password.
                </p>

                <Button
                  variant="primary"
                  size="large"
                  fullWidth
                  onClick={onSuccess}
                >
                  Back to Sign In
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
