import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { ScrollableTable, TableHeadCell, TableCell } from '../../../ui/ScrollableTable';
import { useBookings, BookingStatus } from '../../../../lib/hooks';
import { LoadingState } from '../../../ui/LoadingState';
import { ErrorState } from '../../../ui/ErrorState';

interface InvestorMatch {
  id: string;
  startup: { id: string; name: string; founder: string };
  investor: { id: string; name: string; type: string };
  investmentRange: string;
  industry: string;
  meetingDate: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Declined';
  amount: string;
}

export function FindInvestorOperations() {
  const [statusFilter, setStatusFilter] = useState('All');

  const { bookings, loading, error, refetch, updateStatus } = useBookings({
    serviceType: 'find-investor',
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
          <h1 className="text-2xl text-gray-900 dark:text-white">Find Investor — Operations & Control</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Investor matching and deal facilitation oversight</p>
        </div>
        <LoadingState message="Loading investor matches..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
          <h1 className="text-2xl text-gray-900 dark:text-white">Find Investor — Operations & Control</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Investor matching and deal facilitation oversight</p>
        </div>
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  const matches: InvestorMatch[] = [
    {
      id: 'INV-4521',
      startup: { id: 'S-7821', name: 'TechStartup AI', founder: 'Rajesh Kumar' },
      investor: { id: 'I-5431', name: 'Venture Partners LLC', type: 'VC Fund' },
      investmentRange: '₹50L - ₹1Cr',
      industry: 'AI/ML',
      meetingDate: '2024-12-29',
      status: 'Confirmed',
      amount: '₹25,000'
    },
    {
      id: 'INV-4520',
      startup: { id: 'S-9012', name: 'FinTech Solutions', founder: 'Priya Sharma' },
      investor: { id: 'I-3421', name: 'Angel Investor Group', type: 'Angel' },
      investmentRange: '₹10L - ₹50L',
      industry: 'Fintech',
      meetingDate: '2024-12-28',
      status: 'Pending',
      amount: '₹30,000'
    },
  ];

  const handleExport = () => {
    const csvContent = matches.map(m =>
      `${m.id},${m.startup.name},${m.investor.name},${m.investmentRange},${m.status},${m.meetingDate}`
    ).join('\n');
    const blob = new Blob([`ID,Startup,Investor,Range,Status,Date\n${csvContent}`], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `investor-matches-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      Pending: 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-300',
      Confirmed: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-300',
      Completed: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border border-green-300',
      Declined: 'bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400 border border-gray-300',
    };
    return styles[status as keyof typeof styles];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      <div className="bg-white dark:bg-[#1A1F2E] border-b border-gray-200 dark:border-gray-800 px-8 py-6">
        <h1 className="text-2xl text-gray-900 dark:text-white">Find Investor — Operations & Control</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Investor matching and deal facilitation oversight</p>
      </div>

      <div className="p-8">
        <div className="grid grid-cols-4 gap-6 mb-6">
          {[
            { label: 'Active Pitches', value: '28', color: 'blue' },
            { label: 'Pending Matches', value: '15', color: 'yellow' },
            { label: 'Funded This Month', value: '4', color: 'green' },
            { label: 'Total Investment Value', value: '₹12.5Cr', color: 'purple' },
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
                placeholder="Search by match ID, startup name, or investor..."
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
          <ScrollableTable>
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
                <tr>
                  <TableHeadCell sticky>Match ID</TableHeadCell>
                  <TableHeadCell>Startup</TableHeadCell>
                  <TableHeadCell>Investor</TableHeadCell>
                  <TableHeadCell>Investment Range</TableHeadCell>
                  <TableHeadCell>Industry</TableHeadCell>
                  <TableHeadCell>Meeting Date</TableHeadCell>
                  <TableHeadCell>Fee</TableHeadCell>
                  <TableHeadCell>Status</TableHeadCell>
                  <TableHeadCell align="right">Actions</TableHeadCell>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {matches.map((match) => (
                  <tr key={match.id} className="hover:bg-gray-50 dark:hover:bg-[#0A0F1F]">
                    <TableCell sticky className="font-mono">{match.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{match.startup.name}</p>
                        <p className="text-xs text-gray-500">{match.startup.founder}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">{match.investor.name}</p>
                        <p className="text-xs text-gray-500">{match.investor.type}</p>
                      </div>
                    </TableCell>
                    <TableCell>{match.investmentRange}</TableCell>
                    <TableCell>{match.industry}</TableCell>
                    <TableCell>{match.meetingDate}</TableCell>
                    <TableCell>{match.amount}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs ${getStatusBadge(match.status)}`}>
                        {match.status}
                      </span>
                    </TableCell>
                    <TableCell align="right">
                      <button className="px-3 py-1.5 text-xs bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100">
                        View Details
                      </button>
                    </TableCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </ScrollableTable>
        </div>
      </div>
    </div>
  );
}