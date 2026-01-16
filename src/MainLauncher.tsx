import React, { useState } from 'react';
import { motion } from 'motion/react';
import UserApp from './UserApp';
import AdminApp from './AdminApp';
import { Logo } from './components/Logo';
import { Users, Shield } from 'lucide-react';
import { DemoModeBanner } from './components/DemoModeBanner';

import { useAuth } from './lib/auth-context';
import { isAdminUser } from './lib/admin-auth';

// Check if in demo mode
const DEMO_MODE =
  !import.meta?.env?.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL === '';

export default function MainLauncher() {
  const { user } = useAuth();

  const [mode, setMode] = useState<'main' | 'admin' | null>(null);
  const [showDemoBanner, setShowDemoBanner] = useState(true);
  const [adminAllowed, setAdminAllowed] = useState<boolean | null>(null);

  // Allow direct admin access via ?admin=true (still protected)
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setMode('admin');
    }
  }, []);

  // Check admin permission when admin mode is requested
  React.useEffect(() => {
    if (mode === 'admin') {
      if (!user) {
        setAdminAllowed(false);
        return;
      }

      isAdminUser(user.id).then(setAdminAllowed);
    }
  }, [mode, user]);

  // ---------------- USER APP ----------------
  if (mode === 'main') {
    return (
      <>
        {DEMO_MODE && showDemoBanner && (
          <DemoModeBanner onDismiss={() => setShowDemoBanner(false)} />
        )}
        <UserApp />
      </>
    );
  }

  // ---------------- ADMIN APP (PROTECTED) ----------------
  if (mode === 'admin') {
    if (adminAllowed === null) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p>Checking admin access…</p>
        </div>
      );
    }

    if (!adminAllowed) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">
              You are not authorized to access the Admin Portal.
            </p>
            <button
              onClick={() => setMode(null)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Go Back
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        {DEMO_MODE && showDemoBanner && (
          <DemoModeBanner onDismiss={() => setShowDemoBanner(false)} />
        )}
        <AdminApp />
      </>
    );
  }

  // ---------------- SELECTION SCREEN ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F2F4F7] via-[#E8EBF0] to-[#F2F4F7] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-[#3C82F6]/20 to-[#3758FF]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-[#8EA8FF]/20 to-[#3C82F6]/20 rounded-full blur-3xl"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-4xl"
      >
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-6 md:p-8 lg:p-12 shadow-2xl">
          <div className="flex justify-center mb-8">
            <Logo />
          </div>

          <div className="text-center mb-12">
            <h1 className="mb-3 text-3xl">Welcome to Meet my Mate</h1>
            <p className="text-gray-600">Choose your portal to continue</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.button
              onClick={() => setMode('main')}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border-2 rounded-3xl p-8 text-center hover:border-[#3C82F6]"
            >
              <Users className="mx-auto mb-4 w-10 h-10 text-blue-600" />
              <h2 className="mb-2 text-xl">User Portal</h2>
              <p className="text-gray-600">Book friends, dates & meetups</p>
            </motion.button>

            <motion.button
              onClick={() => setMode('admin')}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white border-2 rounded-3xl p-8 text-center hover:border-[#3758FF]"
            >
              <Shield className="mx-auto mb-4 w-10 h-10 text-purple-600" />
              <h2 className="mb-2 text-xl">Admin Portal</h2>
              <p className="text-gray-600">Manage platform operations</p>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
