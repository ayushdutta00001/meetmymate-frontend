import React, { useState } from 'react';
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
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  currentModule: string;
  currentSubSection?: string;
  onNavigate: (module: string, subSection?: string) => void;
  onLogout: () => void;
}

export function AdminLayout({ children, currentModule, currentSubSection, onNavigate, onLogout }: AdminLayoutProps) {
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const modules = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, hasSubNav: false },
    { id: 'users', label: 'Users & Identity Control', icon: Users, hasSubNav: false },
    { id: 'rent-friend', label: 'Rent-a-Friend', icon: UserCheck, hasSubNav: true },
    { id: 'blind-date', label: 'Blind Date', icon: Heart, hasSubNav: true },
    { id: 'business-meetup', label: 'Business Meetup', icon: Briefcase, hasSubNav: true },
    { id: 'p2p-match', label: 'Peer-to-Peer Match', icon: UserPlus, hasSubNav: true },
    { id: 'find-investor', label: 'Find Investor', icon: DollarSign, hasSubNav: true },
    { id: 'find-experienced', label: 'Find Experienced People', icon: Lightbulb, hasSubNav: true },
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

  const communicationsSubSections = [
    { id: 'email-logs', label: 'Email Logs' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'email-templates', label: 'Email Templates' },
    { id: 'automations', label: 'Automations' },
  ];

  const reviewsSubSections = [
    { id: 'all-reviews', label: 'All Reviews' },
    { id: 'flagged-reviews', label: 'Flagged Reviews' },
    { id: 'analytics', label: 'Review Analytics' },
  ];

  const handleModuleClick = (moduleId: string, hasSubNav: boolean, isCommunications?: boolean, isReviews?: boolean) => {
    if (hasSubNav) {
      setExpandedModule(expandedModule === moduleId ? null : moduleId);
      // Navigate to first sub-section by default
      if (isCommunications) {
        onNavigate(moduleId, 'email-logs');
      } else if (isReviews) {
        onNavigate(moduleId, 'all-reviews');
      } else {
        onNavigate(moduleId, 'operations');
      }
    } else {
      setExpandedModule(null);
      onNavigate(moduleId);
    }
    // Close mobile menu on navigation
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
        {/* Mobile close button */}
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
                  onClick={() => handleModuleClick(module.id, module.hasSubNav, module.communicationsModule, module.reviewsModule)}
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

                {/* Sub-navigation */}
                <AnimatePresence>
                  {module.hasSubNav && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-8 mt-1 space-y-1">
                        {(module.communicationsModule ? communicationsSubSections : module.reviewsModule ? reviewsSubSections : subSections).map((sub) => (
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
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:flex w-72 bg-white dark:bg-[#1A1F2E] border-r border-gray-200 dark:border-gray-800 flex-col">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar - Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Drawer */}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header with Menu Button */}
        <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            <div className="flex-1">
              <h1 className="text-lg text-gray-900 dark:text-white">Admin Portal</h1>
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