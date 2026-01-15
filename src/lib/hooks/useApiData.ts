/**
 * Custom React hook for fetching data from API
 * Provides loading, error, and data states
 */

import { useState, useEffect } from 'react';
import { ApiResponse, handleApiError } from '../api';

interface UseApiDataOptions<T> {
  // The API call function
  fetchFn: () => Promise<ApiResponse<T>>;
  // Dependencies that trigger refetch (like useEffect deps)
  deps?: any[];
  // Whether to fetch immediately on mount
  immediate?: boolean;
}

interface UseApiDataReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string;
  refetch: () => Promise<void>;
  setData: (data: T | null) => void;
}

/**
 * Hook for fetching data from API with automatic loading and error handling
 * 
 * @example
 * const { data, isLoading, error, refetch } = useApiData({
 *   fetchFn: () => getMyBookings(),
 *   deps: [userId]
 * });
 */
export function useApiData<T>({
  fetchFn,
  deps = [],
  immediate = true,
}: UseApiDataOptions<T>): UseApiDataReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(immediate);
  const [error, setError] = useState('');

  async function fetchData() {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetchFn();

      if (response.success && response.data !== undefined) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to load data');
      }
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (immediate) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    setData,
  };
}

/**
 * Hook for performing mutations (POST, PUT, DELETE)
 * Does not auto-fetch, provides a mutate function instead
 */
interface UseMutationReturn<TData, TVariables> {
  mutate: (variables: TVariables) => Promise<TData | null>;
  isLoading: boolean;
  error: string;
  data: TData | null;
  reset: () => void;
}

export function useMutation<TData = any, TVariables = any>(
  mutateFn: (variables: TVariables) => Promise<ApiResponse<TData>>
): UseMutationReturn<TData, TVariables> {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function mutate(variables: TVariables): Promise<TData | null> {
    setIsLoading(true);
    setError('');

    try {
      const response = await mutateFn(variables);

      if (response.success && response.data !== undefined) {
        setData(response.data);
        return response.data;
      } else {
        setError(response.error || 'Operation failed');
        return null;
      }
    } catch (err) {
      setError(handleApiError(err));
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  function reset() {
    setData(null);
    setError('');
    setIsLoading(false);
  }

  return {
    mutate,
    isLoading,
    error,
    data,
    reset,
  };
}
