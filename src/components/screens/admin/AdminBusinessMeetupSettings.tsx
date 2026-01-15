import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  DollarSign,
  TrendingUp,
  Save,
  RefreshCw,
  AlertCircle,
  Info,
  Percent,
  Calculator,
  Settings,
  CheckCircle,
  Clock,
  Target,
} from 'lucide-react';

interface BusinessMeetupSettings {
  minHourlyRate: number;
  maxHourlyRate: number;
  platformCommissionPercent: number;
  expertEarningPercent: number;
  durationDiscounts: {
    oneHour: number;
    twoHours: number;
    threeHours: number;
    fourPlusHours: number;
  };
  paymentProcessingFee: number;
  minimumBookingDuration: number;
  maximumBookingDuration: number;
  cancellationFeePercent: number;
  expertPayoutSchedule: 'instant' | 'daily' | 'weekly' | 'monthly';
  requireApproval: boolean;
  autoConfirmBookings: boolean;
}

export function AdminBusinessMeetupSettings() {
  const [settings, setSettings] = useState<BusinessMeetupSettings>({
    minHourlyRate: 2000,
    maxHourlyRate: 10000,
    platformCommissionPercent: 25,
    expertEarningPercent: 75,
    durationDiscounts: {
      oneHour: 0,
      twoHours: 5,
      threeHours: 10,
      fourPlusHours: 15,
    },
    paymentProcessingFee: 2.5,
    minimumBookingDuration: 1,
    maximumBookingDuration: 8,
    cancellationFeePercent: 20,
    expertPayoutSchedule: 'weekly',
    requireApproval: true,
    autoConfirmBookings: false,
  });

  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [exampleBooking, setExampleBooking] = useState({
    hourlyRate: 5000,
    duration: 2,
  });

  const calculateBreakdown = () => {
    const hours = exampleBooking.duration;
    const baseAmount = exampleBooking.hourlyRate * hours;
    
    // Apply duration discount
    let discount = 0;
    if (hours === 1) discount = settings.durationDiscounts.oneHour;
    else if (hours === 2) discount = settings.durationDiscounts.twoHours;
    else if (hours === 3) discount = settings.durationDiscounts.threeHours;
    else if (hours >= 4) discount = settings.durationDiscounts.fourPlusHours;
    
    const discountAmount = (baseAmount * discount) / 100;
    const finalAmount = baseAmount - discountAmount;
    
    const platformCommission = (finalAmount * settings.platformCommissionPercent) / 100;
    const paymentFee = (finalAmount * settings.paymentProcessingFee) / 100;
    const expertEarnings = finalAmount - platformCommission - paymentFee;
    
    return {
      baseAmount,
      discount,
      discountAmount,
      finalAmount,
      platformCommission,
      paymentFee,
      expertEarnings,
    };
  };

  const breakdown = calculateBreakdown();

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }, 1000);
  };

  const handleReset = () => {
    setSettings({
      minHourlyRate: 2000,
      maxHourlyRate: 10000,
      platformCommissionPercent: 25,
      expertEarningPercent: 75,
      durationDiscounts: {
        oneHour: 0,
        twoHours: 5,
        threeHours: 10,
        fourPlusHours: 15,
      },
      paymentProcessingFee: 2.5,
      minimumBookingDuration: 1,
      maximumBookingDuration: 8,
      cancellationFeePercent: 20,
      expertPayoutSchedule: 'weekly',
      requireApproval: true,
      autoConfirmBookings: false,
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl mb-2">Business Meetup Financial Settings</h2>
            <p className="text-gray-600">Configure pricing, commissions, and booking policies for expert consultations</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-xl hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Reset to Default
            </button>
            <button
              onClick={handleSave}
              disabled={saveStatus === 'saving'}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {saveStatus === 'saving' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : saveStatus === 'saved' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900 dark:text-blue-200">
            <p className="mb-1">Changes will apply to all new expert bookings immediately. Existing bookings will not be affected.</p>
            <p className="text-xs text-blue-700 dark:text-blue-300">Business Meetup typically has higher rates and commission due to professional expertise.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Hourly Rate Range */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-blue-600" />
              <h3>Hourly Rate Range</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Set minimum and maximum hourly rates for expert consultations</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Minimum Rate (₹/hour)</label>
                <input
                  type="number"
                  value={settings.minHourlyRate}
                  onChange={(e) => setSettings({ ...settings, minHourlyRate: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Maximum Rate (₹/hour)</label>
                <input
                  type="number"
                  value={settings.maxHourlyRate}
                  onChange={(e) => setSettings({ ...settings, maxHourlyRate: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>
            </div>
          </motion.div>

          {/* Commission Structure */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Percent className="w-5 h-5 text-purple-600" />
              <h3>Commission Structure</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Platform commission and expert earnings split</p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">Platform Commission (%)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={settings.platformCommissionPercent}
                    onChange={(e) => {
                      const commission = Number(e.target.value);
                      setSettings({
                        ...settings,
                        platformCommissionPercent: commission,
                        expertEarningPercent: 100 - commission,
                      });
                    }}
                    className="flex-1"
                  />
                  <input
                    type="number"
                    value={settings.platformCommissionPercent}
                    onChange={(e) => {
                      const commission = Number(e.target.value);
                      setSettings({
                        ...settings,
                        platformCommissionPercent: commission,
                        expertEarningPercent: 100 - commission,
                      });
                    }}
                    className="w-20 px-3 py-2 rounded-lg border border-gray-200 text-center"
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-700">Platform Commission</span>
                  <span className="text-lg text-purple-600">{settings.platformCommissionPercent}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-700">Expert Earnings</span>
                  <span className="text-lg text-green-600">{settings.expertEarningPercent}%</span>
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Payment Processing Fee (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={settings.paymentProcessingFee}
                  onChange={(e) => setSettings({ ...settings, paymentProcessingFee: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Gateway charges (typically 2-3%)</p>
              </div>
            </div>
          </motion.div>

          {/* Duration Discounts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-green-600" />
              <h3>Duration Discounts</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Encourage longer consultation sessions with discounts</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-sm">1 Hour Session</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={settings.durationDiscounts.oneHour}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        durationDiscounts: { ...settings.durationDiscounts, oneHour: Number(e.target.value) },
                      })
                    }
                    className="w-16 px-2 py-1 rounded-lg border border-gray-200 text-center"
                  />
                  <span className="text-sm text-gray-600">% off</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-sm">2 Hours Session</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={settings.durationDiscounts.twoHours}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        durationDiscounts: { ...settings.durationDiscounts, twoHours: Number(e.target.value) },
                      })
                    }
                    className="w-16 px-2 py-1 rounded-lg border border-gray-200 text-center"
                  />
                  <span className="text-sm text-gray-600">% off</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-sm">3 Hours Session</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={settings.durationDiscounts.threeHours}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        durationDiscounts: { ...settings.durationDiscounts, threeHours: Number(e.target.value) },
                      })
                    }
                    className="w-16 px-2 py-1 rounded-lg border border-gray-200 text-center"
                  />
                  <span className="text-sm text-gray-600">% off</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <span className="text-sm">4+ Hours Session</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={settings.durationDiscounts.fourPlusHours}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        durationDiscounts: { ...settings.durationDiscounts, fourPlusHours: Number(e.target.value) },
                      })
                    }
                    className="w-16 px-2 py-1 rounded-lg border border-gray-200 text-center"
                  />
                  <span className="text-sm text-gray-600">% off</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Booking Policies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Settings className="w-5 h-5 text-orange-600" />
              <h3>Booking Policies</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Configure booking duration limits and policies</p>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Min Duration (hours)</label>
                  <input
                    type="number"
                    value={settings.minimumBookingDuration}
                    onChange={(e) => setSettings({ ...settings, minimumBookingDuration: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Max Duration (hours)</label>
                  <input
                    type="number"
                    value={settings.maximumBookingDuration}
                    onChange={(e) => setSettings({ ...settings, maximumBookingDuration: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Cancellation Fee (%)</label>
                <input
                  type="number"
                  value={settings.cancellationFeePercent}
                  onChange={(e) => setSettings({ ...settings, cancellationFeePercent: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">Percentage deducted if customer cancels after confirmation</p>
              </div>

              <div>
                <label className="block text-sm mb-2">Expert Payout Schedule</label>
                <select
                  value={settings.expertPayoutSchedule}
                  onChange={(e) => setSettings({ ...settings, expertPayoutSchedule: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-blue-500 transition-all"
                >
                  <option value="instant">Instant (After meeting completion)</option>
                  <option value="daily">Daily (Every 24 hours)</option>
                  <option value="weekly">Weekly (Every 7 days)</option>
                  <option value="monthly">Monthly (Every 30 days)</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all">
                  <input
                    type="checkbox"
                    checked={settings.requireApproval}
                    onChange={(e) => setSettings({ ...settings, requireApproval: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <p className="text-sm">Require Admin Approval</p>
                    <p className="text-xs text-gray-500">All bookings need manual admin confirmation</p>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 cursor-pointer hover:bg-gray-100 transition-all">
                  <input
                    type="checkbox"
                    checked={settings.autoConfirmBookings}
                    onChange={(e) => setSettings({ ...settings, autoConfirmBookings: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <div className="flex-1">
                    <p className="text-sm">Auto-Confirm Bookings</p>
                    <p className="text-xs text-gray-500">Automatically confirm bookings after payment</p>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right Column - Live Calculator */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-2xl shadow-lg p-6 sticky top-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5" />
              <h3>Live Calculator</h3>
            </div>
            <p className="text-sm text-white/80 mb-4">See how settings affect earnings in real-time</p>

            {/* Example Inputs */}
            <div className="space-y-3 mb-6">
              <div>
                <label className="block text-sm mb-2 text-white/90">Hourly Rate (₹)</label>
                <input
                  type="number"
                  value={exampleBooking.hourlyRate}
                  onChange={(e) => setExampleBooking({ ...exampleBooking, hourlyRate: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm mb-2 text-white/90">Duration (hours)</label>
                <select
                  value={exampleBooking.duration}
                  onChange={(e) => setExampleBooking({ ...exampleBooking, duration: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:border-white/50 transition-all"
                >
                  <option value={1} className="text-gray-900">1 hour</option>
                  <option value={2} className="text-gray-900">2 hours</option>
                  <option value={3} className="text-gray-900">3 hours</option>
                  <option value={4} className="text-gray-900">4 hours</option>
                </select>
              </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-3 p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
              <div className="flex items-center justify-between pb-2 border-b border-white/20">
                <span className="text-sm text-white/80">Base Amount</span>
                <span className="text-sm">₹{breakdown.baseAmount.toLocaleString()}</span>
              </div>

              {breakdown.discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Duration Discount ({breakdown.discount}%)</span>
                  <span className="text-sm text-green-300">-₹{breakdown.discountAmount.toLocaleString()}</span>
                </div>
              )}

              <div className="flex items-center justify-between pb-2 border-b border-white/20">
                <span className="text-sm">Customer Pays</span>
                <span className="text-lg">₹{breakdown.finalAmount.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Platform Fee ({settings.platformCommissionPercent}%)</span>
                <span className="text-sm text-red-300">-₹{breakdown.platformCommission.toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-white/80">Payment Fee ({settings.paymentProcessingFee}%)</span>
                <span className="text-sm text-red-300">-₹{breakdown.paymentFee.toFixed(0)}</span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/20">
                <span className="text-sm">Expert Earns</span>
                <span className="text-2xl">₹{Math.round(breakdown.expertEarnings).toLocaleString()}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-white/70">
                <span>Platform Keeps</span>
                <span>₹{Math.round(breakdown.platformCommission + breakdown.paymentFee).toLocaleString()}</span>
              </div>
            </div>

            {/* Warning */}
            <div className="mt-4 p-3 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-100">
                Higher commission (25%) justified by expert verification and quality assurance
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
