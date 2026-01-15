import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  ArrowUp,
  ArrowDown,
  Eye,
  MoreVertical,
  Download,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Award,
} from 'lucide-react';
import { Card } from '../Card';

interface AdminAnalyticsDashboardProps {
  onNavigate: (page: string) => void;
}

export function AdminAnalyticsDashboard({ onNavigate }: AdminAnalyticsDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const stats = [
    {
      label: 'Total Bookings',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Active Providers',
      value: '856',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Total Revenue',
      value: '₹12.8L',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'from-green-500 to-teal-500',
    },
    {
      label: 'Active Users',
      value: '4,392',
      change: '+18.9%',
      trend: 'up',
      icon: TrendingUp,
      color: 'from-orange-500 to-red-500',
    },
  ];

  const recentBookings = [
    {
      id: 'MMM-2025-12-089',
      user: 'Amit Kumar',
      provider: 'Priya Sharma',
      type: 'Casual Hangout',
      amount: 900,
      status: 'completed',
      date: '2025-12-10',
    },
    {
      id: 'MMM-2025-12-088',
      user: 'Sarah Johnson',
      provider: 'Rahul Verma',
      type: 'City Tour',
      amount: 1200,
      status: 'confirmed',
      date: '2025-12-11',
    },
    {
      id: 'MMM-2025-12-087',
      user: 'Ravi Patel',
      provider: 'Ananya Desai',
      type: 'Art Gallery',
      amount: 800,
      status: 'pending',
      date: '2025-12-12',
    },
    {
      id: 'MMM-2025-12-086',
      user: 'Maya Singh',
      provider: 'Arjun Mehta',
      type: 'Workout Session',
      amount: 700,
      status: 'completed',
      date: '2025-12-09',
    },
    {
      id: 'MMM-2025-12-085',
      user: 'John Doe',
      provider: 'Sneha Patel',
      type: 'Shopping',
      amount: 550,
      status: 'cancelled',
      date: '2025-12-08',
    },
  ];

  const topProviders = [
    {
      id: 1,
      name: 'Priya Sharma',
      image: 'https://images.unsplash.com/photo-1543807641-bd607cfa8dca?w=200',
      bookings: 156,
      revenue: 78000,
      rating: 4.9,
    },
    {
      id: 2,
      name: 'Rahul Verma',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      bookings: 142,
      revenue: 85200,
      rating: 4.8,
    },
    {
      id: 3,
      name: 'Ananya Desai',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      bookings: 128,
      revenue: 57600,
      rating: 4.7,
    },
    {
      id: 4,
      name: 'Arjun Mehta',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      bookings: 134,
      revenue: 93800,
      rating: 5.0,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'confirmed':
        return 'bg-blue-500/10 text-blue-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'confirmed':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'cancelled':
        return <XCircle className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F2F4F7] dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-40 bg-white dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="mb-2">Admin Dashboard</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Welcome back! Here's what's happening today.
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 glass dark:glass-dark rounded-full text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 glass dark:glass-dark rounded-full text-sm flex items-center gap-2"
              >
                <Filter className="w-4 h-4" />
                Filter
              </motion.button>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex gap-2">
            {(['7d', '30d', '90d', '1y'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-full text-sm transition-all ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                    : 'glass dark:glass-dark hover:bg-white/20 dark:hover:bg-white/10'
                }`}
              >
                {range === '7d' && 'Last 7 Days'}
                {range === '30d' && 'Last 30 Days'}
                {range === '90d' && 'Last 90 Days'}
                {range === '1y' && 'Last Year'}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="relative overflow-hidden">
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl`} />
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className={`flex items-center gap-1 text-sm ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.trend === 'up' ? (
                          <ArrowUp className="w-4 h-4" />
                        ) : (
                          <ArrowDown className="w-4 h-4" />
                        )}
                        <span>{stat.change}</span>
                      </div>
                    </div>
                    <h3 className="mb-1">{stat.value}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-2"
          >
            <Card variant="glass">
              <div className="flex items-center justify-between mb-6">
                <h3>Recent Bookings</h3>
                <button
                  onClick={() => onNavigate('admin-bookings')}
                  className="text-sm text-[#3C82F6] dark:text-[#3758FF] hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 text-sm text-gray-600 dark:text-gray-400">
                        Booking ID
                      </th>
                      <th className="text-left py-3 text-sm text-gray-600 dark:text-gray-400">
                        User
                      </th>
                      <th className="text-left py-3 text-sm text-gray-600 dark:text-gray-400">
                        Provider
                      </th>
                      <th className="text-left py-3 text-sm text-gray-600 dark:text-gray-400">
                        Amount
                      </th>
                      <th className="text-left py-3 text-sm text-gray-600 dark:text-gray-400">
                        Status
                      </th>
                      <th className="text-left py-3 text-sm text-gray-600 dark:text-gray-400">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentBookings.map((booking, index) => (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.05 }}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <td className="py-4">
                          <p className="text-sm font-mono">{booking.id}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-sm">{booking.user}</p>
                          <p className="text-xs text-gray-500">{booking.type}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-sm">{booking.provider}</p>
                        </td>
                        <td className="py-4">
                          <p className="text-sm">₹{booking.amount}</p>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4">
                          <button className="w-8 h-8 rounded-full glass dark:glass-dark flex items-center justify-center hover:bg-white/20 dark:hover:bg-white/10 transition-all">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>

          {/* Top Providers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card variant="glass">
              <div className="flex items-center justify-between mb-6">
                <h3>Top Providers</h3>
                <button className="text-sm text-[#3C82F6] dark:text-[#3758FF] hover:underline">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {topProviders.map((provider, index) => (
                  <motion.div
                    key={provider.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#F2F4F7] dark:hover:bg-[#0A0F1F] transition-colors cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={provider.image}
                        alt={provider.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                          <Award className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{provider.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {provider.bookings} bookings
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[#3C82F6] dark:text-[#3758FF]">
                        ₹{(provider.revenue / 1000).toFixed(0)}K
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        ⭐ {provider.rating}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card variant="gradient">
            <div className="relative z-10">
              <h3 className="text-white mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('admin-users')}
                  className="p-4 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all text-left"
                >
                  <Users className="w-6 h-6 mb-2" />
                  <p className="text-sm">Manage Users</p>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all text-left"
                >
                  <Calendar className="w-6 h-6 mb-2" />
                  <p className="text-sm">View Bookings</p>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onNavigate('admin-verification')}
                  className="p-4 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all text-left"
                >
                  <CheckCircle className="w-6 h-6 mb-2" />
                  <p className="text-sm">Verifications</p>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 bg-white/10 backdrop-blur-md rounded-xl text-white hover:bg-white/20 transition-all text-left"
                >
                  <DollarSign className="w-6 h-6 mb-2" />
                  <p className="text-sm">Revenue Report</p>
                </motion.button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
