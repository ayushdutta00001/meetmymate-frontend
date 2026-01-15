import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Card } from '../Card';
import { Button } from '../Button';
import {
  ArrowLeft,
  TrendingUp,
  Calendar,
  DollarSign,
  Clock,
  Star,
  User,
  CheckCircle,
  XCircle,
  Eye,
  Settings,
  Wallet,
  BarChart3,
  MapPin,
  Phone,
  Mail,
  Edit,
  Plus,
  Download,
} from 'lucide-react';
import { WithdrawalModal } from '../modals/WithdrawalModal';
import { AvailabilityEditModal } from '../modals/AvailabilityEditModal';
import { ProfileEditModal } from '../modals/ProfileEditModal';

interface ProviderDashboardScreenProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

interface Booking {
  id: string;
  customerName: string;
  customerImage: string;
  date: string;
  time: string;
  duration: number;
  location: string;
  amount: number;
  status: 'upcoming' | 'completed' | 'cancelled';
  earnings: number;
}

interface Earning {
  id: string;
  date: string;
  bookingId: string;
  customerName: string;
  amount: number;
  commission: number;
  netEarnings: number;
  status: 'pending' | 'paid' | 'processing';
}

export function ProviderDashboardScreen({ onBack, onNavigate }: ProviderDashboardScreenProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'bookings' | 'earnings' | 'availability' | 'profile'>('overview');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showBookingDetails, setShowBookingDetails] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showAvailabilityEditModal, setShowAvailabilityEditModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);

  // Mock provider data
  const [providerData, setProviderData] = useState({
    name: 'Priya Sharma',
    image: 'https://images.unsplash.com/photo-1543807641-bd607cfa8dca?w=400',
    rating: 4.8,
    totalReviews: 127,
    completedBookings: 89,
    hourlyRate: 500,
    responseTime: '< 10 mins',
    joinDate: 'March 2024',
    verified: true,
    bio: 'Love exploring cafes, hiking, and deep conversations. Let\'s make memories!',
    interests: ['Coffee', 'Travel', 'Art', 'Photography'],
    languages: ['English', 'Hindi', 'Marathi'],
    city: 'Mumbai',
    phone: '+91 98765 43210',
    email: 'priya.sharma@email.com',
  });

  const [stats, setStats] = useState({
    totalEarnings: 44500,
    thisMonth: 12500,
    pendingPayout: 8900,
    availableForWithdrawal: 35600,
    upcomingBookings: 5,
    completedThisMonth: 25,
    averageRating: 4.8,
    responseRate: 98,
  });

  const bookings: Booking[] = [
    {
      id: 'RAF-2024-101',
      customerName: 'Rahul Verma',
      customerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      date: '2024-12-28',
      time: '2:00 PM',
      duration: 3,
      location: 'Cafe Coffee Day, Bandra',
      amount: 1500,
      status: 'upcoming',
      earnings: 1200,
    },
    {
      id: 'RAF-2024-102',
      customerName: 'Ananya Kapoor',
      customerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      date: '2024-12-26',
      time: '4:00 PM',
      duration: 2,
      location: 'Marine Drive',
      amount: 1000,
      status: 'upcoming',
      earnings: 800,
    },
    {
      id: 'RAF-2024-103',
      customerName: 'Arjun Singh',
      customerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      date: '2024-12-24',
      time: '11:00 AM',
      duration: 4,
      location: 'Gateway of India',
      amount: 2000,
      status: 'completed',
      earnings: 1600,
    },
  ];

  const earnings: Earning[] = [
    {
      id: 'E-001',
      date: '2024-12-24',
      bookingId: 'RAF-2024-103',
      customerName: 'Arjun Singh',
      amount: 2000,
      commission: 400,
      netEarnings: 1600,
      status: 'processing',
    },
    {
      id: 'E-002',
      date: '2024-12-22',
      bookingId: 'RAF-2024-098',
      customerName: 'Sneha Mehta',
      amount: 1500,
      commission: 300,
      netEarnings: 1200,
      status: 'paid',
    },
    {
      id: 'E-003',
      date: '2024-12-20',
      bookingId: 'RAF-2024-095',
      customerName: 'Vikram Patel',
      amount: 2500,
      commission: 500,
      netEarnings: 2000,
      status: 'paid',
    },
  ];

  const [availability, setAvailability] = useState([
    { day: 'Monday', slots: [{ start: '10:00', end: '14:00' }, { start: '17:00', end: '21:00' }], enabled: true },
    { day: 'Tuesday', slots: [{ start: '17:00', end: '21:00' }], enabled: true },
    { day: 'Wednesday', slots: [{ start: '10:00', end: '14:00' }], enabled: true },
    { day: 'Thursday', slots: [{ start: '17:00', end: '21:00' }], enabled: false },
    { day: 'Friday', slots: [{ start: '10:00', end: '21:00' }], enabled: true },
    { day: 'Saturday', slots: [{ start: '10:00', end: '23:00' }], enabled: true },
    { day: 'Sunday', slots: [{ start: '12:00', end: '20:00' }], enabled: true },
  ]);

  const handleWithdrawal = (amount: number, method: string) => {
    console.log(`Withdrawing ₹${amount} via ${method}`);
    setStats({ ...stats, availableForWithdrawal: stats.availableForWithdrawal - amount });
  };

  const handleSaveAvailability = (newAvailability: any) => {
    setAvailability(newAvailability);
  };

  const handleSaveProfile = (newProfile: any) => {
    setProviderData(newProfile);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-700';
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-orange-100 text-orange-700';
      case 'paid':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onBack}
                className="w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center"
              >
                <ArrowLeft className="w-5 h-5" />
              </motion.button>
              <div>
                <h2 className="mb-1">Provider Dashboard</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Manage your Rent-a-Friend services</p>
              </div>
            </div>
            <button className="w-10 h-10 rounded-full glass dark:glass-dark flex items-center justify-center">
              <Settings className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Tabs */}
        <div className="mb-6">
          <div className="flex gap-2 p-1 bg-white/70 dark:bg-gray-800/70 rounded-xl border border-gray-200/50 dark:border-gray-700/50 backdrop-blur-xl overflow-x-auto">
            {(['overview', 'bookings', 'earnings', 'availability', 'profile'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 rounded-lg transition-all text-sm whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-gradient-to-r from-[#3C82F6] to-[#3758FF] text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                style={{ fontWeight: activeTab === tab ? 600 : 500 }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card variant="glass" hover={false}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-green-500" />
                </div>
                <p className="text-2xl mb-1">₹{stats.totalEarnings.toLocaleString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
              </Card>

              <Card variant="glass" hover={false}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-2 py-1 rounded-full">
                    This Month
                  </span>
                </div>
                <p className="text-2xl mb-1">₹{stats.thisMonth.toLocaleString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Month Earnings</p>
              </Card>

              <Card variant="glass" hover={false}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-500 flex items-center justify-center">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <p className="text-2xl mb-1">₹{stats.pendingPayout.toLocaleString()}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending Payout</p>
              </Card>

              <Card variant="glass" hover={false}>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded-full">
                    {stats.responseRate}%
                  </span>
                </div>
                <p className="text-2xl mb-1">{stats.averageRating}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card variant="glass" hover={false}>
              <h3 className="mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <button
                  onClick={() => setActiveTab('earnings')}
                  className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 hover:shadow-lg transition-all text-left"
                >
                  <Wallet className="w-6 h-6 text-green-600 dark:text-green-400 mb-2" />
                  <p className="text-sm mb-1">Withdraw Earnings</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">₹{stats.availableForWithdrawal.toLocaleString()} available</p>
                </button>

                <button
                  onClick={() => setActiveTab('availability')}
                  className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-50 dark:from-blue-900/20 dark:to-blue-900/20 border border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all text-left"
                >
                  <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
                  <p className="text-sm mb-1">Update Availability</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Manage your schedule</p>
                </button>

                <button
                  onClick={() => setActiveTab('profile')}
                  className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-50 dark:from-purple-900/20 dark:to-purple-900/20 border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all text-left"
                >
                  <Edit className="w-6 h-6 text-purple-600 dark:text-purple-400 mb-2" />
                  <p className="text-sm mb-1">Edit Profile</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Update your information</p>
                </button>
              </div>
            </Card>

            {/* Recent Activity */}
            <Card variant="glass" hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3>Recent Bookings</h3>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {bookings.slice(0, 3).map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={booking.customerImage}
                        alt={booking.customerName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm mb-1">{booking.customerName}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {booking.date} • {booking.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm mb-1">₹{booking.earnings}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card variant="glass" hover={false}>
              <h3 className="mb-4">All Bookings</h3>
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all cursor-pointer"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowBookingDetails(true);
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={booking.customerImage}
                          alt={booking.customerName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm mb-1">{booking.customerName}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">Booking ID: {booking.id}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Date & Time</p>
                        <p className="text-gray-900 dark:text-white">{booking.date}</p>
                        <p className="text-gray-900 dark:text-white">{booking.time}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Duration</p>
                        <p className="text-gray-900 dark:text-white">{booking.duration} hours</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Location</p>
                        <p className="text-gray-900 dark:text-white">{booking.location}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 mb-1">Your Earnings</p>
                        <p className="text-green-600 dark:text-green-400">₹{booking.earnings}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Earnings Tab */}
        {activeTab === 'earnings' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Withdrawal Card */}
            <Card variant="glass" hover={false}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="mb-2">Available for Withdrawal</h3>
                  <p className="text-3xl text-green-600 dark:text-green-400">₹{stats.availableForWithdrawal.toLocaleString()}</p>
                </div>
                <button 
                  onClick={() => setShowWithdrawalModal(true)}
                  className="px-4 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-xl transition-all flex items-center gap-2"
                >
                  <Wallet className="w-5 h-5" />
                  Withdraw Now
                </button>
              </div>
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  💡 Earnings are processed weekly. Your next payout is scheduled for Friday, Jan 3, 2025.
                </p>
              </div>
            </Card>

            {/* Earnings Breakdown */}
            <Card variant="glass" hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3>Earnings History</h3>
                <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Date</th>
                      <th className="text-left py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Booking ID</th>
                      <th className="text-left py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Customer</th>
                      <th className="text-right py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Amount</th>
                      <th className="text-right py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Commission</th>
                      <th className="text-right py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Net Earnings</th>
                      <th className="text-center py-3 px-2 text-xs text-gray-600 dark:text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {earnings.map((earning) => (
                      <tr key={earning.id} className="border-b border-gray-100 dark:border-gray-800">
                        <td className="py-3 px-2 text-sm">{earning.date}</td>
                        <td className="py-3 px-2 text-sm font-mono text-gray-600 dark:text-gray-400">{earning.bookingId}</td>
                        <td className="py-3 px-2 text-sm">{earning.customerName}</td>
                        <td className="py-3 px-2 text-sm text-right">₹{earning.amount}</td>
                        <td className="py-3 px-2 text-sm text-right text-red-600 dark:text-red-400">-₹{earning.commission}</td>
                        <td className="py-3 px-2 text-sm text-right text-green-600 dark:text-green-400">₹{earning.netEarnings}</td>
                        <td className="py-3 px-2 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(earning.status)}`}>
                            {earning.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Commission Info */}
            <Card variant="glass" hover={false}>
              <h3 className="mb-4">Commission Structure</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <span className="text-sm">Platform Commission</span>
                  <span className="text-sm">20%</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                  <span className="text-sm">Your Earnings</span>
                  <span className="text-sm text-green-600 dark:text-green-400">80%</span>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-xs text-gray-700 dark:text-gray-300">
                    For every ₹1,000 booking, you earn ₹800 after 20% platform commission.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Availability Tab */}
        {activeTab === 'availability' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card variant="glass" hover={false}>
              <h3 className="mb-4">Manage Availability</h3>
              <div className="space-y-3">
                {availability.map((day) => (
                  <div key={day.day} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={day.enabled}
                          className="w-5 h-5 rounded"
                          readOnly
                        />
                        <span className="text-sm">{day.day}</span>
                      </div>
                      <button 
                        onClick={() => setShowAvailabilityEditModal(true)}
                        className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
                    {day.enabled && (
                      <div className="flex flex-wrap gap-2 ml-8">
                        {day.slots.map((slot, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs"
                          >
                            {slot.start} - {slot.end}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setShowAvailabilityEditModal(true)}
                  className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Edit Availability Schedule
                </button>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <Card variant="glass" hover={false}>
              <div className="flex items-center justify-between mb-4">
                <h3>Profile Information</h3>
                <Button 
                  variant="primary" 
                  size="sm" 
                  icon={<Edit className="w-4 h-4" />}
                  onClick={() => setShowProfileEditModal(true)}
                >
                  Edit Profile
                </Button>
              </div>
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={providerData.image}
                  alt={providerData.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                  <h4 className="mb-1">{providerData.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{providerData.city}</p>
                  <Button variant="outline" size="sm" icon={<Edit className="w-4 h-4" />}>
                    Change Photo
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-2">Hourly Rate (₹)</label>
                  <input
                    type="number"
                    value={providerData.hourlyRate}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all"
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Bio</label>
                  <textarea
                    value={providerData.bio}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-blue-500 transition-all resize-none"
                    rows={3}
                    readOnly
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Interests</label>
                  <div className="flex flex-wrap gap-2">
                    {providerData.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-sm"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Languages</label>
                  <div className="flex flex-wrap gap-2">
                    {providerData.languages.map((language, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm"
                      >
                        {language}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Phone</label>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{providerData.phone}</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Email</label>
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{providerData.email}</span>
                    </div>
                  </div>
                </div>

                <Button variant="primary" fullWidth>
                  Save Changes
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Booking Details Modal */}
      {showBookingDetails && selectedBooking && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#0A0F1F] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="mb-2">Booking Details</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedBooking.id}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(selectedBooking.status)}`}>
                  {selectedBooking.status}
                </span>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <img
                  src={selectedBooking.customerImage}
                  alt={selectedBooking.customerName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <p className="mb-1">{selectedBooking.customerName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Customer</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Date</p>
                  <p className="text-sm">{selectedBooking.date}</p>
                </div>
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Time</p>
                  <p className="text-sm">{selectedBooking.time}</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-900/20">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Duration</p>
                  <p className="text-sm">{selectedBooking.duration} hours</p>
                </div>
                <div className="p-4 rounded-xl bg-green-50 dark:bg-green-900/20">
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Your Earnings</p>
                  <p className="text-sm text-green-600 dark:text-green-400">₹{selectedBooking.earnings}</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Location</p>
                <p className="text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {selectedBooking.location}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Financial Breakdown</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Total Amount</span>
                    <span>₹{selectedBooking.amount}</span>
                  </div>
                  <div className="flex justify-between text-red-600 dark:text-red-400">
                    <span>Platform Commission (20%)</span>
                    <span>-₹{selectedBooking.amount - selectedBooking.earnings}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-amber-200 dark:border-amber-800 text-green-600 dark:text-green-400">
                    <span>Your Earnings</span>
                    <span>₹{selectedBooking.earnings}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-800 flex gap-3">
              <Button
                variant="outline"
                fullWidth
                onClick={() => setShowBookingDetails(false)}
              >
                Close
              </Button>
              {selectedBooking.status === 'upcoming' && (
                <Button variant="primary" fullWidth>
                  Contact Customer
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {showWithdrawalModal && (
        <WithdrawalModal
          isOpen={showWithdrawalModal}
          onClose={() => setShowWithdrawalModal(false)}
          availableAmount={stats.availableForWithdrawal}
          onWithdraw={handleWithdrawal}
        />
      )}

      {/* Availability Edit Modal */}
      {showAvailabilityEditModal && (
        <AvailabilityEditModal
          isOpen={showAvailabilityEditModal}
          onClose={() => setShowAvailabilityEditModal(false)}
          initialAvailability={availability}
          onSave={handleSaveAvailability}
        />
      )}

      {/* Profile Edit Modal */}
      {showProfileEditModal && (
        <ProfileEditModal
          isOpen={showProfileEditModal}
          onClose={() => setShowProfileEditModal(false)}
          initialProfile={providerData}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}