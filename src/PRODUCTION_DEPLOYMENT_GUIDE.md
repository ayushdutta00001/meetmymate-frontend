# 🚀 Meet my Mate - Production Deployment Guide

## 📋 Overview

This guide will walk you through deploying your Meet my Mate platform to production with a fully configured Supabase backend. The entire process takes approximately 2-3 hours for a first-time deployment.

---

## 🎯 Prerequisites

Before you begin, ensure you have:

- [ ] A Supabase account (free tier works fine for development)
- [ ] A hosting account (Vercel, Netlify, or Cloudflare Pages)
- [ ] Node.js 18+ installed locally
- [ ] Git repository for your project
- [ ] Basic understanding of environment variables

---

## 📦 Phase 1: Supabase Backend Setup (60-90 minutes)

### Step 1: Create Supabase Project

1. **Go to** [supabase.com](https://supabase.com)
2. **Click** "New Project"
3. **Fill in**:
   - Project name: `meet-my-mate` (or your choice)
   - Database password: (save this securely!)
   - Region: Choose closest to your target users
4. **Wait** for project to be provisioned (~2 minutes)

### Step 2: Set Up Database Schema

1. **Navigate to**: SQL Editor in Supabase dashboard
2. **Create a new query**
3. **Copy and paste** the entire contents of `/supabase-migrations.sql`
4. **Click** "Run" to execute the migration
5. **Verify**: Check the "Table Editor" to see all tables created

**Tables that should be created:**
- ✅ users
- ✅ providers
- ✅ bookings
- ✅ p2p_meetings
- ✅ payments
- ✅ disputes
- ✅ notifications
- ✅ reviews
- ✅ pricing
- ✅ messages
- ✅ email_templates
- ✅ email_logs
- ✅ automations
- ✅ audit_logs

### Step 3: Configure Authentication

1. **Go to**: Authentication → Settings
2. **Enable Email Authentication**:
   - Go to Authentication → Providers
   - Enable "Email"
   - Configure email templates (optional)

3. **Enable Phone Authentication** (optional):
   - Go to Authentication → Providers
   - Enable "Phone"
   - Configure Twilio credentials if using SMS

4. **Configure Redirect URLs**:
   - Add your production domain (e.g., `https://meetmymate.com`)
   - Add localhost for development: `http://localhost:5173`

5. **Create Admin User**:
   ```sql
   -- Run this in SQL Editor
   INSERT INTO auth.users (
     email,
     encrypted_password,
     email_confirmed_at,
     raw_user_meta_data
   ) VALUES (
     'admin@meetmymate.com',
     crypt('your-secure-admin-password', gen_salt('bf')),
     NOW(),
     '{"role": "admin"}'::jsonb
   );
   ```

### Step 4: Get API Credentials

1. **Go to**: Settings → API
2. **Copy these values** (you'll need them later):
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGci...` (long string)
3. **Save** these securely - you'll need them for deployment

### Step 5: Deploy Edge Functions

**Note**: Edge Functions are optional for MVP. The app works in demo mode without them. For production with real data, you'll need to deploy Edge Functions.

Create a `/supabase/functions/` directory with these Edge Functions:

**Required Edge Functions:**
1. `admin_list_bookings` - List all bookings by service type
2. `admin_view_booking` - Get booking details
3. `admin_update_booking` - Update booking status
4. `admin_list_providers` - List all service providers
5. `admin_list_payments` - List payment transactions
6. `admin_list_disputes` - List disputes
7. `notifications` - Get user notifications

**To deploy Edge Functions** (after creating them):
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy all functions
supabase functions deploy admin_list_bookings
supabase functions deploy admin_view_booking
# ... repeat for all functions
```

**Alternative**: Start in demo mode and implement Edge Functions gradually as needed.

---

## 🌐 Phase 2: Frontend Deployment (30-45 minutes)

### Option A: Deploy to Vercel (Recommended)

#### Step 1: Prepare Repository

1. **Ensure** your code is pushed to GitHub/GitLab/Bitbucket
2. **Verify** `.gitignore` includes `.env` file

#### Step 2: Connect to Vercel

1. **Go to**: [vercel.com](https://vercel.com)
2. **Click**: "Add New Project"
3. **Import** your Git repository
4. **Configure**:
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

#### Step 3: Add Environment Variables

In Vercel project settings:
1. **Go to**: Settings → Environment Variables
2. **Add** the following variables:
   ```
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key-here
   ```
3. **Apply to**: Production, Preview, and Development

#### Step 4: Deploy

1. **Click**: "Deploy"
2. **Wait**: ~2-3 minutes for build
3. **Visit**: Your deployment URL (e.g., `https://meet-my-mate.vercel.app`)

#### Step 5: Configure Custom Domain (Optional)

1. **Go to**: Settings → Domains
2. **Add** your custom domain
3. **Update** DNS records as instructed
4. **Wait** for SSL certificate to provision

---

### Option B: Deploy to Netlify

#### Step 1: Connect Repository

1. **Go to**: [netlify.com](https://netlify.com)
2. **Click**: "Add new site" → "Import an existing project"
3. **Connect** your Git provider
4. **Select** your repository

#### Step 2: Configure Build Settings

- Build command: `npm run build`
- Publish directory: `dist`
- The `netlify.toml` file will be automatically detected

#### Step 3: Add Environment Variables

1. **Go to**: Site Settings → Environment Variables
2. **Add**:
   ```
   VITE_SUPABASE_URL = https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY = your-anon-key-here
   ```

#### Step 4: Deploy

1. **Click**: "Deploy site"
2. **Wait** for deployment to complete
3. **Visit** your site URL

---

### Option C: Deploy to Cloudflare Pages

#### Step 1: Connect to Cloudflare

1. **Go to**: [dash.cloudflare.com](https://dash.cloudflare.com)
2. **Navigate to**: Workers & Pages
3. **Click**: "Create application" → "Pages"
4. **Connect** to Git

#### Step 2: Configure Build

- Build command: `npm run build`
- Build output directory: `dist`
- Framework: Vite

#### Step 3: Add Environment Variables

1. **Go to**: Settings → Environment Variables
2. **Add** Supabase credentials

#### Step 4: Deploy

- Cloudflare will automatically deploy on each push

---

## ✅ Phase 3: Post-Deployment Verification (15-30 minutes)

### Critical Tests

Run through these tests after deployment:

#### 1. Admin Portal Tests

- [ ] Navigate to `https://your-domain.com?admin=true`
- [ ] Login with admin credentials
- [ ] Verify dashboard loads
- [ ] Check all 6 service modules are accessible
- [ ] Test Operations screens load data (or show empty states)
- [ ] Test Payments screens display correctly
- [ ] Test Communications section works
- [ ] Test Reviews & Ratings section works
- [ ] Verify Fixed Price Control Panel loads

#### 2. User Portal Tests

- [ ] Navigate to main app `https://your-domain.com`
- [ ] Test sign-up flow
- [ ] Test sign-in flow
- [ ] Navigate through all services
- [ ] Test booking flow (with demo data)
- [ ] Verify profile screens work
- [ ] Test dark mode toggle
- [ ] Verify mobile responsiveness

#### 3. Technical Checks

- [ ] Open browser console - no critical errors
- [ ] Check Network tab - API calls are working
- [ ] Verify all images load
- [ ] Test on multiple browsers (Chrome, Firefox, Safari)
- [ ] Test on mobile devices (iOS and Android)
- [ ] Verify HTTPS is working
- [ ] Test performance (< 3 second page load)

#### 4. Demo Mode Verification

If starting without Edge Functions:
- [ ] Verify Demo Mode banner appears
- [ ] Confirm admin login works with `admin@meetmymate.com` / `admin123`
- [ ] Verify all screens display mock data
- [ ] Confirm no real API calls fail

---

## 🔒 Phase 4: Security & Optimization (30 minutes)

### Security Checklist

1. **Row Level Security (RLS)**:
   - ✅ Already enabled in migration script
   - Verify policies are working in Supabase Dashboard

2. **Admin Access**:
   - [ ] Create secure admin credentials (not default ones)
   - [ ] Store admin credentials in password manager
   - [ ] Enable 2FA for admin accounts

3. **API Security**:
   - [ ] Verify RLS policies prevent unauthorized access
   - [ ] Test that users can only see their own data
   - [ ] Ensure admin-only endpoints require admin role

4. **Environment Variables**:
   - [ ] Confirm `.env` is in `.gitignore`
   - [ ] Verify no secrets in code
   - [ ] Rotate any exposed keys

### Performance Optimization

1. **Enable Caching**:
   - Vercel/Netlify automatically cache assets
   - Verify `Cache-Control` headers are set

2. **Monitor Performance**:
   - Use Lighthouse to test performance
   - Aim for 90+ score on Performance
   - Check Core Web Vitals

3. **Database Optimization**:
   - Indexes are already created in migration
   - Monitor slow queries in Supabase dashboard

---

## 📊 Phase 5: Monitoring & Maintenance

### Set Up Monitoring

1. **Supabase Monitoring**:
   - Go to Supabase Dashboard → Database
   - Enable database logs
   - Set up email alerts for high usage

2. **Application Monitoring**:
   - Consider adding Sentry for error tracking
   - Set up Google Analytics (optional)
   - Use Vercel Analytics (if on Vercel)

3. **Uptime Monitoring**:
   - Use UptimeRobot (free tier)
   - Set up alerts for downtime

### Regular Maintenance

**Weekly**:
- [ ] Check error logs
- [ ] Review user activity
- [ ] Monitor database size

**Monthly**:
- [ ] Review and optimize database queries
- [ ] Check for security updates
- [ ] Backup database (Supabase has automatic backups)
- [ ] Review and update pricing

---

## 🆘 Troubleshooting

### Common Issues

#### Issue: "Cannot connect to Supabase"

**Symptoms**: Errors in console, demo mode banner shows
**Solution**:
1. Verify environment variables are set correctly
2. Check Supabase project is active
3. Confirm API credentials are correct
4. Restart deployment/dev server

#### Issue: "401 Unauthorized" errors

**Symptoms**: Login fails, API calls return 401
**Solution**:
1. Check admin user was created with correct role
2. Verify RLS policies allow admin access
3. Confirm JWT token includes role metadata
4. Check if session expired - try logging in again

#### Issue: Tables not created

**Symptoms**: SQL migration fails, tables missing
**Solution**:
1. Run migration script again
2. Check for SQL errors in Supabase logs
3. Verify UUID extension is enabled
4. Manually create tables if needed

#### Issue: Build fails on deployment

**Symptoms**: Vercel/Netlify build errors
**Solution**:
1. Check Node.js version (should be 18+)
2. Verify all dependencies are in package.json
3. Run `npm run build` locally to test
4. Check build logs for specific errors

#### Issue: Styles not loading

**Symptoms**: App looks broken, no colors
**Solution**:
1. Verify Tailwind CSS is installed
2. Check `/styles/globals.css` exists
3. Clear cache and redeploy
4. Verify build process includes CSS

---

## 🚦 Deployment Status Checklist

Use this checklist to track your progress:

### Backend Setup
- [ ] Supabase project created
- [ ] Database schema migrated
- [ ] Admin user created
- [ ] Authentication configured
- [ ] API credentials obtained
- [ ] Row Level Security enabled

### Frontend Deployment
- [ ] Code pushed to Git repository
- [ ] Hosting platform connected
- [ ] Environment variables set
- [ ] Build configuration verified
- [ ] First deployment successful
- [ ] Custom domain configured (optional)

### Testing & Verification
- [ ] Admin portal accessible
- [ ] User portal accessible
- [ ] Authentication working
- [ ] All pages load correctly
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Performance acceptable

### Security & Optimization
- [ ] Admin credentials secured
- [ ] RLS policies verified
- [ ] Environment variables hidden
- [ ] HTTPS enabled
- [ ] Monitoring set up

### Production Ready
- [ ] All tests passing
- [ ] Documentation updated
- [ ] Backup strategy in place
- [ ] Support contacts documented
- [ ] Launch announcement prepared

---

## 🎉 Going Live

When all checkboxes above are complete:

1. **Announce** to your team that the platform is live
2. **Share** the URL with initial users
3. **Monitor** closely for the first 24-48 hours
4. **Be prepared** to rollback if critical issues arise
5. **Celebrate** your successful deployment! 🎊

---

## 📞 Support & Resources

### Documentation
- `/DEPLOYMENT_CHECKLIST.md` - Detailed technical checklist
- `/BACKEND_INTEGRATION_GUIDE.md` - Backend integration patterns
- `/ENVIRONMENT_SETUP.md` - Environment variable setup
- `/API_REFERENCE.md` - Complete API documentation

### External Resources
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Vite Documentation](https://vitejs.dev)

### Emergency Rollback

If you need to rollback:

**Vercel**:
```bash
vercel rollback
```

**Netlify**:
- Go to Deploys tab
- Click on previous deployment
- Click "Publish deploy"

**Database**:
- Supabase has automatic backups
- Go to Database → Backups to restore

---

## 🎯 Next Steps After Deployment

1. **Implement Edge Functions** (if not done yet)
2. **Add real payment gateway** (Stripe/Razorpay)
3. **Set up email service** (SendGrid/AWS SES)
4. **Implement SMS notifications** (Twilio)
5. **Add analytics and tracking**
6. **Create user onboarding flow**
7. **Build admin dashboard analytics**
8. **Implement real-time chat** (Supabase Realtime)

---

**Last Updated**: January 14, 2026
**Version**: 1.0.0

**Good luck with your deployment! 🚀**
