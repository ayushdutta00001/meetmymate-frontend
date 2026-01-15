import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ProfileCard } from '../Card';
import { Search, Sparkles, TrendingUp, Users, Heart, UserPlus } from 'lucide-react';
import { Button } from '../Button';
import { BackButton } from '../ui/BackButton';
import { FilterButton } from '../ui/FilterButton';
import { ResponsiveContainer } from '../ui/ResponsiveContainer';

interface RentFriendScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function RentFriendScreen({ onNavigate, onBack }: RentFriendScreenProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 5000],
    gender: 'all',
    age: [18, 60],
    interests: [] as string[],
    city: 'all',
  });

  const profiles = [
    {
      id: 1,
      name: 'Priya',
      age: 25,
      city: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1543807641-bd607cfa8dca?w=400',
      price: 500,
      rating: 4.8,
      bio: 'Love exploring cafes, hiking, and deep conversations. Let\'s make memories!',
      availability: true,
    },
    {
      id: 2,
      name: 'Rahul',
      age: 28,
      city: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      price: 600,
      rating: 4.9,
      bio: 'Tech enthusiast, foodie, and adventure seeker. Always up for new experiences!',
      availability: true,
    },
    {
      id: 3,
      name: 'Ananya',
      age: 23,
      city: 'Delhi',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      price: 450,
      rating: 4.7,
      bio: 'Artist and music lover. Enjoy gallery visits, concerts, and creative projects.',
      availability: false,
    },
    {
      id: 4,
      name: 'Arjun',
      age: 30,
      city: 'Bangalore',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      price: 700,
      rating: 5.0,
      bio: 'Fitness coach and sports enthusiast. Let\'s hit the gym or play some sports!',
      availability: true,
    },
  ];

  const interests = ['Coffee', 'Movies', 'Sports', 'Music', 'Travel', 'Food', 'Art', 'Gaming'];
  const cities = ['all', 'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Hyderabad'];

  const quickActions = [
    { icon: Sparkles, label: 'AI Match', color: 'from-purple-500 to-pink-500' },
    { icon: TrendingUp, label: 'Trending', color: 'from-orange-500 to-red-500' },
    { icon: Users, label: 'Nearby', color: 'from-blue-500 to-cyan-500' },
  ];

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <ResponsiveContainer maxWidth="7xl">
          <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 md:gap-4">
                <BackButton onClick={onBack} />
                <div>
                  <h2>Rent your Friend</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {profiles.length} people available
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 md:gap-3">
                {/* Become a Friend Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('friend-onboarding')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm hidden md:inline">Become a Friend</span>
                </motion.button>

                {/* Provider Dashboard Access */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('provider-dashboard')}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span className="text-sm hidden md:inline">Provider Dashboard</span>
                </motion.button>
                
                <FilterButton 
                  onClick={() => setShowFilters(!showFilters)}
                  isActive={showFilters}
                />
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for people..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
              />
            </div>

            {/* Quick Actions */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex-shrink-0 px-5 py-2.5 rounded-full flex items-center gap-2 bg-gradient-to-r ${action.color} text-white shadow-lg`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{action.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </ResponsiveContainer>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 glass dark:glass-dark rounded-3xl p-6"
          >
            <h4 className="mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filters
            </h4>
            
            <div className="space-y-4">
              {/* Price range */}
              <div>
                <label className="block text-sm mb-2">
                  Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}/hour
                </label>
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={filters.priceRange[1]}
                  onChange={(e) => setFilters({
                    ...filters,
                    priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                  })}
                  className="w-full"
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm mb-2">Gender</label>
                <div className="flex gap-2">
                  {['all', 'male', 'female', 'other'].map((gender) => (
                    <button
                      key={gender}
                      onClick={() => setFilters({ ...filters, gender })}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        filters.gender === gender
                          ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                          : 'bg-[#F2F4F7] dark:bg-[#0A0F1F] hover:bg-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      {gender.charAt(0).toUpperCase() + gender.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <label className="block text-sm mb-2">Interests</label>
                <div className="flex flex-wrap gap-2">
                  {interests.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => {
                        const newInterests = filters.interests.includes(interest)
                          ? filters.interests.filter(i => i !== interest)
                          : [...filters.interests, interest];
                        setFilters({ ...filters, interests: newInterests });
                      }}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        filters.interests.includes(interest)
                          ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                          : 'bg-[#F2F4F7] dark:bg-[#0A0F1F] hover:bg-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm mb-2">City</label>
                <div className="flex gap-2">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => setFilters({ ...filters, city })}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        filters.city === city
                          ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                          : 'bg-[#F2F4F7] dark:bg-[#0A0F1F] hover:bg-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      {city.charAt(0).toUpperCase() + city.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Profiles grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProfileCard
                {...profile}
                onClick={() => onNavigate('user-profile')}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}