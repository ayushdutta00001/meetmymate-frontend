import React from 'react';
import { motion } from 'motion/react';
import { Heart, Users, Briefcase, ArrowRight } from 'lucide-react';
import { Card } from '../Card';
import { ResponsiveContainer } from '../ui/ResponsiveContainer';

interface CategorySelectionScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function CategorySelectionScreen({ onNavigate, onBack }: CategorySelectionScreenProps) {
  const categories = [
    {
      id: 'rent-friend',
      title: 'Rent a Friend',
      subtitle: 'Book companions for activities and adventures',
      icon: Users,
      gradient: 'from-blue-500 to-purple-600',
      image: 'https://images.unsplash.com/photo-1763429642850-aa2de401e3e0?w=600',
      stats: '2.3K+ Available',
    },
    {
      id: 'blind-date',
      title: 'Blind Date',
      subtitle: 'System-arranged public meetings for verified adults',
      icon: Heart,
      gradient: 'from-blue-600 via-indigo-600 to-blue-700',
      image: 'https://images.unsplash.com/photo-1615500025837-cf3a8716c83d?w=600',
      stats: 'Verified 21+ Only',
    },
    {
      id: 'business-meetup',
      title: 'Business Meetup',
      subtitle: 'Network with professionals and grow your business',
      icon: Briefcase,
      gradient: 'from-green-500 via-teal-500 to-blue-500',
      image: 'https://images.unsplash.com/photo-1496180470114-6ef490f3ff22?w=600',
      stats: '950+ Professionals',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <ResponsiveContainer maxWidth="7xl">
          <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              Choose Your Service
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-gray-600 dark:text-gray-400 mt-2"
            >
              Book People. Save Time.
            </motion.p>
          </div>
        </ResponsiveContainer>
      </motion.div>

      {/* Main Content */}
      <ResponsiveContainer maxWidth="7xl">
        <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.15 }}
                  whileHover={{ y: -8 }}
                >
                  <Card
                    variant="glass"
                    onClick={() => onNavigate(category.id)}
                    className="overflow-hidden group h-full cursor-pointer"
                  >
                    {/* Image Section */}
                    <div className="relative h-48 md:h-64 -m-6 mb-4 overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-70`} />
                      
                      {/* Icon Overlay */}
                      <div className="absolute top-4 left-4 md:top-6 md:left-6">
                        <motion.div
                          whileHover={{ rotate: 360, scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          className="w-12 h-12 md:w-16 md:h-16 rounded-2xl glass backdrop-blur-md flex items-center justify-center"
                        >
                          <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                        </motion.div>
                      </div>
                      
                      {/* Stats Badge */}
                      <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                        <div className="glass backdrop-blur-md rounded-full px-3 py-1.5 md:px-4 md:py-2 inline-block">
                          <span className="text-white text-xs md:text-sm">{category.stats}</span>
                        </div>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="space-y-2 md:space-y-3">
                      <h3>{category.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {category.subtitle}
                      </p>
                      
                      {/* CTA Button */}
                      <motion.button
                        whileHover={{ x: 5 }}
                        className="flex items-center gap-2 text-[#3C82F6] dark:text-[#3758FF] group-hover:gap-3 transition-all min-h-[44px]"
                      >
                        <span>Explore Now</span>
                        <ArrowRight className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Bottom CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mt-8 md:mt-12"
          >
            <Card variant="gradient" className="relative overflow-hidden">
              <div className="relative z-10 text-center">
                <h3 className="text-white mb-3">Not Sure Which to Choose?</h3>
                <p className="text-white/80 mb-6">
                  Let our AI help you find the perfect service based on your needs
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition-all min-h-[44px] md:px-8"
                >
                  Get AI Recommendation
                </motion.button>
              </div>
              <motion.div
                className="absolute -right-10 -bottom-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </Card>
          </motion.div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}