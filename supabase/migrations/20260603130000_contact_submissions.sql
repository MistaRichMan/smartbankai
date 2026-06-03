-- Contact Submissions Migration
-- Stores demo requests, sales inquiries, and consultation bookings

-- ============================================================
-- TYPES
-- ============================================================
DROP TYPE IF EXISTS public.inquiry_type CASCADE;
CREATE TYPE public.inquiry_type AS ENUM ('demo', 'sales', 'consultation', 'partnership', 'general');

DROP TYPE IF EXISTS public.institution_type CASCADE;
CREATE TYPE public.institution_type AS ENUM ('commercial_bank', 'microfinance_bank', 'fintech', 'mobile_money', 'investment_bank', 'other');

DROP TYPE IF EXISTS public.submission_status CASCADE;
CREATE TYPE public.submission_status AS ENUM ('new', 'contacted', 'demo_scheduled', 'proposal_sent', 'closed_won', 'closed_lost');

-- ============================================================
-- TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  job_title TEXT,
  institution_name TEXT NOT NULL,
  institution_type public.institution_type,
  country TEXT,
  inquiry_type public.inquiry_type NOT NULL,
  use_cases TEXT[] DEFAULT ARRAY[]::TEXT[],
  message TEXT,
  preferred_date DATE,
  status public.submission_status DEFAULT 'new'::public.submission_status,
  assigned_to UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_institution_type ON public.contact_submissions(institution_type);

-- ============================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.update_contact_submissions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- ============================================================
-- ENABLE RLS
-- ============================================================
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Allow anyone (including anonymous) to insert (public form submission)
DROP POLICY IF EXISTS "public_can_submit_contact" ON public.contact_submissions;
CREATE POLICY "public_can_submit_contact"
ON public.contact_submissions
FOR INSERT
TO public
WITH CHECK (true);

-- Authenticated users (bank admins) can view all submissions
DROP POLICY IF EXISTS "authenticated_can_view_submissions" ON public.contact_submissions;
CREATE POLICY "authenticated_can_view_submissions"
ON public.contact_submissions
FOR SELECT
TO authenticated
USING (true);

-- Authenticated users can update submissions (for CRM workflow)
DROP POLICY IF EXISTS "authenticated_can_update_submissions" ON public.contact_submissions;
CREATE POLICY "authenticated_can_update_submissions"
ON public.contact_submissions
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================================
-- TRIGGER
-- ============================================================
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON public.contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_contact_submissions_updated_at();

-- ============================================================
-- SAMPLE DATA
-- ============================================================
DO $$
BEGIN
  INSERT INTO public.contact_submissions (
    full_name, email, phone, job_title, institution_name,
    institution_type, country, inquiry_type, use_cases, message, status
  ) VALUES
    (
      'Chukwuemeka Obi', 'c.obi@firstbankng.com', '+234 802 345 6789',
      'Chief Digital Officer', 'First Bank of Nigeria',
      'commercial_bank'::public.institution_type, 'Nigeria',
      'demo'::public.inquiry_type,
      ARRAY['Fraud Detection', 'Credit Risk & Lending', 'Retail Banking AI'],
      'We are looking to modernize our digital banking stack with AI capabilities. Particularly interested in fraud detection and credit scoring for our retail segment.',
      'new'::public.submission_status
    ),
    (
      'Amara Mensah', 'a.mensah@absa.co.gh', '+233 244 567 890',
      'Head of Innovation', 'ABSA Bank Ghana',
      'commercial_bank'::public.institution_type, 'Ghana',
      'consultation'::public.inquiry_type,
      ARRAY['Compliance & Reporting', 'Customer Service AI'],
      'Exploring AI solutions for regulatory compliance automation and improving our customer service operations.',
      'contacted'::public.submission_status
    ),
    (
      'Fatima Al-Hassan', 'fatima@lapofinance.com', '+234 701 234 5678',
      'CEO', 'LAPO Microfinance Bank',
      'microfinance_bank'::public.institution_type, 'Nigeria',
      'demo'::public.inquiry_type,
      ARRAY['Credit Risk & Lending', 'Retail Banking AI'],
      'We serve over 2 million customers and need better credit scoring tools that work with alternative data for our unbanked customer base.',
      'demo_scheduled'::public.submission_status
    )
  ON CONFLICT (id) DO NOTHING;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Sample data insertion skipped: %', SQLERRM;
END $$;
