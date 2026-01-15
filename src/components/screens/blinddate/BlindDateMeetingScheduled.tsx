import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MapPin, Calendar, Clock, Navigation, AlertCircle, Phone, Share2 } from 'lucide-react';

interface BlindDateMeetingScheduledProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BlindDateMeetingScheduled({ onNavigate, onBack }: BlindDateMeetingScheduledProps) {
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
              <h2>Meeting Confirmed</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your blind date is scheduled
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-8"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center"
          >
            <Calendar className="w-12 h-12 text-white" />
          </motion.div>
          <h3 className="mb-2">Meeting Scheduled Successfully!</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Both parties have confirmed. See you there!
          </p>
        </motion.div>

        {/* Countdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-900/30"
        >
          <p className="text-sm text-blue-800 dark:text-blue-300 mb-2 text-center">Meeting in</p>
          <p className="text-3xl text-center text-blue-900 dark:text-blue-400">5 days 14 hours</p>
        </motion.div>

        {/* Meeting Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 p-6 rounded-xl border-2 border-blue-200 dark:border-blue-900/30 bg-white dark:bg-[#0A0F1F]"
        >
          <h4 className="mb-6">Meeting Details</h4>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date & Time</p>
                <p className="mb-1">Saturday, December 28, 2024</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">6:00 PM - 8:00 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Location</p>
                <p className="mb-1">Cafe Coffee Day - Bandra West</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Plot 123, Linking Road, Bandra West, Mumbai - 400050
                </p>
                <button className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Meeting ID</p>
                <p className="font-mono text-sm">BD-2024-12-23-4892</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Safety Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 p-6 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30"
        >
          <div className="flex gap-3 mb-4">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-1" />
            <h4 className="text-amber-900 dark:text-amber-400">Safety Reminders</h4>
          </div>
          <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Meet only at the specified public location</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Do not share personal contact information before meeting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>Tell a friend or family member about your plans</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>If you feel uncomfortable, leave immediately and contact support</span>
            </li>
          </ul>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4 mb-8"
        >
          <button className="py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all flex items-center justify-center gap-2">
            <Phone className="w-5 h-5" />
            Contact Support
          </button>
          <button className="py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Details
          </button>
        </motion.div>

        {/* Add to Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button className="w-full py-4 rounded-xl bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-all flex items-center justify-center gap-2">
            <Calendar className="w-5 h-5" />
            Add to Calendar
          </button>
        </motion.div>

        {/* Return to Dashboard */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => onNavigate('blind-date-dashboard')}
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
}
