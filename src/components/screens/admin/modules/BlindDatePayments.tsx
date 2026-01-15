import React, { useState } from 'react';
import { Download, AlertCircle, TrendingUp } from 'lucide-react';
import { ConfirmationModal } from '../../../admin/ConfirmationModal';
import { ScrollableTable, TableHeadCell, TableCell } from '../../../ui/ScrollableTable';
import { usePayments } from '../../../../lib/hooks';
import { LoadingState } from '../../../ui/LoadingState';
import { ErrorState } from '../../../ui/ErrorState';

interface PayoutRequest {
  id: string;
  providerId: string;
  providerName: string;
  amount: string;
  bookingIds: string[];
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'On Hold';
  bankAccount: string;
}

export function BlindDatePayments() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null);

  const { payments, loading, error, refetch, totalRevenue, pendingPayments } = usePayments({
    serviceType: 'blind-date',
    autoFetch: true
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
          <h1 className="text-2xl text-gray-900 dark:text-white">Blind Date — Payments & Finance</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Financial oversight and payout management</p>
        </div>
        <LoadingState message="Loading payments..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
          <h1 className="text-2xl text-gray-900 dark:text-white">Blind Date — Payments & Finance</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Financial oversight and payout management</p>
        </div>
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  const payoutRequests: PayoutRequest[] = [
    {
      id: 'PO-BD-5021',
      providerId: 'P-8912',
      providerName: 'Dating Consultant A',
      amount: '₹12,500',
      bookingIds: ['BD-5021', 'BD-5018', 'BD-5015'],
      requestDate: '2024-12-27',
      status: 'Pending',
      bankAccount: '****6789'
    },
    {
      id: 'PO-BD-5020',
      providerId: 'P-7823',
      providerName: 'Matchmaker B',
      amount: '₹18,750',
      bookingIds: ['BD-5022', 'BD-5019'],
      requestDate: '2024-12-26',
      status: 'Approved',
      bankAccount: '****3421'
    },
  ];

  const handleApprove = (payout: PayoutRequest) => {
    setSelectedPayout(payout);
    setShowApprovalModal(true);
  };

  const handleReject = (payout: PayoutRequest) => {
    setSelectedPayout(payout);
    setShowRejectModal(true);
  };

  const confirmApproval = () => {
    console.log('Payout approved:', selectedPayout?.id);
    setShowApprovalModal(false);
    setSelectedPayout(null);
  };

  const confirmRejection = () => {
    console.log('Payout rejected:', selectedPayout?.id);
    setShowRejectModal(false);
    setSelectedPayout(null);
  };

  const handleExport = () => {
    const csvContent = payoutRequests.map(p => 
      `${p.id},${p.providerName},${p.amount},${p.status},${p.requestDate}`
    ).join('\n');
    const blob = new Blob([`ID,Provider,Amount,Status,Date\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `blind-date-payouts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Pending: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300',
      Approved: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300',
      Rejected: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300',
      'On Hold': 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-300',
    };
    return styles[status as keyof typeof styles] || styles.Pending;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <h1 className="text-2xl text-gray-900 dark:text-white">Blind Date — Payments & Finance</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Financial oversight and payout management</p>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Total Revenue', value: '₹1.2M', subtext: 'This month', color: 'green', icon: TrendingUp },
            { label: 'Pending Payouts', value: '₹234K', subtext: '12 requests', color: 'yellow', icon: AlertCircle },
            { label: 'Paid Out', value: '₹890K', subtext: 'This month', color: 'blue', icon: TrendingUp },
            { label: 'Platform Commission', value: '₹180K', subtext: '15% avg', color: 'purple', icon: TrendingUp },
          ].map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div key={idx} className={`bg-white dark:bg-[#1A1F2E] border-l-4 border-${metric.color}-500 p-4 rounded-lg`}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                  <Icon className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-2xl text-gray-900 dark:text-white">{metric.value}</p>
                <p className="text-xs text-gray-500 mt-1">{metric.subtext}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-300 dark:border-orange-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-900 dark:text-white mb-1">
                <strong>Manual Approval Required for All Payouts</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                All payout requests must be manually reviewed and approved. Verify bank details and booking completion before approval.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <h2 className="text-lg text-gray-900 dark:text-white">Payout Approval Queue</h2>
              <div className="flex items-center gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>On Hold</option>
                  <option>Rejected</option>
                </select>
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>
          </div>

          <ScrollableTable>
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <TableHeadCell sticky>Payout ID</TableHeadCell>
                  <TableHeadCell>Provider</TableHeadCell>
                  <TableHeadCell>Amount</TableHeadCell>
                  <TableHeadCell>Bookings</TableHeadCell>
                  <TableHeadCell>Bank Account</TableHeadCell>
                  <TableHeadCell>Request Date</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell align="right">Actions</TableHeadCell>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {payoutRequests.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-50 dark:hover:bg-[#0A0F1F]">
                    <TableCell sticky className="font-mono">{payout.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{payout.providerName}</p>
                        <p className="text-xs text-gray-500">{payout.providerId}</p>
                      </div>
                    </TableCell>
                    <TableCell>{payout.amount}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {payout.bookingIds.map((id) => (
                          <span key={id} className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                            {id}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono">{payout.bankAccount}</TableCell>
                    <TableCell>{payout.requestDate}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(payout.status)}`}>
                        {payout.status}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <div className="flex items-center justify-end gap-2">
                        {payout.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(payout)}
                              className="px-3 py-1.5 text-xs bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded hover:bg-green-100"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(payout)}
                              className="px-3 py-1.5 text-xs bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded hover:bg-red-100"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollableTable>
        </div>
      </div>

      {showApprovalModal && selectedPayout && (
        <ConfirmationModal
          title="Approve Payout"
          message={`Are you sure you want to approve payout ${selectedPayout.id} for ${selectedPayout.amount} to ${selectedPayout.providerName}?`}
          consequence="This will initiate the bank transfer and cannot be reversed."
          confirmText="Approve Payout"
          confirmStyle="success"
          onConfirm={confirmApproval}
          onCancel={() => setShowApprovalModal(false)}
        />
      )}

      {showRejectModal && selectedPayout && (
        <ConfirmationModal
          title="Reject Payout"
          message={`Are you sure you want to reject payout ${selectedPayout.id} for ${selectedPayout.providerName}?`}
          consequence="The provider will be notified and funds will not be transferred."
          confirmText="Reject Payout"
          confirmStyle="danger"
          onConfirm={confirmRejection}
          onCancel={() => setShowRejectModal(false)}
        />
      )}
    </div>
  );
}