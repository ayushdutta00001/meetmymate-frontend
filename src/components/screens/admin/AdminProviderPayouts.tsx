import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  DollarSign,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Filter,
  Search,
  Download,
  AlertCircle,
  TrendingUp,
  Users,
  Calendar,
  CreditCard,
  Building,
} from 'lucide-react';

interface ProviderPayout {
  id: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  totalEarnings: number;
  platformFee: number;
  paymentFees: number;
  netPayout: number;
  bookingsCount: number;
  periodStart: string;
  periodEnd: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  requestedDate: string;
  processedDate?: string;
  paymentMethod: string;
  accountDetails: string;
  transactionId?: string;
}

export function AdminProviderPayouts() {
  const [activeTab, setActiveTab] = useState<'pending' | 'processing' | 'completed' | 'failed' | 'all'>('pending');
  const [selectedPayout, setSelectedPayout] = useState<ProviderPayout | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock payout data - in real app, this comes from database
  const payouts: ProviderPayout[] = [
    {
      id: 'PO-2024-001',
      providerId: 'PRV-2134',
      providerName: 'Priya Sharma',
      providerEmail: 'priya.s@email.com',
      totalEarnings: 15000,
      platformFee: 3000,
      paymentFees: 375,
      netPayout: 11625,
      bookingsCount: 12,
      periodStart: '2024-12-01',
      periodEnd: '2024-12-15',
      status: 'pending',
      requestedDate: '2024-12-16 10:00',
      paymentMethod: 'Bank Transfer',
      accountDetails: 'HDFC Bank - XXXX4521',
    },
    {
      id: 'PO-2024-002',
      providerId: 'PRV-3421',
      providerName: 'Rahul Mehta',
      providerEmail: 'rahul.m@email.com',
      totalEarnings: 8500,
      platformFee: 1700,
      paymentFees: 212.5,
      netPayout: 6587.5,
      bookingsCount: 8,
      periodStart: '2024-12-01',
      periodEnd: '2024-12-15',
      status: 'processing',
      requestedDate: '2024-12-16 09:30',
      processedDate: '2024-12-16 14:00',
      paymentMethod: 'UPI',
      accountDetails: 'rahul@paytm',
    },
    {
      id: 'PO-2024-003',
      providerId: 'PRV-5678',
      providerName: 'Ananya Kumar',
      providerEmail: 'ananya.k@email.com',
      totalEarnings: 22000,
      platformFee: 4400,
      paymentFees: 550,
      netPayout: 17050,
      bookingsCount: 18,
      periodStart: '2024-11-16',
      periodEnd: '2024-11-30',
      status: 'completed',
      requestedDate: '2024-12-01 10:00',
      processedDate: '2024-12-02 16:30',
      paymentMethod: 'Bank Transfer',
      accountDetails: 'ICICI Bank - XXXX7890',
      transactionId: 'TXN123456789',
    },
    {
      id: 'PO-2024-004',
      providerId: 'PRV-7890',
      providerName: 'Karan Singh',
      providerEmail: 'karan.s@email.com',
      totalEarnings: 12000,
      platformFee: 2400,
      paymentFees: 300,
      netPayout: 9300,
      bookingsCount: 10,
      periodStart: '2024-12-01',
      periodEnd: '2024-12-15',
      status: 'pending',
      requestedDate: '2024-12-16 11:15',
      paymentMethod: 'Bank Transfer',
      accountDetails: 'SBI Bank - XXXX3421',
    },
    {
      id: 'PO-2024-005',
      providerId: 'PRV-4567',
      providerName: 'Meera Joshi',
      providerEmail: 'meera.j@email.com',
      totalEarnings: 5500,
      platformFee: 1100,
      paymentFees: 137.5,
      netPayout: 4262.5,
      bookingsCount: 5,
      periodStart: '2024-12-01',
      periodEnd: '2024-12-15',
      status: 'failed',
      requestedDate: '2024-12-16 08:45',
      processedDate: '2024-12-16 15:00',
      paymentMethod: 'Bank Transfer',
      accountDetails: 'Axis Bank - XXXX6789',
    },
  ];

  const stats = {
    all: payouts.length,
    pending: payouts.filter(p => p.status === 'pending').length,
    processing: payouts.filter(p => p.status === 'processing').length,
    completed: payouts.filter(p => p.status === 'completed').length,
    failed: payouts.filter(p => p.status === 'failed').length,
    totalPending: payouts
      .filter(p => p.status === 'pending')
      .reduce((sum, p) => sum + p.netPayout, 0),
    totalCompleted: payouts
      .filter(p => p.status === 'completed')
      .reduce((sum, p) => sum + p.netPayout, 0),
    totalPlatformRevenue: payouts.reduce((sum, p) => sum + p.platformFee + p.paymentFees, 0),
  };

  const filteredPayouts = payouts.filter(payout => {
    const matchesTab = activeTab === 'all' || payout.status === activeTab;
    const matchesSearch =
      payout.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payout.providerId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleApprovePayout = (payoutId: string) => {
    console.log('Approving payout:', payoutId);
    // In real app: API call to process payout
    setShowDetailsModal(false);
  };

  const handleRejectPayout = (payoutId: string) => {
    console.log('Rejecting payout:', payoutId);
    // In real app: API call to reject payout
    setShowDetailsModal(false);
  };

  const handleRetryPayout = (payoutId: string) => {
    console.log('Retrying payout:', payoutId);
    // In real app: API call to retry failed payout
    setShowDetailsModal(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl mb-2">Provider Payouts</h2>
            <p className="text-gray-600">Manage provider earnings and payment processing</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-xl hover:bg-gray-50 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">Total Payouts</p>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl mb-1">{stats.all}</p>
            <p className="text-xs text-gray-500">All requests</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">Pending</p>
              <Clock className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-2xl mb-1">{stats.pending}</p>
            <p className="text-xs text-gray-500">Need approval</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">Completed</p>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl mb-1">{stats.completed}</p>
            <p className="text-xs text-gray-500">Paid out</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 shadow-lg text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/90">Pending Amount</p>
              <DollarSign className="w-4 h-4" />
            </div>
            <p className="text-2xl mb-1">₹{Math.round(stats.totalPending).toLocaleString()}</p>
            <p className="text-xs text-white/80">To be paid</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 shadow-lg text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/90">Platform Revenue</p>
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-2xl mb-1">₹{Math.round(stats.totalPlatformRevenue).toLocaleString()}</p>
            <p className="text-xs text-white/80">Total earned</p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 p-1 bg-white/70 rounded-xl border border-gray-200/50 backdrop-blur-xl overflow-x-auto">
          {(['pending', 'processing', 'completed', 'failed', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 rounded-lg transition-all text-sm whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              style={{ fontWeight: activeTab === tab ? 600 : 500 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab !== 'all' && ` (${stats[tab]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by payout ID, provider name, or provider ID..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-xl focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Payouts Table */}
      <div className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Payout ID</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Period</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Bookings</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Total Earnings</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Platform Fee</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Net Payout</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono text-gray-900">{payout.id}</p>
                    <p className="text-xs text-gray-500">{payout.requestedDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm">
                        {payout.providerName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{payout.providerName}</p>
                        <p className="text-xs text-gray-500">{payout.providerId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {payout.periodStart}
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <span>to</span>
                        {payout.periodEnd}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{payout.bookingsCount}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">₹{payout.totalEarnings.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">₹{payout.platformFee.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">+₹{payout.paymentFees.toFixed(0)} fee</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">₹{Math.round(payout.netPayout).toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(payout.status)}`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedPayout(payout);
                        setShowDetailsModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredPayouts.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 mb-1">No payout requests found</p>
            <p className="text-sm text-gray-500">Payout requests will appear here</p>
          </div>
        )}
      </div>

      {/* Payout Details Modal */}
      {showDetailsModal && selectedPayout && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="mb-2">Payout Details</h3>
                  <p className="text-sm text-gray-600">{selectedPayout.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(selectedPayout.status)}`}>
                  {selectedPayout.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Provider Information */}
              <div>
                <h4 className="text-sm mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Provider Information
                </h4>
                <div className="p-4 rounded-lg bg-gray-50 space-y-2">
                  <div>
                    <p className="text-xs text-gray-500">Provider Name</p>
                    <p className="text-sm">{selectedPayout.providerName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Provider ID</p>
                    <p className="text-sm">{selectedPayout.providerId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-sm">{selectedPayout.providerEmail}</p>
                  </div>
                </div>
              </div>

              {/* Period & Bookings */}
              <div>
                <h4 className="text-sm mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Period & Activity
                </h4>
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-blue-50">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Period Start</p>
                    <p className="text-sm">{selectedPayout.periodStart}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Period End</p>
                    <p className="text-sm">{selectedPayout.periodEnd}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Total Bookings</p>
                    <p className="text-sm">{selectedPayout.bookingsCount}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Requested Date</p>
                    <p className="text-sm">{selectedPayout.requestedDate}</p>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div>
                <h4 className="text-sm mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Financial Breakdown
                </h4>
                <div className="p-4 rounded-lg bg-green-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-lg">₹{selectedPayout.totalEarnings.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Platform Commission (20%)</p>
                    <p className="text-sm text-red-600">-₹{selectedPayout.platformFee.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Payment Processing Fee (2.5%)</p>
                    <p className="text-sm text-red-600">-₹{selectedPayout.paymentFees.toFixed(0)}</p>
                  </div>
                  <div className="pt-3 border-t border-green-200 flex items-center justify-between">
                    <p className="text-sm">Net Payout to Provider</p>
                    <p className="text-2xl text-green-600">₹{Math.round(selectedPayout.netPayout).toLocaleString()}</p>
                  </div>
                  <div className="pt-2 border-t border-green-200 flex items-center justify-between">
                    <p className="text-sm text-purple-600">Platform Keeps</p>
                    <p className="text-lg text-purple-600">₹{Math.round(selectedPayout.platformFee + selectedPayout.paymentFees).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h4 className="text-sm mb-3 flex items-center gap-2">
                  <CreditCard className="w-4 h-4" />
                  Payment Details
                </h4>
                <div className="p-4 rounded-lg bg-gray-50 space-y-2">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                    <p className="text-sm">{selectedPayout.paymentMethod}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Account Details</p>
                    <p className="text-sm flex items-center gap-2">
                      <Building className="w-3 h-3" />
                      {selectedPayout.accountDetails}
                    </p>
                  </div>
                  {selectedPayout.transactionId && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Transaction ID</p>
                      <p className="text-sm font-mono">{selectedPayout.transactionId}</p>
                    </div>
                  )}
                  {selectedPayout.processedDate && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Processed Date</p>
                      <p className="text-sm">{selectedPayout.processedDate}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Warning for Failed */}
              {selectedPayout.status === 'failed' && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-red-900">
                    <p className="mb-1">Payment Failed</p>
                    <p className="text-xs text-red-700">
                      The payment transfer failed. This could be due to incorrect account details or insufficient balance.
                      Please verify the details and retry.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-all"
              >
                Close
              </button>
              {selectedPayout.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleRejectPayout(selectedPayout.id)}
                    className="flex-1 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprovePayout(selectedPayout.id)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all"
                  >
                    Approve & Process
                  </button>
                </>
              )}
              {selectedPayout.status === 'failed' && (
                <button
                  onClick={() => handleRetryPayout(selectedPayout.id)}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg transition-all"
                >
                  Retry Payment
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
