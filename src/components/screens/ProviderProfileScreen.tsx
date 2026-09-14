import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Shield, 
  Star, 
  MapPin, 
  Calendar, 
  Clock, 
  Heart,
  Share2,
  MessageCircle,
  BadgeCheck,
  Award,
  TrendingUp,
} from 'lucide-react';
import { Card } from '../Card';

interface ProviderProfileScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function ProviderProfileScreen({ onNavigate, onBack }: ProviderProfileScreenProps) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [isSaved, setIsSaved] = useState(false);

  const provider = {
    name: 'Priya Sharma',
    age: 25,
    city: 'Mumbai, India',
    image: 'https://images.unsplash.com/photo-1543807641-bd607cfa8dca?w=800',
    verified: true,
    rating: 4.8,
    reviews: 127,
    totalBookings: 450,
    responseTime: '< 2 hours',
    bio: 'Hi! I\'m Priya, a passionate traveler, foodie, and art enthusiast. I love meeting new people and exploring the vibrant culture of Mumbai. Whether it\'s trying out new cafes, visiting art galleries, or just having deep conversations over coffee, I\'m here to make your experience memorable. Let\'s create some amazing memories together!',
    interests: ['Coffee', 'Travel', 'Art', 'Photography', 'Food', 'Museums'],
    languages: ['English', 'Hindi', 'Marathi'],
    price: 500,
    availability: [
      { date: '2025-12-15', slots: ['10:00 AM', '2:00 PM', '5:00 PM'] },
      { date: '2025-12-16', slots: ['11:00 AM', '3:00 PM', '6:00 PM'] },
      { date: '2025-12-17', slots: ['9:00 AM', '1:00 PM', '4:00 PM'] },
    ],
    packages: [
      { duration: '2 hours', price: 500, popular: false },
      { duration: '4 hours', price: 900, popular: true },
      { duration: '8 hours', price: 1600, popular: false },
    ],
  };

  const reviews = [
    {
      id: 1,
      name: 'Amit Kumar',
      rating: 5,
      date: '2 days ago',
      comment: 'Had an amazing time! Priya is very friendly and knows all the best spots in Mumbai. Highly recommend!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      rating: 4.5,
      date: '1 week ago',
      comment: 'Great experience exploring the art galleries. Very knowledgeable and fun to hang out with.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    {
      id: 3,
      name: 'Ravi Patel',
      rating: 5,
      date: '2 weeks ago',
      comment: 'Professional and punctual. Made my business trip to Mumbai much more enjoyable!',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center"
              >
                <Share2 className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSaved(!isSaved)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isSaved 
                    ? 'bg-gradient-to-r from-pink-500 to-red-500 text-white' 
                    : 'glass dark:glass-dark'
                }`}
              >
                <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="glass" className="overflow-hidden">
                <div className="relative h-80 -m-6 mb-4">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {provider.verified && (
                    <div className="absolute top-4 right-4">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: 'spring' }}
                        className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-full text-sm"
                      >
                        <BadgeCheck className="w-4 h-4" />
                        <span>Verified</span>
                      </motion.div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="mb-1">{provider.name}, {provider.age}</h2>
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{provider.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F]">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-lg">{provider.rating}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {provider.reviews} reviews
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F]">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Award className="w-4 h-4 text-[#3C82F6] dark:text-[#3758FF]" />
                        <span className="text-lg">{provider.totalBookings}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Total bookings
                      </p>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F]">
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{provider.responseTime}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Response time
                      </p>
                    </div>
                  </div>

                  {/* Bio */}
                  <div>
                    <h4 className="mb-2">About Me</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {provider.bio}
                    </p>
                  </div>

                  {/* Interests */}
                  <div>
                    <h4 className="mb-2">Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {provider.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#3C82F6]/10 to-[#1F3C88]/10 text-[#3C82F6] dark:text-[#3758FF] rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <h4 className="mb-2">Languages</h4>
                    <div className="flex gap-2">
                      {provider.languages.map((language) => (
                        <span
                          key={language}
                          className="px-3 py-1.5 bg-[#F2F4F7] dark:bg-[#0A0F1F] rounded-full text-sm"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card variant="glass">
                <h3 className="mb-4">Reviews ({provider.reviews})</h3>
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="p-4 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F]"
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm">{review.name}</h4>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < Math.floor(review.rating)
                                    ? 'text-yellow-500 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                            <span className="text-sm ml-1">{review.rating}</span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mt-4 py-2 text-sm text-[#3C82F6] dark:text-[#3758FF] hover:underline"
                >
                  View All Reviews
                </motion.button>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="sticky top-24"
            >
              <Card variant="glass">
                <h3 className="mb-4">Book Now</h3>

                {/* Pricing Packages */}
                <div className="space-y-3 mb-6">
                  {provider.packages.map((pkg, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        pkg.popular
                          ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                          : 'bg-[#F2F4F7] dark:bg-[#0A0F1F] hover:bg-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm mb-1">{pkg.duration}</p>
                          <p className={pkg.popular ? 'text-white' : ''}>
                            ₹{pkg.price}
                          </p>
                        </div>
                        {pkg.popular && (
                          <span className="px-2 py-1 bg-[#FFF27C] text-[#0B0B0C] rounded-full text-xs">
                            Popular
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Availability Calendar */}
                <div className="mb-6">
                  <h4 className="mb-3 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Select Date
                  </h4>
                  <div className="space-y-2">
                    {provider.availability.map((day) => (
                      <button
                        key={day.date}
                        onClick={() => setSelectedDate(day.date)}
                        className={`w-full p-3 rounded-xl text-left transition-all ${
                          selectedDate === day.date
                            ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                            : 'bg-[#F2F4F7] dark:bg-[#0A0F1F] hover:bg-gray-200 dark:hover:bg-gray-800'
                        }`}
                      >
                        <p className="text-sm mb-1">
                          {new Date(day.date).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-xs opacity-80">
                          {day.slots.length} slots available
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onNavigate('booking')}
                    className="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all"
                    style={{ fontWeight: 600 }}
                  >
                    <Calendar className="w-5 h-5" />
                    Book Now - ₹{provider.price}/hr
                  </motion.button>

                  {/* Chat Disabled Message */}
                  <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <p className="text-xs text-center text-blue-700 dark:text-blue-400">
                      💬 Chat coming soon - Available after booking confirmation
                    </p>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-500" />
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Your booking is protected by our Satisfaction Guarantee
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}