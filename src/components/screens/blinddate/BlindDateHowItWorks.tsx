import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, Calendar, Users, MapPin, Bell, CheckCircle } from 'lucide-react';

interface BlindDateHowItWorksProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BlindDateHowItWorks({ onNavigate, onBack }: BlindDateHowItWorksProps) {
  const steps = [
    {
      icon: Shield,
      title: 'Verify Your Identity',
      desc: 'Complete phone, email, age, and selfie verification',
      details: ['Must be 21+ years old', 'Valid government ID required', 'Selfie verification for safety'],
    },
    {
      icon: Calendar,
      title: 'Set Your Availability',
      desc: 'Choose when and where you want to meet',
      details: ['Select dates and times', 'Pick meeting type (cafe, walk, dinner)', 'Set your budget range'],
    },
    {
      icon: Users,
      title: 'System Matches You',
      desc: 'Our algorithm finds a compatible match',
      details: ['Based on preferences and availability', 'No photos or profiles shown', 'Identity revealed only at meeting'],
    },
    {
      icon: MapPin,
      title: 'Meet in Public',
      desc: 'Meet at the assigned public location',
      details: ['Location shared before meeting', 'All meetings in public places only', 'Use help button if needed'],
    },
    {
      icon: Bell,
      title: 'Receive Confirmation',
      desc: 'Get notified when a match is found',
      details: ['Both parties must confirm', '24 hours to confirm or cancel', 'Full details sent after confirmation'],
    },
    {
      icon: CheckCircle,
      title: 'Provide Feedback',
      desc: 'Share your experience after the meeting',
      details: ['Rate comfort and respect level', 'Feedback is private', 'Helps improve matching'],
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2>How It Works</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                The complete blind date process
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-12"
        >
          <h3 className="mb-3">Simple, Secure, Blind</h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our process ensures safety and authenticity while maintaining the excitement of a true blind date experience.
          </p>
        </motion.div>

        <div className="space-y-6 mb-12">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className="flex gap-6 p-6 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-blue-500 dark:hover:border-blue-600 transition-all"
            >
              <div className="flex-shrink-0">
                <div className="w-14 h-14 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center relative">
                  <step.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-blue-600 dark:bg-blue-700 text-white text-xs flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="mb-2">{step.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{step.desc}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <span className="text-blue-600 dark:text-blue-400 mt-1">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="p-6 rounded-xl bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 mb-8"
        >
          <h4 className="mb-4">Important Reminders</h4>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Maximum 4 blind dates per user per month</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>All meetings must occur in public places</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>No photos, names, or chat before meeting</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-400">•</span>
              <span>Refunds available only if no match found or system cancels</span>
            </li>
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <button
            onClick={() => onNavigate('blind-date-eligibility')}
            className="w-full py-4 rounded-xl bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 transition-all"
          >
            Get Started
          </button>
        </motion.div>
      </div>
    </div>
  );
}
