import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock, 
  DollarSign,
  AlertCircle,
  Eye,
  Filter,
  Search,
  Download,
  Calendar
} from 'lucide-react';

interface RefundRequest {
  id: string;
  userId: string;
  userName: string;
  bookingId: string;
  bookingType: 'blind-date' | 'rent-friend' | 'business-meetup';
  amount: number;
  requestDate: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'processing';
  paymentMethod: string;
  userEmail: string;
  cancellationTime: string;
  bookingDate: string;
  adminNotes?: string;
}

export function AdminRefundManagement() {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  // Mock refund requests - in real app, this comes from database
  const refundRequests: RefundRequest[] = [
    {
      id: 'REF-2024-001',
      userId: 'USR-4523',
      userName: 'Priya Sharma',
      bookingId: 'BD-2024-12-23-4892',
      bookingType: 'blind-date',
      amount: 1098,
      requestDate: '2024-12-24 10:30',
      reason: 'Match declined by other party',
      status: 'pending',
      paymentMethod: 'UPI',
      userEmail: 'priya.s@email.com',
      cancellationTime: '2024-12-24 10:00',
      bookingDate: '2024-12-28',
    },
    {
      id: 'REF-2024-002',
      userId: 'USR-7821',
      userName: 'Rahul Mehta',
      bookingId: 'RF-2024-12-22-1234',
      bookingType: 'rent-friend',
      amount: 2500,
      requestDate: '2024-12-23 15:45',
      reason: 'Provider cancelled',
      status: 'pending',
      paymentMethod: 'Card',
      userEmail: 'rahul.m@email.com',
      cancellationTime: '2024-12-23 15:30',
      bookingDate: '2024-12-25',
    },
    {
      id: 'REF-2024-003',
      userId: 'USR-3421',
      userName: 'Ananya Kumar',
      bookingId: 'BD-2024-11-15-3421',
      bookingType: 'blind-date',
      amount: 1098,
      requestDate: '2024-11-16 09:00',
      reason: 'No match found within 7 days',
      status: 'approved',
      paymentMethod: 'Card',
      userEmail: 'ananya.k@email.com',
      cancellationTime: '2024-11-16 08:45',
      bookingDate: 'N/A',
      adminNotes: 'Auto-approved - no match found policy',
    },
    {
      id: 'REF-2024-004',
      userId: 'USR-9812',
      userName: 'Vikram Patel',
      bookingId: 'BM-2024-12-20-5678',
      bookingType: 'business-meetup',
      amount: 4999,
      requestDate: '2024-12-21 11:20',
      reason: 'Meeting already completed',
      status: 'rejected',
      paymentMethod: 'UPI',
      userEmail: 'vikram.p@email.com',
      cancellationTime: '2024-12-21 11:15',
      bookingDate: '2024-12-20',
      adminNotes: 'Meeting completed successfully - no refund eligible',
    },
  ];

  const stats = {
    pending: refundRequests.filter(r => r.status === 'pending').length,
    approved: refundRequests.filter(r => r.status === 'approved').length,
    rejected: refundRequests.filter(r => r.status === 'rejected').length,
    processing: refundRequests.filter(r => r.status === 'processing').length,
    totalAmount: refundRequests
      .filter(r => r.status === 'pending')
      .reduce((sum, r) => sum + r.amount, 0),
  };

  const filteredRequests = refundRequests.filter(request => {
    const matchesTab = activeTab === 'all' || request.status === activeTab;
    const matchesSearch = 
      request.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleApproveRefund = (refundId: string) => {
    console.log('Approving refund:', refundId);
    // In real app: API call to process refund
    setShowDetailsModal(false);
  };

  const handleRejectRefund = (refundId: string) => {
    console.log('Rejecting refund:', refundId, 'with notes:', adminNotes);
    // In real app: API call to reject refund
    setShowDetailsModal(false);
  };

  const getBookingTypeLabel = (type: string) => {
    switch (type) {
      case 'blind-date':
        return 'Blind Date';
      case 'rent-friend':
        return 'Rent-a-Friend';
      case 'business-meetup':
        return 'Business Meetup';
      default:
        return type;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl mb-2">Refund Management</h2>
            <p className="text-gray-600">Review and process refund requests from users</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-xl hover:bg-gray-50 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2">
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Pending</p>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl mb-1">{stats.pending}</p>
            <p className="text-xs text-gray-500">Awaiting review</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Processing</p>
              <RefreshCw className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl mb-1">{stats.processing}</p>
            <p className="text-xs text-gray-500">Being processed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Approved</p>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl mb-1">{stats.approved}</p>
            <p className="text-xs text-gray-500">Completed</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Rejected</p>
              <XCircle className="w-5 h-5 text-red-500" />
            </div>
            <p className="text-3xl mb-1">{stats.rejected}</p>
            <p className="text-xs text-gray-500">Denied</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-6 shadow-lg text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-white/90">Pending Amount</p>
              <DollarSign className="w-5 h-5" />
            </div>
            <p className="text-3xl mb-1">₹{stats.totalAmount.toLocaleString()}</p>
            <p className="text-xs text-white/80">To be processed</p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 p-1 bg-white/70 rounded-xl border border-gray-200/50 backdrop-blur-xl">
          {(['pending', 'approved', 'rejected', 'all'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 px-4 rounded-lg transition-all text-sm ${
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

      {/* Search and Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by refund ID, user name, or booking ID..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-xl focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
        <button className="px-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-xl hover:bg-gray-50 transition-all flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Refund Requests Table */}
      <div className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Refund ID</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Booking Type</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Request Date</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono text-gray-900">{request.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm">
                        {request.userName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{request.userName}</p>
                        <p className="text-xs text-gray-500">{request.userId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-900">{getBookingTypeLabel(request.bookingType)}</p>
                      <p className="text-xs text-gray-500">{request.bookingId}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">₹{request.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">{request.paymentMethod}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700 max-w-xs truncate">{request.reason}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {request.requestDate}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs ${
                      request.status === 'pending'
                        ? 'bg-amber-100 text-amber-700'
                        : request.status === 'approved'
                        ? 'bg-green-100 text-green-700'
                        : request.status === 'rejected'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {request.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedRefund(request);
                        setShowDetailsModal(true);
                        setAdminNotes('');
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

        {filteredRequests.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 mb-1">No refund requests found</p>
            <p className="text-sm text-gray-500">Refund requests will appear here</p>
          </div>
        )}
      </div>

      {/* Refund Details Modal */}
      {showDetailsModal && selectedRefund && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h3 className="mb-2">Refund Request Details</h3>
              <p className="text-sm text-gray-600">{selectedRefund.id}</p>
            </div>

            <div className="p-6 space-y-6">
              {/* User Information */}
              <div>
                <h4 className="text-sm mb-3">User Information</h4>
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Name</p>
                    <p className="text-sm">{selectedRefund.userName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">User ID</p>
                    <p className="text-sm">{selectedRefund.userId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="text-sm">{selectedRefund.userEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Payment Method</p>
                    <p className="text-sm">{selectedRefund.paymentMethod}</p>
                  </div>
                </div>
              </div>

              {/* Booking Information */}
              <div>
                <h4 className="text-sm mb-3">Booking Information</h4>
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-gray-50">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Booking ID</p>
                    <p className="text-sm">{selectedRefund.bookingId}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Type</p>
                    <p className="text-sm">{getBookingTypeLabel(selectedRefund.bookingType)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Booking Date</p>
                    <p className="text-sm">{selectedRefund.bookingDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Cancelled At</p>
                    <p className="text-sm">{selectedRefund.cancellationTime}</p>
                  </div>
                </div>
              </div>

              {/* Refund Details */}
              <div>
                <h4 className="text-sm mb-3">Refund Details</h4>
                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm text-gray-700">Refund Amount</p>
                    <p className="text-2xl text-blue-600">₹{selectedRefund.amount.toLocaleString()}</p>
                  </div>
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Reason</p>
                    <p className="text-sm text-gray-700">{selectedRefund.reason}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Request Date</p>
                    <p className="text-sm text-gray-700">{selectedRefund.requestDate}</p>
                  </div>
                </div>
              </div>

              {/* Admin Notes */}
              {selectedRefund.status === 'pending' && (
                <div>
                  <h4 className="text-sm mb-3">Admin Notes</h4>
                  <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes about this refund decision..."
                    className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500 transition-all"
                    rows={3}
                  />
                </div>
              )}

              {selectedRefund.adminNotes && (
                <div className="p-4 rounded-lg bg-gray-50">
                  <p className="text-xs text-gray-500 mb-1">Previous Admin Notes</p>
                  <p className="text-sm text-gray-700">{selectedRefund.adminNotes}</p>
                </div>
              )}

              {/* Policy Check */}
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-900">
                    <p className="mb-2">Refund Policy Check</p>
                    <ul className="text-xs space-y-1 text-amber-700">
                      <li>✓ Request made within valid timeframe</li>
                      <li>✓ Reason matches refund policy criteria</li>
                      <li>✓ Payment verification completed</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-all"
              >
                Close
              </button>
              {selectedRefund.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleRejectRefund(selectedRefund.id)}
                    className="flex-1 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all"
                  >
                    Reject Refund
                  </button>
                  <button
                    onClick={() => handleApproveRefund(selectedRefund.id)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all"
                  >
                    Approve & Process
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
