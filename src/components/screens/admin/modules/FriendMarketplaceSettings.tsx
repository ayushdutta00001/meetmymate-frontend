import React, { useState } from 'react';
import { Save, Percent, Clock, Ban, Shield } from 'lucide-react';

export function FriendMarketplaceSettings() {
  const [settings, setSettings] = useState({
    commissionPercentage: 20,
    minBookingDuration: 2,
    maxBookingDuration: 8,
    advanceBookingHours: 24,
    cancellationHours: 6,
    autoApproveProviders: false,
    requireVerification: true,
    allowSameDayBooking: false,
  });

  const handleSave = () => {
    alert('Settings saved successfully!');
  };

  const handleChange = (field: string, value: any) => {
    setSettings({ ...settings, [field]: value });
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Platform Settings</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Configure platform rules, commission, and policies
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {/* Commission Settings */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <Percent className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg text-gray-900 dark:text-white">Commission Settings</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Platform fee and revenue split</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Platform Commission Percentage
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={settings.commissionPercentage}
                  onChange={(e) => handleChange('commissionPercentage', parseInt(e.target.value))}
                  className="w-32 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">%</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Provider receives {100 - settings.commissionPercentage}% of booking amount
              </p>
            </div>
          </div>
        </div>

        {/* Booking Rules */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h2 className="text-lg text-gray-900 dark:text-white">Booking Rules</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Duration and timing constraints</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Minimum Booking Duration
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={settings.minBookingDuration}
                    onChange={(e) => handleChange('minBookingDuration', parseInt(e.target.value))}
                    className="w-24 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">hours</span>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                  Maximum Booking Duration
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    value={settings.maxBookingDuration}
                    onChange={(e) => handleChange('maxBookingDuration', parseInt(e.target.value))}
                    className="w-24 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">hours</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Advance Booking Required
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={settings.advanceBookingHours}
                  onChange={(e) => handleChange('advanceBookingHours', parseInt(e.target.value))}
                  className="w-24 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">hours before</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Customers must book at least {settings.advanceBookingHours} hours in advance
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <input
                type="checkbox"
                id="sameDayBooking"
                checked={settings.allowSameDayBooking}
                onChange={(e) => handleChange('allowSameDayBooking', e.target.checked)}
                className="w-5 h-5 text-blue-600 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="sameDayBooking" className="flex-1 text-sm text-gray-900 dark:text-white cursor-pointer">
                Allow same-day bookings
              </label>
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center">
              <Ban className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg text-gray-900 dark:text-white">Cancellation Policy</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Refund and cancellation rules</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                Free Cancellation Window
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  value={settings.cancellationHours}
                  onChange={(e) => handleChange('cancellationHours', parseInt(e.target.value))}
                  className="w-24 px-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">hours before booking</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Full refund if cancelled at least {settings.cancellationHours} hours before
              </p>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-500/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-sm text-yellow-800 dark:text-yellow-400">
                <strong>Policy:</strong> Cancellations made less than {settings.cancellationHours} hours before the booking will be charged a 50% fee
              </p>
            </div>
          </div>
        </div>

        {/* Provider Verification */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg text-gray-900 dark:text-white">Provider Verification</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">Onboarding and approval settings</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <input
                type="checkbox"
                id="autoApprove"
                checked={settings.autoApproveProviders}
                onChange={(e) => handleChange('autoApproveProviders', e.target.checked)}
                className="w-5 h-5 text-blue-600 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="autoApprove" className="flex-1 text-sm text-gray-900 dark:text-white cursor-pointer">
                Auto-approve provider applications
              </label>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
              <input
                type="checkbox"
                id="requireVerification"
                checked={settings.requireVerification}
                onChange={(e) => handleChange('requireVerification', e.target.checked)}
                className="w-5 h-5 text-blue-600 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 rounded focus:ring-2 focus:ring-blue-500"
              />
              <label htmlFor="requireVerification" className="flex-1 text-sm text-gray-900 dark:text-white cursor-pointer">
                Require identity verification documents
              </label>
            </div>

            {!settings.autoApproveProviders && (
              <div className="p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  <strong>Manual Review:</strong> All provider applications require admin approval before activation
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end pt-6 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={handleSave}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
