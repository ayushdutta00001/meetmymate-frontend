import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, Search, Eye, CheckCircle, EyeOff, Trash2, X, Star, Clock, Flag } from 'lucide-react';

interface FlaggedReview {
  id: string;
  date: string;
  flaggedDate: string;
  flagReason: string;
  providerName: string;
  providerImage: string;
  userName: string;
  userImage: string;
  isAnonymous: boolean;
  rating: number;
  reviewText: string;
  fullText: string;
  severity: 'low' | 'medium' | 'high';
  autoFlagged: boolean;
}

export function FlaggedReviews() {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<FlaggedReview | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data
  const flaggedReviews: FlaggedReview[] = [
    {
      id: 'REV-003',
      date: '2026-01-05',
      flaggedDate: '2026-01-05 16:20',
      flagReason: 'Contains potentially offensive language',
      providerName: 'Sarah Johnson',
      providerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      userName: 'Rohan Patel',
      userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      isAnonymous: false,
      rating: 2,
      reviewText: 'Not what I expected. Service was below standard and provider was late.',
      fullText: 'Not what I expected. Service was below standard and provider was late to the meeting. Would not recommend.',
      severity: 'medium',
      autoFlagged: true
    },
    {
      id: 'REV-007',
      date: '2026-01-04',
      flaggedDate: '2026-01-04 19:45',
      flagReason: 'User reported as spam/fake review',
      providerName: 'David Lee',
      providerImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400',
      userName: 'Anonymous',
      userImage: '',
      isAnonymous: true,
      rating: 1,
      reviewText: 'Worst service ever! Complete scam! Stay away!!!',
      fullText: 'Worst service ever! Complete scam! Stay away!!! This is the worst experience I have ever had. Don\'t waste your money.',
      severity: 'high',
      autoFlagged: false
    },
    {
      id: 'REV-008',
      date: '2026-01-03',
      flaggedDate: '2026-01-03 11:30',
      flagReason: 'Suspicious duplicate review pattern detected',
      providerName: 'Lisa Anderson',
      providerImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400',
      userName: 'John Doe',
      userImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      isAnonymous: false,
      rating: 5,
      reviewText: 'Great service, highly recommend!',
      fullText: 'Great service, highly recommend! Everything was perfect.',
      severity: 'low',
      autoFlagged: true
    },
    {
      id: 'REV-009',
      date: '2026-01-03',
      flaggedDate: '2026-01-03 15:00',
      flagReason: 'Contains personal contact information',
      providerName: 'Tom Wilson',
      providerImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      userName: 'Maria Garcia',
      userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      isAnonymous: false,
      rating: 4,
      reviewText: 'Good experience. Contact me at...',
      fullText: 'Good experience. Contact me at maria@email.com for more info.',
      severity: 'high',
      autoFlagged: true
    },
  ];

  const filteredReviews = flaggedReviews.filter(review => {
    const matchesSearch = 
      review.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.flagReason.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = severityFilter === 'all' || review.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSeverityBadge = (severity: FlaggedReview['severity']) => {
    switch (severity) {
      case 'high':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 dark:bg-red-500/10 text-red-700 dark:text-red-400">
            <AlertTriangle className="w-3 h-3" />
            High
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400">
            <AlertTriangle className="w-3 h-3" />
            Medium
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
            <AlertTriangle className="w-3 h-3" />
            Low
          </span>
        );
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  const handleAction = (action: string, review: FlaggedReview) => {
    console.log(`Action: ${action} on review ${review.id}`);
    setSelectedReview(null);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <AlertTriangle className="w-8 h-8 text-orange-500" />
          <h1 className="text-3xl text-gray-900 dark:text-white">Flagged Reviews</h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Reviews requiring moderation attention ({filteredReviews.length} pending)
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by provider, user, or reason"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Severity Filter */}
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            <option value="all">All Severity</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Flagged Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Severity
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Provider
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Source
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
              {paginatedReviews.map((review) => (
                <tr
                  key={review.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedReview(review)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {review.flaggedDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getSeverityBadge(review.severity)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs">
                    {truncateText(review.flagReason, 50)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <img
                        src={review.providerImage}
                        alt={review.providerName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-900 dark:text-white">{review.providerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {review.isAnonymous ? (
                      <span className="text-sm text-gray-500 dark:text-gray-400 italic">Anonymous</span>
                    ) : (
                      <span className="text-sm text-gray-900 dark:text-white">{review.userName}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStars(review.rating)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {review.autoFlagged ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 rounded text-xs">
                        <Flag className="w-3 h-3" />
                        AI
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 rounded text-xs">
                        <Flag className="w-3 h-3" />
                        User
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedReview(review);
                      }}
                      className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                    >
                      <Eye className="w-4 h-4" />
                      Review
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
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredReviews.length)} of {filteredReviews.length} results
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

      {/* Review Detail Modal */}
      <AnimatePresence>
        {selectedReview && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReview(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-[#1A1F2E] rounded-2xl border border-gray-200 dark:border-gray-800 w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl text-gray-900 dark:text-white">Flagged Review</h3>
                      {getSeverityBadge(selectedReview.severity)}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedReview.id}</p>
                  </div>
                  <button
                    onClick={() => setSelectedReview(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Flag Info */}
                  <div className="bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-orange-900 dark:text-orange-300 mb-1">
                          Flag Reason
                        </p>
                        <p className="text-sm text-orange-800 dark:text-orange-400">
                          {selectedReview.flagReason}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-orange-700 dark:text-orange-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {selectedReview.flaggedDate}
                          </span>
                          <span>
                            Source: {selectedReview.autoFlagged ? 'AI System' : 'User Report'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Provider & User Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Provider
                      </label>
                      <div className="flex items-center gap-2">
                        <img
                          src={selectedReview.providerImage}
                          alt={selectedReview.providerName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {selectedReview.providerName}
                          </p>
                          <p className="text-xs text-gray-500">Service Provider</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Reviewer
                      </label>
                      {selectedReview.isAnonymous ? (
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-500 text-xs">?</span>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 italic">Anonymous</p>
                            <p className="text-xs text-gray-500">Identity hidden</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <img
                            src={selectedReview.userImage}
                            alt={selectedReview.userName}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {selectedReview.userName}
                            </p>
                            <p className="text-xs text-gray-500">Verified User</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Rating Given
                    </label>
                    <div className="flex items-center gap-3">
                      {renderStars(selectedReview.rating)}
                      <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {selectedReview.rating}.0
                      </span>
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Review Content
                    </label>
                    <div className="bg-gray-50 dark:bg-[#0A0F1F] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-900 dark:text-white leading-relaxed">
                        {selectedReview.fullText}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Footer - Moderation Actions */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => handleAction('approve', selectedReview)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve & Publish
                    </button>
                    <button
                      onClick={() => handleAction('hide', selectedReview)}
                      className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <EyeOff className="w-4 h-4" />
                      Hide from Public
                    </button>
                    <button
                      onClick={() => handleAction('delete', selectedReview)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Permanently
                    </button>
                    <button
                      onClick={() => setSelectedReview(null)}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
