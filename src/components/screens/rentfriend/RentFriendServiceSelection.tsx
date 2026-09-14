import React, { useEffect, useState } from 'react';
import { supabase } from "../../../supabase";
import { motion } from 'motion/react';
import { 
  Coffee, 
  Utensils, 
  PartyPopper, 
  MapPin, 
  Heart, 
  BookOpen,
  Film,
  Gamepad2,
  ShoppingBag,
  Camera,
  Music,
  Dumbbell,
  LayoutDashboard
} from 'lucide-react';
import { BackButton } from '../../ui/BackButton';

interface RentFriendServiceSelectionProps {
  onNavigate: (page: string, service?: string) => void;
  onBack: () => void;
}

export function RentFriendServiceSelection({ onNavigate, onBack }: RentFriendServiceSelectionProps) {
  const defaultServices = [
    {
      id: 'movie-buddy',
      title: 'Movie Buddy',
      description: 'Watch films together at cinema or home',
      icon: Film,
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600',
      priceFrom: 399
    },
    {
      id: 'dining-partner',
      title: 'Dining Partner',
      description: 'Enjoy meals and conversations together',
      icon: Utensils,
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600',
      priceFrom: 549
    },
    {
      id: 'party-companion',
      title: 'Party Companion',
      description: 'Hit events, clubs, and celebrations',
      icon: PartyPopper,
      gradient: 'from-fuchsia-500 via-purple-500 to-indigo-500',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600',
      priceFrom: 699
    },
    {
      id: 'explore-city',
      title: 'Explore City',
      description: 'Discover local spots and adventures',
      icon: MapPin,
      gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600',
      priceFrom: 599
    },
    {
      id: 'emotional-support',
      title: 'Emotional Support',
      description: 'Talk, vent, and find comfort',
      icon: Heart,
      gradient: 'from-pink-500 via-rose-500 to-red-500',
      image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=600',
      priceFrom: 449
    },
    {
      id: 'study-partner',
      title: 'Study Partner',
      description: 'Focus together and share knowledge',
      icon: BookOpen,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600',
      priceFrom: 349
    },
    {
      id: 'coffee-chat',
      title: 'Coffee Chat',
      description: 'Casual meetup over coffee and pastries',
      icon: Coffee,
      gradient: 'from-amber-500 via-orange-500 to-yellow-500',
      image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600',
      priceFrom: 299
    },
    {
      id: 'gaming-buddy',
      title: 'Gaming Buddy',
      description: 'Play games and compete together',
      icon: Gamepad2,
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500',
      image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=600',
      priceFrom: 399
    },
    {
      id: 'shopping-companion',
      title: 'Shopping Companion',
      description: 'Shop, style advice, and fun',
      icon: ShoppingBag,
      gradient: 'from-pink-500 via-fuchsia-500 to-purple-500',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600',
      priceFrom: 499
    },
    {
      id: 'photo-walk',
      title: 'Photo Walk',
      description: 'Capture moments around the city',
      icon: Camera,
      gradient: 'from-sky-500 via-blue-500 to-indigo-500',
      image: 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=600',
      priceFrom: 449
    },
    {
      id: 'concert-buddy',
      title: 'Concert Buddy',
      description: 'Enjoy live music and performances',
      icon: Music,
      gradient: 'from-rose-500 via-pink-500 to-fuchsia-500',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600',
      priceFrom: 799
    },
    {
      id: 'workout-partner',
      title: 'Workout Partner',
      description: 'Stay motivated at gym or outdoors',
      icon: Dumbbell,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600',
      priceFrom: 549
    },
  ];

  const [services, setServices] = useState(defaultServices);
const [loading, setLoading] = useState(true);
const handleServiceClick = (serviceId: string) => {
  onNavigate('rent-friend-booking', serviceId);
};

const loadServices = async () => {
  try {
    setLoading(true);

    const { data: sessionData } =
      await supabase.auth.getSession();

    const token =
      sessionData.session?.access_token;

    const response = await fetch(
      "https://stvejpshtkqrseriekjv.supabase.co/functions/v1/admin_get_raf_services",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    console.log("SERVICE SETTINGS", result);

    if (!result.success) return;

    const merged = defaultServices
      .map(service => {

        const db = result.services.find(
          (s: any) =>
            s.service_slug === service.id
        );

        if (!db) return null;

        return {

          ...service,

          priceFrom: db.price_per_hour,

          enabled: db.enabled,

        };

      })
      .filter(
        (service: any) =>
          service &&
          service.enabled
      );

    setServices(merged);

  } catch (err) {

    console.error(err);

  } finally {

    setLoading(false);

  }
};

useEffect(() => {
  loadServices();
}, []);

if (loading) {
  return (
    <div className="flex items-center justify-center h-screen">
     <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
</div>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-[#0A0F1F] dark:via-[#0D1425] dark:to-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 dark:bg-[#0A0F1F]/80 border-b border-gray-200/50 dark:border-gray-800/50"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <BackButton onClick={onBack} />
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
                Professional Networking
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Choose an activity to get started
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('become-friend')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm"
              >
                <Heart className="w-4 h-4" />
                Become a Friend
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onNavigate('provider-dashboard')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm"
              >
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </motion.button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-4 rounded-2xl glass dark:glass-dark border border-purple-200/50 dark:border-purple-800/30"
            >
              <p className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                500+
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Active Friends</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4 rounded-2xl glass dark:glass-dark border border-pink-200/50 dark:border-pink-800/30"
            >
              <p className="text-2xl font-semibold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
               {services.length}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Activities</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-4 rounded-2xl glass dark:glass-dark border border-blue-200/50 dark:border-blue-800/30"
            >
              <p className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                4.9
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Avg Rating</p>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.button
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleServiceClick(service.id)}
                className="group relative overflow-hidden rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50 hover:border-transparent transition-all duration-300"
              >

                {services.length === 0 && (
    <div className="text-center py-20">
        <h3 className="text-xl font-semibold">
            No services available
        </h3>

        <p className="text-gray-500 mt-2">
            Please check back later.
        </p>
    </div>
)}
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300`} />
                
                {/* Image Background */}
                <div className="relative h-32 md:h-40 overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Icon Overlay */}
                  <div className={`absolute top-3 right-3 p-2 rounded-xl bg-gradient-to-br ${service.gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 text-left">
                  <h3 className="text-sm md:text-base mb-1 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 dark:group-hover:from-purple-400 dark:group-hover:to-pink-400 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                    {service.description}
                  </p>
                  
                  {/* Price */}
                  <div className="flex items-baseline gap-1 mb-3">
                    <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      ₹{service.priceFrom}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-500">/hr</span>
                    <span className="text-xs text-gray-400 dark:text-gray-600">onwards</span>
                  </div>
                  
                  {/* Book Now Button */}
                  <div className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${service.gradient} text-white text-xs font-medium text-center group-hover:shadow-lg transition-all`}>
                    Book Now →
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 md:p-8 rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50"
        >
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-xl md:text-2xl mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              How It Works
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Find the perfect companion for any occasion in 3 simple steps
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg">
                  1
                </div>
                <h4 className="mb-2">Choose Activity</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Select from 12+ fun activities
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg">
                  2
                </div>
                <h4 className="mb-2">Pick Your Friend</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Browse verified profiles
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white text-xl font-bold mb-3 shadow-lg">
                  3
                </div>
                <h4 className="mb-2">Book & Meet</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Schedule and enjoy together
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
