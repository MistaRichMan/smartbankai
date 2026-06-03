-- ============================================================
-- Banking Channels: Customer-Facing Omnichannel Data Layer
-- Migration: 20260603150000_banking_channels.sql
-- ============================================================

-- ─── 1. ENUM TYPES ──────────────────────────────────────────
DROP TYPE IF EXISTS public.bank_account_type CASCADE;
CREATE TYPE public.bank_account_type AS ENUM ('current', 'savings', 'fixed_deposit', 'domiciliary');

DROP TYPE IF EXISTS public.transaction_type CASCADE;
CREATE TYPE public.transaction_type AS ENUM ('credit', 'debit', 'transfer', 'reversal');

DROP TYPE IF EXISTS public.transaction_status CASCADE;
CREATE TYPE public.transaction_status AS ENUM ('pending', 'completed', 'failed', 'flagged', 'reversed');

DROP TYPE IF EXISTS public.loan_status CASCADE;
CREATE TYPE public.loan_status AS ENUM ('draft', 'submitted', 'under_review', 'approved', 'declined', 'disbursed', 'closed');

DROP TYPE IF EXISTS public.savings_goal_status CASCADE;
CREATE TYPE public.savings_goal_status AS ENUM ('active', 'paused', 'completed', 'cancelled');

-- ─── 2. CORE TABLES ─────────────────────────────────────────

-- Banking customers (linked to platform user_profiles)
CREATE TABLE IF NOT EXISTS public.banking_customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    customer_ref TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    date_of_birth DATE,
    bvn_hash TEXT,
    credit_score INTEGER DEFAULT 650,
    kyc_status TEXT DEFAULT 'verified',
    customer_tier TEXT DEFAULT 'standard',
    biometric_enrolled BOOLEAN DEFAULT false,
    session_token TEXT,
    last_mobile_login TIMESTAMPTZ,
    last_web_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Bank accounts
CREATE TABLE IF NOT EXISTS public.bank_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.banking_customers(id) ON DELETE CASCADE,
    account_number TEXT NOT NULL UNIQUE,
    account_type public.bank_account_type NOT NULL DEFAULT 'current',
    account_name TEXT NOT NULL,
    balance NUMERIC(18, 2) NOT NULL DEFAULT 0,
    available_balance NUMERIC(18, 2) NOT NULL DEFAULT 0,
    currency TEXT NOT NULL DEFAULT 'NGN',
    is_primary BOOLEAN DEFAULT false,
    is_frozen BOOLEAN DEFAULT false,
    interest_rate NUMERIC(5, 2),
    maturity_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Bank transactions
CREATE TABLE IF NOT EXISTS public.bank_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID NOT NULL REFERENCES public.bank_accounts(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES public.banking_customers(id) ON DELETE CASCADE,
    transaction_ref TEXT NOT NULL UNIQUE DEFAULT 'TXN-' || gen_random_uuid()::TEXT,
    description TEXT NOT NULL,
    amount NUMERIC(18, 2) NOT NULL,
    transaction_type public.transaction_type NOT NULL,
    transaction_status public.transaction_status DEFAULT 'completed',
    category TEXT,
    merchant_name TEXT,
    merchant_location TEXT,
    channel TEXT DEFAULT 'web',
    fraud_flag BOOLEAN DEFAULT false,
    fraud_score NUMERIC(5, 2),
    fraud_agent_analysis TEXT,
    balance_after NUMERIC(18, 2),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Savings goals
CREATE TABLE IF NOT EXISTS public.savings_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.banking_customers(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.bank_accounts(id) ON DELETE SET NULL,
    goal_name TEXT NOT NULL,
    target_amount NUMERIC(18, 2) NOT NULL,
    current_amount NUMERIC(18, 2) NOT NULL DEFAULT 0,
    goal_status public.savings_goal_status DEFAULT 'active',
    target_date DATE,
    auto_save_amount NUMERIC(18, 2),
    auto_save_frequency TEXT,
    ai_recommendation TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Loan applications
CREATE TABLE IF NOT EXISTS public.loan_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.banking_customers(id) ON DELETE CASCADE,
    application_ref TEXT NOT NULL UNIQUE DEFAULT 'LOAN-' || gen_random_uuid()::TEXT,
    loan_amount NUMERIC(18, 2) NOT NULL,
    loan_purpose TEXT,
    tenure_months INTEGER NOT NULL,
    interest_rate NUMERIC(5, 2),
    monthly_repayment NUMERIC(18, 2),
    loan_status public.loan_status DEFAULT 'draft',
    credit_score_at_application INTEGER,
    ai_eligibility_score NUMERIC(5, 2),
    ai_risk_assessment TEXT,
    approved_amount NUMERIC(18, 2),
    disbursement_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Bill payments
CREATE TABLE IF NOT EXISTS public.bill_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.banking_customers(id) ON DELETE CASCADE,
    account_id UUID REFERENCES public.bank_accounts(id) ON DELETE SET NULL,
    payment_ref TEXT NOT NULL UNIQUE DEFAULT 'BILL-' || gen_random_uuid()::TEXT,
    biller_name TEXT NOT NULL,
    biller_category TEXT,
    beneficiary_account TEXT NOT NULL,
    amount NUMERIC(18, 2) NOT NULL,
    payment_status TEXT DEFAULT 'completed',
    is_recurring BOOLEAN DEFAULT false,
    recurrence_frequency TEXT,
    next_payment_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Banking AI chat sessions (customer-facing, separate from admin chat_sessions)
CREATE TABLE IF NOT EXISTS public.banking_chat_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.banking_customers(id) ON DELETE CASCADE,
    session_ref TEXT NOT NULL UNIQUE DEFAULT 'BCHAT-' || gen_random_uuid()::TEXT,
    channel TEXT DEFAULT 'web',
    messages JSONB DEFAULT '[]',
    intent_tags TEXT[],
    sentiment TEXT,
    session_status TEXT DEFAULT 'active',
    ai_model TEXT DEFAULT 'claude-sonnet-4-6',
    started_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMPTZ
);

-- ─── 3. INDEXES ─────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_banking_customers_email ON public.banking_customers(email);
CREATE INDEX IF NOT EXISTS idx_banking_customers_ref ON public.banking_customers(customer_ref);
CREATE INDEX IF NOT EXISTS idx_bank_accounts_customer ON public.bank_accounts(customer_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_account ON public.bank_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_customer ON public.bank_transactions(customer_id);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_created ON public.bank_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bank_transactions_fraud ON public.bank_transactions(fraud_flag) WHERE fraud_flag = true;
CREATE INDEX IF NOT EXISTS idx_savings_goals_customer ON public.savings_goals(customer_id);
CREATE INDEX IF NOT EXISTS idx_loan_applications_customer ON public.loan_applications(customer_id);
CREATE INDEX IF NOT EXISTS idx_bill_payments_customer ON public.bill_payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_banking_chat_sessions_customer ON public.banking_chat_sessions(customer_id);

-- ─── 4. UPDATED_AT FUNCTION ─────────────────────────────────
CREATE OR REPLACE FUNCTION public.update_banking_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- ─── 5. ENABLE RLS ──────────────────────────────────────────
ALTER TABLE public.banking_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bill_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banking_chat_sessions ENABLE ROW LEVEL SECURITY;

-- ─── 6. RLS POLICIES ────────────────────────────────────────

-- banking_customers: open read for demo (admin manages via user_profiles)
DROP POLICY IF EXISTS "banking_customers_open_access" ON public.banking_customers;
CREATE POLICY "banking_customers_open_access"
ON public.banking_customers FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "bank_accounts_open_access" ON public.bank_accounts;
CREATE POLICY "bank_accounts_open_access"
ON public.bank_accounts FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "bank_transactions_open_access" ON public.bank_transactions;
CREATE POLICY "bank_transactions_open_access"
ON public.bank_transactions FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "savings_goals_open_access" ON public.savings_goals;
CREATE POLICY "savings_goals_open_access"
ON public.savings_goals FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "loan_applications_open_access" ON public.loan_applications;
CREATE POLICY "loan_applications_open_access"
ON public.loan_applications FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "bill_payments_open_access" ON public.bill_payments;
CREATE POLICY "bill_payments_open_access"
ON public.bill_payments FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "banking_chat_sessions_open_access" ON public.banking_chat_sessions;
CREATE POLICY "banking_chat_sessions_open_access"
ON public.banking_chat_sessions FOR ALL TO public USING (true) WITH CHECK (true);

-- ─── 7. TRIGGERS ────────────────────────────────────────────
DROP TRIGGER IF EXISTS banking_customers_updated_at ON public.banking_customers;
CREATE TRIGGER banking_customers_updated_at
    BEFORE UPDATE ON public.banking_customers
    FOR EACH ROW EXECUTE FUNCTION public.update_banking_updated_at();

DROP TRIGGER IF EXISTS bank_accounts_updated_at ON public.bank_accounts;
CREATE TRIGGER bank_accounts_updated_at
    BEFORE UPDATE ON public.bank_accounts
    FOR EACH ROW EXECUTE FUNCTION public.update_banking_updated_at();

DROP TRIGGER IF EXISTS savings_goals_updated_at ON public.savings_goals;
CREATE TRIGGER savings_goals_updated_at
    BEFORE UPDATE ON public.savings_goals
    FOR EACH ROW EXECUTE FUNCTION public.update_banking_updated_at();

DROP TRIGGER IF EXISTS loan_applications_updated_at ON public.loan_applications;
CREATE TRIGGER loan_applications_updated_at
    BEFORE UPDATE ON public.loan_applications
    FOR EACH ROW EXECUTE FUNCTION public.update_banking_updated_at();

-- ─── 8. MOCK DATA ───────────────────────────────────────────
DO $$
DECLARE
    customer_uuid UUID := gen_random_uuid();
    current_acc_uuid UUID := gen_random_uuid();
    savings_acc_uuid UUID := gen_random_uuid();
    fd_acc_uuid UUID := gen_random_uuid();
BEGIN
    -- Demo banking customer
    INSERT INTO public.banking_customers (
        id, customer_ref, full_name, email, phone,
        credit_score, kyc_status, customer_tier, biometric_enrolled
    ) VALUES (
        customer_uuid, 'CUST-001', 'Adaeze Okonkwo', 'adaeze@smartbankai.demo',
        '+2348012345678', 742, 'verified', 'premium', true
    ) ON CONFLICT (customer_ref) DO NOTHING;

    -- Accounts
    INSERT INTO public.bank_accounts (id, customer_id, account_number, account_type, account_name, balance, available_balance, is_primary)
    VALUES
        (current_acc_uuid, customer_uuid, '0012345678', 'current', 'Primary Current', 2847500, 2847500, true),
        (savings_acc_uuid, customer_uuid, '0087654321', 'savings', 'Savings Account', 1250000, 1250000, false),
        (fd_acc_uuid, customer_uuid, '0099002200', 'fixed_deposit', 'Fixed Deposit', 5000000, 0, false)
    ON CONFLICT (account_number) DO NOTHING;

    -- Sample transactions
    INSERT INTO public.bank_transactions (account_id, customer_id, description, amount, transaction_type, category, merchant_name, channel, fraud_flag, balance_after)
    VALUES
        (current_acc_uuid, customer_uuid, 'Salary Credit', 850000, 'credit', 'Income', 'Employer Ltd', 'web', false, 2847500),
        (current_acc_uuid, customer_uuid, 'Shoprite Purchase', 45200, 'debit', 'Shopping', 'Shoprite', 'mobile', false, 1997500),
        (current_acc_uuid, customer_uuid, 'DSTV Subscription', 24500, 'debit', 'Utilities', 'DSTV', 'web', false, 1952000),
        (current_acc_uuid, customer_uuid, 'ATM Withdrawal Lagos', 100000, 'debit', 'Cash', null, 'atm', true, 1852000),
        (current_acc_uuid, customer_uuid, 'Bolt Ride', 3200, 'debit', 'Transport', 'Bolt', 'mobile', false, 1848800)
    ON CONFLICT (transaction_ref) DO NOTHING;

    -- Savings goals
    INSERT INTO public.savings_goals (customer_id, account_id, goal_name, target_amount, current_amount, target_date)
    VALUES
        (customer_uuid, savings_acc_uuid, 'Emergency Fund', 1500000, 847250, '2026-12-31'),
        (customer_uuid, savings_acc_uuid, 'New Car', 8000000, 2100000, '2027-06-30'),
        (customer_uuid, savings_acc_uuid, 'Vacation', 500000, 380000, '2026-08-01')
    ON CONFLICT (id) DO NOTHING;

EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Banking mock data insertion skipped: %', SQLERRM;
END $$;
