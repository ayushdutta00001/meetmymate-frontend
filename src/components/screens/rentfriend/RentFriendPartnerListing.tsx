import React, { useEffect, useState } from 'react';
import { supabase } from "../../../supabase";

import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  MapPin, 
  Clock, 
  Heart,
  SlidersHorizontal,
  X,
  ChevronDown,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import { BackButton } from '../../ui/BackButton';
import type { Screen } from "../../../UserApp";
interface RentFriendPartnerListingProps {
  onNavigate: (
    screen: Screen,
    param?: string | number
  ) => void;

  onBack: () => void;

  selectedService: string;
}

export function RentFriendPartnerListing({
  onNavigate,
  onBack,
  selectedService
}: RentFriendPartnerListingProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
const [priceFilter, setPriceFilter] = useState<string>('all');
const [ratingFilter, setRatingFilter] = useState<number>(0);
const [favorites, setFavorites] = useState<string[]>([]);
const [partners, setPartners] = useState<any[]>([]);

  const serviceNames: Record<string, string> = {
    'movie-buddy': 'Movie Buddy',
    'dining-partner': 'Dining Partner',
    'party-companion': 'Party Companion',
    'explore-city': 'Explore City',
    'emotional-support': 'Emotional Support',
    'study-partner': 'Study Partner',
    'coffee-chat': 'Coffee Chat',
    'gaming-buddy': 'Gaming Buddy',
    'shopping-companion': 'Shopping Companion',
    'photo-walk': 'Photo Walk',
    'concert-buddy': 'Concert Buddy',
    'workout-partner': 'Workout Partner',
  };

  useEffect(() => {
  fetchProviders();
}, [selectedService]);

const fetchProviders = async () => {
  const { data, error } = await supabase.functions.invoke(
    "get_available_providers",
    {
      body: {
        service_type: selectedService
        
      }
    }
  );
console.log("Providers:", data);

  if (error) {
    console.error("Fetch providers error:", error);
    return;
  }

  // 🔥 IMPORTANT: map backend → UI format
  const mapped = (data?.providers || []).map((p: any) => ({
    id: p.id, // MUST be UUID
    name: p.full_name,
    age: p.age || 25,
    image:
  p.profile_photo_url ||
  "https://via.placeholder.com/400",
   rating: p.avg_rating || 4.8,
total_reviews: p.total_reviews || 0,
   hourly_rate : p.hourly_rate || 0,
    city: p.city || "Unknown",
    interests: (p.services || []).map((service: string) =>
  serviceNames[service] || service
),
    availability: "Available Now",
    verified: true,
    bio: p.bio || "",
    responseTime: "5 min"
  }));

  setPartners(mapped);
};

  const quickFilters = [
    { id: 'all', label: 'All', icon: Users },
    { id: 'available', label: 'Available Now', icon: Clock },
    { id: 'top-rated', label: 'Top Rated', icon: Star },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
  ];

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const handleBookClick = (partnerId: string) => {
   onNavigate(
  'rent-friend-booking',
  JSON.stringify({
    providerId: partnerId,
    service: selectedService,
  })
);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-[#0A0F1F] dark:via-[#0D1425] dark:to-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-[#0A0F1F]/80 border-b border-gray-200/50 dark:border-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-4">
            <BackButton onClick={onBack} />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl md:text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {serviceNames[selectedService] || 'Find Your Friend'}
                </h1>
                <Sparkles className="w-5 h-5 text-purple-500" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {partners.length} friends available
              </p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 rounded-xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50 hover:border-purple-500 dark:hover:border-purple-500 transition-all"
            >
              <SlidersHorizontal className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {quickFilters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all ${
                    selectedFilter === filter.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50 hover:border-purple-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm">{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0A0F1F]"
          >
            <div className="max-w-7xl mx-auto px-4 py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Price Range</label>
                  <select
                    value={priceFilter}
                    onChange={(e) => setPriceFilter(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border border-gray-200 dark:border-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  >
                    <option value="all">All Prices</option>
                    <option value="0-500">Under ₹500</option>
                    <option value="500-700">₹500 - ₹700</option>
                    <option value="700+">Above ₹700</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Minimum Rating</label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border border-gray-200 dark:border-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  >
                    <option value="0">All Ratings</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.7">4.7+ Stars</option>
                    <option value="4.9">4.9+ Stars</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2 text-gray-700 dark:text-gray-300">Availability</label>
                  <select
                    className="w-full px-4 py-3 rounded-xl glass dark:glass-dark border border-gray-200 dark:border-gray-800 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                  >
                    <option>All Times</option>
                    <option>Available Now</option>
                    <option>Today</option>
                    <option>Tomorrow</option>
                  </select>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Partners Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {partners.length === 0 ? (
  <div className="text-center py-24">
    <h3 className="text-2xl mb-2 text-gray-700 dark:text-gray-300">
      No providers found
    </h3>

    <p className="text-gray-500 dark:text-gray-400">
      No companions are available for this activity yet.
    </p>
  </div>
) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner, index) => (
  <motion.div
    key={`${partner.id || "partner"}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              whileHover={{ y: -8 }}
              className="group relative rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50 hover:border-purple-500/50 dark:hover:border-purple-500/50 overflow-hidden transition-all duration-300"
            >
              
              
              {/* Background Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Image */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                
                {/* Verified Badge */}
                {partner.verified && (
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium shadow-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Verified
                  </div>
                )}

                {/* Favorite Button */}
                <button
                  onClick={() => toggleFavorite(partner.id)}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                    favorites.includes(partner.id)
                      ? 'bg-pink-500 text-white'
                      : 'bg-white/80 dark:bg-gray-900/80 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${favorites.includes(partner.id) ? 'fill-current' : ''}`} />
                </button>

                {/* Availability Badge */}
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full backdrop-blur-md bg-white/90 dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 text-xs font-medium flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${partner.availability === 'Available Now' ? 'bg-green-500' : 'bg-orange-500'}`} />
                  {partner.availability}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 relative">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg mb-1">{partner.name}, {partner.age}</h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4" />
                      {partner.city}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                    <Star className="w-4 h-4 text-amber-500 fill-current" />
                    <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                      {partner.rating}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                  {partner.bio}
                </p>

                {/* Interests */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {partner.interests.map((interest, idx) => (
  <span
    key={`${partner.id}-${interest}-${idx}`}
    className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium border border-purple-200 dark:border-purple-800"
  >
    {interest}
  </span>
))}
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-800">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {partner.total_reviews || 0} reviews
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    {partner.responseTime}
                  </div>
                </div>

                {/* Price and Book Button */}
                <div className="flex items-center justify-between gap-3">
                  <div>
                   
                    <div className="text-xs text-gray-600 dark:text-gray-400">per hour</div>
                  </div>
                  <button
                    onClick={() => handleBookClick(partner.id)}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium shadow-lg hover:shadow-xl transition-all hover:scale-105"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
      </div>
      
    </div>
  );
}
