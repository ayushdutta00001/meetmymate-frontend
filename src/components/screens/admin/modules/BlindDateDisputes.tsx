import React, { useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { DisputeCaseModal } from '../../../admin/DisputeCaseModal';
import { ScrollableTable, TableHeadCell, TableCell } from '../../../ui/ScrollableTable';
import { useDisputes, DisputeStatus } from '../../../../lib/hooks';
import { LoadingState } from '../../../ui/LoadingState';
import { ErrorState } from '../../../ui/ErrorState';

interface DisputeCase {
  id: string;
  bookingId: string;
  user1: { id: string; name: string };
  user2: { id: string; name: string };
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Under Review' | 'Awaiting Info' | 'Resolved' | 'Escalated' | 'Closed';
  createdDate: string;
  assignedTo: string;
  description: string;
}

export function BlindDateDisputes() {
  const [selectedCase, setSelectedCase] = useState<DisputeCase | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  const { disputes, loading, error, refetch, updateStatus, openDisputes } = useDisputes({
    serviceType: 'blind-date',
    autoFetch: true
  });

  const handleResolve = async (disputeId: string, resolution: string) => {
    try {
      await updateStatus(disputeId, 'resolved', resolution);
    } catch (err) {
      console.error('Failed to resolve dispute:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
          <h1 className="text-2xl text-gray-900 dark:text-white">Blind Date — Disputes & Reports</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Case management and resolution tracking</p>
        </div>
        <LoadingState message="Loading disputes..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
          <h1 className="text-2xl text-gray-900 dark:text-white">Blind Date — Disputes & Reports</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Case management and resolution tracking</p>
        </div>
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  const disputesMock: DisputeCase[] = [
    {
      id: 'D-BD-1024',
      bookingId: 'BD-5022',
      user1: { id: 'U-5431', name: 'Vikram Singh' },
      user2: { id: 'U-7821', name: 'Anjali Patel' },
      category: 'No-Show',
      severity: 'High',
      status: 'Open',
      createdDate: '2024-12-27',
      assignedTo: 'Admin A',
      description: 'User 2 did not arrive at the venue. User 1 waited for 45 minutes.'
    },
    {
      id: 'D-BD-1023',
      bookingId: 'BD-5015',
      user1: { id: 'U-9012', name: 'Amit Kumar' },
      user2: { id: 'U-3421', name: 'Priya Mehta' },
      category: 'Inappropriate Behavior',
      severity: 'Critical',
      status: 'Under Review',
      createdDate: '2024-12-26',
      assignedTo: 'Admin B',
      description: 'User 1 reported inappropriate comments during the date.'
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
        <h1 className="text-2xl text-gray-900 dark:text-white">Blind Date — Disputes & Reports</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Case management and resolution tracking</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Open Cases', value: '8', color: 'blue' },
            { label: 'Under Review', value: '5', color: 'purple' },
            { label: 'Resolved Today', value: '3', color: 'green' },
            { label: 'Critical Cases', value: '1', color: 'red' },
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
                placeholder="Search by case ID, booking ID, or user name..."
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
                  <TableHeadCell>User 1</TableHeadCell>
                  <TableHeadCell>User 2</TableHeadCell>
                  <TableHeadCell>Category</TableHeadCell>
                  <TableHeadCell>Severity</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Created</TableHeadCell>
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