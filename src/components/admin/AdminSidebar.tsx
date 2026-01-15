import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from '../Logo';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  Package,
  FolderOpen,
  CreditCard,
  ShieldCheck,
  BarChart3,
  Settings,
  LogOut,
  Heart,
  RefreshCw,
  Sliders,
  Wallet,
  Briefcase,
  UserCog,
  Target,
  X,
  Menu,
} from 'lucide-react';

export type AdminScreen =
  | 'dashboard'
  | 'users'
  | 'providers'
  | 'bookings'
  | 'rent-friend-bookings'
  | 'rent-friend-settings'
  | 'provider-payouts'
  | 'business-meetup-bookings'
  | 'business-meetup-settings'
  | 'expert-verification'
  | 'products'
  | 'categories'
  | 'payments'
  | 'verification'
  | 'reports'
  | 'settings'
  | 'blind-dates'
  | 'refunds';

interface AdminSidebarProps {
  active: AdminScreen;
  onNavigate: (screen: AdminScreen) => void;
  onLogout: () => void;
  isMobileOpen?: boolean;
  onMobileClose?: () => void;
}

export function AdminSidebar({ active, onNavigate, onLogout, isMobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'providers', icon: UserCheck, label: 'Providers' },
    { id: 'bookings', icon: Calendar, label: 'Rent-a-Friend' },
    { id: 'rent-friend-settings', icon: Sliders, label: 'RAF Settings' },
    { id: 'provider-payouts', icon: Wallet, label: 'Provider Payouts' },
    { id: 'business-meetup-bookings', icon: Briefcase, label: 'Business Meetup' },
    { id: 'business-meetup-settings', icon: Target, label: 'BM Settings' },
    { id: 'expert-verification', icon: UserCog, label: 'Expert Verification' },
    { id: 'products', icon: Package, label: 'Products' },
    { id: 'categories', icon: FolderOpen, label: 'Categories' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'refunds', icon: RefreshCw, label: 'Refunds' },
    { id: 'verification', icon: ShieldCheck, label: 'Verification Requests' },
    { id: 'blind-dates', icon: Heart, label: 'Blind Dates' },
    { id: 'reports', icon: BarChart3, label: 'Reports' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ];

  const handleNavigation = (screen: AdminScreen) => {
    onNavigate(screen);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 border-b border-gray-200/50 flex items-center justify-between">
        <div>
          <Logo />
          <p className="text-xs text-gray-500 mt-2">Admin Portal</p>
        </div>
        {/* Mobile close button */}
        {onMobileClose && (
          <button
            onClick={onMobileClose}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        )}
      </div>

      {/* Menu Items */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id;

          return (
            <motion.button
              key={item.id}
              onClick={() => handleNavigation(item.id as AdminScreen)}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl mb-1 transition-all min-h-[44px] ${
                isActive
                  ? 'bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white shadow-lg shadow-blue-500/30'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm" style={{ fontWeight: isActive ? 600 : 500 }}>
                {item.label}
              </span>
            </motion.button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-200/50">
        <motion.button
          onClick={onLogout}
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all min-h-[44px]"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm" style={{ fontWeight: 500 }}>Logout</span>
        </motion.button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar - Hidden on mobile */}
      <div className="hidden lg:flex fixed left-0 top-0 h-screen w-64 backdrop-blur-xl bg-white/70 border-r border-gray-200/50 flex-col z-50">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar - Drawer */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-80 max-w-[85vw] backdrop-blur-xl bg-white/95 border-r border-gray-200/50 flex flex-col z-50"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}