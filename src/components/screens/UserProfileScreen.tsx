import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../Card';
import { Button } from '../Button';
import { ArrowLeft, MapPin, Briefcase, Star, MessageCircle, Calendar, Shield, Flag, Heart, Coffee, Music, Camera } from 'lucide-react';

interface UserProfileScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function UserProfileScreen({ onNavigate, onBack }: UserProfileScreenProps) {
  const [selectedTab, setSelectedTab] = useState<'about' | 'reviews'>('about');

  const profile = {
    name: 'Priya',
    age: 25,
    city: 'Mumbai',
    profession: 'Graphic Designer',
    image: 'https://images.unsplash.com/photo-1543807641-bd607cfa8dca?w=600',
    price: 500,
    rating: 4.8,
    totalReviews: 127,
    completedMeetings: 89,
    responseTime: '< 10 mins',
    verified: true,
    bio: 'Hey there! I\'m Priya, a creative soul who loves exploring Mumbai\'s hidden gems. Whether it\'s checking out a new cafe, visiting art galleries, or just having deep conversations over coffee, I\'m always up for making new connections. I believe every person has a unique story to share!',
    interests: ['Art', 'Coffee', 'Photography', 'Music', 'Travel', 'Books'],
    languages: ['English', 'Hindi', 'Marathi'],
    availability: [
      { day: 'Monday', times: ['10:00 AM - 2:00 PM', '5:00 PM - 9:00 PM'] },
      { day: 'Tuesday', times: ['5:00 PM - 9:00 PM'] },
      { day: 'Wednesday', times: ['10:00 AM - 2:00 PM'] },
      { day: 'Thursday', times: ['5:00 PM - 9:00 PM'] },
      { day: 'Friday', times: ['10:00 AM - 9:00 PM'] },
      { day: 'Saturday', times: ['10:00 AM - 11:00 PM'] },
      { day: 'Sunday', times: ['12:00 PM - 8:00 PM'] },
    ],
  };

  const reviews = [
    {
      id: 1,
      userName: 'Rahul S.',
      userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      rating: 5,
      date: '2 days ago',
      comment: 'Had an amazing time! Priya is super friendly and helped me explore some great cafes in Mumbai. Highly recommended!',
    },
    {
      id: 2,
      userName: 'Ananya K.',
      userImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      rating: 5,
      date: '1 week ago',
      comment: 'Great experience! Very punctual and engaging conversation. Would love to meet again.',
    },
    {
      id: 3,
      userName: 'Arjun M.',
      userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      rating: 4,
      date: '2 weeks ago',
      comment: 'Nice person to hang out with. Good vibes and interesting stories!',
    },
  ];

  const interestIcons: Record<string, any> = {
    Art: Camera,
    Coffee: Coffee,
    Music: Music,
    Photography: Camera,
    Travel: MapPin,
    Books: Heart,
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <button className="w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center">
              <Flag className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card variant="glass" hover={false}>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="relative w-full md:w-48 aspect-square md:aspect-auto">
                <img
                  src={profile.image}
                  alt={profile.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
                {profile.verified && (
                  <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h2 className="mb-1">{profile.name}, {profile.age}</h2>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{profile.city}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Briefcase className="w-4 h-4" />
                      <span className="text-sm">{profile.profession}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#3C82F6] dark:text-[#3758FF]">
                      ₹{profile.price}
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">per hour</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">{profile.rating}</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      ({profile.totalReviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4" />
                    <span>{profile.completedMeetings} meetings</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="primary"
                    fullWidth
                    icon={<Calendar className="w-5 h-5" />}
                    onClick={() => onNavigate('booking')}
                  >
                    Book Now
                  </Button>
                </div>
                
                {/* Chat Disabled Notice */}
                <div className="mt-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-xs text-center text-blue-700 dark:text-blue-400">
                    💬 Chat coming soon - Available after booking confirmation
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 my-6"
        >
          <button
            onClick={() => setSelectedTab('about')}
            className={`flex-1 py-3 rounded-2xl transition-all ${
              selectedTab === 'about'
                ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white shadow-lg'
                : 'glass dark:glass-dark'
            }`}
          >
            About
          </button>
          <button
            onClick={() => setSelectedTab('reviews')}
            className={`flex-1 py-3 rounded-2xl transition-all ${
              selectedTab === 'reviews'
                ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white shadow-lg'
                : 'glass dark:glass-dark'
            }`}
          >
            Reviews ({profile.totalReviews})
          </button>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {selectedTab === 'about' ? (
            <motion.div
              key="about"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <Card variant="glass" hover={false}>
                <h3 className="mb-3">About Me</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {profile.bio}
                </p>
              </Card>

              <Card variant="glass" hover={false}>
                <h3 className="mb-4">Interests</h3>
                <div className="flex flex-wrap gap-3">
                  {profile.interests.map((interest) => {
                    const Icon = interestIcons[interest] || Heart;
                    return (
                      <div
                        key={interest}
                        className="flex items-center gap-2 px-4 py-2 bg-[#F2F4F7] dark:bg-[#0A0F1F] rounded-full"
                      >
                        <Icon className="w-4 h-4 text-[#3C82F6] dark:text-[#3758FF]" />
                        <span>{interest}</span>
                      </div>
                    );
                  })}
                </div>
              </Card>

              <Card variant="glass" hover={false}>
                <h3 className="mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((language) => (
                    <span
                      key={language}
                      className="px-4 py-2 bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white rounded-full"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </Card>

              <Card variant="glass" hover={false}>
                <h3 className="mb-4">Availability</h3>
                <div className="space-y-3">
                  {profile.availability.map((slot) => (
                    <div
                      key={slot.day}
                      className="flex items-start justify-between p-3 bg-[#F2F4F7] dark:bg-[#0A0F1F] rounded-xl"
                    >
                      <span className="font-medium">{slot.day}</span>
                      <div className="text-right text-sm text-gray-600 dark:text-gray-400">
                        {slot.times.map((time, i) => (
                          <div key={i}>{time}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          ) : (
            <motion.div
              key="reviews"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {reviews.map((review) => (
                <Card key={review.id} variant="glass" hover={false}>
                  <div className="flex gap-4">
                    <img
                      src={review.userImage}
                      alt={review.userName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4>{review.userName}</h4>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {review.date}
                        </span>
                      </div>
                      <div className="flex gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? 'text-yellow-500 fill-yellow-500'
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}