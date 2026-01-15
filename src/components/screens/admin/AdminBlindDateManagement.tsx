import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Heart, 
  Users, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  UserCheck,
  MapPin,
  Eye,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

interface BlindDateUser {
  id: string;
  name: string;
  age: number;
  gender: string;
  preferences: {
    ageRange: [number, number];
    gender: string;
    meetingType: string;
  };
  availability: {
    date: string;
    time: string;
  };
  status: 'waiting' | 'matched' | 'scheduled' | 'completed' | 'cancelled';
  joinedQueue: string;
  verificationStatus: 'verified' | 'pending';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  matchedWith?: string;
  meetingId?: string;
}

export function AdminBlindDateManagement() {
  const [activeTab, setActiveTab] = useState<'waiting' | 'matched' | 'scheduled' | 'completed'>('waiting');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showMatchDialog, setShowMatchDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - in real app, this would come from database
  const blindDateUsers: BlindDateUser[] = [
    {
      id: 'BD-U-001',
      name: 'Priya S.',
      age: 26,
      gender: 'Female',
      preferences: {
        ageRange: [25, 32],
        gender: 'Male',
        meetingType: 'Coffee/Casual',
      },
      availability: {
        date: '2024-12-28',
        time: '18:00-20:00',
      },
      status: 'waiting',
      joinedQueue: '2024-12-23 10:30',
      verificationStatus: 'verified',
      paymentStatus: 'paid',
    },
    {
      id: 'BD-U-002',
      name: 'Rahul M.',
      age: 29,
      gender: 'Male',
      preferences: {
        ageRange: [24, 30],
        gender: 'Female',
        meetingType: 'Coffee/Casual',
      },
      availability: {
        date: '2024-12-28',
        time: '18:00-20:00',
      },
      status: 'waiting',
      joinedQueue: '2024-12-23 11:15',
      verificationStatus: 'verified',
      paymentStatus: 'paid',
    },
    {
      id: 'BD-U-003',
      name: 'Ananya K.',
      age: 24,
      gender: 'Female',
      preferences: {
        ageRange: [25, 35],
        gender: 'Male',
        meetingType: 'Dinner',
      },
      availability: {
        date: '2024-12-29',
        time: '19:00-21:00',
      },
      status: 'waiting',
      joinedQueue: '2024-12-23 14:20',
      verificationStatus: 'verified',
      paymentStatus: 'paid',
    },
    {
      id: 'BD-U-004',
      name: 'Vikram P.',
      age: 31,
      gender: 'Male',
      preferences: {
        ageRange: [23, 29],
        gender: 'Female',
        meetingType: 'Dinner',
      },
      availability: {
        date: '2024-12-29',
        time: '19:00-21:00',
      },
      status: 'matched',
      joinedQueue: '2024-12-22 16:45',
      verificationStatus: 'verified',
      paymentStatus: 'paid',
      matchedWith: 'BD-U-003',
      meetingId: 'BD-2024-12-23-4892',
    },
  ];

  const stats = {
    waiting: blindDateUsers.filter(u => u.status === 'waiting').length,
    matched: blindDateUsers.filter(u => u.status === 'matched').length,
    scheduled: blindDateUsers.filter(u => u.status === 'scheduled').length,
    completed: blindDateUsers.filter(u => u.status === 'completed').length,
  };

  const handleUserSelect = (userId: string) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      if (selectedUsers.length < 2) {
        setSelectedUsers([...selectedUsers, userId]);
      }
    }
  };

  const handleCreateMatch = () => {
    if (selectedUsers.length === 2) {
      setShowMatchDialog(true);
    }
  };

  const confirmMatch = () => {
    // Logic to create match
    setShowMatchDialog(false);
    setSelectedUsers([]);
  };

  const filteredUsers = blindDateUsers.filter(user => 
    user.status === activeTab && 
    (user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.id.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl mb-2">Blind Date Management</h2>
            <p className="text-gray-600">Manage blind date matches, waiting users, and meetings</p>
          </div>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Waiting for Match</p>
              <Clock className="w-5 h-5 text-amber-500" />
            </div>
            <p className="text-3xl mb-1">{stats.waiting}</p>
            <p className="text-xs text-gray-500">Users in queue</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Matched</p>
              <Heart className="w-5 h-5 text-pink-500" />
            </div>
            <p className="text-3xl mb-1">{stats.matched}</p>
            <p className="text-xs text-gray-500">Awaiting confirmation</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Scheduled</p>
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-3xl mb-1">{stats.scheduled}</p>
            <p className="text-xs text-gray-500">Confirmed meetings</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-600">Completed</p>
              <CheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <p className="text-3xl mb-1">{stats.completed}</p>
            <p className="text-xs text-gray-500">Past meetings</p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 p-1 bg-white/70 rounded-xl border border-gray-200/50 backdrop-blur-xl">
          {(['waiting', 'matched', 'scheduled', 'completed'] as const).map((tab) => (
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
              {tab.charAt(0).toUpperCase() + tab.slice(1)} ({stats[tab]})
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
            placeholder="Search by name or ID..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-xl focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
        <button className="px-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-xl hover:bg-gray-50 transition-all flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Filters
        </button>
      </div>

      {/* Selected Users Actions */}
      {activeTab === 'waiting' && selectedUsers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <UserCheck className="w-5 h-5 text-blue-600" />
            <p className="text-sm">
              <strong>{selectedUsers.length}</strong> user(s) selected
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setSelectedUsers([])}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-all"
            >
              Clear Selection
            </button>
            <button
              onClick={handleCreateMatch}
              disabled={selectedUsers.length !== 2}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              Create Match
            </button>
          </div>
        </motion.div>
      )}

      {/* Users List */}
      <div className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="bg-gray-50/50">
                {activeTab === 'waiting' && <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Select</th>}
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">User ID</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Age/Gender</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Preferences</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Availability</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Queue Time</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  {activeTab === 'waiting' && (
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelect(user.id)}
                        className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                  )}
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono text-gray-900">{user.id}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{user.name}</p>
                        {user.verificationStatus === 'verified' && (
                          <div className="flex items-center gap-1 text-xs text-green-600">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{user.age} • {user.gender}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <p className="text-gray-900">Age: {user.preferences.ageRange[0]}-{user.preferences.ageRange[1]}</p>
                      <p className="text-gray-600">{user.preferences.gender} • {user.preferences.meetingType}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="flex items-center gap-1 text-gray-900 mb-1">
                        <Calendar className="w-3 h-3" />
                        {user.availability.date}
                      </div>
                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-3 h-3" />
                        {user.availability.time}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-600">{user.joinedQueue}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        user.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-700'
                          : user.paymentStatus === 'refunded'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.paymentStatus}
                      </span>
                      {user.matchedWith && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-pink-100 text-pink-700">
                          Matched
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-all" title="View Details">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 mb-1">No users in this category</p>
            <p className="text-sm text-gray-500">Users will appear here when they join the queue</p>
          </div>
        )}
      </div>

      {/* Match Confirmation Dialog */}
      {showMatchDialog && selectedUsers.length === 2 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full mx-4"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                <Heart className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="mb-2">Create Blind Date Match?</h3>
              <p className="text-sm text-gray-600">
                This will notify both users about their match and require their confirmation
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {selectedUsers.map(userId => {
                const user = blindDateUsers.find(u => u.id === userId);
                return user ? (
                  <div key={user.id} className="p-3 rounded-lg bg-gray-50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.age} • {user.gender}</p>
                    </div>
                  </div>
                ) : null;
              })}
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 mb-6">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-900">
                  <p className="mb-1">Suggested Meeting Details</p>
                  <p className="text-xs text-blue-700">Location: Cafe Coffee Day, Bandra West</p>
                  <p className="text-xs text-blue-700">Date: Dec 28, 2024 • 6:00-8:00 PM</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowMatchDialog(false);
                  setSelectedUsers([]);
                }}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmMatch}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 text-white hover:shadow-lg transition-all"
              >
                Confirm Match
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
