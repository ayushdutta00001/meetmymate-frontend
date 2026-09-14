import React, { useState } from 'react';
import { Save, RotateCcw, AlertCircle } from 'lucide-react';
import { ConfirmationModal } from '../../../admin/ConfirmationModal';
import { PriceControlPanel } from '../../../admin/PriceControlPanel';

export function BusinessMeetupSettings() {
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [settings, setSettings] = useState({
    // Peer-to-Peer Settings
    p2pMinMeetingDuration: 30,
    p2pMaxMeetingDuration: 180,
    p2pRequireBusinessProfile: true,
    p2pRequireLinkedIn: true,
    p2pPlatformCommission: 10,
    
    // Find Investor Settings
    investorMinInvestmentAmount: 100000,
    investorRequireAccreditation: true,
    investorRequireNDA: true,
    investorRequirePitchDeck: true,
    investorPlatformCommission: 15,
    
    // Find Experienced Settings
    expertMinExperience: 5,
    expertRequireCredentials: true,
    expertRequireReferences: true,
    expertHourlyRateMin: 500,
    expertHourlyRateMax: 50000,
    expertPlatformCommission: 12,
    
    // Common Verification
    requireGovernmentId: true,
    requireBusinessVerification: true,
    requireEmailVerification: true,
    requirePhoneVerification: true,
    
    // Safety & Compliance
    requireNdaSigning: true,
    enableMeetingRecording: false,
    requireVirtualMeetingOption: true,
    requireMeetingAgenda: true,
    autoSuspendThreshold: 2,
    
    // Financial
    cancellationHours: 48,
    refundPercentage: 100,
    lateCancellationPenalty: 25,
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
      module: 'Business Meetup',
      action: 'Price Update',
      oldPrice: 3000,
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
            <h1 className="text-2xl text-gray-900 dark:text-white">Business Meetup — System & Security Settings</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure rules for all business programs</p>
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
          moduleName="Business Meetup"
          currentPrice={3000}
          currency="INR"
          onSave={handlePriceSave}
        />

        {/* Peer-to-Peer Match Settings */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Peer-to-Peer Match Settings</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Min Meeting Duration (minutes)</label>
              <input
                type="number"
                value={settings.p2pMinMeetingDuration}
                onChange={(e) => updateSetting('p2pMinMeetingDuration', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Max Meeting Duration (minutes)</label>
              <input
                type="number"
                value={settings.p2pMaxMeetingDuration}
                onChange={(e) => updateSetting('p2pMaxMeetingDuration', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Platform Commission (%)</label>
              <input
                type="number"
                value={settings.p2pPlatformCommission}
                onChange={(e) => updateSetting('p2pPlatformCommission', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.p2pRequireBusinessProfile}
                  onChange={(e) => updateSetting('p2pRequireBusinessProfile', e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Require Business Profile</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.p2pRequireLinkedIn}
                  onChange={(e) => updateSetting('p2pRequireLinkedIn', e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Require LinkedIn Verification</label>
              </div>
            </div>
          </div>
        </div>

        {/* Find Investor Settings */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Find Investor Settings</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Minimum Investment Amount (₹)</label>
              <input
                type="number"
                value={settings.investorMinInvestmentAmount}
                onChange={(e) => updateSetting('investorMinInvestmentAmount', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Platform Commission (%)</label>
              <input
                type="number"
                value={settings.investorPlatformCommission}
                onChange={(e) => updateSetting('investorPlatformCommission', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.investorRequireAccreditation}
                  onChange={(e) => updateSetting('investorRequireAccreditation', e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Require Investor Accreditation</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.investorRequireNDA}
                  onChange={(e) => updateSetting('investorRequireNDA', e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Require NDA Signing</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.investorRequirePitchDeck}
                  onChange={(e) => updateSetting('investorRequirePitchDeck', e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Require Pitch Deck Upload</label>
              </div>
            </div>
          </div>
        </div>

        {/* Find Experienced People Settings */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Find Experienced People Settings</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Minimum Years of Experience</label>
              <input
                type="number"
                value={settings.expertMinExperience}
                onChange={(e) => updateSetting('expertMinExperience', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Platform Commission (%)</label>
              <input
                type="number"
                value={settings.expertPlatformCommission}
                onChange={(e) => updateSetting('expertPlatformCommission', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Min Hourly Rate (₹)</label>
              <input
                type="number"
                value={settings.expertHourlyRateMin}
                onChange={(e) => updateSetting('expertHourlyRateMin', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Max Hourly Rate (₹)</label>
              <input
                type="number"
                value={settings.expertHourlyRateMax}
                onChange={(e) => updateSetting('expertHourlyRateMax', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div className="space-y-3 col-span-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.expertRequireCredentials}
                  onChange={(e) => updateSetting('expertRequireCredentials', e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Require Professional Credentials Verification</label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={settings.expertRequireReferences}
                  onChange={(e) => updateSetting('expertRequireReferences', e.target.checked)}
                  className="w-4 h-4"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">Require Professional References</label>
              </div>
            </div>
          </div>
        </div>

        {/* Common Verification Requirements */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Common Verification Requirements</h2>
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
                checked={settings.requireBusinessVerification}
                onChange={(e) => updateSetting('requireBusinessVerification', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Require Business Verification (Tax ID/Registration)</label>
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
                checked={settings.requirePhoneVerification}
                onChange={(e) => updateSetting('requirePhoneVerification', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Require Phone Verification</label>
            </div>
          </div>
        </div>

        {/* Safety & Compliance */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Safety & Compliance Controls</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Require NDA Signing for Sensitive Meetings</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Both parties must sign NDA before meeting details shared</p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireNdaSigning}
                onChange={(e) => updateSetting('requireNdaSigning', e.target.checked)}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Enable Optional Meeting Recording</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Allow participants to record meetings (with consent)</p>
              </div>
              <input
                type="checkbox"
                checked={settings.enableMeetingRecording}
                onChange={(e) => updateSetting('enableMeetingRecording', e.target.checked)}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Require Virtual Meeting Option</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Must offer video conferencing as alternative to in-person</p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireVirtualMeetingOption}
                onChange={(e) => updateSetting('requireVirtualMeetingOption', e.target.checked)}
                className="w-4 h-4"
              />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Require Meeting Agenda</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Participants must define agenda before booking confirmed</p>
              </div>
              <input
                type="checkbox"
                checked={settings.requireMeetingAgenda}
                onChange={(e) => updateSetting('requireMeetingAgenda', e.target.checked)}
                className="w-4 h-4"
              />
            </div>
            <div className="p-4 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Auto-Suspend After X Disputes</label>
              <input
                type="number"
                value={settings.autoSuspendThreshold}
                onChange={(e) => updateSetting('autoSuspendThreshold', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-white dark:bg-[#1A1F2E] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
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
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Late Cancellation Penalty (%)</label>
              <input
                type="number"
                value={settings.lateCancellationPenalty}
                onChange={(e) => updateSetting('lateCancellationPenalty', parseInt(e.target.value))}
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
                <strong>Changes Impact All Active Business Programs</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Modifying these settings will affect Peer-to-Peer, Find Investor, and Find Experienced programs. Review carefully before saving.
              </p>
            </div>
          </div>
        </div>
      </div>

      {showSaveModal && (
        <ConfirmationModal
          title="Save Business Settings Changes"
          message="Are you sure you want to save these configuration changes?"
          consequence="These changes will affect all three business programs and all future meetings."
          confirmText="Save Changes"
          confirmStyle="success"
          onConfirm={handleSave}
          onCancel={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
}