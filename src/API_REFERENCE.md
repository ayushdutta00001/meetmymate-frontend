# API Reference for Meet My Mate Backend Integration

Complete reference for all API endpoints, data structures, and integration patterns.

## 📚 Table of Contents

1. [API Overview](#api-overview)
2. [Authentication](#authentication)
3. [Data Structures](#data-structures)
4. [Hooks Reference](#hooks-reference)
5. [API Functions](#api-functions)
6. [Error Handling](#error-handling)

---

## API Overview

### Base Configuration

```typescript
// Configured in /lib/api.ts
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// All requests go to:
// ${SUPABASE_URL}/functions/v1/{endpoint}
```

### Authentication Flow

```typescript
// JWT token stored in sessionStorage
sessionStorage.setItem('access_token', token);

// Included in all requests
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

---

## Authentication

### Sign In

```typescript
import { signIn } from './lib/supabase-auth';

// Email login
await signIn({
  email: 'admin@example.com',
  password: 'password123'
});

// Phone login
await signIn({
  phone: '+919876543210',
  password: 'password123'
});

// Returns:
// - Sets access token in sessionStorage
// - Throws error if credentials invalid
```

### Sign Out

```typescript
import { signOut } from './lib/supabase-auth';

await signOut();
// Clears access token from sessionStorage
```

### Get Current User

```typescript
import { getCurrentUser } from './lib/supabase-auth';

const user = await getCurrentUser();
// Returns: { id, email, phone, role, user_metadata }
```

---

## Data Structures

### Booking

```typescript
interface Booking {
  id: string;                    // e.g., "BD-10024"
  service_type: ServiceType;     // 'rent-friend' | 'blind-date' | etc.
  user_name: string;             // Customer name
  user_email: string;            // Customer email
  user_phone?: string;           // Customer phone (optional)
  provider_name?: string;        // Service provider name
  booking_date: string;          // ISO date: "2024-12-28"
  booking_time: string;          // Time: "14:30"
  location?: string;             // City or address
  status: BookingStatus;         // 'pending' | 'confirmed' | 'completed' | 'cancelled'
  amount: number;                // Payment amount in rupees
  payment_status: 'pending' | 'paid' | 'refunded';
  created_at: string;            // ISO timestamp
  notes?: string;                // Additional notes
}
```

### Payment

```typescript
interface Payment {
  id: string;                    // Unique payment ID
  booking_id: string;            // Reference to booking
  service_type: ServiceType;
  user_name: string;
  user_email: string;
  amount: number;                // Total amount
  status: PaymentStatus;         // 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: PaymentMethod; // 'credit_card' | 'debit_card' | 'upi' | etc.
  transaction_id: string;        // External transaction reference
  created_at: string;
  updated_at: string;
  refund_amount?: number;        // If refunded
  refund_reason?: string;        // Refund justification
  provider_payout?: number;      // Amount to provider
  platform_fee?: number;         // Platform commission
}
```

### Dispute

```typescript
interface Dispute {
  id: string;                    // Unique dispute ID
  booking_id: string;            // Reference to booking
  service_type: ServiceType;
  reporter_name: string;         // Who filed the dispute
  reporter_email: string;
  dispute_type: DisputeType;     // 'refund_request' | 'service_quality' | etc.
  status: DisputeStatus;         // 'open' | 'under_review' | 'resolved' | 'closed'
  description: string;           // Dispute details
  resolution?: string;           // Admin's resolution
  created_at: string;
  updated_at: string;
  resolved_at?: string;          // When resolved
  resolved_by?: string;          // Admin who resolved
  refund_amount?: number;        // If refund granted
}
```

### Notification

```typescript
interface Notification {
  id: string;                    // Unique notification ID
  user_email: string;            // Recipient email
  title: string;                 // Notification title
  message: string;               // Notification body
  link?: string;                 // Optional deep link
  read_status: 'read' | 'unread';
  created_at: string;            // ISO timestamp
}
```

---

## Hooks Reference

### useBookings

**Purpose:** Fetch and manage booking data for a service

```typescript
import { useBookings } from './lib/hooks';

const {
  bookings,      // Booking[] - Array of bookings
  loading,       // boolean - Is fetching
  error,         // string | null - Error message
  refetch,       // () => Promise<void> - Reload data
  updateStatus,  // (id, status) => Promise<void> - Update booking
  clearError     // () => void - Clear error state
} = useBookings({
  serviceType: 'blind-date',  // Required: which service
  autoFetch: true             // Optional: fetch on mount (default: true)
});
```

**Example Usage:**

```typescript
// Fetch bookings
const { bookings, loading, error } = useBookings({
  serviceType: 'rent-friend'
});

// Update booking status
await updateStatus('RF-10024', 'confirmed');

// Manually refetch
await refetch();
```

---

### usePayments

**Purpose:** Fetch and manage payment data for a service

```typescript
import { usePayments } from './lib/hooks';

const {
  payments,         // Payment[] - Array of payments
  loading,          // boolean - Is fetching
  error,            // string | null - Error message
  refetch,          // () => Promise<void> - Reload data
  totalRevenue,     // number - Sum of completed payments
  pendingPayments,  // number - Count of pending payments
  clearError        // () => void - Clear error state
} = usePayments({
  serviceType: 'business-meetup',
  autoFetch: true
});
```

**Example Usage:**

```typescript
// Display metrics
<div>Total Revenue: ₹{totalRevenue.toLocaleString()}</div>
<div>Pending: {pendingPayments}</div>

// Filter payments
const completedPayments = payments.filter(p => p.status === 'completed');
```

---

### useDisputes

**Purpose:** Fetch and manage dispute data for a service

```typescript
import { useDisputes } from './lib/hooks';

const {
  disputes,      // Dispute[] - Array of disputes
  loading,       // boolean - Is fetching
  error,         // string | null - Error message
  refetch,       // () => Promise<void> - Reload data
  updateStatus,  // (id, status, resolution?) => Promise<void>
  openDisputes,  // number - Count of open/under_review disputes
  clearError     // () => void - Clear error state
} = useDisputes({
  serviceType: 'p2p-match',
  autoFetch: true
});
```

**Example Usage:**

```typescript
// Resolve a dispute
await updateStatus(
  'DISP-001', 
  'resolved', 
  'Refund issued: ₹500'
);

// Show open disputes count
<Badge>{openDisputes} Open Disputes</Badge>
```

---

### useNotifications

**Purpose:** Fetch and manage notifications

```typescript
import { useNotifications } from './lib/hooks';

const {
  notifications,  // Notification[] - Array of notifications
  loading,        // boolean - Is fetching
  error,          // string | null - Error message
  refetch,        // () => Promise<void> - Reload data
  markAsRead,     // (id) => Promise<void> - Mark single as read
  markAllAsRead,  // () => Promise<void> - Mark all as read
  unreadCount,    // number - Count of unread notifications
  clearError      // () => void - Clear error state
} = useNotifications({
  autoFetch: true
});
```

**Example Usage:**

```typescript
// Mark notification as read on click
<div onClick={() => markAsRead(notification.id)}>
  {notification.title}
</div>

// Show unread badge
{unreadCount > 0 && <Badge>{unreadCount}</Badge>}
```

---

## API Functions

### Core API Methods

```typescript
import { api } from './lib/api';

// GET request
const response = await api.get<Booking[]>('blind-date-bookings');
// Returns: ApiResponse<Booking[]>

// POST request
const response = await api.post('create-booking', {
  user_id: '123',
  service_type: 'rent-friend',
  date: '2024-12-28'
});

// PUT request
const response = await api.put('bookings/RF-10024', {
  status: 'confirmed'
});

// DELETE request
const response = await api.delete('bookings/RF-10024');
```

### Admin API Functions

Located in `/lib/admin-api.ts`:

```typescript
import {
  getBookingsByService,
  updateBookingStatus,
  getPaymentsByService,
  getDisputesByService,
  updateDisputeStatus
} from './lib/admin-api';

// Get bookings for a service
const response = await getBookingsByService('blind-date');
// Returns: ApiResponse<Booking[]>

// Update booking status
const response = await updateBookingStatus('BD-10024', 'confirmed');
// Returns: ApiResponse<{ success: boolean }>

// Get payments for a service
const response = await getPaymentsByService('rent-friend');
// Returns: ApiResponse<Payment[]>

// Get disputes for a service
const response = await getDisputesByService('business-meetup');
// Returns: ApiResponse<Dispute[]>

// Update dispute status with resolution
const response = await updateDisputeStatus(
  'DISP-001',
  'resolved',
  'Refund granted: ₹500'
);
// Returns: ApiResponse<{ success: boolean }>
```

---

## Error Handling

### Error Types

```typescript
export class ApiError extends Error {
  constructor(
    message: string,      // User-friendly error message
    public statusCode: number,  // HTTP status code
    public response?: any       // Original response (optional)
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### Common Status Codes

| Code | Meaning | User Message | Action |
|------|---------|--------------|--------|
| 200 | OK | Success | Continue |
| 401 | Unauthorized | Session expired | Redirect to login |
| 403 | Forbidden | Access denied | Show error |
| 404 | Not Found | Resource not found | Show error |
| 500 | Server Error | Server error occurred | Show retry |
| 0 | Network Error | Network error | Show retry |

### Error Handling Pattern

```typescript
import { handleApiError } from './lib/api';

try {
  const response = await api.get('bookings');
  // Handle success
} catch (err) {
  // Convert to user-friendly message
  const errorMessage = handleApiError(err);
  setError(errorMessage);
  
  // Log for debugging
  console.error('API Error:', err);
}
```

### Automatic Error Handling

The API layer automatically handles:

1. **401 Unauthorized**
   - Clears access token
   - Redirects to login with `?expired=true`
   - Shows "Session expired" message

2. **403 Forbidden**
   - Shows "Access denied" message
   - Does not clear token

3. **Network Errors**
   - Shows "Network error occurred"
   - Preserves state for retry

---

## Response Format

All API responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;   // true if successful
  data?: T;          // Response data (if success)
  error?: string;    // Error message (if failed)
}
```

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "id": "BD-10024",
      "user_name": "John Doe",
      "status": "confirmed"
    }
  ]
}
```

### Error Response

```json
{
  "success": false,
  "error": "Booking not found"
}
```

---

## Service Types

```typescript
type ServiceType = 
  | 'rent-friend'
  | 'blind-date'
  | 'business-meetup'
  | 'p2p-match'
  | 'find-investor'
  | 'find-experienced';
```

### Endpoint Mapping

| Service Type | Operations Endpoint | Payments Endpoint | Disputes Endpoint |
|--------------|-------------------|-------------------|-------------------|
| rent-friend | `rent-friend-bookings` | `rent-friend-payments` | `rent-friend-disputes` |
| blind-date | `blind-date-bookings` | `blind-date-payments` | `blind-date-disputes` |
| business-meetup | `business-meetup-bookings` | `business-meetup-payments` | `business-meetup-disputes` |
| p2p-match | `p2p-match-bookings` | `p2p-match-payments` | `p2p-match-disputes` |
| find-investor | `find-investor-bookings` | `find-investor-payments` | `find-investor-disputes` |
| find-experienced | `find-experienced-bookings` | `find-experienced-payments` | `find-experienced-disputes` |

---

## Quick Reference

### Import Everything You Need

```typescript
// Hooks
import { 
  useBookings, 
  usePayments, 
  useDisputes, 
  useNotifications 
} from './lib/hooks';

// Types
import type { 
  Booking, 
  Payment, 
  Dispute, 
  Notification,
  ServiceType,
  BookingStatus,
  PaymentStatus,
  DisputeStatus
} from './lib/hooks';

// API Functions
import { api, handleApiError } from './lib/api';
import {
  getBookingsByService,
  updateBookingStatus
} from './lib/admin-api';

// Auth Functions
import {
  signIn,
  signOut,
  getCurrentUser
} from './lib/supabase-auth';

// UI Components
import { LoadingState } from './components/ui/LoadingState';
import { ErrorState } from './components/ui/ErrorState';
```

---

## Example: Complete Integration

```typescript
import React, { useState } from 'react';
import { useBookings, BookingStatus } from '../../../lib/hooks';
import { LoadingState } from '../../ui/LoadingState';
import { ErrorState } from '../../ui/ErrorState';

export function MyOperationsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  
  // 1. Fetch data
  const { bookings, loading, error, refetch, updateStatus } = useBookings({
    serviceType: 'blind-date',
    autoFetch: true
  });
  
  // 2. Handle actions
  const handleApprove = async (id: string) => {
    try {
      await updateStatus(id, 'confirmed');
      // UI updates automatically!
    } catch (err) {
      console.error('Failed to approve:', err);
    }
  };
  
  // 3. Filter data
  const filteredBookings = bookings.filter(b =>
    b.user_name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // 4. Loading state
  if (loading) return <LoadingState message="Loading bookings..." />;
  
  // 5. Error state
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  
  // 6. Render
  return (
    <div>
      <input 
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        placeholder="Search..."
      />
      
      {filteredBookings.map(booking => (
        <div key={booking.id}>
          <h3>{booking.user_name}</h3>
          <button onClick={() => handleApprove(booking.id)}>
            Approve
          </button>
        </div>
      ))}
    </div>
  );
}
```

---

**That's it! You now have everything you need to integrate the backend. 🚀**
