import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ChevronDown, Check, X, BadgeCheck } from 'lucide-react';

interface Review {
  id: number;
  userName: string;
  userAvatar: string;
  rating: number;
  date: string;
  reviewText: string;
  verifiedBooking: boolean;
}

interface RatingsReviewsProps {
  averageRating?: number;
  totalReviews?: number;
  starDistribution?: { 5: number; 4: number; 3: number; 2: number; 1: number };
  reviews?: Review[];
  onSubmitReview?: (rating: number, text: string) => void;
}

type SortOption = 'newest' | 'highest' | 'lowest';

export function RatingsReviews({
  averageRating = 4.7,
  totalReviews = 128,
  starDistribution = { 5: 85, 4: 28, 3: 10, 2: 3, 1: 2 },
  reviews = [],
  onSubmitReview
}: RatingsReviewsProps) {
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showWriteReview, setShowWriteReview] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [showError, setShowError] = useState(false);

  const maxCharacters = 500;

  // Default reviews if none provided
  const defaultReviews: Review[] = [
    {
      id: 1,
      userName: 'Priya Sharma',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      rating: 5,
      date: '2024-01-03',
      reviewText: 'Exceptional service! The professional was extremely knowledgeable and delivered exactly what was promised. Highly recommend for anyone looking for quality expertise.',
      verifiedBooking: true
    },
    {
      id: 2,
      userName: 'Rahul Mehta',
      userAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400',
      rating: 5,
      date: '2024-01-02',
      reviewText: 'Great experience from start to finish. Communication was clear, punctual, and the session was incredibly valuable. Worth every penny.',
      verifiedBooking: true
    },
    {
      id: 3,
      userName: 'Anjali Patel',
      userAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
      rating: 4,
      date: '2024-01-01',
      reviewText: 'Very helpful session. Got practical insights that I could implement immediately. Would have been 5 stars if the session was a bit longer.',
      verifiedBooking: true
    },
    {
      id: 4,
      userName: 'Vikram Singh',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
      rating: 5,
      date: '2023-12-30',
      reviewText: 'Outstanding mentorship! The expert took time to understand my specific needs and provided tailored advice. This is exactly what I was looking for.',
      verifiedBooking: false
    },
    {
      id: 5,
      userName: 'Neha Kapoor',
      userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400',
      rating: 4,
      date: '2023-12-28',
      reviewText: 'Solid consultation with actionable takeaways. The expert was well-prepared and shared valuable industry insights. Minor delays in starting, but overall great.',
      verifiedBooking: true
    }
  ];

  const displayReviews = reviews.length > 0 ? reviews : defaultReviews;

  // Sort reviews
  const sortedReviews = [...displayReviews].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'highest') {
      return b.rating - a.rating;
    } else {
      return a.rating - b.rating;
    }
  });

  const handleSubmitReview = () => {
    if (selectedRating === 0 || reviewText.trim().length === 0) {
      setShowError(true);
      return;
    }
    setShowError(false);
    onSubmitReview?.(selectedRating, reviewText);
    setShowWriteReview(false);
    setSelectedRating(0);
    setReviewText('');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const renderStars = (rating: number, size: 'sm' | 'md' | 'lg' = 'md') => {
    const sizeClasses = {
      sm: 'w-3.5 h-3.5',
      md: 'w-4 h-4',
      lg: 'w-6 h-6'
    };

    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-700 text-gray-700'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderInteractiveStars = () => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setSelectedRating(star)}
            onMouseEnter={() => setHoveredRating(star)}
            onMouseLeave={() => setHoveredRating(0)}
            className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500/50 rounded"
          >
            <Star
              className={`w-8 h-8 transition-colors ${
                star <= (hoveredRating || selectedRating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'fill-gray-700 text-gray-600 hover:text-gray-500'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl mb-1">Ratings & Reviews</h2>
          <p className="text-sm text-gray-400">
            Verified feedback from real customers
          </p>
        </div>
        <button
          onClick={() => setShowWriteReview(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all text-sm font-medium"
        >
          Write a Review
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Ratings Summary Panel */}
        <div className="lg:col-span-1">
          <div className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/10 dark:border-gray-800/50 sticky top-6">
            {/* Average Rating */}
            <div className="text-center mb-6">
              <div className="text-5xl font-light mb-2">{averageRating.toFixed(1)}</div>
              {renderStars(Math.round(averageRating), 'lg')}
              <p className="text-sm text-gray-400 mt-3">
                Based on {totalReviews} reviews
              </p>
            </div>

            {/* Star Distribution */}
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = starDistribution[stars as keyof typeof starDistribution];
                const percentage = (count / totalReviews) * 100;

                return (
                  <div key={stars} className="flex items-center gap-3">
                    <div className="flex items-center gap-1 w-12">
                      <span className="text-sm text-gray-400">{stars}</span>
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.8, delay: (5 - stars) * 0.1 }}
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-8 text-right">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews List Section */}
        <div className="lg:col-span-2">
          {/* Sort Controls */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg">All Reviews</h3>
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass dark:glass-dark hover:bg-white/5 transition-colors text-sm border border-white/10 dark:border-gray-800/50"
              >
                <span className="text-gray-400">Sort by:</span>
                <span>
                  {sortBy === 'newest' && 'Newest'}
                  {sortBy === 'highest' && 'Highest Rated'}
                  {sortBy === 'lowest' && 'Lowest Rated'}
                </span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {showSortDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowSortDropdown(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-48 glass dark:glass-dark rounded-xl border border-white/10 dark:border-gray-800/50 overflow-hidden z-50 backdrop-blur-xl"
                    >
                      {[
                        { value: 'newest', label: 'Newest' },
                        { value: 'highest', label: 'Highest Rated' },
                        { value: 'lowest', label: 'Lowest Rated' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value as SortOption);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full px-4 py-3 text-left text-sm transition-colors flex items-center justify-between ${
                            sortBy === option.value
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'hover:bg-white/5 text-gray-300'
                          }`}
                        >
                          {option.label}
                          {sortBy === option.value && (
                            <Check className="w-4 h-4" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Review Cards */}
          <div className="space-y-4">
            {sortedReviews.map((review, index) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass dark:glass-dark rounded-2xl p-6 backdrop-blur-xl border border-white/10 dark:border-gray-800/50 hover:border-white/20 dark:hover:border-gray-700/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <img
                    src={review.userAvatar}
                    alt={review.userName}
                    className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium truncate">
                            {review.userName}
                          </h4>
                          {review.verifiedBooking && (
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-xs flex-shrink-0">
                              <BadgeCheck className="w-3 h-3" />
                              <span>Verified</span>
                            </div>
                          )}
                        </div>
                        {renderStars(review.rating, 'sm')}
                      </div>
                      <span className="text-xs text-gray-500 flex-shrink-0">
                        {formatDate(review.date)}
                      </span>
                    </div>

                    {/* Review Text */}
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {review.reviewText}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Write Review Modal */}
      <AnimatePresence>
        {showWriteReview && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWriteReview(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="w-full max-w-lg glass dark:glass-dark rounded-2xl border border-white/10 dark:border-gray-800/50 backdrop-blur-xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-gray-800/50">
                  <h3 className="text-xl">Write a Review</h3>
                  <button
                    onClick={() => setShowWriteReview(false)}
                    className="w-8 h-8 rounded-lg hover:bg-white/5 transition-colors flex items-center justify-center"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                {/* Modal Content */}
                <div className="p-6 space-y-6">
                  {/* Rating Selector */}
                  <div>
                    <label className="text-sm text-gray-400 mb-3 block">
                      Your Rating <span className="text-red-400">*</span>
                    </label>
                    {renderInteractiveStars()}
                    {showError && selectedRating === 0 && (
                      <p className="text-xs text-red-400 mt-2">Please select a rating</p>
                    )}
                  </div>

                  {/* Review Text Input */}
                  <div>
                    <label className="text-sm text-gray-400 mb-3 block">
                      Your Review <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      value={reviewText}
                      onChange={(e) => {
                        if (e.target.value.length <= maxCharacters) {
                          setReviewText(e.target.value);
                          setShowError(false);
                        }
                      }}
                      placeholder="Share your experience with this service..."
                      rows={6}
                      className={`w-full px-4 py-3 rounded-xl bg-gray-900/50 border-2 transition-all outline-none text-sm text-gray-200 placeholder-gray-500 resize-none ${
                        showError && reviewText.trim().length === 0
                          ? 'border-red-500/50 focus:border-red-500'
                          : 'border-white/10 focus:border-blue-500'
                      }`}
                    />
                    <div className="flex items-center justify-between mt-2">
                      {showError && reviewText.trim().length === 0 && (
                        <p className="text-xs text-red-400">Please write a review</p>
                      )}
                      <div className="ml-auto text-xs text-gray-500">
                        {reviewText.length} / {maxCharacters}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center gap-3 p-6 border-t border-white/10 dark:border-gray-800/50">
                  <button
                    onClick={() => setShowWriteReview(false)}
                    className="flex-1 px-6 py-3 rounded-xl glass dark:glass-dark hover:bg-white/5 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-blue-500/25 transition-all text-sm font-medium"
                  >
                    Submit Review
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
