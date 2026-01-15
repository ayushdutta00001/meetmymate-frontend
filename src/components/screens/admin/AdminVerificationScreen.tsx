import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, CheckCircle, XCircle, Eye, X, ZoomIn, Download } from 'lucide-react';

interface VerificationRequest {
  id: number;
  userId: number;
  userName: string;
  userAvatar: string;
  documentType: string;
  documentImage: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export function AdminVerificationScreen() {
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const [requests, setRequests] = useState<VerificationRequest[]>([
    {
      id: 1,
      userId: 101,
      userName: 'Priya Kapoor',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      documentType: 'Aadhaar Card',
      documentImage: 'https://images.unsplash.com/photo-1586864387634-29a8ab58ca38?w=800',
      submittedDate: '2024-06-15',
      status: 'pending',
    },
    {
      id: 2,
      userId: 102,
      userName: 'Rahul Mehta',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      documentType: 'Passport',
      documentImage: 'https://images.unsplash.com/photo-1569025690938-a00729c9e1f9?w=800',
      submittedDate: '2024-06-14',
      status: 'pending',
    },
    {
      id: 3,
      userId: 103,
      userName: 'Sneha Reddy',
      userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
      documentType: 'Driving License',
      documentImage: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800',
      submittedDate: '2024-06-13',
      status: 'pending',
    },
  ]);

  const handleApprove = (id: number) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: 'approved' as const } : r));
    setSelectedRequest(null);
  };

  const handleReject = (id: number) => {
    if (confirm('Are you sure you want to reject this verification request?')) {
      setRequests(requests.map(r => r.id === id ? { ...r, status: 'rejected' as const } : r));
      setSelectedRequest(null);
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesSearch = r.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         r.documentType.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || r.status === filter;
    return matchesSearch && matchesFilter;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="mb-2">Verification Requests</h2>
        <p className="text-sm text-gray-600">Review and approve user identity documents</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or document type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 backdrop-blur-xl bg-white/70 border border-gray-200 rounded-xl focus:border-[#3C82F6] transition-all outline-none text-sm"
          />
        </div>

        {/* Status Filter */}
        <div className="flex gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <motion.button
              key={status}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter(status)}
              className={`px-4 py-2.5 rounded-xl text-sm transition-all ${
                filter === status
                  ? 'bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white shadow-lg'
                  : 'backdrop-blur-xl bg-white/70 border border-gray-200 hover:bg-white'
              }`}
              style={{ fontWeight: filter === status ? 600 : 500 }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'pending' && pendingCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {pendingCount}
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRequests.map((request) => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ y: -4 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
          >
            {/* Document Preview */}
            <div className="relative h-48 bg-gray-100 overflow-hidden group cursor-pointer" onClick={() => setSelectedRequest(request)}>
              <img src={request.documentImage} alt="Document" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-all" />
              </div>
              <div className="absolute top-3 right-3">
                <span className={`px-3 py-1 rounded-lg text-xs backdrop-blur-md ${
                  request.status === 'pending' ? 'bg-orange-500/90 text-white' :
                  request.status === 'approved' ? 'bg-green-500/90 text-white' :
                  'bg-red-500/90 text-white'
                }`} style={{ fontWeight: 600 }}>
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <img src={request.userAvatar} alt={request.userName} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate" style={{ fontWeight: 600 }}>{request.userName}</p>
                  <p className="text-xs text-gray-500">ID: {request.userId}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Document:</span>
                  <span style={{ fontWeight: 600 }}>{request.documentType}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Submitted:</span>
                  <span style={{ fontWeight: 600 }}>{new Date(request.submittedDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              {request.status === 'pending' && (
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleApprove(request.id)}
                    className="flex-1 py-2 bg-green-500 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-green-600 transition-all"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm" style={{ fontWeight: 600 }}>Approve</span>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleReject(request.id)}
                    className="flex-1 py-2 bg-red-500 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all"
                  >
                    <XCircle className="w-4 h-4" />
                    <span className="text-sm" style={{ fontWeight: 600 }}>Reject</span>
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Document Viewer Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
              onClick={() => setSelectedRequest(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="w-full max-w-4xl backdrop-blur-xl bg-white/90 border border-gray-200 rounded-3xl shadow-2xl overflow-hidden">
                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img src={selectedRequest.userAvatar} alt={selectedRequest.userName} className="w-12 h-12 rounded-full object-cover" />
                    <div>
                      <h3 className="mb-1">{selectedRequest.userName}</h3>
                      <p className="text-sm text-gray-600">{selectedRequest.documentType}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedRequest(null)}
                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Document Image */}
                <div className="p-6">
                  <div className="relative bg-gray-100 rounded-2xl overflow-hidden">
                    <img
                      src={selectedRequest.documentImage}
                      alt="Document"
                      className="w-full max-h-[60vh] object-contain"
                    />
                  </div>
                </div>

                {/* Modal Actions */}
                {selectedRequest.status === 'pending' && (
                  <div className="px-6 py-4 border-t border-gray-200 flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleReject(selectedRequest.id)}
                      className="flex-1 py-3 bg-red-500 text-white rounded-xl flex items-center justify-center gap-2 hover:bg-red-600 transition-all shadow-lg"
                      style={{ fontWeight: 600 }}
                    >
                      <XCircle className="w-5 h-5" />
                      Reject Verification
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleApprove(selectedRequest.id)}
                      className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl flex items-center justify-center gap-2 hover:shadow-xl transition-all shadow-lg"
                      style={{ fontWeight: 600 }}
                    >
                      <CheckCircle className="w-5 h-5" />
                      Approve Verification
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
