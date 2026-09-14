import { supabase } from '../../supabase';
import { useEffect } from 'react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, MapPin, Briefcase, X, Users, TrendingUp, Sparkles } from 'lucide-react';
import { P2PProfileCard, P2PProfile } from '../cards/P2PProfileCard';
import { BackButton } from '../ui/BackButton';

interface P2PPeerListingScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
  onSelectPeer: (peerId: string) => void;
}

export function P2PPeerListingScreen({ onNavigate, onBack, onSelectPeer }: P2PPeerListingScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');
const [peers, setPeers] = useState<P2PProfile[]>([]);
const [loading, setLoading] = useState(true);
const [myProfileActive, setMyProfileActive] = useState(false);


  const industries = ['all', 'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education', 'Real Estate'];
  const roles = ['all', 'Founder', 'Co-Founder', 'Investor', 'Advisor', 'Technical Partner', 'Business Partner'];

 
useEffect(() => {
  const loadPeers = async () => {
    try {
      setLoading(true);

      // get session user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
const { data: sessionData } = await supabase.auth.getSession();
const currentUserId = sessionData.session?.user?.id;

const { data: myProfile, error: myProfileError } = await supabase
  .from("p2p_profiles")
  .select("status, is_active")
  .eq("user_id", currentUserId)
  .maybeSingle();

if (myProfileError) {
  console.error("My P2P profile load error:", myProfileError);
} else if (myProfile) {
  const isCurrentlyActive =
    myProfile.status === "active" &&
    myProfile.is_active === true;

  setMyProfileActive(isCurrentlyActive);
}
      // fetch active p2p profiles
     const { data, error } = await supabase
  .from("p2p_profiles")
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
  .eq("status", "active")
  .eq("is_active", true);
        //.neq("user_id", user.id); // hide current user

      if (error) {
        console.error("Load peers error:", error);
        return;
      }

      console.log("RAW P2P DATA:", data);

      // 🔥 transform DB → UI format
    const filtered = data.filter(
  (item: any) => item.user_id !== currentUserId
);

const mappedPeers: P2PProfile[] = filtered.map((item: any) => ({
  id: item.id,
  user_id: item.user_id,
  name: item.users?.name ?? "User",
  avatar: item.users?.profile_photo_url ?? "",
  role: item.headline ?? "",
  location: item.users?.city ?? "",
  expertise: item.skills ?? [],
  bio: item.bio ?? "",
  industry: item.industry ?? "",
  experience: "",
  verified: true,
  availability: "in-person",
  skills: item.skills ?? [],
  lookingFor: item.interests ?? [],
  isOnline: false,
}));
      setPeers(mappedPeers);

    } catch (err) {
      console.error("Peer load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  loadPeers();
}, []);


  // Filter peers
  const filteredPeers = peers.filter(peer => {
    const matchesSearch = peer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         peer.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         peer.bio.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || peer.industry === selectedIndustry;
    const matchesRole = selectedRole === 'all' || peer.role.includes(selectedRole);
    return matchesSearch && matchesIndustry && matchesRole;
  });

 const handleViewProfile = (profileUserId: string) => {
  console.log("OPEN PROFILE FOR USER:", profileUserId);
  onSelectPeer(profileUserId);
  onNavigate("p2p-peer-profile");
};

 const handleSendRequest = (profileUserId: string) => {
  console.log("➡️ Go to Request Meeting screen with user:", profileUserId);

  onSelectPeer(profileUserId); // store selected user
  onNavigate("p2p-request-meeting"); // open meeting screen
};
 
const handleToggleProfileListing = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

   // ==============================
// UNLIST
// ==============================
if (myProfileActive) {
  const { error } = await supabase
    .from("p2p_profiles")
    .update({
      status: "inactive",
      is_active: false,
    })
    .eq("user_id", user.id);

  if (error) {
    console.error("❌ Unlist failed:", error);
    return;
  }

  setMyProfileActive(false);

  console.log("✅ Profile unlisted");

  // Stay on the P2P listing screen.
  // The button will automatically change to
  // "List My Profile".
  return;
}

    // =========================
    // LIST PROFILE AGAIN
    // =========================

    const { error } = await supabase
      .from("p2p_profiles")
      .update({
        status: "active",
        is_active: true,
        expires_at: null,
      })
      .eq("user_id", user.id);

    if (error) {
      console.error("❌ Listing failed:", error);
      return;
    }

    setMyProfileActive(true);

    console.log("✅ Profile listed permanently");

  } catch (err) {
    console.error("❌ Toggle listing crashed:", err);
  }
};

return(
    <div className="min-h-screen bg-fuchsia-700 dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
    {/* Header */}
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="border-b border-gray-200 dark:border-gray-800"
>
  <div className="max-w-7xl mx-auto px-6 py-6">
  {/* Top Row */}
  <div className="flex items-center justify-between">
    <BackButton onClick={onBack} />

    {/* Right Side Actions */}
    <div className="flex items-center gap-3">
      {/* EDIT BUTTON */}
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => onNavigate("p2p-profile-enable")}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700"
      >
        Edit Profile
      </motion.button>
 <motion.button
 whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
 onClick={() => onNavigate("p2p-requests-hub")}
  className="px-4 py-2 rounded-lg bg-sky-500 text-white text-sm font-semibold hover:bg-sky-600"
>
  My Requests
</motion.button>
      {/* UNLIST BUTTON */}
     <motion.button
  whileHover={{ scale: 1.03 }}
  whileTap={{ scale: 0.97 }}
  onClick={handleToggleProfileListing}
  className={`px-4 py-2 rounded-lg text-white text-sm font-semibold ${
    myProfileActive
      ? "bg-red-600 hover:bg-red-700"
      : "bg-green-600 hover:bg-green-700"
  }`}
>
  {myProfileActive ? "Unlist My Profile" : "List My Profile"}
</motion.button>
    </div>
  </div>

  {/* Title Area */}
  <div className="text-center mt-6">
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20"
    >
      <Users className="w-10 h-10 text-white" />
    </motion.div>

    <h1 className="mb-2">Find Your Business Match</h1>

    <p className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
      Connect with co-founders, investors, and business partners
    </p>
  </div>
  </div>
</motion.div>
   
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-slate-900 border border-blue-100 dark:border-blue-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{filteredPeers.length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Active Profiles</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-white dark:from-green-900/20 dark:to-slate-900 border border-green-100 dark:border-green-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{filteredPeers.filter(p => p.isOnline).length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Online Now</p>
              </div>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/20 dark:to-slate-900 border border-purple-100 dark:border-purple-800 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{industries.length - 1}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Industries</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex gap-3 mb-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, role, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>

            {/* Filter Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3.5 rounded-xl border-2 transition-all flex items-center gap-2 font-medium ${
                showFilters
                  ? 'border-blue-500 bg-cyan-600 dark:bg-teal-600 text-blue-600 dark:text-blue-400 shadow-lg shadow-blue-500/20'
                  : 'border-gray-200 dark:border-b-cyan-600 bg-cyan-600 dark:bg-teal-600 hover:border-blue-500 shadow-sm'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
              {(selectedIndustry !== 'all' || selectedRole !== 'all') && (
                <span className="w-2 h-2 rounded-full bg-cyan-600 dark:bg-blue-400"></span>
              )}
            </motion.button>
          </div>

          {/* Filter Options */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-6 rounded-xl bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-950/20 border-2 border-gray-200 dark:border-gray-700 shadow-lg"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Industry Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Industry
                    </label>
                    <div className="relative">
                      <select
                        value={selectedIndustry}
                        onChange={(e) => setSelectedIndustry(e.target.value)}
                        className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                      >
                        {industries.map(industry => (
                          <option key={industry} value={industry}>
                            {industry === 'all' ? 'All Industries' : industry}
                          </option>
                        ))}
                      </select>
                      <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Role Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                      Role
                    </label>
                    <div className="relative">
                      <select
                        value={selectedRole}
                        onChange={(e) => setSelectedRole(e.target.value)}
                        className="w-full px-4 py-3 pr-10 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:border-blue-500 dark:focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all appearance-none cursor-pointer"
                      >
                        {roles.map(role => (
                          <option key={role} value={role}>
                            {role === 'all' ? 'All Roles' : role}
                          </option>
                        ))}
                      </select>
                      <Users className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Clear Filters */}
                {(selectedIndustry !== 'all' || selectedRole !== 'all') && (
                  <motion.button
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => {
                      setSelectedIndustry('all');
                      setSelectedRole('all');
                    }}
                    className="mt-4 px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors flex items-center gap-2 text-sm font-medium"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-4"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-gray-100">{filteredPeers.length}</span> professional{filteredPeers.length !== 1 ? 's' : ''} found
          </p>
        </motion.div>
{loading && (
  <p className="text-center text-gray-400 py-10">
    Loading active professionals...
  </p>
)}
        {/* Profiles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPeers.map((peer, index) => (
             <P2PProfileCard
              
  key={peer.user_id}
  profile={peer}
  onViewProfile={() => handleViewProfile(peer.user_id)}
  onSendRequest={() => handleSendRequest(peer.user_id)}

                delay={0.1 + index * 0.05}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* No Results */}
        {filteredPeers.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No Results Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedIndustry('all');
                setSelectedRole('all');
              }}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all font-medium shadow-lg shadow-blue-500/30"
            >
              Clear All
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
