import React, { useState } from 'react';
import { Save, RotateCcw, AlertCircle } from 'lucide-react';
import { ConfirmationModal } from '../../../admin/ConfirmationModal';
import { PriceControlPanel } from '../../../admin/PriceControlPanel';

export function P2PMatchSettings() {
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [settings, setSettings] = useState({
    minMeetingDuration: 30,
    maxMeetingDuration: 180,
    platformCommission: 10,
    requireBusinessProfile: true,
    requireLinkedIn: true,
    requireMeetingAgenda: true,
    enableNDA: true,
    cancellationHours: 24,
    refundPercentage: 100,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };

  const handlePriceSave = (priceData: any) => {
    console.log('Price updated:', priceData);
    // Here you would typically save to backend/database
    // Create audit log entry
    const auditEntry = {
      timestamp: new Date().toISOString(),
      module: 'Peer-to-Peer Match',
      action: 'Price Update',
      oldPrice: 5000,
      newPrice: priceData.fixedPrice,
      currency: priceData.currency,
      admin: 'Admin User',
      details: priceData,
    };
    console.log('Audit log:', auditEntry);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-gray-900 dark:text-white">Peer-to-Peer Match — System & Security Settings</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure P2P match parameters and pricing</p>
          </div>
          {hasChanges && (
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          )}
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* PRICE CONTROL PANEL - ADMIN-LOCKED PRICING */}
        <PriceControlPanel
          moduleName="Peer-to-Peer Match"
          currentPrice={5000}
          currency="INR"
          onSave={handlePriceSave}
        />

        {/* Meeting Configuration */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Meeting Configuration</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Min Duration (minutes)</label>
              <input
                type="number"
                value={settings.minMeetingDuration}
                onChange={(e) => updateSetting('minMeetingDuration', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Max Duration (minutes)</label>
              <input
                type="number"
                value={settings.maxMeetingDuration}
                onChange={(e) => updateSetting('maxMeetingDuration', parseInt(e.target.value))}
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
          </div>
        </div>

        {/* Requirements */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Requirements</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.requireBusinessProfile}
                onChange={(e) => updateSetting('requireBusinessProfile', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Require Business Profile</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.requireLinkedIn}
                onChange={(e) => updateSetting('requireLinkedIn', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Require LinkedIn Verification</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.requireMeetingAgenda}
                onChange={(e) => updateSetting('requireMeetingAgenda', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Require Meeting Agenda</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.enableNDA}
                onChange={(e) => updateSetting('enableNDA', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Enable NDA Option</label>
            </div>
          </div>
        </div>

        {/* Financial Settings */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Financial Settings</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Cancellation Window (hours)</label>
              <input
                type="number"
                value={settings.cancellationHours}
                onChange={(e) => updateSetting('cancellationHours', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Refund Percentage (%)</label>
              <input
                type="number"
                value={settings.refundPercentage}
                onChange={(e) => updateSetting('refundPercentage', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {showSaveModal && (
        <ConfirmationModal
          title="Save P2P Settings"
          message="Save configuration changes for Peer-to-Peer Match?"
          consequence="These changes will affect all future P2P matches."
          confirmText="Save Changes"
          confirmStyle="success"
          onConfirm={() => { console.log('Saved'); setShowSaveModal(false); setHasChanges(false); }}
          onCancel={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
}