/**
 * User API Services
 * All user-facing Edge Functions mapped to TypeScript functions
 */

import { api, ApiResponse } from './api';

// ============================================================================
// BLIND DATE SERVICES
// ============================================================================

export interface BlindDateBooking {
  id: string;
  user_id: string;
  status: 'pending' | 'matched' | 'scheduled' | 'completed' | 'cancelled';
  preferences: any;
  match_id?: string;
  meeting_date?: string;
  meeting_time?: string;
  location?: string;
  payment_status: 'pending' | 'paid' | 'refunded';
  amount: number;
  created_at: string;
  updated_at: string;
}

export async function createBlindDateBooking(data: {
  preferences: any;
  availability: any;
}): Promise<ApiResponse<BlindDateBooking>> {
  return api.post('create_blind_date_booking', data);
}

export async function getMyBlindDateBookings(): Promise<ApiResponse<BlindDateBooking[]>> {
  return api.get('get_my_blind_date_bookings');
}

export async function cancelBlindDateBooking(bookingId: string): Promise<ApiResponse<void>> {
  return api.post('cancel_blind_date_booking', { booking_id: bookingId });
}

// ============================================================================
// RENT-A-FRIEND SERVICES
// ============================================================================

export interface RentFriendProvider {
  id: string;
  user_id: string;
  display_name: string;
  bio: string;
  profile_picture?: string;
  hourly_rate: number;
  rating: number;
  total_bookings: number;
  availability: any;
  interests: string[];
  location: string;
}

export interface RentFriendBooking {
  id: string;
  user_id: string;
  provider_id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  booking_date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  location: string;
  activity_type: string;
  payment_status: 'pending' | 'paid' | 'refunded';
  amount: number;
  created_at: string;
  updated_at: string;
}

export async function listRentFriendProviders(filters?: {
  location?: string;
  interests?: string[];
  min_rating?: number;
}): Promise<ApiResponse<RentFriendProvider[]>> {
  return api.post('list_rent_friend_providers', filters);
}

export async function getRentFriendProvider(providerId: string): Promise<ApiResponse<RentFriendProvider>> {
  return api.post('get_rent_friend_provider', { provider_id: providerId });
}

export async function createRentFriendBooking(data: {
  provider_id: string;
  booking_date: string;
  start_time: string;
  duration_hours: number;
  location: string;
  activity_type: string;
}): Promise<ApiResponse<RentFriendBooking>> {
  return api.post('create_rent_friend_booking', data);
}

export async function getMyRentFriendBookings(): Promise<ApiResponse<RentFriendBooking[]>> {
  return api.get('get_my_rent_friend_bookings');
}

export async function cancelRentFriendBooking(bookingId: string): Promise<ApiResponse<void>> {
  return api.post('cancel_rent_friend_booking', { booking_id: bookingId });
}

// ============================================================================
// EXPERT SERVICES
// ============================================================================

export interface ExpertProvider {
  id: string;
  user_id: string;
  display_name: string;
  expertise: string[];
  bio: string;
  profile_picture?: string;
  hourly_rate: number;
  rating: number;
  total_consultations: number;
  availability: any;
  credentials: string[];
}

export interface ExpertBooking {
  id: string;
  user_id: string;
  expert_id: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  consultation_date: string;
  consultation_time: string;
  duration_hours: number;
  consultation_type: 'video' | 'phone' | 'in_person';
  topic: string;
  payment_status: 'pending' | 'paid' | 'refunded';
  amount: number;
  created_at: string;
  updated_at: string;
}

export async function listExperts(filters?: {
  expertise?: string[];
  min_rating?: number;
}): Promise<ApiResponse<ExpertProvider[]>> {
  return api.post('list_experts', filters);
}

export async function getExpert(expertId: string): Promise<ApiResponse<ExpertProvider>> {
  return api.post('get_expert', { expert_id: expertId });
}

export async function createExpertBooking(data: {
  expert_id: string;
  consultation_date: string;
  consultation_time: string;
  duration_hours: number;
  consultation_type: 'video' | 'phone' | 'in_person';
  topic: string;
}): Promise<ApiResponse<ExpertBooking>> {
  return api.post('create_expert_booking', data);
}

export async function getMyExpertBookings(): Promise<ApiResponse<ExpertBooking[]>> {
  return api.get('get_my_expert_bookings');
}

// ============================================================================
// P2P MATCHING SERVICES
// ============================================================================

export interface P2PPeer {
  id: string;
  user_id: string;
  display_name: string;
  profile_picture?: string;
  business_type: string;
  looking_for: string[];
  bio: string;
  location: string;
  rating?: number;
}

export interface P2PMeetingRequest {
  id: string;
  requester_id: string;
  requested_id: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  meeting_type: string;
  message: string;
  meeting_date?: string;
  meeting_time?: string;
  location?: string;
  payment_status: 'pending' | 'paid' | 'refunded';
  amount: number;
  created_at: string;
  updated_at: string;
}

export async function listP2PPeers(filters?: {
  business_type?: string;
  looking_for?: string[];
  location?: string;
}): Promise<ApiResponse<P2PPeer[]>> {
  return api.post('list_p2p_peers', filters);
}

export async function getP2PPeer(peerId: string): Promise<ApiResponse<P2PPeer>> {
  return api.post('get_p2p_peer', { peer_id: peerId });
}

export async function requestP2PMeeting(data: {
  requested_id: string;
  meeting_type: string;
  message: string;
  proposed_dates?: string[];
}): Promise<ApiResponse<P2PMeetingRequest>> {
  return api.post('request_p2p_meeting', data);
}

export async function getMyP2PMeetings(): Promise<ApiResponse<P2PMeetingRequest[]>> {
  return api.get('get_my_p2p_meetings');
}

export async function respondToP2PMeeting(
  meetingId: string,
  action: 'accept' | 'reject'
): Promise<ApiResponse<void>> {
  return api.post('respond_to_p2p_meeting', {
    meeting_id: meetingId,
    action,
  });
}

// ============================================================================
// PAYMENTS
// ============================================================================

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret?: string;
}

export async function createPayment(data: {
  booking_id: string;
  booking_type: string;
  amount: number;
}): Promise<ApiResponse<PaymentIntent>> {
  return api.post('create_payment', data);
}

export async function confirmPayment(paymentId: string): Promise<ApiResponse<void>> {
  return api.post('confirm_payment', { payment_id: paymentId });
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  data?: any;
  created_at: string;
}

export async function getMyNotifications(): Promise<ApiResponse<Notification[]>> {
  return api.get('get_my_notifications');
}

export async function markNotificationRead(notificationId: string): Promise<ApiResponse<void>> {
  return api.post('mark_notification_read', { notification_id: notificationId });
}

export async function markAllNotificationsRead(): Promise<ApiResponse<void>> {
  return api.post('mark_all_notifications_read');
}

// ============================================================================
// REVIEWS
// ============================================================================

export interface Review {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment?: string;
  created_at: string;
}

export async function submitReview(data: {
  booking_id: string;
  rating: number;
  comment?: string;
}): Promise<ApiResponse<Review>> {
  return api.post('submit_review', data);
}

export async function getReviewsForProvider(providerId: string): Promise<ApiResponse<Review[]>> {
  return api.post('get_reviews_for_provider', { provider_id: providerId });
}

export async function getMyReceivedReviews(): Promise<ApiResponse<Review[]>> {
  return api.get('get_my_received_reviews');
}

// ============================================================================
// USER PROFILE
// ============================================================================

export interface UserProfile {
  id: string;
  email?: string;
  phone?: string;
  full_name?: string;
  profile_picture?: string;
  bio?: string;
  location?: string;
  interests?: string[];
  preferences?: any;
}

export async function getMyProfile(): Promise<ApiResponse<UserProfile>> {
  return api.get('get_my_profile');
}

export async function updateMyProfile(updates: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
  return api.post('update_my_profile', updates);
}

export async function uploadProfilePicture(file: File): Promise<ApiResponse<{ url: string }>> {
  const formData = new FormData();
  formData.append('file', file);
  
  // Note: This endpoint may need different handling for file uploads
  return api.post('upload_profile_picture', formData);
}
