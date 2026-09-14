import React from 'react';
import { Star, TrendingUp, Users, MessageSquare, AlertTriangle, ThumbsUp, Calendar } from 'lucide-react';

export function ReviewAnalytics() {
  // Mock analytics data
  const stats = {
    totalReviews: 1247,
    averageRating: 4.7,
    reviewsThisMonth: 156,
    monthlyGrowth: 12.5,
    publishedReviews: 1189,
    hiddenReviews: 34,
    flaggedReviews: 24,
    verifiedBookings: 98.5,
  };

  const ratingDistribution = [
    { stars: 5, count: 847, percentage: 67.9 },
    { stars: 4, count: 245, percentage: 19.6 },
    { stars: 3, count: 89, percentage: 7.1 },
    { stars: 2, count: 42, percentage: 3.4 },
    { stars: 1, count: 24, percentage: 1.9 },
  ];

  const topRatedProviders = [
    {
      name: 'Priya Sharma',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      rating: 4.9,
      reviewCount: 87,
      service: 'Business Consulting'
    },
    {
      name: 'Michael Chen',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400',
      rating: 4.8,
      reviewCount: 134,
      service: 'Investment Advisory'
    },
    {
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
      rating: 4.8,
      reviewCount: 92,
      service: 'Expert Mentoring'
    },
    {
      name: 'Emma Wilson',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400',
      rating: 4.7,
      reviewCount: 76,
      service: 'Blind Date'
    },
  ];

  const recentTrends = [
    { month: 'Aug', reviews: 98, avgRating: 4.5 },
    { month: 'Sep', reviews: 112, avgRating: 4.6 },
    { month: 'Oct', reviews: 127, avgRating: 4.6 },
    { month: 'Nov', reviews: 134, avgRating: 4.7 },
    { month: 'Dec', reviews: 142, avgRating: 4.7 },
    { month: 'Jan', reviews: 156, avgRating: 4.7 },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= Math.floor(rating)
                ? 'fill-yellow-400 text-yellow-400'
                : star - 0.5 <= rating
                ? 'fill-yellow-400/50 text-yellow-400'
                : 'text-gray-300 dark:text-gray-600'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl text-gray-900 dark:text-white mb-2">Review Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400">Insights and trends from user reviews</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Reviews */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              +{stats.monthlyGrowth}%
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.totalReviews.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Reviews</p>
        </div>

        {/* Average Rating */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 dark:bg-yellow-500/10 flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400 fill-current" />
            </div>
            <span className="text-xs text-green-600 dark:text-green-400 font-medium">
              Excellent
            </span>
          </div>
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {stats.averageRating}
            </h3>
            <span className="text-gray-500">/5.0</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Average Rating</p>
        </div>

        {/* This Month */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
              This Month
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.reviewsThisMonth}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">New Reviews</p>
        </div>

        {/* Flagged Reviews */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-lg bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium">
              Needs Review
            </span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {stats.flaggedReviews}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">Flagged for Moderation</p>
        </div>
      </div>

      {/* Rating Distribution & Top Providers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Rating Distribution */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Rating Distribution
          </h3>
          <div className="space-y-4">
            {ratingDistribution.map((item) => (
              <div key={item.stars}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-6">
                      {item.stars}★
                    </span>
                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 ml-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[40px] text-right">
                      {item.percentage}%
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white min-w-[50px] text-right">
                      {item.count}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Rated Providers */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Top Rated Providers
          </h3>
          <div className="space-y-4">
            {topRatedProviders.map((provider, index) => (
              <div
                key={provider.name}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  #{index + 1}
                </div>
                <img
                  src={provider.image}
                  alt={provider.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{provider.name}</p>
                  <p className="text-xs text-gray-500">{provider.service}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {provider.rating}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">{provider.reviewCount} reviews</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review Trends Chart */}
      <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Review Trends (Last 6 Months)
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>Aug 2025 - Jan 2026</span>
          </div>
        </div>
        
        {/* Simple Bar Chart */}
        <div className="space-y-4">
          <div className="flex items-end gap-3 h-64">
            {recentTrends.map((trend) => {
              const maxReviews = Math.max(...recentTrends.map(t => t.reviews));
              const heightPercentage = (trend.reviews / maxReviews) * 100;
              
              return (
                <div key={trend.month} className="flex-1 flex flex-col items-center gap-2">
                  {/* Bar */}
                  <div className="w-full flex flex-col items-center justify-end h-full">
                    <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {trend.reviews}
                    </div>
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all hover:from-blue-600 hover:to-blue-500 cursor-pointer relative group"
                      style={{ height: `${heightPercentage}%` }}
                    >
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block">
                        <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                          <div className="font-medium">{trend.reviews} reviews</div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{trend.avgRating} avg</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Label */}
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {trend.month}
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">Review Volume</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Average Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Published Reviews */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Published Reviews</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.publishedReviews}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-500/10 flex items-center justify-center">
              <ThumbsUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Visibility Rate</span>
              <span className="font-semibold text-green-600 dark:text-green-400">95.3%</span>
            </div>
          </div>
        </div>

        {/* Hidden Reviews */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Hidden Reviews</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.hiddenReviews}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Moderated</span>
              <span className="font-semibold text-gray-600 dark:text-gray-400">2.7%</span>
            </div>
          </div>
        </div>

        {/* Verified Bookings */}
        <div className="bg-white dark:bg-[#1A1F2E] rounded-xl border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Verified Bookings</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stats.verifiedBookings}%
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-500/10 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Authenticity</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">High</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
