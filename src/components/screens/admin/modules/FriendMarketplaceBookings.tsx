import React, { useState } from 'react';
import { Search, Filter, Calendar, Eye, X, Ban, CheckCircle, DollarSign, MapPin, Clock } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
export function FriendMarketplaceBookings() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedService, setSelectedService] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Sample Bookings Data
  const bookings = [
    {
      id: 'BK-2847',
      customer: { name: 'Priya Sharma', id: 'C-8821', phone: '+91 98765 43210' },
      provider: { name: 'Rahul Verma', id: 'P-442', rating: 4.8 },
      service: 'Movie Buddy',
      date: '2026-04-15',
      time: '6:00 PM',
      duration: '3 hours',
      location: 'PVR Cinemas, Andheri',
      status: 'confirmed',
      paymentStatus: 'paid',
      amount: 1500,
      createdAt: '2026-04-10 2:30 PM',
      notes: 'Customer prefers thriller genre',
    },
    {
      id: 'BK-2846',
      customer: { name: 'Amit Patel', id: 'C-7712', phone: '+91 98123 45678' },
      provider: { name: 'Sneha Reddy', id: 'P-338', rating: 4.9 },
      service: 'Dining Partner',
      date: '2026-04-14',
      time: '8:00 PM',
      duration: '2 hours',
      location: 'Barbeque Nation, Bandra',
      status: 'completed',
      paymentStatus: 'paid',
      amount: 2000,
      createdAt: '2026-04-11 5:15 PM',
      notes: 'Vegetarian preferences',
    },
    {
      id: 'BK-2845',
      customer: { name: 'Neha Singh', id: 'C-6634', phone: '+91 97654 32109' },
      provider: { name: 'Vikram Kumar', id: 'P-521', rating: 4.7 },
      service: 'Explore City',
      date: '2026-04-16',
      time: '10:00 AM',
      duration: '5 hours',
      location: 'Gateway of India, Mumbai',
      status: 'pending',
      paymentStatus: 'pending',
      amount: 2500,
      createdAt: '2026-04-12 9:20 AM',
      notes: 'First time visitor to Mumbai',
    },
    {
      id: 'BK-2844',
      customer: { name: 'Rohan Mehta', id: 'C-5523', phone: '+91 96543 21098' },
      provider: { name: 'Anjali Desai', id: 'P-289', rating: 5.0 },
      service: 'Party Companion',
      date: '2026-04-13',
      time: '9:00 PM',
      duration: '4 hours',
      location: 'Trilogy, Juhu',
      status: 'completed',
      paymentStatus: 'paid',
      amount: 3000,
      createdAt: '2026-04-09 7:45 PM',
      notes: '',
    },
    {
      id: 'BK-2843',
      customer: { name: 'Kavya Iyer', id: 'C-4412', phone: '+91 95432 10987' },
      provider: { name: 'Arjun Singh', id: 'P-667', rating: 4.6 },
      service: 'Emotional Support',
      date: '2026-04-12',
      time: '3:00 PM',
      duration: '2 hours',
      location: 'Marine Drive, Mumbai',
      status: 'cancelled',
      paymentStatus: 'refunded',
      amount: 1800,
      createdAt: '2026-04-08 11:30 AM',
      notes: 'Cancelled by customer',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
      case 'completed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
      case 'cancelled':
        return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
      case 'refunded':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400';
    }
  };

  const handleViewDetails = (booking: any) => {
    setSelectedBooking(booking);
    setShowDetailModal(true);
  };

  const handleCancelBooking = (bookingId: string) => {
    alert(`Cancel booking ${bookingId}`);
  };

  const handleMarkCompleted = (bookingId: string) => {
    alert(`Mark booking ${bookingId} as completed`);
  };

  const handleIssueRefund = (bookingId: string) => {
    alert(`Issue refund for booking ${bookingId}`);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.provider.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || booking.status === selectedStatus;
    const matchesService = selectedService === 'all' || booking.service === selectedService;
    return matchesSearch && matchesStatus && matchesService;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Bookings Management</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage customer booking requests and lifecycle
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search bookings, customers, providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Service Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Services</option>
              <option value="Movie Buddy">Movie Buddy</option>
              <option value="Dining Partner">Dining Partner</option>
              <option value="Party Companion">Party Companion</option>
              <option value="Explore City">Explore City</option>
              <option value="Emotional Support">Emotional Support</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Booking ID
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Duration
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">{booking.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{booking.customer.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{booking.customer.id}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{booking.provider.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        ⭐ {booking.provider.rating}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">{booking.service}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">{booking.date}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{booking.time}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">{booking.duration}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm text-gray-900 dark:text-white">₹{booking.amount}</p>
                      <span className={`text-xs px-2 py-1 rounded ${getPaymentStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="p-2 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1A1F2E] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h2 className="text-xl text-gray-900 dark:text-white">Booking Details</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBooking.id}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Badges */}
              <div className="flex items-center gap-3">
                <span className={`text-sm px-3 py-1 rounded ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
                <span className={`text-sm px-3 py-1 rounded ${getPaymentStatusColor(selectedBooking.paymentStatus)}`}>
                  {selectedBooking.paymentStatus}
                </span>
              </div>

              {/* Customer Info */}
              <div>
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Customer Information</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <strong>Name:</strong> {selectedBooking.customer.name}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    <strong>ID:</strong> {selectedBooking.customer.id}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    <strong>Phone:</strong> {selectedBooking.customer.phone}
                  </p>
                </div>
              </div>

              {/* Provider Info */}
              <div>
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Provider Information</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <strong>Name:</strong> {selectedBooking.provider.name}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    <strong>ID:</strong> {selectedBooking.provider.id}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    <strong>Rating:</strong> ⭐ {selectedBooking.provider.rating}
                  </p>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Booking Details</h3>
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm text-gray-900 dark:text-white">
                    <strong>Service:</strong> {selectedBooking.service}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    <strong>Date:</strong> {selectedBooking.date}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    <strong>Time:</strong> {selectedBooking.time}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    <strong>Duration:</strong> {selectedBooking.duration}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span><strong>Location:</strong> {selectedBooking.location}</span>
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    <strong>Amount:</strong> ₹{selectedBooking.amount}
                  </p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    <strong>Created:</strong> {selectedBooking.createdAt}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {selectedBooking.notes && (
                <div>
                  <h3 className="text-sm text-gray-600 dark:text-gray-400 mb-2">Notes</h3>
                  <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                    <p className="text-sm text-gray-900 dark:text-white">{selectedBooking.notes}</p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                {selectedBooking.status === 'pending' && (
                  <button
                    onClick={() => handleCancelBooking(selectedBooking.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    <Ban className="w-4 h-4" />
                    Cancel Booking
                  </button>
                )}
                {selectedBooking.status === 'confirmed' && (
                  <button
                    onClick={() => handleMarkCompleted(selectedBooking.id)}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark Completed
                  </button>
                )}
                {selectedBooking.paymentStatus === 'paid' && selectedBooking.status !== 'completed' && (
                  <button
                    onClick={() => handleIssueRefund(selectedBooking.id)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                  >
                    <DollarSign className="w-4 h-4" />
                    Issue Refund
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
