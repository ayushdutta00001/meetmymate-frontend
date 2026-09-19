import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Users,
  Sparkles,
  Inbox,
  Pencil,
} from 'lucide-react';

import { supabase } from '../../supabase';
import { P2PProfileCard, P2PProfile } from '../cards/P2PProfileCard';
import { BackButton } from '../ui/BackButton';

interface P2PPeerListingScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
  onSelectPeer: (peerId: string) => void;
}

const INDUSTRIES = [
  'All',
  'Technology',
  'Finance',
  'Healthcare',
  'E-commerce',
  'Education',
  'Real Estate',
];

export function P2PPeerListingScreen({
  onNavigate,
  onBack,
  onSelectPeer,
}: P2PPeerListingScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const [peers, setPeers] = useState<P2PProfile[]>([]);
  const [loading, setLoading] = useState(true);

  /*
   * ============================================================
   * LOAD ACTIVE P2P PROFILES
   * ============================================================
   */

  useEffect(() => {
    const loadPeers = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setPeers([]);
          return;
        }

        const currentUserId = user.id;

        const { data, error } = await supabase
          .from('p2p_profiles')
          .select(`
            id,
            user_id,
            headline,
            bio,
            industry,
            skills,
            interests,
            users (
              id,
              name,
              city,
              profile_photo_url
            )
          `)
          .eq('status', 'active')
          .eq('is_active', true);

        if (error) {
          console.error('Load peers error:', error);
          setPeers([]);
          return;
        }

        console.log('RAW P2P DATA:', data);

        const filtered = (data ?? []).filter(
          (item: any) => item.user_id !== currentUserId
        );

        const mappedPeers: P2PProfile[] = filtered.map(
          (item: any) => ({
            id: item.id,
            user_id: item.user_id,
            name: item.users?.name ?? 'User',
            avatar: item.users?.profile_photo_url ?? '',
            role: item.headline ?? '',
            location: item.users?.city ?? '',
            expertise: item.skills ?? [],
            bio: item.bio ?? '',
            industry: item.industry ?? '',
            experience: '',
            verified: true,
            availability: 'in-person',
            skills: item.skills ?? [],
            lookingFor: item.interests ?? [],
            isOnline: false,
          })
        );

        setPeers(mappedPeers);
      } catch (error) {
        console.error('Peer load failed:', error);
        setPeers([]);
      } finally {
        setLoading(false);
      }
    };

    loadPeers();
  }, []);

  /*
   * ============================================================
   * SEARCH + INDUSTRY FILTER
   * ============================================================
   */

  const filteredPeers = peers.filter((peer) => {
    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      !query ||
      peer.name.toLowerCase().includes(query) ||
      peer.role.toLowerCase().includes(query) ||
      peer.industry.toLowerCase().includes(query) ||
      peer.bio.toLowerCase().includes(query) ||
      peer.expertise.some((item) =>
        item.toLowerCase().includes(query)
      );

    const matchesIndustry =
      selectedIndustry === 'All' ||
      peer.industry === selectedIndustry;

    return matchesSearch && matchesIndustry;
  });

  /*
   * ============================================================
   * ACTIONS
   * ============================================================
   */

  const handleViewProfile = (profileUserId: string) => {
    console.log(
      'OPEN PROFILE FOR USER:',
      profileUserId
    );

    onSelectPeer(profileUserId);
    onNavigate('p2p-peer-profile');
  };

  const handleConnect = (profileUserId: string) => {
    console.log(
      '➡️ Go to Request Meeting screen with user:',
      profileUserId
    );

    onSelectPeer(profileUserId);
    onNavigate('p2p-request-meeting');
  };

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <div className="min-h-screen bg-[#F4F6FA] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-r from-[#2563EB] via-[#3C82F6] to-[#4F46E5] shadow-lg"
      >
        {/* Decorative glow */}
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-3xl pointer-events-none" />

        <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-indigo-300/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-4 md:py-5">

          {/* Top row */}
          <div className="flex items-center gap-3">

            {/* Back button */}
            <div className="[&>button]:!border-white/20 [&>button]:!bg-white/10 [&>button]:!text-white [&>button]:hover:!bg-white/20">
              <BackButton onClick={onBack} />
            </div>

            {/* Page title */}
            <div className="flex-1 min-w-0">
              <h1
                className="text-white text-lg md:text-xl font-extrabold leading-tight"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                PartnerUp
              </h1>

              <p className="text-white/70 text-xs md:text-sm mt-0.5">
                Discover people for meaningful professional connections
              </p>
            </div>

            {/* Header actions */}
            <div className="flex items-center gap-2 flex-shrink-0">

              {/* Edit Profile */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  onNavigate('p2p-profile-enable')
                }
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 border border-white/15 text-white text-xs font-bold backdrop-blur-sm transition-all"
              >
                <Pencil className="w-3.5 h-3.5" />

                <span className="hidden sm:inline">
                  Edit Profile
                </span>

                <span className="sm:hidden">
                  Edit
                </span>
              </motion.button>

              {/* My Requests */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() =>
                  onNavigate('p2p-requests-hub')
                }
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-400 text-white hover:bg-blue-500 text-xs font-bold shadow-md transition-all"
              >
                <Inbox className="w-3.5 h-3.5" />

                <span className=" text-2xl text-blue-700 hidden sm:inline">
                  My Requests
                </span>

                <span className="sm:hidden">
                  Requests
                </span>
              </motion.button>

            </div>
          </div>

          {/* Header information */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-4 flex items-center gap-2"
          >
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
              <Users className="w-3.5 h-3.5 text-white/80" />

              <span className="text-[11px] font-semibold text-white/85">
                {peers.length} active profiles
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-white/80" />

              <span className="text-[11px] font-semibold text-white/85">
                Find your next connection
              </span>
            </div>
          </motion.div>

        </div>
      </motion.header>

      {/* ====================================================== */}
      {/* MAIN CONTENT */}
      {/* ====================================================== */}

      <main className="relative max-w-7xl mx-auto px-4 md:px-6">

        {/* ==================================================== */}
        {/* SEARCH */}
        {/* ==================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="pt-5"
        >
          <div className="relative">

            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />

            <input
              type="text"
              placeholder="Search by name, role, industry or expertise..."
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.04] text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:border-violet-500 dark:focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all"
            />

            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            )}

          </div>
        </motion.div>

        {/* ==================================================== */}
        {/* INDUSTRY FILTER CHIPS */}
        {/* ==================================================== */}

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="flex gap-2 overflow-x-auto pt-4 pb-2"
          style={{ scrollbarWidth: 'none' }}
        >
          {INDUSTRIES.map((industry) => (
            <button
              key={industry}
              onClick={() =>
                setSelectedIndustry(industry)
              }
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedIndustry === industry
                  ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-sm'
                  : 'bg-violet-400 dark:bg-white/[0.04] border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-blue-400 dark:hover:border-blue-500/50 shadow-sm'
              }`}
            >
              {industry}
            </button>
          ))}
        </motion.div>

        {/* ==================================================== */}
        {/* RESULT HEADER */}
        {/* ==================================================== */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.22 }}
          className="flex items-center justify-between py-4"
        >
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Discover professionals
            </p>

            <p className="text-base font-bold text-gray-900 dark:text-white">
              {filteredPeers.length}{' '}
              professional
              {filteredPeers.length !== 1 ? 's' : ''}
            </p>
          </div>

          {selectedIndustry !== 'All' && (
            <button
              onClick={() =>
                setSelectedIndustry('All')
              }
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Clear filter
            </button>
          )}
        </motion.div>

        {/* ==================================================== */}
        {/* LOADING */}
        {/* ==================================================== */}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-10 h-10 rounded-full border-4 border-blue-100 dark:border-blue-900 border-t-blue-600 animate-spin" />

            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              Loading active professionals...
            </p>
          </motion.div>
        )}

        {/* ==================================================== */}
        {/* PROFILE GRID */}
        {/* ==================================================== */}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            <AnimatePresence mode="popLayout">
              {filteredPeers.length > 0 ? (
                filteredPeers.map((peer, index) => (
                  <P2PProfileCard
                    key={peer.id}
                    profile={peer}
                    onViewProfile={handleViewProfile}
                    onSendRequest={handleConnect}
                    delay={0.05 * index}
                  />
                ))
              ) : (
                <motion.div
                  key="empty"
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{
                    opacity: 0,
                  }}
                  className="col-span-full flex flex-col items-center justify-center py-20 text-center"
                >
                  <div className="w-20 h-20 rounded-3xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-5">
                    <Search className="w-9 h-9 text-gray-400" />
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    No professionals found
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                    Try changing your search or selecting a different industry.
                  </p>

                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedIndustry('All');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-sm font-bold shadow-sm shadow-violet-500/20 hover:from-violet-600 hover:to-purple-700 transition-all"
                  >
                    Clear Search & Filter
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

        {/* ==================================================== */}
        {/* BOTTOM AI MATCH CARD */}
        {/* ==================================================== */}

        {!loading && filteredPeers.length > 0 && (
          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.6,
            }}
            className="mt-8 mb-4 flex items-center gap-3 p-4 rounded-2xl border border-dashed border-blue-300 dark:border-blue-700/50 bg-blue-50/70 dark:bg-blue-900/10"
          >
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-500/15 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-blue-800 dark:text-blue-300">
                Find your partner and make meaningful connections.
              </p>

              <p className="text-xs text-blue-600/80 dark:text-blue-400/70 mt-0.5">
                Wish you the best in your search!
              </p>
            </div>

            
          </motion.div>
        )}

      </main>
    </div>
  );
}