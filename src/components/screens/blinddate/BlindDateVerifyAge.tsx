import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowLeft, AlertCircle } from 'lucide-react';

interface BlindDateVerifyAgeProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BlindDateVerifyAge({ onNavigate, onBack }: BlindDateVerifyAgeProps) {
  const [dob, setDob] = useState({ day: '', month: '', year: '' });
  const [ageVerified, setAgeVerified] = useState<boolean | null>(null);

  const calculateAge = () => {
    const { day, month, year } = dob;
    if (!day || !month || !year) return null;
    
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleVerify = () => {
    const age = calculateAge();
    if (age !== null) {
      if (age >= 21) {
        setAgeVerified(true);
        setTimeout(() => {
          onNavigate('blind-date-verify-selfie');
        }, 2000);
      } else {
        setAgeVerified(false);
      }
    }
  };

  const isComplete = dob.day && dob.month && dob.year && dob.year.length === 4;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
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
              <h2>Age Verification</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Step 3 of 4</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-md mx-auto px-6 py-12">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center"
        >
          <Calendar className="w-10 h-10 text-blue-600 dark:text-blue-400" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h3 className="mb-2">Confirm Your Age</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            You must be 21 years or older to use this service
          </p>
        </motion.div>

        {ageVerified === false && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30"
          >
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-red-800 dark:text-red-400">
                  You must be at least 21 years old to proceed.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {ageVerified === true && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30"
          >
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-green-800 dark:text-green-400">
                  Age verified successfully. Proceeding to next step...
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
              Date of Birth
            </label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <input
                  type="text"
                  value={dob.day}
                  onChange={(e) => setDob({ ...dob, day: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                  placeholder="DD"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all text-center"
                  maxLength={2}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={dob.month}
                  onChange={(e) => setDob({ ...dob, month: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                  placeholder="MM"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all text-center"
                  maxLength={2}
                />
              </div>
              <div>
                <input
                  type="text"
                  value={dob.year}
                  onChange={(e) => setDob({ ...dob, year: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                  placeholder="YYYY"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all text-center"
                  maxLength={4}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Your date of birth will not be visible to other users
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              We require age verification to ensure all users meet the minimum age requirement of 21 years. 
              This information is kept confidential.
            </p>
          </div>

          <button
            onClick={handleVerify}
            disabled={!isComplete || ageVerified === true}
            className={`w-full py-4 rounded-xl transition-all ${
              isComplete && ageVerified !== true
                ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            {ageVerified === true ? 'Verified' : 'Verify Age'}
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 rounded-full bg-blue-600 dark:bg-blue-700"></div>
            <div className="flex-1 h-2 rounded-full bg-blue-600 dark:bg-blue-700"></div>
            <div className="flex-1 h-2 rounded-full bg-blue-600 dark:bg-blue-700"></div>
            <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-800"></div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-2 text-center">
            Age confirmation
          </p>
        </motion.div>
      </div>
    </div>
  );
}
