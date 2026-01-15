# Quick Start: Backend Integration

## 5-Minute Setup

### 1. Set Environment Variables (1 min)

Create `.env` in project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Get these from: **Supabase Dashboard → Project Settings → API**

### 2. Restart Dev Server (1 min)

```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

### 3. Test Login (3 min)

1. Navigate to admin portal
2. Try logging in with your Supabase credentials
3. Check browser console for any errors
4. If successful, JWT token will be in sessionStorage

## Verify It's Working

### Quick Test

Open browser console and run:

```javascript
// Check if token is stored
console.log(sessionStorage.getItem('access_token'));

// If you see a JWT token, auth is working! ✅
```

### Test API Call

Try viewing a screen that fetches data:
- Admin Portal → Blind Date → Operations

If you see:
- ✅ Loading spinner → API call started
- ✅ Data or "No bookings" → Backend connected!
- ❌ Error message → Check error, usually auth or CORS

## Common Issues

### "Environment variables not found"
**Fix**: Create `.env` file, restart dev server

### "401 Unauthorized"
**Fix**: Check Supabase credentials, ensure user exists

### "CORS error"
**Fix**: Update CORS headers in Edge Functions

### "Network error"
**Fix**: Check Supabase URL is correct

## What's Next?

Now that basic setup works:

1. **Review** `BACKEND_INTEGRATION_GUIDE.md` for details
2. **Check** `BACKEND_INTEGRATION_SUMMARY.md` for status
3. **Follow** patterns in `BlindDateOperations.tsx` 
4. **Integrate** remaining screens one by one

## Need Help?

1. ✅ Auth working but no data? → Check Edge Function responses
2. ✅ Getting 403 errors? → Verify user has correct role
3. ✅ Data not updating? → Check response format: `{ success, data, error }`

---

**Time to full integration**: 1-2 days  
**Your frontend**: ✅ 100% ready  
**Your backend**: Just needs to be connected!
