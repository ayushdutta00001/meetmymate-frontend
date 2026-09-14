import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Bell, ChevronDown, Menu } from 'lucide-react';
import { useNotifications, timeAgo } from './NotificationContext';

interface AdminTopBarProps {
  adminName?: string;
  adminEmail?: string;
  onMobileMenuToggle?: () => void;
  onNavigate?: (page: string, payload?: any) => void;
}

export function AdminTopBar({
  adminName = 'Admin User',
  adminEmail = 'admin@meetmymate.com',
  onMobileMenuToggle,
  onNavigate,
}: AdminTopBarProps) {
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

 const {
  notifications,
  markAllRead,
  markOneRead,
  openNotification,
} = useNotifications();
const unreadCount = notifications.filter(
  (notification) => !notification.read
).length;

const handleNotificationClick = async (notification: any) => {
  openNotification(notification);

  /*
   * Mark this notification as read.
   */
 if (!notification.read) {
  await markOneRead(notification.id);
}
  /*
   * P2P Meeting Ready for Scheduling
   */
  if (
    notification.eventType === "p2p_meeting_ready" &&
    notification.section === "p2p"
  ) {
    setShowNotifications(false);

    onNavigate?.("p2p-meeting-scheduling", {
      meetingId: notification.entityId,
    });

    return;
  }

  /*
   * Fallback
   */
  setShowNotifications(false);
};
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
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center">
                        <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />

                        <p className="text-sm text-gray-500">
                          No notifications
                        </p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <button
                          key={notif.id}
                          type="button"
                          onClick={() => handleNotificationClick(notif)}
                          className={`w-full text-left p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                            !notif.read ? 'bg-blue-50/50' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">

                            {!notif.read ? (
                              <div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                            ) : (
                              <div className="w-2 h-2 mt-1.5 flex-shrink-0" />
                            )}

                            <div className="flex-1 min-w-0">

                              <p
                                className={`text-sm ${
                                  !notif.read
                                    ? 'font-semibold text-gray-900'
                                    : 'text-gray-700'
                                }`}
                              >
                                {notif.title}
                              </p>

                              <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                {notif.message}
                              </p>

                              <p className="text-xs text-gray-400 mt-2">
                                {timeAgo(notif.time)}
                              </p>

                            </div>
                          </div>
                        </button>
                      ))
                    )}
                    <div className="p-3 border-t border-gray-200">
                      <button
                        onClick={() => {
                          setShowNotifications(false);
                          markAllRead();
                        }}
                        className="w-full text-sm text-[#3C82F6] hover:underline min-h-[40px]"
                      >
                        Mark all as read
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