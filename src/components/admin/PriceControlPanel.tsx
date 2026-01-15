import React, { useState } from 'react';
import { DollarSign, Lock, Eye, EyeOff, Save, AlertCircle, CheckCircle, FileText } from 'lucide-react';

interface PriceControlPanelProps {
  moduleName: string;
  currentPrice: number;
  currency: string;
  onSave: (priceData: PriceData) => void;
}

interface PriceData {
  fixedPrice: number;
  currency: string;
  platformCommission: number;
  showPriceToUsers: boolean;
  showPriceBreakdown: boolean;
  allowUserProviderPricing: boolean;
}

export function PriceControlPanel({ moduleName, currentPrice, currency, onSave }: PriceControlPanelProps) {
  const [priceData, setPriceData] = useState<PriceData>({
    fixedPrice: currentPrice,
    currency: currency,
    platformCommission: 15,
    showPriceToUsers: true,
    showPriceBreakdown: false,
    allowUserProviderPricing: false,
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isDirty, setIsDirty] = useState(false);

  const validatePrice = (value: number): string | null => {
    if (!value || value === 0) {
      return 'Price cannot be empty or zero';
    }
    if (value < 0) {
      return 'Price cannot be negative';
    }
    if (isNaN(value)) {
      return 'Price must be a valid number';
    }
    return null;
  };

  const validateCommission = (value: number): string | null => {
    if (value < 0 || value > 100) {
      return 'Commission must be between 0% and 100%';
    }
    if (isNaN(value)) {
      return 'Commission must be a valid number';
    }
    return null;
  };

  const handlePriceChange = (value: string) => {
    const numValue = parseFloat(value);
    const error = validatePrice(numValue);
    
    setErrors({ ...errors, fixedPrice: error || '' });
    setPriceData({ ...priceData, fixedPrice: numValue });
    setIsDirty(true);
  };

  const handleCommissionChange = (value: string) => {
    const numValue = parseFloat(value);
    const error = validateCommission(numValue);
    
    setErrors({ ...errors, platformCommission: error || '' });
    setPriceData({ ...priceData, platformCommission: numValue });
    setIsDirty(true);
  };

  const handleSave = () => {
    // Validate all fields
    const priceError = validatePrice(priceData.fixedPrice);
    const commissionError = validateCommission(priceData.platformCommission);

    if (priceError || commissionError) {
      setErrors({
        fixedPrice: priceError || '',
        platformCommission: commissionError || '',
      });
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSave = () => {
    onSave(priceData);
    setShowConfirmation(false);
    setIsDirty(false);
  };

  const calculateBreakdown = () => {
    const basePrice = priceData.fixedPrice;
    const commission = (basePrice * priceData.platformCommission) / 100;
    const taxes = basePrice * 0.18; // Example 18% tax
    const total = basePrice + commission + taxes;

    return { basePrice, commission, taxes, total };
  };

  const breakdown = calculateBreakdown();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            Fixed Price Control — {moduleName}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Admin-only pricing control. Users and providers cannot modify this price.
          </p>
        </div>
        {isDirty && (
          <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-3 py-1 rounded-full">
            Unsaved Changes
          </span>
        )}
      </div>

      {/* Price Control Card */}
      <div className="bg-white dark:bg-[#1A1F2E] border border-gray-200 dark:border-gray-700 rounded-lg p-6">
        <div className="grid grid-cols-2 gap-6">
          {/* Fixed Service Price */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Fixed Service Price *
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
                <DollarSign className="w-5 h-5" />
              </div>
              <input
                type="number"
                value={priceData.fixedPrice}
                onChange={(e) => handlePriceChange(e.target.value)}
                className={`
                  w-full pl-11 pr-4 py-2.5 
                  bg-gray-50 dark:bg-[#0A0F1F] 
                  border ${errors.fixedPrice ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
                  rounded-lg text-sm
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  text-gray-900 dark:text-white
                `}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            {errors.fixedPrice && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.fixedPrice}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This is the exact price users will pay for this service.
            </p>
          </div>

          {/* Currency Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Currency
            </label>
            <select
              value={priceData.currency}
              onChange={(e) => {
                setPriceData({ ...priceData, currency: e.target.value });
                setIsDirty(true);
              }}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
            >
              <option value="USD">USD ($)</option>
              <option value="INR">INR (₹)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Select the currency for pricing display.
            </p>
          </div>

          {/* Platform Commission */}
          <div>
            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Platform Commission %
            </label>
            <input
              type="number"
              value={priceData.platformCommission}
              onChange={(e) => handleCommissionChange(e.target.value)}
              className={`
                w-full px-4 py-2.5 
                bg-gray-50 dark:bg-[#0A0F1F] 
                border ${errors.platformCommission ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
                rounded-lg text-sm
                focus:outline-none focus:ring-2 focus:ring-blue-500
                text-gray-900 dark:text-white
              `}
              placeholder="15"
              min="0"
              max="100"
              step="0.1"
            />
            {errors.platformCommission && (
              <p className="text-xs text-red-600 dark:text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {errors.platformCommission}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Platform fee as a percentage of the base price.
            </p>
          </div>

          {/* Empty space for alignment */}
          <div></div>
        </div>

        {/* Toggles Section */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {/* Show Price to Users */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">
                  Show Price to Users
                </label>
                {priceData.showPriceToUsers ? (
                  <Eye className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <EyeOff className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Display the price in the user-facing portal.
              </p>
            </div>
            <button
              onClick={() => {
                setPriceData({ ...priceData, showPriceToUsers: !priceData.showPriceToUsers });
                setIsDirty(true);
              }}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${priceData.showPriceToUsers ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
              `}
            >
              <span
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                  ${priceData.showPriceToUsers ? 'translate-x-6' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* Show Price Breakdown */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-900 dark:text-white">
                Show Price Breakdown to Users
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Display detailed price breakdown (base + commission + taxes).
              </p>
            </div>
            <button
              onClick={() => {
                setPriceData({ ...priceData, showPriceBreakdown: !priceData.showPriceBreakdown });
                setIsDirty(true);
              }}
              disabled={!priceData.showPriceToUsers}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${priceData.showPriceBreakdown && priceData.showPriceToUsers ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'}
                ${!priceData.showPriceToUsers ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              <span
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                  ${priceData.showPriceBreakdown && priceData.showPriceToUsers ? 'translate-x-6' : 'translate-x-0'}
                `}
              />
            </button>
          </div>

          {/* CRITICAL: Allow User/Provider Pricing */}
          <div className="flex items-center justify-between p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border-l-4 border-red-500">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-red-600 dark:text-red-400" />
                <label className="text-sm font-semibold text-red-900 dark:text-red-300">
                  Allow Users or Providers to Set Prices
                </label>
              </div>
              <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                <strong>DANGER:</strong> When OFF (recommended), only admin controls pricing. When ON, users/providers can override.
              </p>
            </div>
            <button
              onClick={() => {
                setPriceData({ ...priceData, allowUserProviderPricing: !priceData.allowUserProviderPricing });
                setIsDirty(true);
              }}
              className={`
                relative w-12 h-6 rounded-full transition-colors
                ${priceData.allowUserProviderPricing ? 'bg-red-600' : 'bg-gray-300 dark:bg-gray-600'}
              `}
            >
              <span
                className={`
                  absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform
                  ${priceData.allowUserProviderPricing ? 'translate-x-6' : 'translate-x-0'}
                `}
              />
            </button>
          </div>
        </div>

        {/* Price Breakdown Preview */}
        {priceData.showPriceBreakdown && (
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
              Price Breakdown Preview (User View)
            </h3>
            <div className="bg-gray-50 dark:bg-[#0A0F1F] rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Base Price</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {priceData.currency === 'INR' ? '₹' : '$'}{breakdown.basePrice.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Platform Fee ({priceData.platformCommission}%)
                </span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {priceData.currency === 'INR' ? '₹' : '$'}{breakdown.commission.toFixed(2)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Taxes (18%)</span>
                <span className="text-gray-900 dark:text-white font-medium">
                  {priceData.currency === 'INR' ? '₹' : '$'}{breakdown.taxes.toFixed(2)}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">Total</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {priceData.currency === 'INR' ? '₹' : '$'}{breakdown.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="mt-6 flex items-center justify-end gap-4">
          <button
            onClick={() => {
              setPriceData({
                fixedPrice: currentPrice,
                currency: currency,
                platformCommission: 15,
                showPriceToUsers: true,
                showPriceBreakdown: false,
                allowUserProviderPricing: false,
              });
              setIsDirty(false);
              setErrors({});
            }}
            className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            disabled={!isDirty}
          >
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!isDirty || Object.values(errors).some((e) => e)}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
          >
            <Save className="w-4 h-4" />
            Save Price Changes
          </button>
        </div>
      </div>

      {/* Current Status */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Current Pricing Status
            </h4>
            <div className="mt-2 text-xs text-blue-800 dark:text-blue-200 space-y-1">
              <p>✓ Fixed price: <strong>{priceData.currency === 'INR' ? '₹' : '$'}{priceData.fixedPrice}</strong></p>
              <p>✓ Admin-controlled: <strong>{priceData.allowUserProviderPricing ? 'NO (Users can override)' : 'YES (Locked)'}</strong></p>
              <p>✓ Visible to users: <strong>{priceData.showPriceToUsers ? 'Yes' : 'No'}</strong></p>
              <p>✓ Breakdown shown: <strong>{priceData.showPriceBreakdown ? 'Yes' : 'No'}</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-[#1A1F2E] rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200 dark:border-gray-700">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Confirm Price Change
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This will take effect immediately
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-[#0A0F1F] rounded-lg p-4 space-y-2 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Module</span>
                  <span className="text-gray-900 dark:text-white font-medium">{moduleName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Old Price</span>
                  <span className="text-gray-500 dark:text-gray-400 line-through">
                    {currency === 'INR' ? '₹' : '$'}{currentPrice}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">New Price</span>
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">
                    {priceData.currency === 'INR' ? '₹' : '$'}{priceData.fixedPrice}
                  </span>
                </div>
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    <strong>Effective:</strong> Immediately upon confirmation
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    <strong>Logged:</strong> This change will be recorded in audit logs
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="flex-1 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSave}
                  className="flex-1 px-4 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Confirm & Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
