import React, { useState } from 'react';
import { FileText, Download, Eye, Clock, Shield } from 'lucide-react';

interface PolicyDocument {
  id: string;
  title: string;
  category: string;
  version: string;
  lastUpdated: string;
  updatedBy: string;
  status: 'Active' | 'Draft' | 'Archived';
  internalUse: boolean;
}

export function AdminInternalLegal() {
  const [categoryFilter, setCategoryFilter] = useState('All');

  const policies: PolicyDocument[] = [
    {
      id: 'POL-001',
      title: 'Admin Governance Framework',
      category: 'Governance',
      version: '2.1',
      lastUpdated: '2024-12-15',
      updatedBy: 'Legal Team',
      status: 'Active',
      internalUse: true
    },
    {
      id: 'POL-002',
      title: 'User Data Handling & Privacy Protocol',
      category: 'Data Privacy',
      version: '3.0',
      lastUpdated: '2024-12-20',
      updatedBy: 'Compliance Officer',
      status: 'Active',
      internalUse: true
    },
    {
      id: 'POL-003',
      title: 'Financial Transaction Compliance Policy',
      category: 'Financial',
      version: '1.5',
      lastUpdated: '2024-12-10',
      updatedBy: 'Finance Director',
      status: 'Active',
      internalUse: true
    },
    {
      id: 'POL-004',
      title: 'Dispute Resolution Procedures',
      category: 'Legal',
      version: '2.0',
      lastUpdated: '2024-12-05',
      updatedBy: 'Legal Team',
      status: 'Active',
      internalUse: true
    },
    {
      id: 'POL-005',
      title: 'Safety & Harassment Response Protocol',
      category: 'Safety',
      version: '1.8',
      lastUpdated: '2024-12-12',
      updatedBy: 'Safety Team',
      status: 'Active',
      internalUse: true
    },
    {
      id: 'POL-006',
      title: 'Provider Verification Standards',
      category: 'Operations',
      version: '2.3',
      lastUpdated: '2024-12-18',
      updatedBy: 'Operations Lead',
      status: 'Active',
      internalUse: true
    },
    {
      id: 'POL-007',
      title: 'Refund & Chargeback Policy',
      category: 'Financial',
      version: '1.2',
      lastUpdated: '2024-11-30',
      updatedBy: 'Finance Director',
      status: 'Active',
      internalUse: true
    },
    {
      id: 'POL-008',
      title: 'Account Suspension & Ban Guidelines',
      category: 'Governance',
      version: '1.9',
      lastUpdated: '2024-12-08',
      updatedBy: 'Admin Team',
      status: 'Active',
      internalUse: true
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      Active: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300',
      Draft: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300',
      Archived: 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-300',
    };
    return styles[status as keyof typeof styles];
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      Governance: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
      'Data Privacy': 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400',
      Financial: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
      Legal: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400',
      Safety: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400',
      Operations: 'bg-teal-100 dark:bg-teal-500/20 text-teal-700 dark:text-teal-400',
    };
    return colors[category as keyof typeof colors] || colors.Governance;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-6 h-6 text-red-600 dark:text-red-400" />
          <h1 className="text-2xl text-gray-900 dark:text-white">Internal Legal & Policies</h1>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">Admin-only compliance documentation and governance frameworks</p>
        
        <div className="mt-4 bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-lg p-3">
          <p className="text-xs text-red-700 dark:text-red-400">
            <strong>INTERNAL USE ONLY</strong> — These documents are confidential and for platform governance purposes only. Not visible to end users.
          </p>
        </div>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Active Policies', value: '8', color: 'green', icon: FileText },
            { label: 'Draft Policies', value: '2', color: 'yellow', icon: Clock },
            { label: 'Last Updated', value: '3 days ago', color: 'blue', icon: Clock },
            { label: 'Compliance Score', value: '98%', color: 'purple', icon: Shield },
          ].map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className={`bg-white dark:bg-[#1A1F2E] border-l-4 border-${metric.color}-500 p-4 rounded-lg`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                  <Icon className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl text-gray-900 dark:text-white">{metric.value}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-gray-900 dark:text-white">Policy Repository</h2>
              <div className="flex items-center gap-3">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
                >
                  <option>All Categories</option>
                  <option>Governance</option>
                  <option>Data Privacy</option>
                  <option>Financial</option>
                  <option>Legal</option>
                  <option>Safety</option>
                  <option>Operations</option>
                </select>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
                  <Download className="w-4 h-4" />
                  Export All
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Policy ID</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Title</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Category</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Version</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Updated By</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Status</th>
                  <th className="px-6 py-3 text-right text-xs text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {policies.map((policy) => (
                  <tr key={policy.id} className="hover:bg-gray-50 dark:hover:bg-[#0A0F1F]">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">{policy.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-900 dark:text-white">{policy.title}</p>
                          {policy.internalUse && (
                            <p className="text-xs text-red-600 dark:text-red-400">Internal Use Only</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getCategoryColor(policy.category)}`}>
                        {policy.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-700 dark:text-gray-300">v{policy.version}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{policy.lastUpdated}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{policy.updatedBy}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(policy.status)}`}>
                        {policy.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                          <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <button className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                          <Download className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Version Control Info */}
        <div className="mt-6 bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg text-gray-900 dark:text-white mb-4">Version Control & Audit</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">All policy changes are tracked</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Full version history available for audit</p>
              </div>
              <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Automatic backup every 24 hours</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Last backup: Today at 02:00 AM</p>
              </div>
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#0A0F1F] rounded-lg">
              <div>
                <p className="text-sm text-gray-900 dark:text-white">Compliance review pending</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">2 policies scheduled for quarterly review</p>
              </div>
              <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
