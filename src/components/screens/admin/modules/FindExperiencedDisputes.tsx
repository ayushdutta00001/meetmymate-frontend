import React, { useState } from 'react';
import { DisputeCaseModal } from '../../../admin/DisputeCaseModal';

export function FindExperiencedDisputes() {
  const [selectedCase, setSelectedCase] = useState<any>(null);

  const disputes = [
    {
      id: 'D-EXP-7031',
      bookingId: 'EXP-6521',
      user1: { id: 'U-7821', name: 'Rajesh Kumar' },
      user2: { id: 'E-5431', name: 'Dr. Priya Sharma' },
      category: 'Session Quality',
      severity: 'Low' as const,
      status: 'Open' as const,
      createdDate: '2024-12-27',
      assignedTo: 'Admin A',
      description: 'Client claims expert did not provide actionable advice as promised.'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <h1 className="text-2xl text-gray-900 dark:text-white">Find Experienced People — Disputes & Reports</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Expert consultation dispute management</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Open Cases', value: '4', color: 'blue' },
            { label: 'Under Review', value: '2', color: 'purple' },
            { label: 'Resolved', value: '18', color: 'green' },
            { label: 'Critical', value: '0', color: 'red' },
          ].map((stat, idx) => (
            <div key={idx} className={`bg-white dark:bg-[#1A1F2E] border-l-4 border-${stat.color}-500 p-4 rounded-lg`}>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl text-gray-900 dark:text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-lg text-gray-900 dark:text-white">Active Disputes</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Case ID</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Client</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Expert</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Category</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Status</th>
                <th className="px-6 py-3 text-right text-xs text-gray-600 dark:text-gray-400">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {disputes.map((dispute) => (
                <tr key={dispute.id} className="hover:bg-gray-50 dark:hover:bg-[#0A0F1F]">
                  <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">{dispute.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{dispute.user1.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{dispute.user2.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{dispute.category}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-300">
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
