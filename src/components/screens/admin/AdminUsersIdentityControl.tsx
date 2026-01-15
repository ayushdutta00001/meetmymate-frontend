import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Download,
  Ban,
  CheckCircle,
  AlertTriangle,
  X,
  User,
  Shield,
  Flag,
  FileText,
  MoreVertical
} from 'lucide-react';

type UserRole = 'Customer' | 'Provider' | 'Investor' | 'Expert' | 'All';
type UserStatus = 'Active' | 'Suspended' | 'Banned' | 'All';
type VerificationStatus = 'Verified' | 'Pending' | 'Rejected' | 'All';

interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
  verificationStatus: 'Verified' | 'Pending' | 'Rejected';
  accountState: 'Active' | 'Suspended' | 'Banned';
  joinedDate: string;
  flagsCount: number;
  modules: string[];
}

export function AdminUsersIdentityControl() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole>('All');
  const [statusFilter, setStatusFilter] = useState<UserStatus>('All');
  const [verificationFilter, setVerificationFilter] = useState<VerificationStatus>('All');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showActionDialog, setShowActionDialog] = useState(false);
  const [actionType, setActionType] = useState<'suspend' | 'ban' | 'restore' | null>(null);

  // Mock data
  const users: UserData[] = [
    {
      id: 'U-8821',
      name: 'Rahul Sharma',
      email: 'rahul.s@example.com',
      role: 'Provider',
      verificationStatus: 'Verified',
      accountState: 'Active',
      joinedDate: '2024-11-15',
      flagsCount: 2,
      modules: ['Rent-a-Friend']
    },
    {
      id: 'U-7652',
      name: 'Priya Patel',
      email: 'priya.p@example.com',
      role: 'Customer',
      verificationStatus: 'Verified',
      accountState: 'Active',
      joinedDate: '2024-10-22',
      flagsCount: 0,
      modules: ['Blind Date', 'Business Meetup']
    },
    {
      id: 'U-9012',
      name: 'Amit Kumar',
      email: 'amit.k@example.com',
      role: 'Expert',
      verificationStatus: 'Pending',
      accountState: 'Active',
      joinedDate: '2024-12-20',
      flagsCount: 0,
      modules: ['Find Experienced']
    },
    {
      id: 'U-5431',
      name: 'Sneha Reddy',
      email: 'sneha.r@example.com',
      role: 'Investor',
      verificationStatus: 'Verified',
      accountState: 'Suspended',
      joinedDate: '2024-09-10',
      flagsCount: 5,
      modules: ['Find Investor']
    },
    {
      id: 'U-3298',
      name: 'Vikram Singh',
      email: 'vikram.s@example.com',
      role: 'Provider',
      verificationStatus: 'Rejected',
      accountState: 'Banned',
      joinedDate: '2024-08-05',
      flagsCount: 12,
      modules: ['Rent-a-Friend']
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      Active: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/30',
      Suspended: 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-300 dark:border-orange-500/30',
      Banned: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300 dark:border-red-500/30',
      Verified: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-300 dark:border-blue-500/30',
      Pending: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300 dark:border-yellow-500/30',
      Rejected: 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-300 dark:border-gray-500/30',
    };
    return styles[status as keyof typeof styles] || styles.Active;
  };

  const handleAction = (type: 'suspend' | 'ban' | 'restore', user: UserData) => {
    setActionType(type);
    setSelectedUser(user);
    setShowActionDialog(true);
  };

  const confirmAction = () => {
    // Handle action confirmation
    console.log(`${actionType} user:`, selectedUser?.id);
    setShowActionDialog(false);
    setActionType(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      {/* Page Header */}
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <h1 className="text-2xl text-gray-900 dark:text-white">Users & Identity Control</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage user accounts, verification, and access</p>
      </div>

      <div className="p-8">
        {/* Controls Bar */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or user ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </button>

            {/* Export Button */}
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-gray-800"
            >
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Role</label>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
                >
                  <option>All</option>
                  <option>Customer</option>
                  <option>Provider</option>
                  <option>Investor</option>
                  <option>Expert</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Account Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as UserStatus)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
                >
                  <option>All</option>
                  <option>Active</option>
                  <option>Suspended</option>
                  <option>Banned</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-600 dark:text-gray-400 mb-1 block">Verification</label>
                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value as VerificationStatus)}
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
                >
                  <option>All</option>
                  <option>Verified</option>
                  <option>Pending</option>
                  <option>Rejected</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">User ID</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Name</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Role</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Verification</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Account State</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Joined Date</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Flags</th>
                  <th className="px-6 py-3 text-right text-xs text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-[#0A0F1F] cursor-pointer">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-mono">{user.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700 dark:text-gray-300">{user.role}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${getStatusBadge(user.verificationStatus)}`}>
                        {user.verificationStatus === 'Verified' && <CheckCircle className="w-3 h-3" />}
                        {user.verificationStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${getStatusBadge(user.accountState)}`}>
                        {user.accountState}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{user.joinedDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        {user.flagsCount > 0 && <Flag className="w-4 h-4 text-red-500" />}
                        <span className={`text-sm ${user.flagsCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}`}>
                          {user.flagsCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-500/20"
                        >
                          View
                        </button>
                        {user.accountState === 'Active' && (
                          <button
                            onClick={() => handleAction('suspend', user)}
                            className="px-3 py-1.5 text-xs bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded hover:bg-orange-100 dark:hover:bg-orange-500/20"
                          >
                            Suspend
                          </button>
                        )}
                        {user.accountState === 'Suspended' && (
                          <button
                            onClick={() => handleAction('restore', user)}
                            className="px-3 py-1.5 text-xs bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded hover:bg-green-100 dark:hover:bg-green-500/20"
                          >
                            Restore
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

      {/* Action Confirmation Dialog */}
      <AnimatePresence>
        {showActionDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowActionDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-6 max-w-md w-full"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg text-gray-900 dark:text-white capitalize">{actionType} User</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">This action requires confirmation</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to {actionType} <strong>{selectedUser?.name}</strong> (ID: {selectedUser?.id})?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowActionDialog(false)}
                  className="flex-1 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  className="flex-1 px-4 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
                >
                  Confirm {actionType}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
