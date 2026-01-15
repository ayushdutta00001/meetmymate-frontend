import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { useBookings, BookingStatus } from '../../../../lib/hooks';
import { LoadingState } from '../../../ui/LoadingState';
import { ErrorState } from '../../../ui/ErrorState';

export function FindExperiencedOperations() {
  const [statusFilter, setStatusFilter] = useState('All');

  const { bookings, loading, error, refetch, updateStatus } = useBookings({
    serviceType: 'find-experienced',
    autoFetch: true
  });

  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      await updateStatus(bookingId, newStatus);
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
          <h1 className="text-2xl text-gray-900 dark:text-white">Find Experienced People — Operations & Control</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Expert consultations and mentorship oversight</p>
        </div>
        <LoadingState message="Loading expert bookings..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
          <h1 className="text-2xl text-gray-900 dark:text-white">Find Experienced People — Operations & Control</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Expert consultations and mentorship oversight</p>
        </div>
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  const expertBookings = [
    {
      id: 'EXP-9021',
      client: { id: 'U-7821', name: 'Startup Founder A', company: 'NewCo Tech' },
      expert: { id: 'E-5431', name: 'Industry Veteran B', expertise: 'Product Strategy' },
      sessionType: '1-hour Video Call',
      scheduledDate: '2024-12-29',
      rate: '₹5,000',
      status: 'Confirmed'
    },
  ];

  const handleExport = () => {
    const csvContent = expertBookings.map(c =>
      `${c.id},${c.client.name},${c.expert.name},${c.sessionType},${c.status},${c.scheduledDate}`
    ).join('\n');
    const blob = new Blob([`ID,Client,Expert,Type,Status,Date\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `expert-consultations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      Pending: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300',
      Confirmed: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-300',
      Completed: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300',
    };
    return styles[status] || styles.Pending;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <h1 className="text-2xl text-gray-900 dark:text-white">Find Experienced People — Operations & Control</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Expert consultations and mentorship oversight</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Active Sessions', value: '32', color: 'blue' },
            { label: 'Pending Bookings', value: '18', color: 'yellow' },
            { label: 'Completed Today', value: '6', color: 'green' },
            { label: 'Expert Pool', value: '124', color: 'purple' },
          ].map((stat, idx) => (
            <div key={idx} className={`bg-white dark:bg-[#1A1F2E] border-l-4 border-${stat.color}-500 p-4 rounded-lg`}>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl text-gray-900 dark:text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by consultation ID, client, or expert name..."
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm"
            >
              <option>All Status</option>
              <option>Pending</option>
              <option>Confirmed</option>
              <option>Completed</option>
            </select>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Consultation ID</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Client</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Expert</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Session Type</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Duration</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Date</th>
                <th className="px-6 py-3 text-left text-xs text-gray-600 dark:text-gray-400">Amount</th>
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
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{booking.sessionType}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{booking.duration}</td>
                  <td className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">{booking.scheduledDate}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{booking.rate}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100">
                      View Details
                    </button>
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