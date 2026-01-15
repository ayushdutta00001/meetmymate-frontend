import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, MapPin, Target, Linkedin, AlertCircle, Briefcase, Award, Clock } from 'lucide-react';
import { Card } from '../Card';
import { BackButton } from '../ui/BackButton';
import { ResponsiveContainer } from '../ui/ResponsiveContainer';

interface P2PPeerProfileScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function P2PPeerProfileScreen({ onNavigate, onBack }: P2PPeerProfileScreenProps) {
  const peer = {
    id: 1,
    name: 'Rajesh Kumar',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600',
    role: 'Technical Co-Founder',
    focus: 'AI & Machine Learning',
    location: 'Mumbai',
    availability: 'in-person',
    verified: true,
    about: 'Seasoned tech entrepreneur with 10+ years in AI/ML development. Previously led engineering teams at Fortune 500 companies. Passionate about using technology to solve real-world healthcare problems. Looking to partner with someone who has deep healthcare domain expertise and regulatory knowledge.',
    building: {
      title: 'Healthcare Automation Platform',
      description: 'Developing an AI-powered diagnostic platform that helps doctors make faster, more accurate diagnoses. The system uses advanced machine learning algorithms trained on millions of medical records. Currently in beta testing with 3 hospitals in Mumbai.',
      stage: 'MVP Built, Early Traction',
      progress: 'Secured pilot agreements, seeking business co-founder'
    },
    seeking: {
      title: 'Business Co-Founder with Healthcare Background',
      description: 'I need a partner who understands the healthcare industry inside-out. Someone with connections to hospitals, clinics, and healthcare administrators. Experience with medical device regulations and healthcare compliance is essential. Ideally, someone who has worked in healthcare operations or business development.',
      skills: ['Healthcare Industry Knowledge', 'Business Development', 'Regulatory Compliance', 'Sales & Partnerships']
    },
    experience: [
      {
        title: 'Senior Engineering Lead',
        company: 'Tech Corp',
        duration: '2018 - 2023',
        description: 'Led AI/ML initiatives for healthcare products'
      },
      {
        title: 'Founder',
        company: 'Previous Startup (Acquired)',
        duration: '2015 - 2018',
        description: 'Built and sold a B2B SaaS platform'
      }
    ],
    skills: ['Artificial Intelligence', 'Machine Learning', 'Python', 'TensorFlow', 'Product Development', 'Team Leadership'],
    education: 'IIT Bombay - Computer Science',
    linkedin: 'linkedin.com/in/rajeshkumar',
    availability_details: 'Available for in-person meetings on weekdays after 6 PM and weekends in Mumbai'
  };

  const getAvailabilityBadge = (availability: string) => {
    return { text: 'In-Person Meeting', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' };
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-8 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-[#0A0F1F]/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <BackButton
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#3C82F6] dark:hover:text-[#3758FF] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Peers</span>
          </BackButton>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-8 rounded-3xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative">
                <img
                  src={peer.image}
                  alt={peer.name}
                  className="w-32 h-32 rounded-2xl object-cover"
                />
                {peer.verified && (
                  <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center border-4 border-white dark:border-[#1a1f35]">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="mb-4">
                <h1 className="text-2xl md:text-3xl mb-2">{peer.name}</h1>
                <p className="text-lg text-[#3C82F6] dark:text-[#3758FF] mb-3">{peer.role}</p>
                
                <div className="flex flex-wrap items-center gap-3">
                  <div className={`px-3 py-1 rounded-full text-sm ${getAvailabilityBadge(peer.availability).color}`}>
                    {getAvailabilityBadge(peer.availability).text}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4" />
                    <span>{peer.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Target className="w-4 h-4" />
                    <span>{peer.focus}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                <Linkedin className="w-4 h-4" />
                <a href={`https://${peer.linkedin}`} className="hover:text-[#3C82F6] dark:hover:text-[#3758FF] transition-colors">
                  {peer.linkedin}
                </a>
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p className="mb-1"><strong>Education:</strong> {peer.education}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
        >
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-900 dark:text-amber-200">
                <strong>Important:</strong> This is a paid peer conversation, not a guaranteed partnership. Both parties pay equally for meetings after mutual acceptance. No commitments or outcomes are guaranteed.
              </p>
            </div>
          </div>
        </motion.div>

        {/* About Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800"
        >
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-[#3C82F6] dark:text-[#3758FF]" />
            About
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{peer.about}</p>
        </motion.div>

        {/* What I'm Building */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800"
        >
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#3C82F6] dark:text-[#3758FF]" />
            What I'm Building
          </h2>
          
          <div className="mb-4">
            <h3 className="mb-2">{peer.building.title}</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{peer.building.description}</p>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F]">
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Current Stage</p>
                <p className="text-sm">{peer.building.stage}</p>
              </div>
              <div className="p-4 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F]">
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-1">Progress</p>
                <p className="text-sm">{peer.building.progress}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* What I'm Looking For */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6 p-6 rounded-2xl bg-gradient-to-br from-[#3C82F6]/5 to-[#1F3C88]/5 dark:from-[#3758FF]/10 dark:to-[#3C82F6]/5 border border-[#3C82F6]/20 dark:border-[#3758FF]/20"
        >
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#3C82F6] dark:text-[#3758FF]" />
            What I'm Looking For
          </h2>
          
          <div className="mb-4">
            <h3 className="mb-2">{peer.seeking.title}</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{peer.seeking.description}</p>
            
            <div>
              <p className="text-sm mb-2">Required Skills & Experience:</p>
              <div className="flex flex-wrap gap-2">
                {peer.seeking.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 rounded-lg bg-white dark:bg-[#1a1f35] text-sm border border-[#3C82F6]/30 dark:border-[#3758FF]/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Skills & Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800"
        >
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-[#3C82F6] dark:text-[#3758FF]" />
            Skills & Experience
          </h2>
          
          <div className="mb-6">
            <p className="text-sm mb-3">Technical & Professional Skills:</p>
            <div className="flex flex-wrap gap-2">
              {peer.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 rounded-lg bg-[#3C82F6]/10 dark:bg-[#3758FF]/10 text-sm text-[#3C82F6] dark:text-[#3758FF]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm mb-3">Work Experience:</p>
            <div className="space-y-4">
              {peer.experience.map((exp, index) => (
                <div key={index} className="p-4 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-sm mb-0.5">{exp.title}</h3>
                      <p className="text-sm text-[#3C82F6] dark:text-[#3758FF]">{exp.company}</p>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-500">{exp.duration}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{exp.description}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Availability */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="mb-8 p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800"
        >
          <h2 className="text-xl mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#3C82F6] dark:text-[#3758FF]" />
            Availability
          </h2>
          <p className="text-gray-700 dark:text-gray-300">{peer.availability_details}</p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <button
            onClick={() => onNavigate('p2p-request-meeting')}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] dark:from-[#3758FF] dark:to-[#3C82F6] text-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
          >
            Request Meeting
          </button>
          
          <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-500">
            Chat coming soon - Meetings are scheduled only after both parties pay.
          </p>
        </motion.div>
      </div>
    </div>
  );
}