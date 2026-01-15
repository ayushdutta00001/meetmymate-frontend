import React from 'react';
import { Home, Bell, Calendar, MessageCircle, User, Settings, Users, DollarSign, Shield, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface NavigationProps {
  active: string;
  onNavigate: (page: string) => void;
  isAdmin?: boolean;
  notificationCount?: number;
  userProfileImage?: string;
  userName?: string;
}

export function Navigation({ 
  active, 
  onNavigate, 
  isAdmin = false, 
  notificationCount = 0,
  userProfileImage = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  userName = 'Alex'
}: NavigationProps) {
  const userNavItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'explore', icon: Compass, label: 'Explore' },
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: notificationCount },
    { id: 'bookings', icon: Calendar, label: 'Bookings' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', comingSoon: true },
    { id: 'profile', icon: User, label: 'Profile', isProfile: true },
  ];

  const adminNavItems = [
    { id: 'admin-dashboard', icon: Home, label: 'Dashboard' },
    { id: 'admin-users', icon: Users, label: 'Users' },
    { id: 'admin-verification', icon: Shield, label: 'Verification' },
    { id: 'admin-payments', icon: DollarSign, label: 'Payments' },
    { id: 'admin-settings', icon: Settings, label: 'Settings' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <div className="fixed bottom-0 left-0 right-0 md:left-auto md:bottom-auto md:top-0 md:right-0 md:w-20 md:h-screen z-50">
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="bg-white dark:bg-[#0A0F1F] md:h-full flex md:flex-col items-center justify-around md:justify-center md:gap-8 py-4 px-2 md:py-8 shadow-2xl md:rounded-l-3xl border-t md:border-t-0 md:border-l border-gray-200 dark:border-gray-800"
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-[#3C82F6] dark:text-[#3758FF]'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative">
                <item.icon className="w-6 h-6" />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
                {item.comingSoon && (
                  <span className="absolute -top-2 -right-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[9px] px-1.5 py-0.5 rounded-full whitespace-nowrap">
                    Soon
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-1">{item.label}</span>
            </motion.button>
          );
        })}
      </motion.nav>
    </div>
  );
}