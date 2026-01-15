/**
 * Custom hook for managing payment data
 * Provides standardized data fetching, loading states, and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import { getPaymentsByService } from '../admin-api';
import { handleApiError } from '../api';
import { ServiceType } from './useBookings';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'upi' | 'net_banking' | 'wallet';

export interface Payment {
  id: string;
  booking_id: string;
  service_type: ServiceType;
  user_name: string;
  user_email: string;
  amount: number;
  status: PaymentStatus;
  payment_method: PaymentMethod;
  transaction_id: string;
  created_at: string;
  updated_at: string;
  refund_amount?: number;
  refund_reason?: string;
  provider_payout?: number;
  platform_fee?: number;
}

interface UsePaymentsOptions {
  serviceType: ServiceType;
  autoFetch?: boolean;
}

interface UsePaymentsReturn {
  payments: Payment[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  totalRevenue: number;
  pendingPayments: number;
  clearError: () => void;
}

export function usePayments({ serviceType, autoFetch = true }: UsePaymentsOptions): UsePaymentsReturn {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getPaymentsByService(serviceType);
      
      if (response.success && response.data) {
        setPayments(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch payments');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error(`Error fetching ${serviceType} payments:`, err);
      // Set empty array on error so UI doesn't break
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [serviceType]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchPayments();
    }
  }, [fetchPayments, autoFetch]);

  // Calculate metrics
  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingPayments = payments
    .filter(p => p.status === 'pending')
    .length;

  return {
    payments,
    loading,
    error,
    refetch: fetchPayments,
    totalRevenue,
    pendingPayments,
    clearError,
  };
}

/**
 * Hook for payment statistics across all services
 */
export function usePaymentStats() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    pendingPayments: 0,
    completedPayments: 0,
    refundedAmount: 0,
    platformFees: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In production, fetch aggregated stats from backend
    // For now, this is a placeholder
    setLoading(false);
  }, []);

  return { stats, loading, error };
}