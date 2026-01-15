import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, Download, X, CheckCircle, XCircle, Eye, Ban, UserCheck } from 'lucide-react';

interface User {
  id: number;
  avatar: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  status: 'active' | 'blocked';
  verified: boolean;
  joinDate: string;
  totalBookings: number;
  totalSpent: number;
}

export function AdminUsersScreen() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const users: User[] = [
    {
      id: 1,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      name: 'Priya Kapoor',
      email: 'priya.k@gmail.com',
      phone: '+91 98765 43210',
      city: 'Mumbai',
      status: 'active',
      verified: true,
      joinDate: '2024-01-15',
      totalBookings: 12,
      totalSpent: 15000,
    },
    {
      id: 2,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      name: 'Rahul Mehta',
      email: 'rahul.m@gmail.com',
      phone: '+91 98765 43211',
      city: 'Delhi',
      status: 'active',
      verified: true,
      joinDate: '2024-02-20',
      totalBookings: 8,
      totalSpent: 12000,
    },
    {
      id: 3,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      name: 'Ananya Sharma',
      email: 'ananya.s@gmail.com',
      phone: '+91 98765 43212',
      city: 'Bangalore',
      status: 'active',
      verified: false,
      joinDate: '2024-03-10',
      totalBookings: 3,
      totalSpent: 4500,
    },
    {
      id: 4,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      name: 'Arjun Patel',
      email: 'arjun.p@gmail.com',
      phone: '+91 98765 43213',
      city: 'Mumbai',
      status: 'blocked',
      verified: true,
      joinDate: '2024-01-05',
      totalBookings: 5,
      totalSpent: 7500,
    },
    {
      id: 5,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
      name: 'Sneha Reddy',
      email: 'sneha.r@gmail.com',
      phone: '+91 98765 43214',
      city: 'Hyderabad',
      status: 'active',
      verified: true,
      joinDate: '2024-02-14',
      totalBookings: 15,
      totalSpent: 22000,
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="mb-2">User Management</h2>
        <p className="text-sm text-gray-600">Manage all registered users</p>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 backdrop-blur-xl bg-white/70 border border-gray-200 rounded-xl focus:border-[#3C82F6] transition-all outline-none text-sm"
          />
        </div>

        {/* Filter Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2.5 backdrop-blur-xl bg-white/70 border border-gray-200 rounded-xl flex items-center gap-2 hover:bg-white transition-all"
        >
          <Filter className="w-5 h-5" />
          <span className="text-sm" style={{ fontWeight: 500 }}>Filters</span>
        </motion.button>

        {/* Export Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2.5 bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white rounded-xl flex items-center gap-2 shadow-lg shadow-blue-500/30"
        >
          <Download className="w-5 h-5" />
          <span className="text-sm" style={{ fontWeight: 600 }}>Export</span>
        </motion.button>
      </div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-gray-600" style={{ fontWeight: 600 }}>USER</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600" style={{ fontWeight: 600 }}>EMAIL</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600" style={{ fontWeight: 600 }}>PHONE</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600" style={{ fontWeight: 600 }}>CITY</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600" style={{ fontWeight: 600 }}>STATUS</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600" style={{ fontWeight: 600 }}>VERIFIED</th>
                <th className="px-6 py-4 text-right text-xs text-gray-600" style={{ fontWeight: 600 }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm" style={{ fontWeight: 600 }}>{user.name}</p>
                        <p className="text-xs text-gray-500">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">{user.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">{user.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-700">{user.city}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                      user.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`} style={{ fontWeight: 600 }}>
                      {user.status === 'active' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {user.verified ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs" style={{ fontWeight: 600 }}>
                        <UserCheck className="w-3 h-3" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs" style={{ fontWeight: 600 }}>
                        Not Verified
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedUser(user)}
                        className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center hover:bg-blue-200 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center hover:bg-red-200 transition-colors"
                        title={user.status === 'active' ? 'Block User' : 'Unblock User'}
                      >
                        <Ban className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing 1-5 of 245 users</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors">
              Previous
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-[#3C82F6] text-white text-sm">1</button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors">2</button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors">3</button>
            <button className="px-3 py-1.5 rounded-lg border border-gray-200 text-sm hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </motion.div>

      {/* User Details Drawer */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
              onClick={() => setSelectedUser(null)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-screen w-full max-w-lg backdrop-blur-xl bg-white/90 border-l border-gray-200 shadow-2xl z-50 overflow-y-auto"
            >
              {/* Drawer Header */}
              <div className="sticky top-0 backdrop-blur-xl bg-white/90 border-b border-gray-200 p-6 flex items-center justify-between">
                <h3>User Details</h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedUser(null)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6">
                {/* Profile */}
                <div className="flex items-center gap-4">
                  <img src={selectedUser.avatar} alt={selectedUser.name} className="w-20 h-20 rounded-full object-cover" />
                  <div>
                    <h3 className="mb-1">{selectedUser.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{selectedUser.email}</p>
                    <div className="flex items-center gap-2">
                      {selectedUser.verified && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs" style={{ fontWeight: 600 }}>
                          Verified
                        </span>
                      )}
                      <span className={`px-2 py-1 rounded-lg text-xs ${
                        selectedUser.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`} style={{ fontWeight: 600 }}>
                        {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="backdrop-blur-xl bg-blue-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Bookings</p>
                    <p className="text-2xl" style={{ fontWeight: 700 }}>{selectedUser.totalBookings}</p>
                  </div>
                  <div className="backdrop-blur-xl bg-green-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                    <p className="text-2xl" style={{ fontWeight: 700 }}>₹{selectedUser.totalSpent.toLocaleString()}</p>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">PHONE</p>
                    <p className="text-sm" style={{ fontWeight: 600 }}>{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">CITY</p>
                    <p className="text-sm" style={{ fontWeight: 600 }}>{selectedUser.city}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">JOINED DATE</p>
                    <p className="text-sm" style={{ fontWeight: 600 }}>{new Date(selectedUser.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <button className="w-full py-3 bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white rounded-xl shadow-lg shadow-blue-500/30">
                    Send Message
                  </button>
                  <button className="w-full py-3 border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition-all">
                    {selectedUser.status === 'active' ? 'Block User' : 'Unblock User'}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
