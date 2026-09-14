# Screen Integration Checklist

Use this checklist when integrating each screen with the backend.

## Template Pattern

Copy this pattern for every screen that needs backend integration:

```typescript
import React from 'react';
import { useApiData } from '../../lib/hooks/useApiData';
import { yourApiFunction } from '../../lib/admin-api'; // or user-api
import { LoadingState } from '../ui/LoadingState';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';

export function YourScreen() {
  // 1. Fetch data
  const { data, isLoading, error, refetch } = useApiData({
    fetchFn: yourApiFunction,
  });

  // 2. Loading state
  if (isLoading) {
    return <LoadingState message="Loading..." />;
  }

  // 3. Error state
  if (error) {
    return <ErrorState error={error} onRetry={refetch} />;
  }

  // 4. Empty state
  if (!data || data.length === 0) {
    return <EmptyState message="No items found" />;
  }

  // 5. Render data
  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  );
}
```

## Per-Screen Checklist

For each screen you integrate:

### ☐ 1. Identify Required API Function
- [ ] Check if function exists in `/lib/admin-api.ts` or `/lib/user-api.ts`
- [ ] If missing, add function following existing pattern
- [ ] Verify TypeScript types match backend response

### ☐ 2. Add Imports
```typescript
import { useApiData } from '../../lib/hooks/useApiData';
import { yourApiFunction } from '../../lib/admin-api';
import { LoadingState } from '../ui/LoadingState';
import { ErrorState } from '../ui/ErrorState';
import { EmptyState } from '../ui/EmptyState';
```

### ☐ 3. Replace Mock Data
- [ ] Remove hardcoded mock data arrays
- [ ] Replace with `useApiData` hook
- [ ] Pass correct API function to `fetchFn`

### ☐ 4. Add Loading State
```typescript
if (isLoading) {
  return <LoadingState message="Loading your items..." />;
}
```

### ☐ 5. Add Error State
```typescript
if (error) {
  return <ErrorState error={error} onRetry={refetch} />;
}
```

### ☐ 6. Add Empty State
```typescript
if (!data || data.length === 0) {
  return <EmptyState 
    message="No items found" 
    action={<button>Create New</button>}
  />;
}
```

### ☐ 7. Map Backend Data to UI
- [ ] Update property names to match backend response
- [ ] Handle null/undefined values safely
- [ ] Format dates/times from backend format
- [ ] Format currency/numbers appropriately

### ☐ 8. Add Mutations (if needed)
For create/update/delete actions:

```typescript
import { useMutation } from '../../lib/hooks/useApiData';

const createMutation = useMutation(yourCreateFunction);

const handleCreate = async (data) => {
  const result = await createMutation.mutate(data);
  if (result) {
    refetch(); // Refresh list
  }
};
```

### ☐ 9. Test the Screen
- [ ] Loading state shows on initial load
- [ ] Data displays correctly when loaded
- [ ] Empty state shows when no data
- [ ] Error state shows on network failure
- [ ] Retry button works in error state
- [ ] Create/Update actions refresh data
- [ ] Delete actions remove items from list

### ☐ 10. Handle Edge Cases
- [ ] Missing/null fields show "Not available"
- [ ] Long text truncates appropriately
- [ ] Dates/times format correctly for timezone
- [ ] Large lists paginate or scroll
- [ ] Filters work with backend

## Examples by Screen Type

### List Screens (Operations, Bookings, etc.)

```typescript
const { data: bookings, isLoading, error, refetch } = useApiData({
  fetchFn: () => adminListBookings({ status: statusFilter }),
  deps: [statusFilter], // Refetch when filter changes
});
```

### Detail Screens (View Booking, View Provider)

```typescript
const { data: booking, isLoading, error } = useApiData({
  fetchFn: () => adminViewBooking(bookingId),
  deps: [bookingId],
});
```

### Form Screens (Create, Edit)

```typescript
const createMutation = useMutation(adminCreateBooking);

const handleSubmit = async (formData) => {
  const result = await createMutation.mutate(formData);
  if (result) {
    navigate('success-screen');
  }
};

// Show error if mutation failed
{createMutation.error && (
  <ErrorState error={createMutation.error} />
)}
```

## Admin Portal Integration Order

Recommended order (easiest to hardest):

1. **Rent-a-Friend Operations** (simplest list view)
2. **Blind Date Operations** (similar pattern)
3. **Business Meetup Operations**
4. **P2P Match Operations**
5. **Find Investor Operations**
6. **Find Expert Operations**
7. **Payment screens** (all 6 services)
8. **Dispute screens** (all 6 services)
9. **Settings screens** (with price control)
10. **Communications** (4 screens)
11. **Reviews & Ratings** (3 screens)
12. **Dashboard** (aggregated data)

## User Portal Integration Order

1. **Notifications** (example already provided)
2. **My Bookings / Dashboard**
3. **Service Listing Screens** (Rent-a-Friend, Expert, P2P)
4. **Booking Creation Screens**
5. **Payment Screens**
6. **Profile Screen**

## Quality Checks

Before marking a screen as "done":

### Visual Check
- [ ] Loading spinner displays correctly
- [ ] Error message is readable and helpful
- [ ] Empty state is clear and actionable
- [ ] Data displays match design
- [ ] No layout shifts during loading

### Functional Check
- [ ] Data loads on mount
- [ ] Filters trigger refetch
- [ ] Actions (create/update/delete) work
- [ ] Errors display and can be retried
- [ ] Session expiry redirects to login

### Code Quality
- [ ] No hardcoded data remaining
- [ ] TypeScript types are correct
- [ ] No console errors
- [ ] API calls use proper error handling
- [ ] Loading states prevent double-clicks

## Time Estimates

| Screen Type | Estimated Time |
|------------|----------------|
| Simple list screen | 15-20 min |
| List with filters | 20-30 min |
| Detail/view screen | 15-25 min |
| Form/create screen | 30-45 min |
| Complex dashboard | 45-60 min |

## Pro Tips

1. **Start with Operations screens** - They're the simplest
2. **Copy from BlindDateOperations** - It's the reference implementation
3. **Test as you go** - Don't integrate all screens before testing
4. **Use TypeScript errors** - They'll catch API mismatches
5. **Check Network tab** - Verify API responses in DevTools
6. **Console log data** - See actual backend structure
7. **Handle nulls** - Use `item?.field || 'Not available'`
8. **Format consistently** - Dates, currency, status badges

## Troubleshooting

### "useApiData is not defined"
**Fix**: Import from `../../lib/hooks/useApiData`

### "Property doesn't exist on type"
**Fix**: Update TypeScript interface in admin-api.ts or user-api.ts

### "Data is undefined"
**Fix**: Add null check: `if (!data) return <LoadingState />`

### "Infinite re-renders"
**Fix**: Add proper dependency array to useApiData: `deps: [filter]`

### "401 on every request"
**Fix**: User not logged in, token expired, or wrong endpoint

---

**Goal**: All 50+ screens integrated with zero mock data  
**Strategy**: One screen at a time, following this checklist  
**Result**: Production-ready app with full backend integration
