import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, MessageSquareOff, AlertCircle, Send, MapPin } from 'lucide-react';

interface P2PRequestMeetingScreenProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function P2PRequestMeetingScreen({ onNavigate, onBack }: P2PRequestMeetingScreenProps) {
  const [formData, setFormData] = useState({
    purpose: '',
    whatIBring: '',
    whatISeek: '',
    preferredTime: '',
    preferredLocation: ''
  });

  const purposes = [
    'Co-Founder Partnership',
    'Investment Discussion',
    'Strategic Advisory',
    'Technical Collaboration',
    'Business Development',
    'Knowledge Exchange',
    'Other'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('p2p-request-status');
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.purpose && formData.whatIBring && formData.whatISeek && formData.preferredTime;

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-8 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-[#0A0F1F]/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#3C82F6] dark:hover:text-[#3758FF] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Profile</span>
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <h1 className="text-2xl md:text-3xl mb-3">Request Meeting</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Submit a structured request to connect with this peer
          </p>
        </motion.div>

        {/* No Chat Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border border-blue-200 dark:border-blue-800"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
              <span className="text-lg">ℹ️</span>
            </div>
            <div>
              <p className="text-sm text-blue-900 dark:text-blue-200 mb-2">
                <strong>Chat is coming soon</strong>
              </p>
              <p className="text-sm text-blue-800 dark:text-blue-300">
                You can only send a structured meeting request. If the peer accepts, both of you will be prompted to pay. Once the feature is released, chat will be enabled after payment for meeting logistics.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Purpose */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800">
            <label className="block mb-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">Meeting Purpose *</span>
            </label>
            <select
              value={formData.purpose}
              onChange={(e) => handleChange('purpose', e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF] transition-all"
            >
              <option value="">Select purpose...</option>
              {purposes.map(purpose => (
                <option key={purpose} value={purpose}>{purpose}</option>
              ))}
            </select>
          </div>

          {/* What I Bring */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800">
            <label className="block mb-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">What I Bring to the Table *</span>
              <span className="block text-xs text-gray-500 dark:text-gray-500 mt-1">
                Describe your skills, experience, resources, or value proposition
              </span>
            </label>
            <textarea
              value={formData.whatIBring}
              onChange={(e) => handleChange('whatIBring', e.target.value)}
              required
              rows={5}
              placeholder="Example: I have 10 years of experience in healthcare operations, connections with 20+ hospital networks, and expertise in medical device regulations..."
              className="w-full px-4 py-3 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF] transition-all resize-none"
            />
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-500 text-right">
              {formData.whatIBring.length} / 500 characters
            </div>
          </div>

          {/* What I'm Looking For */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800">
            <label className="block mb-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">What I'm Looking For *</span>
              <span className="block text-xs text-gray-500 dark:text-gray-500 mt-1">
                Clearly state your expectations and what you hope to achieve
              </span>
            </label>
            <textarea
              value={formData.whatISeek}
              onChange={(e) => handleChange('whatISeek', e.target.value)}
              required
              rows={5}
              placeholder="Example: Looking for a technical co-founder to build the platform MVP. Need someone with full-stack development skills and experience in healthcare tech..."
              className="w-full px-4 py-3 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF] transition-all resize-none"
            />
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-500 text-right">
              {formData.whatISeek.length} / 500 characters
            </div>
          </div>

          {/* Preferred Location */}
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800"
          >
            <label className="block mb-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Preferred Location <span className="text-xs text-gray-500 dark:text-gray-500">(Optional)</span>
              </span>
              <span className="block text-xs text-gray-500 dark:text-gray-500 mt-1">
                Suggest a city, area, or specific venue for the in-person meeting
              </span>
            </label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.preferredLocation}
                onChange={(e) => handleChange('preferredLocation', e.target.value)}
                placeholder="Example: Mumbai - Bandra Kurla Complex, or Coffee shop in Bangalore Indiranagar..."
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF] transition-all"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
              💡 This helps the peer know your location preference. Final venue can be decided after payment.
            </p>
          </motion.div>

          {/* Preferred Time */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800">
            <label className="block mb-3">
              <span className="text-sm text-gray-600 dark:text-gray-400">Preferred Time Slots *</span>
              <span className="block text-xs text-gray-500 dark:text-gray-500 mt-1">
                Suggest 2-3 time options that work for you
              </span>
            </label>
            <textarea
              value={formData.preferredTime}
              onChange={(e) => handleChange('preferredTime', e.target.value)}
              required
              rows={3}
              placeholder="Example: Monday 6-8 PM, Wednesday 7-9 PM, or Saturday morning..."
              className="w-full px-4 py-3 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-800 focus:outline-none focus:ring-2 focus:ring-[#3C82F6] dark:focus:ring-[#3758FF] transition-all resize-none"
            />
          </div>

          {/* Important Notice */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
          >
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-900 dark:text-amber-200">
                <p className="mb-2"><strong>Before you submit:</strong></p>
                <ul className="space-y-1 list-disc list-inside text-xs">
                  <li>The peer will review your request and decide to accept or reject</li>
                  <li>If accepted, both parties will be required to pay ₹1,499 each</li>
                  <li>Meeting will be scheduled only after both payments are confirmed</li>
                  <li>No refunds after payment confirmation</li>
                  <li>This is a peer conversation, not a guaranteed partnership</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                isFormValid
                  ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] dark:from-[#3758FF] dark:to-[#3C82F6] text-white hover:shadow-xl hover:scale-[1.02]'
                  : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
              <span>Send Request</span>
            </button>
            
            {!isFormValid && (
              <p className="mt-3 text-xs text-center text-gray-500 dark:text-gray-500">
                Please fill in all required fields to continue
              </p>
            )}
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}