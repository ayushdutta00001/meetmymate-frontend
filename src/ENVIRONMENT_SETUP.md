# Environment Setup Guide

## Quick Start

### Step 1: Get Supabase Credentials

1. **Create a Supabase Project** (if you haven't already):
   - Go to [supabase.com](https://supabase.com)
   - Click "Start your project"
   - Sign in and create a new project

2. **Get Your API Credentials**:
   - Open your project dashboard
   - Go to **Settings** → **API**
   - Copy the following values:
     - **Project URL** (e.g., `https://abcdefghij.supabase.co`)
     - **anon public** key (starts with `eyJhb...`)

### Step 2: Configure Environment Variables

1. **Copy the example file**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** with your actual credentials:
   ```env
   VITE_SUPABASE_URL=https://your-actual-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

3. **Save the file**

### Step 3: Restart Dev Server

```bash
# Stop your dev server (Ctrl+C)
# Then restart it
npm run dev
```

---

## Testing the Connection

### Admin Portal Login
After configuring your environment:

1. Navigate to the admin portal
2. Try logging in with credentials from your Supabase Auth users
3. Check browser console for any authentication errors

### Demo Mode (Without Backend)
If you don't configure the environment variables, the app runs in demo mode:
- Admin login: `admin@meetmymate.com` / `admin123`
- All data is mock/local only
- No persistence between sessions

---

## Supabase Backend Requirements

Your Supabase project should have these Edge Functions deployed:

### Required Edge Functions:

1. **auth-login** - Handles user/admin authentication
2. **blind-date-bookings** - Manages blind date operations
3. **rent-friend-bookings** - Manages rent-a-friend operations
4. **business-meetup-bookings** - Manages business meetup operations
5. **p2p-match-bookings** - Manages P2P match operations
6. **find-investor-bookings** - Manages find investor operations
7. **find-experienced-bookings** - Manages find experienced operations
8. **payments** - Handles payment processing
9. **disputes** - Manages dispute resolution
10. **communications** - Handles messaging system

### Database Tables Required:

- `bookings` - All booking records
- `users` - User accounts
- `providers` - Service providers
- `payments` - Payment transactions
- `disputes` - Dispute cases
- `messages` - Communication records
- `reviews` - User reviews and ratings
- `pricing` - Fixed price control settings

---

## Environment Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` | Yes (for production) |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGci...` | Yes (for production) |

---

## Troubleshooting

### Error: "Cannot read properties of undefined (reading 'VITE_SUPABASE_URL')"
- **Solution**: Make sure your `.env` file exists and contains the variables
- **Solution**: Restart your dev server after creating/editing `.env`

### Login fails with "Session expired"
- **Solution**: Check that your Supabase URL and anon key are correct
- **Solution**: Verify your Edge Functions are deployed and working

### Data not loading
- **Solution**: Check browser console for API errors
- **Solution**: Verify Edge Functions are returning data in the correct format
- **Solution**: Check Supabase logs for backend errors

### CORS errors
- **Solution**: Ensure your Edge Functions have proper CORS headers
- **Solution**: Add your localhost and production domains to allowed origins

---

## Security Best Practices

✅ **DO**:
- Keep `.env` file in `.gitignore`
- Use environment variables in production
- Rotate keys if they're ever exposed
- Use Row Level Security (RLS) in Supabase

❌ **DON'T**:
- Commit `.env` to version control
- Share your anon key publicly (it's client-safe but still)
- Use the same credentials for dev and production
- Store sensitive data without encryption

---

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. **Don't use `.env` files** - Use platform environment variables
2. **Set variables in your hosting dashboard**:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Build & Deploy → Environment
3. **Redeploy** after adding environment variables

---

## Need Help?

- Check Supabase docs: https://supabase.com/docs
- Verify Edge Functions are deployed correctly
- Check browser console for detailed error messages
- Review Supabase logs for backend errors
