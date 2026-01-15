# Meet my Mate - Supabase Edge Functions Template

This directory contains templates for all Supabase Edge Functions needed for the Meet my Mate platform.

## 📁 Directory Structure

```
supabase/
└── functions/
    ├── admin_list_bookings/
    │   └── index.ts
    ├── admin_view_booking/
    │   └── index.ts
    ├── admin_update_booking/
    │   └── index.ts
    ├── admin_list_providers/
    │   └── index.ts
    ├── admin_list_payments/
    │   └── index.ts
    ├── admin_list_disputes/
    │   └── index.ts
    ├── notifications/
    │   └── index.ts
    └── shared/
        ├── cors.ts
        ├── auth.ts
        └── database.ts
```

## 🚀 Quick Start

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Your Project

```bash
supabase link --project-ref your-project-ref
```

### 4. Create Edge Functions

Create each function using the templates in this directory:

```bash
# Copy the templates from /supabase-edge-functions/ to your project
# Then deploy each function

supabase functions deploy admin_list_bookings
supabase functions deploy admin_view_booking
supabase functions deploy admin_update_booking
supabase functions deploy admin_list_providers
supabase functions deploy admin_list_payments
supabase functions deploy admin_list_disputes
supabase functions deploy notifications
```

## 📝 Edge Function Templates

### Template: admin_list_bookings

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get service type from query params
    const url = new URL(req.url)
    const serviceType = url.searchParams.get('service_type')
    const status = url.searchParams.get('status')

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Verify user is admin
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user || user.user_metadata?.role !== 'admin') {
      throw new Error('Unauthorized')
    }

    // Build query
    let query = supabaseClient
      .from('bookings')
      .select('*')
      .order('created_at', { ascending: false })

    if (serviceType) {
      query = query.eq('service_type', serviceType)
    }

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
```

## 🔑 Environment Variables

Edge Functions automatically have access to:
- `SUPABASE_URL` - Your project URL
- `SUPABASE_ANON_KEY` - Your anon key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (for admin operations)

## 📚 Complete Edge Function List

### Admin Functions

| Function Name | Purpose | Method | Auth Required |
|--------------|---------|--------|---------------|
| `admin_list_bookings` | List all bookings filtered by service type | GET | Admin |
| `admin_view_booking` | Get detailed booking information | GET | Admin |
| `admin_update_booking` | Update booking status/details | POST | Admin |
| `admin_cancel_booking` | Cancel a booking | POST | Admin |
| `admin_list_providers` | List all service providers | GET | Admin |
| `admin_view_provider` | Get provider details | GET | Admin |
| `admin_update_provider` | Update provider status/info | POST | Admin |
| `admin_list_payments` | List all payment transactions | GET | Admin |
| `admin_view_payment` | Get payment details | GET | Admin |
| `admin_process_refund` | Process a refund | POST | Admin |
| `admin_list_disputes` | List all disputes | GET | Admin |
| `admin_view_dispute` | Get dispute details | GET | Admin |
| `admin_update_dispute` | Update dispute status | POST | Admin |
| `admin_list_users` | List all users | GET | Admin |
| `admin_view_user` | Get user details | GET | Admin |
| `admin_update_user` | Update user status/info | POST | Admin |
| `admin_list_reviews` | List all reviews | GET | Admin |
| `admin_delete_review` | Delete a review | POST | Admin |
| `admin_get_pricing` | Get current pricing | GET | Admin |
| `admin_update_pricing` | Update service pricing | POST | Admin |

### User Functions

| Function Name | Purpose | Method | Auth Required |
|--------------|---------|--------|---------------|
| `create_booking` | Create a new booking | POST | User |
| `get_my_bookings` | Get user's bookings | GET | User |
| `cancel_booking` | Cancel user's own booking | POST | User |
| `get_providers` | List available providers | GET | User |
| `get_provider_details` | Get provider profile | GET | User |
| `create_payment` | Initiate payment | POST | User |
| `confirm_payment` | Confirm payment completion | POST | User |
| `submit_review` | Submit a review | POST | User |
| `get_my_reviews` | Get user's reviews | GET | User |
| `get_notifications` | Get user notifications | GET | User |
| `mark_notification_read` | Mark notification as read | POST | User |

## 🔐 Authentication Pattern

All Edge Functions should verify authentication:

```typescript
// Get the user from the JWT
const {
  data: { user },
} = await supabaseClient.auth.getUser()

if (!user) {
  throw new Error('Unauthorized')
}

// For admin-only functions
if (user.user_metadata?.role !== 'admin') {
  throw new Error('Admin access required')
}
```

## 📦 Response Format

All Edge Functions should return this format:

```typescript
// Success
{
  success: true,
  data: { ... }
}

// Error
{
  success: false,
  error: "Error message"
}
```

## 🧪 Testing Edge Functions

### Local Testing

```bash
# Start Supabase locally
supabase start

# Serve function locally
supabase functions serve admin_list_bookings --env-file .env.local
```

### Test with curl

```bash
curl -X GET \
  http://localhost:54321/functions/v1/admin_list_bookings?service_type=rent_friend \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📝 Notes

- **Demo Mode**: The frontend works without Edge Functions (using mock data)
- **Production**: Deploy Edge Functions for real data and authentication
- **Security**: All Edge Functions verify JWT and user roles
- **CORS**: All functions include CORS headers for frontend access
- **Error Handling**: Consistent error format across all functions

## 🚀 Deployment Commands

```bash
# Deploy all functions at once
for func in admin_list_bookings admin_view_booking admin_update_booking admin_list_providers admin_list_payments admin_list_disputes notifications; do
  supabase functions deploy $func
done

# Or deploy individually
supabase functions deploy admin_list_bookings
supabase functions deploy admin_view_booking
# ... etc
```

## 📊 Monitoring

After deployment:
1. Go to Supabase Dashboard → Edge Functions
2. View logs for each function
3. Monitor invocation count and errors
4. Set up alerts for failures

## 🆘 Troubleshooting

**Issue**: Function returns 401
- Check JWT token is being passed correctly
- Verify user has correct role in metadata

**Issue**: Function times out
- Optimize database queries
- Add indexes to frequently queried columns
- Consider pagination for large datasets

**Issue**: CORS errors
- Verify CORS headers are included
- Check the origin is allowed
- Test with Postman first to isolate CORS issues

---

For more information, see the [Supabase Edge Functions documentation](https://supabase.com/docs/guides/functions).
