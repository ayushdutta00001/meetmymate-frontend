import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Star, MapPin, Calendar, Heart, MessageCircle, Shield } from 'lucide-react';
import { Card } from '../Card';

interface ProviderDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBook: () => void;
  onSave: () => void;
  provider?: {
    id: number;
    name: string;
    age: number;
    image: string;
    city: string;
    bio: string;
    interests: string[];
    rating: number;
    reviews: number;
    price: number;
    availability: boolean;
    verified?: boolean;
  };
}

export function ProviderDetailsModal({
  isOpen,
  onClose,
  onBook,
  onSave,
  provider,
}: ProviderDetailsModalProps) {
  if (!provider) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <Card variant="glass" className="relative">
              {/* Close Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center hover:bg-white/20 dark:hover:bg-white/10 transition-all"
              >
                <X className="w-5 h-5" />
              </motion.button>

              {/* Provider Image */}
              <div className="relative h-80 -m-6 mb-6 overflow-hidden rounded-t-3xl">
                <img
                  src={provider.image}
                  alt={provider.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Verified Badge */}
                {provider.verified && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                    className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-full text-sm"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Verified</span>
                  </motion.div>
                )}

                {/* Availability Badge */}
                <div className="absolute top-4 right-16">
                  <div className={`px-3 py-1.5 rounded-full text-sm ${
                    provider.availability
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-500 text-white'
                  }`}>
                    {provider.availability ? 'Available' : 'Busy'}
                  </div>
                </div>

                {/* Basic Info Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-white mb-2"
                  >
                    {provider.name}, {provider.age}
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="flex items-center gap-4"
                  >
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{provider.city}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-current text-yellow-400" />
                      <span className="text-sm">{provider.rating}</span>
                      <span className="text-sm text-white/70">({provider.reviews} reviews)</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                {/* Bio */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4 className="mb-2">About</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {provider.bio}
                  </p>
                </motion.div>

                {/* Interests */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25 }}
                >
                  <h4 className="mb-3">Interests</h4>
                  <div className="flex flex-wrap gap-2">
                    {provider.interests.map((interest, index) => (
                      <motion.span
                        key={interest}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="px-4 py-2 bg-gradient-to-r from-[#3C82F6]/10 to-[#1F3C88]/10 text-[#3C82F6] dark:text-[#3758FF] rounded-full text-sm"
                      >
                        {interest}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>

                {/* Pricing */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-[#3C82F6]/10 to-[#1F3C88]/10"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Starting from</p>
                      <h3 className="text-[#3C82F6] dark:text-[#3758FF]">
                        ₹{provider.price}
                        <span className="text-sm text-gray-600 dark:text-gray-400">/hour</span>
                      </h3>
                    </div>
                    <Calendar className="w-8 h-8 text-[#3C82F6] dark:text-[#3758FF]" />
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="grid grid-cols-3 gap-3 pt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onSave}
                    className="flex flex-col items-center gap-2 p-4 glass dark:glass-dark rounded-xl hover:bg-white/20 dark:hover:bg-white/10 transition-all"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="text-xs">Save</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex flex-col items-center gap-2 p-4 glass dark:glass-dark rounded-xl hover:bg-white/20 dark:hover:bg-white/10 transition-all"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-xs">Message</span>
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onBook}
                    className="flex flex-col items-center gap-2 p-4 bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white rounded-xl hover:shadow-lg transition-all"
                  >
                    <Calendar className="w-5 h-5" />
                    <span className="text-xs">Book Now</span>
                  </motion.button>
                </motion.div>

                {/* Trust Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center justify-center gap-2 pt-4 border-t border-gray-200 dark:border-gray-700"
                >
                  <Shield className="w-4 h-4 text-green-500" />
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Protected by Satisfaction Guarantee
                  </p>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
