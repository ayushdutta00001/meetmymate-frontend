import React from 'react';
import { motion } from 'motion/react';
import { Shield, MapPin, Clock, AlertCircle } from 'lucide-react';
import { BackButton } from '../../ui/BackButton';

interface BlindDateLandingProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BlindDateLanding({ onNavigate, onBack }: BlindDateLandingProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-2xl mx-auto px-6 py-8">
          <BackButton onClick={() => onNavigate('home')} />
          <div className="text-center mt-4">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center"
            >
              <Shield className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="mb-3">Blind Date</h1>
            <h2 className="mb-2">Public Meet</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              A system-arranged social meeting between verified adults.
              <br />
              No photos. No chatting. Just show up.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* What This Is */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <h3 className="mb-6 text-center">What This Service Provides</h3>
          <div className="space-y-4">
            {[
              {
                icon: MapPin,
                title: 'Public Meeting Only',
                desc: 'All meetings are arranged in verified public locations',
              },
              {
                icon: Shield,
                title: 'Verified Adults 21+',
                desc: 'Age and identity verification required for all participants',
              },
              {
                icon: Clock,
                title: 'Scheduled Meetings',
                desc: 'Choose your availability. We handle the matching and scheduling',
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex gap-4 p-4 rounded-xl border border-gray-200 dark:border-gray-800"
              >
                <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="mb-1">{item.title}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What This Is NOT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12 p-6 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
        >
          <h4 className="mb-4">Before You Continue</h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>You will not see photos or profiles before the meeting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>No messaging or chat is available before or after</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Payment is for arranging the meeting, not for guaranteed compatibility</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Maximum 4 blind dates per user per month</span>
            </li>
          </ul>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <button
            onClick={() => onNavigate('blind-date-eligibility')}
            className="w-full py-4 rounded-xl bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-all"
          >
            Continue
          </button>
          <button
            onClick={() => onNavigate('blind-date-how-it-works')}
            className="w-full py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
          >
            How It Works
          </button>
        </motion.div>

        {/* Footer Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800"
        >
          <div className="flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Meet My Mate arranges public social meetings and does not guarantee personal compatibility or outcomes. 
              All meetings must occur in public locations. Users are responsible for their own safety and decisions.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}