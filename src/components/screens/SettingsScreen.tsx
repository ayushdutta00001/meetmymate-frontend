import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../Card';
import { Button } from '../Button';
import { ThemeToggle } from '../ThemeToggle';
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  CreditCard, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Globe,
  Lock,
  Eye,
  Star
} from 'lucide-react';
import { ResponsiveContainer } from '../ui/ResponsiveContainer';

interface SettingsScreenProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export function SettingsScreen({ onBack, onNavigate }: SettingsScreenProps) {
  const [notifications, setNotifications] = useState({
    messages: true,
    bookings: true,
    marketing: false,
  });

  const settingsSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Edit Profile', action: () => {} },
        { icon: Shield, label: 'Privacy & Safety', action: () => {} },
        { icon: Lock, label: 'Change Password', action: () => {} },
        { icon: Eye, label: 'Visibility Settings', action: () => {} },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: Bell, label: 'Notifications', action: () => {} },
        { icon: Globe, label: 'Language', action: () => {}, value: 'English' },
        { icon: CreditCard, label: 'Payment Methods', action: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help Center', action: () => {} },
        { icon: Star, label: 'Rate Us', action: () => {} },
        { icon: Shield, label: 'Terms & Conditions', action: () => {} },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <ResponsiveContainer maxWidth="4xl">
          <div className="px-4 md:px-6 lg:px-8 py-4 md:py-6">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full glass dark:glass-dark flex items-center justify-center min-h-[44px]"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <h2>Settings</h2>
            </div>
          </div>
        </ResponsiveContainer>
      </motion.div>

      <ResponsiveContainer maxWidth="4xl">
        <div className="px-4 md:px-6 lg:px-8 py-6 md:py-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-4 md:mb-6"
          >
            <Card variant="gradient">
              <div className="flex items-center gap-3 md:gap-4">
                <img
                  src="https://images.unsplash.com/photo-1543807641-bd607cfa8dca?w=200"
                  alt="Profile"
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-4 border-white/30"
                />
                <div className="flex-1">
                  <h3 className="text-white mb-1">Alex Johnson</h3>
                  <p className="text-white/80 text-sm mb-2">alex.johnson@email.com</p>
                  <button className="text-white/90 text-sm hover:text-white transition-colors min-h-[44px] flex items-center">
                    View Profile →
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Theme Toggle Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 md:mb-6"
          >
            <Card variant="glass" hover={false}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <h4 className="mb-1">Theme</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Toggle between light and dark mode
                  </p>
                </div>
                <ThemeToggle />
              </div>
            </Card>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-4 md:mb-6"
          >
            <Card variant="glass" hover={false}>
              <h4 className="mb-4">Notification Preferences</h4>
              <div className="space-y-4">
                {Object.entries(notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {key === 'messages' && 'Get notified about new messages'}
                        {key === 'bookings' && 'Updates about your bookings'}
                        {key === 'marketing' && 'Promotional offers and updates'}
                      </p>
                    </div>
                    <button
                      onClick={() => setNotifications({ ...notifications, [key]: !value })}
                      className={`w-12 h-6 rounded-full transition-all relative min-h-[44px] flex items-center ${
                        value ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88]' : 'bg-gray-300 dark:bg-gray-700'
                      }`}
                    >
                      <motion.div
                        className="absolute w-4 h-4 bg-white rounded-full"
                        animate={{ left: value ? '26px' : '4px' }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Settings Sections */}
          {settingsSections.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + sectionIndex * 0.1 }}
              className="mb-4 md:mb-6"
            >
              <h4 className="mb-3 px-2">{section.title}</h4>
              <Card variant="glass" hover={false}>
                <div className="space-y-2">
                  {section.items.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.button
                        key={index}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={item.action}
                        className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-[#F2F4F7] dark:hover:bg-[#0A0F1F] transition-all min-h-[44px]"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3C82F6] to-[#1F3C88] flex items-center justify-center">
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <span className="text-left">{item.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.value && (
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {item.value}
                            </span>
                          )}
                          <ChevronRight className="w-5 h-5 text-gray-400" />
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>
          ))}

          {/* Logout */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card variant="glass" hover={false}>
              <motion.button
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onNavigate('welcome')}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-red-600 dark:text-red-400 min-h-[44px]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                    <LogOut className="w-5 h-5 text-red-600 dark:text-red-400" />
                  </div>
                  <span>Logout</span>
                </div>
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </Card>
          </motion.div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Version 1.0.0 • © 2024 Meet my Mate
          </p>
        </div>
      </ResponsiveContainer>
    </div>
  );
}