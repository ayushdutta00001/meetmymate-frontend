-- ============================================================================
-- Meet my Mate - Supabase Database Schema
-- ============================================================================
-- This file contains all SQL migrations needed to set up the database
-- Run this in your Supabase SQL Editor: https://app.supabase.com/project/_/sql
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- USERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  full_name TEXT,
  profile_picture TEXT,
  date_of_birth DATE,
  gender TEXT,
  bio TEXT,
  location TEXT,
  role TEXT DEFAULT 'user', -- 'user' or 'admin'
  status TEXT DEFAULT 'active', -- 'active', 'suspended', 'banned'
  verification_status TEXT DEFAULT 'unverified', -- 'unverified', 'pending', 'verified'
  id_document_url TEXT,
  selfie_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PROVIDERS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.providers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL, -- 'rent_friend', 'blind_date', 'business_meetup', 'p2p_match', 'find_investor', 'find_experienced'
  display_name TEXT,
  hourly_rate NUMERIC(10,2),
  description TEXT,
  specialties TEXT[],
  availability JSONB,
  rating NUMERIC(3,2) DEFAULT 0,
  total_bookings INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'suspended'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- BOOKINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY DEFAULT 'BK' || LPAD(nextval('bookings_seq')::TEXT, 8, '0'),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  provider_id UUID REFERENCES public.providers(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  duration INTEGER, -- in minutes
  location TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'completed', 'cancelled'
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
  amount NUMERIC(10,2) NOT NULL,
  notes TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sequence for booking IDs
CREATE SEQUENCE IF NOT EXISTS bookings_seq START 1;

-- ============================================================================
-- P2P MEETINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.p2p_meetings (
  id TEXT PRIMARY KEY DEFAULT 'P2P' || LPAD(nextval('p2p_meetings_seq')::TEXT, 8, '0'),
  requester_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  peer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  service_type TEXT DEFAULT 'p2p_match',
  status TEXT DEFAULT 'pending', -- 'pending', 'accepted', 'rejected', 'scheduled', 'completed', 'cancelled'
  meeting_date DATE,
  meeting_time TIME,
  meeting_location TEXT,
  duration INTEGER, -- in minutes
  purpose TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sequence for P2P meeting IDs
CREATE SEQUENCE IF NOT EXISTS p2p_meetings_seq START 1;

-- ============================================================================
-- PAYMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY DEFAULT 'PAY' || LPAD(nextval('payments_seq')::TEXT, 8, '0'),
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'refunded'
  payment_method TEXT,
  transaction_id TEXT UNIQUE,
  gateway_response JSONB,
  refund_amount NUMERIC(10,2),
  refund_reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create sequence for payment IDs
CREATE SEQUENCE IF NOT EXISTS payments_seq START 1;

-- ============================================================================
-- DISPUTES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.disputes (
  id TEXT PRIMARY KEY DEFAULT 'DIS' || LPAD(nextval('disputes_seq')::TEXT, 8, '0'),
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE SET NULL,
  reporter_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reported_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  service_type TEXT NOT NULL,
  dispute_type TEXT NOT NULL, -- 'no_show', 'misconduct', 'refund_request', 'other'
  status TEXT DEFAULT 'open', -- 'open', 'investigating', 'resolved', 'closed'
  description TEXT NOT NULL,
  evidence_urls TEXT[],
  resolution TEXT,
  resolved_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Create sequence for dispute IDs
CREATE SEQUENCE IF NOT EXISTS disputes_seq START 1;

-- ============================================================================
-- NOTIFICATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT DEFAULT 'info', -- 'info', 'success', 'warning', 'error'
  link TEXT,
  read_status TEXT DEFAULT 'unread', -- 'unread', 'read'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- REVIEWS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE CASCADE,
  reviewer_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewee_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  service_type TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  is_flagged BOOLEAN DEFAULT FALSE,
  flagged_reason TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'hidden', 'deleted'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- PRICING TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.pricing (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  service_type TEXT UNIQUE NOT NULL,
  service_name TEXT NOT NULL,
  base_price NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  pricing_model TEXT DEFAULT 'per_hour', -- 'per_hour', 'per_session', 'flat_rate'
  description TEXT,
  updated_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- MESSAGES TABLE (for chat functionality)
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id TEXT REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  receiver_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  message_text TEXT NOT NULL,
  attachment_url TEXT,
  read_status TEXT DEFAULT 'unread',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- EMAIL TEMPLATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  template_name TEXT UNIQUE NOT NULL,
  subject TEXT NOT NULL,
  body_html TEXT NOT NULL,
  variables JSONB, -- List of available variables like {{user_name}}, {{booking_id}}
  category TEXT, -- 'booking', 'verification', 'payment', 'notification'
  status TEXT DEFAULT 'active', -- 'active', 'draft', 'archived'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- EMAIL LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recipient_email TEXT NOT NULL,
  template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
  subject TEXT NOT NULL,
  status TEXT DEFAULT 'sent', -- 'sent', 'delivered', 'bounced', 'failed'
  error_message TEXT,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AUTOMATIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.automations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  automation_name TEXT UNIQUE NOT NULL,
  trigger_event TEXT NOT NULL, -- 'booking_confirmed', 'payment_received', etc.
  action_type TEXT NOT NULL, -- 'send_email', 'send_notification', 'update_status'
  template_id UUID REFERENCES public.email_templates(id) ON DELETE SET NULL,
  delay_minutes INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'archived'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- AUDIT LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL, -- 'created', 'updated', 'deleted'
  entity_type TEXT NOT NULL, -- 'booking', 'user', 'payment', etc.
  entity_id TEXT NOT NULL,
  changes JSONB, -- Store the changes made
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.p2p_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin policies (allow admins to view/modify everything)
CREATE POLICY "Admins have full access to users"
  ON public.users
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to bookings"
  ON public.bookings
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to payments"
  ON public.payments
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to disputes"
  ON public.disputes
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- User policies (users can only see their own data)
CREATE POLICY "Users can view their own profile"
  ON public.users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view their own bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR auth.uid() IN (
    SELECT user_id FROM public.providers WHERE id = provider_id
  ));

CREATE POLICY "Users can view their notifications"
  ON public.notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON public.users(phone);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);

CREATE INDEX IF NOT EXISTS idx_providers_user_id ON public.providers(user_id);
CREATE INDEX IF NOT EXISTS idx_providers_service_type ON public.providers(service_type);
CREATE INDEX IF NOT EXISTS idx_providers_status ON public.providers(status);

CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_provider_id ON public.bookings(provider_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_type ON public.bookings(service_type);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON public.bookings(booking_date);

CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON public.payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

CREATE INDEX IF NOT EXISTS idx_disputes_booking_id ON public.disputes(booking_id);
CREATE INDEX IF NOT EXISTS idx_disputes_status ON public.disputes(status);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read_status ON public.notifications(read_status);

CREATE INDEX IF NOT EXISTS idx_reviews_provider_id ON public.reviews(provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON public.reviews(booking_id);

CREATE INDEX IF NOT EXISTS idx_messages_booking_id ON public.messages(booking_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);

-- ============================================================================
-- INSERT DEFAULT PRICING DATA
-- ============================================================================

INSERT INTO public.pricing (service_type, service_name, base_price, pricing_model, description) VALUES
  ('rent_friend', 'Rent a Friend', 500.00, 'per_hour', 'Hourly rate for friend rental service'),
  ('blind_date', 'Blind Date', 999.00, 'per_session', 'Flat fee per blind date session'),
  ('business_meetup', 'Business Meetup', 1500.00, 'per_hour', 'Hourly rate for business meetups'),
  ('p2p_match', 'Peer-to-Peer Match', 299.00, 'per_session', 'Platform fee for P2P matching'),
  ('find_investor', 'Find Investor', 4999.00, 'per_session', 'Premium investor connection fee'),
  ('find_experienced', 'Find Experienced People', 2499.00, 'per_session', 'Expert consultation fee')
ON CONFLICT (service_type) DO NOTHING;

-- ============================================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_providers_updated_at BEFORE UPDATE ON public.providers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_p2p_meetings_updated_at BEFORE UPDATE ON public.p2p_meetings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_disputes_updated_at BEFORE UPDATE ON public.disputes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pricing_updated_at BEFORE UPDATE ON public.pricing
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMPLETION MESSAGE
-- ============================================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Meet my Mate database schema created successfully!';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Deploy Supabase Edge Functions';
  RAISE NOTICE '2. Configure environment variables in your app';
  RAISE NOTICE '3. Test authentication and API endpoints';
END $$;
