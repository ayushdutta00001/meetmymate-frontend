import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { DisputeCaseModal } from '../../../admin/DisputeCaseModal';

interface DisputeCase {
  id: string;
  bookingId: string;
  user1: { id: string; name: string };
  user2: { id: string; name: string };
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Under Review' | 'Resolved';
  createdDate: string;
  assignedTo: string;
  description: string;
}

export function P2PMatchDisputes() {
  const [selectedCase, setSelectedCase] = useState<DisputeCase | null>(null);

  const disputes: DisputeCase[] = [
    {
      id: 'D-P2P-1015',
      bookingId: 'P2P-3021',
      user1: { id: 'U-7821', name: 'Rajesh Kumar' },
      user2: { id: 'U-5431', name: 'Priya Sharma' },
      category: 'Missed Agenda Items',
      severity: 'Low',
      status: 'Open',
      createdDate: '2024-12-27',
      assignedTo: 'Admin A',
      description: 'User 1 claims agreed agenda was not followed during meeting.'
    },
  ];

  const getSeverityColor = (severity: string) => {
    const colors = {
      Low: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300',
      Medium: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-300',
      High: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300',
      Critical: 'bg-red-600 text-white border border-red-700',
    };
    return colors[severity as keyof typeof colors];
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Open: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-300',
      'Under Review': 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-300',
      Resolved: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300',
    };
    return styles[status as keyof typeof styles];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <h1 className="text-2xl text-gray-900 dark:text-white">Peer-to-Peer Match — Disputes & Reports</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Professional dispute management for P2P matches</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Open Cases', value: '3', color: 'blue' },
            { label: 'Under Review', value: '2', color: 'purple' },
            { label: 'Resolved', value: '12', color: 'green' },
            { label: 'Avg Resolution Time', value: '24h', color: 'orange' },
          ].map((stat, idx) => (
            <div key={idx} className={`bg-white dark:bg-[#1A1F2E] border-l-4 border-${stat.color}-500 p-4 rounded-lg`}>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl text-gray-900 dark:text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search disputes..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Case ID</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Booking</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Participant 1</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Participant 2</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Category</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Severity</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-right text-xs text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {disputes.map((dispute) => (
                <tr key={dispute.id} className="hover:bg-gray-50 dark:hover:bg-[#0A0F1F]">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">{dispute.id}</td>
                  <td className="px-6 py-4 text-sm font-mono text-gray-700 dark:text-gray-300">{dispute.bookingId}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{dispute.user1.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{dispute.user2.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{dispute.category}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getSeverityColor(dispute.severity)}`}>
                      {dispute.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(dispute.status)}`}>
                      {dispute.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedCase(dispute)}
                      className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100"
                    >
                      Investigate
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCase && (
        <DisputeCaseModal
          disputeCase={selectedCase}
          onClose={() => setSelectedCase(null)}
        />
      )}
    </div>
  );
}
