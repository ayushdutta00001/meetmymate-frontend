import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Calendar,
  DollarSign,
  Eye,
  Search,
  Filter,
  Download,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  User,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  Users,
} from 'lucide-react';

interface BusinessBooking {
  id: string;
  bookingDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  expertName: string;
  expertId: string;
  expertEmail: string;
  expertPhone: string;
  expertise: string;
  meetingDate: string;
  meetingTime: string;
  duration: number;
  location: string;
  hourlyRate: number;
  totalAmount: number;
  platformCommission: number;
  expertEarnings: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  meetingType: 'in-person' | 'virtual';
  purpose: string;
  notes?: string;
}

export function AdminBusinessMeetupBookings() {
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled'>('all');
  const [selectedBooking, setSelectedBooking] = useState<BusinessBooking | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock booking data
  const bookings: BusinessBooking[] = [
    {
      id: 'BM-2024-001',
      bookingDate: '2024-12-20 10:30',
      customerName: 'Vikram Patel',
      customerEmail: 'vikram.p@startup.com',
      customerPhone: '+91 98765 43210',
      expertName: 'Rajesh Kumar',
      expertId: 'EXP-1001',
      expertEmail: 'rajesh.k@expert.com',
      expertPhone: '+91 98765 11111',
      expertise: 'Startup Strategy',
      meetingDate: '2024-12-24',
      meetingTime: '10:00 AM',
      duration: 2,
      location: 'Virtual Meeting',
      hourlyRate: 5000,
      totalAmount: 10000,
      platformCommission: 2500,
      expertEarnings: 7500,
      status: 'confirmed',
      paymentStatus: 'paid',
      meetingType: 'virtual',
      purpose: 'Seeking advice on Series A fundraising strategy',
    },
    {
      id: 'BM-2024-002',
      bookingDate: '2024-12-21 14:15',
      customerName: 'Sneha Sharma',
      customerEmail: 'sneha.s@company.com',
      customerPhone: '+91 98765 43211',
      expertName: 'Priya Mehta',
      expertId: 'EXP-1002',
      expertEmail: 'priya.m@expert.com',
      expertPhone: '+91 98765 22222',
      expertise: 'Marketing Strategy',
      meetingDate: '2024-12-25',
      meetingTime: '3:00 PM',
      duration: 1,
      location: 'Cafe Coffee Day, Bandra',
      hourlyRate: 3500,
      totalAmount: 3500,
      platformCommission: 875,
      expertEarnings: 2625,
      status: 'pending',
      paymentStatus: 'paid',
      meetingType: 'in-person',
      purpose: 'Digital marketing campaign planning',
    },
    {
      id: 'BM-2024-003',
      bookingDate: '2024-12-18 09:00',
      customerName: 'Arjun Singh',
      customerEmail: 'arjun.s@tech.com',
      customerPhone: '+91 98765 43212',
      expertName: 'Amit Verma',
      expertId: 'EXP-1003',
      expertEmail: 'amit.v@expert.com',
      expertPhone: '+91 98765 33333',
      expertise: 'Tech Innovation',
      meetingDate: '2024-12-22',
      meetingTime: '11:00 AM',
      duration: 3,
      location: 'Virtual Meeting',
      hourlyRate: 6000,
      totalAmount: 18000,
      platformCommission: 4500,
      expertEarnings: 13500,
      status: 'completed',
      paymentStatus: 'paid',
      meetingType: 'virtual',
      purpose: 'AI product development consultation',
      notes: 'Excellent session. Customer very satisfied.',
    },
    {
      id: 'BM-2024-004',
      bookingDate: '2024-12-19 16:30',
      customerName: 'Neha Kapoor',
      customerEmail: 'neha.k@business.com',
      customerPhone: '+91 98765 43213',
      expertName: 'Sanjay Gupta',
      expertId: 'EXP-1004',
      expertEmail: 'sanjay.g@expert.com',
      expertPhone: '+91 98765 44444',
      expertise: 'Financial Planning',
      meetingDate: '2024-12-23',
      meetingTime: '2:00 PM',
      duration: 2,
      location: 'Starbucks, Worli',
      hourlyRate: 4500,
      totalAmount: 9000,
      platformCommission: 2250,
      expertEarnings: 6750,
      status: 'cancelled',
      paymentStatus: 'refunded',
      meetingType: 'in-person',
      purpose: 'Business expansion financial planning',
      notes: 'Cancelled by customer - personal emergency',
    },
  ];

  const stats = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
    totalRevenue: bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.totalAmount, 0),
    platformEarnings: bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.platformCommission, 0),
    expertEarnings: bookings
      .filter(b => b.paymentStatus === 'paid')
      .reduce((sum, b) => sum + b.expertEarnings, 0),
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesTab = activeTab === 'all' || booking.status === activeTab;
    const matchesSearch =
      booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.expertName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.expertise.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'confirmed':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
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
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleConfirmBooking = (bookingId: string) => {
    console.log('Confirming booking:', bookingId);
    setShowDetailsModal(false);
  };

  const handleCancelBooking = (bookingId: string) => {
    console.log('Cancelling booking:', bookingId);
    setShowDetailsModal(false);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl mb-2">Business Meetup Bookings</h2>
            <p className="text-gray-600">Manage all expert consultation bookings</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-xl hover:bg-gray-50 transition-all flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="px-4 py-2 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-xl hover:bg-gray-50 transition-all flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">Total</p>
              <Calendar className="w-4 h-4 text-blue-500" />
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
              <p className="text-xs text-gray-600">Pending</p>
              <Clock className="w-4 h-4 text-yellow-500" />
            </div>
            <p className="text-2xl mb-1">{stats.pending}</p>
            <p className="text-xs text-gray-500">Need action</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">Confirmed</p>
              <CheckCircle className="w-4 h-4 text-blue-500" />
            </div>
            <p className="text-2xl mb-1">{stats.confirmed}</p>
            <p className="text-xs text-gray-500">Upcoming</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="backdrop-blur-xl bg-white/70 border border-gray-200/50 rounded-2xl p-4 shadow-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-600">Completed</p>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl mb-1">{stats.completed}</p>
            <p className="text-xs text-gray-500">Done</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-xl bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-4 shadow-lg text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/90">Total Revenue</p>
              <DollarSign className="w-4 h-4" />
            </div>
            <p className="text-2xl mb-1">₹{Math.round(stats.totalRevenue / 1000)}K</p>
            <p className="text-xs text-white/80">All bookings</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="backdrop-blur-xl bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 shadow-lg text-white"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-white/90">Platform Earnings</p>
              <TrendingUp className="w-4 h-4" />
            </div>
            <p className="text-2xl mb-1">₹{Math.round(stats.platformEarnings / 1000)}K</p>
            <p className="text-xs text-white/80">Commission</p>
          </motion.div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 p-1 bg-white/70 rounded-xl border border-gray-200/50 backdrop-blur-xl overflow-x-auto">
          {(['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const).map((tab) => (
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
            placeholder="Search by booking ID, customer, expert, or expertise..."
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
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Expert</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Meeting</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Duration</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Payment</th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-mono text-gray-900">{booking.id}</p>
                    <p className="text-xs text-gray-500">{booking.bookingDate}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm">
                        {booking.customerName.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{booking.customerName}</p>
                        <p className="text-xs text-gray-500">{booking.customerEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{booking.expertName}</p>
                      <p className="text-xs text-gray-500">{booking.expertise}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs">
                      <div className="flex items-center gap-1 text-gray-900">
                        <Calendar className="w-3 h-3" />
                        {booking.meetingDate}
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {booking.meetingTime}
                      </div>
                      <p className="text-gray-500 mt-0.5">{booking.meetingType}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">{booking.duration} hr{booking.duration > 1 ? 's' : ''}</p>
                    <p className="text-xs text-gray-500">₹{booking.hourlyRate}/hr</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-900">₹{booking.totalAmount.toLocaleString()}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-green-600">₹{booking.platformCommission.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">25%</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getPaymentStatusColor(booking.paymentStatus)}`}>
                      {booking.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredBookings.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-gray-600 mb-1">No bookings found</p>
            <p className="text-sm text-gray-500">Business meetup bookings will appear here</p>
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
                  <p className="text-sm text-gray-600">{selectedBooking.id}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(selectedBooking.status)}`}>
                    {selectedBooking.status}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                    {selectedBooking.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <div>
                  <h4 className="text-sm mb-3 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Customer Information
                  </h4>
                  <div className="p-4 rounded-lg bg-blue-50 space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm">{selectedBooking.customerName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {selectedBooking.customerEmail}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {selectedBooking.customerPhone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Expert Information */}
                <div>
                  <h4 className="text-sm mb-3 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Expert Information
                  </h4>
                  <div className="p-4 rounded-lg bg-purple-50 space-y-2">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm">{selectedBooking.expertName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Expertise</p>
                      <p className="text-sm">{selectedBooking.expertise}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm flex items-center gap-2">
                        <Mail className="w-3 h-3" />
                        {selectedBooking.expertEmail}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {selectedBooking.expertPhone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Meeting Details */}
              <div className="mt-6">
                <h4 className="text-sm mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Meeting Details
                </h4>
                <div className="p-4 rounded-lg bg-green-50 space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Date</p>
                      <p className="text-sm">{selectedBooking.meetingDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Time</p>
                      <p className="text-sm">{selectedBooking.meetingTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Duration</p>
                      <p className="text-sm">{selectedBooking.duration} hour{selectedBooking.duration > 1 ? 's' : ''}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Type</p>
                      <p className="text-sm capitalize">{selectedBooking.meetingType}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Location</p>
                    <p className="text-sm flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      {selectedBooking.location}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Purpose</p>
                    <p className="text-sm">{selectedBooking.purpose}</p>
                  </div>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="mt-6">
                <h4 className="text-sm mb-3 flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Financial Breakdown
                </h4>
                <div className="p-4 rounded-lg bg-amber-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Hourly Rate</p>
                    <p className="text-sm">₹{selectedBooking.hourlyRate.toLocaleString()}/hr</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="text-sm">{selectedBooking.duration} hr</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                    <p className="text-sm">Total Amount</p>
                    <p className="text-lg">₹{selectedBooking.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">Platform Commission (25%)</p>
                    <p className="text-sm text-green-600">₹{selectedBooking.platformCommission.toLocaleString()}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                    <p className="text-sm">Expert Earnings (75%)</p>
                    <p className="text-lg text-purple-600">₹{selectedBooking.expertEarnings.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div className="mt-6">
                  <h4 className="text-sm mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Notes
                  </h4>
                  <div className="p-4 rounded-lg bg-gray-50">
                    <p className="text-sm text-gray-700">{selectedBooking.notes}</p>
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
              {selectedBooking.status === 'pending' && (
                <>
                  <button
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                    className="flex-1 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel Booking
                  </button>
                  <button
                    onClick={() => handleConfirmBooking(selectedBooking.id)}
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Confirm Booking
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
