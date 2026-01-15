import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';

interface AdminTopBarProps {
  adminName?: string;
  adminEmail?: string;
  onMobileMenuToggle?: () => void;
}

export function AdminTopBar({ adminName = 'Admin User', adminEmail = 'admin@meetmymate.com', onMobileMenuToggle }: AdminTopBarProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'New verification request from Priya K.', time: '5m ago', unread: true },
    { id: 2, text: 'Payment processed: ₹2,500', time: '15m ago', unread: true },
    { id: 3, text: 'New user registration: Rahul M.', time: '1h ago', unread: false },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-gray-200/50 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Mobile Menu Button */}
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-gray-700" />
          </button>
        )}

        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search users, bookings, transactions..."
              className="w-full pl-12 pr-4 py-2.5 bg-white/50 border border-gray-200 rounded-xl focus:border-[#3C82F6] focus:bg-white transition-all outline-none text-sm min-h-[44px]"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative min-w-[44px] min-h-[44px] rounded-xl bg-white/50 border border-gray-200 flex items-center justify-center hover:bg-white transition-all"
              aria-label={`Notifications (${unreadCount} unread)`}
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center" style={{ fontWeight: 600 }}>
                  {unreadCount}
                </span>
              )}
            </motion.button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-14 w-80 max-w-[calc(100vw-2rem)] backdrop-blur-xl bg-white/90 border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="text-sm" style={{ fontWeight: 600 }}>Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            notif.unread ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {notif.unread && (
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm text-gray-700">{notif.text}</p>
                              <p className="text-xs text-gray-500 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 border-t border-gray-200">
                      <button className="w-full text-sm text-[#3C82F6] hover:underline min-h-[40px]">
                        View all notifications
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Admin Profile */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/50 border border-gray-200 hover:bg-white transition-all min-h-[44px]"
              aria-label="Account menu"
            >
              <div className="min-w-[32px] min-h-[32px] w-8 h-8 rounded-full bg-gradient-to-br from-[#3C82F6] to-[#3758FF] flex items-center justify-center text-white text-sm" style={{ fontWeight: 600 }}>
                {adminName.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm" style={{ fontWeight: 600 }}>{adminName}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-500 hidden sm:block" />
            </motion.button>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {showProfileDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileDropdown(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 top-14 w-64 max-w-[calc(100vw-2rem)] backdrop-blur-xl bg-white/90 border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <p className="text-sm" style={{ fontWeight: 600 }}>{adminName}</p>
                      <p className="text-xs text-gray-500">{adminEmail}</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm min-h-[40px]">
                        My Profile
                      </button>
                      <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm min-h-[40px]">
                        Account Settings
                      </button>
                      <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm min-h-[40px]">
                        Security
                      </button>
                    </div>
                    <div className="p-2 border-t border-gray-200">
                      <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm text-red-600 min-h-[40px]">
                        Logout
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}