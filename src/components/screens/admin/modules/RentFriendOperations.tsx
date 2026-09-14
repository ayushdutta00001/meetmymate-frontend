import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Filter, Download, Eye, Ban, CheckCircle, XCircle, FileText, Calendar, Plus } from 'lucide-react';
import { ScrollableTable, Table, TableHeader, TableBody, TableRow, TableCell, TableHeadCell } from '../../../ui/ScrollableTable';
import { FilterBar } from '../../../ui/FilterBar';
import { useBookings, BookingStatus } from '../../../../lib/hooks';
import { LoadingState } from '../../../ui/LoadingState';
import { ErrorState } from '../../../ui/ErrorState';
import { ApiStateWrapper } from '../../../ui/ApiStateWrapper';
import { ResponsiveContainer, PageHeader, Card, Grid } from '../../../ui/ResponsiveContainer';
import { ResponsiveTable } from '../../../ui/ResponsiveTable';
import { ResponsiveButton } from '../../../ui/ResponsiveButton';
import { StatusBadge } from '../../../ui/StatusBadge';

export function RentFriendOperations() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [cityFilter, setCityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Use custom hook for data fetching
  const { bookings, loading, error, refetch, updateStatus } = useBookings({
    serviceType: 'rent-friend',
    autoFetch: true
  });

  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      await updateStatus(bookingId, newStatus);
      // Optionally show success toast
    } catch (err) {
      // Error is already handled by the hook
      console.error('Failed to update booking status:', err);
    }
  };

  // Filter bookings based on search and filters
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchQuery === '' || 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (booking.provider_name && booking.provider_name.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesCity = cityFilter === 'all' || 
      (booking.location && booking.location.toLowerCase() === cityFilter.toLowerCase());
    
    return matchesSearch && matchesStatus && matchesCity;
  });

  // Calculate metrics from real data
  const metrics = [
    { label: 'Total Bookings', value: bookings.length, color: 'blue' },
    { label: 'Active Now', value: bookings.filter(b => b.status === 'confirmed').length, color: 'green' },
    { label: 'Pending Approval', value: bookings.filter(b => b.status === 'pending').length, color: 'yellow' },
    { label: 'Disputed Cases', value: 0, color: 'red' }, // Would come from disputes data
  ];

  // Define table columns for ResponsiveTable
  const columns = [
    {
      key: 'id',
      label: 'Booking ID',
      render: (booking: any) => (
        <span className="text-xs md:text-sm text-gray-900 dark:text-white font-mono">
          #{booking.id.slice(0, 8)}
        </span>
      ),
    },
    {
      key: 'user',
      label: 'Customer',
      mobileLabel: 'Customer Info',
      render: (booking: any) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white" style={{ fontWeight: 500 }}>
            {booking.user_name || 'N/A'}
          </p>
          {booking.user_email && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{booking.user_email}</p>
          )}
        </div>
      ),
    },
    {
      key: 'provider',
      label: 'Provider',
      render: (booking: any) => (
        <div>
          <p className="text-sm text-gray-900 dark:text-white" style={{ fontWeight: 500 }}>
            {booking.provider_name || 'Not assigned'}
          </p>
        </div>
      ),
    },
    {
      key: 'date',
      label: 'Date & Time',
      hideOnMobile: true,
      render: (booking: any) => (
        <div className="text-sm text-gray-700 dark:text-gray-300">
          {booking.booking_date 
            ? new Date(booking.booking_date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
              })
            : 'Not scheduled'}
        </div>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      hideOnMobile: true,
      render: (booking: any) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {booking.location || 'Not specified'}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (booking: any) => (
        <span className="text-sm text-gray-900 dark:text-white" style={{ fontWeight: 600 }}>
          ₹{booking.amount?.toLocaleString('en-IN') || '0'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (booking: any) => (
        <StatusBadge status={booking.status || 'pending'} />
      ),
    },
  ];

  return (
    <ApiStateWrapper
      loading={loading}
      error={error}
      onRetry={refetch}
      empty={bookings.length === 0}
      emptyTitle="No bookings found"
      emptyDescription="There are no Rent-a-Friend bookings in the system yet."
    >
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        {/* Page Header - Responsive */}
        <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <ResponsiveContainer maxWidth="full" padding={false}>
            <PageHeader
              title="Rent-a-Friend — Operations & Control"
              description="Administrative oversight of all booking activities"
            />
          </ResponsiveContainer>
        </div>

        <ResponsiveContainer maxWidth="full" className="py-4 md:py-6 lg:py-8">
          {/* Summary Metrics - Responsive Grid */}
          <Grid columns={4} gap="md" className="mb-6">
            {metrics.map((metric, idx) => (
              <Card key={idx} className={`border-l-4 border-${metric.color}-500`}>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">{metric.label}</p>
                <p className="text-xl md:text-2xl text-gray-900 dark:text-white mt-1" style={{ fontWeight: 600 }}>
                  {metric.value}
                </p>
              </Card>
            ))}
          </Grid>

          {/* Controls Bar - Responsive */}
          <Card className="mb-6">
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">
              {/* Search - Full width on mobile */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by booking ID, customer, or provider..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[44px]"
                />
              </div>
              
              {/* Filters - Stack on mobile */}
              <div className="flex flex-col sm:flex-row gap-2 md:gap-3">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="px-4 py-2.5 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-300 dark:border-gray-700 rounded-lg text-sm min-h-[44px]"
                >
                  <option value="all">All Cities</option>
                  <option value="mumbai">Mumbai</option>
                  <option value="delhi">Delhi</option>
                  <option value="bangalore">Bangalore</option>
                </select>
                
                <ResponsiveButton
                  variant="primary"
                  icon={<Download className="w-4 h-4" />}
                  className="whitespace-nowrap"
                >
                  Export
                </ResponsiveButton>
              </div>
            </div>
          </Card>

          {/* Bookings Table - Responsive (cards on mobile, table on desktop) */}
          <Card padding={false}>
            <div className="p-4 md:p-6">
              <ResponsiveTable
                data={filteredBookings}
                columns={columns}
                keyExtractor={(booking) => booking.id}
                onRowClick={(booking) => {
                  console.log('View booking:', booking);
                  // Navigate to booking details
                }}
                emptyMessage="No bookings match your filters"
              />
            </div>
          </Card>
        </ResponsiveContainer>
      </div>
    </ApiStateWrapper>
  );
}