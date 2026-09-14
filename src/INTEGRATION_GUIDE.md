# Backend Integration Guide

This guide provides step-by-step instructions for integrating the remaining admin screens with your Supabase backend.

## 📚 Table of Contents

1. [Overview](#overview)
2. [Integration Pattern](#integration-pattern)
3. [Step-by-Step Instructions](#step-by-step-instructions)
4. [Code Templates](#code-templates)
5. [Screen-by-Screen Checklist](#screen-by-screen-checklist)
6. [Testing Guide](#testing-guide)

---

## Overview

### What's Already Done ✅

- ✅ Core API service layer (`/lib/api.ts`)
- ✅ Supabase authentication (`/lib/supabase-auth.ts`)
- ✅ Admin API functions (`/lib/admin-api.ts`)
- ✅ Custom hooks (`/lib/hooks/`)
  - `useBookings` - For Operations screens
  - `usePayments` - For Payments screens
  - `useDisputes` - For Disputes screens
  - `useNotifications` - For Communications screens
- ✅ Reusable UI components
  - `LoadingState` - Shows loading spinner
  - `ErrorState` - Shows error with retry button
- ✅ Example integrations
  - Blind Date Operations
  - Rent-a-Friend Operations
  - Notifications

### What Needs Integration 🔧

**24 screens remaining across 6 service modules:**

Each module has 4 sub-sections:
- Operations (booking management)
- Payments (payment tracking)
- Disputes (dispute resolution)
- Settings (price control)

---

## Integration Pattern

Every screen integration follows this pattern:

```tsx
// 1. Import the appropriate hook
import { useBookings } from '../../../../lib/hooks';
import { LoadingState } from '../../../ui/LoadingState';
import { ErrorState } from '../../../ui/ErrorState';

// 2. Use the hook to fetch data
const { data, loading, error, refetch, updateStatus } = useHook({
  serviceType: 'service-name',
  autoFetch: true
});

// 3. Handle loading state
if (loading) {
  return <LoadingState message="Loading..." />;
}

// 4. Handle error state
if (error) {
  return <ErrorState message={error} onRetry={refetch} />;
}

// 5. Render with real data
return (
  <div>
    {data.map(item => (
      <div key={item.id}>{item.name}</div>
    ))}
  </div>
);
```

---

## Step-by-Step Instructions

### For Operations Screens (e.g., BusinessMeetupOperations.tsx)

**1. Add imports:**
```tsx
import { useBookings, BookingStatus } from '../../../../lib/hooks';
import { LoadingState } from '../../../ui/LoadingState';
import { ErrorState } from '../../../ui/ErrorState';
```

**2. Replace mock data with hook:**
```tsx
// BEFORE:
const bookings: Booking[] = [ /* mock data */ ];

// AFTER:
const { bookings, loading, error, refetch, updateStatus } = useBookings({
  serviceType: 'business-meetup', // Change per service
  autoFetch: true
});
```

**3. Add status update handler:**
```tsx
const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus) => {
  try {
    await updateStatus(bookingId, newStatus);
  } catch (err) {
    console.error('Failed to update booking status:', err);
  }
};
```

**4. Add loading/error states:**
```tsx
if (loading) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      {/* Keep your existing header */}
      <LoadingState message="Loading bookings..." />
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      {/* Keep your existing header */}
      <ErrorState message={error} onRetry={refetch} />
    </div>
  );
}
```

**5. Update metrics to use real data:**
```tsx
// BEFORE:
const metrics = [
  { label: 'Total Bookings', value: '1,234', color: 'blue' },
  // ...
];

// AFTER:
const metrics = [
  { label: 'Total Bookings', value: bookings.length.toString(), color: 'blue' },
  { label: 'Active Now', value: bookings.filter(b => b.status === 'confirmed').length.toString(), color: 'green' },
  { label: 'Pending Approval', value: bookings.filter(b => b.status === 'pending').length.toString(), color: 'yellow' },
  // ...
];
```

**6. Update action buttons:**
```tsx
<button 
  onClick={() => handleStatusUpdate(booking.id, 'confirmed')}
  className="..."
>
  <CheckCircle className="w-4 h-4" />
</button>
```

---

### For Payments Screens (e.g., BusinessMeetupPayments.tsx)

**1. Add imports:**
```tsx
import { usePayments } from '../../../../lib/hooks';
import { LoadingState } from '../../../ui/LoadingState';
import { ErrorState } from '../../../ui/ErrorState';
```

**2. Replace mock data:**
```tsx
const { payments, loading, error, refetch, totalRevenue, pendingPayments } = usePayments({
  serviceType: 'business-meetup',
  autoFetch: true
});
```

**3. Add loading/error states** (same pattern as Operations)

**4. Update metrics:**
```tsx
const metrics = [
  { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString()}`, color: 'green' },
  { label: 'Pending Payments', value: pendingPayments.toString(), color: 'yellow' },
  { label: 'Total Transactions', value: payments.length.toString(), color: 'blue' },
];
```

---

### For Disputes Screens (e.g., BusinessMeetupDisputes.tsx)

**1. Add imports:**
```tsx
import { useDisputes, DisputeStatus } from '../../../../lib/hooks';
import { LoadingState } from '../../../ui/LoadingState';
import { ErrorState } from '../../../ui/ErrorState';
```

**2. Replace mock data:**
```tsx
const { disputes, loading, error, refetch, updateStatus, openDisputes } = useDisputes({
  serviceType: 'business-meetup',
  autoFetch: true
});
```

**3. Add dispute resolution handler:**
```tsx
const handleResolve = async (disputeId: string, resolution: string) => {
  try {
    await updateStatus(disputeId, 'resolved', resolution);
  } catch (err) {
    console.error('Failed to resolve dispute:', err);
  }
};
```

**4. Add loading/error states** (same pattern)

---

### For Settings Screens (e.g., BusinessMeetupSettings.tsx)

Settings screens manage pricing - these already work with local state. **No changes needed** unless you want to persist pricing to the backend.

If you want to add backend persistence:

**1. Create a new hook:**
```tsx
// /lib/hooks/usePricing.ts
export function usePricing(serviceType: ServiceType) {
  const [pricing, setPricing] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const fetchPricing = async () => {
    const response = await api.get(`pricing/${serviceType}`);
    setPricing(response.data);
  };
  
  const updatePricing = async (newPricing: any) => {
    await api.put(`pricing/${serviceType}`, newPricing);
  };
  
  return { pricing, loading, updatePricing };
}
```

---

## Code Templates

### Template 1: Basic Operations Screen Integration

```tsx
import React, { useState } from 'react';
import { useBookings, BookingStatus } from '../../../../lib/hooks';
import { LoadingState } from '../../../ui/LoadingState';
import { ErrorState } from '../../../ui/ErrorState';
// ... other imports

export function YourOperationsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch data with custom hook
  const { bookings, loading, error, refetch, updateStatus } = useBookings({
    serviceType: 'YOUR-SERVICE-TYPE', // 👈 Change this
    autoFetch: true
  });

  // Status update handler
  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      await updateStatus(bookingId, newStatus);
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  // Filter logic (keep your existing filtering)
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = searchQuery === '' || 
      booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.user_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate metrics from real data
  const metrics = {
    total: bookings.length,
    active: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        {/* Keep your header */}
        <LoadingState message="Loading bookings..." />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
        {/* Keep your header */}
        <ErrorState message={error} onRetry={refetch} />
      </div>
    );
  }

  // Main render (keep your existing UI, just update data sources)
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A0F1F]">
      {/* Your existing UI code */}
      {/* Just replace mock data references with 'bookings' variable */}
    </div>
  );
}
```

---

### Template 2: Payments Screen Integration

```tsx
import React, { useState } from 'react';
import { usePayments } from '../../../../lib/hooks';
import { LoadingState } from '../../../ui/LoadingState';
import { ErrorState } from '../../../ui/ErrorState';

export function YourPaymentsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { payments, loading, error, refetch, totalRevenue, pendingPayments } = usePayments({
    serviceType: 'YOUR-SERVICE-TYPE', // 👈 Change this
    autoFetch: true
  });

  const filteredPayments = payments.filter(payment => {
    // Your filtering logic
    return true;
  });

  const metrics = {
    totalRevenue,
    pendingPayments,
    completed: payments.filter(p => p.status === 'completed').length,
  };

  if (loading) return <LoadingState message="Loading payments..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      {/* Your existing UI */}
    </div>
  );
}
```

---

### Template 3: Disputes Screen Integration

```tsx
import React, { useState } from 'react';
import { useDisputes, DisputeStatus } from '../../../../lib/hooks';
import { LoadingState } from '../../../ui/LoadingState';
import { ErrorState } from '../../../ui/ErrorState';

export function YourDisputesScreen() {
  const { disputes, loading, error, refetch, updateStatus, openDisputes } = useDisputes({
    serviceType: 'YOUR-SERVICE-TYPE', // 👈 Change this
    autoFetch: true
  });

  const handleResolve = async (disputeId: string, resolution: string) => {
    try {
      await updateStatus(disputeId, 'resolved', resolution);
    } catch (err) {
      console.error('Failed to resolve dispute:', err);
    }
  };

  if (loading) return <LoadingState message="Loading disputes..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  return (
    <div>
      {/* Your existing UI */}
    </div>
  );
}
```

---

## Screen-by-Screen Checklist

### Rent-a-Friend Module
- [x] RentFriendOperations.tsx ✅ **DONE**
- [ ] RentFriendPayments.tsx
- [ ] RentFriendDisputes.tsx
- [ ] RentFriendSettings.tsx (optional)

### Blind Date Module
- [x] BlindDateOperations.tsx ✅ **DONE**
- [ ] BlindDatePayments.tsx
- [ ] BlindDateDisputes.tsx
- [ ] BlindDateSettings.tsx (optional)

### Business Meetup Module
- [ ] BusinessMeetupOperations.tsx
- [ ] BusinessMeetupPayments.tsx
- [ ] BusinessMeetupDisputes.tsx
- [ ] BusinessMeetupSettings.tsx (optional)

### P2P Match Module
- [ ] P2PMatchOperations.tsx
- [ ] P2PMatchPayments.tsx
- [ ] P2PMatchDisputes.tsx
- [ ] P2PMatchSettings.tsx (optional)

### Find Investor Module
- [ ] FindInvestorOperations.tsx
- [ ] FindInvestorPayments.tsx
- [ ] FindInvestorDisputes.tsx
- [ ] FindInvestorSettings.tsx (optional)

### Find Experienced People Module
- [ ] FindExperiencedOperations.tsx
- [ ] FindExperiencedPayments.tsx
- [ ] FindExperiencedDisputes.tsx
- [ ] FindExperiencedSettings.tsx (optional)

### Communications Module
- [x] Notifications.tsx ✅ **DONE**
- [ ] EmailLogs.tsx (optional)
- [ ] EmailTemplates.tsx (optional)
- [ ] Automations.tsx (optional)

---

## Testing Guide

### 1. Test Without Backend (Demo Mode)

The app works in demo mode without Supabase configured:

```bash
# Make sure .env has placeholder values or doesn't exist
npm run dev
```

- Login with: `admin@meetmymate.com` / `admin123`
- All screens should show empty state: "No bookings found"
- Loading states should show briefly
- No error messages should appear

### 2. Test With Backend

After configuring Supabase credentials:

```bash
# Restart dev server
npm run dev
```

**For each screen:**

1. **Navigation Test**
   - Click into the screen
   - Should show loading spinner
   - Should load data or show "No data found"

2. **Data Display Test**
   - Check that table columns match data structure
   - Verify dates format correctly
   - Check status badges display

3. **Action Test**
   - Try approving/rejecting a booking
   - Should update optimistically
   - Should persist on refresh

4. **Filter Test**
   - Search for items
   - Filter by status
   - Both should work together

5. **Error Handling Test**
   - Disconnect internet
   - Trigger an action
   - Should show error message
   - "Retry" button should work

---

## Common Issues & Solutions

### Issue: "No matching export"
**Solution:** Check import paths are correct relative to the file

### Issue: Data structure mismatch
**Solution:** Update interface definitions to match your backend response

### Issue: Actions don't update UI
**Solution:** Make sure you're using the hook's `updateStatus` function

### Issue: Loading never completes
**Solution:** Check Supabase Edge Functions are deployed and responding

### Issue: CORS errors
**Solution:** Add CORS headers to your Edge Functions

---

## Performance Tips

1. **Use `autoFetch: false`** for screens not immediately visible
2. **Implement pagination** for large datasets
3. **Add debouncing** to search inputs
4. **Cache responses** with React Query (optional enhancement)

---

## Next Steps

1. ✅ Environment configured
2. ✅ Hooks created
3. ✅ Examples done
4. 🔄 Integrate remaining 21 screens (3-5 hours)
5. 🔜 Test all screens
6. 🔜 Deploy to production

---

## Need Help?

- Check example screens: `BlindDateOperations.tsx`, `RentFriendOperations.tsx`, `Notifications.tsx`
- Review hook implementations: `/lib/hooks/`
- Check API layer: `/lib/admin-api.ts`
- Test Edge Functions in Supabase dashboard

Good luck with the integration! 🚀
