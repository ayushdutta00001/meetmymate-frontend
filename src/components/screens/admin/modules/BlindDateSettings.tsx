import React, { useState } from 'react';
import { Save, RotateCcw, Shield, AlertCircle } from 'lucide-react';
import { ConfirmationModal } from '../../../admin/ConfirmationModal';
import { PriceControlPanel } from '../../../admin/PriceControlPanel';

export function BlindDateSettings() {
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [settings, setSettings] = useState({
    minAge: 21,
    maxAge: 60,
    requireVerification: true,
    allowInternational: false,
    
    requireGovernmentId: true,
    requirePhoneVerification: true,
    requireEmailVerification: true,
    requirePhotoVerification: true,
    requireBackgroundCheck: true,
    
    maxDatesPerWeek: 5,
    minTimeBetweenDates: 2,
    enableMatchScoring: true,
    minimumMatchScore: 70,
    
    enableGpsTracking: true,
    requireSafetyAcknowledgement: true,
    enableEmergencyButton: true,
    requirePublicVenue: true,
    autoSuspendThreshold: 2,
    
    cancellationHours: 24,
    refundPercentage: 100,
    platformCommission: 15,
    matchMakingFee: 500,
  });

  const handleSave = () => {
    console.log('Settings saved:', settings);
    setHasChanges(false);
    setShowSaveModal(false);
  };

  const handleRevert = () => {
    setHasChanges(false);
  };

  const handlePriceSave = (priceData: any) => {
    console.log('Price updated:', priceData);
    // Here you would typically save to backend/database
    // Create audit log entry
    const auditEntry = {
      timestamp: new Date().toISOString(),
      module: 'Blind Date',
      action: 'Price Update',
      oldPrice: 1500,
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
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-gray-900 dark:text-white">Blind Date — System & Security Settings</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure matching rules and safety controls</p>
          </div>
          {hasChanges && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleRevert}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200"
              >
                <RotateCcw className="w-4 h-4" />
                Revert Changes
              </button>
              <button
                onClick={() => setShowSaveModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* PRICE CONTROL PANEL - ADMIN-LOCKED PRICING */}
        <PriceControlPanel
          moduleName="Blind Date"
          currentPrice={1500}
          currency="INR"
          onSave={handlePriceSave}
        />

        {/* Eligibility Criteria */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Eligibility Criteria</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Minimum Age</label>
              <input
                type="number"
                value={settings.minAge}
                onChange={(e) => updateSetting('minAge', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Maximum Age</label>
              <input
                type="number"
                value={settings.maxAge}
                onChange={(e) => updateSetting('maxAge', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.requireVerification}
                onChange={(e) => updateSetting('requireVerification', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Require Full Verification Before Matching</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.allowInternational}
                onChange={(e) => updateSetting('allowInternational', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Allow International Matches</label>
            </div>
          </div>
        </div>

        {/* Verification Requirements */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
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
                checked={settings.requirePhotoVerification}
                onChange={(e) => updateSetting('requirePhotoVerification', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Require Photo Verification (Face Match)</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.requireBackgroundCheck}
                onChange={(e) => updateSetting('requireBackgroundCheck', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Require Background Check</label>
            </div>
          </div>
        </div>

        {/* Matching Rules */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Matching Rules</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Max Dates Per Week</label>
              <input
                type="number"
                value={settings.maxDatesPerWeek}
                onChange={(e) => updateSetting('maxDatesPerWeek', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Min Hours Between Dates</label>
              <input
                type="number"
                value={settings.minTimeBetweenDates}
                onChange={(e) => updateSetting('minTimeBetweenDates', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Minimum Match Score (%)</label>
              <input
                type="number"
                value={settings.minimumMatchScore}
                onChange={(e) => updateSetting('minimumMatchScore', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div className="flex items-center gap-3 pt-8">
              <input
                type="checkbox"
                checked={settings.enableMatchScoring}
                onChange={(e) => updateSetting('enableMatchScoring', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Enable AI Match Scoring</label>
            </div>
          </div>
        </div>

        {/* Safety & Security */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-red-600 dark:text-red-400" />
            <h2 className="text-lg text-gray-900 dark:text-white">Safety & Security Controls</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Enable GPS Location Tracking During Dates</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Track both parties' locations for safety</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableGpsTracking}
                onChange={(e) => updateSetting('enableGpsTracking', e.target.checked)}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Require Safety Acknowledgement</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Users must read safety guidelines before matching</p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireSafetyAcknowledgement}
                onChange={(e) => updateSetting('requireSafetyAcknowledgement', e.target.checked)}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Enable In-App Emergency SOS Button</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Quick access to emergency services during date</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableEmergencyButton}
                onChange={(e) => updateSetting('enableEmergencyButton', e.target.checked)}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Require Public Venue Selection</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Dates must occur at pre-approved public venues</p>
              </div>
              <input
                type="checkbox"
                checked={settings.requirePublicVenue}
                onChange={(e) => updateSetting('requirePublicVenue', e.target.checked)}
                className="w-4 h-4"
              />
            </div>
            <div className="p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Auto-Suspend After X Reports</label>
              <input
                type="number"
                value={settings.autoSuspendThreshold}
                onChange={(e) => updateSetting('autoSuspendThreshold', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#1A1F2E] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Account automatically suspended after reaching threshold</p>
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Financial Settings</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Free Cancellation Window (hours)</label>
              <input
                type="number"
                value={settings.cancellationHours}
                onChange={(e) => updateSetting('cancellationHours', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Full Refund Percentage (%)</label>
              <input
                type="number"
                value={settings.refundPercentage}
                onChange={(e) => updateSetting('refundPercentage', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Platform Commission (%)</label>
              <input
                type="number"
                value={settings.platformCommission}
                onChange={(e) => updateSetting('platformCommission', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Matchmaking Fee (₹)</label>
              <input
                type="number"
                value={settings.matchMakingFee}
                onChange={(e) => updateSetting('matchMakingFee', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-300 dark:border-orange-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-900 dark:text-white mb-1">
                <strong>Changes Impact All Active Matches</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Modifying these settings will affect all current and future matches. Review carefully before saving.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showSaveModal && (
        <ConfirmationModal
          title="Save Settings Changes"
          message="Are you sure you want to save these configuration changes?"
          consequence="These changes will affect all future blind date matches and operations."
          confirmText="Save Changes"
          confirmStyle="success"
          onConfirm={handleSave}
          onCancel={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
}