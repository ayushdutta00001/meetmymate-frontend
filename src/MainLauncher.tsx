import React, { useState } from 'react';
import { motion } from 'motion/react';
import UserApp from './UserApp';
import AdminApp from './AdminApp';
import { Logo } from './components/Logo';
import { Users, Shield } from 'lucide-react';
import { DemoModeBanner } from './components/DemoModeBanner';

// Check if in demo mode
const DEMO_MODE = !import.meta?.env?.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === '';

export default function MainLauncher() {
  const [mode, setMode] = useState<'main' | 'admin' | null>(null);
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  // Check URL parameter for direct access
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const adminMode = params.get('admin');
    if (adminMode === 'true') {
      setMode('admin');
    }
  }, []);

  if (mode === 'main') {
    return (
      <>
        {DEMO_MODE && showDemoBanner && <DemoModeBanner onDismiss={() => setShowDemoBanner(false)} />}
        <UserApp />
      </>
    );
  }

  if (mode === 'admin') {
    return (
      <>
        {DEMO_MODE && showDemoBanner && <DemoModeBanner onDismiss={() => setShowDemoBanner(false)} />}
        <AdminApp />
      </>
    );
  }

  // Selection Screen
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F4F7] via-[#E8EBF0] to-[#F2F4F7] flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#3C82F6]/20 to-[#3758FF]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#8EA8FF]/20 to-[#3C82F6]/20 rounded-full blur-3xl"
        />
      </div>

      {/* Selection Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-4xl"
      >
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl">
          {/* Logo */}
          <div className="flex justify-center mb-6 md:mb-8">
            <Logo />
          </div>

          {/* Title */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="mb-3 text-2xl md:text-3xl lg:text-4xl">Welcome to Meet my Mate</h1>
            <p className="text-gray-600 text-sm md:text-base">Choose your portal to continue</p>
          </div>

          {/* Mode Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* User App */}
            <motion.button
              onClick={() => setMode('main')}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="backdrop-blur-xl bg-white/50 border-2 border-gray-200 rounded-3xl p-6 md:p-8 text-center hover:border-[#3C82F6] hover:bg-white/70 transition-all group min-h-[200px] md:min-h-[280px]"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-2xl bg-gradient-to-br from-[#3C82F6] to-[#3758FF] flex items-center justify-center shadow-lg shadow-blue-500/30"
              >
                <Users className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </motion.div>
              <h2 className="mb-2 md:mb-3 text-lg md:text-xl">User Portal</h2>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                Access the main platform to book friends, blind dates, and business meetups
              </p>
              <div className="mt-4 md:mt-6 px-4 py-2 bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white rounded-xl inline-block group-hover:shadow-lg transition-all text-sm md:text-base" style={{ fontWeight: 600 }}>
                Launch User App →
              </div>
            </motion.button>

            {/* Admin Panel */}
            <motion.button
              onClick={() => setMode('admin')}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="backdrop-blur-xl bg-white/50 border-2 border-gray-200 rounded-3xl p-6 md:p-8 text-center hover:border-[#3758FF] hover:bg-white/70 transition-all group min-h-[200px] md:min-h-[280px]"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: -5 }}
                className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 rounded-2xl bg-gradient-to-br from-[#8EA8FF] to-[#3758FF] flex items-center justify-center shadow-lg shadow-purple-500/30"
              >
                <Shield className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </motion.div>
              <h2 className="mb-2 md:mb-3 text-lg md:text-xl">Admin Portal</h2>
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                Manage users, products, verifications, payments, and platform analytics
              </p>
              <div className="mt-4 md:mt-6 px-4 py-2 bg-gradient-to-r from-[#8EA8FF] to-[#3758FF] text-white rounded-xl inline-block group-hover:shadow-lg transition-all text-sm md:text-base" style={{ fontWeight: 600 }}>
                Launch Admin Panel →
              </div>
            </motion.button>
          </div>

          {/* Footer Info */}
          <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t border-gray-200 text-center">
            <p className="text-xs text-gray-500">
              For demo purposes: Admin login - admin@meetmymate.com / admin123
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}