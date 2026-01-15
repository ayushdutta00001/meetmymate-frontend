import React, { useState } from 'react';
import { Download, TrendingUp, AlertCircle } from 'lucide-react';
import { ConfirmationModal } from '../../../admin/ConfirmationModal';
import { usePayments } from '../../../../lib/hooks';
import { LoadingState } from '../../../ui/LoadingState';
import { ErrorState } from '../../../ui/ErrorState';

interface PayoutRequest {
  id: string;
  providerId: string;
  providerName: string;
  program: 'Peer-to-Peer' | 'Find Investor' | 'Find Experienced';
  amount: string;
  bookingIds: string[];
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'On Hold';
  bankAccount: string;
}

export function BusinessMeetupPayments() {
  const [programFilter, setProgramFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null);

  const { payments, loading, error, refetch, totalRevenue, pendingPayments } = usePayments({
    serviceType: 'business-meetup',
    autoFetch: true
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
          <h1 className="text-2xl text-gray-900 dark:text-white">Business Meetup — Payments & Finance</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Financial oversight across all business networking programs</p>
        </div>
        <LoadingState message="Loading payments..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
          <h1 className="text-2xl text-gray-900 dark:text-white">Business Meetup — Payments & Finance</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Financial oversight across all business networking programs</p>
        </div>
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  const payoutRequests: PayoutRequest[] = [
    {
      id: 'PO-BM-4521',
      providerId: 'E-7821',
      providerName: 'Rajesh Kumar - CEO Coach',
      program: 'Find Experienced',
      amount: '₹45,000',
      bookingIds: ['BM-7821', 'BM-7819'],
      requestDate: '2024-12-27',
      status: 'Pending',
      bankAccount: '****8901'
    },
    {
      id: 'PO-BM-4520',
      providerId: 'I-5431',
      providerName: 'Venture Partners LLC',
      program: 'Find Investor',
      amount: '₹125,000',
      bookingIds: ['BM-7822'],
      requestDate: '2024-12-26',
      status: 'Approved',
      bankAccount: '****2341'
    },
    {
      id: 'PO-BM-4519',
      providerId: 'P-3421',
      providerName: 'Priya Mehta - Marketing Expert',
      program: 'Peer-to-Peer',
      amount: '₹18,500',
      bookingIds: ['BM-7820', 'BM-7818', 'BM-7815'],
      requestDate: '2024-12-25',
      status: 'Pending',
      bankAccount: '****5678'
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
      `${p.id},${p.providerName},${p.program},${p.amount},${p.status},${p.requestDate}`
    ).join('\n');
    const blob = new Blob([`ID,Provider,Program,Amount,Status,Date\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `business-meetup-payouts-${new Date().toISOString().split('T')[0]}.csv`;
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

  const getProgramBadge = (program: string) => {
    const styles = {
      'Peer-to-Peer': 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400',
      'Find Investor': 'bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400',
      'Find Experienced': 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400',
    };
    return styles[program as keyof typeof styles] || styles['Peer-to-Peer'];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <h1 className="text-2xl text-gray-900 dark:text-white">Business Meetup — Payments & Finance</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Financial oversight across all business networking programs</p>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Total Revenue', value: '₹4.2M', subtext: 'This month', color: 'green', icon: TrendingUp },
            { label: 'Pending Payouts', value: '₹890K', subtext: '24 requests', color: 'yellow', icon: AlertCircle },
            { label: 'Paid Out', value: '₹3.1M', subtext: 'This month', color: 'blue', icon: TrendingUp },
            { label: 'Platform Commission', value: '₹520K', subtext: '12% avg', color: 'purple', icon: TrendingUp },
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
                <strong>Manual Approval Required for All Business Payouts</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                All business meetup payouts must be manually reviewed. Verify completion confirmations from both parties before approval.
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
                  value={programFilter}
                  onChange={(e) => setProgramFilter(e.target.value)}
                  className="px-3 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
                >
                  <option>All Programs</option>
                  <option>Peer-to-Peer</option>
                  <option>Find Investor</option>
                  <option>Find Experienced</option>
                </select>
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

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Payout ID</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Provider</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Program</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Amount</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Bookings</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Bank Account</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Request Date</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Status</th>
                  <th className="px-6 py-3 text-right text-xs text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {payoutRequests.map((payout) => (
                  <tr key={payout.id} className="hover:bg-gray-50 dark:hover:bg-[#0A0F1F]">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">{payout.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{payout.providerName}</p>
                        <p className="text-xs text-gray-500">{payout.providerId}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getProgramBadge(payout.program)}`}>
                        {payout.program}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{payout.amount}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {payout.bookingIds.map((id) => (
                          <span key={id} className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                            {id}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-700 dark:text-gray-300">{payout.bankAccount}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{payout.requestDate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(payout.status)}`}>
                        {payout.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showApprovalModal && selectedPayout && (
        <ConfirmationModal
          title="Approve Business Payout"
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
          title="Reject Business Payout"
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