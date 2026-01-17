import React, { useState } from 'react';
import { motion } from 'motion/react';
import UserApp from './UserApp';
import AdminApp from './AdminApp';
import { Logo } from './components/Logo';
import { Users, Shield } from 'lucide-react';
import { DemoModeBanner } from './components/DemoModeBanner';

// Demo mode check
const DEMO_MODE =
  !import.meta?.env?.VITE_SUPABASE_URL ||
  import.meta.env.VITE_SUPABASE_URL === '';

export default function MainLauncher() {
  // decide mode at FIRST render (important for refresh & Vercel)
  const [mode, setMode] = useState<'main' | 'admin'>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('admin') === 'true' ? 'admin' : 'main';
  });

  const [showDemoBanner, setShowDemoBanner] = useState(true);

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

  // ---------------- ADMIN APP ----------------
  if (mode === 'admin') {
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white rounded-3xl p-10 shadow-xl"
      >
        <div className="flex justify-center mb-8">
          <Logo />
        </div>

        <div className="text-center mb-12">
          <h1 className="text-3xl mb-2">Welcome to Meet my Mate</h1>
          <p className="text-gray-600">Choose your portal to continue</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setMode('main')}
            className="border-2 rounded-2xl p-8 hover:border-blue-600 transition"
          >
            <Users className="mx-auto mb-4 w-10 h-10 text-blue-600" />
            <h2 className="text-xl mb-1">User Portal</h2>
            <p className="text-gray-600">Book friends, dates & meetups</p>
          </button>

          <button
            onClick={() => setMode('admin')}
            className="border-2 rounded-2xl p-8 hover:border-purple-600 transition"
          >
            <Shield className="mx-auto mb-4 w-10 h-10 text-purple-600" />
            <h2 className="text-xl mb-1">Admin Portal</h2>
            <p className="text-gray-600">Manage platform operations</p>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
