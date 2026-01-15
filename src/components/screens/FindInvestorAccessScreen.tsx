import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, TrendingUp, Clock, CheckCircle, Briefcase, Lock, Users, BadgeCheck } from 'lucide-react';
import { BackButton } from '../ui/BackButton';

interface FindInvestorAccessScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function FindInvestorAccessScreen({ onNavigate, onBack }: FindInvestorAccessScreenProps) {
  const [userType, setUserType] = useState<'seeker' | 'investor' | null>(null);

  const seekerBenefits = [
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Browse Verified Investors',
      description: 'Access profiles of angel investors and VCs'
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Send Investment Requests',
      description: 'Pitch your business to potential investors'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Book Appointments',
      description: 'Schedule meetings after request acceptance'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Platform',
      description: 'Professional networking with verified members'
    }
  ];

  const investorBenefits = [
    {
      icon: <BadgeCheck className="w-6 h-6" />,
      title: 'Manual Verification',
      description: 'Admin-verified investor status for credibility'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Post Your Profile',
      description: 'Showcase your investment focus and portfolio'
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Receive Pitches',
      description: 'Review investment requests from entrepreneurs'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Control Your Calendar',
      description: 'Accept or decline meeting requests'
    }
  ];

  const seekerFeatures = [
    'Browse all investor profiles',
    'Send unlimited investment requests',
    'Book appointments after acceptance',
    'Track request status in real-time',
    'Access investor portfolio details',
    'Professional pitch templates'
  ];

  const investorFeatures = [
    'Create verified investor profile',
    'Manual admin verification',
    'Receive investment pitches',
    'Accept/decline meeting requests',
    'Showcase portfolio companies',
    'Set investment focus areas'
  ];

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] transition-colors duration-300 pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-[#0A0F1F]/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <BackButton
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#3C82F6] dark:hover:text-[#3758FF] transition-colors"
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 dark:bg-green-500/10 text-green-600 dark:text-green-400 mb-6">
            <Lock className="w-4 h-4" />
            <span className="text-sm">Premium Investment Network</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
            Find Investors
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Choose your role: Investment Seeker looking for funding, or Verified Investor ready to discover opportunities.
          </p>
        </motion.div>

        {/* User Type Selection */}
        {!userType && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid md:grid-cols-2 gap-6 mb-12"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUserType('seeker')}
              className="cursor-pointer p-8 rounded-3xl bg-white dark:bg-[#1a1f35] border-2 border-gray-200 dark:border-gray-800 hover:border-green-500 dark:hover:border-green-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3">I'm Looking for Investment</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Browse verified investors, send pitches, and book meetings after approval
              </p>
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <span className="text-sm">Continue as Seeker</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setUserType('investor')}
              className="cursor-pointer p-8 rounded-3xl bg-white dark:bg-[#1a1f35] border-2 border-gray-200 dark:border-gray-800 hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-300 hover:shadow-xl"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center mb-4">
                <BadgeCheck className="w-8 h-8 text-white" />
              </div>
              <h3 className="mb-3">I'm an Investor</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Get verified by admin, post your profile, and receive investment pitches
              </p>
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <span className="text-sm">Continue as Investor</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Seeker Subscription */}
        {userType === 'seeker' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => setUserType(null)}
              className="mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-[#3C82F6] dark:hover:text-[#3758FF] transition-colors"
            >
              ← Change Selection
            </button>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {seekerBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500/10 dark:bg-green-500/10 text-green-600 dark:text-green-400 flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="mb-2">{benefit.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pricing Card */}
            <div className="max-w-2xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500 to-emerald-500 p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative">
                  <div className="text-center mb-8">
                    <p className="text-sm text-white/80 mb-2">Investment Seeker Access</p>
                    <div className="flex items-end justify-center gap-2 mb-2">
                      <span className="text-5xl">₹4,999</span>
                      <span className="text-lg text-white/80 mb-2">/month</span>
                    </div>
                    <p className="text-sm text-white/80">Browse investors and send pitches</p>
                  </div>

                  <div className="space-y-3 mb-8">
                    {seekerFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onNavigate('find-investor')}
                    className="w-full py-4 rounded-xl bg-white text-green-600 hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02]"
                  >
                    Subscribe as Investment Seeker
                  </button>

                  <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                    <p className="text-xs text-white/90 text-center leading-relaxed">
                      <strong>Important:</strong> Meeting My Mate does not guarantee investment outcomes. All investment decisions are at the sole discretion of investors.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Investor Subscription */}
        {userType === 'investor' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <button
              onClick={() => setUserType(null)}
              className="mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-[#3C82F6] dark:hover:text-[#3758FF] transition-colors"
            >
              ← Change Selection
            </button>

            {/* Benefits Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {investorBenefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className="p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                      {benefit.icon}
                    </div>
                    <div>
                      <h3 className="mb-2">{benefit.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pricing Card */}
            <div className="max-w-2xl mx-auto">
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-500 p-8 text-white">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                
                <div className="relative">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm mb-4">
                      <BadgeCheck className="w-4 h-4" />
                      <span>Requires Admin Verification</span>
                    </div>
                    <p className="text-sm text-white/80 mb-2">Verified Investor Access</p>
                    <div className="flex items-end justify-center gap-2 mb-2">
                      <span className="text-5xl">₹4,999</span>
                      <span className="text-lg text-white/80 mb-2">/month</span>
                    </div>
                    <p className="text-sm text-white/80">Post profile and receive pitches</p>
                  </div>

                  <div className="space-y-3 mb-8">
                    {investorFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => onNavigate('find-investor')}
                    className="w-full py-4 rounded-xl bg-white text-emerald-600 hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02]"
                  >
                    Apply as Verified Investor
                  </button>

                  <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                    <p className="text-xs text-white/90 text-center leading-relaxed">
                      <strong>Verification Required:</strong> All investor profiles require manual admin verification before going live. You'll need to provide proof of investment credentials.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-500 max-w-3xl mx-auto leading-relaxed">
            <strong>Privacy & Security:</strong> Meet My Mate is designed for professional networking. Do not share sensitive financial data or personal identifying information during initial meetings. All users must comply with our Terms of Service and Community Guidelines.
          </p>
        </motion.div>
      </div>
    </div>
  );
}