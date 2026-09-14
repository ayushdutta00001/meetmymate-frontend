import React, { useState } from 'react';
import { Search, Filter, DollarSign, Eye, RotateCcw, TrendingUp, TrendingDown } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
export function FriendMarketplacePayments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Revenue Summary
  const revenueSummary = [
    {
      id: 1,
      label: 'Total Revenue',
      value: '₹12,45,800',
      change: '+18.2%',
      trend: 'up',
    },
    {
      id: 2,
      label: 'Platform Commission',
      value: '₹2,49,160',
      change: '+18.2%',
      trend: 'up',
    },
    {
      id: 3,
      label: 'Provider Earnings',
      value: '₹9,96,640',
      change: '+18.2%',
      trend: 'up',
    },
    {
      id: 4,
      label: 'Pending Payouts',
      value: '₹1,24,500',
      change: '-5.3%',
      trend: 'down',
    },
  ];

  // Transactions Data
  const transactions = [
    {
      id: 'TXN-8847',
      bookingId: 'BK-2847',
      customer: 'Priya Sharma',
      provider: 'Rahul Verma',
      service: 'Movie Buddy',
      amount: 1500,
      commission: 300,
      providerEarning: 1200,
      status: 'completed',
      date: '2026-04-15 6:30 PM',
    },
    {
      id: 'TXN-8846',
      bookingId: 'BK-2846',
      customer: 'Amit Patel',
      provider: 'Sneha Reddy',
      service: 'Dining Partner',
      amount: 2000,
      commission: 400,
      providerEarning: 1600,
      status: 'completed',
      date: '2026-04-14 8:15 PM',
    },
    {
      id: 'TXN-8845',
      bookingId: 'BK-2845',
      customer: 'Neha Singh',
      provider: 'Vikram Kumar',
      service: 'Explore City',
      amount: 2500,
      commission: 500,
      providerEarning: 2000,
      status: 'pending',
      date: '2026-04-16 10:00 AM',
    },
    {
      id: 'TXN-8844',
      bookingId: 'BK-2844',
      customer: 'Rohan Mehta',
      provider: 'Anjali Desai',
      service: 'Party Companion',
      amount: 3000,
      commission: 600,
      providerEarning: 2400,
      status: 'completed',
      date: '2026-04-13 9:45 PM',
    },
    {
      id: 'TXN-8843',
      bookingId: 'BK-2843',
      customer: 'Kavya Iyer',
      provider: 'Arjun Singh',
      service: 'Emotional Support',
      amount: 1800,
      commission: 360,
      providerEarning: 1440,
      status: 'refunded',
      date: '2026-04-12 3:20 PM',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
      case 'refunded':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400';
      case 'failed':
        return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400';
    }
  };

  const handleViewDetails = (transactionId: string) => {
    alert(`View transaction details: ${transactionId}`);
  };

  const handleRefund = (transactionId: string) => {
    alert(`Process refund for: ${transactionId}`);
  };

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.provider.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || txn.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Payments Management</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Track transactions, commissions, and provider payouts
        </p>
      </div>

      {/* Revenue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {revenueSummary.map((item) => (
          <div
            key={item.id}
            className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex items-center gap-1">
                {item.trend === 'up' ? (
                  <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
                <span
                  className={`text-xs ${
                    item.trend === 'up'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {item.change}
                </span>
              </div>
            </div>
            <div>
              <p className="text-2xl text-gray-900 dark:text-white mb-1">{item.value}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by transaction ID, booking ID, or names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Transaction ID
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Commission (20%)
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Provider Earning
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">{txn.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-blue-600 dark:text-blue-400">{txn.bookingId}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">{txn.customer}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">{txn.provider}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">₹{txn.amount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-green-600 dark:text-green-400">₹{txn.commission}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">₹{txn.providerEarning}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(txn.status)}`}>
                      {txn.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(txn.id)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                      {txn.status === 'completed' && (
                        <button
                          onClick={() => handleRefund(txn.id)}
                          className="p-2 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors"
                          title="Refund"
                        >
                          <RotateCcw className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                        </button>
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
  );
}
