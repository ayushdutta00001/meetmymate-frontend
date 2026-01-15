import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Clock, CheckCircle, XCircle, User, Calendar, MapPin, MessageSquare, AlertCircle } from 'lucide-react';

interface P2PRequestStatusScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

type RequestStatus = 'pending' | 'accepted' | 'rejected';

export function P2PRequestStatusScreen({ onNavigate, onBack }: P2PRequestStatusScreenProps) {
  // Demo: Start with pending, can be changed to test different states
  const [status, setStatus] = useState<RequestStatus>('accepted');

  const requestDetails = {
    peer: {
      name: 'Rajesh Kumar',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      role: 'Technical Co-Founder'
    },
    submittedAt: 'Dec 18, 2024 at 3:45 PM',
    purpose: 'Co-Founder Partnership',
    meetingType: 'online',
    preferredTime: 'Monday 6-8 PM, Wednesday 7-9 PM, or Saturday morning',
    whatIBring: 'I have 10 years of experience in healthcare operations, connections with 20+ hospital networks, and expertise in medical device regulations. I\'ve successfully launched two healthcare products and understand the regulatory landscape.',
    whatISeek: 'Looking for a technical co-founder to build the platform MVP. Need someone with full-stack development skills and experience in healthcare tech. Ideally someone who can commit full-time to the venture.'
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-12 h-12" />,
          color: 'text-amber-500',
          bgColor: 'bg-amber-50 dark:bg-amber-900/20',
          borderColor: 'border-amber-200 dark:border-amber-800',
          title: 'Request Pending',
          description: 'Your meeting request has been sent to Rajesh Kumar. They will review it and respond soon.',
          showActions: false
        };
      case 'accepted':
        return {
          icon: <CheckCircle className="w-12 h-12" />,
          color: 'text-green-500',
          bgColor: 'bg-green-50 dark:bg-green-900/20',
          borderColor: 'border-green-200 dark:border-green-800',
          title: 'Request Accepted!',
          description: 'Great news! Rajesh Kumar has accepted your meeting request. Both parties must now pay to schedule the meeting.',
          showActions: true
        };
      case 'rejected':
        return {
          icon: <XCircle className="w-12 h-12" />,
          color: 'text-red-500',
          bgColor: 'bg-red-50 dark:bg-red-900/20',
          borderColor: 'border-red-200 dark:border-red-800',
          title: 'Request Declined',
          description: 'Unfortunately, Rajesh Kumar has declined your meeting request at this time. You can browse other peers or refine your approach.',
          showActions: false
        };
    }
  };

  const statusConfig = getStatusConfig();

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-8 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-[#0A0F1F]/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#3C82F6] dark:hover:text-[#3758FF] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`mb-8 p-8 rounded-3xl ${statusConfig.bgColor} border ${statusConfig.borderColor}`}
        >
          <div className="text-center mb-6">
            <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full bg-white dark:bg-[#1a1f35] mb-4 ${statusConfig.color}`}>
              {statusConfig.icon}
            </div>
            <h1 className="text-2xl md:text-3xl mb-3">{statusConfig.title}</h1>
            <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
              {statusConfig.description}
            </p>
          </div>

          {/* Demo Status Switcher (for testing) */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => setStatus('pending')}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                status === 'pending'
                  ? 'bg-white dark:bg-[#1a1f35] shadow-md'
                  : 'bg-white/50 dark:bg-[#1a1f35]/50 hover:bg-white dark:hover:bg-[#1a1f35]'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatus('accepted')}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                status === 'accepted'
                  ? 'bg-white dark:bg-[#1a1f35] shadow-md'
                  : 'bg-white/50 dark:bg-[#1a1f35]/50 hover:bg-white dark:hover:bg-[#1a1f35]'
              }`}
            >
              Accepted
            </button>
            <button
              onClick={() => setStatus('rejected')}
              className={`px-4 py-2 rounded-lg text-sm transition-all ${
                status === 'rejected'
                  ? 'bg-white dark:bg-[#1a1f35] shadow-md'
                  : 'bg-white/50 dark:bg-[#1a1f35]/50 hover:bg-white dark:hover:bg-[#1a1f35]'
              }`}
            >
              Rejected
            </button>
          </div>
        </motion.div>

        {/* Request Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800"
        >
          <h2 className="text-xl mb-4">Request Details</h2>
          
          {/* Peer Info */}
          <div className="flex items-center gap-4 p-4 mb-6 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F]">
            <img
              src={requestDetails.peer.image}
              alt={requestDetails.peer.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="mb-1">{requestDetails.peer.name}</h3>
              <p className="text-sm text-[#3C82F6] dark:text-[#3758FF]">{requestDetails.peer.role}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Submitted</p>
                <p className="text-sm">{requestDetails.submittedAt}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Meeting Purpose</p>
                <p className="text-sm">{requestDetails.purpose}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Format</p>
                <p className="text-sm capitalize">{requestDetails.meetingType} Meeting</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Preferred Time</p>
                <p className="text-sm">{requestDetails.preferredTime}</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Your Pitch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800"
        >
          <h2 className="text-xl mb-4">Your Pitch</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">What You Bring</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {requestDetails.whatIBring}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500 dark:text-gray-500 mb-2">What You're Looking For</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                {requestDetails.whatISeek}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Payment Notice (Only for Accepted) */}
        {status === 'accepted' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-6 p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
          >
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 dark:text-blue-200 mb-2">
                  <strong>Next Step: Payment Required</strong>
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-3">
                  Both you and Rajesh Kumar must pay ₹1,499 each to confirm the meeting. The meeting will be scheduled only after both payments are completed. Chat feature coming soon for logistics coordination.
                </p>
                <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-300">
                  <CheckCircle className="w-4 h-4" />
                  <span>Secure payment processing</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        {status === 'accepted' && statusConfig.showActions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <button
              onClick={() => onNavigate('p2p-peer-payment')}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] dark:from-[#3758FF] dark:to-[#3C82F6] text-white hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
            >
              Proceed to Payment
            </button>
          </motion.div>
        )}

        {status === 'rejected' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <button
              onClick={() => onNavigate('p2p-peer-listing')}
              className="w-full py-4 rounded-xl bg-[#3C82F6] dark:bg-[#3758FF] text-white hover:bg-[#1F3C88] dark:hover:bg-[#3C82F6] transition-all duration-300"
            >
              Browse Other Peers
            </button>
          </motion.div>
        )}

        {status === 'pending' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-center"
          >
            <p className="text-sm text-gray-500 dark:text-gray-500">
              We'll notify you when the peer responds to your request
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}