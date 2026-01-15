import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  DollarSign, 
  AlertTriangle, 
  Ban,
  TrendingUp,
  TrendingDown,
  Activity,
  FileText,
  Shield
} from 'lucide-react';

export function AdminDashboardMain() {
  // Governance Metrics
  const metrics = [
    { label: 'Total Users', value: '12,543', change: '+12.5%', isUp: true, icon: Users, color: 'blue' },
    { label: 'Active Providers', value: '1,234', change: '+8.2%', isUp: true, icon: UserCheck, color: 'green' },
    { label: 'Active Bookings', value: '8,456', change: '+15.3%', isUp: true, icon: Calendar, color: 'purple' },
    { label: 'Pending Payouts', value: '₹456K', change: '23 requests', isUp: false, icon: DollarSign, color: 'orange' },
    { label: 'Open Disputes', value: '12', change: '3 new', isUp: false, icon: AlertTriangle, color: 'red' },
    { label: 'Suspended Accounts', value: '34', change: '5 this week', isUp: false, icon: Ban, color: 'gray' },
  ];

  // Financial Summary
  const financialData = {
    revenue: '₹2.5M',
    refunds: '₹125K',
    netIncome: '₹2.375M',
  };

  // Risk Alerts
  const riskAlerts = [
    { id: 1, severity: 'high', module: 'Rent-a-Friend', message: 'Multiple reports on provider ID #4521', time: '5 min ago' },
    { id: 2, severity: 'medium', module: 'Business Meetup', message: 'Unusual payout request pattern detected', time: '23 min ago' },
    { id: 3, severity: 'low', module: 'Blind Date', message: 'Provider verification pending over 48 hours', time: '1 hour ago' },
  ];

  // Recent Admin Actions
  const recentActions = [
    { id: 1, admin: 'Admin A', action: 'Suspended user #8821', module: 'Rent-a-Friend', time: '10 min ago' },
    { id: 2, admin: 'Admin B', action: 'Approved payout ₹15,000', module: 'Business Meetup', time: '25 min ago' },
    { id: 3, admin: 'Admin A', action: 'Resolved dispute case #D-1024', module: 'Blind Date', time: '45 min ago' },
    { id: 4, admin: 'Admin C', action: 'Verified new provider', module: 'Find Experienced', time: '1 hour ago' },
    { id: 5, admin: 'Admin B', action: 'Updated safety settings', module: 'System', time: '2 hours ago' },
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-500 bg-red-50 dark:bg-red-500/10';
      case 'medium': return 'border-orange-500 bg-orange-50 dark:bg-orange-500/10';
      case 'low': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-500/10';
      default: return 'border-gray-300 dark:border-gray-700';
    }
  };

  const getMetricColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'border-blue-500 bg-blue-50 dark:bg-blue-500/10',
      green: 'border-green-500 bg-green-50 dark:bg-green-500/10',
      purple: 'border-purple-500 bg-purple-50 dark:bg-purple-500/10',
      orange: 'border-orange-500 bg-orange-50 dark:bg-orange-500/10',
      red: 'border-red-500 bg-red-50 dark:bg-red-500/10',
      gray: 'border-gray-500 bg-gray-50 dark:bg-gray-500/10',
    };
    return colors[color] || colors.gray;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <h1 className="text-2xl text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Operational governance overview</p>
      </div>

      <div className="p-8 space-y-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white dark:bg-[#1A1F2E] border-l-4 ${getMetricColor(metric.color)} p-6 rounded-lg`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.label}</p>
                    <p className="text-2xl text-gray-900 dark:text-white mb-2">{metric.value}</p>
                    <div className="flex items-center gap-1">
                      {metric.isUp ? (
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      ) : (
                        <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      )}
                      <span className="text-xs text-gray-600 dark:text-gray-400">{metric.change}</span>
                    </div>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${getMetricColor(metric.color)} flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Financial Snapshot */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <h2 className="text-lg text-gray-900 dark:text-white">Financial Snapshot</h2>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div className="border-r border-gray-200 dark:border-gray-800 pr-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Revenue</p>
              <p className="text-3xl text-gray-900 dark:text-white">{financialData.revenue}</p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">+18.5% vs last month</p>
            </div>
            <div className="border-r border-gray-200 dark:border-gray-800 pr-6">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Refunds Issued</p>
              <p className="text-3xl text-gray-900 dark:text-white">{financialData.refunds}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">5% of revenue</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Net Income</p>
              <p className="text-3xl text-green-600 dark:text-green-400">{financialData.netIncome}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">After refunds & fees</p>
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Risk Alerts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />
              <h2 className="text-lg text-gray-900 dark:text-white">Risk Alerts</h2>
            </div>
            <div className="space-y-3">
              {riskAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${ 
                        alert.severity === 'high' ? 'bg-red-600 text-white' :
                        alert.severity === 'medium' ? 'bg-orange-600 text-white' :
                        'bg-yellow-600 text-white'
                      }`}>
                        {alert.severity.toUpperCase()}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{alert.module}</span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-500">{alert.time}</span>
                  </div>
                  <p className="text-sm text-gray-900 dark:text-white">{alert.message}</p>
                  <button className="text-xs text-blue-600 dark:text-blue-400 mt-2 hover:underline">
                    Review Now →
                  </button>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Admin Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <h2 className="text-lg text-gray-900 dark:text-white">Recent Admin Actions</h2>
              </div>
              <button className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                View All Logs
              </button>
            </div>
            <div className="space-y-3">
              {recentActions.map((action) => (
                <div key={action.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm text-gray-900 dark:text-white">{action.action}</p>
                      <span className="text-xs text-gray-500 dark:text-gray-500">{action.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-600 dark:text-gray-400">{action.admin}</span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{action.module}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
