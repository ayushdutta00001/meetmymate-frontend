import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Heart,
  ArrowLeftRight,
  ArrowRight,
  Shield,
  Star,
  Zap,
  CheckCircle,
  Sparkles,
  MapPin,
  Bell,
  TrendingUp,
  Users,
  Clock,
  ChevronRight,
} from 'lucide-react';

import Loader from '../ui/Loader';
import { MatchNotificationBanner } from '../MatchNotificationBanner';
import { supabase } from '../../supabase';
import { registerPushNotifications } from '../../lib/push';
import { listenToMessages } from '../../firebase';
import { useNotification } from '../../lib/NotificationContext';
// =====================================================
// HOME CACHE
// =====================================================

interface HomeStats {
  activePeers: number;
  verifiedUsers: number;

  blindDateBookings: number;
  paidBlindDateBookings: number;
  awaitingBlindDateMatch: number;
  blindDateMatches: number;

  p2pMeetings: number;
  completedP2PMeetings: number;
}

const EMPTY_STATS: HomeStats = {
  activePeers: 0,
  verifiedUsers: 0,

  blindDateBookings: 0,
  paidBlindDateBookings: 0,
  awaitingBlindDateMatch: 0,
  blindDateMatches: 0,

  p2pMeetings: 0,
  completedP2PMeetings: 0,
};

let homeCache: {
  profile: any | null;
  notifications: any[];
  stats: HomeStats;
  loaded: boolean;
} = {
  profile: null,
  notifications: [],
  stats: EMPTY_STATS,
  loaded: false,
};

// =====================================================
// TYPES
// =====================================================

interface HomeScreenProps {
  onNavigate: (page: string) => void;
}

type ActiveTab = 'all' | 'date' | 'p2p';

// =====================================================
// HELPERS
// =====================================================

function parseFunctionData(data: any) {
  if (!data) return null;

  if (typeof data === 'string') {
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  return data;
}

function getProfileName(profile: any) {
  return (
    profile?.name ||
    profile?.full_name ||
    profile?.display_name ||
    'User'
  );
}

function getProfileCity(profile: any) {
  return (
    profile?.city ||
    profile?.location ||
    profile?.preferred_city ||
    '—'
  );
}

// =====================================================
// COMPONENT
// =====================================================

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [profile, setProfile] = useState<any | null>(homeCache.profile);

  const [notifications, setNotifications] = useState<any[]>(
    homeCache.notifications
  );

  const [stats, setStats] = useState<HomeStats>(homeCache.stats);

  const [loading, setLoading] = useState(!homeCache.loaded);

  const [hovered, setHovered] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<ActiveTab>('all');

  const [showMatchNotification, setShowMatchNotification] = useState(true);

  const [showNotificationPrompt, setShowNotificationPrompt] =
    useState(false);

 const { notifCount: unreadCount } = useNotification();

  // ===================================================
  // NOTIFICATION PERMISSION
  // ===================================================

  useEffect(() => {
    if (typeof Notification === 'undefined') {
      setShowNotificationPrompt(false);
      return;
    }

    const permission = Notification.permission;

    console.log('Notification permission:', permission);

    if (permission === 'default') {
      setShowNotificationPrompt(true);
    } else {
      setShowNotificationPrompt(false);
    }
  }, []);

  // ===================================================
  // LOAD HOME DATA
  // ===================================================

  useEffect(() => {
    loadHomeData();

    try {
      listenToMessages();
    } catch (error) {
      console.error('Firebase message listener error:', error);
    }

    // Refresh real dashboard numbers periodically.
    const refreshInterval = window.setInterval(() => {
      loadHomeData(true);
    }, 30000);

    return () => {
      window.clearInterval(refreshInterval);
    };
  }, []);

  // ===================================================
  // LOAD ALL HOME DATA
  // ===================================================

  async function loadHomeData(backgroundRefresh = false) {
    try {
      if (!backgroundRefresh && !homeCache.loaded) {
        setLoading(true);
      }

      // -------------------------------------------------
      // CURRENT USER
      // -------------------------------------------------

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error('Home auth error:', authError);
      }

      if (!user) {
        console.warn('No authenticated user found on HomeScreen.');
        setLoading(false);
        return;
      }

      // -------------------------------------------------
      // EXISTING EDGE FUNCTIONS
      // -------------------------------------------------

      const [
  profileRes,
  bookingsRes,
] = await Promise.all([
  supabase.functions.invoke('get_my_profile'),
  supabase.functions.invoke('get_my_bookings'),
]);

      // -------------------------------------------------
      // PROFILE
      // -------------------------------------------------

      const parsedProfile = parseFunctionData(profileRes?.data);

      if (parsedProfile) {
        setProfile(parsedProfile);
      }

      // -------------------------------------------------
      // NOTIFICATIONS
      // -------------------------------------------------

     

      // -------------------------------------------------
      // USER'S BOOKINGS
      // -------------------------------------------------

      let bookings: any[] = [];

      if (Array.isArray(bookingsRes?.data)) {
        bookings = bookingsRes.data;
      } else if (Array.isArray(parseFunctionData(bookingsRes?.data))) {
        bookings = parseFunctionData(bookingsRes?.data);
      }

      // =================================================
      // REAL SUPABASE COUNTS
      // =================================================

      // -------------------------------------------------
      // ACTIVE P2P PROFILES
      //
      // RLS allows users to read active profiles.
      // -------------------------------------------------

      const activePeersQuery = await supabase
        .from('p2p_profiles')
        .select('id', {
          count: 'exact',
          head: true,
        })
        .eq('status', 'active')
        .eq('is_active', true);

      if (activePeersQuery.error) {
        console.error(
          'Active peer count error:',
          activePeersQuery.error
        );
      }

      const activePeers =
        typeof activePeersQuery.count === 'number'
          ? activePeersQuery.count
          : 0;

      // -------------------------------------------------
      // VERIFIED USERS
      //
      // users table allows read access.
      // -------------------------------------------------

      const verifiedUsersQuery = await supabase
        .from('users')
        .select('id', {
          count: 'exact',
          head: true,
        })
        .eq('id_document_uploaded', true);

      if (verifiedUsersQuery.error) {
        console.error(
          'Verified user count error:',
          verifiedUsersQuery.error
        );
      }

      const verifiedUsers =
        typeof verifiedUsersQuery.count === 'number'
          ? verifiedUsersQuery.count
          : 0;

      // -------------------------------------------------
      // USER'S BLIND DATE BOOKINGS
      //
      // blind_date_bookings is user-scoped.
      // -------------------------------------------------

      const blindDateBookingsQuery = await supabase
        .from('blind_date_bookings')
        .select(
          'id,status,payment_status,created_at',
          {
            count: 'exact',
          }
        )
        .eq('user_id', user.id);

      if (blindDateBookingsQuery.error) {
        console.error(
          'Blind date bookings error:',
          blindDateBookingsQuery.error
        );
      }

      const blindDateBookings =
        blindDateBookingsQuery.data || [];

      const paidBlindDateBookings =
        blindDateBookings.filter(
          (booking) =>
            booking?.payment_status === 'paid'
        );

      const awaitingBlindDateMatch =
        paidBlindDateBookings.filter(
          (booking) =>
            booking?.status === 'pending'
        );

      // -------------------------------------------------
      // USER'S BLIND DATE MATCHES
      //
      // blind_date_matches is user-scoped by RLS.
      // We fetch visible matches and make sure the
      // current user is one side of the match.
      // -------------------------------------------------

      const blindDateMatchesQuery = await supabase
        .from('blind_date_matches')
        .select('id,user_a,user_b');

      if (blindDateMatchesQuery.error) {
        console.error(
          'Blind date matches error:',
          blindDateMatchesQuery.error
        );
      }

      const visibleBlindDateMatches =
        blindDateMatchesQuery.data || [];

      const userBlindDateMatches =
        visibleBlindDateMatches.filter(
          (match) =>
            match?.user_a === user.id ||
            match?.user_b === user.id
        );

      // -------------------------------------------------
      // USER'S P2P MEETINGS
      //
      // p2p_meetings currently allows read access.
      // We still filter to this user's meetings here.
      // -------------------------------------------------

      const p2pMeetingsQuery = await supabase
        .from('p2p_meetings')
        .select(
          'id,user_a,user_b,status,created_at'
        );

      if (p2pMeetingsQuery.error) {
        console.error(
          'P2P meetings error:',
          p2pMeetingsQuery.error
        );
      }

      const visibleP2PMeetings =
        p2pMeetingsQuery.data || [];

      const userP2PMeetings =
        visibleP2PMeetings.filter(
          (meeting) =>
            meeting?.user_a === user.id ||
            meeting?.user_b === user.id
        );

      const completedP2PMeetings =
        userP2PMeetings.filter(
          (meeting) =>
            String(meeting?.status || '').toLowerCase() ===
            'completed'
        );

      // =================================================
      // FINAL REAL STATS
      // =================================================

      const nextStats: HomeStats = {
        activePeers,
        verifiedUsers,

        blindDateBookings: blindDateBookings.length,

        paidBlindDateBookings:
          paidBlindDateBookings.length,

        awaitingBlindDateMatch:
          awaitingBlindDateMatch.length,

        blindDateMatches:
          userBlindDateMatches.length,

        p2pMeetings:
          userP2PMeetings.length,

        completedP2PMeetings:
          completedP2PMeetings.length,
      };

      setStats(nextStats);

      // =================================================
      // CACHE
      // =================================================

      homeCache = {
  profile:
    parsedProfile ??
    homeCache.profile,

  notifications:
    homeCache.notifications,

  stats: nextStats,

  loaded: true,
};
    } catch (error) {
      console.error(
        'Home load error:',
        error
      );
    } finally {
      setLoading(false);
    }
  }

  // ===================================================
  // MATCH NOTIFICATION
  // ===================================================

  const hasNewMatch =
    notifications.some(
      (notification) =>
        (
          notification?.type === 'p2p_match' ||
          notification?.notification_type === 'p2p_match'
        ) &&
        notification?.is_read === false
    ) ||
    notifications.some(
      (notification) =>
        (
          notification?.type === 'blind_date_match' ||
          notification?.notification_type === 'blind_date_match'
        ) &&
        notification?.is_read === false
    );

  // ===================================================
  // ENABLE PUSH NOTIFICATIONS
  // ===================================================

  const handleEnableNotifications = async () => {
    try {
      if (typeof Notification === 'undefined') {
        setShowNotificationPrompt(false);
        return;
      }

      const permission =
        await Notification.requestPermission();

      console.log(
        'Notification permission:',
        permission
      );

      if (permission !== 'granted') {
        setShowNotificationPrompt(false);
        return;
      }

      if ('serviceWorker' in navigator) {
        await navigator.serviceWorker.ready;
      }

      await registerPushNotifications();

      setShowNotificationPrompt(false);
    } catch (error) {
      console.error(
        'Notification setup error:',
        error
      );
    }
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#070B18] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader />

        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading your home…
        </p>
      </div>
    </div>
  );
}
  const userName = getProfileName(profile);
  const userCity = getProfileCity(profile);

  // ===================================================
  // RETURN
  // ===================================================

  return (
    <div className="min-h-screen bg-[#F0F2F5] dark:bg-[#070B18] pb-24 md:pb-8 md:pr-24 overflow-x-hidden">

      {/* =================================================
          AMBIENT BACKGROUND
      ================================================= */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">

        <motion.div
          className="absolute -top-60 -left-40 w-[600px] h-[600px] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        <motion.div
          className="absolute top-1/3 -right-40 w-[500px] h-[500px] rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.25, 1],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 3,
          }}
        />

        <motion.div
          className="absolute bottom-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
          style={{
            background:
              'radial-gradient(circle, rgba(236,72,153,0.05) 0%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.15, 1],
            x: [0, -20, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 6,
          }}
        />

      </div>

      {/* =================================================
          MATCH NOTIFICATION
      ================================================= */}

      <div className="relative z-50">
        <AnimatePresence>
          {hasNewMatch &&
            showMatchNotification && (
              <MatchNotificationBanner
                onViewMatch={() => {
                  setShowMatchNotification(false);
                  onNavigate(
                    'blind-date-match-found'
                  );
                }}
                onDismiss={() =>
                  setShowMatchNotification(false)
                }
              />
            )}
        </AnimatePresence>
      </div>

      {/* =================================================
          TOP BAR
      ================================================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="
          sticky
          top-0
          z-40
          bg-white/75
          dark:bg-[#070B18]/80
          backdrop-blur-2xl
          border-b
          border-white/60
          dark:border-white/5
        "
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-3.5">

          <div className="flex items-center justify-between">

            {/* LEFT */}

            <div>

              <p
                className="
                  text-[10px]
                  font-semibold
                  text-gray-400
                  dark:text-gray-500
                  uppercase
                  tracking-[0.15em]
                  mb-0.5
                "
              >
                Good morning
              </p>

              <h2
                className="
                  text-lg
                  font-bold
                  text-gray-900
                  dark:text-white
                  leading-none
                "
                style={{
                  fontFamily:
                    "'Outfit', sans-serif",
                }}
              >
                Welcome back, {userName}! 👋
              </h2>

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-2.5">

              {/* CITY */}

              <div
                className="
                  hidden
                  sm:flex
                  items-center
                  gap-1.5
                  px-3
                  py-1.5
                  rounded-full
                  bg-gray-100
                  dark:bg-white/5
                  text-gray-500
                  dark:text-gray-400
                "
              >
                <MapPin className="w-3 h-3" />

                <span className="text-xs font-medium">
                  {userCity}
                </span>
              </div>

              {/* NOTIFICATIONS */}

              <button
                onClick={() =>
                  onNavigate('notifications')
                }
                aria-label="Notifications"
                className="
                  relative
                  w-9
                  h-9
                  rounded-xl
                  border
                  border-gray-200
                  dark:border-gray-700/60
                  flex
                  items-center
                  justify-center
                  hover:bg-gray-50
                  dark:hover:bg-white/5
                  transition-colors
                  bg-gradient-to-r
                  from-violet-500
                  to-purple-600
                  dark:bg-transparent
                "
              >
                <Bell className="w-4 h-4 text-white" />

                {unreadCount > 0 && (
                  <span
                    className="
                      absolute
                      -top-1
                      -right-1
                      min-w-[18px]
                      h-[18px]
                      px-1
                      flex
                      items-center
                      justify-center
                      rounded-full
                      bg-red-500
                      text-white
                      text-[9px]
                      font-bold
                      border-2
                      border-white
                      dark:border-[#070B18]
                    "
                  >
                    {unreadCount > 99
                      ? '99+'
                      : unreadCount}
                  </span>
                )}
              </button>

            </div>
          </div>

        </div>
      </motion.div>

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-6 lg:px-8">

        {/* =================================================
            HERO
        ================================================= */}

        <div className="pt-8 pb-6">

          {/* REAL LIVE DATA BAR */}

          <motion.div
            initial={{
              opacity: 0,
              y: -8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="
              inline-flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
               bg-gradient-to-r
                  from-violet-500
                  to-purple-600
              dark:bg-white/[0.06]
              border
              border-gray-200/80
              dark:border-white/8
              shadow-sm
              mb-6
            "
          >
            <span className="relative flex h-2.5 w-2.5">

              <span
                className="
                  animate-ping
                  absolute
                  inline-flex
                  h-full
                  w-full
                  rounded-full
                  bg-emerald-400
                  opacity-70
                "
              />

              <span
                className="
                  relative
                  inline-flex
                  rounded-full
                  h-2.5
                  w-2.5
                  bg-emerald-500
                "
              />

            </span>

            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              {stats.activePeers.toLocaleString()} active peer profiles
            </span>

            <span className="text-gray-300 dark:text-gray-600 hidden sm:block">
              ·
            </span>

            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              Live peer matching
            </span>
          </motion.div>

          {/* HERO TITLE */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.25,
            }}
            className="
              text-4xl
              md:text-5xl
              font-extrabold
              tracking-tight
              leading-[1.08]
              text-gray-900
              dark:text-white
              mb-3
            "
            style={{
              fontFamily:
                "'Outfit', sans-serif",
            }}
          >
            Real Meetings,
            <br />

            <span
              style={{
                background:
                  'linear-gradient(130deg, #3B82F6 0%, #8B5CF6 45%, #EC4899 100%)',
                WebkitBackgroundClip:
                  'text',
                WebkitTextFillColor:
                  'transparent',
                backgroundClip: 'text',
              }}
            >
              Real Connections
            </span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.32,
            }}
            className="
              text-sm
              md:text-base
              text-gray-500
              dark:text-gray-400
              max-w-md
              mb-6
            "
          >
            Choose your experience — every match is identity-verified, meets in public, and protected by our refund guarantee.
          </motion.p>

          {/* FILTERS */}

          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.38,
            }}
            className="flex gap-2"
          >
            {[
              {
                key: 'all',
                label: 'All Services',
              },
              {
                key: 'date',
                label: '💘 Blind Date',
              },
              {
                key: 'p2p',
                label: '🤝 Peer Match',
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() =>
                  setActiveTab(
                    tab.key as ActiveTab
                  )
                }
                className={`
                  px-4
                  py-2
                  rounded-full
                  text-xs
                  font-semibold
                  transition-all
                  ${
                    activeTab === tab.key
                      ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-sm'
                      : 'bg dark:bg-white/[0.06] border border-gray-200 dark:border-white/8 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/15'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

        </div>

        {/* =================================================
            SERVICE CARDS
        ================================================= */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          {/* =============================================
              BLIND DATE
          ============================================= */}

          <AnimatePresence>
            {(activeTab === 'all' ||
              activeTab === 'date') && (
              <motion.div
                layout
                initial={{
                  opacity: 0,
                  y: 30,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                }}
                transition={{
                  delay: 0.42,
                  type: 'spring',
                  stiffness: 120,
                  damping: 20,
                }}
                className={
                  activeTab === 'date'
                    ? 'md:col-span-2'
                    : ''
                }
              >

                <motion.div
                  whileHover={{
                    y: -7,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 22,
                  }}
                  onClick={() =>
                    onNavigate('blind-date')
                  }
                  onHoverStart={() =>
                    setHovered('blind-date')
                  }
                  onHoverEnd={() =>
                    setHovered(null)
                  }
                  className="
                    relative
                    rounded-3xl
                    overflow-hidden
                    cursor-pointer
                    group
                  "
                  style={{
                    height:
                      activeTab === 'date'
                        ? '520px'
                        : '480px',

                    boxShadow:
                      hovered === 'blind-date'
                        ? '0 32px 80px rgba(236,72,153,0.30), 0 0 0 1.5px rgba(236,72,153,0.35)'
                        : '0 8px 40px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.06)',

                    transition:
                      'box-shadow 0.35s ease, height 0.4s ease',
                  }}
                >

                  {/* IMAGE */}

                  <img
                    src="https://images.unsplash.com/photo-1784359078338-c491cb748858?w=900&h=700&fit=crop&auto=format"
                    alt="Blind Date"
                    loading="lazy"
                    decoding="async"
                    className="
                      absolute
                      inset-0
                      w-full
                      h-full
                      object-cover
                    "
                    style={{
                      transform:
                        hovered ===
                        'blind-date'
                          ? 'scale(1.06)'
                          : 'scale(1)',
                      transition:
                        'transform 0.7s ease',
                    }}
                  />

                  {/* GRADIENT */}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-rose-950/30 to-transparent" />

                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-pink-950/40" />

                  {/* TOP */}

                  <div className="absolute top-5 left-5 right-5 flex items-start justify-between">

                    <div className="flex flex-col gap-2">

                      <span className="
                        inline-flex
                        items-center
                        gap-1.5
                        self-start
                        px-3
                        py-1.5
                        rounded-full
                        text-xs
                        font-bold
                        text-white
                        bg-gradient-to-r
                        from-pink-500
                        to-rose-500
                        shadow-lg
                      ">
                        <Sparkles className="w-3 h-3" />
                        Most Popular
                      </span>

                      {/* REAL BOOKING DATA */}

                      <div className="
                        flex
                        items-center
                        gap-1.5
                        px-3
                        py-1.5
                        rounded-full
                        bg-black/35
                        backdrop-blur-md
                        border
                        border-white/10
                        self-start
                      ">

                        <span className="relative flex h-2 w-2">

                          <span className="
                            animate-ping
                            absolute
                            inline-flex
                            h-full
                            w-full
                            rounded-full
                            bg-emerald-400
                            opacity-70
                          " />

                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />

                        </span>

                        <span className="text-xs font-medium text-white">
                          {stats.paidBlindDateBookings.toLocaleString()}{' '}
                          paid bookings
                        </span>

                      </div>

                    </div>

                    <span className="
                      px-3
                      py-1.5
                      rounded-full
                      text-xs
                      font-semibold
                      backdrop-blur-md
                      bg-white/10
                      border
                      border-white/20
                      text-white/90
                    ">
                      21+ Verified Only
                    </span>

                  </div>

                  {/* FEATURE TAGS */}

                  <div className="
                    absolute
                    bottom-[180px]
                    left-5
                    right-5
                    flex
                    flex-wrap
                    gap-2
                  ">

                    {[
                      'Anonymous Reveal',
                      'Public Venue',
                      'Refund Protected',
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="
                          px-2.5
                          py-1
                          rounded-lg
                          text-xs
                          bg-white/10
                          backdrop-blur-sm
                          border
                          border-white/15
                          text-white/85
                        "
                      >
                        {tag}
                      </span>
                    ))}

                  </div>

                  {/* BOTTOM */}

                  <div className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    p-6
                  ">

                    <h2
                      className="
                        text-white
                        text-[2rem]
                        md:text-[2.25rem]
                        font-extrabold
                        leading-tight
                        mb-2
                      "
                      style={{
                        fontFamily:
                          "'Outfit', sans-serif",
                      }}
                    >
                      Blind Date
                    </h2>

                    <p className="
                      text-white/65
                      text-sm
                      mb-5
                      max-w-sm
                      leading-relaxed
                    ">
                      System-arranged public meetings for verified adults. Anonymous until the moment you meet.
                    </p>

                    {/* REAL STATS */}

                    <div className="
                      flex
                      items-center
                      gap-5
                      mb-5
                      flex-wrap
                    ">

                      {[
                        {
                          icon: Users,
                          val:
                            stats.paidBlindDateBookings.toLocaleString(),
                          label:
                            'Paid bookings',
                        },
                        {
                          icon: Heart,
                          val:
                            stats.blindDateMatches.toLocaleString(),
                          label:
                            'Your matches',
                        },
                        {
                          icon: Clock,
                          val:
                            stats.awaitingBlindDateMatch.toLocaleString(),
                          label:
                            'Awaiting match',
                        },
                      ].map((stat) => {
                        const Icon =
                          stat.icon;

                        return (
                          <div
                            key={
                              stat.label
                            }
                            className="
                              flex
                              items-center
                              gap-1.5
                            "
                          >
                            <Icon className="
                              w-3.5
                              h-3.5
                              text-pink-300
                            " />

                            <span className="
                              text-white
                              text-xs
                              font-bold
                            ">
                              {stat.val}
                            </span>

                            <span className="
                              text-white/45
                              text-xs
                            ">
                              {stat.label}
                            </span>
                          </div>
                        );
                      })}

                    </div>

                    <div className="flex items-center gap-3">

                      <motion.button
                        whileHover={{
                          scale: 1.04,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          onNavigate(
                            'blind-date'
                          );
                        }}
                        className="
                          flex
                          items-center
                          gap-2
                          px-6
                          py-3
                          rounded-2xl
                          bg-gradient-to-r
                          from-violet-500
                          to-purple-600
                          text-white
                          font-bold
                          text-sm
                          shadow-xl
                          hover:shadow-2xl
                          transition-shadow
                        "
                      >
                        Book Now
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>

                      <span className="
                        text-white/40
                        text-xs
                      ">
                        Pricing shown at booking
                      </span>

                    </div>

                  </div>

                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>

          {/* =============================================
              P2P MATCH
          ============================================= */}

          <AnimatePresence>
            {(activeTab === 'all' ||
              activeTab === 'p2p') && (
              <motion.div
                layout
                initial={{
                  opacity: 0,
                  y: 30,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  scale: 0.95,
                }}
                transition={{
                  delay:
                    activeTab === 'all'
                      ? 0.55
                      : 0.42,
                  type: 'spring',
                  stiffness: 120,
                  damping: 20,
                }}
                className={
                  activeTab === 'p2p'
                    ? 'md:col-span-2'
                    : ''
                }
              >

                <motion.div
                  whileHover={{
                    y: -7,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 280,
                    damping: 22,
                  }}
                  onClick={() =>
                    onNavigate(
                      'p2p-peer-listing'
                    )
                  }
                  onHoverStart={() =>
                    setHovered('p2p')
                  }
                  onHoverEnd={() =>
                    setHovered(null)
                  }
                  className="
                    relative
                    rounded-3xl
                    overflow-hidden
                    cursor-pointer
                    group
                  "
                  style={{
                    height:
                      activeTab === 'p2p'
                        ? '520px'
                        : '480px',

                    boxShadow:
                      hovered === 'p2p'
                        ? '0 32px 80px rgba(139,92,246,0.30), 0 0 0 1.5px rgba(139,92,246,0.35)'
                        : '0 8px 40px rgba(0,0,0,0.13), 0 0 0 1px rgba(0,0,0,0.06)',

                    transition:
                      'box-shadow 0.35s ease, height 0.4s ease',
                  }}
                >

                  {/* IMAGE */}

                  <img
                    src="https://images.unsplash.com/photo-1681505531034-8d67054e07f6?w=900&h=700&fit=crop&auto=format"
                    alt="Peer to Peer Match"
                    loading="lazy"
                    decoding="async"
                    className="
                      absolute
                      inset-0
                      w-full
                      h-full
                      object-cover
                    "
                    style={{
                      transform:
                        hovered === 'p2p'
                          ? 'scale(1.06)'
                          : 'scale(1)',
                      transition:
                        'transform 0.7s ease',
                    }}
                  />

                  {/* GRADIENT */}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-violet-950/30 to-transparent" />

                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-950/40" />

                  {/* TOP */}

                  <div className="
                    absolute
                    top-5
                    left-5
                    right-5
                    flex
                    items-start
                    justify-between
                  ">

                    <div className="
                      flex
                      flex-col
                      gap-2
                    ">

                      <span className="
                        inline-flex
                        items-center
                        gap-1
                        self-start
                        px-3
                        py-1.5
                        rounded-full
                        text-xs
                        font-bold
                        text-white
                        bg-gradient-to-r
                        from-violet-500
                        to-purple-600
                        shadow-lg
                      ">
                        <Sparkles className="w-3 h-3" />
                        New
                      </span>

                      {/* REAL ACTIVE PEERS */}

                      <div className="
                        flex
                        items-center
                        gap-1.5
                        px-3
                        py-1.5
                        rounded-full
                        bg-black/35
                        backdrop-blur-md
                        border
                        border-white/10
                        self-start
                      ">

                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>

                        <span className="
                          text-xs
                          font-medium
                          text-white
                        ">
                          {stats.activePeers.toLocaleString()}{' '}
                          active
                        </span>

                      </div>

                    </div>

                    <span className="
                      px-3
                      py-1.5
                      rounded-full
                      text-xs
                      font-semibold
                      backdrop-blur-md
                      bg-white/10
                      border
                      border-white/20
                      text-white/90
                    ">
                      Active Peer Listings
                    </span>

                  </div>

                  {/* FEATURE TAGS */}

                  <div className="
                    absolute
                    bottom-[180px]
                    left-5
                    right-5
                    flex
                    flex-wrap
                    gap-2
                  ">

                    {[
                      'Equal Matching',
                      'Co-Founder Ready',
                      'Investor Access',
                    ].map((tag) => (
                      <span
                        key={tag}
                        className="
                          px-2.5
                          py-1
                          rounded-lg
                          text-xs
                          bg-white/10
                          backdrop-blur-sm
                          border
                          border-white/15
                          text-white/85
                        "
                      >
                        {tag}
                      </span>
                    ))}

                  </div>

                  {/* BOTTOM */}

                  <div className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    p-6
                  ">

                    <h2
                      className="
                        text-white
                        text-[2rem]
                        md:text-[2.25rem]
                        font-extrabold
                        leading-tight
                        mb-2
                      "
                      style={{
                        fontFamily:
                          "'Outfit', sans-serif",
                      }}
                    >
                     PartnerUp (p2p meetings)
                    </h2>

                    <p className="
                      text-white/65
                      text-sm
                      mb-5
                      max-w-sm
                      leading-relaxed
                    ">
                      Connect as equals with verified peers ready to collaborate, partner, or co-found something great.
                    </p>

                    {/* REAL STATS */}

                    <div className="
                      flex
                      items-center
                      gap-5
                      mb-5
                      flex-wrap
                    ">

                      {[
                        {
                          icon: Users,
                          val:
                            stats.activePeers.toLocaleString(),
                          label:
                            'Active peers',
                        },
                        {
                          icon: ArrowLeftRight,
                          val:
                            stats.p2pMeetings.toLocaleString(),
                          label:
                            'Your meetings',
                        },
                        {
                          icon: CheckCircle,
                          val:
                            stats.completedP2PMeetings.toLocaleString(),
                          label:
                            'Completed',
                        },
                      ].map((stat) => {
                        const Icon =
                          stat.icon;

                        return (
                          <div
                            key={
                              stat.label
                            }
                            className="
                              flex
                              items-center
                              gap-1.5
                            "
                          >
                            <Icon className="
                              w-3.5
                              h-3.5
                              text-violet-300
                            " />

                            <span className="
                              text-white
                              text-xs
                              font-bold
                            ">
                              {stat.val}
                            </span>

                            <span className="
                              text-white/45
                              text-xs
                            ">
                              {stat.label}
                            </span>
                          </div>
                        );
                      })}

                    </div>

                    <div className="
                      flex
                      items-center
                      gap-3
                    ">

                      <motion.button
                        whileHover={{
                          scale: 1.04,
                        }}
                        whileTap={{
                          scale: 0.97,
                        }}
                        onClick={(event) => {
                          event.stopPropagation();
                          onNavigate(
                            'p2p-peer-listing'
                          );
                        }}
                        className="
                          flex
                          items-center
                          gap-2
                          px-6
                          py-3
                          rounded-2xl
                          bg-gradient-to-r
                          from-violet-500
                          to-purple-600
                          text-white
                          dark:
                          text-gray-900
                          font-bold
                          text-sm
                          shadow-xl
                          hover:shadow-2xl
                          transition-shadow
                        "
                      >
                        Find a Peer
                        <ArrowLeftRight className="w-4 h-4" />
                      </motion.button>

                      <span className="
                        text-white/40
                        text-xs
                      ">
                        Free to browse
                      </span>

                    </div>

                  </div>

                </motion.div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
{/* =================================================
    REAL TRUST / ACTIVITY STRIP
================================================= */}

<motion.div
  initial={{
    opacity: 0,
    y: 14,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    delay: 0.75,
  }}
  className="
    grid
    grid-cols-2
    md:grid-cols-4
    gap-3
    mb-4
  "
>
  {[
    {
      icon: Shield,
      val: stats.verifiedUsers.toLocaleString(),
      label: 'Verified Users',

      card:
        'bg-gradient-to-br from-blue-500/20 via-blue-400/10 to-cyan-400/20 dark:from-blue-500/20 dark:via-blue-500/10 dark:to-cyan-500/15',

      border:
        'border-blue-200/70 dark:border-blue-400/20',

      iconBg:
        'bg-blue-500/15 dark:bg-blue-400/10',

      iconColor:
        'text-blue-600 dark:text-blue-300',

      glow:
        'group-hover:shadow-blue-500/20',
    },

    {
      icon: Users,
      val: stats.activePeers.toLocaleString(),
      label: 'Active Peers',

      card:
        'bg-gradient-to-br from-amber-400/25 via-orange-300/10 to-yellow-400/20 dark:from-amber-500/20 dark:via-orange-500/10 dark:to-yellow-500/15',

      border:
        'border-amber-200/70 dark:border-amber-400/20',

      iconBg:
        'bg-amber-500/15 dark:bg-amber-400/10',

      iconColor:
        'text-amber-600 dark:text-amber-300',

      glow:
        'group-hover:shadow-amber-500/20',
    },

    {
      icon: Heart,
      val: stats.blindDateMatches.toLocaleString(),
      label: 'Your Date Matches',

      card:
        'bg-gradient-to-br from-pink-500/20 via-rose-400/10 to-fuchsia-400/20 dark:from-pink-500/20 dark:via-rose-500/10 dark:to-fuchsia-500/15',

      border:
        'border-pink-200/70 dark:border-pink-400/20',

      iconBg:
        'bg-pink-500/15 dark:bg-pink-400/10',

      iconColor:
        'text-pink-600 dark:text-pink-300',

      glow:
        'group-hover:shadow-pink-500/20',
    },

    {
      icon: CheckCircle,
      val: stats.completedP2PMeetings.toLocaleString(),
      label: 'Your Completed Meetings',

      card:
        'bg-gradient-to-br from-emerald-500/20 via-green-400/10 to-teal-400/20 dark:from-emerald-500/20 dark:via-green-500/10 dark:to-teal-500/15',

      border:
        'border-emerald-200/70 dark:border-emerald-400/20',

      iconBg:
        'bg-emerald-500/15 dark:bg-emerald-400/10',

      iconColor:
        'text-emerald-600 dark:text-emerald-300',

      glow:
        'group-hover:shadow-emerald-500/20',
    },
  ].map((point, index) => {
    const Icon = point.icon;

    return (
      <motion.div
        key={point.label}
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 0.8 + index * 0.07,
        }}
        whileHover={{
          y: -4,
          scale: 1.015,
        }}
        className={`
          group
          relative
          overflow-hidden
          flex
          items-center
          gap-3
          p-4
          rounded-2xl
          border
          ${point.border}
          ${point.card}
          backdrop-blur-xl
          shadow-sm
          transition-all
          duration-300
          ${point.glow}
          hover:shadow-xl
        `}
      >
        {/* Decorative glow */}

        <div
          className="
            absolute
            -right-8
            -top-8
            w-20
            h-20
            rounded-full
            bg-white/20
            blur-2xl
            pointer-events-none
          "
        />

        <div
          className={`
            relative
            z-10
            w-11
            h-11
            rounded-xl
            ${point.iconBg}
            flex
            items-center
            justify-center
            flex-shrink-0
            border
            border-white/20
            dark:border-white/10
          `}
        >
          <Icon
            className={`
              w-5
              h-5
              ${point.iconColor}
            `}
          />
        </div>

        <div className="relative z-10 min-w-0">

          <div
            className="
              text-lg
              font-extrabold
              text-gray-900
              dark:text-white
              leading-none
            "
            style={{
              fontFamily:
                "'Outfit', sans-serif",
            }}
          >
            {point.val}
          </div>

          <div
            className="
              text-xs
              text-gray-600
              dark:text-gray-300/75
              mt-1
              truncate
            "
          >
            {point.label}
          </div>

        </div>

      </motion.div>
    );
  })}
</motion.div>
        {/* =================================================
            MATCH BANNER
        ================================================= */}

        <motion.div
          initial={{
            opacity: 0,
            y: 14,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 0.92,
          }}
        >

          <motion.div
            whileHover={{
              scale: 1.008,
              y: -3,
            }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 22,
            }}
            onClick={() =>
              onNavigate('blind-date')
            }
            className="
              relative
              overflow-hidden
              rounded-3xl
              cursor-pointer
            "
            style={{
              background:
                'linear-gradient(130deg, #2563EB 0%, #7C3AED 50%, #DB2777 100%)',

              boxShadow:
                '0 16px 48px rgba(99,102,241,0.28)',
            }}
          >

            <div className="
              absolute
              inset-0
              bg-gradient-to-br
              from-white/15
              via-transparent
              to-transparent
            " />

            <motion.div
              className="
                absolute
                -right-20
                -bottom-20
                w-64
                h-64
                rounded-full
                bg-white/8
                blur-3xl
              "
              animate={{
                scale: [1, 1.35, 1],
                opacity: [
                  0.3,
                  0.5,
                  0.3,
                ],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
              }}
            />

            <motion.div
              className="
                absolute
                -left-10
                -top-10
                w-48
                h-48
                rounded-full
                bg-white/8
                blur-2xl
              "
              animate={{
                scale: [1, 1.2, 1],
                opacity: [
                  0.2,
                  0.4,
                  0.2,
                ],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                delay: 1.5,
              }}
            />

            <div className="
              relative
              z-10
              flex
              items-center
              justify-between
              px-6
              py-5
              md:px-8
              md:py-6
            ">

              <div>

                <div className="
                  flex
                  items-center
                  gap-2
                  mb-1.5
                ">
                  <Sparkles className="
                    w-3.5
                    h-3.5
                    text-yellow-300
                  " />

                  <span className="
                    text-[10px]
                    font-bold
                    text-white/70
                    uppercase
                    tracking-[0.2em]
                  ">
                    Smart Matching
                  </span>
                </div>

                <h3
                  className="
                    text-white
                    text-xl
                    md:text-2xl
                    font-extrabold
                    mb-1
                    leading-tight
                  "
                  style={{
                    fontFamily:
                      "'Outfit', sans-serif",
                  }}
                >
                  Find My Perfect Match
                </h3>

                <p className="
                  text-white/60  
                  text-sm
                ">
                  Explore matching options based on your preferences and activity
                </p>

              </div>

              <div className="
                flex
                items-center
                gap-2
                pl-4
              ">

                <motion.div
                  whileHover={{
                    scale: 1.1,
                    rotate: 6,
                  }}
                  className="
                    w-12
                    h-12
                    rounded-2xl
                    bg-white/15
                    backdrop-blur-md
                    flex
                    items-center
                    justify-center
                    flex-shrink-0
                  "
                >
                  <TrendingUp className="
                    w-6
                    h-6
                    text-white
                  " />
                </motion.div>

                <ChevronRight className="
                  w-5
                  h-5
                  text-white/50
                " />

              </div>

            </div>

          </motion.div>

        </motion.div>

        <div className="h-4" />

      </div>

      {/* =================================================
          OPTIONAL NOTIFICATION PROMPT
      ================================================= */}

      {showNotificationPrompt && (
        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          className="
            fixed
            bottom-6
            left-4
            right-4
            md:left-auto
            md:right-6
            md:w-[380px]
            z-[60]
            p-5
            rounded-2xl
            bg-white
            dark:bg-[#111827]
            border
            border-gray-200
            dark:border-white/10
            shadow-2xl
          "
        >

          <div className="
            flex
            items-start
            gap-3
          ">

            <div className="
              w-10
              h-10
              rounded-xl
              bg-blue-50
              dark:bg-blue-500/10
              flex
              items-center
              justify-center
              flex-shrink-0
            ">
              <Bell className="
                w-5
                h-5
                text-blue-500
              " />
            </div>

            <div className="min-w-0">

              <h4 className="
                font-bold
                text-gray-900
                dark:text-white
              ">
                Stay updated
              </h4>

              <p className="
                text-sm
                text-gray-500
                dark:text-gray-400
                mt-1
              ">
                Allow notifications so you don't miss important matches and booking updates.
              </p>

              <div className="
                flex
                items-center
                gap-2
                mt-4
              ">

                <button
                  onClick={
                    handleEnableNotifications
                  }
                  className="
                    px-4
                    py-2
                    rounded-xl
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    text-sm
                    font-semibold
                    transition-colors
                  "
                >
                  Enable
                </button>

                <button
                  onClick={() =>
                    setShowNotificationPrompt(
                      false
                    )
                  }
                  className="
                    px-4
                    py-2
                    rounded-xl
                    text-gray-500
                    dark:text-gray-400
                    text-sm
                    font-semibold
                    hover:bg-gray-100
                    dark:hover:bg-white/5
                  "
                >
                  Not now
                </button>

              </div>

            </div>

          </div>

        </motion.div>
      )}

    </div>
  );
}