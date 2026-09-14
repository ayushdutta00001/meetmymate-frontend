import React, { useState } from 'react';
import { Search, Download, Eye, Users, TrendingUp, Briefcase } from 'lucide-react';
import { useBookings } from '../../../../lib/hooks';
import { LoadingState } from '../../../ui/LoadingState';
import { ErrorState } from '../../../ui/ErrorState';

type SubModule = 'all' | 'p2p' | 'investor' | 'experienced';

export function BusinessMeetupOperations() {
  const [subModule, setSubModule] = useState<SubModule>('all');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const { bookings, loading, error, refetch } = useBookings({
    serviceType: 'business-meetup',
    autoFetch: true
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
          <h1 className="text-2xl text-gray-900 dark:text-white">Business Meetup — Operations & Control</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage all business networking and expert consultations</p>
        </div>
        <LoadingState message="Loading bookings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
          <h1 className="text-2xl text-gray-900 dark:text-white">Business Meetup — Operations & Control</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage all business networking and expert consultations</p>
        </div>
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  // P2P Match Bookings
  const p2pBookings = [
    {
      id: 'P2P-3024',
      user1: { id: 'U-8821', name: 'Rahul Sharma', seeking: 'Tech Co-Founder' },
      user2: { id: 'U-7652', name: 'Priya Patel', offering: 'CTO Expertise' },
      date: '2024-12-28',
      industry: 'Technology',
      status: 'Scheduled',
    },
  ];

  // Find Investor Bookings
  const investorBookings = [
    {
      id: 'INV-2041',
      founder: { id: 'U-9012', name: 'Amit Kumar', startup: 'HealthTech Startup' },
      investor: { id: 'INV-501', name: 'Sneha Capital', type: 'Angel Investor' },
      date: '2024-12-28',
      investmentStage: 'Seed Round',
      amount: '₹50L - ₹1Cr',
      status: 'Pending',
    },
  ];

  // Find Experienced People Bookings
  const expertBookings = [
    {
      id: 'EXP-4012',
      client: { id: 'U-5431', name: 'Vikram Singh', company: 'NewCo Ventures' },
      expert: { id: 'EXP-301', name: 'Dr. Anjali Reddy', expertise: 'Healthcare Compliance' },
      date: '2024-12-27',
      sessionType: '1-hour Consultation',
      rate: '₹5,000',
      status: 'Confirmed',
    },
  ];

  const getStatusBadge = (status: string) => {
    const styles = {
      Pending: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300',
      Scheduled: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-300',
      Confirmed: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300',
      Completed: 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-300',
      Cancelled: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300',
    };
    return styles[status as keyof typeof styles] || styles.Pending;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <h1 className="text-2xl text-gray-900 dark:text-white">Business Meetup — Operations & Control</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Manage all business networking and expert consultations</p>
      </div>

      <div className="p-8">
        {/* Sub-Module Tabs */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-2 mb-6 flex gap-2">
          <button
            onClick={() => setSubModule('all')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors ${
              subModule === 'all'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            All Business Meetups
          </button>
          <button
            onClick={() => setSubModule('p2p')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 ${
              subModule === 'p2p'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Peer-to-Peer Match
          </button>
          <button
            onClick={() => setSubModule('investor')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 ${
              subModule === 'investor'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Find Investor
          </button>
          <button
            onClick={() => setSubModule('experienced')}
            className={`flex-1 px-4 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 ${
              subModule === 'experienced'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Find Experienced People
          </button>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Total Bookings', value: '234', color: 'blue' },
            { label: 'Active Sessions', value: '45', color: 'green' },
            { label: 'Pending Matches', value: '12', color: 'yellow' },
            { label: 'Completed This Month', value: '178', color: 'purple' },
          ].map((metric, idx) => (
            <div key={idx} className={`bg-white dark:bg-[#1A1F2E] border-l-4 border-${metric.color}-500 p-4 rounded-lg`}>
              <p className="text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
              <p className="text-2xl text-gray-900 dark:text-white mt-1">{metric.value}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by booking ID, user, or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>Scheduled</option>
              <option>Confirmed</option>
              <option>Completed</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Data Table */}
        {subModule === 'p2p' && (
          <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg text-gray-900 dark:text-white">Peer-to-Peer Match Bookings</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">User 1 (Seeking)</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">User 2 (Offering)</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Date</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Industry</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Status</th>
                  <th className="px-6 py-3 text-right text-xs text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {p2pBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-[#0A0F1F]">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">{booking.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{booking.user1.name}</p>
                        <p className="text-xs text-gray-500">{booking.user1.seeking}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{booking.user2.name}</p>
                        <p className="text-xs text-gray-500">{booking.user2.offering}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{booking.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{booking.industry}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {subModule === 'investor' && (
          <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg text-gray-900 dark:text-white">Find Investor Bookings</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Founder/Startup</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Investor</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Date</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Stage</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Amount Range</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Status</th>
                  <th className="px-6 py-3 text-right text-xs text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {investorBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-[#0A0F1F]">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">{booking.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{booking.founder.name}</p>
                        <p className="text-xs text-gray-500">{booking.founder.startup}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{booking.investor.name}</p>
                        <p className="text-xs text-gray-500">{booking.investor.type}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{booking.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{booking.investmentStage}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{booking.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {subModule === 'experienced' && (
          <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg text-gray-900 dark:text-white">Find Experienced People Bookings</h2>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Booking ID</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Client</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Expert</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Date</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Session Type</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Rate</th>
                  <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Status</th>
                  <th className="px-6 py-3 text-right text-xs text-gray-600 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {expertBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-[#0A0F1F]">
                    <td className="px-6 py-4 text-sm font-mono text-gray-900 dark:text-white">{booking.id}</td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{booking.client.name}</p>
                        <p className="text-xs text-gray-500">{booking.client.company}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{booking.expert.name}</p>
                        <p className="text-xs text-gray-500">{booking.expert.expertise}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{booking.date}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{booking.sessionType}</td>
                    <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{booking.rate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {subModule === 'all' && (
          <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Select a sub-module above to view specific booking types, or use the search and filters to find across all business meetup categories.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}