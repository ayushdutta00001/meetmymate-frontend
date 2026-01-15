# Testing Guide for Meet My Mate Admin Portal

Complete testing procedures and error handling documentation for the backend-integrated admin portal.

## 📋 Table of Contents

1. [Testing Overview](#testing-overview)
2. [Pre-Integration Testing](#pre-integration-testing)
3. [Post-Integration Testing](#post-integration-testing)
4. [Error Handling Patterns](#error-handling-patterns)
5. [Edge Cases](#edge-cases)
6. [Performance Testing](#performance-testing)
7. [Security Testing](#security-testing)

---

## Testing Overview

### Testing Philosophy

Every screen must be tested in **3 modes**:

1. **Demo Mode** - No backend configured (mock data)
2. **Empty State** - Backend configured, no data
3. **Production Mode** - Backend configured with real data

---

## Pre-Integration Testing

### Step 1: Demo Mode Testing

**Goal:** Verify app works without Supabase configured

**Setup:**
```bash
# Remove or use placeholder .env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Test Checklist:**

- [ ] App loads without errors
- [ ] Admin login works with demo credentials:
  - Email: `admin@meetmymate.com`
  - Password: `admin123`
- [ ] All screens are accessible via navigation
- [ ] No console errors (warnings are OK)
- [ ] Empty states show appropriate messages

**Expected Behavior:**
- Login succeeds immediately
- All screens show "No data found" or empty tables
- No loading spinners hang indefinitely
- No error alerts appear

---

## Post-Integration Testing

### Step 2: Backend Connection Testing

**Goal:** Verify Supabase connection works

**Setup:**
```bash
# Use real Supabase credentials in .env
VITE_SUPABASE_URL=https://your-real-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...your-real-key
```

**Test Checklist:**

**Authentication:**
- [ ] Admin login with real credentials succeeds
- [ ] Login with wrong password fails gracefully
- [ ] Session persists on page refresh
- [ ] Logout clears session
- [ ] Expired session redirects to login

**API Connectivity:**
- [ ] Check browser Network tab for API calls
- [ ] Verify requests go to correct Supabase URL
- [ ] Confirm Authorization headers are present
- [ ] Check for proper error responses (not 404s)

---

### Step 3: Screen-by-Screen Functional Testing

For **each integrated screen**, test the following:

#### A. Data Loading

**Test Cases:**
1. **Initial Load**
   - [ ] Loading spinner appears
   - [ ] Data loads within 5 seconds
   - [ ] Loading spinner disappears
   - [ ] Data renders correctly

2. **Empty State**
   - [ ] Shows friendly "No data found" message
   - [ ] No broken table layouts
   - [ ] Metrics show "0" instead of errors

3. **Large Dataset**
   - [ ] Pagination works (if implemented)
   - [ ] Table scrolls smoothly
   - [ ] No performance degradation

#### B. Search & Filtering

**Test Cases:**
1. **Search Functionality**
   - [ ] Can search by ID
   - [ ] Can search by name
   - [ ] Can search by email
   - [ ] Search is case-insensitive
   - [ ] Empty search shows all results
   - [ ] No results shows appropriate message

2. **Filter Functionality**
   - [ ] Status filter works
   - [ ] City/location filter works (if applicable)
   - [ ] Multiple filters work together
   - [ ] Reset filters shows all data

3. **Combined Search + Filter**
   - [ ] Search + filter work together
   - [ ] Results update correctly
   - [ ] Count updates correctly

#### C. Actions & Updates

**Test Cases:**

1. **Operations Screens:**
   - [ ] Approve booking → status updates to "confirmed"
   - [ ] Reject booking → status updates to "cancelled"
   - [ ] Cancel active booking → status updates
   - [ ] View booking details (if implemented)
   - [ ] UI updates optimistically
   - [ ] Refresh shows persisted changes

2. **Payments Screens:**
   - [ ] Filter by payment status
   - [ ] View transaction details
   - [ ] Metrics calculate correctly
   - [ ] Export function works (if implemented)

3. **Disputes Screens:**
   - [ ] Resolve dispute → status updates to "resolved"
   - [ ] Add resolution note
   - [ ] Close dispute
   - [ ] Filter by dispute type
   - [ ] Open disputes count updates

4. **Notifications:**
   - [ ] Mark as read → status updates
   - [ ] Unread count decreases
   - [ ] Clicking notification marks it read
   - [ ] Filter by read/unread status

---

### Step 4: Error Handling Testing

**Goal:** Verify app handles errors gracefully

#### Network Errors

**Test Cases:**
1. **Offline Mode**
   - [ ] Disconnect internet
   - [ ] Try to load a screen
   - [ ] Should show error message
   - [ ] "Retry" button should work when reconnected

2. **Slow Connection**
   - [ ] Throttle network to 3G
   - [ ] Loading spinner should show longer
   - [ ] Should eventually load or timeout
   - [ ] No blank screens

3. **API Timeout**
   - [ ] If request takes >30s
   - [ ] Should show timeout error
   - [ ] Should offer retry option

#### Authentication Errors

**Test Cases:**
1. **Session Expiration**
   - [ ] Manually clear access token
   - [ ] Try to perform action
   - [ ] Should redirect to login
   - [ ] Should show "Session expired" message

2. **Invalid Token**
   - [ ] Set invalid token in sessionStorage
   - [ ] Try to access screen
   - [ ] Should handle gracefully
   - [ ] Should redirect to login

3. **Insufficient Permissions**
   - [ ] Login as non-admin user (if applicable)
   - [ ] Try to access admin screen
   - [ ] Should show "Access denied" message

#### Data Errors

**Test Cases:**
1. **Malformed Response**
   - [ ] Backend returns invalid JSON
   - [ ] Should show error message
   - [ ] Should not crash the app

2. **Missing Fields**
   - [ ] Backend returns data with missing fields
   - [ ] Should handle gracefully
   - [ ] Should show "N/A" or default values

3. **Type Mismatches**
   - [ ] Backend returns wrong data type
   - [ ] Should not crash
   - [ ] Should show error or fallback

---

## Error Handling Patterns

### Pattern 1: Loading State

**Implementation:**
```tsx
if (loading) {
  return <LoadingState message="Loading bookings..." />;
}
```

**What to Test:**
- [ ] Spinner is visible
- [ ] Message is clear
- [ ] Page layout doesn't shift
- [ ] Loading doesn't hang forever

---

### Pattern 2: Error State

**Implementation:**
```tsx
if (error) {
  return <ErrorState message={error} onRetry={refetch} />;
}
```

**What to Test:**
- [ ] Error message is user-friendly
- [ ] Retry button is visible
- [ ] Retry button works
- [ ] Error doesn't expose sensitive info

---

### Pattern 3: Empty State

**Implementation:**
```tsx
{filteredData.length === 0 && (
  <div className="text-center py-12 text-gray-500">
    No bookings found
  </div>
)}
```

**What to Test:**
- [ ] Message is helpful
- [ ] Suggests next steps (if applicable)
- [ ] Layout looks intentional, not broken

---

### Pattern 4: Optimistic Updates

**Implementation:**
```tsx
const handleUpdate = async (id, status) => {
  try {
    await updateStatus(id, status);
    // UI already updated by hook
  } catch (err) {
    console.error('Update failed:', err);
    // Hook reverts on error
  }
};
```

**What to Test:**
- [ ] UI updates immediately
- [ ] If network fails, reverts to original
- [ ] Shows error if update fails
- [ ] Refresh shows correct state

---

## Edge Cases

### Edge Case 1: Rapid Actions

**Scenario:** User clicks multiple action buttons quickly

**Test:**
- [ ] Click "Approve" 5 times rapidly
- [ ] Should only send one request
- [ ] Button should disable during request
- [ ] Should not cause duplicate updates

**Fix:** Add loading state to buttons
```tsx
<button 
  disabled={isUpdating}
  onClick={handleUpdate}
>
  {isUpdating ? 'Updating...' : 'Approve'}
</button>
```

---

### Edge Case 2: Special Characters in Search

**Scenario:** User searches with special characters

**Test:**
- [ ] Search for `admin@example.com`
- [ ] Search for `O'Brien`
- [ ] Search for `Test & Co.`
- [ ] Should not cause errors
- [ ] Should find matching results

---

### Edge Case 3: Very Long Text

**Scenario:** Database has very long strings

**Test:**
- [ ] Booking with 500-character notes
- [ ] Email with very long address
- [ ] Should truncate gracefully
- [ ] Should not break layout
- [ ] Should show full text on hover/click (if implemented)

---

### Edge Case 4: Date/Time Edge Cases

**Scenario:** Various date formats and timezones

**Test:**
- [ ] Booking from different timezone
- [ ] Date in the past
- [ ] Date far in the future
- [ ] Invalid date format
- [ ] Should display correctly
- [ ] Should sort correctly

---

## Performance Testing

### Metric Goals

- **Initial Load:** < 3 seconds
- **Navigation:** < 1 second
- **Search:** < 500ms
- **Filter:** < 500ms
- **Action Update:** < 2 seconds

### Load Testing

**Test with increasing data sizes:**

1. **Small Dataset (< 50 items)**
   - [ ] Loads instantly
   - [ ] Smooth scrolling
   - [ ] No lag

2. **Medium Dataset (50-500 items)**
   - [ ] Loads in < 3s
   - [ ] Pagination recommended
   - [ ] Search still fast

3. **Large Dataset (500+ items)**
   - [ ] Pagination required
   - [ ] Consider virtual scrolling
   - [ ] Backend pagination ideal

---

## Security Testing

### Test Cases

1. **XSS Prevention**
   - [ ] Try injecting `<script>alert('XSS')</script>` in search
   - [ ] Should display as text, not execute

2. **SQL Injection Prevention**
   - [ ] Try `'; DROP TABLE users; --` in search
   - [ ] Backend should sanitize (test in Supabase logs)

3. **Authorization**
   - [ ] Cannot access admin without login
   - [ ] Cannot perform actions without valid token
   - [ ] Token expires after reasonable time

4. **Sensitive Data**
   - [ ] Passwords never logged
   - [ ] API keys never exposed in browser
   - [ ] Error messages don't leak system info

---

## Testing Checklist Summary

### For Each Screen:

- [ ] Works in demo mode (no backend)
- [ ] Works with empty data
- [ ] Works with real data
- [ ] Loading state appears correctly
- [ ] Error state handles all error types
- [ ] Empty state is user-friendly
- [ ] Search works
- [ ] Filters work
- [ ] Actions update data
- [ ] Optimistic updates work
- [ ] Refresh shows persisted changes
- [ ] No console errors
- [ ] Responsive on mobile (if applicable)
- [ ] Accessible (keyboard navigation)
- [ ] No sensitive data leaks

---

## Automated Testing (Optional Future Enhancement)

Consider adding these automated tests:

```tsx
// Example with React Testing Library
import { render, screen, waitFor } from '@testing-library/react';
import { BlindDateOperations } from './BlindDateOperations';

test('loads and displays bookings', async () => {
  render(<BlindDateOperations />);
  
  // Check loading state
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
  
  // Wait for data
  await waitFor(() => {
    expect(screen.getByText(/booking id/i)).toBeInTheDocument();
  });
});

test('handles errors gracefully', async () => {
  // Mock API to return error
  mockApiError();
  
  render(<BlindDateOperations />);
  
  await waitFor(() => {
    expect(screen.getByText(/error/i)).toBeInTheDocument();
    expect(screen.getByText(/retry/i)).toBeInTheDocument();
  });
});
```

---

## Reporting Issues

When reporting bugs, include:

1. **Screen:** Which admin screen
2. **Action:** What you were doing
3. **Expected:** What should happen
4. **Actual:** What actually happened
5. **Console:** Any errors in browser console
6. **Network:** Check Network tab for failed requests
7. **Steps:** How to reproduce

---

## Success Criteria

Integration is complete when:

✅ All 27 screens accessible  
✅ All screens load data correctly  
✅ All actions persist to backend  
✅ All errors handled gracefully  
✅ No console errors in production  
✅ Performance meets goals  
✅ Security requirements met  

---

**Good luck with testing! 🧪**
