import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, Ban, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { ScrollableTable, Table, TableHeader, TableBody, TableRow, TableCell, TableHeadCell } from '../../../ui/ScrollableTable';
import { FilterBar } from '../../../ui/FilterBar';
import { adminListBlindDateBookings, Booking } from '../../../../lib/admin-api';
import { handleApiError } from '../../../../lib/api';
import { ApiStateWrapper } from '../../../ui/ApiStateWrapper';
import { ResponsiveContainer, PageHeader, Card, Grid } from '../../../ui/ResponsiveContainer';
import { ResponsiveTable } from '../../../ui/ResponsiveTable';
import { ResponsiveButton } from '../../../ui/ResponsiveButton';
import { StatusBadge } from '../../../ui/StatusBadge';

export function BlindDateOperations() {
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Load bookings on mount and when filters change
  useEffect(() => {
    loadBookings();
  }, [statusFilter]);

  async function loadBookings() {
    setIsLoading(true);
    setError('');
    
    try {
      const filters = statusFilter !== 'All' ? { status: statusFilter.toLowerCase() } : undefined;
      const response = await adminListBlindDateBookings(filters);
      
      if (response.success && response.data) {
        setBookings(response.data);
      } else {
        setError(response.error || 'Failed to load bookings');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }

  // Filter bookings based on search query
  const filteredBookings = bookings.filter(booking => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      booking.id.toLowerCase().includes(query) ||
      booking.user_id.toLowerCase().includes(query)
    );
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      Pending: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300',
      Confirmed: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300',
      Completed: 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-300',
      Cancelled: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-300',
    };
    return styles[status as keyof typeof styles] || styles.Pending;
  };

  const getPaymentStatusBadge = (status: string) => {
    if (status === 'paid') return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400';
    if (status === 'refunded') return 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400';
    return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400';
  };

  // Define table columns
  const columns = [
    {
      key: 'id',
      label: 'Booking ID',
      render: (booking: Booking) => (
        <span className="text-xs md:text-sm text-gray-900 dark:text-white font-mono">
          #{booking.id}
        </span>
      ),
    },
    {
      key: 'user',
      label: 'User',
      render: (booking: Booking) => (
        <span className="text-sm text-gray-900 dark:text-white" style={{ fontWeight: 500 }}>
          {booking.user_id}
        </span>
      ),
    },
    {
      key: 'datetime',
      label: 'Date & Time',
      hideOnMobile: true,
      render: (booking: Booking) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {booking.booking_date ? `${booking.booking_date} • ${booking.start_time || ''}` : 'Not scheduled'}
        </span>
      ),
    },
    {
      key: 'location',
      label: 'Location',
      hideOnMobile: true,
      render: (booking: Booking) => (
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {booking.location || 'Not available'}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (booking: Booking) => (
        <span className="text-sm text-gray-900 dark:text-white" style={{ fontWeight: 600 }}>
          ₹{booking.amount}
        </span>
      ),
    },
    {
      key: 'payment',
      label: 'Payment',
      hideOnMobile: true,
      render: (booking: Booking) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getPaymentStatusBadge(booking.payment_status)}`}>
          {booking.payment_status}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (booking: Booking) => (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(booking.status.charAt(0).toUpperCase() + booking.status.slice(1))}`}>
          {booking.status}
        </span>
      ),
    },
  ];

  const metrics = [
    { label: 'Total Matches', value: '456', color: 'pink' },
    { label: 'Active Dates', value: '23', color: 'green' },
    { label: 'Success Rate', value: '78%', color: 'blue' },
    { label: 'Pending Approval', value: '8', color: 'yellow' },
  ];

  return (
    <ApiStateWrapper
      loading={isLoading}
      error={error}
      onRetry={loadBookings}
      empty={filteredBookings.length === 0}
      emptyTitle="No bookings found"
      emptyDescription="There are no Blind Date bookings in the system yet."
    >
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        {/* Page Header - Responsive */}
        <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-4 md:px-6 lg:px-8 py-4 md:py-6">
          <ResponsiveContainer maxWidth="full" padding={false}>
            <PageHeader
              title="Blind Date — Operations & Control"
              description="Manage blind date matches and bookings"
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
                  placeholder="Search by booking ID or user..."
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
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
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

          {/* Bookings Table - Responsive */}
          <Card padding={false}>
            <div className="p-4 md:p-6">
              <ResponsiveTable
                data={filteredBookings}
                columns={columns}
                keyExtractor={(booking) => booking.id}
                onRowClick={(booking) => {
                  console.log('View booking:', booking);
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