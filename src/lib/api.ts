/**
 * Core API Service Layer for Meet My Mate in
 * Handles all backend communication with Supabase Edge Functions
 */
import { supabase } from '../supabase';

// API Configuration - safely access environment variables
const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || '';
const SUPABASE_ANON_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || '';

// Check if we're in demo mode (no Supabase configured)
const DEMO_MODE = !SUPABASE_URL || SUPABASE_URL === '';

export interface ApiResponse<T = any> {
  success: boolean;

  data?: T;
  error?: string;

  bookings?: any[];
  withdrawals?: any[];
  profile?: any;

  [key: string]: any;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}



/**
 * Core API request function with JWT authentication
 */
async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  // If in demo mode, return empty success response
  if (DEMO_MODE) {
    console.warn('API in demo mode - Supabase not configured. Returning mock response.');
    return {
      success: true,
      data: [] as T,
    };
  }
const headers: HeadersInit = {
  ...(options.body instanceof FormData
    ? {}
    : { 'Content-Type': 'application/json' }),
  ...options.headers,
};

let session = null;

try {
  const {
    data: { session: currentSession },
    error,
  } = await supabase.auth.getSession();

  if (error) {
    console.warn("getSession failed:", error.message);
  } else {
    session = currentSession;
  }
} catch (err) {
  if (
    err instanceof Error &&
    err.name === "AbortError"
  ) {
    console.warn("Session request was aborted.");
  } else {
    console.error(err);
  }
}

if (session?.access_token) {
  headers["Authorization"] =
    `Bearer ${session.access_token}`;
}
  
  try {
   const controller = new AbortController();

const response = await fetch(
  `${SUPABASE_URL}/functions/v1/${endpoint}`,
  {
    ...options,
    headers,
    signal: controller.signal,
  }
);
console.log("API:", endpoint, response.status);

    // Handle HTTP errors
    if (!response.ok) {
     
     if (response.status === 401) {
  console.warn('401 received — session may still be initializing');
  return {
    success: false,
    error: 'unauthorized',
  };
}


      if (response.status === 403) {
        throw new ApiError('Access denied. You do not have permission.', 403);
      }

      // Try to parse error response
      let errorMessage = 'An error occurred';
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch {
        errorMessage = `Request failed with status ${response.status}`;
      }

      throw new ApiError(errorMessage, response.status);
    }

    // Parse response
    const data: ApiResponse<T> = await response.json();
    
    // Check backend success flag
    if (data.success === false) {
      throw new ApiError(data.error || 'Request failed', response.status, data);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or parsing error
   if (
  error instanceof Error &&
  error.name === "AbortError"
) {
  console.warn("Request aborted:", endpoint);
} else {
  console.error("API Error:", error);
}
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error occurred',
      0
    );
  }
}

/**
 * HTTP method helpers
 */
export const api = {
  get: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    }),
    
  put: <T = any>(endpoint: string, body?: any, options?: RequestInit) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    }),
    
  delete: <T = any>(endpoint: string, options?: RequestInit) =>
    apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};

/**
 * Handle API errors with user-friendly messages
 */
export function handleApiError(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}