import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Calendar, RefreshCw, Star, Eye, EyeOff, Trash2, X, AlertTriangle, CheckCircle, MoreVertical, Clock } from 'lucide-react';

interface Review {
  id: string;
  date: string;
  providerName: string;
  providerImage: string;
  userName: string;
  userImage: string;
  isAnonymous: boolean;
  rating: number;
  reviewText: string;
  fullText: string;
  status: 'published' | 'hidden' | 'flagged';
  auditHistory?: Array<{
    action: string;
    date: string;
    admin: string;
  }>;
}

export function AllReviews() {
  const [searchQuery, setSearchQuery] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Mock data
  const reviews: Review[] = [
    {
      id: 'REV-001',
      date: '2026-01-06',
      providerName: 'Priya Sharma',
      providerImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      userName: 'Alex Kumar',
      userImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      isAnonymous: false,
      rating: 5,
      reviewText: 'Amazing experience! Very professional and helpful throughout the entire process.',
      fullText: 'Amazing experience! Very professional and helpful throughout the entire process. Would definitely recommend to anyone looking for quality service.',
      status: 'published',
      auditHistory: [
        { action: 'Published', date: '2026-01-06 14:30', admin: 'System' }
      ]
    },
    {
      id: 'REV-002',
      date: '2026-01-06',
      providerName: 'Rahul Verma',
      providerImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      userName: 'Anonymous',
      userImage: '',
      isAnonymous: true,
      rating: 4,
      reviewText: 'Good service, met my expectations. Only minor delay at the start.',
      fullText: 'Good service, met my expectations. Only minor delay at the start but overall satisfied with the experience.',
      status: 'published',
      auditHistory: [
        { action: 'Published', date: '2026-01-06 13:15', admin: 'System' }
      ]
    },
    {
      id: 'REV-003',
      date: '2026-01-05',
      providerName: 'Sarah Johnson',
      providerImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      userName: 'Rohan Patel',
      userImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
      isAnonymous: false,
      rating: 2,
      reviewText: 'Not what I expected. Service was below standard and provider was late.',
      fullText: 'Not what I expected. Service was below standard and provider was late to the meeting. Would not recommend.',
      status: 'flagged',
      auditHistory: [
        { action: 'Flagged for Review', date: '2026-01-05 16:20', admin: 'AI System' },
        { action: 'Published', date: '2026-01-05 15:00', admin: 'System' }
      ]
    },
    {
      id: 'REV-004',
      date: '2026-01-05',
      providerName: 'Michael Chen',
      providerImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      userName: 'Anita Desai',
      userImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400',
      isAnonymous: false,
      rating: 5,
      reviewText: 'Excellent! Exceeded all my expectations. Very knowledgeable and friendly.',
      fullText: 'Excellent! Exceeded all my expectations. Very knowledgeable and friendly. The meeting was extremely productive.',
      status: 'published',
      auditHistory: [
        { action: 'Published', date: '2026-01-05 12:00', admin: 'System' }
      ]
    },
    {
      id: 'REV-005',
      date: '2026-01-04',
      providerName: 'Emma Wilson',
      providerImage: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
      userName: 'Vikram Singh',
      userImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      isAnonymous: false,
      rating: 1,
      reviewText: 'Terrible experience. Completely unprofessional behavior.',
      fullText: 'Terrible experience. Completely unprofessional behavior. I want my money back.',
      status: 'hidden',
      auditHistory: [
        { action: 'Hidden by Admin', date: '2026-01-04 18:00', admin: 'admin@meetmymate.com' },
        { action: 'Flagged by User', date: '2026-01-04 17:30', admin: 'System' },
        { action: 'Published', date: '2026-01-04 10:00', admin: 'System' }
      ]
    },
  ];

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.providerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      review.reviewText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
    const matchesStatus = statusFilter === 'all' || review.status === statusFilter;
    return matchesSearch && matchesRating && matchesStatus;
  });

  const totalPages = Math.ceil(filteredReviews.length / itemsPerPage);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusBadge = (status: Review['status']) => {
    switch (status) {
      case 'published':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-500/10 text-green-700 dark:text-green-400">
            <CheckCircle className="w-3 h-3" />
            Published
          </span>
        );
      case 'flagged':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400">
            <AlertTriangle className="w-3 h-3" />
            Flagged
          </span>
        );
      case 'hidden':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400">
            <EyeOff className="w-3 h-3" />
            Hidden
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

  const handleAction = (action: string, review: Review) => {
    console.log(`Action: ${action} on review ${review.id}`);
    // Here you would typically call your backend API
    setSelectedReview(null);
  };

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 dark:text-white mb-2">All Reviews</h1>
        <p className="text-gray-600 dark:text-gray-400">View and manage reviews submitted by users</p>
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
                placeholder="Search by user, provider, or text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            <option value="all">All Ratings</option>
            <option value="5">5★</option>
            <option value="4">4★</option>
            <option value="3">3★</option>
            <option value="2">2★</option>
            <option value="1">1★</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="hidden">Hidden</option>
            <option value="flagged">Flagged</option>
          </select>

          {/* Date Range */}
          <button className="px-4 py-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-700 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300">
            <Calendar className="w-4 h-4" />
            <span>Date Range</span>
          </button>

          {/* Refresh */}
          <button className="p-2 bg-gray-50 dark:bg-[#0A0F1F] border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <RefreshCw className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-[#0A0F1F] border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Provider Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  User Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Review Text
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
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
                    {review.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={review.providerImage}
                        alt={review.providerName}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-900 dark:text-white">{review.providerName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      {review.isAnonymous ? (
                        <>
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-xs text-gray-500">?</span>
                          </div>
                          <span className="text-sm text-gray-500 dark:text-gray-400 italic">Anonymous</span>
                        </>
                      ) : (
                        <>
                          <img
                            src={review.userImage}
                            alt={review.userName}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-sm text-gray-900 dark:text-white">{review.userName}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {renderStars(review.rating)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-md">
                    {truncateText(review.reviewText, 80)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(review.status)}
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
                      View
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
                    <h3 className="text-xl text-gray-900 dark:text-white mb-1">Review Details</h3>
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
                  {/* Provider Info */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Provider
                    </label>
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedReview.providerImage}
                        alt={selectedReview.providerName}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-gray-900 dark:text-white font-medium">{selectedReview.providerName}</p>
                        <p className="text-sm text-gray-500">Service Provider</p>
                      </div>
                    </div>
                  </div>

                  {/* User Info */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Reviewer
                    </label>
                    <div className="flex items-center gap-3">
                      {selectedReview.isAnonymous ? (
                        <>
                          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-500">?</span>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 italic">Anonymous User</p>
                            <p className="text-sm text-gray-500">Identity hidden</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <img
                            src={selectedReview.userImage}
                            alt={selectedReview.userName}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <p className="text-gray-900 dark:text-white font-medium">{selectedReview.userName}</p>
                            <p className="text-sm text-gray-500">Verified User</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Rating
                    </label>
                    <div className="flex items-center gap-3">
                      {renderStars(selectedReview.rating)}
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedReview.rating}.0
                      </span>
                    </div>
                  </div>

                  {/* Full Review Text */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Review
                    </label>
                    <div className="bg-gray-50 dark:bg-[#0A0F1F] rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-900 dark:text-white leading-relaxed">
                        {selectedReview.fullText}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Current Status
                    </label>
                    {getStatusBadge(selectedReview.status)}
                  </div>

                  {/* Audit History */}
                  {selectedReview.auditHistory && selectedReview.auditHistory.length > 0 && (
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        Audit History
                      </label>
                      <div className="bg-gray-50 dark:bg-[#0A0F1F] rounded-lg p-4 border border-gray-200 dark:border-gray-700 space-y-2">
                        {selectedReview.auditHistory.map((entry, index) => (
                          <div key={index} className="flex items-start gap-2 text-sm">
                            <Clock className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="text-gray-900 dark:text-white">
                                {entry.action}
                              </p>
                              <p className="text-gray-500 text-xs">
                                {entry.date} by {entry.admin}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Footer - Admin Actions */}
                <div className="p-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="grid grid-cols-2 gap-3">
                    {selectedReview.status === 'hidden' && (
                      <button
                        onClick={() => handleAction('restore', selectedReview)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve & Publish
                      </button>
                    )}
                    {selectedReview.status !== 'hidden' && (
                      <button
                        onClick={() => handleAction('hide', selectedReview)}
                        className="px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <EyeOff className="w-4 h-4" />
                        Hide from Public
                      </button>
                    )}
                    {selectedReview.status !== 'flagged' && (
                      <button
                        onClick={() => handleAction('flag', selectedReview)}
                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
                      >
                        <AlertTriangle className="w-4 h-4" />
                        Mark as Flagged
                      </button>
                    )}
                    <button
                      onClick={() => handleAction('delete', selectedReview)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Permanently
                    </button>
                    <button
                      onClick={() => setSelectedReview(null)}
                      className="col-span-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
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
