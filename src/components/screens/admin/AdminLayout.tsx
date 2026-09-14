import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  Users,
  Heart,
  Briefcase,
  UserPlus,
  DollarSign,
  Lightbulb,
  FileText,
  ChevronRight,
  LogOut,
  Settings,
  Shield,
  UserCheck,
  Mail,
  Star,
  Menu,
  X,
  UsersRound,
  UserCog,
  Bell,
  CheckCheck,
  Trash2,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import { NotificationProvider, useNotifications, timeAgo } from './NotificationContext';
import type { NotifType } from './NotificationContext';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentModule: string;
  currentSubSection?: string;
  onNavigate: (module: string, subSection?: string) => void;
  onLogout: () => void;
}

function NotifIcon({ type }: { type: NotifType }) {
  if (type === 'success') return <CheckCircle className="w-4 h-4 text-green-500" />;
  if (type === 'warning') return <AlertTriangle className="w-4 h-4 text-amber-500" />;
  if (type === 'error') return <XCircle className="w-4 h-4 text-red-500" />;
  return <Info className="w-4 h-4 text-blue-500" />;
}

function NotifDot({ type }: { type: NotifType }) {
  const c = { success: 'bg-green-500', warning: 'bg-amber-500', error: 'bg-red-500', info: 'bg-blue-500' }[type];
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1 ${c}`} />;
}

function NotificationBell({
  onNavigate,
}: {
  onNavigate: (module: string, subSection?: string) => void;
}) {
  const {
    notifications,
    markAllRead,
    clear,
    openNotification,
    markOneRead,
  } = useNotifications();

  const [open, setOpen] = useState(false);

  const unread = notifications.filter(n => !n.read).length;

  const handleNotificationClick = async (n: any) => {
    openNotification(n);

    if (!n.read) {
      await markOneRead(n.id);
    }

    setOpen(false);

    if (
      n.section === "p2p" &&
      n.eventType === "p2p_meeting_ready"
    ) {
      onNavigate("p2p-matching", "meeting-scheduling");
    }
  };

  return (
    <>
      {/* BELL */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        aria-label="Notifications"
        aria-expanded={open}
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />

        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center px-1 leading-none">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* NOTIFICATION POPUP */}
      {open &&
        createPortal(
          <div
            style={{
              position: "fixed",
              top: "60px",
              right: "16px",
              width: "400px",
              maxWidth: "calc(100vw - 32px)",
              height: "440px",
              maxHeight: "calc(100vh - 76px)",
              zIndex: 2147483647,
            }}
          >
            <AnimatePresence>
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                  scale: 0.97,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  scale: 0.97,
                }}
                transition={{
                  duration: 0.15,
                }}
                className="
                  w-full
                  h-full
                  bg-white
                  dark:bg-[#1A1F2E]
                  border
                  border-gray-200
                  dark:border-gray-800
                  rounded-2xl
                  shadow-2xl
                  flex
                  flex-col
                  overflow-hidden
                "
              >
                {/* HEADER */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-gray-500 dark:text-gray-400" />

                    <span className="text-sm text-gray-900 dark:text-white">
                      Notifications
                    </span>

                    {notifications.length > 0 && (
                      <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-1.5 py-0.5 rounded-full">
                        {notifications.length}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={markAllRead}
                      title="Mark all read"
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    </button>

                    <button
                      onClick={clear}
                      title="Clear all"
                      className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>

                {/* LIST */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 py-10 text-center px-4">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-gray-400" />
                      </div>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        No notifications yet
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() =>
                            handleNotificationClick(n)
                          }
                          className={`
                            px-4
                            py-3
                            flex
                            gap-3
                            cursor-pointer
                            transition-colors
                            ${
                              !n.read
                                ? "bg-blue-50/60 dark:bg-blue-500/5"
                                : "hover:bg-gray-50 dark:hover:bg-gray-900/30"
                            }
                          `}
                        >
                          <NotifIcon type={n.type} />

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p
                                className={`
                                  text-xs
                                  leading-snug
                                  truncate
                                  ${
                                    !n.read
                                      ? "text-gray-900 dark:text-white"
                                      : "text-gray-700 dark:text-gray-300"
                                  }
                                `}
                              >
                                {n.title}
                              </p>

                              <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                                {timeAgo(n.time)}
                              </span>
                            </div>

                            <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                              {n.message}
                            </p>
                          </div>

                          {!n.read && (
                            <NotifDot type={n.type} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>,
          document.body
        )}
    </>
  );
}

function AdminLayoutInner({ children, currentModule, currentSubSection, onNavigate, onLogout }: AdminLayoutProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const modules = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, hasSubNav: false },
    { id: 'users', label: 'Users & Identity Control', icon: Users, hasSubNav: false },
    { id: 'raf-operations', label: 'RAF Operations', icon: Settings, hasSubNav: true, rafOperationsModule: true },
    { id: 'provider-management', label: 'Provider Management', icon: UserCog, hasSubNav: true, providerMgmtModule: true },
    { id: 'blind-date', label: 'Blind Date', icon: Heart, hasSubNav: true },
    { id: 'business-meetup', label: 'Business Meetup', icon: Briefcase, hasSubNav: true },
    { id: 'p2p-matching', label: 'P2P Matching', icon: UsersRound, hasSubNav: true },
    { id: 'find-investor', label: 'Find Investor', icon: DollarSign, hasSubNav: true },
    { id: 'communications', label: 'Communications', icon: Mail, hasSubNav: true, communicationsModule: true },
    { id: 'reviews', label: 'Reviews & Ratings', icon: Star, hasSubNav: true, reviewsModule: true },
    { id: 'audit-logs', label: 'Global Audit Logs', icon: FileText, hasSubNav: false },
    { id: 'internal-legal', label: 'Internal Legal & Policies', icon: Shield, hasSubNav: false },
  ];

  const subSections = [
    { id: 'operations', label: 'Operations & Control' },
    { id: 'payments', label: 'Payments & Finance' },
    { id: 'disputes', label: 'Disputes & Reports' },
    { id: 'settings', label: 'System & Security Settings' },
  ];

const blindDateSubSections = [
  { id: 'match-arrange', label: 'Match & Arrange' },
  { id: 'operations', label: 'Operations & Control' },
  { id: 'payments', label: 'Payments & Finance' },
  { id: 'refunds', label: 'Refunds' },
  { id: 'disputes', label: 'Disputes & Reports' },
  { id: 'settings', label: 'System & Security Settings' },
];
  const rafSubSections = [
    { id: 'raf-overview', label: 'Rent A Friend Overview' },
    { id: 'raf-bookings', label: 'Bookings' },
    { id: 'raf-live', label: 'Live Bookings' },
    { id: 'raf-payments', label: 'Payments' },
    { id: 'raf-refunds', label: 'Refunds' },
    { id: 'raf-services', label: 'Services' },
    { id: 'raf-reports', label: 'Reports & Analytics' },
    { id: 'raf-settings', label: 'Settings' },
  ];

  const providerMgmtSubSections = [
    { id: 'pm-overview', label: 'Overview' },
    { id: 'pm-providers', label: 'Providers' },
    { id: 'pm-earnings', label: 'Earnings' },
    { id: 'pm-withdrawals', label: 'Withdrawals' },
    { id: 'pm-verification', label: 'Admin Verification' },
  ];

  const communicationsSubSections = [
    { id: 'email-logs', label: 'Email Logs' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'email-templates', label: 'Email Templates' },
    { id: 'automations', label: 'Automations' },
  ];

  const reviewsSubSections = [
  { id: 'all-reviews', label: 'All Reviews' },
  { id: 'flagged-reviews', label: 'Flagged Reviews' },
  { id: 'review-analytics', label: 'Review Analytics' },
];

const p2pSubSections = [
  { id: 'overview', label: 'Overview' },
  { id: 'requests', label: 'Requests' },
  { id: 'meeting-scheduling', label: 'Meeting Scheduling' },
  { id: 'meetings', label: 'Meetings' },
  { id: 'payments', label: 'Payments' },
  { id: 'refunds', label: 'Refunds' },
  { id: 'settings', label: 'Settings' },
];

  const handleModuleClick = (moduleId: string, hasSubNav: boolean, isCommunications?: boolean, isReviews?: boolean, isRaf?: boolean, isProviderMgmt?: boolean) => {
    if (hasSubNav) {
      setExpandedModule(expandedModule === moduleId ? null : moduleId);
      if (isCommunications) {
        onNavigate(moduleId, 'email-logs');
      } else if (isReviews) {
        onNavigate(moduleId, 'all-reviews');
      } else if (isRaf) {
        onNavigate(moduleId, 'raf-overview');
      } else if (isProviderMgmt) {
        onNavigate(moduleId, 'pm-overview');
      } else if (moduleId === 'blind-date') {
        onNavigate(moduleId, 'match-arrange');
      } else if (moduleId === 'p2p-matching') {
        onNavigate(moduleId, 'overview');
      } else {
        onNavigate(moduleId, 'operations');
      }
    } else {
      setExpandedModule(null);
      onNavigate(moduleId);
    }
    setIsMobileMenuOpen(false);
  };

  const handleSubNavigation = (moduleId: string, subId: string) => {
    onNavigate(moduleId, subId);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      {/* Logo/Header */}
      <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg text-gray-900 dark:text-white">Admin Portal</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Owner Console</p>
          </div>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(false)}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          aria-label="Close menu"
        >
          <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          {modules.map((module) => {
            const Icon = module.icon;
            const isActive = currentModule === module.id;
            const isExpanded = expandedModule === module.id;

            return (
              <div key={module.id}>
                <button
                  onClick={() => handleModuleClick(module.id, module.hasSubNav, module.communicationsModule, module.reviewsModule, module.rafOperationsModule, module.providerMgmtModule)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm transition-colors min-h-[44px] ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{module.label}</span>
                  </div>
                  {module.hasSubNav && (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform flex-shrink-0 ${isExpanded ? 'rotate-90' : ''}`}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {module.hasSubNav && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-8 mt-1 space-y-1">
                        {(module.providerMgmtModule ? providerMgmtSubSections : module.rafOperationsModule ? rafSubSections : module.communicationsModule ? communicationsSubSections : module.reviewsModule ? reviewsSubSections : module.id === 'blind-date' ? blindDateSubSections : module.id === 'p2p-matching' ? p2pSubSections : subSections).map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => handleSubNavigation(module.id, sub.id)}
                            className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-colors min-h-[40px] ${
                              currentModule === module.id && currentSubSection === sub.id
                                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                            }`}
                          >
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[44px]"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-72 bg-white dark:bg-[#1A1F2E] border-r border-gray-200 dark:border-gray-800 flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-80 max-w-[85vw] bg-white dark:bg-[#1A1F2E] border-r border-gray-200 dark:border-gray-800 flex flex-col z-50"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-visible min-w-0">
        {/* Top Bar — desktop + mobile */}
        <div className="sticky top-0 z-[999] bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-4 lg:px-6 py-3">
         <div className="flex items-center justify-between">

  {/* Left Side */}
  <div className="flex items-center gap-3">
    {/* Mobile menu */}
    <button
      onClick={() => setIsMobileMenuOpen(true)}
      className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
      aria-label="Open menu"
    >
      <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
    </button>

    {/* Mobile title */}
    <h1 className="lg:hidden text-base text-gray-900 dark:text-white">
      Admin Portal
    </h1>
  </div>

  {/* Right Side */}
  <div className="flex items-center gap-4 ml-auto">
   <NotificationBell onNavigate={onNavigate} />

    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs">
        AD
      </div>

      <span className="hidden lg:block text-sm text-gray-700 dark:text-gray-300">
        Admin
      </span>
    </div>
  </div>
</div>
        </div>


        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

export function AdminLayout(props: AdminLayoutProps) {
  return <AdminLayoutInner {...props} />;

}
