import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  MessageCircle, 
  MoreVertical,
  Heart,
  Filter,
  Search,
  TrendingUp,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  Mail,
  Star,
  X,
  BadgeCheck,
} from 'lucide-react';
import { Card } from '../Card';
import { ResponsiveContainer } from '../ui/ResponsiveContainer';
import { ResponsiveButton } from '../ui/ResponsiveButton';

interface UserBookingDashboardProps {
  onNavigate: (page: string) => void;
}

interface PastBooking {
  id: string;
  provider: {
    name: string;
    image: string;
    rating: number;
  };
  date: string;
  time: string;
  location: string;
  type: string;
  status: string;
  amount: number;
  reviewed: boolean;
}

export function UserBookingDashboard({ onNavigate }: UserBookingDashboardProps) {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'saved'>('upcoming');
  const [searchQuery, setSearchQuery] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<PastBooking | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showError, setShowError] = useState(false);
  const [pastBookingsState, setPastBookingsState] = useState<PastBooking[]>([
    {
      id: 'MMM-2025-11-028',
      provider: {
        name: 'Ananya Desai',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
        rating: 4.7,
      },
      date: 'November 28, 2025',
      time: '3:00 PM - 7:00 PM',
      location: 'Jehangir Art Gallery',
      type: 'Art Gallery Visit',
      status: 'completed',
      amount: 800,
      reviewed: false,
    },
    {
      id: 'MMM-2025-11-025',
      provider: {
        name: 'Vikram Singh',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
        rating: 4.9,
      },
      date: 'November 25, 2025',
      time: '10:00 AM - 2:00 PM',
      location: 'Gateway of India',
      type: 'City Tour',
      status: 'completed',
      amount: 900,
      reviewed: true,
    },
  ]);

  const maxCharacters = 500;

  const upcomingBookings = [
    {
      id: 'MMM-2025-12-001',
      provider: {
        name: 'Priya Sharma',
        image: 'https://images.unsplash.com/photo-1543807641-bd607cfa8dca?w=400',
        rating: 4.8,
      },
      date: 'December 15, 2025',
      time: '2:00 PM - 6:00 PM',
      location: 'Coffee Culture Cafe, Bandra',
      type: 'Casual Hangout',
      status: 'confirmed',
      amount: 900,
    },
    {
      id: 'MMM-2025-12-002',
      provider: {
        name: 'Rahul Verma',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        rating: 4.9,
      },
      date: 'December 18, 2025',
      time: '5:00 PM - 7:00 PM',
      location: 'Phoenix Marketcity',
      type: 'Shopping Companion',
      status: 'pending',
      amount: 600,
    },
    {
      id: 'MMM-2025-12-003',
      provider: {
        name: 'Arjun Mehta',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        rating: 5.0,
      },
      date: 'December 20, 2025',
      time: '6:00 AM - 8:00 AM',
      location: 'Fitness First Gym, Lower Parel',
      type: 'Workout Session',
      status: 'confirmed',
      amount: 700,
    },
  ];

  const savedProviders = [
    {
      id: 1,
      name: 'Sneha Patel',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      rating: 4.8,
      price: 550,
      interests: ['Fashion', 'Shopping'],
      availability: true,
    },
    {
      id: 2,
      name: 'Karan Malhotra',
      image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400',
      rating: 4.7,
      price: 650,
      interests: ['Food', 'Travel'],
      availability: false,
    },
    {
      id: 3,
      name: 'Diya Kapoor',
      image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400',
      rating: 4.9,
      price: 700,
      interests: ['Music', 'Dance'],
      availability: true,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'completed':
        return 'bg-blue-500/10 text-blue-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-4 h-4" />;
      case 'pending':
        return <AlertCircle className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleReviewSubmit = () => {
    if (selectedRating > 0 && reviewText.trim().length > 0) {
      const updatedBookings = pastBookingsState.map((booking) => {
        if (booking.id === selectedBooking?.id) {
          return {
            ...booking,
            reviewed: true,
          };
        }
        return booking;
      });
      setPastBookingsState(updatedBookings);
      setShowReviewModal(false);
      setSelectedBooking(null);
      setSelectedRating(0);
      setReviewText('');
    } else {
      setShowError(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2 className="mb-4">My Bookings</h2>

          {/* Tabs */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-6 py-2.5 rounded-full text-sm transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                  : 'glass dark:glass-dark hover:bg-white/20 dark:hover:bg-white/10'
              }`}
            >
              Upcoming ({upcomingBookings.length})
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`px-6 py-2.5 rounded-full text-sm transition-all ${
                activeTab === 'past'
                  ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                  : 'glass dark:glass-dark hover:bg-white/20 dark:hover:bg-white/10'
              }`}
            >
              Past ({pastBookingsState.length})
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`px-6 py-2.5 rounded-full text-sm transition-all ${
                activeTab === 'saved'
                  ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                  : 'glass dark:glass-dark hover:bg-white/20 dark:hover:bg-white/10'
              }`}
            >
              Saved ({savedProviders.length})
            </button>
          </div>

          {/* Search */}
          {activeTab !== 'saved' && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              />
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Upcoming Bookings */}
        {activeTab === 'upcoming' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {upcomingBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="overflow-hidden">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Provider Image */}
                    <div className="relative w-full md:w-32 h-48 md:h-32 -m-6 md:m-0 mb-4 md:mb-0 md:rounded-2xl overflow-hidden flex-shrink-0">
                      <img
                        src={booking.provider.image}
                        alt={booking.provider.name}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="mb-1">{booking.provider.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.type}
                          </p>
                        </div>
                        <button className="w-8 h-8 rounded-full glass dark:glass-dark flex items-center justify-center">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-[#3C82F6] dark:text-[#3758FF]" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-[#3C82F6] dark:text-[#3758FF]" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm md:col-span-2">
                          <MapPin className="w-4 h-4 text-[#3C82F6] dark:text-[#3758FF]" />
                          <span>{booking.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Amount Paid</p>
                          <p className="text-[#3C82F6] dark:text-[#3758FF]">₹{booking.amount}</p>
                        </div>
                        <div className="flex gap-2">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onNavigate('chat')}
                            className="px-4 py-2 bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white rounded-full text-sm flex items-center gap-2 relative"
                          >
                            <MessageCircle className="w-4 h-4" />
                            Chat
                            <span className="absolute -top-1 -right-1 bg-white/20 text-white text-[8px] px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                              Soon
                            </span>
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-2 glass dark:glass-dark rounded-full text-sm"
                          >
                            View Details
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Past Bookings */}
        {activeTab === 'past' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {pastBookingsState.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="overflow-hidden">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Provider Image */}
                    <div className="relative w-full md:w-32 h-48 md:h-32 -m-6 md:m-0 mb-4 md:mb-0 md:rounded-2xl overflow-hidden flex-shrink-0">
                      <img
                        src={booking.provider.image}
                        alt={booking.provider.name}
                        className="w-full h-full object-cover grayscale opacity-70"
                      />
                      <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="mb-1">{booking.provider.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.type}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">{booking.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600 dark:text-gray-400">{booking.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                        <div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Amount Paid</p>
                          <p>₹{booking.amount}</p>
                        </div>
                        <div className="flex gap-2">
                          {!booking.reviewed && (
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowReviewModal(true);
                              }}
                              className="px-4 py-2 bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white rounded-full text-sm"
                            >
                              Write Review
                            </motion.button>
                          )}
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => onNavigate('user-profile')}
                            className="px-4 py-2 glass dark:glass-dark rounded-full text-sm"
                          >
                            Book Again
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Saved Providers */}
        {activeTab === 'saved' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {savedProviders.map((provider, index) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="overflow-hidden group cursor-pointer">
                  <div className="relative h-48 -m-6 mb-4 overflow-hidden">
                    <img
                      src={provider.image}
                      alt={provider.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center"
                    >
                      <Heart className="w-4 h-4 text-red-500 fill-current" />
                    </motion.button>
                    <div className="absolute bottom-3 left-3">
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        provider.availability 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-500 text-white'
                      }`}>
                        {provider.availability ? 'Available' : 'Busy'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4>{provider.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-yellow-500 text-sm">★</span>
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {provider.rating}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400">from</p>
                        <p className="text-[#3C82F6] dark:text-[#3758FF]">₹{provider.price}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {provider.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-2 py-1 bg-[#F2F4F7] dark:bg-[#0A0F1F] rounded-full text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onNavigate('user-profile')}
                      className="w-full py-2 bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white rounded-full text-sm"
                    >
                      View Profile
                    </motion.button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && selectedBooking && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowReviewModal(false);
                setSelectedBooking(null);
                setSelectedRating(0);
                setReviewText('');
                setShowError(false);
              }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg glass dark:glass-dark rounded-2xl border border-white/10 dark:border-gray-800/50 backdrop-blur-xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-gray-800/50">
                  <div>
                    <h3 className="text-xl mb-1">Write a Review</h3>
                    <p className="text-sm text-gray-400">
                      How was your experience with {selectedBooking.provider.name}?
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      setSelectedBooking(null);
                      setSelectedRating(0);
                      setReviewText('');
                      setShowError(false);
                    }}
                    className="w-8 h-8 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center flex-shrink-0"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Provider Info */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 dark:bg-white/5">
                    <img
                      src={selectedBooking.provider.image}
                      alt={selectedBooking.provider.name}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="text-sm mb-1">{selectedBooking.provider.name}</h4>
                      <p className="text-xs text-gray-400">{selectedBooking.type}</p>
                      <p className="text-xs text-gray-500">{selectedBooking.date}</p>
                    </div>
                  </div>

                  {/* Rating Selector */}
                  <div>
                    <label className="text-sm text-gray-400 mb-3 block">
                      Your Rating <span className="text-red-400">*</span>
                    </label>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            setSelectedRating(star);
                            setShowError(false);
                          }}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded"
                        >
                          <Star
                            className={`w-8 h-8 transition-colors ${
                              star <= (hoveredRating || selectedRating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-gray-700 text-gray-600 hover:text-gray-500'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    {showError && selectedRating === 0 && (
                      <p className="text-xs text-red-400 mt-2">Please select a rating</p>
                    )}
                  </div>

                  {/* Review Text Input */}
                  <div>
                    <label className="text-sm text-gray-400 mb-3 block">
                      Your Review <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => {
                        if (e.target.value.length <= maxCharacters) {
                          setReviewText(e.target.value);
                          setShowError(false);
                        }
                      }}
                      placeholder="Share your experience with this service..."
                      rows={6}
                      className={`w-full px-4 py-3 rounded-xl bg-gray-900/50 border-2 transition-all outline-none text-sm text-gray-200 placeholder-gray-500 resize-none ${
                        showError && reviewText.trim().length === 0
                          ? 'border-red-500/50 focus:border-red-500'
                          : 'border-white/10 focus:border-blue-500'
                      }`}
                    />
                    <div className="flex items-center justify-between mt-2">
                      {showError && reviewText.trim().length === 0 && (
                        <p className="text-xs text-red-400">Please write a review</p>
                      )}
                      <div className="ml-auto text-xs text-gray-500">
                        {reviewText.length} / {maxCharacters}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center gap-3 p-6 border-t border-white/10 dark:border-gray-800/50">
                  <button
                    onClick={() => {
                      setShowReviewModal(false);
                      setSelectedBooking(null);
                      setSelectedRating(0);
                      setReviewText('');
                      setShowError(false);
                    }}
                    className="flex-1 px-6 py-3 rounded-xl glass dark:glass-dark hover:bg-white/5 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReviewSubmit}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all text-sm font-medium"
                  >
                    Submit Review
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}