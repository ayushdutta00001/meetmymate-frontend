import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { ConfirmationModal } from '../../../admin/ConfirmationModal';
import { PriceControlPanel } from '../../../admin/PriceControlPanel';

export function FindExperiencedSettings() {
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [settings, setSettings] = useState({
    minExperience: 5,
    requireCredentials: true,
    requireReferences: true,
    hourlyRateMin: 500,
    hourlyRateMax: 50000,
    platformCommission: 12,
    cancellationHours: 24,
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
      module: 'Find Experienced People',
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
            <h1 className="text-2xl text-gray-900 dark:text-white">Find Experienced People — System & Security Settings</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure expert consultation parameters</p>
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
          moduleName="Find Experienced People"
          currentPrice={5000}
          currency="INR"
          onSave={handlePriceSave}
        />

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Expert Qualification Requirements</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Minimum Years of Experience</label>
              <input
                type="number"
                value={settings.minExperience}
                onChange={(e) => updateSetting('minExperience', parseInt(e.target.value))}
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
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Min Hourly Rate (₹)</label>
              <input
                type="number"
                value={settings.hourlyRateMin}
                onChange={(e) => updateSetting('hourlyRateMin', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Max Hourly Rate (₹)</label>
              <input
                type="number"
                value={settings.hourlyRateMax}
                onChange={(e) => updateSetting('hourlyRateMax', parseInt(e.target.value))}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Verification Requirements</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.requireCredentials}
                onChange={(e) => updateSetting('requireCredentials', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Require Professional Credentials</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.requireReferences}
                onChange={(e) => updateSetting('requireReferences', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Require Professional References</label>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Financial Settings</h2>
          <div>
            <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Cancellation Window (hours)</label>
            <input
              type="number"
              value={settings.cancellationHours}
              onChange={(e) => updateSetting('cancellationHours', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-300 dark:border-orange-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            <p className="text-sm text-gray-900 dark:text-white">
              Changes will affect all future expert consultations and expert approval process.
            </p>
          </div>
        </div>
      </div>

      {showSaveModal && (
        <ConfirmationModal
          title="Save Expert Settings"
          message="Save configuration changes for Find Experienced People?"
          confirmText="Save Changes"
          confirmStyle="success"
          onConfirm={() => { setShowSaveModal(false); setHasChanges(false); }}
          onCancel={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
}