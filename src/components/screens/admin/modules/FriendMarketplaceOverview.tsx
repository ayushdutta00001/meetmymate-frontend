import React from 'react';
import { Users, Calendar, Clock, DollarSign, TrendingUp, UserCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { AdminLayout } from '../AdminLayout';
export function FriendMarketplaceOverview() {
  // KPI Data
  const kpiData = [
    {
      id: 1,
      label: 'Total Bookings',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: Calendar,
      color: 'blue',
    },
    {
      id: 2,
      label: 'Active Providers',
      value: '342',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'green',
    },
    {
      id: 3,
      label: 'Pending Provider Approvals',
      value: '24',
      change: '+3',
      trend: 'neutral',
      icon: Clock,
      color: 'orange',
    },
    {
      id: 4,
      label: 'Revenue (This Month)',
      value: '₹4,28,500',
      change: '+15.8%',
      trend: 'up',
      icon: DollarSign,
      color: 'purple',
    },
  ];

  // Recent Bookings
  const recentBookings = [
    {
      id: 'BK-2847',
      customer: 'Priya Sharma',
      provider: 'Rahul Verma',
      service: 'Movie Buddy',
      date: '2026-04-15',
      time: '6:00 PM',
      status: 'confirmed',
      amount: 1500,
    },
    {
      id: 'BK-2846',
      customer: 'Amit Patel',
      provider: 'Sneha Reddy',
      service: 'Dining Partner',
      date: '2026-04-14',
      time: '8:00 PM',
      status: 'completed',
      amount: 2000,
    },
    {
      id: 'BK-2845',
      customer: 'Neha Singh',
      provider: 'Vikram Kumar',
      service: 'Explore City',
      date: '2026-04-16',
      time: '10:00 AM',
      status: 'pending',
      amount: 2500,
    },
    {
      id: 'BK-2844',
      customer: 'Rohan Mehta',
      provider: 'Anjali Desai',
      service: 'Party Companion',
      date: '2026-04-13',
      time: '9:00 PM',
      status: 'completed',
      amount: 3000,
    },
  ];

  // Recent Provider Applications
  const recentApplications = [
    {
      id: 'PR-124',
      name: 'Karan Malhotra',
      services: ['Movie Buddy', 'Dining Partner'],
      appliedDate: '2026-04-12 3:45 PM',
      status: 'pending',
    },
    {
      id: 'PR-125',
      name: 'Divya Rao',
      services: ['Explore City', 'Emotional Support'],
      appliedDate: '2026-04-12 11:20 AM',
      status: 'pending',
    },
    {
      id: 'PR-126',
      name: 'Arjun Singh',
      services: ['Party Companion'],
      appliedDate: '2026-04-11 5:15 PM',
      status: 'approved',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'approved':
        return 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-400';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400';
      case 'completed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400';
      case 'cancelled':
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400';
    }
  };

  const getKpiColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 dark:bg-blue-500/10';
      case 'green':
        return 'bg-green-50 dark:bg-green-500/10';
      case 'orange':
        return 'bg-orange-50 dark:bg-orange-500/10';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-500/10';
      default:
        return 'bg-gray-50 dark:bg-gray-500/10';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue':
        return 'text-blue-600 dark:text-blue-400';
      case 'green':
        return 'text-green-600 dark:text-green-400';
      case 'orange':
        return 'text-orange-600 dark:text-orange-400';
      case 'purple':
        return 'text-purple-600 dark:text-purple-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Friend Marketplace Overview</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage customer bookings and provider onboarding
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.id}
              className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${getKpiColor(kpi.color)} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${getIconColor(kpi.color)}`} />
                </div>
                {kpi.trend === 'up' && (
                  <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded">
                    {kpi.change}
                  </span>
                )}
                {kpi.trend === 'neutral' && (
                  <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-500/10 px-2 py-1 rounded">
                    {kpi.change}
                  </span>
                )}
              </div>
              <div>
                <p className="text-2xl text-gray-900 dark:text-white mb-1">{kpi.value}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{kpi.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h2 className="text-lg text-gray-900 dark:text-white">Recent Bookings</h2>
              </div>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-start justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-900 dark:text-white">{booking.id}</span>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {booking.customer} → {booking.provider}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
                      <span>{booking.service}</span>
                      <span>•</span>
                      <span>{booking.date}</span>
                      <span>•</span>
                      <span>{booking.time}</span>
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm text-gray-900 dark:text-white">₹{booking.amount}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Provider Applications */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h2 className="text-lg text-gray-900 dark:text-white">New Provider Applications</h2>
              </div>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                View All
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-start justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-gray-900 dark:text-white">{app.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">{app.id}</p>
                    <div className="flex flex-wrap gap-1">
                      {app.services.map((service, index) => (
                        <span
                          key={index}
                          className="text-xs px-2 py-1 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-xs text-gray-500 dark:text-gray-500">{app.appliedDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
