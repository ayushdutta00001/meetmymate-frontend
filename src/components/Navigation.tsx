import React, { useState } from 'react';
import { Home, Bell, Calendar, MessageCircle, User, Settings, Users, DollarSign, Shield, ChevronLeft, ChevronRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavigationProps {
  active: string;
  onNavigate: (page: string) => void;
  isAdmin?: boolean;
  notificationCount?: number;
  userProfileImage?: string;
  userName?: string;
}
import type { LucideIcon } from 'lucide-react';

type NavItem = {
  id: string;
  icon: LucideIcon;
  label: string;
  badge?: number;
  comingSoon?: boolean;
  isProfile?: boolean;
};


export function Navigation({ 
  active, 
  onNavigate, 
  isAdmin = false, 
  notificationCount = 0,
  userProfileImage = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
  userName = 'Alex'
}: NavigationProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

 const userNavItems: NavItem[] = [

    { id: 'home', icon: Home, label: 'Home' },
    { id: 'notifications', icon: Bell, label: 'Notifications', badge: notificationCount },
    { id: 'bookings', icon: Calendar, label: 'Bookings' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', comingSoon: true },
    { id: 'profile', icon: User, label: 'Profile', isProfile: true },
  ];

  const adminNavItems: NavItem[] = [

    { id: 'admin-dashboard', icon: Home, label: 'Dashboard' },
    { id: 'admin-users', icon: Users, label: 'Users' },
    { id: 'admin-verification', icon: Shield, label: 'Verification' },
    { id: 'admin-payments', icon: DollarSign, label: 'Payments' },
    { id: 'admin-settings', icon: Settings, label: 'Settings' },
  ];

  const navItems = isAdmin ? adminNavItems : userNavItems;

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden z-50">
        <motion.nav
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="bg-white/95 dark:bg-[#0A0F1F]/95 backdrop-blur-xl flex items-center justify-around py-3 px-2 shadow-2xl border-t border-gray-200 dark:border-gray-800"
        >
          {navItems.slice(0, 5).map((item, index) => {
            const Icon = item.icon;
            const isActive = active === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="relative flex flex-col items-center justify-center"
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="mobile-active-pill"
                    className="absolute inset-0 -z-10 bg-gradient-to-br from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30 rounded-2xl"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}

                <div className="relative p-2">
                  <motion.div
                    animate={{
                      rotate: isActive ? [0, -10, 10, -10, 0] : 0,
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon 
                      className={`w-6 h-6 transition-colors ${
                        isActive
                          ? 'text-[#3C82F6] dark:text-[#3758FF]'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    />
                  </motion.div>
                  
                  {/* Badge */}
                  {item.badge !== undefined && item.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </motion.span>
                  )}
                  
                  {/* Coming Soon */}
                  {item.comingSoon && (
                    <motion.span
                      initial={{ scale: 0, rotate: -12 }}
                      animate={{ scale: 1, rotate: -12 }}
                      className="absolute -top-2 -right-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[8px] px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg"
                    >
                      Soon
                    </motion.span>
                  )}
                </div>
                
                <span className={`text-[10px] mt-1 font-medium transition-colors ${
                  isActive 
                    ? 'text-[#3C82F6] dark:text-[#3758FF]' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </motion.nav>
      </div>

      {/* Desktop Sidebar Navigation */}
      <motion.div
        initial={false}
        animate={{ width: isExpanded ? 240 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="hidden md:block fixed right-0 top-0 h-screen z-50"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <motion.nav
          className="relative h-full bg-white/95 dark:bg-[#0A0F1F]/95 backdrop-blur-xl shadow-2xl border-l border-gray-200 dark:border-gray-800 rounded-l-3xl overflow-hidden"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-pink-500/10 pointer-events-none" />

          {/* Content */}
          <div className="relative h-full flex flex-col py-8 px-4">
            {/* Logo/Brand Area */}
            <motion.div
              className="mb-8 flex items-center justify-center"
              animate={{ opacity: isExpanded ? 1 : 0.7 }}
            >
              {isExpanded ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-center"
                >
                  <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    MeetMyMate in
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {isAdmin ? 'Admin Panel' : 'Dashboard'}
                  </div>
                </motion.div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                  M
                </div>
              )}
            </motion.div>

            {/* Navigation Items */}
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
              {navItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = active === item.id;

                return (
                  <motion.button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className="relative group"
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ x: -4 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {/* Active Background */}
                    {isActive && (
                      <motion.div
                        layoutId="desktop-active-pill"
                        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 dark:from-blue-500/30 dark:to-purple-500/30 rounded-xl shadow-lg"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    {/* Hover Effect */}
                    {!isActive && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"
                      />
                    )}

                    {/* Content */}
                    <div className={`relative flex items-center gap-4 px-4 py-3 rounded-xl transition-colors ${
                      isActive
                        ? 'text-[#3C82F6] dark:text-[#3758FF]'
                        : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white'
                    }`}>
                      <div className="relative">
                        <motion.div
                          animate={{
                            rotate: isActive ? [0, -10, 10, -10, 0] : 0,
                            scale: isActive ? 1.1 : 1,
                          }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon className="w-6 h-6" />
                        </motion.div>

                        {/* Badge */}
                        {item.badge !== undefined && item.badge > 0 && (
                          <motion.span
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-2 -right-2 bg-gradient-to-br from-red-500 to-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
                          >
                            {item.badge > 9 ? '9+' : item.badge}
                          </motion.span>
                        )}
                      </div>

                      {/* Label */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2 overflow-hidden"
                          >
                            <span className="font-medium whitespace-nowrap">{item.label}</span>
                            {item.comingSoon && (
                              <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-[9px] px-2 py-0.5 rounded-full whitespace-nowrap shadow-lg">
                                Soon
                              </span>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* Expand/Collapse Hint */}
            <motion.div
              className="mt-4 text-center text-xs text-gray-400 dark:text-gray-600"
              animate={{ opacity: isExpanded ? 0 : 1 }}
            >
              <ChevronLeft className="w-4 h-4 mx-auto animate-pulse" />
            </motion.div>
          </div>
        </motion.nav>
      </motion.div>
    </>
  );
}