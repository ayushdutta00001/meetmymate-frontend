import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from '../Card';
import { Search, MapPin, Bell, Users, Heart, Briefcase, Sparkles, TrendingUp } from 'lucide-react';
import { MatchNotificationBanner } from '../MatchNotificationBanner';
import { ResponsiveContainer } from '../ui/ResponsiveContainer';

interface HomeScreenProps {
  onNavigate: (page: string) => void;
  userName?: string;
}

export function HomeScreen({ onNavigate, userName = 'Alex' }: HomeScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [hasNewMatch, setHasNewMatch] = useState(true); // Set to true when admin creates a match
  const [showMatchNotification, setShowMatchNotification] = useState(true);

  const mainServices = [
    {
      id: 'rent-friend',
      title: 'Rent your Friend',
      description: 'Find companions for activities',
      icon: Users,
      gradient: 'from-blue-500 via-purple-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1763429642850-aa2de401e3e0?w=600',
      stats: '2.3K+ Available',
    },
    {
      id: 'blind-date',
      title: 'Blind Date',
      description: 'System-arranged meetings in public',
      icon: Heart,
      gradient: 'from-blue-600 via-indigo-600 to-blue-700',
      image: 'https://images.unsplash.com/photo-1615500025837-cf3a8716c83d?w=600',
      stats: 'Verified 21+ Only',
    },
    {
      id: 'business-meetup',
      title: 'Business Meetup',
      description: 'Network with professionals',
      icon: Briefcase,
      gradient: 'from-green-500 via-teal-500 to-blue-500',
      image: 'https://images.unsplash.com/photo-1496180470114-6ef490f3ff22?w=600',
      stats: '950+ Professionals',
    },
  ];

  const quickActions = [
    { icon: Sparkles, label: 'AI Match', color: 'from-purple-500 to-pink-500' },
    { icon: TrendingUp, label: 'Trending', color: 'from-orange-500 to-red-500' },
    { icon: Users, label: 'Nearby', color: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Match Notification Banner */}
      <AnimatePresence>
        {hasNewMatch && showMatchNotification && (
          <MatchNotificationBanner
            onViewMatch={() => {
              setShowMatchNotification(false);
              onNavigate('blind-date-match-found');
            }}
            onDismiss={() => setShowMatchNotification(false)}
          />
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <ResponsiveContainer maxWidth="7xl">
          <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Welcome back, {userName}! 👋
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mt-2 text-gray-600 dark:text-gray-400"
                >
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">Mumbai, India</span>
                </motion.div>
              </div>
              <div className="flex items-center gap-3">
                {/* Notification button or other actions can go here if needed */}
              </div>
            </div>

            {/* Search bar removed per user request */}
          </div>
        </ResponsiveContainer>
      </motion.div>

      {/* Main content */}
      <ResponsiveContainer maxWidth="7xl">
        <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
          {/* Main services */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="mb-4">Explore Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {mainServices.map((service, index) => {
                const Icon = service.icon;
                return (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <Card
                      variant="glass"
                      onClick={() => onNavigate(service.id)}
                      className="overflow-hidden group"
                    >
                      <div className="relative h-40 md:h-48 -m-6 mb-4 overflow-hidden">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-60`} />
                        <div className="absolute top-3 left-3 md:top-4 md:left-4">
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl glass backdrop-blur-md flex items-center justify-center">
                            <Icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                          </div>
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4">
                          <span className="text-white/90 text-xs md:text-sm">{service.stats}</span>
                        </div>
                      </div>
                      <h3 className="mb-2">{service.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {service.description}
                      </p>
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="text-[#3C82F6] dark:text-[#3758FF] flex items-center gap-2 min-h-[44px]"
                      >
                        Explore
                        <span>→</span>
                      </motion.button>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* AI Match section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-6 md:mt-8"
          >
            <Card variant="gradient" className="relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white mb-2">AI Match For You</h3>
                    <p className="text-white/80 text-sm">
                      Based on your preferences and activity
                    </p>
                  </div>
                  <Sparkles className="w-6 h-6 md:w-8 md:h-8 text-[#FFF27C]" />
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('ai-match')}
                  className="mt-4 px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all min-h-[44px]"
                >
                  Find My Match
                </motion.button>
              </div>
              <motion.div
                className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </Card>
          </motion.div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}