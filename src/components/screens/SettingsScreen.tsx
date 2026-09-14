import { supabase } from '../../supabase';
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../Card';
import { ThemeToggle } from '../ThemeToggle';
import {
  LogOut,
  ChevronRight,
  Lock,
  Shield,
} from 'lucide-react';
import { BackButton } from '../ui/BackButton';
import { ResponsiveContainer } from '../ui/ResponsiveContainer';
import { Button } from '../Button';

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
}

export function SettingsScreen({ onBack, onLogout }: SettingsScreenProps) {
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  async function handleChangePassword() {
    if (newPassword.length < 6) {
      setPasswordMessage('❌ Password must be at least 6 characters');
      return;
    }

    setLoadingPassword(true);
    setPasswordMessage(null);

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoadingPassword(false);

    if (error) {
      setPasswordMessage(error.message);
    } else {
      setPasswordMessage('✅ Password updated successfully');
      setNewPassword('');
      setTimeout(() => setShowChangePassword(false), 1500);
    }
  }

  async function handleLogoutAllDevices() {
    const confirmed = window.confirm(
      'This will log you out from all devices. Continue?'
    );

    if (!confirmed) return;

    await supabase.auth.signOut({ scope: 'global' });
    onLogout();
  }
async function handleDeleteAccount() {
  const confirmed = window.confirm(
    "This will permanently delete your account. This action cannot be undone. Continue?"
  );

  if (!confirmed) return;

  const { error } = await supabase.functions.invoke("delete_my_account");



  if (error) {
    alert(error.message);
    return;
  }

  await supabase.auth.signOut({ scope: "global" });
  onLogout();
}

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <ResponsiveContainer maxWidth="2xl">
          <div className="px-4 md:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-4">
              <BackButton onClick={onBack} />
              <h2>Settings</h2>
            </div>
          </div>
        </ResponsiveContainer>
      </motion.div>

      <ResponsiveContainer maxWidth="2xl">
        <div className="px-4 md:px-6 lg:px-8 py-6 space-y-6">

          {/* Appearance */}
          <Card variant="glass" hover={false}>
            <div className="flex items-center justify-between">
              <div>
                <h4 className="mb-1">Appearance</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Light / Dark mode
                </p>
              </div>
              <ThemeToggle />
            </div>
          </Card>

          {/* Change Password */}
          <Card variant="glass" hover={false}>
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5" />
                <span>Change Password</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            {showChangePassword && (
              <div className="mt-4 space-y-3 px-3 pb-3">
                <input
                  type="password"
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-800"
                />

                {passwordMessage && (
                  <p
                    className={`text-sm ${
                      passwordMessage.startsWith('✅')
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {passwordMessage}
                  </p>
                )}

                <Button
                  variant="primary"
                  fullWidth
                  loading={loadingPassword}
                  onClick={handleChangePassword}
                >
                  Update Password
                </Button>
              </div>
            )}
          </Card>

          {/* Logout all devices */}
          <Card variant="glass" hover={false}>
            <button
              onClick={handleLogoutAllDevices}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-orange-500" />
                <span>Logout from all devices</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </Card>
<Card variant="glass" hover={false}>
  <button
    onClick={handleDeleteAccount}
    className="w-full flex items-center justify-between p-3 rounded-xl
               hover:bg-red-50 dark:hover:bg-red-900/20 transition"
  >
    <div className="flex items-center gap-3">
      <Shield className="w-5 h-5 text-red-600" />
      <span className="text-red-600 font-semibold">
        Delete Account Permanently
      </span>
    </div>
    <ChevronRight className="w-5 h-5 text-gray-400" />
  </button>
</Card>

          {/* Logout */}
          <Card variant="glass" hover={false}>
            <button
              onClick={onLogout}
              className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/10"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-600" />
                <span className="text-red-600 font-semibold">Logout</span>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </Card>

          <p className="text-center text-sm text-gray-500">
            Version 1.0.0 • © 2026 Meet My Mate in
          </p>
        </div>
      </ResponsiveContainer>
    </div>
  );
}
