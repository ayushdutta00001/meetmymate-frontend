import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Mail, TrendingUp, ChevronRight, X, Play, Pause } from 'lucide-react';

interface Automation {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused';
  lastRun: string;
  successRate: number;
  emailsSent: number;
  category: string;
}

export function Automations() {
  const [selectedAutomation, setSelectedAutomation] = useState<Automation | null>(null);

  // Mock data
  const automations: Automation[] = [
    {
      id: 'AUTO-001',
      name: 'Booking Reminder Emails',
      description: 'Sends automated reminders 24 hours before scheduled meetings',
      status: 'active',
      lastRun: '2026-01-06 12:00',
      successRate: 98.5,
      emailsSent: 1247,
      category: 'Reminders'
    },
    {
      id: 'AUTO-002',
      name: 'Provider Digest Emails',
      description: 'Daily summary of new bookings and earnings sent to service providers',
      status: 'active',
      lastRun: '2026-01-06 08:00',
      successRate: 99.2,
      emailsSent: 342,
      category: 'Digests'
    },
    {
      id: 'AUTO-003',
      name: 'Welcome Series',
      description: 'Multi-step onboarding email sequence for new users',
      status: 'active',
      lastRun: '2026-01-06 10:30',
      successRate: 97.8,
      emailsSent: 89,
      category: 'Onboarding'
    },
    {
      id: 'AUTO-004',
      name: 'Review Request Emails',
      description: 'Requests reviews from users after completed meetings',
      status: 'active',
      lastRun: '2026-01-06 14:00',
      successRate: 96.4,
      emailsSent: 523,
      category: 'Engagement'
    },
    {
      id: 'AUTO-005',
      name: 'Payment Confirmations',
      description: 'Instant payment receipts sent after successful transactions',
      status: 'active',
      lastRun: '2026-01-06 15:45',
      successRate: 99.9,
      emailsSent: 678,
      category: 'Transactions'
    },
    {
      id: 'AUTO-006',
      name: 'Inactive User Re-engagement',
      description: 'Win-back campaigns for users who haven\'t booked in 30 days',
      status: 'paused',
      lastRun: '2026-01-05 09:00',
      successRate: 45.2,
      emailsSent: 156,
      category: 'Marketing'
    },
  ];

  const getStatusColor = (status: 'active' | 'paused') => {
    return status === 'active'
      ? 'bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400'
      : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400';
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 95) return 'bg-green-500';
    if (rate >= 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 dark:text-white mb-2">Automations</h1>
        <p className="text-gray-600 dark:text-gray-400">System-generated emails & reminders</p>
      </div>

      {/* Automation Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {automations.map((automation) => (
          <motion.div
            key={automation.id}
            whileHover={{ y: -2 }}
            className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6 cursor-pointer hover:shadow-lg transition-all"
            onClick={() => setSelectedAutomation(automation)}
          >
            {/* Card Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {automation.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {automation.description}
                </p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2 mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(automation.status)}`}>
                {automation.status === 'active' ? (
                  <Play className="w-3 h-3 fill-current" />
                ) : (
                  <Pause className="w-3 h-3" />
                )}
                {automation.status.charAt(0).toUpperCase() + automation.status.slice(1)}
              </span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-400">
                {automation.category}
              </span>
            </div>

            {/* Metrics */}
            <div className="space-y-3 mb-4">
              {/* Last Run */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>Last run</span>
                </div>
                <span className="text-gray-900 dark:text-white">{automation.lastRun}</span>
              </div>

              {/* Emails Sent */}
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4" />
                  <span>Emails sent</span>
                </div>
                <span className="text-gray-900 dark:text-white">{automation.emailsSent.toLocaleString()}</span>
              </div>

              {/* Success Rate */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <TrendingUp className="w-4 h-4" />
                    <span>Success rate</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-medium">{automation.successRate}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getSuccessRateColor(automation.successRate)}`}
                    style={{ width: `${automation.successRate}%` }}
                  />
                </div>
              </div>
            </div>

            {/* View Details Button */}
            <button className="w-full py-2 bg-gray-50 dark:bg-[#0A0F1F] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors">
              View Details
            </button>
          </motion.div>
        ))}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedAutomation && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedAutomation(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#1A1F2E] rounded-2xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                  <div>
                    <h3 className="text-xl text-gray-900 dark:text-white mb-1">
                      {selectedAutomation.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {selectedAutomation.id}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedAutomation(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Description */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Description
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedAutomation.description}</p>
                  </div>

                  {/* Status & Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Status
                      </label>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${getStatusColor(selectedAutomation.status)}`}>
                        {selectedAutomation.status === 'active' ? (
                          <Play className="w-3.5 h-3.5 fill-current" />
                        ) : (
                          <Pause className="w-3.5 h-3.5" />
                        )}
                        {selectedAutomation.status.charAt(0).toUpperCase() + selectedAutomation.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Category
                      </label>
                      <span className="inline-block px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                        {selectedAutomation.category}
                      </span>
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="bg-gray-50 dark:bg-[#0A0F1F] rounded-xl p-4 space-y-4">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">Performance Metrics</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Run</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {selectedAutomation.lastRun}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Emails Sent</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {selectedAutomation.emailsSent.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Success Rate</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">
                          {selectedAutomation.successRate}%
                        </p>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${getSuccessRateColor(selectedAutomation.successRate)}`}
                          style={{ width: `${selectedAutomation.successRate}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 rounded-lg p-4">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>💡 Info:</strong> This automation runs automatically based on system triggers. You can pause it at any time without losing configuration.
                    </p>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex items-center gap-3">
                  <button
                    className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedAutomation.status === 'active'
                        ? 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {selectedAutomation.status === 'active' ? 'Pause Automation' : 'Activate Automation'}
                  </button>
                  <button
                    onClick={() => setSelectedAutomation(null)}
                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
