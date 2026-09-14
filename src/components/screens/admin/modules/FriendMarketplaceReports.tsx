import React from 'react';
import { TrendingUp, Users, Calendar, DollarSign, BarChart3, Star } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { AdminLayout } from '../AdminLayout';
export function FriendMarketplaceReports() {
  // Booking Trends Data
  const bookingTrendsData = [
    { month: 'Oct', bookings: 145 },
    { month: 'Nov', bookings: 198 },
    { month: 'Dec', bookings: 234 },
    { month: 'Jan', bookings: 276 },
    { month: 'Feb', bookings: 312 },
    { month: 'Mar', bookings: 358 },
    { month: 'Apr', bookings: 402 },
  ];

  // Revenue Growth Data
  const revenueGrowthData = [
    { month: 'Oct', revenue: 87500 },
    { month: 'Nov', revenue: 119000 },
    { month: 'Dec', revenue: 140500 },
    { month: 'Jan', revenue: 165600 },
    { month: 'Feb', revenue: 187200 },
    { month: 'Mar', revenue: 214800 },
    { month: 'Apr', revenue: 241200 },
  ];

  // Top Providers Data
  const topProviders = [
    { name: 'Sneha Reddy', bookings: 89, revenue: 53400, rating: 4.9 },
    { name: 'Rahul Verma', bookings: 127, revenue: 63500, rating: 4.8 },
    { name: 'Vikram Kumar', bookings: 73, revenue: 54750, rating: 4.7 },
    { name: 'Anjali Desai', bookings: 68, revenue: 61200, rating: 5.0 },
    { name: 'Priya Kapoor', bookings: 92, revenue: 55200, rating: 4.9 },
  ];

  // Service Performance
  const servicePerformance = [
    { service: 'Dining Partner', bookings: 412 },
    { service: 'Explore City', bookings: 378 },
    { service: 'Movie Buddy', bookings: 345 },
    { service: 'Party Companion', bookings: 298 },
    { service: 'Emotional Support', bookings: 234 },
  ];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-gray-900 dark:text-white mb-2">Reports & Analytics</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Insights on booking trends, revenue, and top performers
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded">
              +12.5%
            </span>
          </div>
          <div>
            <p className="text-2xl text-gray-900 dark:text-white mb-1">402</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Bookings (This Month)</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-500/10 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded">
              +15.8%
            </span>
          </div>
          <div>
            <p className="text-2xl text-gray-900 dark:text-white mb-1">₹2,41,200</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Revenue (This Month)</p>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-500/10 px-2 py-1 rounded">
              +8.2%
            </span>
          </div>
          <div>
            <p className="text-2xl text-gray-900 dark:text-white mb-1">342</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Active Providers</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg text-gray-900 dark:text-white">Booking Trends</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingTrendsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line type="monotone" dataKey="bookings" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Growth */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center gap-3 mb-6">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            <h2 className="text-lg text-gray-900 dark:text-white">Revenue Growth</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
              <XAxis dataKey="month" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} dot={{ fill: '#10B981' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Service Performance */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
        <div className="flex items-center gap-3 mb-6">
          <BarChart3 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-lg text-gray-900 dark:text-white">Service Performance</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={servicePerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis dataKey="service" stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <YAxis stroke="#9CA3AF" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
              }}
            />
            <Bar dataKey="bookings" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Providers */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800">
        <div className="p-6 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-yellow-500" />
            <h2 className="text-lg text-gray-900 dark:text-white">Top Providers</h2>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Total Bookings
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Revenue Generated
                </th>
                <th className="px-6 py-4 text-left text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {topProviders.map((provider, index) => (
                <tr key={provider.name} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">#{index + 1}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">{provider.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">{provider.bookings}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">₹{provider.revenue.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm text-gray-900 dark:text-white">{provider.rating}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

