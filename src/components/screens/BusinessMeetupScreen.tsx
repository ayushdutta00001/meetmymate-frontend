import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, TrendingUp, Award, Users } from 'lucide-react';
import { BackButton } from '../ui/BackButton';
import { LockedFeatureCard } from '../ui/LockedFeatureCard';
import { ResponsiveContainer } from '../ui/ResponsiveContainer';

interface BusinessMeetupScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function BusinessMeetupScreen({ onNavigate, onBack }: BusinessMeetupScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleCategoryClick = (route: string) => {
    onNavigate(route);
  };

  const categories = [
    {
      id: 'p2p',
      title: 'Peer-to-Peer Matching',
      description: 'Connect with verified business seekers as equals',
      icon: Users,
      gradient: 'from-purple-500 via-indigo-500 to-blue-500',
      count: '200+ Professionals',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600',
      route: 'p2p-peer-listing'
    },
    {
      id: 'find-investor',
      title: 'Find Investors',
      description: 'Meet angel investors and VCs ready to fund your vision',
      icon: TrendingUp,
      gradient: 'from-green-500 via-emerald-500 to-teal-500',
      count: '30+ Investors',
      image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600',
      route: 'find-investor'
    },
    {
      id: 'find-experienced',
      title: 'Find Experienced People',
      description: 'Get guidance from mentors and industry experts',
      icon: Award,
      gradient: 'from-orange-500 via-red-500 to-pink-500',
      count: '100+ Mentors',
      image: 'https://images.unsplash.com/photo-1660795308754-4c6422baf2f6?w=600',
      route: 'find-experienced'
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
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <BackButton onClick={onBack} />
            <div>
              <h2>Business Meetup</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Connect with the right people for your business
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, industry, or expertise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl glass dark:glass-dark border border-gray-200 dark:border-gray-800 focus:border-[#3C82F6] dark:focus:border-[#3758FF] focus:ring-2 focus:ring-[#3C82F6]/20 dark:focus:ring-[#3758FF]/20 transition-all outline-none"
            />
          </motion.div>
        </div>
      </motion.div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {categories.map((category, index) => {
            const Icon = category.icon;
            
            // Lock the "Find Investors" feature
            if (category.id === 'find-investor') {
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <LockedFeatureCard
                    featureName="Find Investors"
                    description="Connect with angel investors and VCs ready to fund your vision. This premium feature is launching soon."
                    icon={<TrendingUp className="w-12 h-12 text-gray-600" strokeWidth={1.5} />}
                  />
                </motion.div>
              );
            }
            
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCategoryClick(category.route)}
                className="relative group cursor-pointer text-left"
              >
                <div className="h-full rounded-2xl glass dark:glass-dark overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-[#3C82F6] dark:hover:border-[#3758FF] transition-all">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-20 group-hover:opacity-30 transition-opacity`} />
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${category.gradient} text-white text-xs shadow-lg`}>
                        {category.count}
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-xl bg-gradient-to-br ${category.gradient} text-white`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1">{category.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r ${category.gradient} bg-opacity-10 text-sm group-hover:bg-opacity-20 transition-all`}>
                      <span className={`bg-gradient-to-r ${category.gradient} bg-clip-text text-transparent`}>
                        View Network →
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 p-6 rounded-2xl glass dark:glass-dark border border-gray-200 dark:border-gray-800"
        >
          <h3 className="mb-3">How Business Meetup Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3C82F6] to-[#1F3C88] text-white flex items-center justify-center flex-shrink-0">
                1
              </div>
              <div>
                <p className="mb-1">Browse</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Explore professionals, investors, and mentors
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3C82F6] to-[#1F3C88] text-white flex items-center justify-center flex-shrink-0">
                2
              </div>
              <div>
                <p className="mb-1">Connect</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Send meeting requests and book sessions
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3C82F6] to-[#1F3C88] text-white flex items-center justify-center flex-shrink-0">
                3
              </div>
              <div>
                <p className="mb-1">Meet</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Network and grow your business together
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}