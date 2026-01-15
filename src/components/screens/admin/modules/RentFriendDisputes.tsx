import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, AlertTriangle, Clock, CheckCircle, FileText, X } from 'lucide-react';
import { ScrollableTable, TableHeadCell, TableCell } from '../../../ui/ScrollableTable';
import { useDisputes, DisputeStatus } from '../../../../lib/hooks';
import { LoadingState } from '../../../ui/LoadingState';
import { ErrorState } from '../../../ui/ErrorState';
import { ApiStateWrapper } from '../../../ui/ApiStateWrapper';
import { ResponsiveContainer, PageHeader, Card, Grid } from '../../../ui/ResponsiveContainer';
import { ResponsiveTable } from '../../../ui/ResponsiveTable';
import { ResponsiveModal } from '../../../ui/ResponsiveModal';

interface DisputeCase {
  id: string;
  module: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  providerId: string;
  providerName: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Under Review' | 'Awaiting Info' | 'Resolved' | 'Escalated' | 'Closed';
  createdDate: string;
  assignedTo: string;
  outcome?: string;
}

export function RentFriendDisputes() {
  const [selectedCase, setSelectedCase] = useState<DisputeCase | null>(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');

  const { disputes, loading, error, refetch, updateStatus, openDisputes } = useDisputes({
    serviceType: 'rent-friend',
    autoFetch: true
  });

  const handleResolve = async (disputeId: string, resolution: string) => {
    try {
      await updateStatus(disputeId, 'resolved', resolution);
    } catch (err) {
      console.error('Failed to resolve dispute:', err);
    }
  };

  const disputesMock: DisputeCase[] = [
    {
      id: 'D-1024',
      module: 'Rent-a-Friend',
      bookingId: 'RF-10022',
      customerId: 'U-5431',
      customerName: 'Vikram Singh',
      providerId: 'P-3421',
      providerName: 'Anjali Reddy',
      category: 'Provider No-Show',
      severity: 'High',
      status: 'Open',
      createdDate: '2024-12-27',
      assignedTo: 'Admin A'
    },
    {
      id: 'D-1023',
      module: 'Rent-a-Friend',
      bookingId: 'RF-10015',
      customerId: 'U-7821',
      customerName: 'Neha Kapoor',
      providerId: 'P-2341',
      providerName: 'Priya Mehta',
      category: 'Service Quality',
      severity: 'Medium',
      status: 'Under Review',
      createdDate: '2024-12-26',
      assignedTo: 'Admin B'
    },
    {
      id: 'D-1022',
      module: 'Rent-a-Friend',
      bookingId: 'RF-10008',
      customerId: 'U-9012',
      customerName: 'Amit Kumar',
      providerId: 'P-5612',
      providerName: 'Rohan Desai',
      category: 'Payment Issue',
      severity: 'Low',
      status: 'Resolved',
      createdDate: '2024-12-20',
      assignedTo: 'Admin A',
      outcome: 'Refund issued'
    },
  ];

  const getSeverityColor = (severity: string) => {
    const colors = {
      Low: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-500/30',
      Medium: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-500/30',
      High: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30',
      Critical: 'bg-red-600 text-white border border-red-700',
    };
    return colors[severity as keyof typeof colors] || colors.Low;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Open: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30',
      'Under Review': 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400 border border-purple-300 dark:border-purple-500/30',
      'Awaiting Info': 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-500/30',
      Resolved: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/30',
      Escalated: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30',
      Closed: 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-500/30',
    };
    return styles[status as keyof typeof styles] || styles.Open;
  };

  // Define table columns
  const columns = [
    {
      key: 'id',
      label: 'Case ID',
      render: (dispute: any) => (
        <span className="text-xs md:text-sm text-gray-900 dark:text-white font-mono">
          {dispute.id}
        </span>
      ),
    },
    {
      key: 'booking',
      label: 'Booking',
      hideOnMobile: true,
      render: (dispute: any) => (
        <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">
          {dispute.bookingId}
        </span>
      ),
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (dispute: any) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white" style={{ fontWeight: 500 }}>
            {dispute.customerName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{dispute.customerId}</p>
        </div>
      ),
    },
    {
      key: 'provider',
      label: 'Provider',
      hideOnMobile: true,
      render: (dispute: any) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white" style={{ fontWeight: 500 }}>
            {dispute.providerName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{dispute.providerId}</p>
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      hideOnMobile: true,
      render: (dispute: any) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {dispute.category}
        </span>
      ),
    },
    {
      key: 'severity',
      label: 'Severity',
      render: (dispute: any) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getSeverityColor(dispute.severity)}`}>
          {dispute.severity}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (dispute: any) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(dispute.status)}`}>
          {dispute.status}
        </span>
      ),
    },
  ];

  return (
    <ApiStateWrapper
      loading={loading}
      error={error}
      onRetry={refetch}
      empty={disputes.length === 0}
      emptyTitle="No disputes found"
      emptyDescription="There are no Rent-a-Friend disputes in the system yet."
    >
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        {/* Page Header - Responsive */}
        <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <ResponsiveContainer maxWidth="full" padding={false}>
            <PageHeader
              title="Rent-a-Friend — Disputes & Reports"
              description="Case management and resolution tracking"
            />
          </ResponsiveContainer>
        </div>

        <ResponsiveContainer maxWidth="full" className="py-4 md:py-6 lg:py-8">
          {/* Summary Stats - Responsive Grid */}
          <Grid columns={4} gap="md" className="mb-6">
            {[
              { label: 'Open Cases', value: '12', color: 'blue' },
              { label: 'Under Review', value: '8', color: 'purple' },
              { label: 'Resolved Today', value: '5', color: 'green' },
              { label: 'Critical Cases', value: '2', color: 'red' },
            ].map((stat, idx) => (
              <Card key={idx} className={`border-l-4 border-${stat.color}-500`}>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-xl md:text-2xl text-gray-900 dark:text-white mt-1" style={{ fontWeight: 600 }}>
                  {stat.value}
                </p>
              </Card>
            ))}
          </Grid>

          {/* Filters - Responsive */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by case ID, booking ID, or user name..."
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                >
                  <option>All Status</option>
                  <option>Open</option>
                  <option>Under Review</option>
                  <option>Resolved</option>
                  <option>Escalated</option>
                </select>
                <select
                  value={severityFilter}
                  onChange={(e) => setSeverityFilter(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                >
                  <option>All Severity</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Cases Table - Responsive */}
          <Card padding={false}>
            <div className="p-4 md:p-6">
              <ResponsiveTable
                data={disputes}
                columns={columns}
                keyExtractor={(dispute) => dispute.id}
                onRowClick={(dispute) => setSelectedCase(dispute)}
                emptyMessage="No disputes match your filters"
              />
            </div>
          </Card>
        </ResponsiveContainer>
      </div>

      {/* Case Detail Modal - Responsive */}
      <ResponsiveModal
        isOpen={!!selectedCase}
        onClose={() => setSelectedCase(null)}
        title={selectedCase ? `Case ${selectedCase.id}` : ''}
        subtitle={selectedCase?.category}
      >
        {selectedCase && (
          <div className="space-y-6">
            {/* Case Info */}
            <Grid columns={2} gap="sm">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Booking ID</p>
                <p className="text-sm font-mono text-gray-900 dark:text-white">{selectedCase.bookingId}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Created Date</p>
                <p className="text-sm text-gray-900 dark:text-white">{selectedCase.createdDate}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Severity</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getSeverityColor(selectedCase.severity)}`}>
                  {selectedCase.severity}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Status</p>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(selectedCase.status)}`}>
                  {selectedCase.status}
                </span>
              </div>
            </Grid>

            {/* Parties Involved */}
            <div>
              <h3 className="text-sm text-gray-900 dark:text-white mb-3" style={{ fontWeight: 600 }}>
                Parties Involved
              </h3>
              <Grid columns={2} gap="sm">
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#0A0F1F]">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Customer</p>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedCase.customerName}</p>
                  <p className="text-xs text-gray-500">{selectedCase.customerId}</p>
                </div>
                <div className="p-4 rounded-lg bg-gray-50 dark:bg-[#0A0F1F]">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Provider</p>
                  <p className="text-sm text-gray-900 dark:text-white">{selectedCase.providerName}</p>
                  <p className="text-xs text-gray-500">{selectedCase.providerId}</p>
                </div>
              </Grid>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-sm text-gray-900 dark:text-white mb-3" style={{ fontWeight: 600 }}>
                Timeline of Events
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-800">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">Case opened by customer</p>
                    <p className="text-xs text-gray-500">{selectedCase.createdDate} • 10:30 AM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-800">
                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 dark:text-white">Assigned to {selectedCase.assignedTo}</p>
                    <p className="text-xs text-gray-500">{selectedCase.createdDate} • 11:15 AM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Admin Notes */}
            <div>
              <h3 className="text-sm text-gray-900 dark:text-white mb-3" style={{ fontWeight: 600 }}>
                Admin Notes
              </h3>
              <textarea
                className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm resize-none min-h-[44px]"
                rows={4}
                placeholder="Add internal notes about this case..."
              ></textarea>
            </div>

            {/* Decision Controls */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 min-h-[44px]">
                Mark as Resolved
              </button>
              <button className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 min-h-[44px]">
                Escalate Case
              </button>
              <button className="px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 min-h-[44px]">
                Request More Info
              </button>
            </div>
          </div>
        )}
      </ResponsiveModal>
    </ApiStateWrapper>
  );
}