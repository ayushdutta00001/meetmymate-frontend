/**
 * Custom hook for managing dispute data
 * Provides standardized data fetching, loading states, and error handling
 */

import { useState, useEffect, useCallback } from 'react';
import { getDisputesByService, updateDisputeStatus } from '../admin-api';
import { handleApiError } from '../api';
import { ServiceType } from './useBookings';

export type DisputeStatus = 'open' | 'under_review' | 'resolved' | 'closed';
export type DisputeType = 'refund_request' | 'service_quality' | 'no_show' | 'billing_issue' | 'other';

export interface Dispute {
  id: string;
  booking_id: string;
  service_type: ServiceType;
  reporter_name: string;
  reporter_email: string;
  dispute_type: DisputeType;
  status: DisputeStatus;
  description: string;
  resolution?: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  resolved_by?: string;
  refund_amount?: number;
}

interface UseDisputesOptions {
  serviceType: ServiceType;
  autoFetch?: boolean;
}

interface UseDisputesReturn {
  disputes: Dispute[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  updateStatus: (disputeId: string, status: DisputeStatus, resolution?: string) => Promise<void>;
  openDisputes: number;
  clearError: () => void;
}

export function useDisputes({ serviceType, autoFetch = true }: UseDisputesOptions): UseDisputesReturn {
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState<boolean>(autoFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchDisputes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDisputesByService(serviceType);
      
      if (response.success && response.data) {
        setDisputes(response.data);
      } else {
        throw new Error(response.error || 'Failed to fetch disputes');
      }
    } catch (err) {
      const errorMessage = handleApiError(err);
      setError(errorMessage);
      console.error(`Error fetching ${serviceType} disputes:`, err);
      // Set empty array on error so UI doesn't break
      setDisputes([]);
    } finally {
      setLoading(false);
    }
  }, [serviceType]);

  const updateStatus = useCallback(async (
    disputeId: string, 
    status: DisputeStatus, 
    resolution?: string
  ) => {
    try {
      const response = await updateDisputeStatus(disputeId, status, resolution);
      
      if (response.success) {
        // Optimistically update local state
        setDisputes(prev => 
          prev.map(dispute => 
            dispute.id === disputeId 
              ? { 
                  ...dispute, 
                  status,
                  resolution: resolution || dispute.resolution,
                  updated_at: new Date().toISOString(),
                  ...(status === 'resolved' || status === 'closed' 
                    ? { resolved_at: new Date().toISOString() }
                    : {}
                  )
                }
              : dispute
          )
        );
      } else {
        throw new Error(response.error || 'Failed to update dispute status');
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
      fetchDisputes();
    }
  }, [fetchDisputes, autoFetch]);

  // Calculate metrics
  const openDisputes = disputes
    .filter(d => d.status === 'open' || d.status === 'under_review')
    .length;

  return {
    disputes,
    loading,
    error,
    refetch: fetchDisputes,
    updateStatus,
    openDisputes,
    clearError,
  };
}