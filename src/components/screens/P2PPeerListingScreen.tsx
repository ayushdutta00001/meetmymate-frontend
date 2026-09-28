import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  X,
  Users,
  Sparkles,
  Inbox,
  Pencil,
  Filter,
} from 'lucide-react';

import { supabase } from '../../supabase';
import { P2PProfileCard as ProfileCard, type P2PProfile } from '../cards/P2PProfileCard';
import { BackButton } from '../ui/BackButton';

interface P2PPeerListingScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
  onSelectPeer: (peerId: string) => void;
}

/*
 * ============================================================
 * PROFESSION / PRIMARY ROLE FILTER OPTIONS
 * ============================================================
 */

const PROFESSIONS = [
  'Developers',
  'Designers',
  'Marketing Experts',
  'Creators',
  'Founders',
  'Students',
  'Writers',
  'Engineers',
  'Researchers',
  'Product Managers',
  'Sales Professionals',
  'Finance',
  'Healthcare',
  'Educators',
  'Freelancers',
  'Artists',
  'Musicians',
  'Videographers',
  'Photographers',
  'AI Enthusiasts',
  'Game Developers',
  'UI/UX Designers',
  'Data Analysts',
  'Content Strategists',
  'Consultants',
  'Entrepreneurs',
];

export function P2PPeerListingScreen({
  onNavigate,
  onBack,
  onSelectPeer,
}: P2PPeerListingScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProfession, setSelectedProfession] =
    useState('All');

  const [showProfessionFilter, setShowProfessionFilter] =
    useState(false);

  const [showSearch, setShowSearch] = useState(false);

  const [peers, setPeers] = useState<P2PProfile[]>([]);
  const [loading, setLoading] = useState(true);

  const professionFilterRef =
    useRef<HTMLDivElement>(null);

  const searchInputRef =
    useRef<HTMLInputElement>(null);

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
          (item: any) =>
            item.user_id !== currentUserId
        );

        const mappedPeers: P2PProfile[] =
          filtered.map((item: any) => ({
            id: item.user_id,
            user_id: item.user_id,
            name: item.users?.name ?? 'User',
            avatar:
              item.users?.profile_photo_url ?? '',
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
          }));

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
   * AUTO FOCUS SEARCH
   * ============================================================
   */

  useEffect(() => {
    if (!showSearch) return;

    requestAnimationFrame(() => {
      searchInputRef.current?.focus();
    });
  }, [showSearch]);

  /*
   * ============================================================
   * CLOSE FILTER WHEN CLICKING OUTSIDE
   * ============================================================
   */

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        professionFilterRef.current &&
        !professionFilterRef.current.contains(
          event.target as Node
        )
      ) {
        setShowProfessionFilter(false);
      }
    };

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  /*
   * ============================================================
   * SEARCH + FILTER
   * ============================================================
   */

  const filteredPeers = peers.filter((peer) => {
    const query =
      searchQuery.trim().toLowerCase();

    const matchesSearch =
      !query ||
      peer.name
        .toLowerCase()
        .includes(query) ||
      peer.role
        .toLowerCase()
        .includes(query) ||
      peer.bio
        .toLowerCase()
        .includes(query) ||
      peer.expertise.some((item) =>
        item
          .toLowerCase()
          .includes(query)
      );

    const matchesProfession =
      selectedProfession === 'All' ||
      peer.role === selectedProfession;

    return (
      matchesSearch &&
      matchesProfession
    );
  });

  /*
   * ============================================================
   * ACTIONS
   * ============================================================
   */

  const handleViewProfile = (
    profileUserId: string
  ) => {
    console.log(
      'OPEN PROFILE FOR USER:',
      profileUserId
    );

    onSelectPeer(profileUserId);
    onNavigate('p2p-peer-profile');
  };

  const handleConnect = (
    profileUserId: string
  ) => {
    console.log(
      '➡️ Go to Request Meeting screen with user:',
      profileUserId
    );

    onSelectPeer(profileUserId);
    onNavigate('p2p-request-meeting');
  };

  const handleClearFilter = () => {
    setSelectedProfession('All');
    setShowProfessionFilter(false);
  };

  const handleOpenSearch = () => {
    setShowProfessionFilter(false);
    setShowSearch(true);
  };

  const handleCloseSearch = () => {
    setSearchQuery('');
    setShowSearch(false);
  };

  const handleBack = () => {
    if (showSearch) {
      handleCloseSearch();
      return;
    }

    setShowProfessionFilter(false);
    onBack();
  };

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <div
      className="
        min-h-screen
        bg-[#F4F6FA]
        dark:bg-[#0A0F1F]
        pb-24
        md:pb-8
        md:pr-24
      "
    >

      {/* ====================================================== */}
      {/* STICKY HEADER */}
      {/* ====================================================== */}

      <header
        className="
          sticky
          top-0
          z-[100]
          w-full
          bg-[#0A0F1F]/95
          backdrop-blur-xl
          border-b
          border-white/10
          shadow-xl
        "
      >

        {/* HEADER INNER */}
        <div
          className="
            relative
            max-w-7xl
            mx-auto
            px-3
            md:px-6
            py-2.5
            md:py-4
          "
        >

          {/* ================================================= */}
          {/* NORMAL HEADER */}
          {/* ================================================= */}

          <AnimatePresence mode="wait">
            {!showSearch ? (
              <motion.div
                key="normal-header"
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: 1,
                }}
                exit={{
                  opacity: 0,
                }}
              >

                {/* TOP ROW */}
              <div
  className="
    flex
    items-center
    gap-2
    w-full
  "
>

                  {/* LEFT SIDE */}
                 <div
  className="
    flex
    items-center
    gap-2
    flex-1
    min-w-0
  "
>

                    {/* BACK */}
                    <div
                      className="
                        flex-shrink-0
                        [&>button]:!w-9
                        [&>button]:!h-9
                        [&>button]:!border-0
                        [&>button]:!bg-transparent
                        [&>button]:!text-white
                      "
                    >
                      <BackButton
                        onClick={handleBack}
                      />
                    </div>

                    {/* TITLE */}
                    <div className="flex-1 min-w-0">

                    <h2
                    className="text-sm font-extrabold text-gray-900 dark:text-white leading-none tracking-tight"
                    style={{ fontFamily: "'Outfit', sans-serif" }}
                  >
                    PartnerUp
                  </h2>

                     <p
  className="
    text-white/60
    text-[9px]
    md:text-sm
    leading-tight
    truncate
  "
>
  Find your next connection.
</p>

                    </div>

                  </div>

                {/* ================================================= */}
{/* ACTION BUTTONS */}
{/* ================================================= */}

<div
  className="
    flex
    items-center
   gap-2
md:gap-4
    flex-shrink-0
  "
>

  {/* SEARCH */}
  <motion.button
    whileTap={{ scale: 0.9 }}
    type="button"
    onClick={handleOpenSearch}
    aria-label="Search"
    title="Search"
    className="
      flex
      items-center
      justify-center
      w-8
      h-8
      md:w-9
      md:h-9
      p-0
      m-0
      border-0
      outline-none
      bg-transparent
      text-white
      cursor-pointer
    "
    style={{
      color: '#FFFFFF',
      appearance: 'none',
    }}
  >
    <Search
      size={21}
      width={21}
      height={21}
      strokeWidth={2.5}
      stroke="#FFFFFF"
      fill="none"
      style={{
        display: 'block',
        width: 21,
        height: 21,
        minWidth: 21,
        minHeight: 21,
        opacity: 1,
        visibility: 'visible',
      }}
    />
  </motion.button>


  {/* EDIT PROFILE */}
  <motion.button
    whileTap={{ scale: 0.9 }}
    type="button"
    onClick={() =>
      onNavigate('p2p-profile-enable')
    }
    aria-label="Edit profile"
    title="Edit profile"
    className="
      flex
      items-center
      justify-center
      w-8
      h-8
      md:w-9
      md:h-9
      p-0
      m-0
      border-0
      outline-none
      bg-transparent
      text-white
      cursor-pointer
    "
    style={{
      color: '#FFFFFF',
      appearance: 'none',
    }}
  >
    <Pencil
      size={21}
      width={21}
      height={21}
      strokeWidth={2.5}
      stroke="#FFFFFF"
      fill="none"
      style={{
        display: 'block',
        width: 21,
        height: 21,
        minWidth: 21,
        minHeight: 21,
        opacity: 1,
        visibility: 'visible',
      }}
    />
  </motion.button>


  {/* REQUESTS */}
  <motion.button
    whileTap={{ scale: 0.9 }}
    type="button"
    onClick={() =>
      onNavigate('p2p-requests-hub')
    }
    aria-label="Requests"
    title="Requests"
    className="
      flex
      items-center
      justify-center
      w-8
      h-8
      md:w-9
      md:h-9
      p-0
      m-0
      border-0
      outline-none
      bg-transparent
      text-white
      cursor-pointer
    "
    style={{
      color: '#FFFFFF',
      appearance: 'none',
    }}
  >
    <Inbox
      size={21}
      width={21}
      height={21}
      strokeWidth={2.5}
      stroke="#FFFFFF"
      fill="none"
      style={{
        display: 'block',
        width: 21,
        height: 21,
        minWidth: 21,
        minHeight: 21,
        opacity: 1,
        visibility: 'visible',
      }}
    />
  </motion.button>


  {/* FILTER */}
  <div
    ref={professionFilterRef}
    className="relative flex items-center"
  >
    <motion.button
      whileTap={{ scale: 0.9 }}
      type="button"
      onClick={() =>
        setShowProfessionFilter(
          (prev) => !prev
        )
      }
      aria-label="Filter"
      title="Filter"
      className="
        flex
        items-center
        justify-center
        w-8
        h-8
        md:w-9
        md:h-9
        p-0
        m-0
        border-0
        outline-none
        bg-transparent
        cursor-pointer
      "
      style={{
        color:
          selectedProfession !== 'All'
            ? '#3B82F6'
            : '#FFFFFF',
        appearance: 'none',
      }}
    >
      <Filter
        size={21}
        width={21}
        height={21}
        strokeWidth={2.5}
        stroke={
          selectedProfession !== 'All'
            ? '#3B82F6'
            : '#FFFFFF'
        }
        fill="none"
        style={{
          display: 'block',
          width: 21,
          height: 21,
          minWidth: 21,
          minHeight: 21,
          opacity: 1,
          visibility: 'visible',
        }}
      />
    </motion.button>

   
                      {/* FILTER DROPDOWN */}
                      <AnimatePresence>
                        {showProfessionFilter && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              y: -6,
                              scale: 0.98,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                            }}
                            exit={{
                              opacity: 0,
                              y: -6,
                              scale: 0.98,
                            }}
                            transition={{
                              duration: 0.15,
                            }}
                            className="
                              absolute
                              right-0
                              top-full
                              mt-2
                              w-64
                              max-w-[calc(100vw-24px)]
                              rounded-xl
                              bg-[#111827]
                              border
                              border-white/10
                              shadow-2xl
                              overflow-hidden
                            "
                            style={{
                              zIndex: 99999,
                              maxHeight:
                                '320px',
                              overflowY:
                                'auto',
                            }}
                          >

                            {/* ALL */}
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProfession(
                                  'All'
                                );
                                setShowProfessionFilter(
                                  false
                                );
                              }}
                              className={`
                                w-full
                                text-left
                                px-4
                                py-3
                                text-sm
                                font-semibold
                                border-b
                                border-white/5

                                ${
                                  selectedProfession ===
                                  'All'
                                    ? `
                                      bg-blue-500/15
                                      text-blue-400
                                    `
                                    : `
                                      text-gray-300
                                      hover:bg-white/5
                                    `
                                }
                              `}
                            >
                              All Professions
                            </button>

                            {/* PROFESSIONS */}
                            {PROFESSIONS.map(
                              (profession) => (
                                <button
                                  key={
                                    profession
                                  }
                                  type="button"
                                  onClick={() => {
                                    setSelectedProfession(
                                      profession
                                    );
                                    setShowProfessionFilter(
                                      false
                                    );
                                  }}
                                  className={`
                                    w-full
                                    text-left
                                    px-4
                                    py-3
                                    text-sm
                                    font-medium
                                    border-b
                                    border-white/5
                                    last:border-0

                                    ${
                                      selectedProfession ===
                                      profession
                                        ? `
                                          bg-blue-500/15
                                          text-blue-400
                                        `
                                        : `
                                          text-gray-300
                                          hover:bg-white/5
                                        `
                                    }
                                  `}
                                >
                                  {profession}
                                </button>
                              )
                            )}

                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                </div>

                {/* ACTIVE PROFILE BADGE */}
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 5,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: 0.1,
                  }}
                  className="
                    mt-2
                    flex
                    items-center
                  "
                >
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      px-2.5
                      py-1
                      rounded-full
                      bg-white/5
                      border
                      border-white/10
                    "
                  >
                    <Users
                      size={13}
                      className="
                        text-white/60
                      "
                    />

                    <span
                      className="
                        text-[10px]
                        md:text-xs
                        font-semibold
                        text-white/70
                      "
                    >
                      {peers.length} active
                      profiles
                    </span>
                  </div>
                </motion.div>

              </motion.div>
            ) : (

              /* ================================================= */
              /* SEARCH MODE INSIDE STICKY HEADER */
              /* ================================================= */

              <motion.div
                key="search-header"
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: -5,
                }}
                className="
                  flex
                  items-center
                  gap-2
                "
              >

                {/* BACK */}
                <div
                  className="
                    flex-shrink-0
                    [&>button]:!w-9
                    [&>button]:!h-9
                    [&>button]:!border-0
                    [&>button]:!bg-transparent
                    [&>button]:!text-white
                  "
                >
                  <BackButton
                    onClick={handleBack}
                  />
                </div>

                {/* SEARCH INPUT */}
                <div
                  className="
                    relative
                    flex-1
                    min-w-0
                  "
                >
                  <Search
                    size={18}
                    strokeWidth={2.5}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-white/50
                      pointer-events-none
                    "
                  />

                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) =>
                      setSearchQuery(
                        e.target.value
                      )
                    }
                    placeholder="
                      Search professionals...
                    "
                    className="
                      w-full
                      h-9
                      md:h-10
                      pl-10
                      pr-10
                      rounded-lg
                      bg-white/10
                      border
                      border-white/10
                      text-white
                      text-sm
                      placeholder:text-white/40
                      focus:outline-none
                      focus:border-blue-400
                      focus:ring-2
                      focus:ring-blue-500/20
                    "
                  />

                  <button
                    type="button"
                    onClick={
                      handleCloseSearch
                    }
                    aria-label="Close search"
                    className="
                      absolute
                      right-1
                      top-1/2
                      -translate-y-1/2
                      w-7
                      h-7
                      flex
                      items-center
                      justify-center
                      rounded-md
                      text-white/50
                      hover:text-white
                      hover:bg-white/10
                    "
                  >
                    <X
                      size={16}
                      strokeWidth={2.5}
                    />
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </header>

      {/* ====================================================== */}
      {/* MAIN SCROLLING CONTENT */}
      {/* ====================================================== */}

      <main
        className="
          relative
          max-w-7xl
          mx-auto
          px-3
          md:px-6
        "
      >

        {/* ==================================================== */}
        {/* RESULT HEADER */}
        {/* ==================================================== */}

        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          className="
            flex
            items-center
            justify-between
            gap-3
            pt-4
            pb-3
            md:pt-6
            md:pb-4
          "
        >

          <div className="min-w-0">

            <p
              className="
                text-xs
                md:text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Discover professionals
            </p>

            <p
              className="
                text-sm
                md:text-base
                font-bold
                text-gray-900
                dark:text-white
              "
            >
              {filteredPeers.length}{' '}
              professional
              {filteredPeers.length !== 1
                ? 's'
                : ''}
            </p>

          </div>

          {selectedProfession !== 'All' && (
            <button
              type="button"
              onClick={
                handleClearFilter
              }
              className="
                flex-shrink-0
                text-xs
                font-semibold
                text-blue-600
                dark:text-blue-400
                hover:underline
              "
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
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="
              flex
              flex-col
              items-center
              justify-center
              py-20
            "
          >
            <div
              className="
                w-10
                h-10
                rounded-full
                border-4
                border-blue-100
                dark:border-blue-900
                border-t-blue-600
                animate-spin
              "
            />

            <p
              className="
                mt-4
                text-sm
                text-gray-500
                dark:text-gray-400
              "
            >
              Loading active professionals...
            </p>
          </motion.div>
        )}

        {/* ==================================================== */}
        {/* PROFILE GRID */}
        {/* ==================================================== */}

        {!loading && (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-4
              md:gap-6
              items-start
            "
          >

            {filteredPeers.length > 0 ? (
              filteredPeers.map(
                (peer, index) => (
                  <motion.div
                    key={peer.user_id}
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(
                        index * 0.04,
                        0.2
                      ),
                    }}
                    className="
                      min-w-0
                      w-full
                    "
                  >
                    <ProfileCard
                      profile={peer}
                      onViewProfile={
                        handleViewProfile
                      }
                      onSendRequest={
                        handleConnect
                      }
                      delay={0}
                    />
                  </motion.div>
                )
              )
            ) : (

              /* ================================================= */
              /* NO RESULTS */
              /* ================================================= */

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="
                  col-span-full
                  flex
                  flex-col
                  items-center
                  justify-center
                  py-20
                  text-center
                "
              >

                <div
                  className="
                    w-20
                    h-20
                    rounded-3xl
                    bg-gray-100
                    dark:bg-white/5
                    flex
                    items-center
                    justify-center
                    mb-5
                  "
                >
                  <Search
                    size={36}
                    className="
                      text-gray-400
                    "
                  />
                </div>

                <h3
                  className="
                    text-lg
                    font-bold
                    text-gray-900
                    dark:text-white
                    mb-2
                  "
                >
                  No professionals found
                </h3>

                <p
                  className="
                    text-sm
                    text-gray-500
                    dark:text-gray-400
                    max-w-sm
                    mb-6
                  "
                >
                  Try changing your search
                  or selecting a different
                  profession.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedProfession(
                      'All'
                    );
                    setShowProfessionFilter(
                      false
                    );
                    setShowSearch(false);
                  }}
                  className="
                    px-5
                    py-2.5
                    rounded-xl
                    bg-gradient-to-r
                    from-violet-500
                    to-purple-600
                    text-white
                    text-sm
                    font-bold
                    shadow-sm
                    shadow-violet-500/20
                    hover:from-violet-600
                    hover:to-purple-700
                    transition-all
                  "
                >
                  Clear Search & Filter
                </button>

              </motion.div>
            )}

          </div>
        )}

        {/* ==================================================== */}
        {/* BOTTOM AI MATCH CARD */}
        {/* ==================================================== */}

        {!loading &&
          filteredPeers.length > 0 && (
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
                delay: 0.45,
              }}
              className="
                mt-6
                md:mt-8
                mb-4
                flex
                items-center
                gap-3
                p-3
                md:p-4
                rounded-2xl
                border
                border-dashed
                border-blue-300
                dark:border-blue-700/50
                bg-blue-50/70
                dark:bg-blue-900/10
              "
            >

              <div
                className="
                  w-9
                  h-9
                  md:w-10
                  md:h-10
                  rounded-xl
                  bg-violet-100
                  dark:bg-violet-500/15
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                "
              >
                <Sparkles
                  size={18}
                  className="
                    md:w-5
                    md:h-5
                    text-violet-600
                    dark:text-violet-400
                  "
                />
              </div>

              <div
                className="
                  flex-1
                  min-w-0
                "
              >

                <p
                  className="
                    text-xs
                    md:text-sm
                    font-bold
                    text-blue-800
                    dark:text-blue-300
                  "
                >
                  Find your partner and
                  make meaningful
                  connections.
                </p>

                <p
                  className="
                    text-[11px]
                    md:text-xs
                    text-blue-600/80
                    dark:text-blue-400/70
                    mt-0.5
                  "
                >
                  Wish you the best in your
                  search!
                </p>

              </div>

            </motion.div>
          )}

      </main>
    </div>
  );
}

