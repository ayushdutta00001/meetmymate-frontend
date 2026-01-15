import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Download, Filter, Shield, Lock } from 'lucide-react';

interface AuditLog {
  id: string;
  timestamp: string;
  adminId: string;
  adminName: string;
  actionType: string;
  module: string;
  userAffected: string;
  decision: string;
  ipAddress: string;
  details: string;
}

export function AdminAuditLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [actionFilter, setActionFilter] = useState('All');
  const [dateRange, setDateRange] = useState('7days');

  const auditLogs: AuditLog[] = [
    {
      id: 'AL-100254',
      timestamp: '2024-12-27 14:35:22',
      adminId: 'ADM-001',
      adminName: 'Admin A',
      actionType: 'User Suspended',
      module: 'Rent-a-Friend',
      userAffected: 'U-8821 (Rahul Sharma)',
      decision: 'Account suspended for 7 days',
      ipAddress: '192.168.1.100',
      details: 'Multiple customer complaints regarding service quality'
    },
    {
      id: 'AL-100253',
      timestamp: '2024-12-27 13:20:15',
      adminId: 'ADM-002',
      adminName: 'Admin B',
      actionType: 'Payout Approved',
      module: 'Business Meetup',
      userAffected: 'P-2341 (Priya Mehta)',
      decision: 'Approved payout of ₹15,000',
      ipAddress: '192.168.1.101',
      details: 'All bookings verified, bank details confirmed'
    },
    {
      id: 'AL-100252',
      timestamp: '2024-12-27 11:45:30',
      adminId: 'ADM-001',
      adminName: 'Admin A',
      actionType: 'Dispute Resolved',
      module: 'Blind Date',
      userAffected: 'D-1024',
      decision: 'Full refund issued to customer',
      ipAddress: '192.168.1.100',
      details: 'Provider no-show confirmed via GPS tracking'
    },
    {
      id: 'AL-100251',
      timestamp: '2024-12-27 10:15:45',
      adminId: 'ADM-003',
      adminName: 'Admin C',
      actionType: 'Provider Verified',
      module: 'Find Experienced',
      userAffected: 'P-9012 (Amit Kumar)',
      decision: 'Expert verification approved',
      ipAddress: '192.168.1.102',
      details: 'Credentials verified, background check completed'
    },
    {
      id: 'AL-100250',
      timestamp: '2024-12-27 09:30:10',
      adminId: 'ADM-002',
      adminName: 'Admin B',
      actionType: 'Settings Updated',
      module: 'System',
      userAffected: 'N/A',
      decision: 'Updated safety settings',
      ipAddress: '192.168.1.101',
      details: 'Enabled GPS tracking requirement for all bookings'
    },
    {
      id: 'AL-100249',
      timestamp: '2024-12-26 18:22:33',
      adminId: 'ADM-001',
      adminName: 'Admin A',
      actionType: 'User Banned',
      module: 'Rent-a-Friend',
      userAffected: 'U-3298 (Vikram Singh)',
      decision: 'Permanent account ban',
      ipAddress: '192.168.1.100',
      details: 'Multiple policy violations, fraudulent activity detected'
    },
    {
      id: 'AL-100248',
      timestamp: '2024-12-26 16:50:18',
      adminId: 'ADM-003',
      adminName: 'Admin C',
      actionType: 'Refund Issued',
      module: 'Business Meetup',
      userAffected: 'U-7652 (Neha Kapoor)',
      decision: 'Partial refund of ₹800',
      ipAddress: '192.168.1.102',
      details: 'Service quality below expectations, 50% refund policy applied'
    },
    {
      id: 'AL-100247',
      timestamp: '2024-12-26 15:10:55',
      adminId: 'ADM-002',
      adminName: 'Admin B',
      actionType: 'Match Created',
      module: 'Peer-to-Peer',
      userAffected: 'U-5431, U-7821',
      decision: 'Manual match override',
      ipAddress: '192.168.1.101',
      details: 'Strategic partner matching based on business requirements'
    },
  ];

  const getActionColor = (actionType: string) => {
    if (actionType.includes('Approved') || actionType.includes('Verified') || actionType.includes('Resolved')) {
      return 'text-green-600 dark:text-green-400';
    }
    if (actionType.includes('Suspended') || actionType.includes('Rejected') || actionType.includes('Hold')) {
      return 'text-orange-600 dark:text-orange-400';
    }
    if (actionType.includes('Banned') || actionType.includes('Escalated')) {
      return 'text-red-600 dark:text-red-400';
    }
    return 'text-blue-600 dark:text-blue-400';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <h1 className="text-2xl text-gray-900 dark:text-white">Global Audit Logs</h1>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Immutable record of all administrative actions</p>
        
        {/* Security Notice */}
        <div className="mt-4 flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/30 rounded-lg">
          <Lock className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
          <p className="text-xs text-gray-700 dark:text-gray-300">
            <strong>Compliance Notice:</strong> All logs are immutable and cannot be deleted or modified. Access is restricted to authorized administrators only.
          </p>
        </div>
      </div>

      <div className="p-8">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Actions Today', value: '156' },
            { label: 'Active Admins', value: '3' },
            { label: 'Critical Actions', value: '8' },
            { label: 'Last 7 Days', value: '1,234' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-[#1A1F2E] border-l-4 border-blue-500 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl text-gray-900 dark:text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by admin, user, or action..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="col-span-2">
              <select
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              >
                <option>All Modules</option>
                <option>Rent-a-Friend</option>
                <option>Blind Date</option>
                <option>Business Meetup</option>
                <option>Peer-to-Peer</option>
                <option>Find Investor</option>
                <option>Find Experienced</option>
                <option>System</option>
              </select>
            </div>
            <div className="col-span-2">
              <select
                value={actionFilter}
                onChange={(e) => setActionFilter(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              >
                <option>All Actions</option>
                <option>User Actions</option>
                <option>Financial</option>
                <option>Disputes</option>
                <option>Settings</option>
              </select>
            </div>
            <div className="col-span-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              >
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            <div className="col-span-2">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Log ID</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Admin</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Action Type</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Module</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">User/Entity Affected</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Decision/Outcome</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-[#0A0F1F]">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">{log.id}</td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-700 dark:text-gray-300">{log.timestamp}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{log.adminName}</p>
                        <p className="text-xs text-gray-500">{log.adminId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm ${getActionColor(log.actionType)}`}>
                        {log.actionType}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{log.module}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{log.userAffected}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{log.decision}</p>
                        <p className="text-xs text-gray-500 mt-1">{log.details}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-700 dark:text-gray-300">{log.ipAddress}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing 1-8 of 1,234 audit logs
          </p>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-white dark:bg-[#1A1F2E] border border-gray-300 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
              Previous
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
              1
            </button>
            <button className="px-4 py-2 bg-white dark:bg-[#1A1F2E] border border-gray-300 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
              2
            </button>
            <button className="px-4 py-2 bg-white dark:bg-[#1A1F2E] border border-gray-300 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
              3
            </button>
            <button className="px-4 py-2 bg-white dark:bg-[#1A1F2E] border border-gray-300 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
