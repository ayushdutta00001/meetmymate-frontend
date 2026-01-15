import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Bell,
  CheckCircle,
  Clock,
  Calendar,
  Briefcase,
  Check,
  X,
  FileText,
  Video,
  MapPin,
  Timer,
  Mail,
  MessageSquare,
  Shield,
  Award,
  Zap,
  TrendingDown,
  AlertCircle,
  ExternalLink
} from 'lucide-react';

interface InvestorRequest {
  id: number;
  founderName: string;
  startupName: string;
  industry: string;
  stage: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected' | 'ignored';
  date: string;
  slaExpiry?: string;
}

interface MeetingNotification {
  id: number;
  type: 'new_meeting' | 'reminder';
  founderName: string;
  startupName: string;
  dateTime: string;
  meetingMode: 'Online' | 'Offline';
  purpose: string;
  read: boolean;
  timestamp: string;
}

interface UpcomingMeeting {
  id: number;
  founderName: string;
  startupName: string;
  purpose: string;
  dateTime: string;
  duration: string;
  meetingMode: 'Online' | 'Offline';
  location?: string;
  paymentStatus: 'Confirmed';
  remindersSent: string[];
}

interface InvestorDashboardProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function InvestorDashboard({ onBack, onNavigate }: InvestorDashboardProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'meetings'>('requests');

  // Mock data
  const [notifications, setNotifications] = useState<MeetingNotification[]>([
    {
      id: 1,
      type: 'new_meeting',
      founderName: 'Vikram Singh',
      startupName: 'FinTech Pro',
      dateTime: '2024-12-25 14:00',
      meetingMode: 'Online',
      purpose: 'Seed funding discussion for AI-powered payment platform',
      read: false,
      timestamp: '2024-12-20 10:30'
    },
    {
      id: 2,
      type: 'reminder',
      founderName: 'Priya Gupta',
      startupName: 'HealthCare AI',
      dateTime: '2024-12-24 11:00',
      meetingMode: 'Offline',
      purpose: 'Series A funding for diagnostic platform',
      read: false,
      timestamp: '2024-12-23 09:00'
    }
  ]);

  const [incomingRequests, setIncomingRequests] = useState<InvestorRequest[]>([
    {
      id: 1,
      founderName: 'Arjun Patel',
      startupName: 'HealthTech Solutions',
      industry: 'Healthcare',
      stage: 'Seed',
      message: 'Looking for seed funding for our AI-powered diagnostic platform.',
      status: 'pending',
      date: '2024-12-18',
      slaExpiry: '48 hours'
    },
    {
      id: 2,
      founderName: 'Sneha Reddy',
      startupName: 'EduLearn Pro',
      industry: 'EdTech',
      stage: 'MVP',
      message: 'Seeking investment to scale our personalized learning platform.',
      status: 'pending',
      date: '2024-12-19',
      slaExpiry: '36 hours'
    }
  ]);

  const [upcomingMeetings, setUpcomingMeetings] = useState<UpcomingMeeting[]>([
    {
      id: 1,
      founderName: 'Vikram Singh',
      startupName: 'FinTech Pro',
      purpose: 'Seed funding discussion for AI-powered payment platform',
      dateTime: '2024-12-25 14:00',
      duration: '60 minutes',
      meetingMode: 'Online',
      paymentStatus: 'Confirmed',
      remindersSent: ['24 hours before', '1 hour before']
    },
    {
      id: 2,
      founderName: 'Priya Gupta',
      startupName: 'HealthCare AI',
      purpose: 'Series A funding for diagnostic platform',
      dateTime: '2024-12-24 11:00',
      duration: '45 minutes',
      meetingMode: 'Offline',
      location: 'Nariman Point, Mumbai',
      paymentStatus: 'Confirmed',
      remindersSent: ['24 hours before']
    }
  ]);

  // Response rate and trust metrics
  const responseRate = 95; // percentage
  const totalRequests = 48;
  const acceptedCount = 32;
  const meetingsCompleted = 28;
  const noShowCount = 0;

  const handleAcceptRequest = (requestId: number) => {
    setIncomingRequests(incomingRequests.map(req =>
      req.id === requestId ? { ...req, status: 'accepted' } : req
    ));
  };

  const handleRejectRequest = (requestId: number) => {
    setIncomingRequests(incomingRequests.map(req =>
      req.id === requestId ? { ...req, status: 'rejected' } : req
    ));
  };

  const handleMarkAsRead = (notificationId: number) => {
    setNotifications(notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const pendingRequests = incomingRequests.filter(req => req.status === 'pending');
  const acceptedRequests = incomingRequests.filter(req => req.status === 'accepted');

  // Calculate countdown for next meeting
  const getCountdown = (dateTime: string) => {
    const now = new Date();
    const meetingDate = new Date(dateTime);
    const diff = meetingDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h`;
    return 'Soon';
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header with Notification Bell */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 glass dark:glass-dark border-b border-white/20 dark:border-gray-800/50 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2>Investor Dashboard</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Manage meetings & requests
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="w-12 h-12 rounded-xl glass dark:glass-dark flex items-center justify-center relative"
              >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </motion.button>

              {/* Notification Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-96 glass dark:glass-dark rounded-2xl backdrop-blur-xl border border-white/20 dark:border-gray-800/50 shadow-2xl overflow-hidden"
                  >
                    <div className="p-4 border-b border-white/10 dark:border-gray-800/50">
                      <h4 className="flex items-center gap-2">
                        <Bell className="w-5 h-5" />
                        Notifications
                        {unreadCount > 0 && (
                          <span className="ml-auto text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400">
                            {unreadCount} new
                          </span>
                        )}
                      </h4>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center">
                          <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                          <p className="text-sm text-gray-600 dark:text-gray-400">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-4 border-b border-white/5 dark:border-gray-800/30 hover:bg-white/5 dark:hover:bg-white/5 cursor-pointer transition-all ${
                              !notif.read ? 'bg-blue-500/5' : ''
                            }`}
                            onClick={() => handleMarkAsRead(notif.id)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                notif.type === 'new_meeting' ? 'bg-green-500/10' : 'bg-orange-500/10'
                              }`}>
                                {notif.type === 'new_meeting' ? (
                                  <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                                ) : (
                                  <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-1">
                                  <p className="text-sm">
                                    {notif.type === 'new_meeting' ? (
                                      <>
                                        <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs mr-2">
                                          New Meeting
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs">
                                          Paid & Scheduled
                                        </span>
                                      </>
                                    ) : (
                                      <span className="px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs">
                                        Reminder
                                      </span>
                                    )}
                                  </p>
                                  {!notif.read && (
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                  )}
                                </div>
                                <p className="text-sm mb-1">
                                  {notif.founderName} • {notif.startupName}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                  {notif.purpose}
                                </p>
                                <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {notif.dateTime}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    {notif.meetingMode === 'Online' ? (
                                      <><Video className="w-3 h-3" /> Online</>
                                    ) : (
                                      <><MapPin className="w-3 h-3" /> Offline</>
                                    )}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      )}
                    </div>
                    <div className="p-3 border-t border-white/10 dark:border-gray-800/50 text-center">
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        <Mail className="w-3 h-3 inline mr-1" />
                        Email confirmations sent to your registered email
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Trust Badges & Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">Status</p>
                <p className="text-sm">Verified Investor</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">Response Rate</p>
                <p className="text-sm">{responseRate}%</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">Reliability</p>
                <p className="text-sm">{noShowCount === 0 ? 'Excellent' : 'Good'}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-500">Meetings</p>
                <p className="text-sm">{meetingsCompleted} completed</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SLA Warning (if response rate is low) */}
        {responseRate < 80 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass dark:glass-dark rounded-2xl p-6 mb-8 backdrop-blur-xl border border-orange-500/20 bg-orange-500/5"
          >
            <div className="flex items-start gap-3">
              <TrendingDown className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0" />
              <div>
                <p className="text-sm mb-1">⚠️ Low Response Rate Alert</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Your response rate is below 80%. This may affect your profile visibility in search results. 
                  Please respond to pending requests within 48 hours to maintain your ranking.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* SMS/WhatsApp Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass dark:glass-dark rounded-2xl p-4 mb-8 backdrop-blur-xl border border-blue-500/20 bg-blue-500/5"
        >
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              ✅ <strong>Verified investors receive instant SMS alerts</strong> for booked meetings with calendar attachments
            </p>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 rounded-xl transition-all ${
              activeTab === 'requests'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                : 'glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5'
            }`}
          >
            Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab('meetings')}
            className={`px-6 py-3 rounded-xl transition-all ${
              activeTab === 'meetings'
                ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                : 'glass dark:glass-dark hover:bg-white/10 dark:hover:bg-white/5'
            }`}
          >
            Upcoming Meetings ({upcomingMeetings.length})
          </button>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'requests' && (
            <motion.div
              key="requests"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Pending Requests */}
              <div>
                <h3 className="mb-4">Pending Requests</h3>
                <div className="space-y-4">
                  {pendingRequests.length === 0 ? (
                    <div className="glass dark:glass-dark rounded-2xl p-12 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 text-center">
                      <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                      <p className="text-gray-600 dark:text-gray-400">No pending requests</p>
                    </div>
                  ) : (
                    pendingRequests.map((request) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h4 className="mb-1">{request.founderName}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{request.startupName}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-xs px-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400">
                                {request.industry}
                              </span>
                              <span className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400">
                                {request.stage}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500 dark:text-gray-500">{request.date}</p>
                            {request.slaExpiry && (
                              <div className="mt-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-xs flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                SLA: {request.slaExpiry}
                              </div>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{request.message}</p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAcceptRequest(request.id)}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <Check className="w-5 h-5" />
                            <span>Accept Request</span>
                          </button>
                          <button
                            onClick={() => handleRejectRequest(request.id)}
                            className="flex-1 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
                          >
                            <X className="w-5 h-5" />
                            <span>Decline</span>
                          </button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Accepted Requests */}
              {acceptedRequests.length > 0 && (
                <div>
                  <h3 className="mb-4">Accepted Requests</h3>
                  <div className="space-y-4">
                    {acceptedRequests.map((request) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-green-500/20 bg-green-500/5"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h4>{request.founderName}</h4>
                              <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs">
                                Accepted
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{request.startupName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-500">
                              ⏳ Waiting for founder to book meeting and complete payment
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'meetings' && (
            <motion.div
              key="meetings"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h3 className="mb-4">Upcoming Meetings</h3>
              <div className="space-y-4">
                {upcomingMeetings.length === 0 ? (
                  <div className="glass dark:glass-dark rounded-2xl p-12 backdrop-blur-xl border border-white/20 dark:border-gray-800/50 text-center">
                    <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-gray-600 dark:text-gray-400">No upcoming meetings</p>
                  </div>
                ) : (
                  upcomingMeetings.map((meeting) => (
                    <motion.div
                      key={meeting.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-blue-500/20"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4>{meeting.founderName}</h4>
                            <span className="px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 dark:text-green-400 text-xs flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              {meeting.paymentStatus}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{meeting.startupName}</p>
                          <p className="text-sm mb-4">{meeting.purpose}</p>
                          
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Date & Time</p>
                                <p className="text-sm">{meeting.dateTime}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Timer className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Duration</p>
                                <p className="text-sm">{meeting.duration}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {meeting.meetingMode === 'Online' ? (
                                <Video className="w-4 h-4 text-gray-400" />
                              ) : (
                                <MapPin className="w-4 h-4 text-gray-400" />
                              )}
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-500">Mode</p>
                                <p className="text-sm">{meeting.meetingMode}</p>
                              </div>
                            </div>
                            {meeting.location && (
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-500">Location</p>
                                  <p className="text-sm">{meeting.location}</p>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Automated Reminders Log */}
                          {meeting.remindersSent.length > 0 && (
                            <div className="glass dark:glass-dark rounded-xl p-3 bg-blue-500/5 border border-blue-500/10">
                              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                <Clock className="w-3 h-3 inline mr-1" />
                                <strong>Automated Reminders</strong>
                              </p>
                              <div className="space-y-1">
                                {meeting.remindersSent.map((reminder, index) => (
                                  <p key={index} className="text-xs text-gray-500 dark:text-gray-500">
                                    ✓ Reminder sent {reminder}
                                  </p>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Countdown Timer */}
                        <div className="text-right">
                          <div className="px-4 py-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                            <p className="text-xs mb-1">Starts in</p>
                            <p className="text-xl">{getCountdown(meeting.dateTime)}</p>
                          </div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <div className="flex gap-3">
                        {meeting.meetingMode === 'Online' ? (
                          <button
                            onClick={() => alert('Opening meeting link...')}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
                          >
                            <Video className="w-5 h-5" />
                            <span>Join Meeting</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => alert('Opening meeting details...')}
                            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
                          >
                            <ExternalLink className="w-5 h-5" />
                            <span>View Details</span>
                          </button>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SLA Explanation Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/20 dark:border-gray-800/50"
        >
          <h4 className="mb-4">📋 Service Level Agreement (SLA) Rules</h4>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm mb-3">
                <strong>Request Response SLA</strong>
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Respond to requests within <strong>48 hours</strong></li>
                <li>• Requests auto-expire after SLA breach</li>
                <li>• Low response rate affects profile visibility</li>
                <li>• Maintain 80%+ response rate for priority placement</li>
              </ul>
            </div>
            <div>
              <p className="text-sm mb-3">
                <strong>Meeting Attendance SLA</strong>
              </p>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li>• Missing a confirmed meeting marks <strong>No-Show</strong></li>
                <li>• No-shows are logged in system history</li>
                <li>• Multiple no-shows reduce ranking</li>
                <li>• Possible temporary profile suspension</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
