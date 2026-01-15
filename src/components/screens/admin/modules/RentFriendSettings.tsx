import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Save, RotateCcw, Shield, AlertCircle, CheckCircle } from 'lucide-react';
import { PriceControlPanel } from '../../../admin/PriceControlPanel';
import { ResponsiveContainer, PageHeader, Card, Grid } from '../../../ui/ResponsiveContainer';
import { ResponsiveButton } from '../../../ui/ResponsiveButton';

export function RentFriendSettings() {
  const [hasChanges, setHasChanges] = useState(false);

  // Settings State
  const [settings, setSettings] = useState({
    // Eligibility Rules
    minAge: 18,
    maxAge: 65,
    requireVerification: true,
    allowInternational: false,
    
    // Verification Requirements
    requireGovernmentId: true,
    requireAddressProof: true,
    requirePhoneVerification: true,
    requireEmailVerification: true,
    requireBackgroundCheck: false,
    
    // Participation Limits
    maxBookingsPerDay: 3,
    maxBookingsPerWeek: 15,
    minBookingDuration: 1,
    maxBookingDuration: 8,
    maxConcurrentBookings: 2,
    
    // Risk & Safety Controls
    enableGpsTracking: true,
    requireSafetyTraining: true,
    autoSuspendThreshold: 3,
    enableEmergencyButton: true,
    requireMeetingInPublic: true,
    
    // Policy Definitions
    cancellationHours: 24,
    refundPercentage: 100,
    platformCommission: 15,
    securityDeposit: 5000,
    minPayoutAmount: 500,
  });

  const handleSave = () => {
    // Save settings logic
    setHasChanges(false);
    alert('Settings saved successfully');
  };

  const handleRevert = () => {
    // Revert to previous settings
    setHasChanges(false);
  };

  const handlePriceSave = (priceData: any) => {
    console.log('Price updated:', priceData);
    // Here you would typically save to backend/database
    // Create audit log entry
    const auditEntry = {
      timestamp: new Date().toISOString(),
      module: 'Rent-a-Friend',
      action: 'Price Update',
      oldPrice: 2000,
      newPrice: priceData.fixedPrice,
      currency: priceData.currency,
      admin: 'Admin User',
      details: priceData,
    };
    console.log('Audit log:', auditEntry);
  };

  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      {/* Page Header - Responsive */}
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 lg:px-8 py-4 md:py-6">
        <ResponsiveContainer maxWidth="full" padding={false}>
          <PageHeader
            title="Rent-a-Friend — System & Security Settings"
            description="Configure operational rules and safety controls"
            actions={hasChanges && (
              <>
                <ResponsiveButton
                  variant="secondary"
                  icon={<RotateCcw className="w-4 h-4" />}
                  onClick={handleRevert}
                >
                  Revert
                </ResponsiveButton>
                <ResponsiveButton
                  variant="primary"
                  icon={<Save className="w-4 h-4" />}
                  onClick={handleSave}
                >
                  Save Changes
                </ResponsiveButton>
              </>
            )}
          />
        </ResponsiveContainer>
      </div>

      <ResponsiveContainer maxWidth="full" className="py-4 md:py-6 lg:py-8">
        <div className="space-y-6">
          {/* PRICE CONTROL PANEL - ADMIN-LOCKED PRICING */}
          <PriceControlPanel
            moduleName="Rent-a-Friend"
            currentPrice={2000}
            currency="INR"
            onSave={handlePriceSave}
          />

          {/* Eligibility Rules */}
          <Card>
            <h2 className="text-lg text-gray-900 dark:text-white mb-4">Eligibility Rules</h2>
            <Grid columns={2} gap="md">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Minimum Age</label>
                <input
                  type="number"
                  value={settings.minAge}
                  onChange={(e) => updateSetting('minAge', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Maximum Age</label>
                <input
                  type="number"
                  value={settings.maxAge}
                  onChange={(e) => updateSetting('maxAge', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.requireVerification}
                  onChange={(e) => updateSetting('requireVerification', e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Require Verification Before Participation</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.allowInternational}
                  onChange={(e) => updateSetting('allowInternational', e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Allow International Users</label>
              </div>
            </Grid>
          </Card>

          {/* Verification Requirements */}
          <Card>
            <h2 className="text-lg text-gray-900 dark:text-white mb-4">Verification Requirements</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.requireGovernmentId}
                  onChange={(e) => updateSetting('requireGovernmentId', e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Require Government-Issued ID</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.requireAddressProof}
                  onChange={(e) => updateSetting('requireAddressProof', e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Require Address Proof</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.requirePhoneVerification}
                  onChange={(e) => updateSetting('requirePhoneVerification', e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Require Phone Verification</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={(e) => updateSetting('requireEmailVerification', e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Require Email Verification</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.requireBackgroundCheck}
                  onChange={(e) => updateSetting('requireBackgroundCheck', e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Require Background Check (Third-party)</label>
              </div>
            </div>
          </Card>

          {/* Participation Limits */}
          <Card>
            <h2 className="text-lg text-gray-900 dark:text-white mb-4">Participation Limits</h2>
            <Grid columns={2} gap="md">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Max Bookings Per Day</label>
                <input
                  type="number"
                  value={settings.maxBookingsPerDay}
                  onChange={(e) => updateSetting('maxBookingsPerDay', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Max Bookings Per Week</label>
                <input
                  type="number"
                  value={settings.maxBookingsPerWeek}
                  onChange={(e) => updateSetting('maxBookingsPerWeek', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Min Booking Duration (hours)</label>
                <input
                  type="number"
                  value={settings.minBookingDuration}
                  onChange={(e) => updateSetting('minBookingDuration', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Max Booking Duration (hours)</label>
                <input
                  type="number"
                  value={settings.maxBookingDuration}
                  onChange={(e) => updateSetting('maxBookingDuration', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Max Concurrent Bookings</label>
                <input
                  type="number"
                  value={settings.maxConcurrentBookings}
                  onChange={(e) => updateSetting('maxConcurrentBookings', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                />
              </div>
            </Grid>
          </Card>

          {/* Risk & Safety Controls */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
              <h2 className="text-lg text-gray-900 dark:text-white">Risk & Safety Controls</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">Enable GPS Tracking During Bookings</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Track location for safety purposes</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableGpsTracking}
                  onChange={(e) => updateSetting('enableGpsTracking', e.target.checked)}
                  className="w-4 h-4 flex-shrink-0 ml-3"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">Require Safety Training Completion</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Providers must complete safety module</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireSafetyTraining}
                  onChange={(e) => updateSetting('requireSafetyTraining', e.target.checked)}
                  className="w-4 h-4 flex-shrink-0 ml-3"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">Enable Emergency SOS Button</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">In-app emergency contact feature</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableEmergencyButton}
                  onChange={(e) => updateSetting('enableEmergencyButton', e.target.checked)}
                  className="w-4 h-4 flex-shrink-0 ml-3"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
                <div className="flex-1">
                  <p className="text-sm text-gray-900 dark:text-white">Require Meetings in Public Places</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Enforce public meeting locations</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireMeetingInPublic}
                  onChange={(e) => updateSetting('requireMeetingInPublic', e.target.checked)}
                  className="w-4 h-4 flex-shrink-0 ml-3"
                />
              </div>
              <div className="p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Auto-Suspend After X Reports</label>
                <input
                  type="number"
                  value={settings.autoSuspendThreshold}
                  onChange={(e) => updateSetting('autoSuspendThreshold', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-white dark:bg-[#1A1F2E] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                />
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Account suspended automatically after reaching threshold</p>
              </div>
            </div>
          </Card>

          {/* Policy Definitions */}
          <Card>
            <h2 className="text-lg text-gray-900 dark:text-white mb-4">Policy Definitions</h2>
            <Grid columns={2} gap="md">
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Free Cancellation Window (hours)</label>
                <input
                  type="number"
                  value={settings.cancellationHours}
                  onChange={(e) => updateSetting('cancellationHours', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Full Refund Percentage (%)</label>
                <input
                  type="number"
                  value={settings.refundPercentage}
                  onChange={(e) => updateSetting('refundPercentage', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Platform Commission (%)</label>
                <input
                  type="number"
                  value={settings.platformCommission}
                  onChange={(e) => updateSetting('platformCommission', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Provider Security Deposit (₹)</label>
                <input
                  type="number"
                  value={settings.securityDeposit}
                  onChange={(e) => updateSetting('securityDeposit', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                />
              </div>
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Minimum Payout Amount (₹)</label>
                <input
                  type="number"
                  value={settings.minPayoutAmount}
                  onChange={(e) => updateSetting('minPayoutAmount', parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                />
              </div>
            </Grid>
          </Card>

          {/* Warning Banner */}
          <Card className="bg-orange-50 dark:bg-orange-500/10 border-orange-300 dark:border-orange-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-900 dark:text-white mb-1">
                  <strong>Changes Impact Active Operations</strong>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Modifying these settings will affect all active and future bookings. Ensure you review changes carefully before saving.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </ResponsiveContainer>
    </div>
  );
}