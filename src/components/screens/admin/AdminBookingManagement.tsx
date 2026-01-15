import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  DollarSign,
  ChevronDown,
} from 'lucide-react';
import { Card } from '../../Card';

interface AdminBookingManagementProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

export function AdminBookingManagement({ onNavigate, onBack }: AdminBookingManagementProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const bookings = [
    {
      id: 'MMM-2025-12-089',
      customer: {
        name: 'Amit Kumar',
        email: 'amit@example.com',
        phone: '+91 98765 43210',
      },
      provider: {
        name: 'Priya Sharma',
        image: 'https://images.unsplash.com/photo-1543807641-bd607cfa8dca?w=100',
      },
      category: 'Rent a Friend',
      date: '2025-12-15',
      time: '2:00 PM - 6:00 PM',
      duration: '4 hours',
      price: 900,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      createdAt: '2025-12-10',
    },
    {
      id: 'MMM-2025-12-088',
      customer: {
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+91 87654 32109',
      },
      provider: {
        name: 'Rahul Verma',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      },
      category: 'Business Meetup',
      date: '2025-12-16',
      time: '10:00 AM - 12:00 PM',
      duration: '2 hours',
      price: 1200,
      paymentStatus: 'paid',
      bookingStatus: 'pending',
      createdAt: '2025-12-09',
    },
    {
      id: 'MMM-2025-12-087',
      customer: {
        name: 'Ravi Patel',
        email: 'ravi@example.com',
        phone: '+91 76543 21098',
      },
      provider: {
        name: 'Ananya Desai',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      },
      category: 'Blind Date',
      date: '2025-12-17',
      time: '7:00 PM - 9:00 PM',
      duration: '2 hours',
      price: 800,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      createdAt: '2025-12-08',
    },
    {
      id: 'MMM-2025-12-086',
      customer: {
        name: 'Maya Singh',
        email: 'maya@example.com',
        phone: '+91 65432 10987',
      },
      provider: {
        name: 'Arjun Mehta',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
      },
      category: 'Rent a Friend',
      date: '2025-12-14',
      time: '6:00 AM - 8:00 AM',
      duration: '2 hours',
      price: 700,
      paymentStatus: 'paid',
      bookingStatus: 'completed',
      createdAt: '2025-12-07',
    },
    {
      id: 'MMM-2025-12-085',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+91 54321 09876',
      },
      provider: {
        name: 'Sneha Patel',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
      },
      category: 'Blind Date',
      date: '2025-12-13',
      time: '5:00 PM - 7:00 PM',
      duration: '2 hours',
      price: 550,
      paymentStatus: 'refunded',
      bookingStatus: 'cancelled',
      createdAt: '2025-12-06',
    },
    {
      id: 'MMM-2025-12-084',
      customer: {
        name: 'Lisa Chen',
        email: 'lisa@example.com',
        phone: '+91 43210 98765',
      },
      provider: {
        name: 'Vikram Singh',
        image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100',
      },
      category: 'Business Meetup',
      date: '2025-12-18',
      time: '3:00 PM - 7:00 PM',
      duration: '4 hours',
      price: 1600,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      createdAt: '2025-12-05',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-500/10 text-blue-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'completed':
        return 'bg-green-500/10 text-green-500';
      case 'cancelled':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-500/10 text-green-500';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'refunded':
        return 'bg-purple-500/10 text-purple-500';
      case 'failed':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="w-3 h-3" />;
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'completed':
        return <CheckCircle className="w-3 h-3" />;
      case 'cancelled':
        return <XCircle className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const updateBookingStatus = (bookingId: string, newStatus: string) => {
    console.log(`Updating booking ${bookingId} to status: ${newStatus}`);
    // API call would go here
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
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 className="mb-2">Booking Management</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monitor and manage all bookings on the platform
              </p>
            </div>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-full text-sm flex items-center gap-2 transition-all ${
                  showFilters
                    ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                    : 'glass dark:glass-dark'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 glass dark:glass-dark rounded-full text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </motion.button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by booking ID, customer name, or provider..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-sm"
            />
          </div>

          {/* Quick Status Filters */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm transition-all ${
                  selectedStatus === status
                    ? 'bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white'
                    : 'glass dark:glass-dark hover:bg-white/20 dark:hover:bg-white/10'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {[
            { 
              label: 'Total Bookings', 
              value: '2,847', 
              icon: Calendar,
              color: 'from-blue-500 to-cyan-500' 
            },
            { 
              label: 'Pending', 
              value: '156', 
              icon: Clock,
              color: 'from-yellow-500 to-orange-500' 
            },
            { 
              label: 'Confirmed', 
              value: '892', 
              icon: CheckCircle,
              color: 'from-green-500 to-teal-500' 
            },
            { 
              label: 'Total Revenue', 
              value: '₹12.8L', 
              icon: DollarSign,
              color: 'from-purple-500 to-pink-500' 
            },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card variant="glass">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <h3 className="mb-1">{stat.value}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Advanced Filters Panel */}
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6"
          >
            <Card variant="glass">
              <h4 className="mb-4">Advanced Filters</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-2">Payment Status</label>
                  <select
                    value={selectedPaymentStatus}
                    onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-sm"
                  >
                    <option value="all">All Payments</option>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending</option>
                    <option value="refunded">Refunded</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-2">Date Range</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Category</label>
                  <select className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#0A0F1F] border-2 border-transparent focus:border-[#3C82F6] dark:focus:border-[#3758FF] transition-all outline-none text-sm">
                    <option value="all">All Categories</option>
                    <option value="rent-friend">Rent a Friend</option>
                    <option value="blind-date">Blind Date</option>
                    <option value="business-meetup">Business Meetup</option>
                  </select>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Bookings Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card variant="glass">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      Booking ID
                    </th>
                    <th className="text-left py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      Customer
                    </th>
                    <th className="text-left py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      Provider
                    </th>
                    <th className="text-left py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      Category
                    </th>
                    <th className="text-left py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      Date & Time
                    </th>
                    <th className="text-left py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      Price
                    </th>
                    <th className="text-left py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      Payment
                    </th>
                    <th className="text-left py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      Status
                    </th>
                    <th className="text-left py-4 px-4 text-sm text-gray-600 dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, index) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.05 }}
                      className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <p className="text-sm font-mono">{booking.id}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm">{booking.customer.name}</p>
                        <p className="text-xs text-gray-500">{booking.customer.email}</p>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={booking.provider.image}
                            alt={booking.provider.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <p className="text-sm">{booking.provider.name}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex px-2 py-1 rounded-full text-xs bg-[#F2F4F7] dark:bg-[#0A0F1F]">
                          {booking.category}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm">{new Date(booking.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                        <p className="text-xs text-gray-500">{booking.time}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm">₹{booking.price}</p>
                        <p className="text-xs text-gray-500">{booking.duration}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(booking.paymentStatus)}`}>
                          {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="relative group">
                          <button className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs ${getStatusColor(booking.bookingStatus)} hover:opacity-80 transition-opacity`}>
                            {getStatusIcon(booking.bookingStatus)}
                            {booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          
                          {/* Status Dropdown */}
                          <div className="absolute hidden group-hover:block top-full left-0 mt-1 w-40 glass dark:glass-dark rounded-xl overflow-hidden shadow-lg z-10">
                            {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                              <button
                                key={status}
                                onClick={() => updateBookingStatus(booking.id, status)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-white/20 dark:hover:bg-white/10 transition-colors"
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="w-8 h-8 rounded-full glass dark:glass-dark flex items-center justify-center hover:bg-white/20 dark:hover:bg-white/10"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing 1-6 of 2,847 bookings
              </p>
              <div className="flex gap-2">
                <button className="px-4 py-2 rounded-full glass dark:glass-dark text-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all">
                  Previous
                </button>
                <button className="px-4 py-2 rounded-full bg-gradient-to-r from-[#3C82F6] to-[#1F3C88] text-white text-sm">
                  1
                </button>
                <button className="px-4 py-2 rounded-full glass dark:glass-dark text-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all">
                  2
                </button>
                <button className="px-4 py-2 rounded-full glass dark:glass-dark text-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all">
                  3
                </button>
                <button className="px-4 py-2 rounded-full glass dark:glass-dark text-sm hover:bg-white/20 dark:hover:bg-white/10 transition-all">
                  Next
                </button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
