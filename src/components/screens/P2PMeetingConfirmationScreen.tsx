import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Calendar, Clock, Video, MapPin, MessageSquare, Download, ExternalLink } from 'lucide-react';
import { Card } from '../Card';

interface P2PMeetingConfirmationScreenProps {
  onNavigate: (page: string) => void;
}

export function P2PMeetingConfirmationScreen({ onNavigate }: P2PMeetingConfirmationScreenProps) {
  const meetingDetails = {
    peer: {
      name: 'Rajesh Kumar',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      role: 'Technical Co-Founder',
      phone: '+91 98765 43210',
      email: 'rajesh.kumar@email.com'
    },
    date: 'Monday, December 23, 2024',
    time: '6:00 PM - 8:00 PM IST',
    duration: '2 hours',
    meetingType: 'online',
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    purpose: 'Co-Founder Partnership Discussion',
    confirmationId: 'MMM-2024-12-001',
    bothPaid: true
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-8 transition-colors duration-300">
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 dark:bg-[#0A0F1F]/80 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <button
            onClick={() => onNavigate('home')}
            className="text-[#3C82F6] dark:text-[#3758FF] hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Success Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 p-8 rounded-3xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800"
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500 text-white mb-4"
            >
              <CheckCircle className="w-10 h-10" />
            </motion.div>
            
            <h1 className="text-2xl md:text-3xl mb-3">Meeting Confirmed! 🎉</h1>
            <p className="text-gray-700 dark:text-gray-300 mb-2">
              Both payments received successfully
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Your meeting with {meetingDetails.peer.name} has been scheduled
            </p>
          </div>
        </motion.div>

        {/* Meeting Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800"
        >
          <h2 className="text-xl mb-4">Meeting Details</h2>
          
          {/* Peer Info */}
          <div className="flex items-center gap-4 p-4 mb-6 rounded-xl bg-gradient-to-r from-[#3C82F6]/5 to-[#1F3C88]/5 dark:from-[#3758FF]/10 dark:to-[#3C82F6]/5">
            <img
              src={meetingDetails.peer.image}
              alt={meetingDetails.peer.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="mb-1">{meetingDetails.peer.name}</h3>
              <p className="text-sm text-[#3C82F6] dark:text-[#3758FF] mb-2">{meetingDetails.peer.role}</p>
              <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400">
                <span>{meetingDetails.peer.email}</span>
                <span>•</span>
                <span>{meetingDetails.peer.phone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F]">
              <Calendar className="w-5 h-5 text-[#3C82F6] dark:text-[#3758FF] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Date</p>
                <p>{meetingDetails.date}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F]">
              <Clock className="w-5 h-5 text-[#3C82F6] dark:text-[#3758FF] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Time</p>
                <p>{meetingDetails.time}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Duration: {meetingDetails.duration}</p>
              </div>
            </div>

            {meetingDetails.meetingType === 'online' ? (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F]">
                <Video className="w-5 h-5 text-[#3C82F6] dark:text-[#3758FF] flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Meeting Link</p>
                  <a
                    href={meetingDetails.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#3C82F6] dark:text-[#3758FF] hover:underline text-sm break-all"
                  >
                    {meetingDetails.meetingLink}
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F]">
                <MapPin className="w-5 h-5 text-[#3C82F6] dark:text-[#3758FF] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Location</p>
                  <p>To be coordinated via chat</p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3 p-4 rounded-xl bg-[#F2F4F7] dark:bg-[#0A0F1F]">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-lg">💼</span>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-500 mb-1">Purpose</p>
                <p>{meetingDetails.purpose}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-900 dark:text-blue-200">
              <strong>Confirmation ID:</strong> {meetingDetails.confirmationId}
            </p>
          </div>
        </motion.div>

        {/* Chat Enabled Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="px-4 mb-4"
        >
          <Card variant="glass" className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-start gap-3">
              <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-900 dark:text-blue-200 mb-2">
                  <strong>Chat Feature Coming Soon</strong>
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-300">
                  We're building a chat feature so you can coordinate meeting logistics with {meetingDetails.peer.name}. For now, please use external communication methods to finalize details.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-4 mb-6"
        >
          <button
            onClick={() => onNavigate('chat')}
            className="flex items-center justify-center gap-2 py-4 rounded-xl bg-[#3C82F6] dark:bg-[#3758FF] text-white hover:bg-[#1F3C88] dark:hover:bg-[#3C82F6] transition-all duration-300 relative overflow-hidden"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Open Chat</span>
            <span className="absolute top-1 right-2 bg-white/20 text-white text-[9px] px-2 py-0.5 rounded-full backdrop-blur-sm">
              Coming Soon
            </span>
          </button>

          <button
            className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800 hover:border-[#3C82F6] dark:hover:border-[#3758FF] transition-all duration-300"
          >
            <Calendar className="w-5 h-5" />
            <span>Add to Calendar</span>
          </button>
        </motion.div>

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-6 rounded-2xl bg-white dark:bg-[#1a1f35] border border-gray-200 dark:border-gray-800"
        >
          <h3 className="mb-4">Meeting Preparation Tips</h3>
          <ul className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#3C82F6]/10 dark:bg-[#3758FF]/10 flex items-center justify-center text-[#3C82F6] dark:text-[#3758FF] text-xs">1</span>
              <span>Review your request and the peer's profile before the meeting</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#3C82F6]/10 dark:bg-[#3758FF]/10 flex items-center justify-center text-[#3C82F6] dark:text-[#3758FF] text-xs">2</span>
              <span>Prepare questions and talking points in advance</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#3C82F6]/10 dark:bg-[#3758FF]/10 flex items-center justify-center text-[#3C82F6] dark:text-[#3758FF] text-xs">3</span>
              <span>Test your audio/video setup before online meetings</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#3C82F6]/10 dark:bg-[#3758FF]/10 flex items-center justify-center text-[#3C82F6] dark:text-[#3758FF] text-xs">4</span>
              <span>Be professional, punctual, and respectful of each other's time</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#3C82F6]/10 dark:bg-[#3758FF]/10 flex items-center justify-center text-[#3C82F6] dark:text-[#3758FF] text-xs">5</span>
              <span>Follow up after the meeting with next steps or thank you notes</span>
            </li>
          </ul>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => onNavigate('home')}
            className="text-[#3C82F6] dark:text-[#3758FF] hover:underline"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    </div>
  );
}