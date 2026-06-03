-- SmartBank AI Platform - Full Schema Migration
-- Includes: Auth, Role-Based Access, All 9 Agent Tables, Real-time Support

-- ============================================================
-- 1. TYPES (ENUMs)
-- ============================================================
DROP TYPE IF EXISTS public.user_role CASCADE;
CREATE TYPE public.user_role AS ENUM ('bank_admin', 'agent_operator', 'analyst');

DROP TYPE IF EXISTS public.agent_name CASCADE;
CREATE TYPE public.agent_name AS ENUM (
  'conversational', 'fraud_detection', 'credit_risk', 'personalization',
  'predictive_analytics', 'compliance_reporting', 'data_aggregation',
  'smart_dashboard', 'orchestration'
);

DROP TYPE IF EXISTS public.agent_status CASCADE;
CREATE TYPE public.agent_status AS ENUM ('online', 'processing', 'offline', 'error');

DROP TYPE IF EXISTS public.alert_severity CASCADE;
CREATE TYPE public.alert_severity AS ENUM ('low', 'medium', 'high', 'critical');

DROP TYPE IF EXISTS public.fraud_case_status CASCADE;
CREATE TYPE public.fraud_case_status AS ENUM ('flagged', 'blocked', 'review', 'cleared');

DROP TYPE IF EXISTS public.credit_decision CASCADE;
CREATE TYPE public.credit_decision AS ENUM ('approved', 'declined', 'manual_review', 'pending');

DROP TYPE IF EXISTS public.compliance_status CASCADE;
CREATE TYPE public.compliance_status AS ENUM ('compliant', 'non_compliant', 'pending_review', 'remediated');

-- ============================================================
-- 2. CORE TABLES
-- ============================================================

-- User Profiles (intermediary for auth.users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  role public.user_role DEFAULT 'analyst'::public.user_role,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Agent Registry
CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type public.agent_name NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  status public.agent_status DEFAULT 'online'::public.agent_status,
  uptime_pct NUMERIC(5,2) DEFAULT 99.9,
  requests_today INTEGER DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  model_version TEXT DEFAULT 'claude-sonnet-4-6',
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Agent Logs (all agent interactions)
CREATE TABLE IF NOT EXISTS public.agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type public.agent_name NOT NULL,
  session_id TEXT,
  user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
  input_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  output_data JSONB,
  processing_time_ms INTEGER,
  tokens_used INTEGER,
  status TEXT DEFAULT 'completed',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- System Alerts
CREATE TABLE IF NOT EXISTS public.system_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type public.agent_name,
  alert_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  severity public.alert_severity DEFAULT 'medium'::public.alert_severity,
  is_read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 3. AGENT-SPECIFIC TABLES
-- ============================================================

-- Fraud Detection Cases
CREATE TABLE IF NOT EXISTS public.fraud_cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_ref TEXT NOT NULL UNIQUE,
  transaction_id TEXT,
  customer_id TEXT,
  fraud_type TEXT NOT NULL,
  amount NUMERIC(15,2),
  currency TEXT DEFAULT 'NGN',
  location TEXT,
  channel TEXT,
  risk_score INTEGER CHECK (risk_score >= 0 AND risk_score <= 100),
  case_status public.fraud_case_status DEFAULT 'flagged'::public.fraud_case_status,
  biometric_result TEXT,
  ml_model_version TEXT,
  claude_analysis TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Credit Risk Assessments
CREATE TABLE IF NOT EXISTS public.credit_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_ref TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_type TEXT DEFAULT 'individual',
  loan_amount NUMERIC(15,2),
  loan_purpose TEXT,
  credit_score INTEGER,
  risk_grade TEXT,
  decision public.credit_decision DEFAULT 'pending'::public.credit_decision,
  income_verified BOOLEAN DEFAULT false,
  alternative_data_used BOOLEAN DEFAULT false,
  claude_analysis TEXT,
  risk_factors JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Compliance Reports
CREATE TABLE IF NOT EXISTS public.compliance_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_ref TEXT NOT NULL UNIQUE,
  report_type TEXT NOT NULL,
  regulatory_body TEXT,
  period_start DATE,
  period_end DATE,
  report_status public.compliance_status DEFAULT 'pending_review'::public.compliance_status,
  submission_deadline DATE,
  submitted_at TIMESTAMPTZ,
  claude_summary TEXT,
  findings JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Personalization Profiles
CREATE TABLE IF NOT EXISTS public.personalization_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id TEXT NOT NULL UNIQUE,
  customer_name TEXT,
  spending_categories JSONB DEFAULT '{}'::jsonb,
  financial_goals JSONB DEFAULT '[]'::jsonb,
  product_recommendations JSONB DEFAULT '[]'::jsonb,
  savings_suggestions JSONB DEFAULT '[]'::jsonb,
  risk_appetite TEXT DEFAULT 'moderate',
  engagement_score INTEGER DEFAULT 0,
  claude_insights TEXT,
  last_analyzed TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Predictive Analytics Results
CREATE TABLE IF NOT EXISTS public.predictive_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id TEXT,
  prediction_type TEXT NOT NULL,
  forecast_period TEXT,
  predicted_value NUMERIC(15,2),
  confidence_score NUMERIC(5,2),
  cash_flow_forecast JSONB DEFAULT '[]'::jsonb,
  spending_forecast JSONB DEFAULT '[]'::jsonb,
  risk_alerts JSONB DEFAULT '[]'::jsonb,
  claude_narrative TEXT,
  model_version TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Data Aggregation Jobs
CREATE TABLE IF NOT EXISTS public.data_aggregation_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_ref TEXT NOT NULL UNIQUE,
  source_system TEXT NOT NULL,
  data_type TEXT NOT NULL,
  records_processed INTEGER DEFAULT 0,
  records_failed INTEGER DEFAULT 0,
  quality_score NUMERIC(5,2),
  job_status TEXT DEFAULT 'pending',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  error_log JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Dashboard Snapshots (Smart Financial Dashboard)
CREATE TABLE IF NOT EXISTS public.dashboard_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  total_transactions INTEGER DEFAULT 0,
  total_volume NUMERIC(20,2) DEFAULT 0,
  fraud_blocked_amount NUMERIC(15,2) DEFAULT 0,
  loans_processed INTEGER DEFAULT 0,
  ai_accuracy NUMERIC(5,2) DEFAULT 99.0,
  active_customers INTEGER DEFAULT 0,
  kpi_data JSONB DEFAULT '{}'::jsonb,
  chart_data JSONB DEFAULT '{}'::jsonb,
  claude_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Orchestration Tasks (inter-agent communication)
CREATE TABLE IF NOT EXISTS public.orchestration_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_ref TEXT NOT NULL UNIQUE,
  initiating_agent public.agent_name,
  target_agents TEXT[] DEFAULT ARRAY[]::TEXT[],
  task_type TEXT NOT NULL,
  priority INTEGER DEFAULT 5,
  input_payload JSONB DEFAULT '{}'::jsonb,
  output_payload JSONB,
  task_status TEXT DEFAULT 'queued',
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  claude_decision TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Conversational Sessions
CREATE TABLE IF NOT EXISTS public.chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_ref TEXT NOT NULL UNIQUE,
  customer_id TEXT,
  language TEXT DEFAULT 'en',
  messages JSONB DEFAULT '[]'::jsonb,
  intent_summary JSONB DEFAULT '{}'::jsonb,
  sentiment TEXT,
  escalated_to_human BOOLEAN DEFAULT false,
  session_status TEXT DEFAULT 'active',
  started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================
-- 4. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_agent_logs_agent_type ON public.agent_logs(agent_type);
CREATE INDEX IF NOT EXISTS idx_agent_logs_created_at ON public.agent_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_alerts_severity ON public.system_alerts(severity);
CREATE INDEX IF NOT EXISTS idx_system_alerts_is_read ON public.system_alerts(is_read);
CREATE INDEX IF NOT EXISTS idx_fraud_cases_status ON public.fraud_cases(case_status);
CREATE INDEX IF NOT EXISTS idx_fraud_cases_risk_score ON public.fraud_cases(risk_score DESC);
CREATE INDEX IF NOT EXISTS idx_credit_assessments_decision ON public.credit_assessments(decision);
CREATE INDEX IF NOT EXISTS idx_compliance_reports_status ON public.compliance_reports(report_status);
CREATE INDEX IF NOT EXISTS idx_orchestration_tasks_status ON public.orchestration_tasks(task_status);
CREATE INDEX IF NOT EXISTS idx_dashboard_snapshots_date ON public.dashboard_snapshots(snapshot_date DESC);

-- ============================================================
-- 5. FUNCTIONS
-- ============================================================

-- Handle new user creation (trigger function)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'analyst')::public.user_role
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

-- Role check function (safe - queries auth.users not user_profiles)
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(raw_user_meta_data->>'role', 'analyst')
  FROM auth.users
  WHERE id = auth.uid();
$$;

-- Check if user is admin or operator
CREATE OR REPLACE FUNCTION public.is_admin_or_operator()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM auth.users
    WHERE id = auth.uid()
    AND (
      raw_user_meta_data->>'role' = 'bank_admin'
      OR raw_user_meta_data->>'role' = 'agent_operator'
    )
  );
$$;

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$;

-- ============================================================
-- 6. ENABLE RLS
-- ============================================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fraud_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personalization_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.predictive_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.data_aggregation_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orchestration_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 7. RLS POLICIES
-- ============================================================

-- user_profiles: own profile only (Pattern 1 - no function to avoid recursion)
DROP POLICY IF EXISTS "users_manage_own_profile" ON public.user_profiles;
CREATE POLICY "users_manage_own_profile" ON public.user_profiles
FOR ALL TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

DROP POLICY IF EXISTS "admins_view_all_profiles" ON public.user_profiles;
CREATE POLICY "admins_view_all_profiles" ON public.user_profiles
FOR SELECT TO authenticated
USING (public.is_admin_or_operator() OR id = auth.uid());

-- agents: all authenticated users can read, admins/operators can write
DROP POLICY IF EXISTS "authenticated_read_agents" ON public.agents;
CREATE POLICY "authenticated_read_agents" ON public.agents
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admins_manage_agents" ON public.agents;
CREATE POLICY "admins_manage_agents" ON public.agents
FOR ALL TO authenticated
USING (public.is_admin_or_operator())
WITH CHECK (public.is_admin_or_operator());

-- agent_logs: all authenticated can read and insert
DROP POLICY IF EXISTS "authenticated_access_agent_logs" ON public.agent_logs;
CREATE POLICY "authenticated_access_agent_logs" ON public.agent_logs
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- system_alerts: all authenticated can read
DROP POLICY IF EXISTS "authenticated_read_alerts" ON public.system_alerts;
CREATE POLICY "authenticated_read_alerts" ON public.system_alerts
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "admins_manage_alerts" ON public.system_alerts;
CREATE POLICY "admins_manage_alerts" ON public.system_alerts
FOR ALL TO authenticated
USING (public.is_admin_or_operator())
WITH CHECK (public.is_admin_or_operator());

-- fraud_cases: all authenticated can read, operators/admins can write
DROP POLICY IF EXISTS "authenticated_read_fraud_cases" ON public.fraud_cases;
CREATE POLICY "authenticated_read_fraud_cases" ON public.fraud_cases
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "operators_manage_fraud_cases" ON public.fraud_cases;
CREATE POLICY "operators_manage_fraud_cases" ON public.fraud_cases
FOR ALL TO authenticated
USING (public.is_admin_or_operator())
WITH CHECK (public.is_admin_or_operator());

-- credit_assessments
DROP POLICY IF EXISTS "authenticated_read_credit" ON public.credit_assessments;
CREATE POLICY "authenticated_read_credit" ON public.credit_assessments
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "operators_manage_credit" ON public.credit_assessments;
CREATE POLICY "operators_manage_credit" ON public.credit_assessments
FOR ALL TO authenticated
USING (public.is_admin_or_operator())
WITH CHECK (public.is_admin_or_operator());

-- compliance_reports
DROP POLICY IF EXISTS "authenticated_read_compliance" ON public.compliance_reports;
CREATE POLICY "authenticated_read_compliance" ON public.compliance_reports
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "operators_manage_compliance" ON public.compliance_reports;
CREATE POLICY "operators_manage_compliance" ON public.compliance_reports
FOR ALL TO authenticated
USING (public.is_admin_or_operator())
WITH CHECK (public.is_admin_or_operator());

-- personalization_profiles
DROP POLICY IF EXISTS "authenticated_access_personalization" ON public.personalization_profiles;
CREATE POLICY "authenticated_access_personalization" ON public.personalization_profiles
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- predictive_results
DROP POLICY IF EXISTS "authenticated_access_predictive" ON public.predictive_results;
CREATE POLICY "authenticated_access_predictive" ON public.predictive_results
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- data_aggregation_jobs
DROP POLICY IF EXISTS "authenticated_read_aggregation" ON public.data_aggregation_jobs;
CREATE POLICY "authenticated_read_aggregation" ON public.data_aggregation_jobs
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "operators_manage_aggregation" ON public.data_aggregation_jobs;
CREATE POLICY "operators_manage_aggregation" ON public.data_aggregation_jobs
FOR ALL TO authenticated
USING (public.is_admin_or_operator())
WITH CHECK (public.is_admin_or_operator());

-- dashboard_snapshots
DROP POLICY IF EXISTS "authenticated_read_dashboard" ON public.dashboard_snapshots;
CREATE POLICY "authenticated_read_dashboard" ON public.dashboard_snapshots
FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "operators_manage_dashboard" ON public.dashboard_snapshots;
CREATE POLICY "operators_manage_dashboard" ON public.dashboard_snapshots
FOR ALL TO authenticated
USING (public.is_admin_or_operator())
WITH CHECK (public.is_admin_or_operator());

-- orchestration_tasks
DROP POLICY IF EXISTS "authenticated_access_orchestration" ON public.orchestration_tasks;
CREATE POLICY "authenticated_access_orchestration" ON public.orchestration_tasks
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- chat_sessions
DROP POLICY IF EXISTS "authenticated_access_chat_sessions" ON public.chat_sessions;
CREATE POLICY "authenticated_access_chat_sessions" ON public.chat_sessions
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- ============================================================
-- 8. TRIGGERS
-- ============================================================
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON public.user_profiles;
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_agents_updated_at ON public.agents;
CREATE TRIGGER update_agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_fraud_cases_updated_at ON public.fraud_cases;
CREATE TRIGGER update_fraud_cases_updated_at
  BEFORE UPDATE ON public.fraud_cases
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_credit_assessments_updated_at ON public.credit_assessments;
CREATE TRIGGER update_credit_assessments_updated_at
  BEFORE UPDATE ON public.credit_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_orchestration_tasks_updated_at ON public.orchestration_tasks;
CREATE TRIGGER update_orchestration_tasks_updated_at
  BEFORE UPDATE ON public.orchestration_tasks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- 9. SEED DATA
-- ============================================================

-- Seed agent registry
INSERT INTO public.agents (agent_type, display_name, description, status, uptime_pct, requests_today, model_version) VALUES
  ('conversational', 'Conversational Agent', 'NLP-powered banking assistant supporting 8+ African languages', 'online', 99.8, 45200, 'claude-sonnet-4-6'),
  ('fraud_detection', 'Fraud Detection Agent', 'Real-time ML transaction monitoring and behavioral biometrics', 'online', 99.9, 128400, 'claude-sonnet-4-6'),
  ('credit_risk', 'Credit Risk Agent', 'Alternative data credit scoring for individuals and MSMEs', 'online', 99.7, 3200, 'claude-sonnet-4-6'),
  ('personalization', 'Personalization Agent', 'AI-powered spending insights and product recommendations', 'online', 99.5, 89100, 'claude-sonnet-4-6'),
  ('predictive_analytics', 'Predictive Analytics Agent', 'Time-series forecasting and cash flow prediction models', 'online', 99.6, 12300, 'claude-sonnet-4-6'),
  ('compliance_reporting', 'Compliance & Reporting Agent', 'Automated regulatory monitoring and AML/KYC compliance', 'online', 99.9, 8700, 'claude-sonnet-4-6'),
  ('data_aggregation', 'Data Aggregation Agent', 'Secure connectors for core banking, CRM, and mobile money', 'online', 99.4, 234000, 'claude-sonnet-4-6'),
  ('smart_dashboard', 'Smart Financial Dashboard', 'Intelligent financial visualization and personalized dashboards', 'online', 99.8, 67400, 'claude-sonnet-4-6'),
  ('orchestration', 'Orchestration Agent', 'Central coordinator managing inter-agent communication', 'online', 100.0, 287600, 'claude-sonnet-4-6')
ON CONFLICT (agent_type) DO NOTHING;

-- Seed fraud cases
DO $$
BEGIN
  INSERT INTO public.fraud_cases (case_ref, transaction_id, customer_id, fraud_type, amount, currency, location, channel, risk_score, case_status, biometric_result, ml_model_version) VALUES
    ('FRD-8821', 'TXN-992841', 'CUST-4421', 'Account Takeover', 450000, 'NGN', 'Lagos, NG', 'Mobile App', 98, 'blocked', 'Failed', 'v4.1.0'),
    ('FRD-8820', 'TXN-992840', 'CUST-8812', 'Unusual Transfer', 2100000, 'NGN', 'Accra, GH', 'Internet Banking', 87, 'review', 'N/A', 'v4.1.0'),
    ('FRD-8819', 'TXN-992839', 'CUST-3301', 'Card Cloning', 78000, 'NGN', 'Nairobi, KE', 'POS Terminal', 94, 'blocked', 'N/A', 'v4.1.0'),
    ('FRD-8818', 'TXN-992838', 'CUST-7712', 'SIM Swap', 890000, 'NGN', 'Abuja, NG', 'Mobile Money', 91, 'blocked', 'Bypassed', 'v4.1.0'),
    ('FRD-8817', 'TXN-992837', 'CUST-5521', 'Phishing', 125000, 'NGN', 'Kano, NG', 'Web', 72, 'review', 'N/A', 'v4.1.0'),
    ('FRD-8816', 'TXN-992836', 'CUST-2201', 'Velocity Abuse', 34000, 'NGN', 'Port Harcourt, NG', 'USSD', 65, 'cleared', 'N/A', 'v4.1.0')
  ON CONFLICT (case_ref) DO NOTHING;
END $$;

-- Seed credit assessments
DO $$
BEGIN
  INSERT INTO public.credit_assessments (application_ref, customer_name, customer_type, loan_amount, loan_purpose, credit_score, risk_grade, decision, income_verified, alternative_data_used) VALUES
    ('LOAN-4421', 'Adaeze Okonkwo', 'individual', 500000, 'Business Expansion', 742, 'B+', 'approved', true, true),
    ('LOAN-4420', 'Emeka Traders Ltd', 'msme', 5000000, 'Working Capital', 681, 'B', 'manual_review', true, true),
    ('LOAN-4419', 'Fatima Al-Hassan', 'individual', 250000, 'Education', 798, 'A-', 'approved', true, false),
    ('LOAN-4418', 'Kwame Mensah', 'individual', 1200000, 'Real Estate', 612, 'C+', 'declined', false, true),
    ('LOAN-4417', 'Lagos Micro Finance', 'msme', 10000000, 'Equipment Purchase', 724, 'B+', 'approved', true, true)
  ON CONFLICT (application_ref) DO NOTHING;
END $$;

-- Seed compliance reports
DO $$
BEGIN
  INSERT INTO public.compliance_reports (report_ref, report_type, regulatory_body, period_start, period_end, report_status, submission_deadline) VALUES
    ('RPT-2026-001', 'AML Suspicious Activity Report', 'CBN', '2026-05-01', '2026-05-31', 'compliant', '2026-06-15'),
    ('RPT-2026-002', 'KYC Compliance Report', 'NFIU', '2026-04-01', '2026-04-30', 'compliant', '2026-05-31'),
    ('RPT-2026-003', 'FATF Compliance Assessment', 'GIABA', '2026-01-01', '2026-03-31', 'pending_review', '2026-06-30'),
    ('RPT-2026-004', 'Quarterly Risk Report', 'CBN', '2026-04-01', '2026-06-30', 'pending_review', '2026-07-15'),
    ('RPT-2026-005', 'GDPR Data Processing Report', 'NITDA', '2026-01-01', '2026-06-30', 'non_compliant', '2026-06-10')
  ON CONFLICT (report_ref) DO NOTHING;
END $$;

-- Seed system alerts
DO $$
BEGIN
  INSERT INTO public.system_alerts (agent_type, alert_type, title, description, severity, is_read) VALUES
    ('fraud_detection', 'Fraud Alert', 'High-risk transaction flagged in Lagos', 'Unusual cross-border transfer pattern detected - TXN-9821', 'high', false),
    ('credit_risk', 'Credit Review', 'MSME loan requires manual review', 'LOAN-4420 flagged for additional verification', 'medium', false),
    ('compliance_reporting', 'Compliance', 'AML report submission deadline approaching', 'RPT-2026-003 due in 27 days', 'medium', false),
    ('orchestration', 'System', 'Fraud model retrained successfully', 'Model v4.1.0 deployed with 99.2% accuracy', 'low', true),
    ('data_aggregation', 'Data Quality', 'Core banking sync completed', '234,891 records processed with 99.8% quality score', 'low', true)
  ON CONFLICT DO NOTHING;
END $$;

-- Seed mock auth users
DO $$
DECLARE
  admin_uuid UUID := gen_random_uuid();
  operator_uuid UUID := gen_random_uuid();
  analyst_uuid UUID := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
    created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
    is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
    recovery_token, recovery_sent_at, email_change_token_new, email_change,
    email_change_sent_at, email_change_token_current, email_change_confirm_status,
    reauthentication_token, reauthentication_sent_at, phone, phone_change,
    phone_change_token, phone_change_sent_at
  ) VALUES
    (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'admin@smartbank.ai', crypt('SmartBank2026!', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('full_name', 'Bank Administrator', 'role', 'bank_admin'),
     jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
     false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
    (operator_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'operator@smartbank.ai', crypt('SmartBank2026!', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('full_name', 'Agent Operator', 'role', 'agent_operator'),
     jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
     false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
    (analyst_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
     'analyst@smartbank.ai', crypt('SmartBank2026!', gen_salt('bf', 10)), now(), now(), now(),
     jsonb_build_object('full_name', 'Data Analyst', 'role', 'analyst'),
     jsonb_build_object('provider', 'email', 'providers', ARRAY['email']::TEXT[]),
     false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null)
  ON CONFLICT (id) DO NOTHING;
END $$;
