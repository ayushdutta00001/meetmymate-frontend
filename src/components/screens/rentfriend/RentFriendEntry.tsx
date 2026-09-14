import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { UserPlus, Search, Heart, Sparkles, Shield, Star } from 'lucide-react';
import { BackButton } from '../../ui/BackButton';
import { supabase } from '../../../supabase';

interface RentFriendEntryProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function RentFriendEntry({ onNavigate, onBack }: RentFriendEntryProps) {

const [isProvider, setIsProvider] = useState(false);
const [providerId, setProviderId] = useState<string | null>(null);
const [isOnline, setIsOnline] =
  useState(false);
useEffect(() => {
  const checkProvider = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("providers")
      .select("id, is_online")
      .eq("user_id", user.id)
      .maybeSingle();

if (data) {

  setIsProvider(true);

  setProviderId(data.id);

  // Read the current status from database.
  // Do NOT change it.
  setIsOnline(data.is_online);

}
  };
  checkProvider();
}, []);

useEffect(() => {

  const handleOffline =
    async () => {

    try {

      if (!providerId) return;

      await supabase
        .from("providers")
        .update({
    is_online: false,
    current_booking_id: null
})
        .eq("id", providerId);

    } catch (e) {

      console.error(e);
    }
  };

 window.addEventListener(
  "beforeunload",
  handleOffline
);

window.addEventListener(
  "pagehide",
  handleOffline
);



 return () => {

  window.removeEventListener(
    "beforeunload",
    handleOffline
  );

  window.removeEventListener(
    "pagehide",
    handleOffline
  );
};
}, [providerId]);

useEffect(() => {

  if (!providerId) return;

  if (!isOnline) return;

  const interval = setInterval(async () => {

    await supabase
      .from("providers")
      .update({
        last_seen: new Date().toISOString()
      })
      .eq("id", providerId);

  }, 30000);

  return () => clearInterval(interval);

}, [providerId, isOnline]);

const toggleOnlineStatus =
  async () => {

  try {

    if (!providerId) return;

    const newValue =
      !isOnline;

      let latitude: number | null = null;
let longitude: number | null = null;

if (newValue) {
  try {
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) =>
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
          }
        )
    );

    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

  } catch (err) {
    alert(
      "Please enable location services before going online."
    );
    return;
  }
}
// Only check when trying to go ONLINE
if (newValue) {

  const { data: activeBooking } = await supabase
    .from("rent_friend_bookings")
    .select("id")
    .eq("provider_id", providerId)
    .in("booking_status", [
      "pending_provider_acceptance",
      "confirmed",
      "provider_en_route",
      "provider_arrived",
      "in_progress",
      "awaiting_customer_confirmation"
    ])
    .maybeSingle();

  if (activeBooking) {
    alert(
      "Complete your current booking before going online again."
    );
    return;
  }

}
  await supabase
  .from("providers")
  .update({
    is_online: newValue,
    last_seen: new Date().toISOString(),

    ...(newValue && {
      went_online_at: new Date().toISOString(),
      latitude,
      longitude,
    }),
  })
      .eq("id", providerId);

    setIsOnline(newValue);

  } catch (e) {

    console.error(e);
  }
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
          <div className="flex items-center gap-4">

  <BackButton onClick={onBack} />

  <div className="flex-1">
    <h1 className="text-2xl md:text-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent">
      Rent your Friend, Find your Companion
    </h1>

    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
      Connect. Collaborate. Grow.
    </p>
  </div>



   {/* Online/Offline Toggle */}
            <div className="flex items-center gap-3 glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50 rounded-full px-4 py-2">
               {/* ONLINE STATUS */}
{isProvider && (

  <div className="
    flex items-center gap-3
    select-none
  ">

    {/* TEXT */}
    <span className={`
      text-sm font-medium transition-colors

      ${isOnline
        ? 'text-emerald-400'
        : 'text-gray-400'
      }
    `}>
      {isOnline ? 'Online' : 'Offline'}
    </span>
              <span className="text-sm text-gray-700 dark:text-gray-300 hidden sm:inline">
                {isOnline ? 'Online' : 'Offline'}
              </span>
              <button
                onClick={toggleOnlineStatus}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                  isOnline
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                    : 'bg-gray-300 dark:bg-gray-700'
                }`}
                aria-label={isOnline ? 'Go offline' : 'Go online'}
              >
                <motion.div
                  layout
                  className="absolute top-2 w-5 h-5 bg-white rounded-full shadow-md"
                  animate={{
                    left: isOnline ? '20px' : '1px'
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              </button>
              <div className={`w-1 h-1 rounded-full ${
                isOnline
                  ? 'bg-green-500 animate-pulse'
                  : 'bg-gray-400 dark:bg-gray-600'
              }`} />
            </div>
)}
          </div>

</div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass dark:glass-dark border border-purple-200/50 dark:border-purple-800/30 mb-6"
          >
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Your Journey Starts Here</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 dark:from-purple-400 dark:via-pink-400 dark:to-blue-400 bg-clip-text text-transparent"
          >
            What would you like to do?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Book someone for quality time or become a companion and start earning
          </motion.p>
        </div>

        {/* Two Options Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {/* Book a Friend Card */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
           onClick={() => {
  if (isProvider && isOnline) {
    alert(
      "You are currently online as a provider. Please go offline before booking a friend."
    );
    return;
  }

  onNavigate("rent-friend-services");
}}
           className={`group relative overflow-hidden rounded-3xl
glass dark:glass-dark border border-gray-200/50
dark:border-gray-800/50 transition-all duration-300
p-8 md:p-10 text-left

${
  isProvider && isOnline
    ? "opacity-50 cursor-not-allowed"
    : "hover:border-purple-300 dark:hover:border-purple-700"
}
`}
          >
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300" />
            
            {/* Icon */}
            <div className="relative mb-6">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                <Search className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              {/* Floating Badge */}
              <div className="absolute -top-2 -right-2 px-2 py-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white text-xs font-medium shadow-md">
                Popular
              </div>
            </div>

            {/* Content */}
            <div className="relative">
              {isProvider && isOnline && (
  <div className="mb-4 inline-flex items-center rounded-full bg-red-500/20 text-red-400 px-3 py-1 text-sm">
    Go Offline to Book
  </div>
)}
              <h3 className="text-2xl md:text-3xl mb-3 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 dark:group-hover:from-purple-400 dark:group-hover:to-pink-400 group-hover:bg-clip-text group-hover:text-transparent transition-all">
                Book a Friend
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                Find and book someone to hang out, explore, or talk with. Choose from 12+ activities and 500+ verified companions.
              </p>

              {/* Features */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span>Verified profiles only</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0">
                    <Star className="w-3 h-3 text-pink-600 dark:text-pink-400" />
                  </div>
                  <span>Rated 4.9/5 by users</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span>Starting from ₹299/hr</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white text-center font-medium shadow-lg group-hover:shadow-2xl group-hover:from-purple-600 group-hover:to-pink-700 transition-all">
                Continue to Browse →
              </div>
            </div>
          </motion.button>

         {/* Become a Friend / Dashboard Card */}
{isProvider ? (
  // ✅ PROVIDER DASHBOARD CARD
  <motion.button
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.5 }}
    whileHover={{ y: -8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onNavigate('provider-dashboard')}
    className="group relative overflow-hidden rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50 hover:border-green-300 dark:hover:border-green-700 transition-all duration-300 p-8 md:p-10 text-left"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300" />

    <div className="relative mb-6">
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
        <UserPlus className="w-8 h-8 md:w-10 md:h-10 text-white" />
      </div>

      <div className="absolute -top-2 -right-2 px-2 py-1 rounded-lg bg-gradient-to-r from-green-600 to-emerald-700 text-white text-xs font-medium shadow-md">
        Active
      </div>
    </div>

    <div className="relative">
      <h3 className="text-2xl md:text-3xl mb-3">
        Provider Dashboard
      </h3>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Manage your bookings, earnings, and availability.
      </p>

      <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white text-center font-medium shadow-lg">
        Go to Dashboard →
      </div>
    </div>
  </motion.button>

) : (
  // ❌ ORIGINAL "BECOME FRIEND" CARD
  <motion.button
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: 0.5 }}
    whileHover={{ y: -8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onNavigate('become-friend')}
    className="group relative overflow-hidden rounded-3xl glass dark:glass-dark border border-gray-200/50 dark:border-gray-800/50 hover:border-blue-300 dark:hover:border-blue-700 transition-all duration-300 p-8 md:p-10 text-left"
  >
    {/* keep your existing card exactly same */}
    
    <div className="relative">
      <h3 className="text-2xl md:text-3xl mb-3">
        Become a Friend
      </h3>

      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Offer your time and earn by being a companion.
      </p>

      <div className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-center font-medium shadow-lg">
        Start Earning →
      </div>
    </div>
  </motion.button>
)}
        </div>
        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">Trusted by thousands</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <div className="text-center">
              <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">10K+</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Happy Users</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">500+</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Active Friends</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">4.9</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Average Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">50K+</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Bookings</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}