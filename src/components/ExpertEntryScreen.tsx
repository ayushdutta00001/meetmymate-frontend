import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, GraduationCap, UserPlus, Briefcase } from 'lucide-react';

interface ExpertEntryScreenProps {
  onBack: () => void;
  onSelectCustomer: () => void;
  onSelectExpert: () => void;
  onNavigate: (page: string) => void;
}

export function ExpertEntryScreen({ onBack, onSelectCustomer, onSelectExpert, onNavigate }: ExpertEntryScreenProps) {
  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass dark:glass-dark border-b border-white/20 dark:border-gray-800/50 backdrop-blur-xl"
      >
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onBack}
              className="w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2>Find Experienced People</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Book meetings with verified experts
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two Cards */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Card 1: Book a Session */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            whileHover={{ scale: 1.02 }}
            className="glass dark:glass-dark rounded-3xl p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 cursor-pointer"
            onClick={onSelectCustomer}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center mb-6">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-3">Book a Session</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Find and book meetings with verified experts based on their available time slots.
            </p>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-xl transition-all">
              Browse Experts
            </button>
          </motion.div>

          {/* Card 2: Become an Expert */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.02 }}
            className="glass dark:glass-dark rounded-3xl p-8 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 cursor-pointer"
            onClick={onSelectExpert}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mb-6">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-3">Become an Expert</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Share your expertise, set your schedule, and earn by helping others grow.
            </p>
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:shadow-xl transition-all">
              Apply as Expert
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}