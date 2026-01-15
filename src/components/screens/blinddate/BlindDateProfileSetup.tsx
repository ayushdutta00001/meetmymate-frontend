import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, ArrowLeft } from 'lucide-react';

interface BlindDateProfileSetupProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BlindDateProfileSetup({ onNavigate, onBack }: BlindDateProfileSetupProps) {
  const [profile, setProfile] = useState({
    firstName: '',
    gender: '',
    preferredGender: '',
    intent: '',
    city: '',
  });

  const handleSubmit = () => {
    if (profile.firstName && profile.gender && profile.preferredGender && profile.intent && profile.city) {
      localStorage.setItem('blindDateBasicProfile', JSON.stringify(profile));
      onNavigate('blind-date-availability-setup');
    }
  };

  const isComplete = Object.values(profile).every(v => v !== '');

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
              <h2>Basic Details</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">For fair matching</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-4 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
        >
          <p className="text-sm text-gray-700 dark:text-gray-300">
            These details are used only to arrange a compatible meeting. 
            Your identity is not shown before the meeting.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* First Name */}
          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              placeholder="Enter your first name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
              Your Gender <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['Male', 'Female', 'Non-binary'].map((option) => (
                <button
                  key={option}
                  onClick={() => setProfile({ ...profile, gender: option })}
                  className={`py-3 rounded-lg border-2 transition-all ${
                    profile.gender === option
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Gender */}
          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
              Preferred Gender <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {['Male', 'Female', 'Non-binary', 'Any'].map((option) => (
                <button
                  key={option}
                  onClick={() => setProfile({ ...profile, preferredGender: option })}
                  className={`py-3 rounded-lg border-2 transition-all ${
                    profile.preferredGender === option
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Intent */}
          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
              Meeting Intent <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {[
                { value: 'Serious', desc: 'Looking for a meaningful connection' },
                { value: 'Casual', desc: 'Open to seeing where things go' },
                { value: 'Social', desc: 'Just meeting new people' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setProfile({ ...profile, intent: option.value })}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    profile.intent === option.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                  }`}
                >
                  <p className={`mb-1 ${
                    profile.intent === option.value 
                      ? 'text-blue-700 dark:text-blue-400' 
                      : ''
                  }`}>
                    {option.value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">
              City <span className="text-red-500">*</span>
            </label>
            <select
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all"
            >
              <option value="">Select your city</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Kolkata">Kolkata</option>
              <option value="Pune">Pune</option>
              <option value="Ahmedabad">Ahmedabad</option>
            </select>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`w-full py-4 rounded-xl transition-all ${
              isComplete
                ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </motion.div>
      </div>
    </div>
  );
}
