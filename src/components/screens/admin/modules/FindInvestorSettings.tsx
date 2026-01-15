import React, { useState } from 'react';
import { Save, AlertCircle } from 'lucide-react';
import { ConfirmationModal } from '../../../admin/ConfirmationModal';
import { PriceControlPanel } from '../../../admin/PriceControlPanel';

export function FindInvestorSettings() {
  const [hasChanges, setHasChanges] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);

  const [settings, setSettings] = useState({
    minInvestmentAmount: 100000,
    requireAccreditation: true,
    requireNDA: true,
    requirePitchDeck: true,
    platformCommission: 15,
    cancellationHours: 48,
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
      module: 'Find Investor',
      action: 'Price Update',
      oldPrice: 10000,
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
            <h1 className="text-2xl text-gray-900 dark:text-white">Find Investor — System & Security Settings</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Configure investor matching parameters</p>
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
          moduleName="Find Investor"
          currentPrice={10000}
          currency="INR"
          onSave={handlePriceSave}
        />

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Investment Parameters</h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Minimum Investment Amount (₹)</label>
              <input
                type="number"
                value={settings.minInvestmentAmount}
                onChange={(e) => updateSetting('minInvestmentAmount', parseInt(e.target.value))}
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

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Requirements</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.requireAccreditation}
                onChange={(e) => updateSetting('requireAccreditation', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Require Investor Accreditation</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.requireNDA}
                onChange={(e) => updateSetting('requireNDA', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Require NDA Signing</label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.requirePitchDeck}
                onChange={(e) => updateSetting('requirePitchDeck', e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">Require Pitch Deck Upload</label>
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
      </div>

      {showSaveModal && (
        <ConfirmationModal
          title="Save Investor Settings"
          message="Save configuration changes for Find Investor?"
          confirmText="Save Changes"
          confirmStyle="success"
          onConfirm={() => { setShowSaveModal(false); setHasChanges(false); }}
          onCancel={() => setShowSaveModal(false)}
        />
      )}
    </div>
  );
}