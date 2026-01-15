import React, { useState } from 'react';
import { Search, Download, Eye, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { ScrollableTable, Table, TableHeader, TableBody, TableRow, TableCell, TableHeadCell } from '../../../ui/ScrollableTable';
import { useBookings, BookingStatus } from '../../../../lib/hooks';
import { LoadingState } from '../../../ui/LoadingState';
import { ErrorState } from '../../../ui/ErrorState';

interface Booking {
  id: string;
  user1Id: string;
  user1Name: string;
  user1Seeking: string;
  user2Id: string;
  user2Name: string;
  user2Offering: string;
  date: string;
  time: string;
  industry: string;
  status: 'Pending' | 'Scheduled' | 'Confirmed' | 'Completed' | 'Cancelled';
  amount: string;
}

export function P2PMatchOperations() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { bookings, loading, error, refetch, updateStatus } = useBookings({
    serviceType: 'p2p-match',
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
          <h1 className="text-2xl text-gray-900 dark:text-white">Peer-to-Peer Match — Operations & Control</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Professional peer matching and networking oversight</p>
        </div>
        <LoadingState message="Loading matches..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
          <h1 className="text-2xl text-gray-900 dark:text-white">Peer-to-Peer Match — Operations & Control</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Professional peer matching and networking oversight</p>
        </div>
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  const bookingsMock: Booking[] = [
    {
      id: 'P2P-3024',
      user1Id: 'U-8821',
      user1Name: 'Rahul Sharma',
      user1Seeking: 'Tech Co-Founder',
      user2Id: 'U-7652',
      user2Name: 'Priya Patel',
      user2Offering: 'CTO Expertise',
      date: '2024-12-28',
      time: '10:00 AM',
      industry: 'Technology',
      status: 'Scheduled',
      amount: '₹2,500'
    },
  ];

  const handleExport = () => {
    const csvContent = bookings.map(m =>
      `${m.id},${m.user1Name},${m.user2Name},${m.user1Seeking},${m.user2Offering},${m.status},${m.date},${m.time},${m.amount}`
    ).join('\n');
    const blob = new Blob([`ID,User 1,User 2,Seeking,Offering,Status,Date,Time,Amount\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `p2p-matches-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Pending: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300',
      Scheduled: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-300',
      Confirmed: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-300',
      Completed: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300',
      Cancelled: 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-300',
    };
    return styles[status as keyof typeof styles] || styles.Pending;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <h1 className="text-2xl text-gray-900 dark:text-white">Peer-to-Peer Match — Operations & Control</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Professional peer matching and networking oversight</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Active Matches', value: '45', color: 'blue' },
            { label: 'Pending Confirmation', value: '12', color: 'yellow' },
            { label: 'Completed Today', value: '8', color: 'green' },
            { label: 'Success Rate', value: '94%', color: 'purple' },
          ].map((stat, idx) => (
            <div key={idx} className={`bg-white dark:bg-[#1A1F2E] border-l-4 border-${stat.color}-500 p-4 rounded-lg`}>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="text-2xl text-gray-900 dark:text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 p-4 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by match ID, participant name, or company..."
                className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>

          {/* Filter Bars with Horizontal Scroll */}
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Filter by Status</p>
              <FilterBar
                filters={[
                  { id: 'all', label: 'All Status' },
                  { id: 'pending', label: 'Pending' },
                  { id: 'scheduled', label: 'Scheduled' },
                  { id: 'confirmed', label: 'Confirmed' },
                  { id: 'completed', label: 'Completed' },
                  { id: 'cancelled', label: 'Cancelled' },
                ]}
                activeFilter={statusFilter}
                onFilterChange={setStatusFilter}
              />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1A1F2E] rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
          <ScrollableTable minWidth="1600px">
            <Table stickyHeader>
              <TableHeader sticky>
                <TableRow>
                  <TableHeadCell sticky>Match ID</TableHeadCell>
                  <TableHeadCell>Participant 1</TableHeadCell>
                  <TableHeadCell>Seeking</TableHeadCell>
                  <TableHeadCell>Participant 2</TableHeadCell>
                  <TableHeadCell>Offering</TableHeadCell>
                  <TableHeadCell>Industry</TableHeadCell>
                  <TableHeadCell>Meeting Date</TableHeadCell>
                  <TableHeadCell>Meeting Time</TableHeadCell>
                  <TableHeadCell>Amount</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell>Actions</TableHeadCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((match) => (
                  <TableRow key={match.id} clickable>
                    <TableCell sticky className="font-mono text-blue-600 dark:text-blue-400">{match.id}</TableCell>
                    <TableCell className="font-medium">{match.user1Name}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 text-xs">{match.user1Seeking}</TableCell>
                    <TableCell className="font-medium">{match.user2Name}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-400 text-xs">{match.user2Offering}</TableCell>
                    <TableCell>{match.industry}</TableCell>
                    <TableCell>{match.date}</TableCell>
                    <TableCell>{match.time}</TableCell>
                    <TableCell className="font-medium">{match.amount}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(match.status)}`}>
                        {match.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <button
                          className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100"
                          onClick={() => handleStatusUpdate(match.id, 'Confirmed')}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          className="px-3 py-1.5 text-xs bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded hover:bg-red-100"
                          onClick={() => handleStatusUpdate(match.id, 'Cancelled')}
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button
                          className="px-3 py-1.5 text-xs bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-100"
                          onClick={() => handleStatusUpdate(match.id, 'Completed')}
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                        <button className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollableTable>
        </div>
      </div>
    </div>
  );
}