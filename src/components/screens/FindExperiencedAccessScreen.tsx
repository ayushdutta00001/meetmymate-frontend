import React from 'react';
import { motion } from 'motion/react';
import { Shield, Award, Clock, CheckCircle, Briefcase, Lock, Users, Star } from 'lucide-react';
import { BackButton } from '../ui/BackButton';

interface FindExperiencedAccessScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function FindExperiencedAccessScreen({ onNavigate, onBack }: FindExperiencedAccessScreenProps) {
  const benefits = [
    {
      icon: <Award className="w-6 h-6" />,
      title: 'Expert Mentors',
      description: 'Connect with industry veterans and subject matter experts'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Add Your Profile',
      description: 'Subscribe and create your mentorship profile instantly'
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Structured Guidance',
      description: 'Get actionable advice for your business challenges'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Flexible Scheduling',
      description: 'Book sessions at your convenience'
    }
  ];

  const features = [
    'Browse verified mentor profiles',
    'Create and post your own profile',
    'Send and receive meeting requests',
    'Schedule mentorship sessions',
    'Access mentor expertise areas',
    'Track all your connections',
    'Rate and review sessions',
    'Join mentor community'
  ];

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] transition-colors duration-300 pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-[#0A0F1F]/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <BackButton onClick={onBack} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 mb-6">
            <Lock className="w-4 h-4" />
            <span className="text-sm">Premium Mentorship Network</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl mb-6 bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Find Experienced People
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
            Join a community of mentors and mentees. Subscribe to browse experts, and add your own profile to help others or seek guidance.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500 dark:text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-orange-500" />
              <span>Browse & Post Profiles</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-orange-500" />
              <span>Verified Experts</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-orange-500" />
              <span>Instant Access</span>
            </div>
          </div>
        </motion.div>

        {/* Benefits Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-6 mb-16"
        >
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all duration-300 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-500/10 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{benefit.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Pricing Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-500 to-red-500 p-8 text-white">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              <div className="text-center mb-8">
                <p className="text-sm text-white/80 mb-2">Monthly Access</p>
                <div className="flex items-end justify-center gap-2 mb-2">
                  <span className="text-5xl">₹1,999</span>
                  <span className="text-lg text-white/80 mb-2">/month</span>
                </div>
                <p className="text-sm text-white/80">Browse mentors & add your profile</p>
              </div>

              <div className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => onNavigate('find-experienced')}
                className="w-full py-4 rounded-xl bg-white text-orange-600 hover:bg-gray-100 transition-all duration-300 hover:scale-[1.02]"
              >
                Unlock Mentorship Network
              </button>

              <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                <p className="text-xs text-white/90 text-center leading-relaxed">
                  <strong>Open Network:</strong> Once subscribed, you can both browse mentors and create your own profile to help others. Perfect for peer-to-peer mentorship.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12 p-8 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800"
        >
          <h3 className="mb-6 text-center">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center mx-auto mb-3">
                <span>1</span>
              </div>
              <p className="text-sm" style={{ fontWeight: 600 }}>Subscribe</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Get instant access to the network</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center mx-auto mb-3">
                <span>2</span>
              </div>
              <p className="text-sm" style={{ fontWeight: 600 }}>Browse or Post</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Find mentors or add your profile</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center justify-center mx-auto mb-3">
                <span>3</span>
              </div>
              <p className="text-sm" style={{ fontWeight: 600 }}>Connect</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Send requests and schedule meetings</p>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-gray-500 dark:text-gray-500 max-w-3xl mx-auto leading-relaxed">
            <strong>Privacy & Security:</strong> Meet My Mate is designed for professional networking. Do not share sensitive business information or personal data during meetings. All users must comply with our Terms of Service and Community Guidelines.
          </p>
        </motion.div>
      </div>
    </div>
  );
}