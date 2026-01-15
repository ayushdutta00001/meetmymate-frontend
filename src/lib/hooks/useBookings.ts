/**
 * Custom hook for managing bookings data
 * Provides standardized data fetching, loading states, and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import { getBookingsByService, updateBookingStatus, Booking as AdminBooking } from '../admin-api';
import { handleApiError } from '../api';

export type ServiceType = 'rent-friend' | 'blind-date' | 'business-meetup' | 'p2p-match' | 'find-investor' | 'find-experienced';
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

// Extended Booking interface that matches admin-api Booking
export interface Booking extends Omit<AdminBooking, 'service_type'> {
  service_type: ServiceType | string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  provider_name?: string;
  booking_date?: string;
  booking_time?: string;
  location?: string;
  notes?: string;
}

interface UseBookingsOptions {
  serviceType: ServiceType;
  autoFetch?: boolean;
}

interface UseBookingsReturn {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateStatus: (bookingId: string, status: BookingStatus) => Promise<void>;
  clearError: () => void;
}

export function useBookings({ serviceType, autoFetch = true }: UseBookingsOptions): UseBookingsReturn {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getBookingsByService(serviceType);
      
      if (response.success && response.data) {
        setBookings(response.data as Booking[]);
      } else {
        throw new Error(response.error || 'Failed to fetch bookings');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error(`Error fetching ${serviceType} bookings:`, err);
      // Set empty array on error so UI doesn't break
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [serviceType]);

  const updateStatus = useCallback(async (bookingId: string, status: BookingStatus) => {
    try {
      const response = await updateBookingStatus(bookingId, status);
      
      if (response.success) {
        // Optimistically update local state
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status }
              : booking
          )
        );
      } else {
        throw new Error(response.error || 'Failed to update booking status');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchBookings();
    }
  }, [fetchBookings, autoFetch]);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    updateStatus,
    clearError,
  };
}