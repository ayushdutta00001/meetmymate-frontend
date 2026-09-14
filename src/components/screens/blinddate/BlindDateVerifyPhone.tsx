import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, ArrowLeft, Check } from 'lucide-react';

interface BlindDateVerifyPhoneProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BlindDateVerifyPhone({ onNavigate, onBack }: BlindDateVerifyPhoneProps) {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [verified, setVerified] = useState(false);

  const handleSendOTP = () => {
    if (phone.length === 10) {
      setOtpSent(true);
    }
  };

  const handleVerifyOTP = () => {
    if (otp.length === 6) {
      setVerified(true);
      setTimeout(() => {
        onNavigate('blind-date-verify-email');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-2xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2>Phone Verification</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Step 1 of 4</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-6 py-12">
        {/* Icon */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"
        >
          {verified ? (
            <Check className="w-10 h-10 text-green-600 dark:text-green-400" />
          ) : (
            <Phone className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          )}
        </motion.div>

        {verified ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <h3 className="mb-2 text-green-600 dark:text-green-400">Phone Verified</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Proceeding to next step...</p>
          </motion.div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-center mb-8"
            >
              <h3 className="mb-2">Verify Your Phone Number</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {otpSent
                  ? 'Enter the 6-digit code sent to your phone'
                  : 'We will send a one-time verification code'}
              </p>
            </motion.div>

            {!otpSent ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                    Phone Number
                  </label>
                  <div className="flex gap-2">
                    <div className="w-16 px-3 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 text-center">
                      +91
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      className="flex-1 px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSendOTP}
                  disabled={phone.length !== 10}
                  className={`w-full py-4 rounded-xl transition-all ${
                    phone.length === 10
                      ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  }`}
                >
                  Send Verification Code
                </button>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all text-center text-2xl tracking-widest"
                    maxLength={6}
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">
                    Sent to +91 {phone}
                  </p>
                </div>

                <button
                  onClick={handleVerifyOTP}
                  disabled={otp.length !== 6}
                  className={`w-full py-4 rounded-xl transition-all ${
                    otp.length === 6
                      ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
                      : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                  }`}
                >
                  Verify Code
                </button>

                <button
                  onClick={() => setOtpSent(false)}
                  className="w-full text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Change phone number
                </button>
              </motion.div>
            )}
          </>
        )}

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-blue-600 dark:bg-blue-700"></div>
            <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-800"></div>
            <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-800"></div>
            <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-800"></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">
            Phone verification
          </p>
        </motion.div>
      </div>
    </div>
  );
}
