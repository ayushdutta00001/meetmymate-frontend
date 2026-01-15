import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, MapPin, AlertTriangle, ArrowLeft } from 'lucide-react';

interface BlindDateEligibilityProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BlindDateEligibility({ onNavigate, onBack }: BlindDateEligibilityProps) {
  const [agreed, setAgreed] = useState(false);

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
              <h2>Eligibility Requirements</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Please review carefully</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 rounded-xl bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200 dark:border-amber-900/30"
        >
          <div className="flex gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-500 flex-shrink-0" />
            <div>
              <p className="mb-2 text-amber-900 dark:text-amber-400">
                This experience is available only for verified users aged 21+ and takes place in public locations only.
              </p>
              <p className="text-sm text-amber-800 dark:text-amber-500">
                You must complete identity verification to proceed.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Requirements */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <h3 className="mb-6">You Must Confirm</h3>
          <div className="space-y-4">
            {[
              {
                icon: Shield,
                title: 'Age Verification',
                items: [
                  'You are 21 years of age or older',
                  'You will provide valid government ID for verification',
                  'You will complete selfie verification',
                ],
              },
              {
                icon: MapPin,
                title: 'Public Meeting Agreement',
                items: [
                  'All meetings occur only in public locations',
                  'You will not request or accept private meeting locations',
                  'You understand this is not a private dating service',
                ],
              },
            ].map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-6 rounded-xl border border-gray-200 dark:border-gray-800"
              >
                <div className="flex gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                    <section.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h4 className="mt-1">{section.title}</h4>
                </div>
                <ul className="space-y-2 ml-13">
                  {section.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Additional Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 p-6 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800"
        >
          <h4 className="mb-4">Service Limitations</h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Maximum 4 blind dates per user per month</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Payment is for meeting arrangement, not guaranteed compatibility</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Refunds available only if no match is found or system cancels</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>No refund if meeting happens or user cancels on meeting day</span>
            </li>
          </ul>
        </motion.div>

        {/* Agreement Checkbox */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-8"
        >
          <label className="flex items-start gap-4 p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-600 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I confirm that I am 21 years or older, understand all requirements listed above, 
              and agree to meet only in public locations as arranged by the system.
            </span>
          </label>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <button
            onClick={() => onNavigate('blind-date-verify-phone')}
            disabled={!agreed}
            className={`w-full py-4 rounded-xl transition-all ${
              agreed
                ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600'
                : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }`}
          >
            Continue to Verification
          </button>
        </motion.div>
      </div>
    </div>
  );
}
