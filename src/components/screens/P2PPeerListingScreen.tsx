import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, TrendingUp, Users, MapPin, Star, BadgeCheck, Sparkles } from 'lucide-react';
import { Card } from '../Card';
import { BackButton } from '../ui/BackButton';
import { FilterButton } from '../ui/FilterButton';
import { ResponsiveContainer } from '../ui/ResponsiveContainer';

interface P2PPeerListingScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

interface Peer {
  id: number;
  name: string;
  image: string;
  role: string;
  focus: string;
  building: string;
  seeking: string;
  availability: 'online' | 'in-person' | 'both';
  location: string;
  industry: string;
  verified: boolean;
}

export function P2PPeerListingScreen({ onNavigate, onBack }: P2PPeerListingScreenProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedRole, setSelectedRole] = useState('all');

  const industries = ['all', 'Technology', 'Finance', 'Healthcare', 'E-commerce', 'Education', 'Real Estate'];
  const roles = ['all', 'Founder', 'Co-Founder', 'Investor', 'Advisor', 'Technical Partner', 'Business Partner'];

  const peers: Peer[] = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      role: 'Technical Co-Founder',
      focus: 'AI & Machine Learning',
      building: 'Healthcare automation platform using AI diagnostics',
      seeking: 'Business co-founder with healthcare industry connections',
      availability: 'in-person',
      location: 'Mumbai',
      industry: 'Healthcare',
      verified: true
    },
    {
      id: 2,
      name: 'Priya Sharma',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      role: 'Business Strategist',
      focus: 'D2C & Growth',
      building: 'Sustainable fashion marketplace with ethical sourcing',
      seeking: 'Technical partner for mobile app development',
      availability: 'in-person',
      location: 'Bangalore',
      industry: 'E-commerce',
      verified: true
    },
    {
      id: 3,
      name: 'Amit Patel',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      role: 'Fintech Founder',
      focus: 'Financial Inclusion',
      building: 'Digital lending platform for small businesses',
      seeking: 'Angel investor or strategic advisor in fintech',
      availability: 'in-person',
      location: 'Delhi',
      industry: 'Finance',
      verified: true
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      role: 'Product Leader',
      focus: 'EdTech Innovation',
      building: 'Interactive learning platform for K-12 students',
      seeking: 'Co-founder with sales and marketing expertise',
      availability: 'in-person',
      location: 'Pune',
      industry: 'Education',
      verified: true
    },
    {
      id: 5,
      name: 'Vikram Singh',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      role: 'Serial Entrepreneur',
      focus: 'Proptech',
      building: 'Smart property management SaaS for real estate',
      seeking: 'Technical co-founder with IoT experience',
      availability: 'in-person',
      location: 'Mumbai',
      industry: 'Real Estate',
      verified: true
    }
  ];

  const filteredPeers = peers.filter(peer => {
    const matchesSearch = peer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         peer.building.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         peer.seeking.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = selectedIndustry === 'all' || peer.industry === selectedIndustry;
    const matchesRole = selectedRole === 'all' || peer.role === selectedRole;
    
    return matchesSearch && matchesIndustry && matchesRole;
  });

  const getAvailabilityBadge = (availability: string) => {
    const badges = {
      online: { text: 'Online Only', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
      'in-person': { text: 'In-Person', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' },
      both: { text: 'Flexible', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' }
    };
    return badges[availability as keyof typeof badges];
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-8 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-[#0A0F1F]/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <BackButton
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#3C82F6] dark:hover:text-[#3758FF] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </BackButton>
            
            <div className="flex items-center gap-3">
              {/* Filter Button */}
              <FilterButton
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#3C82F6]/10 dark:bg-[#3758FF]/10 text-[#3C82F6] dark:text-[#3758FF] hover:bg-[#3C82F6]/20 dark:hover:bg-[#3758FF]/20 transition-all"
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </FilterButton>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl mb-2">Find Your Partner</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect with verified business peers for meaningful partnerships
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, project, or needs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF] transition-all"
            />
          </div>
        </motion.div>

        {/* Filters */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800"
          >
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">Industry</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[#F2F4F7] dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF]"
                >
                  {industries.map(industry => (
                    <option key={industry} value={industry}>
                      {industry === 'all' ? 'All Industries' : industry}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2 text-gray-600 dark:text-gray-400">Role</label>
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg bg-[#F2F4F7] dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF]"
                >
                  {roles.map(role => (
                    <option key={role} value={role}>
                      {role === 'all' ? 'All Roles' : role}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {filteredPeers.length} peer{filteredPeers.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Peer Grid - Using same horizontal cards as Rent-a-Friend */}
        {filteredPeers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg mb-2">No peers found</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-4"
          >
            {filteredPeers.map((peer, index) => (
              <motion.div
                key={peer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProfileCard
                  name={peer.name}
                  age={0}
                  city={peer.location}
                  image={peer.image}
                  bio={peer.role}
                  rating={peer.verified ? 4.9 : undefined}
                  availability={peer.availability === 'in-person'}
                  onClick={() => onNavigate('p2p-peer-profile')}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}