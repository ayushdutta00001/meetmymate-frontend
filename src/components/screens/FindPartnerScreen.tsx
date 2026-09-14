import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ProfileCard } from '../Card';
import { ArrowLeft, Search, Filter, Handshake } from 'lucide-react';

interface FindPartnerScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function FindPartnerScreen({ onNavigate, onBack }: FindPartnerScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const cities = ['all', 'Mumbai', 'Delhi', 'Bangalore', 'Pune'];
  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'low', label: 'Under ₹1500' },
    { value: 'mid', label: '₹1500 - ₹2000' },
    { value: 'high', label: 'Above ₹2000' },
  ];

  const partners = [
    {
      id: 1,
      name: 'Aditya',
      age: 29,
      city: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      price: 1500,
      rating: 4.8,
      bio: 'Marketing strategist looking for tech co-founder. D2C & growth hacking expert.',
      availability: true,
    },
    {
      id: 2,
      name: 'Sneha',
      age: 27,
      city: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      price: 1800,
      rating: 4.9,
      bio: 'Product designer seeking business partner. 5+ years in SaaS and mobile apps.',
      availability: true,
    },
    {
      id: 3,
      name: 'Karan',
      age: 31,
      city: 'Mumbai',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      price: 2000,
      rating: 5.0,
      bio: 'Sales & operations expert. Looking to partner in B2B ventures.',
      availability: false,
    },
    {
      id: 4,
      name: 'Riya',
      age: 26,
      city: 'Delhi',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      price: 1600,
      rating: 4.7,
      bio: 'Content creator and influencer marketing specialist. E-commerce background.',
      availability: true,
    },
    {
      id: 5,
      name: 'Arjun',
      age: 33,
      city: 'Bangalore',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      price: 2200,
      rating: 4.9,
      bio: 'Full-stack developer seeking non-tech co-founder. Blockchain & AI expertise.',
      availability: true,
    },
    {
      id: 6,
      name: 'Nisha',
      age: 28,
      city: 'Pune',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      price: 1700,
      rating: 4.8,
      bio: 'Finance & operations specialist. Looking for tech-savvy business partner.',
      availability: true,
    },
  ];

  const filteredPartners = partners.filter((partner) => {
    const cityMatch = selectedCity === 'all' || partner.city === selectedCity;
    const priceMatch =
      priceRange === 'all' ||
      (priceRange === 'low' && partner.price < 1500) ||
      (priceRange === 'mid' && partner.price >= 1500 && partner.price <= 2000) ||
      (priceRange === 'high' && partner.price > 2000);
    return cityMatch && priceMatch;
  });

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass dark:glass-dark border-b border-white/20 dark:border-gray-800/50 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                <Handshake className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2>Find Your Partner</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Connect with co-founders & business partners
                </p>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search partners by skill, industry..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 rounded-xl glass dark:glass-dark border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-[#0B0B0C] dark:text-white text-sm backdrop-blur-xl"
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                showFilters ? 'bg-[#3C82F6] text-white' : 'glass dark:glass-dark hover:bg-[#3C82F6] hover:text-white'
              }`}
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 mb-4"
            >
              {/* City Filter */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">City</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {cities.map((city) => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all ${
                        selectedCity === city
                          ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                          : 'glass dark:glass-dark hover:bg-white/20 dark:hover:bg-white/10'
                      }`}
                    >
                      {city === 'all' ? 'All Cities' : city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-2 block">Price Range</label>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.value}
                      onClick={() => setPriceRange(range.value)}
                      className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all ${
                        priceRange === range.value
                          ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                          : 'glass dark:glass-dark hover:bg-white/20 dark:hover:bg-white/10'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass dark:glass-dark rounded-2xl p-4 mb-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent" style={{ fontWeight: 700 }}>
                {partners.length}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">Partners Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {partners.filter(p => p.availability).length} Online Now
              </span>
            </div>
          </div>
        </motion.div>

        {/* Profiles Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {filteredPartners.map((profile, index) => (
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