import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  Clock,
  User,
  Users,
  MapPin,
  DollarSign,
  Eye,
  Filter,
  Search,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Phone,
  Mail,
  TrendingUp,
  MoreVertical,
} from 'lucide-react';
import { toast } from 'react-toastify';

interface RentFriendBooking {
  id: string;
  bookingId: string;
  customerName: string;
  customerId: string;
  customerEmail: string;
  customerPhone: string;
  providerName: string;
  providerId: string;
  providerEmail: string;
  providerPhone: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  activity: string;
  amount: number;
  commission: number;
  paymentStatus: 'paid' | 'pending' | 'refunded' | 'failed';
  bookingStatus: 'confirmed' | 'pending' | 'completed' | 'cancelled' | 'ongoing';
  createdAt: string;
  chatEnabled: boolean;
  rating?: number;
  review?: string;
}

export function AdminRentFriendBookings() {
  const [activeTab, setActiveTab] = useState<'all' | 'confirmed' | 'pending' | 'ongoing' | 'completed' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<RentFriendBooking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Mock booking data - in real app, this comes from database
  const bookings: RentFriendBooking[] = [
    {
      id: '1',
      bookingId: 'RF-2024-12-24-001',
      customerName: 'Amit Kumar',
      customerId: 'USR-4523',
      customerEmail: 'amit.k@email.com',
      customerPhone: '+91 98765 43210',
      providerName: 'Priya Sharma',
      providerId: 'PRV-2134',
      providerEmail: 'priya.s@email.com',
      providerPhone: '+91 98765 12345',
      date: '2024-12-26',
      time: '2:00 PM',
      duration: '4 hours',
      location: 'Colaba, Mumbai',
      activity: 'City tour and food tasting',
      amount: 2000,
      commission: 400,
      paymentStatus: 'paid',
      bookingStatus: 'confirmed',
      createdAt: '2024-12-24 10:30',
      chatEnabled: true,
    },
    {
      id: '2',
      bookingId: 'RF-2024-12-23-078',
      customerName: 'Sarah Johnson',
      customerId: 'USR-7821',
      customerEmail: 'sarah.j@email.com',
      customerPhone: '+1 555 123 4567',
      providerName: 'Rahul Mehta',
      providerId: 'PRV-3421',
      providerEmail: 'rahul.m@email.com',
      providerPhone: '+91 98765 67890',
      date: '2024-12-24',
      time: '5:00 PM',
      duration: '2 hours',
      location: 'Bandra, Mumbai',
      activity: 'Coffee meetup',
      amount: 1000,
      commission: 200,
      paymentStatus: 'paid',
      bookingStatus: 'ongoing',
      createdAt: '2024-12-23 14:20',
      chatEnabled: true,
    },
    {
      id: '3',
      bookingId: 'RF-2024-12-22-054',
      customerName: 'Vikram Patel',
      customerId: 'USR-3421',
      customerEmail: 'vikram.p@email.com',
      customerPhone: '+91 98765 11111',
      providerName: 'Ananya Kumar',
      providerId: 'PRV-5678',
      providerEmail: 'ananya.k@email.com',
      providerPhone: '+91 98765 22222',
      date: '2024-12-22',
      time: '11:00 AM',
      duration: '8 hours',
      location: 'Gateway of India, Mumbai',
      activity: 'Full day sightseeing',
      amount: 4000,
      commission: 800,
      paymentStatus: 'paid',
      bookingStatus: 'completed',
      createdAt: '2024-12-20 09:15',
      chatEnabled: true,
      rating: 5,
      review: 'Amazing experience! Very knowledgeable and friendly.',
    },
    {
      id: '4',
      bookingId: 'RF-2024-12-25-012',
      customerName: 'Neha Reddy',
      customerId: 'USR-9812',
      customerEmail: 'neha.r@email.com',
      customerPhone: '+91 98765 33333',
      providerName: 'Karan Singh',
      providerId: 'PRV-7890',
      providerEmail: 'karan.s@email.com',
      providerPhone: '+91 98765 44444',
      date: '2024-12-28',
      time: '10:00 AM',
      duration: '4 hours',
      location: 'Powai, Mumbai',
      activity: 'Shopping and lunch',
      amount: 1800,
      commission: 360,
      paymentStatus: 'pending',
      bookingStatus: 'pending',
      createdAt: '2024-12-24 16:45',
      chatEnabled: false,
    },
    {
      id: '5',
      bookingId: 'RF-2024-12-21-089',
      customerName: 'Rohan Das',
      customerId: 'USR-2341',
      customerEmail: 'rohan.d@email.com',
      customerPhone: '+91 98765 55555',
      providerName: 'Meera Joshi',
      providerId: 'PRV-4567',
      providerEmail: 'meera.j@email.com',
      providerPhone: '+91 98765 66666',
      date: '2024-12-21',
      time: '3:00 PM',
      duration: '2 hours',
      location: 'Juhu Beach, Mumbai',
      activity: 'Beach walk',
      amount: 1000,
      commission: 200,
      paymentStatus: 'refunded',
      bookingStatus: 'cancelled',
      createdAt: '2024-12-20 11:00',
      chatEnabled: false,
    },
  ];

  const stats = {
    all: bookings.length,
    confirmed: bookings.filter(b => b.bookingStatus === 'confirmed').length,
    pending: bookings.filter(b => b.bookingStatus === 'pending').length,
    ongoing: bookings.filter(b => b.bookingStatus === 'ongoing').length,
    completed: bookings.filter(b => b.bookingStatus === 'completed').length,
    cancelled: bookings.filter(b => b.bookingStatus === 'cancelled').length,
    totalRevenue: bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.amount, 0),
    totalCommission: bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.commission, 0),
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesTab = activeTab === 'all' || booking.bookingStatus === activeTab;
    const matchesSearch =
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.providerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'ongoing':
        return 'bg-green-100 text-green-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'refunded':
        return 'bg-purple-100 text-purple-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCancelBooking = (bookingId: string) => {
    console.log('Cancelling booking:', bookingId);
    // In real app: API call to cancel booking
    setShowActionMenu(null);
    setShowDetailsModal(false);
  };

  const handleEnableChat = (bookingId: string) => {
    console.log('Enabling chat for:', bookingId);
    // Chat feature coming soon - temporarily disabled
    toast.info('Chat feature coming soon');
    setShowActionMenu(null);
  };

  const handleContactUser = (email: string, phone: string, type: 'email' | 'phone') => {
    if (type === 'email') {
      window.location.href = `mailto:${email}`;
    } else {
      window.location.href = `tel:${phone}`;
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl mb-2">Rent-a-Friend Bookings</h2>
            <p className="text-gray-600">Manage all rental bookings and customer interactions</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-xl hover:bg-gray-50 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">Total</p>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl mb-1">{stats.all}</p>
            <p className="text-xs text-gray-500">All bookings</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">Confirmed</p>
              <CheckCircle className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl mb-1">{stats.confirmed}</p>
            <p className="text-xs text-gray-500">Ready to go</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">Ongoing</p>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl mb-1">{stats.ongoing}</p>
            <p className="text-xs text-gray-500">In progress</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">Completed</p>
              <CheckCircle className="w-4 h-4 text-gray-500" />
            </div>
            <p className="text-2xl mb-1">{stats.completed}</p>
            <p className="text-xs text-gray-500">Finished</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 shadow-lg text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/90">Revenue</p>
              <DollarSign className="w-4 h-4" />
            </div>
            <p className="text-2xl mb-1">₹{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-white/80">Total earned</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="backdrop-blur-xl bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-4 shadow-lg text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/90">Commission</p>
              <DollarSign className="w-4 h-4" />
            </div>
            <p className="text-2xl mb-1">₹{stats.totalCommission.toLocaleString()}</p>
            <p className="text-xs text-white/80">Platform fee</p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 p-1 bg-white/70 rounded-xl border border-gray-200/50 backdrop-blur-xl overflow-x-auto">
          {(['all', 'confirmed', 'pending', 'ongoing', 'completed', 'cancelled'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 rounded-lg transition-all text-sm whitespace-nowrap ${
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

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by booking ID, customer, or provider..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-xl focus:outline-none focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Bookings Table */}
      <div className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Booking ID</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Provider</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono text-gray-900">{booking.bookingId}</p>
                    <p className="text-xs text-gray-500">{booking.createdAt}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm">
                        {booking.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{booking.customerName}</p>
                        <p className="text-xs text-gray-500">{booking.customerId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-white text-sm">
                        {booking.providerName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{booking.providerName}</p>
                        <p className="text-xs text-gray-500">{booking.providerId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-gray-900">
                      <Calendar className="w-3 h-3" />
                      {booking.date}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      {booking.time}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{booking.duration}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">₹{booking.amount.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Fee: ₹{booking.commission}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(booking.bookingStatus)}`}>
                      {booking.bookingStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowDetailsModal(true);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setShowActionMenu(showActionMenu === booking.id ? null : booking.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                          title="More Actions"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                        {showActionMenu === booking.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[150px]">
                            {!booking.chatEnabled && booking.paymentStatus === 'paid' && (
                              <button
                                onClick={() => handleEnableChat(booking.id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                              >
                                <MessageSquare className="w-3 h-3" />
                                Enable Chat
                              </button>
                            )}
                            {booking.bookingStatus === 'confirmed' && (
                              <button
                                onClick={() => handleCancelBooking(booking.id)}
                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                              >
                                <XCircle className="w-3 h-3" />
                                Cancel Booking
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 mb-1">No bookings found</p>
            <p className="text-sm text-gray-500">Bookings will appear here</p>
          </div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showDetailsModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="mb-2">Booking Details</h3>
                  <p className="text-sm text-gray-600">{selectedBooking.bookingId}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(selectedBooking.bookingStatus)}`}>
                    {selectedBooking.bookingStatus}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                    {selectedBooking.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Customer & Provider Information */}
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer Information
                  </h4>
                  <div className="p-4 rounded-lg bg-gray-50 space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm">{selectedBooking.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ID</p>
                      <p className="text-sm">{selectedBooking.customerId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm">{selectedBooking.customerEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm">{selectedBooking.customerPhone}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleContactUser(selectedBooking.customerEmail, selectedBooking.customerPhone, 'email')}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        Email
                      </button>
                      <button
                        onClick={() => handleContactUser(selectedBooking.customerEmail, selectedBooking.customerPhone, 'phone')}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition-all flex items-center justify-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Provider Information
                  </h4>
                  <div className="p-4 rounded-lg bg-gray-50 space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm">{selectedBooking.providerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">ID</p>
                      <p className="text-sm">{selectedBooking.providerId}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm">{selectedBooking.providerEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm">{selectedBooking.providerPhone}</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleContactUser(selectedBooking.providerEmail, selectedBooking.providerPhone, 'email')}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-all flex items-center justify-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        Email
                      </button>
                      <button
                        onClick={() => handleContactUser(selectedBooking.providerEmail, selectedBooking.providerPhone, 'phone')}
                        className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition-all flex items-center justify-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h4 className="text-sm mb-3">Booking Details</h4>
                <div className="grid grid-cols-2 gap-4 p-4 rounded-lg bg-blue-50">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="text-sm">{selectedBooking.date}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Time</p>
                    <p className="text-sm">{selectedBooking.time}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                    <p className="text-sm">{selectedBooking.duration}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Created</p>
                    <p className="text-sm">{selectedBooking.createdAt}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-sm flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {selectedBooking.location}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Activity</p>
                    <p className="text-sm">{selectedBooking.activity}</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div>
                <h4 className="text-sm mb-3">Payment Details</h4>
                <div className="p-4 rounded-lg bg-green-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Booking Amount</p>
                    <p className="text-lg">₹{selectedBooking.amount.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Platform Commission (20%)</p>
                    <p className="text-lg text-purple-600">₹{selectedBooking.commission.toLocaleString()}</p>
                  </div>
                  <div className="pt-2 border-t border-green-200 flex items-center justify-between">
                    <p className="text-sm">Provider Earnings</p>
                    <p className="text-xl text-green-600">₹{(selectedBooking.amount - selectedBooking.commission).toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Chat Status */}
              <div className="p-4 rounded-lg bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-gray-600" />
                  <p className="text-sm">Chat Status</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs ${selectedBooking.chatEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                    {selectedBooking.chatEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                  {!selectedBooking.chatEnabled && selectedBooking.paymentStatus === 'paid' && (
                    <button
                      onClick={() => handleEnableChat(selectedBooking.id)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg text-xs hover:bg-blue-700 transition-all"
                    >
                      Enable Now
                    </button>
                  )}
                </div>
              </div>

              {/* Review (if completed) */}
              {selectedBooking.bookingStatus === 'completed' && selectedBooking.rating && (
                <div>
                  <h4 className="text-sm mb-3">Customer Review</h4>
                  <div className="p-4 rounded-lg bg-yellow-50">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className={`text-lg ${i < selectedBooking.rating! ? 'text-yellow-500' : 'text-gray-300'}`}>
                            ★
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">{selectedBooking.rating}/5</span>
                    </div>
                    {selectedBooking.review && (
                      <p className="text-sm text-gray-700">{selectedBooking.review}</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="flex-1 py-3 rounded-xl border-2 border-gray-200 hover:bg-gray-50 transition-all"
              >
                Close
              </button>
              {selectedBooking.bookingStatus === 'confirmed' && (
                <button
                  onClick={() => handleCancelBooking(selectedBooking.id)}
                  className="flex-1 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all"
                >
                  Cancel Booking
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}