import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ProfileCard } from '../Card';
import { Filter, Search, Sparkles, TrendingUp, MapPin, Star } from 'lucide-react';
import { BackButton } from '../ui/BackButton';
import { FilterButton } from '../ui/FilterButton';

interface ServiceProviderListingScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
  category?: string;
}

export function ServiceProviderListingScreen({ 
  onNavigate, 
  onBack,
  category = 'All Services'
}: ServiceProviderListingScreenProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    gender: 'all',
    availability: 'all',
    rating: 0,
    interests: [] as string[],
  });

  const providers = [
    {
      id: 1,
      name: 'Priya Sharma',
      age: 25,
      city: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1543807641-bd607cfa8dca?w=400',
      price: 500,
      rating: 4.8,
      reviews: 127,
      bio: 'Love exploring cafes, hiking, and deep conversations. Let\'s make memories!',
      availability: true,
      verified: true,
      interests: ['Coffee', 'Travel', 'Art'],
    },
    {
      id: 2,
      name: 'Rahul Verma',
      age: 28,
      city: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      price: 600,
      rating: 4.9,
      reviews: 203,
      bio: 'Tech enthusiast, foodie, and adventure seeker. Always up for new experiences!',
      availability: true,
      verified: true,
      interests: ['Tech', 'Food', 'Sports'],
    },
    {
      id: 3,
      name: 'Ananya Desai',
      age: 23,
      city: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      price: 450,
      rating: 4.7,
      reviews: 89,
      bio: 'Artist and music lover. Enjoy gallery visits, concerts, and creative projects.',
      availability: false,
      verified: true,
      interests: ['Art', 'Music', 'Movies'],
    },
    {
      id: 4,
      name: 'Arjun Mehta',
      age: 30,
      city: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      price: 700,
      rating: 5.0,
      reviews: 156,
      bio: 'Fitness coach and sports enthusiast. Let\'s hit the gym or play some sports!',
      availability: true,
      verified: true,
      interests: ['Fitness', 'Sports', 'Health'],
    },
    {
      id: 5,
      name: 'Sneha Patel',
      age: 26,
      city: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      price: 550,
      rating: 4.8,
      reviews: 142,
      bio: 'Fashion designer and shopping buddy. Love styling and exploring new trends.',
      availability: true,
      verified: false,
      interests: ['Fashion', 'Shopping', 'Design'],
    },
    {
      id: 6,
      name: 'Vikram Singh',
      age: 32,
      city: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      price: 800,
      rating: 4.9,
      reviews: 187,
      bio: 'Business consultant and mentor. Let\'s discuss strategies and grow together.',
      availability: true,
      verified: true,
      interests: ['Business', 'Mentoring', 'Networking'],
    },
  ];

  const interests = ['Coffee', 'Movies', 'Sports', 'Music', 'Travel', 'Food', 'Art', 'Gaming', 'Tech', 'Fitness'];

  const quickFilters = [
    { icon: Sparkles, label: 'Top Rated', value: 'top-rated' },
    { icon: TrendingUp, label: 'Trending', value: 'trending' },
    { icon: MapPin, label: 'Nearby', value: 'nearby' },
  ];

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <BackButton onClick={onBack} />
              <div>
                <h2>{category}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {providers.length} providers available
                </p>
              </div>
            </div>
            <FilterButton 
              onClick={() => setShowFilters(!showFilters)}
              isActive={showFilters}
            />
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search providers by name, interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-[#0B0B0C] dark:text-white text-sm"
            />
          </div>

          {/* Quick Filters */}
          <div className="flex gap-3 overflow-x-auto pb-2">
            {quickFilters.map((filter, index) => {
              const Icon = filter.icon;
              return (
                <motion.button
                  key={filter.value}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-shrink-0 px-5 py-2.5 rounded-full flex items-center gap-2 glass dark:glass-dark hover:bg-white/20 dark:hover:bg-white/10 transition-all"
                >
                  <Icon className="w-4 h-4 text-[#3C82F6] dark:text-[#3758FF]" />
                  <span className="text-sm">{filter.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 glass dark:glass-dark rounded-3xl p-6"
          >
            <h4 className="mb-4 flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Advanced Filters
            </h4>
            
            <div className="space-y-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm mb-2">
                  Price Range: ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}/hour
                </label>
                <div className="flex gap-4 items-center">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={filters.priceRange[1]}
                    onChange={(e) => setFilters({
                      ...filters,
                      priceRange: [filters.priceRange[0], parseInt(e.target.value)]
                    })}
                    className="w-full accent-[#3C82F6] dark:accent-[#3758FF]"
                  />
                </div>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm mb-2">Gender</label>
                <div className="flex gap-2 flex-wrap">
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

              {/* Availability */}
              <div>
                <label className="block text-sm mb-2">Availability</label>
                <div className="flex gap-2">
                  {['all', 'available', 'busy'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilters({ ...filters, availability: status })}
                      className={`px-4 py-2 rounded-full text-sm transition-all ${
                        filters.availability === status
                          ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                          : 'bg-[#F2F4F7] dark:bg-[#0A0F1F] hover:bg-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Minimum Rating */}
              <div>
                <label className="block text-sm mb-2">Minimum Rating</label>
                <div className="flex gap-2">
                  {[0, 4, 4.5, 4.8].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setFilters({ ...filters, rating })}
                      className={`px-4 py-2 rounded-full text-sm flex items-center gap-1 transition-all ${
                        filters.rating === rating
                          ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                          : 'bg-[#F2F4F7] dark:bg-[#0A0F1F] hover:bg-gray-200 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Star className="w-3 h-3 fill-current" />
                      {rating === 0 ? 'Any' : rating}
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

              {/* Clear Filters Button */}
              <button
                onClick={() => setFilters({
                  priceRange: [0, 10000],
                  gender: 'all',
                  availability: 'all',
                  rating: 0,
                  interests: [],
                })}
                className="w-full py-2 text-sm text-[#3C82F6] dark:text-[#3758FF] hover:underline"
              >
                Clear All Filters
              </button>
            </div>
          </motion.div>
        )}

        {/* Providers Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {providers.map((provider, index) => (
            <motion.div
              key={provider.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProfileCard
                {...provider}
                onClick={() => onNavigate('user-profile')}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white rounded-full hover:shadow-lg transition-all"
          >
            Load More Providers
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
}