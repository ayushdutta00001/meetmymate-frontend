import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Calendar, Clock, MapPin, Download, MessageCircle, Home } from 'lucide-react';
import { Card } from '../Card';
import { ResponsiveContainer } from '../ui/ResponsiveContainer';

interface BookingConfirmationScreenProps {
  onNavigate: (page: string) => void;
}

export function BookingConfirmationScreen({ onNavigate }: BookingConfirmationScreenProps) {
  const booking = {
    id: 'MMM-2025-12-001',
    provider: {
      name: 'Priya Sharma',
      image: 'https://images.unsplash.com/photo-1543807641-bd607cfa8dca?w=400',
      rating: 4.8,
    },
    date: 'December 15, 2025',
    time: '2:00 PM - 6:00 PM',
    duration: '4 hours',
    location: 'Coffee Culture Cafe, Bandra West, Mumbai',
    totalAmount: 900,
    meetingType: 'Casual Hangout',
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24 flex items-center justify-center p-4">
      <ResponsiveContainer maxWidth="2xl">
        <div className="w-full px-4 md:px-6">
          {/* Success Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="text-center mb-6 md:mb-8"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-block relative"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-green-500 blur-xl"
              />
              <CheckCircle className="w-20 h-20 md:w-24 md:h-24 text-green-500 relative z-10" strokeWidth={1.5} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 mb-2"
            >
              Booking Confirmed!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-gray-600 dark:text-gray-400"
            >
              Your booking has been successfully confirmed
            </motion.p>
          </motion.div>

          {/* Booking Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card variant="glass" className="mb-6">
              <div className="space-y-6">
                {/* Provider Info */}
                <div className="flex items-center gap-4 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <img
                    src={booking.provider.image}
                    alt={booking.provider.name}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="mb-1">{booking.provider.name}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">★</span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {booking.provider.rating} rating
                      </span>
                    </div>
                  </div>
                </div>

                {/* Booking ID */}
                <div className="flex items-center justify-between p-4 bg-[#F2F4F7] dark:bg-[#0A0F1F] rounded-xl">
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Booking ID</p>
                    <p className="font-mono">{booking.id}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center"
                  >
                    <Download className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date</p>
                      <p>{booking.date}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Time</p>
                      <p>{booking.time}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 md:col-span-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Location</p>
                      <p>{booking.location}</p>
                    </div>
                  </div>
                </div>

                {/* Meeting Type */}
                <div className="p-4 bg-gradient-to-r from-[#3C82F6]/10 to-[#1F3C88]/10 rounded-xl">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Meeting Type</p>
                  <p>{booking.meetingType}</p>
                </div>

                {/* Total Amount */}
                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-gray-600 dark:text-gray-400">Duration ({booking.duration})</p>
                    <p>₹{booking.totalAmount}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <h4>Total Paid</h4>
                    <h3 className="text-[#3C82F6] dark:text-[#3758FF]">₹{booking.totalAmount}</h3>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('chat')}
              className="flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white rounded-2xl hover:shadow-lg transition-all relative overflow-hidden"
            >
              <MessageCircle className="w-5 h-5" />
              Chat with {booking.provider.name.split(' ')[0]}
              <span className="absolute top-1 right-2 bg-white/20 text-white text-[9px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                Coming Soon
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onNavigate('bookings')}
              className="flex items-center justify-center gap-2 py-4 glass dark:glass-dark rounded-2xl hover:bg-white/20 dark:hover:bg-white/10 transition-all"
            >
              <Calendar className="w-5 h-5" />
              View My Bookings
            </motion.button>
          </motion.div>

          {/* Home Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-center mt-6"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-2 px-6 py-2 text-[#3C82F6] dark:text-[#3758FF] hover:underline"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </motion.button>
          </motion.div>

          {/* Info Box */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8"
          >
            <Card variant="glass" className="bg-gradient-to-r from-blue-500/10 to-purple-500/10">
              <div className="text-center">
                <h4 className="mb-2">What's Next?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  We've sent a confirmation email with all the details. You'll receive a reminder 
                  24 hours before your booking. Feel free to chat with {booking.provider.name.split(' ')[0]} to 
                  finalize the meeting details.
                </p>
                <div className="flex items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-gray-600 dark:text-gray-400">Confirmed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span className="text-gray-600 dark:text-gray-400">Email Sent</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}