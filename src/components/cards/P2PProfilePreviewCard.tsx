import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  Briefcase,
  Lightbulb,
  Sparkles,
  Target,
  Eye,
  Zap,
} from 'lucide-react';

interface P2PProfileData {
  profession: string;
  workingOn: string;
  lookingFor: string[];
  skills: string[];
  isVisible: boolean;
}

interface P2PProfilePreviewCardProps {
  formData: P2PProfileData;
  userName?: string;
  profilePhoto?: string | null;
  isEditing?: boolean;
}

export function P2PProfilePreviewCard({
  formData,
  userName = "Your Name",
  profilePhoto = null,
  isEditing = false
}: P2PProfilePreviewCardProps) {
  const [glowIntensity, setGlowIntensity] = useState(0);
  // Animate glow when editing
  useEffect(() => {
    if (isEditing) {
      setGlowIntensity(1);
      const timer = setTimeout(() => setGlowIntensity(0), 800);
      return () => clearTimeout(timer);
    }
  }, [formData, isEditing]);

  const hasContent = formData.profession || formData.workingOn || formData.lookingFor.length > 0 || formData.skills.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      className="relative"
    >
      {/* Animated Gradient Outline */}
      <motion.div
        animate={{
          opacity: glowIntensity,
          scale: glowIntensity ? 1.02 : 1,
        }}
        transition={{ duration: 0.5 }}
        className="absolute -inset-[3px] rounded-[28px] bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 blur-xl"
      />

      {/* Floating Background Layers */}
      <motion.div
        animate={{
          y: [0, -4, 0],
          rotateY: [0, 2, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-indigo-500/5 via-violet-500/10 to-purple-500/5 blur-2xl"
      />

      {/* Main Card Container with 3D Tilt */}
      <motion.div
        whileHover={{
          rotateY: -5,
          rotateX: 5,
          scale: 1.02,
        }}
        transition={{ duration: 0.3 }}
        style={{ transformStyle: 'preserve-3d' }}
        className="relative"
      >
        {/* Gradient Border */}
        <div className="relative rounded-[26px] p-[3px] bg-gradient-to-br from-indigo-500/40 via-violet-500/30 to-purple-500/40 shadow-2xl">
          {/* Card Background - Premium Glassmorphism */}
          <div className="relative rounded-[24px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl overflow-hidden">
            {/* Animated Background Gradient */}
            <motion.div
              animate={{
                background: [
                  'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(168, 85, 247, 0.05) 100%)',
                  'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(168, 85, 247, 0.05) 50%, rgba(99, 102, 241, 0.05) 100%)',
                  'linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(139, 92, 246, 0.05) 50%, rgba(168, 85, 247, 0.05) 100%)',
                ],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'linear',
              }}
              className="absolute inset-0 pointer-events-none"
            />

            {/* Live Indicator */}
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 backdrop-blur-sm">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
                className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"
              />
              <span className="text-xs text-emerald-700 dark:text-emerald-300" style={{ fontWeight: 600 }}>
                Live Preview
              </span>
            </div>

            {/* Content */}
            <div className="relative p-8 space-y-6">
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  animate={{
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Zap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </motion.div>
                <h3 className="text-2xl text-slate-900 dark:text-white" style={{ fontWeight: 700 }}>
                  Your Professional Profile
                </h3>
              </div>

              <AnimatePresence mode="wait">
                {hasContent ? (
                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >
                    {/* Avatar & Name */}
                    <div className="flex items-start gap-4">
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        className="relative"
                      >
                        {/* Avatar Glow */}
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-purple-500 blur-2xl opacity-50" />
                        
                        {/* Avatar */}
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-600 flex items-center justify-center text-white text-2xl shadow-2xl">
  {profilePhoto ? (
    <img
      src={profilePhoto}
      alt="profile"
      className="w-full h-full object-cover"
    />
  ) : (
    <User className="w-10 h-10" />
  )}
</div>
                      </motion.div>

                      <div className="flex-1">
                        <h4 className="text-xl text-slate-900 dark:text-white mb-2" style={{ fontWeight: 700 }}>
                          {userName}
                        </h4>

                        {/* SECTION A - PROFESSION (HIGHLIGHTED) */}
                        {formData.profession ? (
                          <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-700 dark:from-indigo-950/60 dark:to-violet-950/60 border-2 border-b-blue-600 dark:border-e-blue-700 shadow-lg shadow-indigo-500/20"
                          >
                            <Briefcase className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span className="text-indigo-900 dark:text-indigo-200" style={{ fontWeight: 700 }}>
                              {formData.profession}
                            </span>
                          </motion.div>
                        ) : (
                          <p className="text-slate-400 text-sm italic">Add your profession...</p>
                        )}

                        {formData.isVisible && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="inline-flex items-center gap-1 px-3 py-1 mt-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs"
                            style={{ fontWeight: 600 }}
                          >
                            <Eye className="w-3 h-3" />
                            Profile Visible
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* SECTION B - WHAT I'M WORKING ON (HIGHLIGHTED) */}
                    {formData.workingOn && (
                      <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="relative p-5 rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-600 dark:from-violet-950/40 dark:to-purple-950/40 border-2 border-violet-200 dark:border-violet-800 shadow-xl shadow-violet-500/10 overflow-hidden"
                      >
                        {/* Animated Background */}
                        <motion.div
                          animate={{
                            opacity: [0.3, 0.5, 0.3],
                          }}
                          transition={{
                            duration: 3,
                            repeat: Infinity,
                          }}
                          className="absolute inset-0 bg-gradient-to-br from-violet-400/10 to-purple-400/10"
                        />

                        <div className="relative">
                          <label className="flex items-center gap-2 text-sm text-violet-900 dark:text-violet-100 mb-2 uppercase tracking-wider" style={{ fontWeight: 700 }}>
                            <Lightbulb className="w-4 h-4" />
                            Currently Working On
                          </label>
                          <p className="text-slate-800 dark:text-slate-200 leading-relaxed">
                            {formData.workingOn}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* SECTION D - SKILLS I OFFER (MOST HIGHLIGHTED - PRIMARY FOCUS) */}
                    {formData.skills.length > 0 && (
                      <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="relative p-6 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-fuchsia-500 dark:from-emerald-950/40 dark:to-teal-950/40 border-4 border-emerald-800 dark:border-emerald-800 shadow-2xl shadow-emerald-500/30 overflow-hidden"
                      >
                        {/* Animated Sparkles Background */}
                        <motion.div
                          animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.2, 0.4, 0.2],
                          }}
                          transition={{
                            duration: 4,
                            repeat: Infinity,
                          }}
                          className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-green-500 to-green-500 rounded-full blur-3xl"
                        />

                        <div className="relative">
                          <label className="flex items-center gap-2 text-base text-emerald-600 dark:text-emerald-500 mb-4 uppercase tracking-wider" style={{ fontWeight: 700 }}>
                            <Sparkles className="w-5 h-5" />
                            ⭐ Skills I Offer
                          </label>
                          <div className="flex flex-wrap gap-2.5">
                            {formData.skills.map((skill, index) => (
                              <motion.span
                                key={skill}
                                initial={{ scale: 0, rotate: -10 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{
                                  delay: 0.3 + index * 0.05,
                                  type: 'spring',
                                  stiffness: 200,
                                  damping: 15,
                                }}
                                whileHover={{
                                  scale: 1.1,
                                  rotate: 3,
                                  y: -4,
                                }}
                                className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-xl shadow-emerald-500/40 hover:shadow-emerald-500/60 transition-shadow cursor-pointer"
                                style={{ fontWeight: 600 }}
                              >
                                {skill}
                              </motion.span>
                            ))}
                          </div>
                        </div>

                        {/* Corner Accent */}
                        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-bl-full" />
                      </motion.div>
                    )}

                    {/* SECTION C - LOOKING FOR (HIGHLIGHTED) */}
                    {formData.lookingFor.length > 0 && (
                      <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="relative p-5 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 dark:from-blue-950/40 dark:to-cyan-950/40 border-2 border-blue-200 dark:border-blue-800 shadow-xl shadow-blue-500/10"
                      >
                        <label className="flex items-center gap-2 text-sm text-blue-900 dark:text-blue-100 mb-3 uppercase tracking-wider" style={{ fontWeight: 700 }}>
                          <Target className="w-4 h-4" />
                          Looking to Connect With
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {formData.lookingFor.map((option, index) => (
                            <motion.span
                              key={option}
                              initial={{ scale: 0, y: 10 }}
                              animate={{ scale: 1, y: 0 }}
                              transition={{
                                delay: 0.35 + index * 0.05,
                                type: 'spring',
                                stiffness: 150,
                              }}
                              whileHover={{ scale: 1.05, y: -2 }}
                              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-cyan-500 text-white rounded-full shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-shadow"
                              style={{ fontWeight: 600 }}
                            >
                              {option}
                            </motion.span>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                  
                ) : (
                  // Empty State
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-16"
                  >
                    <motion.div
                      animate={{
                        y: [0, -10, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: 'easeInOut',
                      }}
                      className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 flex items-center justify-center mx-auto mb-6 shadow-xl"
                    >
                      <User className="w-12 h-12 text-slate-400" />
                    </motion.div>
                    <p className="text-slate-500 dark:text-slate-400 text-lg mb-2" style={{ fontWeight: 600 }}>
                      Your profile preview will appear here
                    </p>
                    <p className="text-slate-400 dark:text-slate-500 text-sm">
                      Fill out the form to see your professional networking card
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Accent Line */}
            <motion.div
              animate={{
                scaleX: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500"
            />
          </div>
        </div>

        {/* 3D Shadow Layer */}
        <div
          className="absolute inset-0 rounded-[26px] bg-gradient-to-br from-indigo-500/20 via-violet-500/20 to-purple-500/20 blur-2xl -z-10 transform translate-y-4"
          style={{ transform: 'translateZ(-50px)' }}
        />
      </motion.div>
    </motion.div>
  );
}
