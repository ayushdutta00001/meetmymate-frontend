import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { api } from '../../../../lib/api';

import { AlertTriangle, Search, Eye, CheckCircle2, XCircle } from 'lucide-react';

export function BlindDateDisputes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
const [disputes, setDisputes] = useState<any[]>([]);
const [loading, setLoading] = useState(true);
const [selectedDispute, setSelectedDispute] = useState<any>(null);


 const loadDisputes = async () => {
  try {
    setLoading(true);

    const res = await api.get<any[]>('admin_list_blind_date_bookings');

    console.log('DISPUTES DATA:', res);

    if (!res.success) return;

    // 🚨 Disputes = refunded bookings
    const refundCases = (res.data || []).filter(
      (b: any) => b.status === 'refunded'
    );

    const mapped = refundCases.map((b: any) => ({
      id: `DSP-${b.id.slice(0,6)}`,
      bookingId: b.id,
      userName: b.users?.name || 'Unknown',
      type: 'Refund Case',
      reason: 'Auto-generated from refunded booking',
      status: 'pending',
      priority: 'high',
      createdAt: b.created_at,
      raw: b
    }));

    setDisputes(mapped);

  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  loadDisputes();
}, []);

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center text-gray-400">
      Loading disputes...
    </div>
  );
}
function DisputeDrawer({ dispute, onClose }: any) {
  return (
    <motion.div
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed right-0 top-0 h-screen w-full max-w-xl bg-gray-950 border-l border-gray-800 z-50 p-6"
    >
      <h2 className="text-xl text-white mb-4" style={{ fontWeight: 700 }}>
        Dispute Control
      </h2>

      <p className="text-sm text-gray-400 mb-2">Booking:</p>
      <p className="text-white mb-6">{dispute.bookingId}</p>

      <div className="space-y-3">

        <button className="w-full py-3 bg-green-600 rounded-xl text-white">
          Approve Refund
        </button>

        <button className="w-full py-3 bg-blue-600 rounded-xl text-white">
          Investigate
        </button>

        <button className="w-full py-3 bg-red-600 rounded-xl text-white">
          Reject Case
        </button>

        <button
          onClick={onClose}
          className="w-full py-3 bg-gray-700 rounded-xl text-white"
        >
          Close
        </button>

      </div>
    </motion.div>
  );
}


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-black pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900/95 to-gray-950/95 backdrop-blur-xl border-b border-gray-800/50 sticky top-0 z-30">
        <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-6">
          <h1 className="text-2xl lg:text-3xl text-white mb-2" style={{ fontWeight: 700 }}>
            Disputes & Reports
          </h1>
          <p className="text-sm text-gray-400">Handle user complaints and refund requests</p>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto px-4 lg:px-8 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-yellow-500/20">
                <AlertTriangle className="w-6 h-6 text-yellow-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Pending</p>
            <p className="text-3xl text-white" style={{ fontWeight: 700 }}>
              2
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20">
                <Eye className="w-6 h-6 text-blue-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Investigating</p>
            <p className="text-3xl text-white" style={{ fontWeight: 700 }}>
              1
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-green-500/20">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Resolved</p>
            <p className="text-3xl text-white" style={{ fontWeight: 700 }}>
              8
            </p>
          </div>

          <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-red-500/20">
                <XCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">Rejected</p>
            <p className="text-3xl text-white" style={{ fontWeight: 700 }}>
              1
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
                placeholder="Search dispute ID or booking ID..."
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
              <option>Pending</option>
              <option>Investigating</option>
              <option>Resolved</option>
              <option>Rejected</option>
            </select>
          </div>
        </div>

        {/* Disputes Table */}
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-900/90 border-b border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">Dispute ID</th>
                <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">Booking</th>
                <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">Created</th>
                <th className="px-6 py-4 text-left text-xs text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {disputes.map((dispute) => (
                <tr key={dispute.id} className="hover:bg-gray-800/50">
                  <td className="px-6 py-4">
                    <span className="text-sm text-white" style={{ fontWeight: 600 }}>
                      {dispute.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{dispute.bookingId}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{dispute.userName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-300">{dispute.type}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-400">{dispute.reason}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs border ${
                        dispute.priority === 'high'
                          ? 'bg-red-500/20 text-red-300 border-red-500/30'
                          : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {dispute.priority.charAt(0).toUpperCase() + dispute.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs border ${
                        dispute.status === 'pending'
                          ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                          : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {dispute.status.charAt(0).toUpperCase() + dispute.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-gray-500">
                      {new Date(dispute.createdAt).toLocaleString('en-IN')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
  onClick={() => setSelectedDispute(dispute)}
  className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
>

                      <Eye className="w-5 h-5 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AnimatePresence>
  {selectedDispute && (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedDispute(null)}
        className="fixed inset-0 bg-black/70 z-40"
      />
      <DisputeDrawer
        dispute={selectedDispute}
        onClose={() => setSelectedDispute(null)}
      />
    </>
  )}
</AnimatePresence>

    </div>
    
  );
}
