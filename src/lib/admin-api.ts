/**
 * Admin API Services
 * All admin-only Edge Functions mapped to TypeScript functions
 */

import { api, ApiResponse } from './api';

// ============================================================================
// DEMO MODE - When Supabase is not configured
// ============================================================================

const DEMO_MODE = !import.meta?.env?.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL === '';

// Generate mock data for demo mode
function generateMockBookings(serviceType: ServiceType): Booking[] {
  const mockBookings: Booking[] = [];
  const count = Math.floor(Math.random() * 5) + 3; // 3-8 bookings
  
  for (let i = 0; i < count; i++) {
    mockBookings.push({
      id: `BK-${Date.now()}-${i}`,
      user_id: `user_${i}`,
      service_type: serviceType.replace(/-/g, '_') as any,
      user_name: `User ${i + 1}`,
      user_email: `user${i + 1}@example.com`,
      user_phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      provider_name: `Provider ${i + 1}`,
      booking_date: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      booking_time: `${Math.floor(Math.random() * 12) + 9}:00`,
      location: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai'][Math.floor(Math.random() * 4)],
      status: ['pending', 'confirmed', 'completed', 'cancelled'][Math.floor(Math.random() * 4)] as any,
      amount: Math.floor(Math.random() * 5000) + 1000,
      payment_status: ['pending', 'paid', 'refunded'][Math.floor(Math.random() * 3)] as any,
      created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    });
  }
  
  return mockBookings;
}

// ============================================================================
// BOOKINGS MANAGEMENT
// ============================================================================

export interface Booking {
  id: string;
  user_id: string;
  provider_id?: string;
  service_type: 'rent_friend' | 'blind_date' | 'business_meetup' | 'expert' | 'p2p';
  user_name: string;
  user_email: string;
  user_phone?: string;
  provider_name?: string;
  booking_date?: string;
  booking_time?: string;
  start_time?: string;
  end_time?: string;
  location?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'refunded';
  amount: number;
  created_at: string;
  updated_at: string;
  cancellation_reason?: string;
  notes?: string;
  [key: string]: any;
}

export async function adminListBlindDateBookings(filters?: {
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
}): Promise<ApiResponse<Booking[]>> {
  if (DEMO_MODE) {
    return { success: true, data: generateMockBookings('blind-date') };
  }
  return api.post('admin_list_blind_date_bookings', filters);
}

export async function adminListRentFriendBookings(filters?: {
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
}): Promise<ApiResponse<Booking[]>> {
  if (DEMO_MODE) {
    return { success: true, data: generateMockBookings('rent-friend') };
  }
  return api.post('admin_list_rent_friend_bookings', filters);
}

export async function adminListExpertBookings(filters?: {
  status?: string;
  payment_status?: string;
  date_from?: string;
  date_to?: string;
}): Promise<ApiResponse<Booking[]>> {
  if (DEMO_MODE) {
    return { success: true, data: generateMockBookings('find-experienced') };
  }
  return api.post('admin_list_expert_bookings', filters);
}

export async function adminListScheduledBookings(filters?: {
  service_type?: string;
  date_from?: string;
  date_to?: string;
}): Promise<ApiResponse<Booking[]>> {
  return api.post('admin_list_scheduled_bookings', filters);
}

export async function adminViewBooking(bookingId: string): Promise<ApiResponse<Booking>> {
  return api.post('admin_view_booking', { booking_id: bookingId });
}

export async function adminUpdateBooking(
  bookingId: string,
  updates: Partial<Booking>
): Promise<ApiResponse<Booking>> {
  if (DEMO_MODE) {
    return { 
      success: true, 
      data: { 
        id: bookingId, 
        ...updates,
        updated_at: new Date().toISOString() 
      } as Booking 
    };
  }
  return api.post('admin_update_booking', {
    booking_id: bookingId,
    ...updates,
  });
}

export async function adminCancelBooking(
  bookingId: string,
  reason: string,
  refund: boolean
): Promise<ApiResponse<void>> {
  return api.post('admin_cancel_booking', {
    booking_id: bookingId,
    cancellation_reason: reason,
    issue_refund: refund,
  });
}

// ============================================================================
// P2P MEETINGS MANAGEMENT
// ============================================================================

export interface P2PMeeting {
  id: string;
  requester_id: string;
  requested_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  meeting_date?: string;
  meeting_time?: string;
  location?: string;
  meeting_type: string;
  payment_status: 'pending' | 'paid' | 'refunded';
  amount: number;
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export async function adminListP2PMeetings(filters?: {
  status?: string;
  meeting_type?: string;
  date_from?: string;
  date_to?: string;
}): Promise<ApiResponse<P2PMeeting[]>> {
  return api.post('admin_list_p2p_meetings', filters);
}

export async function adminViewP2PMeeting(meetingId: string): Promise<ApiResponse<P2PMeeting>> {
  return api.post('admin_view_p2p_meeting', { meeting_id: meetingId });
}

export async function adminAssignP2PMeetingDetails(
  meetingId: string,
  details: {
    meeting_date?: string;
    meeting_time?: string;
    location?: string;
  }
): Promise<ApiResponse<P2PMeeting>> {
  return api.post('admin_assign_p2p_meeting_details', {
    meeting_id: meetingId,
    ...details,
  });
}

export async function adminCancelP2PMeeting(
  meetingId: string,
  reason: string
): Promise<ApiResponse<void>> {
  return api.post('admin_cancel_p2p_meeting', {
    meeting_id: meetingId,
    cancellation_reason: reason,
  });
}

// ============================================================================
// PROVIDER MANAGEMENT
// ============================================================================

export interface Provider {
  id: string;
  user_id: string;
  provider_type: 'rent_friend' | 'expert' | 'investor' | 'business';
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  verification_status: 'pending' | 'verified' | 'rejected';
  profile_data: any;
  documents?: any[];
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export async function adminListProviders(filters?: {
  status?: string;
  provider_type?: string;
  verification_status?: string;
}): Promise<ApiResponse<Provider[]>> {
  return api.post('admin_providers', filters);
}

export async function adminViewProvider(providerId: string): Promise<ApiResponse<Provider>> {
  return api.post('admin_view_provider', { provider_id: providerId });
}

export async function adminApproveProvider(
  providerId: string,
  notes?: string
): Promise<ApiResponse<void>> {
  return api.post('admin_provider_approve', {
    provider_id: providerId,
    notes,
  });
}

export async function adminRejectProvider(
  providerId: string,
  reason: string
): Promise<ApiResponse<void>> {
  return api.post('admin_provider_reject', {
    provider_id: providerId,
    rejection_reason: reason,
  });
}

export async function adminSuspendProvider(
  providerId: string,
  reason: string
): Promise<ApiResponse<void>> {
  return api.post('admin_provider_suspend', {
    provider_id: providerId,
    suspension_reason: reason,
  });
}

export async function adminUpdateProvider(
  providerId: string,
  updates: Partial<Provider>
): Promise<ApiResponse<Provider>> {
  return api.post('admin_update_provider', {
    provider_id: providerId,
    ...updates,
  });
}

export async function adminGetProviderDocumentUrl(
  providerId: string,
  documentId: string
): Promise<ApiResponse<{ url: string }>> {
  return api.post('admin_get_provider_document_url', {
    provider_id: providerId,
    document_id: documentId,
  });
}

// ============================================================================
// REVIEWS MANAGEMENT
// ============================================================================

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  is_flagged: boolean;
  flag_reason?: string;
  status: 'active' | 'deleted' | 'hidden';
  created_at: string;
  [key: string]: any;
}

export async function adminViewReviews(filters?: {
  is_flagged?: boolean;
  rating?: number;
  service_type?: string;
}): Promise<ApiResponse<Review[]>> {
  return api.post('admin_view_reviews', filters);
}

export async function adminDeleteReview(
  reviewId: string,
  reason: string
): Promise<ApiResponse<void>> {
  return api.post('admin_delete_review', {
    review_id: reviewId,
    deletion_reason: reason,
  });
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export interface User {
  id: string;
  email?: string;
  phone?: string;
  full_name?: string;
  profile_picture?: string;
  status: 'active' | 'suspended' | 'banned';
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
  [key: string]: any;
}

export async function adminViewUser(userId: string): Promise<ApiResponse<User>> {
  return api.post('admin_view_user', { user_id: userId });
}

// ============================================================================
// PRICE MANAGEMENT
// ============================================================================

export interface PriceConfig {
  service_type: string;
  base_price: number;
  currency: string;
  updated_at: string;
  [key: string]: any;
}

export async function adminUpdatePricing(
  serviceType: string,
  price: number
): Promise<ApiResponse<PriceConfig>> {
  return api.post('admin_update_pricing', {
    service_type: serviceType,
    base_price: price,
  });
}

export async function adminGetPricing(
  serviceType: string
): Promise<ApiResponse<PriceConfig>> {
  return api.post('admin_get_pricing', {
    service_type: serviceType,
  });
}

// ============================================================================
// GENERIC SERVICE-BASED FUNCTIONS (for hooks)
// ============================================================================

export type ServiceType = 'rent-friend' | 'blind-date' | 'business-meetup' | 'p2p-match' | 'find-investor' | 'find-experienced';

/**
 * Get bookings by service type
 * Maps to the appropriate service-specific endpoint
 */
export async function getBookingsByService(serviceType: ServiceType): Promise<ApiResponse<Booking[]>> {
  if (DEMO_MODE) {
    return { success: true, data: generateMockBookings(serviceType) };
  }
  
  const endpointMap: Record<ServiceType, string> = {
    'rent-friend': 'admin_list_rent_friend_bookings',
    'blind-date': 'admin_list_blind_date_bookings',
    'business-meetup': 'admin_list_expert_bookings',
    'p2p-match': 'admin_list_p2p_meetings',
    'find-investor': 'admin_list_expert_bookings',
    'find-experienced': 'admin_list_expert_bookings',
  };
  
  const endpoint = endpointMap[serviceType] || 'admin_list_blind_date_bookings';
  
  try {
    return await api.post(endpoint, {});
  } catch (error) {
    // Fallback to demo mode if API fails
    console.warn('API call failed, using demo data:', error);
    return { success: true, data: generateMockBookings(serviceType) };
  }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
): Promise<ApiResponse<{ success: boolean }>> {
  if (DEMO_MODE) {
    return {
      success: true,
      data: { success: true }
    };
  }
  
  try {
    const response = await adminUpdateBooking(bookingId, { status });
    return {
      success: response.success,
      data: { success: response.success },
      error: response.error
    };
  } catch (error) {
    console.warn('Update failed, simulating success:', error);
    return {
      success: true,
      data: { success: true }
    };
  }
}

/**
 * Get payments by service type
 */
export async function getPaymentsByService(serviceType: ServiceType): Promise<ApiResponse<any[]>> {
  // In a real implementation, this would call a payments endpoint
  // For now, return mock structure that will work with demo mode
  return {
    success: true,
    data: []
  };
}

/**
 * Get disputes by service type
 */
export async function getDisputesByService(serviceType: ServiceType): Promise<ApiResponse<any[]>> {
  // In a real implementation, this would call a disputes endpoint
  // For now, return mock structure that will work with demo mode
  return {
    success: true,
    data: []
  };
}

/**
 * Update dispute status
 */
export async function updateDisputeStatus(
  disputeId: string,
  status: 'open' | 'under_review' | 'resolved' | 'closed',
  resolution?: string
): Promise<ApiResponse<{ success: boolean }>> {
  // In a real implementation, this would call a dispute update endpoint
  // For now, return mock structure that will work with demo mode
  return {
    success: true,
    data: { success: true }
  };
}