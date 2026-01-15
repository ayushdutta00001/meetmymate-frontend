import React, { useState } from 'react';
import { Download, TrendingUp, AlertCircle } from 'lucide-react';
import { ConfirmationModal } from '../../../admin/ConfirmationModal';
import { ScrollableTable, TableHeadCell, TableCell } from '../../../ui/ScrollableTable';

interface PayoutRequest {
  id: string;
  userId: string;
  userName: string;
  company: string;
  amount: string;
  matchIds: string[];
  requestDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  bankAccount: string;
}

export function P2PMatchPayments() {
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [selectedPayout, setSelectedPayout] = useState<PayoutRequest | null>(null);

  const payouts: PayoutRequest[] = [
    {
      id: 'PO-P2P-2031',
      userId: 'U-7821',
      userName: 'Rajesh Kumar',
      company: 'TechStartup Inc',
      amount: '₹15,000',
      matchIds: ['P2P-3021', 'P2P-3018'],
      requestDate: '2024-12-27',
      status: 'Pending',
      bankAccount: '****5678'
    },
  ];

  const handleExport = () => {
    const csvContent = payouts.map(p =>
      `${p.id},${p.userName},${p.company},${p.amount},${p.status},${p.requestDate}`
    ).join('\n');
    const blob = new Blob([`ID,Name,Company,Amount,Status,Date\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `p2p-payouts-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Pending: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300',
      Approved: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300',
      Rejected: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300',
    };
    return styles[status as keyof typeof styles];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <h1 className="text-2xl text-gray-900 dark:text-white">Peer-to-Peer Match — Payments & Finance</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Financial management for P2P matches</p>
      </div>

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'Total Revenue', value: '₹850K', subtext: 'This month', color: 'green' },
            { label: 'Pending Payouts', value: '₹120K', subtext: '8 requests', color: 'yellow' },
            { label: 'Platform Commission', value: '₹85K', subtext: '10% avg', color: 'purple' },
            { label: 'Avg Match Value', value: '₹5,500', subtext: 'Per session', color: 'blue' },
          ].map((metric, idx) => (
            <div key={idx} className={`bg-white dark:bg-[#1A1F2E] border-l-4 border-${metric.color}-500 p-4 rounded-lg`}>
              <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
              <p className="text-2xl text-gray-900 dark:text-white mt-1">{metric.value}</p>
              <p className="text-xs text-gray-500 mt-1">{metric.subtext}</p>
            </div>
          ))}
        </div>

        <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-300 dark:border-orange-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-900 dark:text-white mb-1">
                <strong>Manual Approval Required</strong>
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                All P2P match payouts must be manually reviewed before transfer.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-lg text-gray-900 dark:text-white">Payout Requests</h2>
            <button onClick={handleExport} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>
          <div className="overflow-x-auto">
            <ScrollableTable>
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <TableHeadCell sticky>Payout ID</TableHeadCell>
                    <TableHeadCell>User</TableHeadCell>
                    <TableHeadCell>Company</TableHeadCell>
                    <TableHeadCell>Amount</TableHeadCell>
                    <TableHeadCell>Matches</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                    <TableHeadCell align="right">Actions</TableHeadCell>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {payouts.map((payout) => (
                    <tr key={payout.id} className="hover:bg-gray-50 dark:hover:bg-[#0A0F1F]">
                      <TableCell sticky className="font-mono">{payout.id}</TableCell>
                      <TableCell>{payout.userName}</TableCell>
                      <TableCell>{payout.company}</TableCell>
                      <TableCell>{payout.amount}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {payout.matchIds.map(id => (
                            <span key={id} className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{id}</span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(payout.status)}`}>
                          {payout.status}
                        </span>
                      </TableCell>
                      <TableCell align="right">
                        {payout.status === 'Pending' && (
                          <button
                            onClick={() => { setSelectedPayout(payout); setShowApprovalModal(true); }}
                            className="px-3 py-1.5 text-xs bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded hover:bg-green-100"
                          >
                            Approve
                          </button>
                        )}
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollableTable>
          </div>
        </div>
      </div>

      {showApprovalModal && selectedPayout && (
        <ConfirmationModal
          title="Approve P2P Payout"
          message={`Approve payout ${selectedPayout.id} for ${selectedPayout.amount} to ${selectedPayout.userName}?`}
          consequence="This will initiate the bank transfer and cannot be reversed."
          confirmText="Approve Payout"
          confirmStyle="success"
          onConfirm={() => { console.log('Approved'); setShowApprovalModal(false); }}
          onCancel={() => setShowApprovalModal(false)}
        />
      )}
    </div>
  );
}