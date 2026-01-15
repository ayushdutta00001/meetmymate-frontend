import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Shield, CheckCircle, Briefcase, FileText, GraduationCap } from 'lucide-react';

interface ExpertAccessScreenProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
  onGoToVerification: () => void;
  onGoToDashboard: () => void;
  isVerified?: boolean;
  hasBusinessMeetupSubscription?: boolean;
}

export function ExpertAccessScreen({ 
  onBack, 
  onNavigate, 
  onGoToVerification, 
  onGoToDashboard,
  isVerified = true, // For now, assuming user is verified
  hasBusinessMeetupSubscription
}: ExpertAccessScreenProps) {
  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass dark:glass-dark border-b border-white/20 dark:border-gray-800/50 backdrop-blur-xl"
      >
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2>Become an Expert</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Share your expertise and earn
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Status Banner (if verified) */}
        {isVerified && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-green-500/20 bg-green-500/5 mb-8"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg mb-1">Verification Complete ✓</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  You're a verified expert. Access your dashboard to manage bookings and earnings.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Two Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Option 1: Complete Verification */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className={`glass dark:glass-dark rounded-3xl p-8 backdrop-blur-xl border cursor-pointer ${
              !isVerified 
                ? 'border-orange-500/50 bg-orange-500/5' 
                : 'border-white/20 dark:border-gray-800/50'
            }`}
            onClick={onGoToVerification}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-6">
              <FileText className="w-8 h-8 text-white" />
            </div>

            <div className="flex items-center gap-2 mb-3">
              <h3>Complete Verification</h3>
              {!isVerified && (
                <span className="text-xs px-2 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400">
                  Required
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {isVerified 
                ? 'Update your verification details, credentials, and expertise information.'
                : 'Complete your expert verification to start accepting bookings and earning.'}
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Submit credentials & documents</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Set your expertise areas</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Define hourly rates</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>24-48 hour approval process</span>
              </div>
            </div>

            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-xl transition-all">
              {isVerified ? 'Update Verification' : 'Start Verification'}
            </button>
          </motion.div>

          {/* Option 2: Expert Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: isVerified ? 1.02 : 1 }}
            className={`glass dark:glass-dark rounded-3xl p-8 backdrop-blur-xl border relative ${
              isVerified 
                ? 'border-green-500/50 bg-green-500/5 cursor-pointer' 
                : 'border-white/20 dark:border-gray-800/50 opacity-50'
            }`}
            onClick={isVerified ? onGoToDashboard : undefined}
          >
            {!isVerified && (
              <div className="absolute inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                <div className="text-center">
                  <Shield className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-sm text-gray-300 dark:text-gray-400">
                    Complete verification first
                  </p>
                </div>
              </div>
            )}

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6">
              <Briefcase className="w-8 h-8 text-white" />
            </div>

            <div className="flex items-center gap-2 mb-3">
              <h3>Expert Dashboard</h3>
              {isVerified && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Active
                </span>
              )}
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Manage your availability, bookings, earnings, and profile from a comprehensive dashboard.
            </p>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span>Manage time slot availability</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span>Track all consultations</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span>View earnings & withdraw</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <CheckCircle className="w-4 h-4 text-purple-500" />
                <span>Update profile & expertise</span>
              </div>
            </div>

            <button 
              disabled={!isVerified}
              className={`w-full py-3 rounded-xl transition-all ${
                isVerified 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-xl' 
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
              }`}
            >
              {isVerified ? 'Open Dashboard' : 'Locked'}
            </button>
          </motion.div>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-blue-500/20 bg-blue-500/5 mt-8"
        >
          <div className="flex items-start gap-4">
            <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="text-sm mb-2">How It Works</h4>
              <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <p>
                  <strong>1. New Members:</strong> Complete verification first by submitting credentials, expertise, and hourly rates. Approval takes 24-48 hours.
                </p>
                <p>
                  <strong>2. Verified Experts:</strong> Access your dashboard to manage availability, accept bookings, track earnings (75% payout after 25% commission), and withdraw funds.
                </p>
                <p>
                  <strong>3. Earn Money:</strong> Set your schedule, customers book your slots, you get paid weekly every Monday.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}