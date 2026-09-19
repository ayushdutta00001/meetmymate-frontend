import { supabase } from '../../supabase';
import { useEffect, useState } from 'react';
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle, MapPin, Briefcase, Award, Clock, Send } from 'lucide-react';
import { BackButton } from '../ui/BackButton';
import { mapP2PProfile } from '../../lib/mappers/p2pProfileMapper';
interface P2PPeerProfileScreenProps {
  onNavigate: (page: string, param?: string | number) => void;
  onBack: () => void;
  peerId: string | null;
}
type PeerProfileRow = {
  user_id: string;
  headline: string | null;
  bio: string | null;
  skills: string[] | null;
  interests: string[] | null;

  building_title?: string | null;
  building_description?: string | null;
  building_stage?: string | null;

  seeking_title?: string | null;
  seeking_description?: string | null;

  experience?: any[];
  education?: string | null;

  users: {
    name: string | null;
    city: string | null;
    profile_photo_url: string | null;
  };
};
export function P2PPeerProfileScreen({ onNavigate, onBack, peerId }: P2PPeerProfileScreenProps) {
  
const [profile, setProfile] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [showProfilePhoto, setShowProfilePhoto] = useState(false);

useEffect(() => {
  const loadProfile = async () => {
    if (!peerId) return;

    try {
      setLoading(true);

   const { data, error } = await supabase
  .from("p2p_profiles")
  .select(`
  user_id,
  headline,
  bio,
  industry,
  skills,
  interests,

  building_title,
  building_description,
  building_stage,

  seeking_title,
  seeking_description,

  experience,
  education,

  users!inner (
    name,
    city,
    profile_photo_url
  )
`)
  .eq("user_id", peerId)
  .eq("status", "active")
  .eq("is_active", true)
  .maybeSingle<PeerProfileRow>();
if (error) {
  console.error("Profile load error:", error);
  return;
}

if (!data) {
  console.warn("⚠️ No visible active profile found");
  return;
}
console.log("BUILDING TITLE:", data.building_title);
     console.log("🔥 RAW EXPERIENCE FROM DB:", data.experience);

      
console.log("PeerProfileScreen received userId:", peerId);
  setProfile(mapP2PProfile(data));
  console.log("MAPPED EXPERIENCE:", mapP2PProfile(data).experience);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  loadProfile();
}, [peerId]);
  
if (loading || !profile) {
  return (
    <div className="p-10 text-center text-gray-400">
      Loading profile...
    </div>
  );
}
  return (
    
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-4xl mx-auto px-6 py-6">
          <BackButton onClick={onBack} />
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6 items-start">
             {/* LEFT SIDE GROUP */}
  <div className="flex gap-6 items-start">
            {/* Profile Image */}
            <div className="relative">
             <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
  <img
    src={profile.avatar || "/default-avatar.png"}
    onClick={() => setShowProfilePhoto(true)}
    onError={(e) => {
      (e.currentTarget as HTMLImageElement).src = "/default-avatar.png";
    }}
    alt={profile.name}
    className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
  />
</div>
              {profile.verified && (
                <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center border-4 border-white dark:border-[#0A0F1F]">
                  <CheckCircle className="w-6 h-6 text-white" fill="white" />
                </div>
              )}
            </div>
{/* Profession */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="mb-8 p-6 rounded-2xl border border-blue-200 dark:border-blue-900/30 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
>
  <h3 className="text-blue-700 dark:text-blue-400 mb-4">
    Profession
  </h3>

  <div className="flex gap-4 items-center">
    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
      <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
    </div>

    <p className="text-gray-900 dark:text-gray-100 font-semibold">
      {profile.role}
    </p>
  </div>
</motion.div>
</div>
            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="mb-2">{profile.name}</h1>
              
              <div className="flex flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{profile.location}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{profile.availability}</span>
                </div>
              </div>

              
            </div>
          </div>
        </motion.div>
{/* What I'm Working On */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="mb-8 p-6 rounded-2xl border border-blue-200 dark:border-blue-900/30 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
>
  <h3 className="text-blue-600 dark:text-blue-400 mb-3">
    What I'm Working On
  </h3>

  <p className="text-gray-700 dark:text-gray-300">
    {profile?.about || "No details added yet."}
  </p>
</motion.div>
{/* Who I Want To Find */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="mb-8 p-6 rounded-2xl border border-orange-200 dark:border-orange-900/30 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20"
>
  <h3 className="text-orange-600 dark:text-orange-400 mb-4">
    Who I Want To Find
  </h3>

  <div className="flex flex-wrap gap-2">
    {profile?.seeking?.skills.map((item: string, index: number) => (
      <span
        key={index}
        className="px-3 py-1.5 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-sm"
      >
        {item}
      </span>
    ))}
  </div>
</motion.div>
{Array.isArray(profile?.experience) && profile.experience.length > 0 && (
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="mb-8 p-6 rounded-2xl border border-blue-200 dark:border-blue-900/30 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
>
  <h3 className="text-blue-600 dark:text-blue-400 mb-4">
    Experience
  </h3>

  <div className="space-y-4">
    {profile.experience.map((exp: any, index: number) => (
      <div key={index} className="flex gap-4 items-center">
        <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>

        <div>
          <p className="font-semibold">{exp.title}</p>
          <p className="text-sm text-gray-500">{exp.company}</p>
          <p className="text-sm text-gray-400">{exp.duration}</p>
        </div>
      </div>
    ))}
  </div>
</motion.div>
)}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  className="mb-8 p-6 rounded-2xl border border-blue-200 dark:border-blue-900/30 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20"
>
  <h3 className="text-blue-600 dark:text-blue-400 mb-4">
    Education
  </h3>

  <div className="flex gap-4 items-center">
    <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
      <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
    </div>

    <p className="text-gray-900 dark:text-gray-100 font-medium">
      {profile?.education || "Not specified"}
    </p>
  </div>
</motion.div>
        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <h3 className="text-emerald-500 dark:text-emerald-400 mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {profile.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1.5 rounded-lg bg-green-600 dark:bg-green-700 border border-b-green-800 dark:border-green-900 text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Profile Photo Viewer */}
<AnimatePresence>
  {showProfilePhoto && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => setShowProfilePhoto(false)}
    >
      
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ duration: 0.2 }}
        className="relative max-w-5xl max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setShowProfilePhoto(false)}
          aria-label="Close profile photo"
          className="absolute -top-5 right-3 w-7 h-7 rounded-full bg-white text-black text-black-lg flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
        >
          ✕
        </button>
        <img
          src={profile.avatar || "/default-avatar.png"}
          alt={profile.name}
          className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "/default-avatar.png";
          }}
        />

        
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex gap-3"
        >
          <button
           onClick={() => {
  if (!peerId) {
    console.error('Cannot request meeting: missing peerId');
    return;
  }

  onNavigate('p2p-request-meeting', peerId);
}}
            className="flex-1 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-5 h-5" />
            <span>Send Meeting Request</span>
          </button>
          <button
            onClick={onBack}
            className="px-6 py-4 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
          >
            Back
          </button>
        </motion.div>
      </div>
    </div>
  );
}
