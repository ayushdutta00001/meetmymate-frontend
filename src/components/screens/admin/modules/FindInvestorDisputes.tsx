import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { DisputeCaseModal } from '../../../admin/DisputeCaseModal';
import { ScrollableTable, TableHeadCell, TableCell } from '../../../ui/ScrollableTable';

export function FindInvestorDisputes() {
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  const disputes = [
    {
      id: 'D-INV-5021',
      bookingId: 'INV-4521',
      user1: { id: 'S-7821', name: 'TechStartup AI' },
      user2: { id: 'I-5431', name: 'Venture Partners LLC' },
      category: 'Terms Disagreement',
      severity: 'Medium' as const,
      status: 'Open' as const,
      createdDate: '2024-12-27',
      assignedTo: 'Admin A',
      description: 'Startup claims investor changed terms after initial discussion.'
    },
    {
      id: 'D-INV-5020',
      bookingId: 'INV-4520',
      user1: { id: 'S-9012', name: 'FinTech Solutions' },
      user2: { id: 'I-3421', name: 'Angel Investor Group' },
      category: 'Payment Issue',
      severity: 'Low' as const,
      status: 'Under Review' as const,
      createdDate: '2024-12-26',
      assignedTo: 'Admin B',
      description: 'Startup disputes the platform commission calculation.'
    },
    {
      id: 'D-INV-5019',
      bookingId: 'INV-4518',
      user1: { id: 'S-3421', name: 'GreenTech Innovations' },
      user2: { id: 'I-7821', name: 'Impact Fund Asia' },
      category: 'No-Show',
      severity: 'High' as const,
      status: 'Resolved' as const,
      createdDate: '2024-12-20',
      assignedTo: 'Admin A',
      description: 'Investor did not attend scheduled pitch meeting.'
    },
  ];

  const getSeverityColor = (severity: string) => {
    const colors = {
      Low: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300',
      Medium: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-300',
      High: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300',
      Critical: 'bg-red-600 text-white border border-red-700',
    };
    return colors[severity as keyof typeof colors] || colors.Low;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Open: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-300',
      'Under Review': 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-300',
      'Awaiting Info': 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300',
      Resolved: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300',
      Escalated: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300',
      Closed: 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-300',
    };
    return styles[status as keyof typeof styles] || styles.Open;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <h1 className="text-2xl text-gray-900 dark:text-white">Find Investor — Disputes & Reports</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Investment pitch dispute management</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Open Cases', value: '2', color: 'blue' },
            { label: 'Under Review', value: '1', color: 'purple' },
            { label: 'Resolved', value: '5', color: 'green' },
            { label: 'Critical', value: '0', color: 'red' },
          ].map((stat, idx) => (
            <div key={idx} className={`bg-white dark:bg-[#1A1F2E] border-l-4 border-${stat.color}-500 p-4 rounded-lg`}>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl text-gray-900 dark:text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by case ID, booking ID, or startup name..."
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
            >
              <option>All Status</option>
              <option>Open</option>
              <option>Under Review</option>
              <option>Resolved</option>
            </select>
            <select
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
            >
              <option>All Severity</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Critical</option>
            </select>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <ScrollableTable>
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <TableHeadCell sticky>Case ID</TableHeadCell>
                  <TableHeadCell>Booking</TableHeadCell>
                  <TableHeadCell>Startup</TableHeadCell>
                  <TableHeadCell>Investor</TableHeadCell>
                  <TableHeadCell>Category</TableHeadCell>
                  <TableHeadCell>Severity</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Created</TableHeadCell>
                  <TableHeadCell>Assigned</TableHeadCell>
                  <TableHeadCell align="right">Actions</TableHeadCell>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {disputes.map((dispute) => (
                  <tr key={dispute.id} className="hover:bg-gray-50 dark:hover:bg-[#0A0F1F]">
                    <TableCell sticky className="font-mono">{dispute.id}</TableCell>
                    <TableCell className="font-mono">{dispute.bookingId}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{dispute.user1.name}</p>
                        <p className="text-xs text-gray-500">{dispute.user1.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{dispute.user2.name}</p>
                        <p className="text-xs text-gray-500">{dispute.user2.id}</p>
                      </div>
                    </TableCell>
                    <TableCell>{dispute.category}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getSeverityColor(dispute.severity)}`}>
                        {dispute.severity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(dispute.status)}`}>
                        {dispute.status}
                      </span>
                    </TableCell>
                    <TableCell>{dispute.createdDate}</TableCell>
                    <TableCell>{dispute.assignedTo}</TableCell>
                    <TableCell align="right">
                      <button
                        onClick={() => setSelectedCase(dispute)}
                        className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100"
                      >
                        Investigate
                      </button>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollableTable>
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