import React from 'react';
import { motion } from 'motion/react';
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  GraduationCap,
  ArrowRight,
  Download,
  Share2,
  Home
} from 'lucide-react';

interface ExperiencedBookingConfirmationScreenProps {
  onNavigate: (page: string) => void;
}

export function ExperiencedBookingConfirmationScreen({ onNavigate }: ExperiencedBookingConfirmationScreenProps) {
  const bookingDetails = {
    bookingId: 'EXP-' + Date.now(),
    expert: {
      name: 'Dr. Arvind Kumar',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      expertise: 'Startup Strategy',
      email: 'arvind.kumar@example.com',
      phone: '+91 98765 43210'
    },
    session: {
      date: '2024-12-24',
      time: '10:00 AM',
      duration: '60 minutes',
      mode: 'Online',
      meetingLink: 'https://meet.example.com/expert-session-12345'
    },
    payment: {
      sessionFee: 5000,
      platformFee: 750,
      totalPaid: 5750,
      transactionId: 'TXN' + Date.now()
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] flex items-center justify-center px-4 pb-24 md:pb-8 md:pr-24">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="max-w-2xl w-full"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-2xl"
        >
          <CheckCircle className="w-12 h-12 text-white" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center mb-6"
        >
          <h1 className="text-2xl md:text-3xl mb-3">Session Booked Successfully! 🎉</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your expert session has been confirmed. Check your email for details.
          </p>
        </motion.div>

        {/* Booking Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 mb-6"
        >
          {/* Booking ID */}
          <div className="text-center mb-6 pb-6 border-b border-white/10 dark:border-gray-800/50">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Booking ID</p>
            <p className="text-xl text-orange-600 dark:text-orange-400 tracking-wider">{bookingDetails.bookingId}</p>
          </div>

          {/* Expert Info */}
          <div className="flex items-center gap-4 mb-6 p-4 rounded-xl glass dark:glass-dark backdrop-blur-xl">
            <img
              src={bookingDetails.expert.image}
              alt={bookingDetails.expert.name}
              className="w-16 h-16 rounded-xl object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <GraduationCap className="w-4 h-4 text-orange-500 dark:text-orange-400" />
                <h3 className="text-lg">{bookingDetails.expert.name}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{bookingDetails.expert.expertise}</p>
            </div>
          </div>

          {/* Session Details */}
          <div className="space-y-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl glass dark:glass-dark backdrop-blur-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-500">Session Date</p>
                <p className="text-sm">{bookingDetails.session.date}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl glass dark:glass-dark backdrop-blur-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-500">Time & Duration</p>
                <p className="text-sm">{bookingDetails.session.time} • {bookingDetails.session.duration}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl glass dark:glass-dark backdrop-blur-xl flex items-center justify-center">
                <MapPin className="w-5 h-5 text-orange-500 dark:text-orange-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 dark:text-gray-500">Meeting Mode</p>
                <p className="text-sm">{bookingDetails.session.mode}</p>
              </div>
            </div>
          </div>

          {/* Meeting Link */}
          {bookingDetails.session.mode === 'Online' && (
            <div className="p-4 rounded-xl glass dark:glass-dark backdrop-blur-xl bg-blue-500/5 border border-blue-500/20 mb-6">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Meeting Link</p>
              <div className="flex items-center gap-2">
                <p className="text-sm text-blue-600 dark:text-blue-400 break-all flex-1">
                  {bookingDetails.session.meetingLink}
                </p>
                <button className="p-2 rounded-lg glass dark:glass-dark hover:bg-blue-500/10 transition-all">
                  <Share2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Link will be sent to your email 1 hour before the session
              </p>
            </div>
          )}

          {/* Payment Summary */}
          <div className="p-4 rounded-xl glass dark:glass-dark backdrop-blur-xl">
            <p className="text-sm mb-3">Payment Summary</p>
            <div className="space-y-2 text-sm mb-3">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Session Fee</span>
                <span>₹{bookingDetails.payment.sessionFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Platform Fee</span>
                <span>₹{bookingDetails.payment.platformFee.toLocaleString()}</span>
              </div>
              <div className="h-px bg-white/10 dark:bg-gray-800/50"></div>
              <div className="flex justify-between">
                <span>Total Paid</span>
                <span className="text-lg text-green-600 dark:text-green-400">₹{bookingDetails.payment.totalPaid.toLocaleString()}</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Transaction ID: {bookingDetails.payment.transactionId}
            </p>
          </div>
        </motion.div>

        {/* Expert Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="glass dark:glass-dark rounded-2xl p-5 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 mb-6"
        >
          <p className="text-sm mb-3">Expert Contact Information</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gray-500 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">{bookingDetails.expert.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500 dark:text-gray-500" />
              <span className="text-gray-600 dark:text-gray-400">{bookingDetails.expert.phone}</span>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="grid grid-cols-2 gap-4 mb-6"
        >
          <button className="py-3 px-4 rounded-xl glass dark:glass-dark backdrop-blur-xl border border-white/20 dark:border-gray-800/50 hover:bg-white/10 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2">
            <Download className="w-5 h-5" />
            <span className="text-sm">Download Receipt</span>
          </button>
          <button className="py-3 px-4 rounded-xl glass dark:glass-dark backdrop-blur-xl border border-white/20 dark:border-gray-800/50 hover:bg-white/10 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2">
            <Share2 className="w-5 h-5" />
            <span className="text-sm">Share Details</span>
          </button>
        </motion.div>

        {/* Bottom Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <button
            onClick={() => onNavigate('bookings')}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            <span>View My Bookings</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => onNavigate('home')}
            className="w-full py-3 rounded-xl glass dark:glass-dark backdrop-blur-xl border border-white/20 dark:border-gray-800/50 hover:bg-white/10 dark:hover:bg-white/5 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </motion.div>

        {/* Email Notification Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-6 text-center"
        >
          <p className="text-xs text-gray-500 dark:text-gray-500">
            📧 Confirmation email sent to your registered email address
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
