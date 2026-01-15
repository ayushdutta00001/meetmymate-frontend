import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Filter, RefreshCw, Calendar, Eye, X, CheckCircle, XCircle } from 'lucide-react';

interface EmailLog {
  id: string;
  dateTime: string;
  recipientEmail: string;
  subject: string;
  templateKey: string;
  status: 'sent' | 'failed';
  htmlContent?: string;
}

export function EmailLogs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data
  const emailLogs: EmailLog[] = [
    {
      id: 'EML-001',
      dateTime: '2026-01-06 14:30',
      recipientEmail: 'user@example.com',
      subject: 'Booking Confirmation - Meet my Mate',
      templateKey: 'booking_confirmation',
      status: 'sent',
      htmlContent: '<html><body><h1>Booking Confirmed!</h1><p>Your booking has been confirmed.</p></body></html>'
    },
    {
      id: 'EML-002',
      dateTime: '2026-01-06 14:25',
      recipientEmail: 'provider@example.com',
      subject: 'New Booking Request',
      templateKey: 'new_booking_request',
      status: 'sent',
      htmlContent: '<html><body><h1>New Booking</h1><p>You have a new booking request.</p></body></html>'
    },
    {
      id: 'EML-003',
      dateTime: '2026-01-06 14:20',
      recipientEmail: 'customer@example.com',
      subject: 'Payment Receipt',
      templateKey: 'payment_receipt',
      status: 'failed',
      htmlContent: '<html><body><h1>Payment Failed</h1><p>Unable to process payment.</p></body></html>'
    },
    {
      id: 'EML-004',
      dateTime: '2026-01-06 14:15',
      recipientEmail: 'admin@meetmymate.com',
      subject: 'Daily Summary Report',
      templateKey: 'daily_summary',
      status: 'sent',
      htmlContent: '<html><body><h1>Daily Summary</h1><p>Here is your daily summary.</p></body></html>'
    },
    {
      id: 'EML-005',
      dateTime: '2026-01-06 14:10',
      recipientEmail: 'newuser@example.com',
      subject: 'Welcome to Meet my Mate!',
      templateKey: 'welcome_email',
      status: 'sent',
      htmlContent: '<html><body><h1>Welcome!</h1><p>Thanks for joining Meet my Mate.</p></body></html>'
    },
  ];

  const filteredLogs = emailLogs.filter(log => {
    const matchesSearch = 
      log.recipientEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 dark:text-white mb-2">Email Logs</h1>
        <p className="text-gray-600 dark:text-gray-400">View delivery history for all system emails</p>
      </div>

      {/* Filters Row */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by email or subject"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="sent">Sent</option>
            <option value="failed">Failed</option>
          </select>

          {/* Date Range Picker */}
          <button className="px-4 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-700 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>Date Range</span>
          </button>

          {/* Refresh Button */}
          <button className="p-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <RefreshCw className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Main Data Table */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Recipient Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Template Key
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {paginatedLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {log.dateTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    {log.recipientEmail}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                    {log.subject}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-700 dark:text-gray-300">
                      {log.templateKey}
                    </code>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {log.status === 'sent' ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400">
                        <CheckCircle className="w-3 h-3" />
                        Sent
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400">
                        <XCircle className="w-3 h-3" />
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedEmail(log)}
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      <Eye className="w-4 h-4" />
                      View Email
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-700 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-700 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* View Email Modal */}
      <AnimatePresence>
        {selectedEmail && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEmail(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#1A1F2E] rounded-2xl border border-gray-200 dark:border-gray-800 w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                  <div>
                    <h3 className="text-xl text-gray-900 dark:text-white mb-1">Email Details</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedEmail.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedEmail(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Subject
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedEmail.subject}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Recipient
                    </label>
                    <p className="text-gray-900 dark:text-white">{selectedEmail.recipientEmail}</p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                      Template Key
                    </label>
                    <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm text-gray-700 dark:text-gray-300">
                      {selectedEmail.templateKey}
                    </code>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Email Preview
                    </label>
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-[#0A0F1F]">
                      <div
                        className="prose prose-sm dark:prose-invert max-w-none"
                        dangerouslySetInnerHTML={{ __html: selectedEmail.htmlContent || '' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() => setSelectedEmail(null)}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
