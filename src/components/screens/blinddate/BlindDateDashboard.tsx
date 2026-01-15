import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, User, AlertCircle, Settings, ArrowLeft } from 'lucide-react';

interface BlindDateDashboardProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BlindDateDashboard({ onNavigate, onBack }: BlindDateDashboardProps) {
  const [bookingStatus, setBookingStatus] = useState('matched'); // pending | matched | scheduled | completed
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancelBooking = () => {
    setCancelling(true);
    setTimeout(() => {
      setCancelling(false);
      setShowCancelDialog(false);
      // Navigate back to home or show refund confirmation
      onNavigate('home');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h2>Blind Date Dashboard</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your booking status
                </p>
              </div>
            </div>
            <button className="w-10 h-10 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Current Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-8 rounded-2xl border-2 border-blue-200 dark:border-blue-900/30 bg-blue-50 dark:bg-blue-900/10"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-blue-600 dark:bg-blue-700 flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="mb-2 text-blue-900 dark:text-blue-400">
                {bookingStatus === 'pending' && 'Finding Your Match'}
                {bookingStatus === 'matched' && 'Match Found! 🎉'}
                {bookingStatus === 'scheduled' && 'Meeting Confirmed'}
                {bookingStatus === 'completed' && 'Meeting Completed'}
              </h3>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                {bookingStatus === 'pending' && 'We are searching for a compatible match based on your preferences. This typically takes 24-48 hours.'}
                {bookingStatus === 'matched' && 'A compatible match has been found! Please review and confirm within 24 hours or the match will expire.'}
                {bookingStatus === 'scheduled' && 'Your blind date is scheduled. See details below.'}
                {bookingStatus === 'completed' && 'Thank you for completing your blind date. Please provide feedback.'}
              </p>
            </div>
          </div>

          {bookingStatus === 'pending' && (
            <div className="pt-6 border-t border-blue-200 dark:border-blue-900/30">
              <div className="flex items-center gap-3 text-sm text-blue-800 dark:text-blue-300">
                <div className="flex-1 h-2 rounded-full bg-blue-200 dark:bg-blue-900/30 overflow-hidden">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{ width: '60%' }}
                    transition={{ duration: 1 }}
                    className="h-full bg-blue-600 dark:bg-blue-700"
                  />
                </div>
                <span>Matching in progress...</span>
              </div>
            </div>
          )}

          {bookingStatus === 'matched' && (
            <div className="pt-6 border-t border-blue-200 dark:border-blue-900/30">
              <button
                onClick={() => onNavigate('blind-date-match-found')}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white hover:shadow-lg transition-all font-medium"
              >
                View Match Details & Confirm
              </button>
              <p className="text-xs text-center text-blue-700 dark:text-blue-400 mt-3">
                ⏱️ You have 18 hours remaining to confirm
              </p>
            </div>
          )}
        </motion.div>

        {/* Booking Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 rounded-xl border border-gray-200 dark:border-gray-800"
        >
          <h4 className="mb-6">Your Booking Details</h4>
          <div className="space-y-4">
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Preferred Date</p>
                <p>Saturday, December 28, 2024</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
              <Clock className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Time Window</p>
                <p>Evening (4 PM - 7 PM)</p>
              </div>
            </div>
            <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-800">
              <MapPin className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Meeting Type</p>
                <p>Cafe (Public Location)</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <User className="w-5 h-5 text-gray-400 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Booking ID</p>
                <p className="font-mono text-sm">BD-2024-12-23-4892</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Monthly Limit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 p-6 rounded-xl border border-gray-200 dark:border-gray-800"
        >
          <h4 className="mb-4">Monthly Usage</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Blind Dates This Month</span>
                <span>1 of 4</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '25%' }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-blue-600 dark:bg-blue-700"
                />
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-3">
            You can book 3 more blind dates this month
          </p>
        </motion.div>

        {/* Cancellation Rules */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 p-6 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30"
        >
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-1" />
            <div>
              <h4 className="mb-3 text-amber-900 dark:text-amber-400">Cancellation Policy</h4>
              <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Cancel before matching to avoid charges</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>Same-day cancellations are non-refundable</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <span>No refund after both parties confirm</span>
                </li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4"
        >
          <button 
            onClick={() => onNavigate('blind-date-payment-history')}
            className="py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
          >
            View Payment History
          </button>
          <button
            className="py-4 rounded-xl border-2 border-red-200 dark:border-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
            onClick={() => setShowCancelDialog(true)}
          >
            Cancel Booking
          </button>
        </motion.div>

        {/* Cancel Dialog */}
        {showCancelDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white dark:bg-[#0A0F1F] p-8 rounded-lg shadow-lg">
              <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Cancel Booking</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to cancel your booking? This action is irreversible.
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="py-2 px-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-all"
                  onClick={() => setShowCancelDialog(false)}
                >
                  Cancel
                </button>
                <button
                  className="py-2 px-4 rounded-lg bg-red-600 dark:bg-red-400 text-white hover:bg-red-500 dark:hover:bg-red-500 transition-all"
                  onClick={handleCancelBooking}
                  disabled={cancelling}
                >
                  {cancelling ? 'Cancelling...' : 'Confirm Cancel'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}