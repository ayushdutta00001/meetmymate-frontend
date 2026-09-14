import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Briefcase, CheckCircle, ArrowRight, Send, Target, Sparkles } from 'lucide-react';

export interface P2PProfile {
  id: string;
  user_id: string;
  name: string;
  avatar?: string;
  role: string;
  company?: string;
  location: string;
  expertise: string[];
  bio: string;
  industry: string;
  experience: string;
  verified: boolean;
  availability: string;
  skills: string[];
  lookingFor: string[];
  isOnline?: boolean;
}

interface P2PProfileCardProps {
  profile: P2PProfile;
  onViewProfile: (profileId: string) => void;
  onSendRequest: (profileId: string) => void;
  delay?: number;
}

export function P2PProfileCard({ profile, onViewProfile, onSendRequest, delay = 0 }: P2PProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -4 }}
      className="group relative"
    >
      {/* Main Card */}
      <div className="relative rounded-2xl bg-sky-800 dark:bg-slate-900 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 transition-all overflow-hidden shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/20">
        {/* Gradient Top Bar */}
        <div className="h-2 bg-gradient-to-r from-purple-500 via-blue-500 to-green-500" />
        
        {/* Content */}
        <div className="p-6">
          {/* Header with Avatar */}
          <div className="flex items-start gap-4 mb-4 pb-4 border-b-2 border-gray-100 dark:border-gray-800">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 border-2 border-purple-300 dark:border-purple-700 shadow-md">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl text-white font-bold">
                    {profile.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Verified Badge */}
              {profile.verified && (
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center border-2 border-white dark:border-gray-900 shadow-md">
                  <CheckCircle className="w-4 h-4 text-white" fill="white" />
                </div>
              )}

              {/* Online Indicator */}
              {profile.isOnline && (
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900 shadow-sm animate-pulse" />
              )}
            </div>

            {/* Info Section */}
            <div className="flex-1 min-w-0">
              <h3 className="mb-2 truncate font-bold text-gray-900 dark:text-gray-100">
                {profile.name}
              </h3>
              {/* Role/Profession - Purple Highlight */}
              <div className="inline-block px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 shadow-md mb-2">
                <p className="text-xs text-white font-bold">
                  {profile.role}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 mt-1">
                <MapPin className="w-3.5 h-3.5" />
                <span className="font-medium">{profile.location}</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4 line-clamp-2 leading-relaxed">
            {profile.bio}
          </p>

          {/* Industry & Experience */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-bold shadow-sm">
              <Briefcase className="w-3.5 h-3.5" />
              <span>{profile.industry}</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-cyan-600 dark:bg-teal-600 text-gray-900 dark:text-gray-100 text-xs font-bold shadow-sm">
              {profile.experience}
            </div>
          </div>

          {/* Looking For - Orange Highlight */}
          {profile.lookingFor && profile.lookingFor.length > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-2 border-orange-200 dark:border-orange-800 shadow-sm">
              <p className="text-xs font-bold text-orange-700 dark:text-orange-400 mb-2 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                Looking For:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.lookingFor.slice(0, 2).map((item, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold shadow-sm"
                  >
                    {item}
                  </span>
                ))}
                {profile.lookingFor.length > 2 && (
                  <span className="px-2.5 py-1 rounded-lg bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 text-xs font-bold">
                    +{profile.lookingFor.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Skills - Green Highlight */}
          {profile.skills.length > 0 && (
            <div className="mb-5 p-3 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 shadow-sm">
              <p className="text-xs font-bold text-green-700 dark:text-green-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Key Skills:
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold shadow-sm"
                  >
                    {skill}
                  </span>
                ))}
                {profile.skills.length > 4 && (
                  <span className="px-2.5 py-1 rounded-lg bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200 text-xs font-bold">
                    +{profile.skills.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}
          <div className="h-4"></div>
          {/* Action Buttons */}
          <div className="flex gap-2 mt-5">
            {/* Primary Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                onSendRequest(profile.id);
              }}
              className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white transition-all flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              <Send className="w-4 h-4" />
              <span>Send Request</span>
            </motion.button>

            {/* Secondary Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={(e) => {
                e.stopPropagation();
                onViewProfile(profile.id);
              }}
              className="flex-1 px-4 py-3 rounded-xl bg-cyan-800 hover:bg-cyan-700 border-2 border-b-cyan-400 border-b-cyan-400 hover:border-b-cyan-800 dark:hover:border-r-cyan-800 text-cyan-500 dark:text-cyan-500 transition-all flex items-center justify-center gap-2 text-sm font-bold shadow-sm hover:shadow-md"
            >
              <span>View Profile</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
