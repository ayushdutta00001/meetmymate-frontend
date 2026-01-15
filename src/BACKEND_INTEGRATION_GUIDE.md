# Backend Integration Guide

## Overview

The Meet My Mate frontend has been integrated with the Supabase Edge Functions backend. This guide explains the architecture, setup, and usage.

## Architecture

### Core Services

1. **API Service** (`/lib/api.ts`)
   - Core HTTP request handler with JWT authentication
   - Automatic token management
   - Error handling (401, 403, 500)
   - Session expiry detection and redirect

2. **Supabase Auth** (`/lib/supabase-auth.ts`)
   - User authentication (email/phone)
   - Password reset
   - Session management
   - Role detection (admin/user)

3. **Admin API** (`/lib/admin-api.ts`)
   - All admin-only Edge Functions
   - Booking management
   - Provider management
   - P2P meeting management
   - Review management
   - User management
   - Price configuration

4. **User API** (`/lib/user-api.ts`)
   - User-facing Edge Functions
   - Booking creation
   - Provider browsing
   - Payment processing
   - Notifications
   - Reviews

5. **Auth Context** (`/lib/auth-context.tsx`)
   - React Context for auth state
   - Global auth hooks
   - Auto session persistence

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Get these values from:
- Supabase Dashboard → Project Settings → API

### 2. Backend Requirements

Your Supabase Edge Functions must implement:

#### Authentication Endpoints
- `POST /auth/v1/signup` - User registration
- `POST /auth/v1/token?grant_type=password` - Login
- `POST /auth/v1/logout` - Logout
- `POST /auth/v1/recover` - Password reset
- `GET /auth/v1/user` - Get current user

#### Admin Functions
All admin functions are prefixed with `admin_`:

**Bookings:**
- `admin_list_blind_date_bookings`
- `admin_list_rent_friend_bookings`
- `admin_list_expert_bookings`
- `admin_list_scheduled_bookings`
- `admin_view_booking`
- `admin_update_booking`
- `admin_cancel_booking`

**P2P Meetings:**
- `admin_list_p2p_meetings`
- `admin_view_p2p_meeting`
- `admin_assign_p2p_meeting_details`
- `admin_cancel_p2p_meeting`

**Providers:**
- `admin_providers` (list)
- `admin_view_provider`
- `admin_provider_approve`
- `admin_provider_reject`
- `admin_provider_suspend`
- `admin_update_provider`
- `admin_get_provider_document_url`

**Reviews:**
- `admin_view_reviews`
- `admin_delete_review`

**Users:**
- `admin_view_user`

**Pricing:**
- `admin_update_pricing`
- `admin_get_pricing`

#### User Functions

**Blind Date:**
- `create_blind_date_booking`
- `get_my_blind_date_bookings`
- `cancel_blind_date_booking`

**Rent-a-Friend:**
- `list_rent_friend_providers`
- `get_rent_friend_provider`
- `create_rent_friend_booking`
- `get_my_rent_friend_bookings`
- `cancel_rent_friend_booking`

**Expert:**
- `list_experts`
- `get_expert`
- `create_expert_booking`
- `get_my_expert_bookings`

**P2P:**
- `list_p2p_peers`
- `get_p2p_peer`
- `request_p2p_meeting`
- `get_my_p2p_meetings`
- `respond_to_p2p_meeting`

**Other:**
- `create_payment`
- `confirm_payment`
- `get_my_notifications`
- `mark_notification_read`
- `mark_all_notifications_read`
- `submit_review`
- `get_reviews_for_provider`
- `get_my_received_reviews`
- `get_my_profile`
- `update_my_profile`
- `upload_profile_picture`

## Response Format

All Edge Functions must return:

```json
{
  "success": true,
  "data": { ... },
  "error": "optional error message"
}
```

## Authentication Flow

### User/Admin Login

1. User enters email/phone and password
2. Frontend calls `signIn()` from auth context
3. Supabase Auth validates credentials
4. JWT access token stored in sessionStorage
5. All subsequent API calls include `Authorization: Bearer <token>` header

### Session Management

- Tokens stored in sessionStorage (cleared on browser close)
- Automatic 401 handling redirects to login
- Automatic token refresh on page reload

### Role-Based Access

Admin users have `role: 'admin'` in their user metadata:

```typescript
const { isAdmin } = useAuth();
if (isAdmin) {
  // Show admin features
}
```

## Usage Examples

### Admin: List Bookings

```typescript
import { adminListBlindDateBookings } from './lib/admin-api';

async function loadBookings() {
  try {
    const response = await adminListBlindDateBookings({ 
      status: 'pending' 
    });
    
    if (response.success && response.data) {
      setBookings(response.data);
    } else {
      setError(response.error);
    }
  } catch (err) {
    setError(handleApiError(err));
  }
}
```

### User: Create Booking

```typescript
import { createBlindDateBooking } from './lib/user-api';

async function bookDate() {
  try {
    const response = await createBlindDateBooking({
      preferences: { age: [25, 35], location: 'Mumbai' },
      availability: { days: ['Saturday', 'Sunday'] }
    });
    
    if (response.success && response.data) {
      navigate('booking-confirmation');
    }
  } catch (err) {
    setError(handleApiError(err));
  }
}
```

### Using Auth Context

```typescript
import { useAuth } from './lib/auth-context';

function MyComponent() {
  const { user, isAuthenticated, isAdmin, signOut } = useAuth();
  
  if (!isAuthenticated) {
    return <LoginPrompt />;
  }
  
  return (
    <div>
      <p>Welcome, {user?.email}</p>
      {isAdmin && <AdminPanel />}
      <button onClick={signOut}>Logout</button>
    </div>
  );
}
```

## Error Handling

### HTTP Status Codes

- **401 Unauthorized**: Session expired → auto-redirect to login
- **403 Forbidden**: No permission → show access denied message
- **400 Bad Request**: Invalid data → show inline error
- **500 Server Error**: Backend issue → show error with retry

### Error Display Pattern

```typescript
const [error, setError] = useState('');
const [isLoading, setIsLoading] = useState(false);

async function performAction() {
  setError('');
  setIsLoading(true);
  
  try {
    const response = await apiCall();
    // Handle success
  } catch (err) {
    setError(handleApiError(err));
  } finally {
    setIsLoading(false);
  }
}

// In render:
{error && (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
    <AlertCircle className="w-5 h-5 text-red-500" />
    <p className="text-sm text-red-700">{error}</p>
    <button onClick={performAction}>Try again</button>
  </div>
)}
```

## Security Considerations

### Frontend Security

- JWT tokens stored in sessionStorage (not localStorage)
- Tokens cleared on sign out
- No sensitive data in client-side state
- All API requests use HTTPS

### Backend Requirements

- Validate JWT on every request
- Check user roles before admin actions
- Rate limiting on Edge Functions
- Input validation and sanitization

### CORS Configuration

Ensure Supabase Edge Functions allow requests from your domain:

```typescript
// In Edge Function
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://yourdomain.com',
  'Access-Control-Allow-Headers': 'authorization, content-type',
};
```

## Deployment Checklist

- [ ] Set environment variables in production
- [ ] Test all admin functions with real backend
- [ ] Test all user functions with real backend
- [ ] Verify JWT authentication flow
- [ ] Test session expiry handling
- [ ] Verify role-based access control
- [ ] Test error handling for all edge cases
- [ ] Verify CORS configuration
- [ ] Test file upload functionality
- [ ] Verify payment integration

## Troubleshooting

### "Session expired" on every request

**Cause**: Environment variables not set or incorrect
**Fix**: Verify `.env` file and restart dev server

### "Access denied" errors

**Cause**: User doesn't have admin role
**Fix**: Check user metadata in Supabase Auth dashboard

### CORS errors

**Cause**: Edge Functions not configured for your domain
**Fix**: Update CORS headers in Edge Functions

### Network errors

**Cause**: Supabase URL or API key incorrect
**Fix**: Double-check environment variables

## Next Steps

1. Configure your Supabase project
2. Deploy Edge Functions
3. Set environment variables
4. Test authentication flow
5. Test one admin function end-to-end
6. Test one user function end-to-end
7. Deploy to production

## Support

For backend-specific questions, refer to:
- Supabase Edge Functions documentation
- Your backend implementation guide
- API endpoint specifications
