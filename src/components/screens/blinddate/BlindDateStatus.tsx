import { supabase } from '../../../supabase';


import { showBlindDateNotification, playNotificationSound } from '../../../lib/notification-helper';
import { useNotification } from '../../../lib/NotificationContext';
import { useBookings } from '../../../lib/BookingContext';

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Clock, MapPin, AlertCircle, Settings, ArrowLeft, CheckCircle, XCircle, Loader } from 'lucide-react';
import { getMyBlindDateBookings } from '../../../lib/user-api';
import { BackButton } from '../../ui/BackButton';
interface BlindDateStatusProps {
  onNavigate: (page: string) => void;
  onBack: () => void;
}

interface Booking {
  id: string;
  status: 'holding' | 'confirmed' | 'completed' | 'refunded';

  city?: string;
  areas?: string[];

  dateRange: string;
  timeWindows: string[];

  confirmedDate?: string;
  confirmedTime?: string;
  confirmedLocation?: string;

  bookingDate: string;
}


export function BlindDateStatus({ onNavigate, onBack }: BlindDateStatusProps) {
  
  const { bookings, loading } = useBookings();
  const mappedBookings: Booking[] = bookings.map((b: any) => {
  const prefs =
    typeof b.preferences === 'string'
      ? JSON.parse(b.preferences)
      : b.preferences || {};

  const isArranged =
    !!b.meeting_date &&
    !!b.meeting_time &&
    !!b.meeting_location;

  return {
    id: b.id,
    status:
      b.payment_status === 'refunded'
        ? 'refunded'
        : b.status === 'completed'
        ? 'completed'
        : isArranged
        ? 'confirmed'
        : 'holding',

    city: b.meeting_location || 'To be decided',
    areas: prefs.areas || [],

    dateRange: prefs.date_range
      ? `${prefs.date_range.from} → ${prefs.date_range.to}`
      : '—',

    timeWindows: (prefs.time_windows || []).map(
      (t: any) => `${t.from} - ${t.to}`
    ),

    confirmedDate: b.meeting_date ?? undefined,
    confirmedTime: b.meeting_time ?? undefined,
    confirmedLocation: b.meeting_location ?? undefined,

    bookingDate: new Date(b.created_at).toLocaleDateString('en-IN'),
  };
});

  useNotification();


  

const holdingBookings = mappedBookings.filter(
  (b) => b.status === 'holding'
);

const confirmedBookings = mappedBookings.filter(
  (b) => b.status === 'confirmed'
);

const completedBookings = mappedBookings.filter(
  (b) => b.status === 'completed'
);

const refundedBookings = mappedBookings.filter(
  (b) => b.status === 'refunded'
);

  const getStatusConfig = (status: Booking['status']) => {
    switch (status) {
     case 'holding':
  return {
    icon: AlertCircle,
    color: 'yellow',
    bgColor: 'bg-green-50 dark:bg-green-900/10',
    borderColor: 'border-yellow-300 dark:border-yellow-900/30',
    textColor: 'text-yellow-700 dark:text-yellow-400',
    iconColor: 'text-yellow-600 dark:text-yellow-400',
    label: 'Holding'
  };

      case 'confirmed':
        return {
          icon: CheckCircle,
          color: 'green',
          bgColor: 'bg-green-50 dark:bg-green-900/10',
          borderColor: 'border-green-400 dark:border-green-900/30',
          textColor: 'text-green-700 dark:text-green-400',
          iconColor: 'text-green-600 dark:text-green-400',
          label: 'Confirmed'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'gray',
          bgColor: 'bg-gray-50 dark:bg-gray-900/10',
          borderColor: 'border-gray-200 dark:border-gray-800',
          textColor: 'text-gray-700 dark:text-gray-400',
          iconColor: 'text-gray-600 dark:text-gray-400',
          label: 'Completed'
        };
      case 'refunded':
        return {
          icon: XCircle,
          color: 'amber',
          bgColor: 'bg-amber-50 dark:bg-amber-900/10',
          borderColor: 'border-amber-200 dark:border-amber-900/30',
          textColor: 'text-amber-700 dark:text-amber-400',
          iconColor: 'text-amber-600 dark:text-amber-400',
          label: 'Cancelled & Refunded'
        };
    }
  };
const renderBookingCard = (booking: Booking, index: number) => {
  const config = getStatusConfig(booking.status);
  const StatusIcon = config.icon;

  return (
    <motion.div
      key={booking.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`p-6 rounded-2xl border-2 ${config.borderColor} ${config.bgColor}`}
    >
      {/* Status Badge */}
      <div className="flex items-center justify-between mb-6">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${config.bgColor} border ${config.borderColor}`}>
          <StatusIcon
            className={`w-4 h-4 ${config.iconColor} ${
              booking.status === 'holding' ? 'animate-spin' : ''
            }`}
          />
          <span className={`text-sm font-medium ${config.textColor}`}>
            {config.label}
          </span>
        </div>
        <span className="text-sm text-gray-500">
          ID: {booking.id}
        </span>
      </div>

      {/* Booking Details */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Location</p>
              <p className="mt-1">{booking.city}</p>
              {booking.areas?.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {booking.areas.join(', ')}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Your Availability</p>
              <p className="mt-1">{booking.dateRange}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-600">Time Windows</p>
              <div className="mt-1 space-y-1">
                {booking.timeWindows?.length > 0 ? (
                  booking.timeWindows.map((w, i) => (
                    <p key={i} className="text-sm">{w}</p>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">To be decided</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          {booking.status === 'confirmed' && booking.confirmedDate && (
            <div className={`p-4 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
              <h4 className={`mb-4 ${config.textColor}`}>Your Date Details</h4>
              <p>Date: {booking.confirmedDate}</p>
              <p>Time: {booking.confirmedTime}</p>
              <p>Location: {booking.confirmedLocation}</p>
            </div>
          )}

          {booking.status === 'refunded' && (
            <div className={`p-4 rounded-xl ${config.bgColor} border ${config.borderColor}`}>
              <p className="text-sm text-gray-600">
                No match found. Payment refunded.
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1F] pb-24 md:pb-8 md:pr-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="border-b border-gray-200 dark:border-gray-800"
      >
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
             <BackButton onClick={onBack} />
              <div>
                <h2>My Blind Dates</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Track your bookings and upcoming dates
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('blind-date-booking')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Book New Date
            </button>
          </div>
        </div>
      </motion.div>
{loading && (
  <div className="flex justify-center py-20">
    <Loader className="w-6 h-6 animate-spin text-gray-400" />
  </div>
)}

      {/* Bookings List */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="space-y-6">
         {holdingBookings.length > 0 && (
  <>
    <h3 className="text-lg font-semibold text-blue-600 mb-4">
      Waiting for Match
    </h3>

    {holdingBookings.map((booking, index) =>
      renderBookingCard(booking, index)
    )}
  </>
)}
{confirmedBookings.length > 0 && (
  <>
    <h3 className="text-lg font-semibold text-green-600 mt-8 mb-4">
      Confirmed Blind Dates
    </h3>

    {confirmedBookings.map((booking, index) =>
      renderBookingCard(booking, index)
    )}
  </>
)}
{completedBookings.length > 0 && (
  <>
    <h3 className="text-lg font-semibold text-gray-600 mt-8 mb-4">
      Completed
    </h3>

    {completedBookings.map((booking, index) =>
      renderBookingCard(booking, index)
    )}
  </>
)}
{refundedBookings.length > 0 && (
  <>
    <h3 className="text-lg font-semibold text-amber-600 mt-8 mb-4">
      Cancelled & Refunded
    </h3>

    {refundedBookings.map((booking, index) =>
      renderBookingCard(booking, index)
    )}
  </>
)}

        </div>

        {/* Empty State (if no bookings) */}
        {!loading && bookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="mb-2 text-gray-600 dark:text-gray-400">No Bookings Yet</h3>
            <p className="text-sm text-gray-500 dark:text-gray-500 mb-6">
              Book your first blind date to get started
            </p>
            <button
              onClick={() => onNavigate('blind-date-booking')}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
            >
              Book Now
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );

}