import React from 'react';
import { motion } from 'motion/react';
import { Heart, X } from 'lucide-react';

interface MatchNotificationProps {
  onViewMatch: () => void;
  onDismiss: () => void;
}

export function MatchNotificationBanner({ onViewMatch, onDismiss }: MatchNotificationProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4"
    >
      <div className="backdrop-blur-xl bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 rounded-2xl p-6 shadow-2xl border border-white/20">
        <button
          onClick={onDismiss}
          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all"
        >
          <X className="w-4 h-4 text-white" />
        </button>
        
        <div className="flex items-start gap-4 mb-4">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
          >
            <Heart className="w-6 h-6 text-white fill-white" />
          </motion.div>
          <div className="flex-1">
            <h4 className="text-white mb-1">Match Found! 🎉</h4>
            <p className="text-sm text-white/90">
              We found a compatible match for your blind date. View details and confirm within 24 hours!
            </p>
          </div>
        </div>
        
        <button
          onClick={onViewMatch}
          className="w-full py-3 rounded-xl bg-white text-red-600 hover:bg-white/90 transition-all font-medium"
        >
          View Match Details
        </button>
      </div>
    </motion.div>
  );
}
