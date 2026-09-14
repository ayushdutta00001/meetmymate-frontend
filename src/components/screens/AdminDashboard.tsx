import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../Card';
import { Users, DollarSign, TrendingUp, Shield, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '../Button';

interface AdminDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminDashboard({ onNavigate }: AdminDashboardProps) {
  const stats = [
    {
      label: 'Total Users',
      value: '12,458',
      change: '+12.5%',
      icon: Users,
      color: 'from-blue-500 to-purple-500',
    },
    {
      label: 'Revenue',
      value: '₹2.4M',
      change: '+23.1%',
      icon: DollarSign,
      color: 'from-green-500 to-teal-500',
    },
    {
      label: 'Active Bookings',
      value: '1,289',
      change: '+8.2%',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
    },
    {
      label: 'Pending Verifications',
      value: '47',
      change: '-5.4%',
      icon: Shield,
      color: 'from-pink-500 to-purple-500',
    },
  ];

  const pendingVerifications = [
    {
      id: 1,
      name: 'Aarav Sharma',
      email: 'aarav@example.com',
      type: 'ID Verification',
      submitted: '2 hours ago',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    },
    {
      id: 2,
      name: 'Diya Patel',
      email: 'diya@example.com',
      type: 'Profile Verification',
      submitted: '4 hours ago',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    },
    {
      id: 3,
      name: 'Rohan Verma',
      email: 'rohan@example.com',
      type: 'ID Verification',
      submitted: '6 hours ago',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    },
  ];

  const recentTransactions = [
    { id: 1, user: 'Priya K.', amount: 500, type: 'Rent a Friend', status: 'completed', time: '10 mins ago' },
    { id: 2, user: 'Rahul M.', amount: 1200, type: 'Blind Date', status: 'completed', time: '25 mins ago' },
    { id: 3, user: 'Ananya S.', amount: 800, type: 'Business Meetup', status: 'pending', time: '1 hour ago' },
    { id: 4, user: 'Arjun P.', amount: 600, type: 'Rent a Friend', status: 'completed', time: '2 hours ago' },
  ];

  const [verificationAction, setVerificationAction] = useState<{ id: number; action: string } | null>(null);

  const handleVerification = (id: number, action: 'approve' | 'reject') => {
    setVerificationAction({ id, action });
    setTimeout(() => setVerificationAction(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass dark:glass-dark backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h2>Admin Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Overview and management panel
          </p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
              >
                <Card variant="glass" hover={false}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                        {stat.label}
                      </p>
                      <h3 className="mb-2">{stat.value}</h3>
                      <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {stat.change} from last month
                      </span>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Verifications */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card variant="glass" hover={false}>
              <div className="flex items-center justify-between mb-6">
                <h3>Pending Verifications</h3>
                <button
                  onClick={() => onNavigate('admin-verification')}
                  className="text-sm text-[#3C82F6] dark:text-[#3758FF] hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                {pendingVerifications.map((verification) => (
                  <div
                    key={verification.id}
                    className="flex items-center gap-4 p-4 bg-[#F2F4F7] dark:bg-[#0A0F1F] rounded-2xl"
                  >
                    <img
                      src={verification.image}
                      alt={verification.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm truncate">{verification.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {verification.type} • {verification.submitted}
                      </p>
                    </div>
                    {verificationAction?.id === verification.id ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        {verificationAction.action === 'approve' ? (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-500" />
                        )}
                      </motion.div>
                    ) : (
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleVerification(verification.id, 'approve')}
                          className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleVerification(verification.id, 'reject')}
                          className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center"
                        >
                          <XCircle className="w-5 h-5" />
                        </motion.button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Recent Transactions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card variant="glass" hover={false}>
              <div className="flex items-center justify-between mb-6">
                <h3>Recent Transactions</h3>
                <button
                  onClick={() => onNavigate('admin-payments')}
                  className="text-sm text-[#3C82F6] dark:text-[#3758FF] hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-[#F2F4F7] dark:bg-[#0A0F1F] rounded-2xl"
                  >
                    <div className="flex-1">
                      <h4 className="text-sm">{transaction.user}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {transaction.type} • {transaction.time}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">₹{transaction.amount}</p>
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                        transaction.status === 'completed'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}>
                        {transaction.status === 'completed' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <Clock className="w-3 h-3" />
                        )}
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Card variant="gradient">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-white mb-2">Quick Actions</h3>
                <p className="text-white/80 text-sm">
                  Manage your platform efficiently
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="glass"
                  size="small"
                  onClick={() => onNavigate('admin-users')}
                >
                  Manage Users
                </Button>
                <Button
                  variant="glass"
                  size="small"
                  onClick={() => onNavigate('admin-provider-management')}
                >
                  Manage Providers
                </Button>
                <Button
                  variant="glass"
                  size="small"
                  onClick={() => onNavigate('admin-booking-management')}
                >
                  Manage Bookings
                </Button>
                <Button
                  variant="glass"
                  size="small"
                  onClick={() => onNavigate('admin-analytics')}
                >
                  View Analytics
                </Button>
                <Button
                  variant="glass"
                  size="small"
                  onClick={() => onNavigate('admin-verification')}
                >
                  Verify Profiles
                </Button>
                <Button
                  variant="glass"
                  size="small"
                  onClick={() => onNavigate('admin-payments')}
                >
                  View Payments
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}