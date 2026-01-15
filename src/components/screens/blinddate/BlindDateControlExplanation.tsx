import React from 'react';
import { motion } from 'motion/react';
import { Check, X, ArrowLeft } from 'lucide-react';

interface BlindDateControlExplanationProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BlindDateControlExplanation({ onNavigate, onBack }: BlindDateControlExplanationProps) {
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
              <h2>Important Information</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Understanding the blind date process</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* What You Control */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-2xl border-2 border-green-200 dark:border-green-900/30 bg-green-50 dark:bg-green-900/10"
          >
            <div className="w-12 h-12 rounded-xl bg-green-600 dark:bg-green-700 flex items-center justify-center mb-6">
              <Check className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-6 text-green-900 dark:text-green-400">What You Control</h3>
            <ul className="space-y-4 text-sm">
              {[
                'Date and time of meeting',
                'Type of public venue',
                'Meeting duration',
                'Budget preferences',
                'Basic compatibility boundaries',
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3 text-green-800 dark:text-green-300"
                >
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* What You Don't See */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-8 rounded-2xl border-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50"
          >
            <div className="w-12 h-12 rounded-xl bg-gray-600 dark:bg-gray-700 flex items-center justify-center mb-6">
              <X className="w-6 h-6 text-white" />
            </div>
            <h3 className="mb-6 text-gray-900 dark:text-gray-300">What You Don't See Beforehand</h3>
            <ul className="space-y-4 text-sm">
              {[
                'Photos or profile pictures',
                'Full names or personal details',
                'Messaging or chat',
                'Social media profiles',
                'Previous date history',
              ].map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-start gap-3 text-gray-700 dark:text-gray-400"
                >
                  <X className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Key Points */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30"
        >
          <h4 className="mb-4 text-blue-900 dark:text-blue-400">Before You Proceed</h4>
          <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-300">
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>This is a blind date service - you will not know who you're meeting until you arrive</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>All meetings must take place in the public location provided by the system</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>There is no guarantee of compatibility or connection</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1">•</span>
              <span>You are booking a meeting arrangement, not a guaranteed relationship outcome</span>
            </li>
          </ul>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex gap-4"
        >
          <button
            onClick={onBack}
            className="flex-1 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
          >
            Back
          </button>
          <button
            onClick={() => onNavigate('blind-date-payment')}
            className="flex-1 py-4 rounded-xl bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-all"
          >
            Continue to Booking
          </button>
        </motion.div>
      </div>
    </div>
  );
}
