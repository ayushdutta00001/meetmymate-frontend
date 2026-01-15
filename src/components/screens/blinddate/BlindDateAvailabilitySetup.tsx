import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, Coffee, MapPin, DollarSign, ArrowLeft } from 'lucide-react';

interface BlindDateAvailabilitySetupProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BlindDateAvailabilitySetup({ onNavigate, onBack }: BlindDateAvailabilitySetupProps) {
  const [availability, setAvailability] = useState({
    date: '',
    time: '',
    duration: '',
    vibe: '',
    budget: '',
  });

  const handleSubmit = () => {
    if (Object.values(availability).every(v => v !== '')) {
      localStorage.setItem('blindDateAvailability', JSON.stringify(availability));
      onNavigate('blind-date-control-explanation');
    }
  };

  const isComplete = Object.values(availability).every(v => v !== '');

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
              <h2>Set Your Availability</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Choose when you're available</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30"
        >
          <p className="text-sm text-blue-800 dark:text-blue-300">
            We only match you during the times you select. Choose preferences that work for you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {/* Date */}
          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Preferred Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={availability.date}
              onChange={(e) => setAvailability({ ...availability, date: e.target.value })}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Time Window <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                'Morning (9 AM - 12 PM)',
                'Afternoon (12 PM - 4 PM)',
                'Evening (4 PM - 7 PM)',
                'Night (7 PM - 10 PM)',
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => setAvailability({ ...availability, time: option })}
                  className={`py-3 px-4 rounded-lg border-2 text-sm transition-all ${
                    availability.time === option
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Meeting Duration <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {['1 hour', '2 hours', '3 hours'].map((option) => (
                <button
                  key={option}
                  onClick={() => setAvailability({ ...availability, duration: option })}
                  className={`py-3 rounded-lg border-2 transition-all ${
                    availability.duration === option
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Vibe */}
          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Coffee className="w-4 h-4" />
              Meeting Type <span className="text-red-500">*</span>
            </label>
            <div className="space-y-2">
              {[
                { value: 'Cafe', desc: 'Coffee shop or casual cafe', icon: Coffee },
                { value: 'Walk', desc: 'Public park or walking path', icon: MapPin },
                { value: 'Dinner', desc: 'Restaurant or dining venue', icon: Coffee },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAvailability({ ...availability, vibe: option.value })}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all flex items-center gap-3 ${
                    availability.vibe === option.value
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                  }`}
                >
                  <option.icon className={`w-5 h-5 ${
                    availability.vibe === option.value 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-400'
                  }`} />
                  <div className="flex-1">
                    <p className={`mb-1 ${
                      availability.vibe === option.value 
                        ? 'text-blue-700 dark:text-blue-400' 
                        : ''
                    }`}>
                      {option.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{option.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Budget Range <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '₹', desc: 'Under ₹500' },
                { label: '₹₹', desc: '₹500-₹1500' },
                { label: '₹₹₹', desc: 'Above ₹1500' },
              ].map((option) => (
                <button
                  key={option.label}
                  onClick={() => setAvailability({ ...availability, budget: option.label })}
                  className={`py-3 rounded-lg border-2 transition-all ${
                    availability.budget === option.label
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                      : 'border-gray-300 dark:border-gray-700 hover:border-gray-400'
                  }`}
                >
                  <p className="mb-1">{option.label}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{option.desc}</p>
                </button>
              ))}
            </div>
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
