import { api } from '../../../../lib/api';

import React, { useState, useEffect } from 'react';

import { motion } from 'motion/react';
import { DollarSign, TrendingUp, AlertCircle, CheckCircle2, Search, Filter } from 'lucide-react';

export function BlindDatePayments() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
const [payments, setPayments] = useState<any[]>([]);
const [isLoading, setIsLoading] = useState(true);

// ============================
// 🔥 REAL FINANCE STATS ENGINE
// ============================

const totalRevenue = payments
  .filter(p => p.status === 'paid')
  .reduce((sum, p) => sum + (p.amount || 0), 0);

const thisMonthRevenue = payments
  .filter(p => {
    if (p.status !== 'paid') return false;
    const d = new Date(p.timestamp);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  })
  .reduce((sum, p) => sum + (p.amount || 0), 0);

const refundsIssued = payments
  .filter(p => p.status === 'refunded')
  .reduce((sum, p) => sum + (p.amount || 0), 0);

const successRate =
  payments.length > 0
    ? (
        (payments.filter(p => p.status === 'paid').length /
          payments.length) *
        100
      ).toFixed(1)
    : '0';

  const loadPayments = async () => {
  try {
    setIsLoading(true);

    const res = await api.get<any[]>('admin_list_blind_date_bookings');

    console.log('PAYMENTS DATA:', res);

    if (!res.success) return;
const mapped = (res.data || []).map((b: any) => ({
  id: b.payment_id ?? `PAY-${b.id?.slice(0, 5)}`,
  bookingId: b.id,
  userName: b.users?.name ?? 'Unknown User',
  amount: b.amount ?? 0,
  status: (b.payment_status ?? 'pending').toLowerCase(),
  method: b.payment_method ?? 'UPI',
  timestamp: b.created_at,
}));

    setPayments(mapped);
  } catch (err) {
    console.error('Payment load error', err);
  } finally {
    setIsLoading(false);
  }
};
useEffect(() => {
  loadPayments();
}, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-6">
          <h1 className="text-2xl lg:text-3xl text-white mb-2" style={{ fontWeight: 700 }}>
            Payments & Finance
          </h1>
          <p className="text-sm text-gray-400">Track revenue and manage payment transactions</p>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <DollarSign className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Total Revenue</p>
            <p className="text-3xl text-white" style={{ fontWeight: 700 }}>
              ₹{totalRevenue.toLocaleString()}

            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <TrendingUp className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">This Month</p>
            <p className="text-3xl text-white" style={{ fontWeight: 700 }}>
             ₹{thisMonthRevenue.toLocaleString()}

            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-orange-500/20">
                <AlertCircle className="w-6 h-6 text-orange-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Refunds Issued</p>
            <p className="text-3xl text-white" style={{ fontWeight: 700 }}>
              ₹{refundsIssued.toLocaleString()}

            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Success Rate</p>
            <p className="text-3xl text-white" style={{ fontWeight: 700 }}>
              {successRate}%
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search payment ID or booking ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none placeholder:text-gray-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-xl border border-gray-700 bg-gray-900/50 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              style={{ fontWeight: 500 }}
            >
              <option>All</option>
              <option>Paid</option>
              <option>Refunded</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900/90 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">Payment ID</th>
                <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">Booking</th>
                <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">Method</th>
                <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
             {payments.length === 0 && (
  <tr>
    <td colSpan={7} className="px-6 py-10 text-center text-gray-400">
      No payments found
    </td>
  </tr>
)}

{payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <span className="text-sm text-white" style={{ fontWeight: 600 }}>
                      {payment.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{payment.bookingId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{payment.userName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-white" style={{ fontWeight: 600 }}>
                      ₹{payment.amount}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{payment.method}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs border ${
                        payment.status === 'paid'

                          ? 'bg-green-500/20 text-green-300 border-green-500/30'
                          : 'bg-orange-500/20 text-orange-300 border-orange-500/30'
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500">
                      {new Date(payment.timestamp).toLocaleString('en-IN')}
                    </span>
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
