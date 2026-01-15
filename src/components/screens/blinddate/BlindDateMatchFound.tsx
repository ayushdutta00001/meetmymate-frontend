import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Calendar, Clock, MapPin, User, CheckCircle, XCircle } from 'lucide-react';

interface BlindDateMatchFoundProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BlindDateMatchFound({ onNavigate, onBack }: BlindDateMatchFoundProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [declined, setDeclined] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => {
      onNavigate('blind-date-meeting-scheduled');
    }, 2000);
  };

  const handleDecline = () => {
    setDeclined(true);
    setTimeout(() => {
      onNavigate('blind-date-dashboard');
    }, 2000);
  };

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
              disabled={confirmed || declined}
              className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all disabled:opacity-50"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2>Match Found!</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review and confirm your meeting
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {confirmed ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center"
            >
              <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
            </motion.div>
            <h3 className="mb-2 text-green-600 dark:text-green-400">Meeting Confirmed!</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Preparing your meeting details...
            </p>
          </motion.div>
        ) : declined ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center"
            >
              <XCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </motion.div>
            <h3 className="mb-2 text-red-600 dark:text-red-400">Meeting Declined</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Refund will be processed within 3-5 business days
            </p>
          </motion.div>
        ) : (
          <>
            {/* Success Animation */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', duration: 0.6 }}
              className="text-center mb-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', duration: 0.8 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-pink-500 via-red-500 to-orange-500 flex items-center justify-center relative"
              >
                <Heart className="w-12 h-12 text-white fill-white" />
                <motion.div
                  initial={{ scale: 1, opacity: 1 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-pink-500"
                />
              </motion.div>
              <motion.h3
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-2"
              >
                We Found a Match!
              </motion.h3>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 dark:text-gray-400"
              >
                A compatible match has been found based on your preferences
              </motion.p>
            </motion.div>

            {/* Countdown Timer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-8 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30"
            >
              <div className="flex items-center justify-center gap-2 text-amber-800 dark:text-amber-400">
                <Clock className="w-5 h-5" />
                <p className="text-sm">
                  Please confirm within <strong>24 hours</strong> or the match will expire
                </p>
              </div>
            </motion.div>

            {/* Meeting Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-8 p-6 rounded-xl border border-gray-200 dark:border-gray-800"
            >
              <h4 className="mb-6">Proposed Meeting Details</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                  <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date</p>
                    <p>Saturday, December 28, 2024</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                  <Clock className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Time</p>
                    <p>6:00 PM - 8:00 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">General Area</p>
                    <p>Central Mumbai - Cafe/Coffee Shop</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Exact location will be shared after confirmation
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <User className="w-5 h-5 text-gray-400 mt-1" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Match Information</p>
                    <p>Compatible profile based on your preferences</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                      Identity will be revealed only at the meeting
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Important Notes */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mb-8 p-6 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30"
            >
              <h4 className="mb-4 text-blue-900 dark:text-blue-400">Before You Confirm</h4>
              <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Once both parties confirm, the meeting is final</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>No refund available after confirmation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Meeting must take place at the assigned public location</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1">•</span>
                  <span>Declining will initiate a full refund</span>
                </li>
              </ul>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="grid grid-cols-2 gap-4"
            >
              <button
                onClick={handleDecline}
                className="py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
              >
                Decline Match
              </button>
              <button
                onClick={handleConfirm}
                className="py-4 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white hover:shadow-lg transition-all"
              >
                Confirm Meeting
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
