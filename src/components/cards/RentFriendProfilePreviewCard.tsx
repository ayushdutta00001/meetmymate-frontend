import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

import {
  User,
  Zap,
} from "lucide-react";

interface RentFriendProfilePreviewProps {
  userName?: string;
  profilePhoto?: string | null;
  services: string[];
  hourlyRate: string;
  availability: string[];
  isEditing?: boolean;
}

export function RentFriendProfilePreviewCard({
  userName = "Your Name",
  profilePhoto,
  services,
  hourlyRate,
  availability,
  isEditing = false
}: RentFriendProfilePreviewProps) {

  const [glow, setGlow] = useState(0);

  useEffect(() => {
    if (isEditing) {
      setGlow(1);
      const t = setTimeout(() => setGlow(0), 700);
      return () => clearTimeout(t);
    }
  }, [services, hourlyRate, availability, isEditing]);

  const hasContent =
    services.length > 0 ||
    availability.length > 0 ||
    hourlyRate;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.6 }}
      className="relative"
    >

      {/* Glow Border */}
      <motion.div
        animate={{ opacity: glow, scale: glow ? 1.02 : 1 }}
        className="absolute -inset-[3px] rounded-[28px] bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 blur-xl"
      />

      {/* Floating BG */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
        className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-indigo-500/5 via-violet-500/10 to-purple-500/5 blur-2xl"
      />

      {/* Card */}
      <motion.div
        whileHover={{ rotateY: -5, rotateX: 5, scale: 1.02 }}
        className="relative"
      >
        <div className="rounded-[26px] p-[3px] bg-gradient-to-br from-indigo-500/40 via-violet-500/30 to-purple-500/40 shadow-2xl">

          <div className="rounded-[24px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl overflow-hidden">

            {/* Header */}
            <div className="p-6 flex items-center gap-3">
              <Zap className="w-6 h-6 text-indigo-500" />
              <h3 className="text-xl font-bold">Your Rent Friend Profile</h3>
            </div>

            <div className="px-6 pb-6 space-y-6">

              <AnimatePresence mode="wait">
                {hasContent ? (

                  <motion.div
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-5"
                  >

                    {/* Avatar + Name */}
                    <div className="flex items-center gap-4">

                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-indigo-600 to-purple-600">

                        {profilePhoto ? (
                          <img
                            src={profilePhoto}
                            alt="profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-white">
                            <User className="w-10 h-10" />
                          </div>
                        )}
                      </div>

                      <div>
                        <h4 className="text-lg font-semibold">
                          {userName}
                        </h4>
                        <p className="text-sm text-gray-500">
                          ₹{hourlyRate || "0"}/hr
                        </p>
                      </div>
                    </div>

                    {/* Services */}
                    {services.length > 0 && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30">
                        <p className="text-sm font-semibold mb-2">
                          Services Offered
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {services.map((s, i) => (
                            <motion.span
                              key={s}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              className="px-3 py-1 rounded-full bg-blue-500 text-white text-xs"
                            >
                              {s}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Availability */}
                    {availability.length > 0 && (
                      <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30">
                        <p className="text-sm font-semibold mb-2">
                          Availability
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {availability.map((a, i) => (
                            <motion.span
                              key={a}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              className="px-3 py-1 rounded-full bg-green-500 text-white text-xs"
                            >
                              {a}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    )}

                  </motion.div>

                ) : (

                  /* Empty State */
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <User className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                    <p className="text-gray-500">
                      Your preview will appear here
                    </p>
                  </motion.div>

                )}
              </AnimatePresence>

            </div>

            {/* Bottom Accent */}
            <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}