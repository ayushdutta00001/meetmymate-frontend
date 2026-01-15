import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../Card';
import { Button } from '../Button';
import {
  Bell,
  Heart,
  Calendar,
  MessageCircle,
  DollarSign,
  UserCheck,
  Sparkles,
  CheckCheck,
  X,
  Filter,
  Trash2,
} from 'lucide-react';
import { ResponsiveContainer } from '../ui/ResponsiveContainer';
import { ResponsiveButton } from '../ui/ResponsiveButton';

interface NotificationsScreenProps {
  onNavigate: (page: string) => void;
  onBack?: () => void;
}

interface Notification {
  id: string;
  type: 'booking' | 'message' | 'payment' | 'match' | 'system' | 'provider';
  title: string;
  message: string;
  time: string;
  read: boolean;
  actionText?: string;
  actionPage?: string;
  image?: string;
}

export function NotificationsScreen({ onNavigate, onBack }: NotificationsScreenProps) {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'match',
      title: 'New Blind Date Match! 💝',
      message: 'Great news! We found your perfect match. View their profile now!',
      time: '2 min ago',
      read: false,
      actionText: 'View Match',
      actionPage: 'blind-date-match-found',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    },
    {
      id: '2',
      type: 'booking',
      title: 'Booking Confirmed',
      message: 'Your booking with Priya Sharma for Dec 28 at 2:00 PM has been confirmed.',
      time: '1 hour ago',
      read: false,
      actionText: 'View Details',
      actionPage: 'bookings',
    },
    {
      id: '3',
      type: 'message',
      title: 'New Message from Arjun',
      message: 'Hey! Looking forward to our meetup tomorrow. See you at the cafe!',
      time: '3 hours ago',
      read: true,
      actionText: 'Reply',
      actionPage: 'chat',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    },
    {
      id: '4',
      type: 'payment',
      title: 'Payment Successful',
      message: 'Your payment of ₹1,500 for Business Meetup subscription was successful.',
      time: '5 hours ago',
      read: true,
      actionText: 'View Receipt',
      actionPage: 'bookings',
    },
    {
      id: '5',
      type: 'provider',
      title: 'Booking Request Received',
      message: 'Vikram Patel wants to book you for Dec 30. Accept or decline the request.',
      time: '1 day ago',
      read: false,
      actionText: 'View Request',
      actionPage: 'provider-dashboard',
    },
    {
      id: '6',
      type: 'system',
      title: 'Profile Verification Complete',
      message: 'Congratulations! Your profile has been verified. You can now access all features.',
      time: '2 days ago',
      read: true,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    },
    {
      id: '7',
      type: 'booking',
      title: 'Upcoming Booking Reminder',
      message: 'Reminder: You have a Business Meetup with Rajesh Kumar tomorrow at 10:00 AM.',
      time: '3 days ago',
      read: true,
      actionText: 'View Details',
      actionPage: 'bookings',
    },
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <Heart className="w-5 h-5" />;
      case 'booking':
        return <Calendar className="w-5 h-5" />;
      case 'message':
        return <MessageCircle className="w-5 h-5" />;
      case 'payment':
        return <DollarSign className="w-5 h-5" />;
      case 'provider':
        return <UserCheck className="w-5 h-5" />;
      case 'system':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Bell className="w-5 h-5" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'match':
        return 'from-pink-500 to-rose-500';
      case 'booking':
        return 'from-blue-500 to-indigo-500';
      case 'message':
        return 'from-green-500 to-emerald-500';
      case 'payment':
        return 'from-yellow-500 to-amber-500';
      case 'provider':
        return 'from-purple-500 to-violet-500';
      case 'system':
        return 'from-cyan-500 to-teal-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const filteredNotifications = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="mb-1">Notifications</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all text-sm"
              >
                <CheckCheck className="w-4 h-4" />
                Mark all read
              </button>
            )}
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`px-4 py-2 rounded-xl text-sm transition-all ${
                filter === 'unread'
                  ? 'bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>
      </motion.div>

      {/* Notifications List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
              <Bell className="w-10 h-10 text-white" />
            </div>
            <h3 className="mb-2">No Notifications</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {filter === 'unread' ? 'You\'re all caught up!' : 'No notifications yet'}
            </p>
          </motion.div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  variant="glass"
                  hover={true}
                  className={`${!notification.read ? 'border-l-4 border-blue-500' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${getNotificationColor(notification.type)} flex items-center justify-center text-white flex-shrink-0`}>
                      {getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm">{notification.title}</h4>
                          {!notification.read && (
                            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                          {notification.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {notification.message}
                      </p>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        {notification.actionText && notification.actionPage && (
                          <button
                            onClick={() => {
                              markAsRead(notification.id);
                              onNavigate(notification.actionPage);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all text-xs"
                          >
                            {notification.actionText}
                          </button>
                        )}
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all text-xs"
                          >
                            Mark as read
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="ml-auto p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Optional Image */}
                    {notification.image && (
                      <img
                        src={notification.image}
                        alt=""
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}