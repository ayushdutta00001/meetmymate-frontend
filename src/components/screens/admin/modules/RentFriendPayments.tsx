import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Download, CheckCircle, XCircle, Clock, AlertCircle, DollarSign } from 'lucide-react';
import { ScrollableTable, TableHeadCell, TableCell } from '../../../ui/ScrollableTable';
import { usePayments } from '../../../../lib/hooks';
import { LoadingState } from '../../../ui/LoadingState';
import { ErrorState } from '../../../ui/ErrorState';
import { ApiStateWrapper } from '../../../ui/ApiStateWrapper';
import { ResponsiveContainer, PageHeader, Card, Grid } from '../../../ui/ResponsiveContainer';
import { ResponsiveTable } from '../../../ui/ResponsiveTable';
import { ResponsiveButton } from '../../../ui/ResponsiveButton';
import { StatusBadge } from '../../../ui/StatusBadge';

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

export function RentFriendPayments() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { payments, loading, error, refetch, totalRevenue, pendingPayments } = usePayments({
    serviceType: 'rent-friend',
    autoFetch: true
  });

  const payoutRequests: PayoutRequest[] = [
    {
      id: 'PO-5021',
      providerId: 'P-2341',
      providerName: 'Priya Mehta',
      amount: '₹15,750',
      bookingIds: ['RF-10021', 'RF-10018', 'RF-10015'],
      requestDate: '2024-12-27',
      status: 'Pending',
      bankAccount: '****4521'
    },
    {
      id: 'PO-5020',
      providerId: 'P-1892',
      providerName: 'Sneha Patel',
      amount: '₹22,400',
      bookingIds: ['RF-10022', 'RF-10019'],
      requestDate: '2024-12-26',
      status: 'Approved',
      bankAccount: '****7832'
    },
    {
      id: 'PO-5019',
      providerId: 'P-3421',
      providerName: 'Anjali Reddy',
      amount: '₹8,500',
      bookingIds: ['RF-10020'],
      requestDate: '2024-12-25',
      status: 'On Hold',
      bankAccount: '****2910'
    },
  ];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = searchQuery === '' ||
      payment.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.transaction_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || payment.status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      Pending: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-500/30',
      Approved: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/30',
      Rejected: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30',
      'On Hold': 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-500/30',
      Completed: 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-500/30',
    };
    return styles[status as keyof typeof styles] || styles.Pending;
  };

  // Define payout columns
  const payoutColumns = [
    {
      key: 'id',
      label: 'Payout ID',
      render: (payout: PayoutRequest) => (
        <span className="text-xs md:text-sm text-gray-900 dark:text-white font-mono">
          {payout.id}
        </span>
      ),
    },
    {
      key: 'provider',
      label: 'Provider',
      render: (payout: PayoutRequest) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white" style={{ fontWeight: 500 }}>
            {payout.providerName}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{payout.providerId}</p>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (payout: PayoutRequest) => (
        <span className="text-sm text-gray-900 dark:text-white" style={{ fontWeight: 600 }}>
          {payout.amount}
        </span>
      ),
    },
    {
      key: 'bookings',
      label: 'Bookings',
      hideOnMobile: true,
      render: (payout: PayoutRequest) => (
        <div className="flex flex-wrap gap-1">
          {payout.bookingIds.map((id) => (
            <span key={id} className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
              {id}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: 'bank',
      label: 'Bank Account',
      hideOnMobile: true,
      render: (payout: PayoutRequest) => (
        <span className="text-sm text-gray-700 dark:text-gray-300 font-mono">
          {payout.bankAccount}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Request Date',
      hideOnMobile: true,
      render: (payout: PayoutRequest) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {payout.requestDate}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (payout: PayoutRequest) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(payout.status)}`}>
          {payout.status}
        </span>
      ),
    },
  ];

  // Define transaction columns
  const transactionColumns = [
    {
      key: 'id',
      label: 'Transaction ID',
      render: (tx: any) => (
        <span className="text-xs md:text-sm text-gray-900 dark:text-white font-mono">
          {tx.transaction_id}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (tx: any) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {tx.type}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (tx: any) => (
        <span className={`text-sm ${tx.amount.startsWith('-') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`} style={{ fontWeight: 600 }}>
          {tx.amount}
        </span>
      ),
    },
    {
      key: 'user',
      label: 'User',
      hideOnMobile: true,
      render: (tx: any) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {tx.user_name}
        </span>
      ),
    },
    {
      key: 'date',
      label: 'Date',
      hideOnMobile: true,
      render: (tx: any) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {tx.date}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (tx: any) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(tx.status)}`}>
          {tx.status}
        </span>
      ),
    },
  ];

  return (
    <ApiStateWrapper
      loading={loading}
      error={error}
      onRetry={refetch}
      empty={payments.length === 0}
      emptyTitle="No payments found"
      emptyDescription="There are no Rent-a-Friend payments in the system yet."
    >
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        {/* Page Header - Responsive */}
        <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <ResponsiveContainer maxWidth="full" padding={false}>
            <PageHeader
              title="Rent-a-Friend — Payments & Finance"
              description="Financial control and payout management"
            />
          </ResponsiveContainer>
        </div>

        <ResponsiveContainer maxWidth="full" className="py-4 md:py-6 lg:py-8">
          {/* Financial Summary - Responsive Grid */}
          <Grid columns={4} gap="md" className="mb-6">
            {[
              { label: 'Total Revenue', value: '₹2.5M', subtext: 'This month', color: 'green' },
              { label: 'Pending Payouts', value: '₹456K', subtext: '23 requests', color: 'yellow' },
              { label: 'Paid Out', value: '₹1.8M', subtext: 'This month', color: 'blue' },
              { label: 'Refunds Issued', value: '₹125K', subtext: '5% of revenue', color: 'red' },
            ].map((metric, idx) => (
              <Card key={idx} className={`border-l-4 border-${metric.color}-500`}>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                <p className="text-xl md:text-2xl text-gray-900 dark:text-white mt-1" style={{ fontWeight: 600 }}>
                  {metric.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{metric.subtext}</p>
              </Card>
            ))}
          </Grid>

          {/* Manual Approval Banner */}
          <Card className="mb-6 bg-orange-50 dark:bg-orange-500/10 border-orange-300 dark:border-orange-500/30">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm text-gray-900 dark:text-white mb-1">
                  <strong>Manual Approval Required for All Payouts</strong>
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  All payout requests must be manually reviewed and approved by an admin before processing. Verify bank details and booking completion before approval.
                </p>
              </div>
            </div>
          </Card>

          {/* Payout Approval Queue */}
          <Card padding={false} className="mb-6">
            <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h2 className="text-lg text-gray-900 dark:text-white">Payout Approval Queue</h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                  >
                    <option>All Status</option>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>On Hold</option>
                    <option>Rejected</option>
                  </select>
                  <ResponsiveButton
                    variant="primary"
                    icon={<Download className="w-4 h-4" />}
                  >
                    Export
                  </ResponsiveButton>
                </div>
              </div>
            </div>
            <div className="p-4 md:p-6">
              <ResponsiveTable
                data={payoutRequests}
                columns={payoutColumns}
                keyExtractor={(payout) => payout.id}
                onRowClick={(payout) => {
                  console.log('View payout:', payout);
                }}
                emptyMessage="No payout requests found"
              />
            </div>
          </Card>

          {/* Transaction Ledger */}
          <Card padding={false} className="mb-6">
            <div className="px-4 md:px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg text-gray-900 dark:text-white">Transaction Ledger</h2>
            </div>
            <div className="p-4 md:p-6">
              <ResponsiveTable
                data={filteredPayments}
                columns={transactionColumns}
                keyExtractor={(tx) => tx.id}
                onRowClick={(tx) => {
                  console.log('View transaction:', tx);
                }}
                emptyMessage="No transactions found"
              />
            </div>
          </Card>

          {/* Refund Policy Guidelines */}
          <Card>
            <h2 className="text-lg text-gray-900 dark:text-white mb-4">Refund Policy Guidelines</h2>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p><strong>Full Refund:</strong> Cancellation 24+ hours before booking</p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <p><strong>50% Refund:</strong> Cancellation 6-24 hours before booking</p>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <p><strong>No Refund:</strong> Cancellation less than 6 hours before booking</p>
              </div>
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                <p><strong>Provider No-Show:</strong> Full refund + provider penalty</p>
              </div>
            </div>
          </Card>
        </ResponsiveContainer>
      </div>
    </ApiStateWrapper>
  );
}