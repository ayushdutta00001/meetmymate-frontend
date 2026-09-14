import React, { useState, useEffect } from 'react';
import { api } from '../../../../lib/api';

import { motion } from 'motion/react';
import { Settings, Save, DollarSign, Clock, MapPin, Lock } from 'lucide-react';

export function BlindDateSettings() {
  const [hasChanges, setHasChanges] = useState(false);
const [settings, setSettings] = useState({
  price: 999,
  autoFlagHours: 24,
  highRiskHours: 48,
  autoRefundHours: 96,
  requireEmail: true,
  requirePhone: true,
  allowMultiBookings: false,
  hideUserUntilConfirmed: true,
  emailNotifications: true,
});
const loadSettings = async () => {
  try {
    const res = await api.get<any>('admin_get_service_settings');

    console.log('SERVICE SETTINGS:', res);

    if (!res.success) return;

    const s = res.data;

    setSettings({
      price: s.blind_date_price ?? 999,
      autoFlagHours: s.auto_flag_hours ?? 24,
      highRiskHours: s.high_risk_hours ?? 48,
      autoRefundHours: s.auto_refund_hours ?? 96,
      requireEmail: s.require_email ?? true,
      requirePhone: s.require_phone ?? true,
      allowMultiBookings: s.allow_multi_bookings ?? false,
      hideUserUntilConfirmed: s.hide_user_until_confirmed ?? true,
      emailNotifications: s.email_notifications ?? true,
    });

  } catch (err) {
    console.error(err);
  }
};
useEffect(() => {
  loadSettings();
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl lg:text-3xl text-white mb-2" style={{ fontWeight: 700 }}>
                System & Security Settings
              </h1>
              <p className="text-sm text-gray-400">Configure blind date service parameters</p>
            </div>
            {hasChanges && (
             <button
  onClick={async () => {
    const res = await api.post('admin_update_service_settings', {
      blind_date_price: settings.price,
      auto_flag_hours: settings.autoFlagHours,
      high_risk_hours: settings.highRiskHours,
      auto_refund_hours: settings.autoRefundHours,
      require_email: settings.requireEmail,
      require_phone: settings.requirePhone,
      allow_multi_bookings: settings.allowMultiBookings,
      hide_user_until_confirmed: settings.hideUserUntilConfirmed,
      email_notifications: settings.emailNotifications
    });

    console.log('SETTINGS SAVED:', res);

    setHasChanges(false);
  }}
  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl"
>
  <Save className="w-5 h-5" />
  Save Changes
</button>

            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Pricing Configuration */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-blue-500/20">
              <DollarSign className="w-6 h-6 text-blue-400" />
            </div>
            <h2 className="text-xl text-white" style={{ fontWeight: 700 }}>
              Pricing Configuration
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2" style={{ fontWeight: 500 }}>
                Fixed Blind Date Price
              </label>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                  <input
                    type="number"
                    value={settings.price}

                    disabled
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white outline-none opacity-60 cursor-not-allowed"
                  />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-300 text-sm rounded-xl border border-blue-500/30">
                  <Lock className="w-4 h-4" />
                  <span style={{ fontWeight: 600 }}>Locked</span>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">This is a fixed-price service. Price cannot be modified.</p>
            </div>
          </div>
        </div>

        {/* Operational Settings */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-indigo-500/20">
              <Settings className="w-6 h-6 text-indigo-400" />
            </div>
            <h2 className="text-xl text-white" style={{ fontWeight: 700 }}>
              Operational Settings
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm text-gray-400 mb-2" style={{ fontWeight: 500 }}>
                Auto-Flag Threshold (Hours)
              </label>
              <input
  type="number"
  value={settings.autoFlagHours}
  onChange={(e) => {
    setHasChanges(true);
    setSettings(prev => ({
      ...prev,
      autoFlagHours: Number(e.target.value)
    }));
  }}
  className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white"
/>

              <p className="text-xs text-gray-500 mt-2">
                Automatically flag bookings as "Delayed" after this many hours in holding status
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2" style={{ fontWeight: 500 }}>
                High Risk Threshold (Hours)
              </label>
              <input
                type="number"
                value={settings.highRiskHours}

                onChange={(e) => {
  setHasChanges(true);
  setSettings(prev => ({
    ...prev,
    highRiskHours: Number(e.target.value)
  }));
}}

                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                Flag bookings as "High Risk" after this many hours without arrangement
              </p>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2" style={{ fontWeight: 500 }}>
                Auto-Refund Threshold (Hours)
              </label>
              <input
                type="number"
                value={settings.autoRefundHours}

               onChange={(e) => {
  setHasChanges(true);
  setSettings(prev => ({
    ...prev,
    autoRefundHours: Number(e.target.value)
  }));
}}

                className="w-full px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                Suggest automatic refund after this many hours without successful arrangement
              </p>
            </div>
          </div>
        </div>

        {/* Booking Rules */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-green-500/20">
              <Clock className="w-6 h-6 text-green-400" />
            </div>
            <h2 className="text-xl text-white" style={{ fontWeight: 700 }}>
              Booking Rules
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700/30">
              <div>
                <p className="text-sm text-white mb-1" style={{ fontWeight: 600 }}>
                  Require Email Verification
                </p>
                <p className="text-xs text-gray-500">Users must verify email before booking</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
  type="checkbox"
  checked={settings.requireEmail}
  onChange={(e) => {
    setHasChanges(true);
    setSettings(prev => ({
      ...prev,
      requireEmail: e.target.checked
    }));
  }}
  className="sr-only peer"
/>

                <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700/30">
              <div>
                <p className="text-sm text-white mb-1" style={{ fontWeight: 600 }}>
                  Require Phone Verification
                </p>
                <p className="text-xs text-gray-500">Users must verify phone before booking</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
  type="checkbox"
  checked={settings.requirePhone}
  onChange={(e) => {
    setHasChanges(true);
    setSettings(prev => ({
      ...prev,
      requirePhone: e.target.checked
    }));
  }}
  className="sr-only peer"
/>

                <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700/30">
              <div>
                <p className="text-sm text-white mb-1" style={{ fontWeight: 600 }}>
                  Allow Multiple Active Bookings
                </p>
                <p className="text-xs text-gray-500">Users can have multiple simultaneous bookings</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
  type="checkbox"
  checked={settings.allowMultiBookings}
  onChange={(e) => {
    setHasChanges(true);
    setSettings(prev => ({
      ...prev,
      allowMultiBookings: e.target.checked
    }));
  }}
  className="sr-only peer"
/>

                <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-red-500/20">
              <Lock className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-xl text-white" style={{ fontWeight: 700 }}>
              Security & Privacy
            </h2>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700/30">
              <div>
                <p className="text-sm text-white mb-1" style={{ fontWeight: 600 }}>
                  Hide User Details Until Confirmed
                </p>
                <p className="text-xs text-gray-500">Keep personal info private until meeting is arranged</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
               <input
  type="checkbox"
  checked={settings.hideUserUntilConfirmed}
  onChange={(e) => {
    setHasChanges(true);
    setSettings(prev => ({
      ...prev,
      hideUserUntilConfirmed: e.target.checked
    }));
  }}
  className="sr-only peer"
/>

                <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700/30">
              <div>
                <p className="text-sm text-white mb-1" style={{ fontWeight: 600 }}>
                  Send Email Notifications
                </p>
                <p className="text-xs text-gray-500">Notify users of booking status changes</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
  type="checkbox"
  checked={settings.emailNotifications}
  onChange={(e) => {
    setHasChanges(true);
    setSettings(prev => ({
      ...prev,
      emailNotifications: e.target.checked
    }));
  }}
  className="sr-only peer"
/>

                <div className="w-14 h-7 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
