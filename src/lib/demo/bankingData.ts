// ─── Shared Demo Banking Data ─────────────────────────────────────────────────
// Single source of truth for all channels (Web Banking, Mobile Banking)
// and back-office admin portal (Fraud Detection, Credit Risk, Compliance,
// Smart Dashboard, Orchestration, Personalization, Predictive Analytics)

export interface DemoCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  bvn: string;
  creditScore: number;
  riskTier: 'Low' | 'Medium' | 'High';
  kycStatus: 'verified' | 'pending' | 'failed';
  segment: 'Premium' | 'Standard' | 'SME' | 'Corporate';
  since: string;
  monthlyIncome: number;
  occupation: string;
  location: string;
}

export interface DemoAccount {
  id: string;
  customerId: string;
  accountNumber: string;
  accountType: 'current' | 'savings' | 'fixed_deposit' | 'domiciliary';
  accountName: string;
  balance: number;
  currency: string;
  isPrimary: boolean;
}

export interface DemoTransaction {
  id: string;
  customerId: string;
  accountId: string;
  reference: string;
  description: string;
  amount: number;
  transactionType: 'credit' | 'debit';
  category: 'Income' | 'Transfer' | 'Bills' | 'Shopping' | 'Transport' | 'Airtime' | 'POS' | 'Mobile Money' | 'ATM' | 'Loan' | 'Savings' | 'Entertainment' | 'Healthcare' | 'Food';
  channel: 'Mobile App' | 'Internet Banking' | 'POS Terminal' | 'ATM' | 'USSD' | 'Mobile Money' | 'Branch';
  merchantName: string | null;
  location: string;
  fraudFlag: boolean;
  fraudType: string | null;
  fraudRiskScore: number;
  amlFlag: boolean;
  createdAt: string;
  status: 'completed' | 'pending' | 'failed' | 'blocked';
}

export interface DemoLoanApplication {
  id: string;
  customerId: string;
  applicantName: string;
  loanType: 'Personal' | 'MSME' | 'Mortgage' | 'Auto';
  amount: number;
  purpose: string;
  creditScore: number;
  riskGrade: 'Low' | 'Medium' | 'High';
  status: 'approved' | 'review' | 'declined' | 'disbursed';
  interestRate: number;
  tenure: number;
  monthlyPayment: number;
  sector: string;
  monthlyIncome: number;
  appliedAt: string;
  alternativeData: string;
}

export interface DemoFraudCase {
  id: string;
  transactionId: string;
  customerId: string;
  customerName: string;
  fraudType: string;
  amount: number;
  location: string;
  channel: string;
  riskScore: number;
  status: 'blocked' | 'review' | 'cleared' | 'escalated';
  biometric: string;
  stepUp: string;
  detectedAt: string;
}

export interface DemoAmlAlert {
  id: string;
  customerId: string;
  customerName: string;
  alertType: string;
  amount: number;
  currency: string;
  riskLevel: 'Critical' | 'High' | 'Medium' | 'Low';
  status: 'investigating' | 'cleared' | 'escalated' | 'blocked' | 'reported';
  jurisdiction: string;
  detectedAt: string;
  relatedTransactionIds: string[];
}

// ─── Customers ────────────────────────────────────────────────────────────────
export const DEMO_CUSTOMERS: DemoCustomer[] = [
  {
    id: 'CUST-001',
    name: 'Adaeze Okonkwo',
    email: 'adaeze.okonkwo@email.com',
    phone: '08012345678',
    bvn: '22198765432',
    creditScore: 742,
    riskTier: 'Low',
    kycStatus: 'verified',
    segment: 'Premium',
    since: '2021-03-15',
    monthlyIncome: 850000,
    occupation: 'Senior Manager, Retail Trade',
    location: 'Lagos, Nigeria',
  },
  {
    id: 'CUST-002',
    name: 'Emeka Nwosu',
    email: 'emeka.nwosu@email.com',
    phone: '08023456789',
    bvn: '22187654321',
    creditScore: 618,
    riskTier: 'Medium',
    kycStatus: 'verified',
    segment: 'Standard',
    since: '2022-07-10',
    monthlyIncome: 280000,
    occupation: 'Salary Earner, Tech',
    location: 'Abuja, Nigeria',
  },
  {
    id: 'CUST-003',
    name: 'Fatima Al-Hassan',
    email: 'fatima.alhassan@email.com',
    phone: '08034567890',
    bvn: '22176543210',
    creditScore: 589,
    riskTier: 'Medium',
    kycStatus: 'verified',
    segment: 'SME',
    since: '2020-11-22',
    monthlyIncome: 1200000,
    occupation: 'Agribusiness Owner',
    location: 'Kano, Nigeria',
  },
  {
    id: 'CUST-004',
    name: 'Kwame Asante',
    email: 'kwame.asante@email.com',
    phone: '0244567890',
    bvn: '22165432109',
    creditScore: 481,
    riskTier: 'High',
    kycStatus: 'pending',
    segment: 'Standard',
    since: '2023-02-14',
    monthlyIncome: 95000,
    occupation: 'Informal Trader',
    location: 'Accra, Ghana',
  },
  {
    id: 'CUST-005',
    name: 'Ngozi Eze Trading Co.',
    email: 'ngozi.eze@ezetrading.com',
    phone: '08056789012',
    bvn: '22154321098',
    creditScore: 801,
    riskTier: 'Low',
    kycStatus: 'verified',
    segment: 'Corporate',
    since: '2019-06-01',
    monthlyIncome: 4500000,
    occupation: 'Manufacturing & Distribution',
    location: 'Lagos, Nigeria',
  },
  {
    id: 'CUST-006',
    name: 'Ibrahim Musa',
    email: 'ibrahim.musa@email.com',
    phone: '08067890123',
    bvn: '22143210987',
    creditScore: 655,
    riskTier: 'Low',
    kycStatus: 'verified',
    segment: 'Standard',
    since: '2021-09-30',
    monthlyIncome: 420000,
    occupation: 'Civil Servant',
    location: 'Abuja, Nigeria',
  },
  {
    id: 'CUST-007',
    name: 'Chioma Holdings Ltd',
    email: 'chioma@chiomaholdingsltd.com',
    phone: '08078901234',
    bvn: '22132109876',
    creditScore: 712,
    riskTier: 'Medium',
    kycStatus: 'verified',
    segment: 'Corporate',
    since: '2018-04-12',
    monthlyIncome: 8200000,
    occupation: 'Real Estate & Investment',
    location: 'Lagos, Nigeria',
  },
  {
    id: 'CUST-008',
    name: 'Ade Enterprises Ltd',
    email: 'ade@adeenterprises.com',
    phone: '08089012345',
    bvn: '22121098765',
    creditScore: 534,
    riskTier: 'High',
    kycStatus: 'verified',
    segment: 'SME',
    since: '2022-01-18',
    monthlyIncome: 2800000,
    occupation: 'Import/Export',
    location: 'Lagos, Nigeria',
  },
];

// ─── Accounts ─────────────────────────────────────────────────────────────────
export const DEMO_ACCOUNTS: DemoAccount[] = [
  { id: 'ACC-001', customerId: 'CUST-001', accountNumber: '****4521', accountType: 'current', accountName: 'Primary Current', balance: 2847500, currency: 'NGN', isPrimary: true },
  { id: 'ACC-002', customerId: 'CUST-001', accountNumber: '****8834', accountType: 'savings', accountName: 'Savings Account', balance: 1250000, currency: 'NGN', isPrimary: false },
  { id: 'ACC-003', customerId: 'CUST-001', accountNumber: '****2290', accountType: 'fixed_deposit', accountName: 'Fixed Deposit', balance: 5000000, currency: 'NGN', isPrimary: false },
  { id: 'ACC-004', customerId: 'CUST-002', accountNumber: '****3312', accountType: 'current', accountName: 'Current Account', balance: 487200, currency: 'NGN', isPrimary: true },
  { id: 'ACC-005', customerId: 'CUST-003', accountNumber: '****7741', accountType: 'current', accountName: 'Business Current', balance: 3120000, currency: 'NGN', isPrimary: true },
  { id: 'ACC-006', customerId: 'CUST-004', accountNumber: '****9923', accountType: 'savings', accountName: 'Savings Account', balance: 42500, currency: 'GHS', isPrimary: true },
  { id: 'ACC-007', customerId: 'CUST-005', accountNumber: '****1188', accountType: 'current', accountName: 'Corporate Current', balance: 18450000, currency: 'NGN', isPrimary: true },
  { id: 'ACC-008', customerId: 'CUST-006', accountNumber: '****5567', accountType: 'current', accountName: 'Salary Account', balance: 892000, currency: 'NGN', isPrimary: true },
  { id: 'ACC-009', customerId: 'CUST-007', accountNumber: '****3344', accountType: 'current', accountName: 'Corporate Account', balance: 24100000, currency: 'NGN', isPrimary: true },
  { id: 'ACC-010', customerId: 'CUST-008', accountNumber: '****6612', accountType: 'current', accountName: 'Business Account', balance: 5670000, currency: 'NGN', isPrimary: true },
];

// ─── Transactions ─────────────────────────────────────────────────────────────
export const DEMO_TRANSACTIONS: DemoTransaction[] = [
  // CUST-001 Adaeze — recent transactions
  { id: 'TXN-10001', customerId: 'CUST-001', accountId: 'ACC-001', reference: 'REF-A10001', description: 'Salary Credit — Employer Ltd', amount: 850000, transactionType: 'credit', category: 'Income', channel: 'Internet Banking', merchantName: 'Employer Ltd', location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 2, amlFlag: false, createdAt: '2026-06-03T09:00:00Z', status: 'completed' },
  { id: 'TXN-10002', customerId: 'CUST-001', accountId: 'ACC-001', reference: 'REF-A10002', description: 'Shoprite Purchase — Victoria Island', amount: 45200, transactionType: 'debit', category: 'Shopping', channel: 'POS Terminal', merchantName: 'Shoprite', location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 5, amlFlag: false, createdAt: '2026-06-03T11:30:00Z', status: 'completed' },
  { id: 'TXN-10003', customerId: 'CUST-001', accountId: 'ACC-001', reference: 'REF-A10003', description: 'DSTV Subscription Renewal', amount: 24500, transactionType: 'debit', category: 'Bills', channel: 'Mobile App', merchantName: 'DSTV', location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 1, amlFlag: false, createdAt: '2026-06-02T08:00:00Z', status: 'completed' },
  { id: 'TXN-10004', customerId: 'CUST-001', accountId: 'ACC-001', reference: 'REF-A10004', description: 'ATM Withdrawal — Ikeja Branch', amount: 100000, transactionType: 'debit', category: 'ATM', channel: 'ATM', merchantName: null, location: 'Lagos, NG', fraudFlag: true, fraudType: 'Unusual ATM Time', fraudRiskScore: 87, amlFlag: false, createdAt: '2026-06-02T02:22:00Z', status: 'completed' },
  { id: 'TXN-10005', customerId: 'CUST-001', accountId: 'ACC-001', reference: 'REF-A10005', description: 'Transfer from Emeka Nwosu', amount: 50000, transactionType: 'credit', category: 'Transfer', channel: 'Mobile App', merchantName: null, location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 8, amlFlag: false, createdAt: '2026-06-01T16:45:00Z', status: 'completed' },
  { id: 'TXN-10006', customerId: 'CUST-001', accountId: 'ACC-001', reference: 'REF-A10006', description: 'Bolt Ride — Lekki to VI', amount: 3200, transactionType: 'debit', category: 'Transport', channel: 'Mobile App', merchantName: 'Bolt', location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 2, amlFlag: false, createdAt: '2026-06-01T19:10:00Z', status: 'completed' },
  { id: 'TXN-10007', customerId: 'CUST-001', accountId: 'ACC-001', reference: 'REF-A10007', description: 'Netflix Subscription', amount: 5500, transactionType: 'debit', category: 'Entertainment', channel: 'Internet Banking', merchantName: 'Netflix', location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 1, amlFlag: false, createdAt: '2026-05-31T00:00:00Z', status: 'completed' },
  { id: 'TXN-10008', customerId: 'CUST-001', accountId: 'ACC-001', reference: 'REF-A10008', description: 'MTN Airtime Top-up', amount: 5000, transactionType: 'debit', category: 'Airtime', channel: 'USSD', merchantName: 'MTN', location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 1, amlFlag: false, createdAt: '2026-05-30T14:00:00Z', status: 'completed' },
  { id: 'TXN-10009', customerId: 'CUST-001', accountId: 'ACC-001', reference: 'REF-A10009', description: 'EKEDC Electricity Bill', amount: 18000, transactionType: 'debit', category: 'Bills', channel: 'Mobile App', merchantName: 'EKEDC', location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 2, amlFlag: false, createdAt: '2026-05-29T10:30:00Z', status: 'completed' },
  { id: 'TXN-10010', customerId: 'CUST-001', accountId: 'ACC-001', reference: 'REF-A10010', description: 'Chicken Republic — Lunch', amount: 8400, transactionType: 'debit', category: 'Food', channel: 'POS Terminal', merchantName: 'Chicken Republic', location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 3, amlFlag: false, createdAt: '2026-05-28T13:15:00Z', status: 'completed' },
  { id: 'TXN-10011', customerId: 'CUST-001', accountId: 'ACC-001', reference: 'REF-A10011', description: 'Savings Goal Top-up — Emergency Fund', amount: 50000, transactionType: 'debit', category: 'Savings', channel: 'Mobile App', merchantName: null, location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 1, amlFlag: false, createdAt: '2026-05-27T09:00:00Z', status: 'completed' },
  { id: 'TXN-10012', customerId: 'CUST-001', accountId: 'ACC-001', reference: 'REF-A10012', description: 'Loan Repayment — LOAN-4421', amount: 125000, transactionType: 'debit', category: 'Loan', channel: 'Internet Banking', merchantName: null, location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 1, amlFlag: false, createdAt: '2026-05-25T08:00:00Z', status: 'completed' },
  { id: 'TXN-10013', customerId: 'CUST-001', accountId: 'ACC-001', reference: 'REF-A10013', description: 'Jumia Online Shopping', amount: 32000, transactionType: 'debit', category: 'Shopping', channel: 'Internet Banking', merchantName: 'Jumia', location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 4, amlFlag: false, createdAt: '2026-05-24T20:00:00Z', status: 'completed' },
  { id: 'TXN-10014', customerId: 'CUST-001', accountId: 'ACC-001', reference: 'REF-A10014', description: 'Pharmacy — Medplus', amount: 12500, transactionType: 'debit', category: 'Healthcare', channel: 'POS Terminal', merchantName: 'Medplus', location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 2, amlFlag: false, createdAt: '2026-05-23T11:00:00Z', status: 'completed' },
  { id: 'TXN-10015', customerId: 'CUST-001', accountId: 'ACC-001', reference: 'REF-A10015', description: 'Mobile Money Transfer to Fatima', amount: 75000, transactionType: 'debit', category: 'Mobile Money', channel: 'Mobile Money', merchantName: null, location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 12, amlFlag: false, createdAt: '2026-05-22T15:30:00Z', status: 'completed' },

  // CUST-002 Emeka — transactions
  { id: 'TXN-20001', customerId: 'CUST-002', accountId: 'ACC-004', reference: 'REF-B20001', description: 'Salary Credit — TechCorp Ltd', amount: 280000, transactionType: 'credit', category: 'Income', channel: 'Internet Banking', merchantName: 'TechCorp Ltd', location: 'Abuja, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 2, amlFlag: false, createdAt: '2026-06-03T08:30:00Z', status: 'completed' },
  { id: 'TXN-20002', customerId: 'CUST-002', accountId: 'ACC-004', reference: 'REF-B20002', description: 'Transfer to Adaeze Okonkwo', amount: 50000, transactionType: 'debit', category: 'Transfer', channel: 'Mobile App', merchantName: null, location: 'Abuja, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 6, amlFlag: false, createdAt: '2026-06-01T16:40:00Z', status: 'completed' },
  { id: 'TXN-20003', customerId: 'CUST-002', accountId: 'ACC-004', reference: 'REF-B20003', description: 'Airtel Airtime Purchase', amount: 2000, transactionType: 'debit', category: 'Airtime', channel: 'USSD', merchantName: 'Airtel', location: 'Abuja, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 1, amlFlag: false, createdAt: '2026-05-31T12:00:00Z', status: 'completed' },
  { id: 'TXN-20004', customerId: 'CUST-002', accountId: 'ACC-004', reference: 'REF-B20004', description: 'Uber Ride — Wuse to Maitama', amount: 4500, transactionType: 'debit', category: 'Transport', channel: 'Mobile App', merchantName: 'Uber', location: 'Abuja, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 2, amlFlag: false, createdAt: '2026-05-30T18:00:00Z', status: 'completed' },
  { id: 'TXN-20005', customerId: 'CUST-002', accountId: 'ACC-004', reference: 'REF-B20005', description: 'POS Purchase — Shoprite Abuja', amount: 28000, transactionType: 'debit', category: 'Shopping', channel: 'POS Terminal', merchantName: 'Shoprite', location: 'Abuja, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 4, amlFlag: false, createdAt: '2026-05-29T14:30:00Z', status: 'completed' },
  { id: 'TXN-20006', customerId: 'CUST-002', accountId: 'ACC-004', reference: 'REF-B20006', description: 'Suspicious Login — New Device Transfer', amount: 180000, transactionType: 'debit', category: 'Transfer', channel: 'Internet Banking', merchantName: null, location: 'Port Harcourt, NG', fraudFlag: true, fraudType: 'Account Takeover Attempt', fraudRiskScore: 94, amlFlag: false, createdAt: '2026-06-02T03:15:00Z', status: 'blocked' },

  // CUST-003 Fatima — transactions
  { id: 'TXN-30001', customerId: 'CUST-003', accountId: 'ACC-005', reference: 'REF-C30001', description: 'Farm Produce Sales — Kano Market', amount: 1200000, transactionType: 'credit', category: 'Income', channel: 'Mobile Money', merchantName: null, location: 'Kano, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 5, amlFlag: false, createdAt: '2026-06-02T10:00:00Z', status: 'completed' },
  { id: 'TXN-30002', customerId: 'CUST-003', accountId: 'ACC-005', reference: 'REF-C30002', description: 'Fertilizer Purchase — AgriSupply Ltd', amount: 450000, transactionType: 'debit', category: 'Shopping', channel: 'Internet Banking', merchantName: 'AgriSupply Ltd', location: 'Kano, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 8, amlFlag: false, createdAt: '2026-06-01T09:00:00Z', status: 'completed' },
  { id: 'TXN-30003', customerId: 'CUST-003', accountId: 'ACC-005', reference: 'REF-C30003', description: 'Mobile Money Transfer — Received from Adaeze', amount: 75000, transactionType: 'credit', category: 'Mobile Money', channel: 'Mobile Money', merchantName: null, location: 'Kano, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 10, amlFlag: false, createdAt: '2026-05-22T15:35:00Z', status: 'completed' },
  { id: 'TXN-30004', customerId: 'CUST-003', accountId: 'ACC-005', reference: 'REF-C30004', description: 'NEPA Electricity Bill', amount: 35000, transactionType: 'debit', category: 'Bills', channel: 'USSD', merchantName: 'NEPA', location: 'Kano, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 1, amlFlag: false, createdAt: '2026-05-28T08:00:00Z', status: 'completed' },
  { id: 'TXN-30005', customerId: 'CUST-003', accountId: 'ACC-005', reference: 'REF-C30005', description: 'Loan Disbursement — LOAN-4419', amount: 8000000, transactionType: 'credit', category: 'Loan', channel: 'Internet Banking', merchantName: null, location: 'Kano, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 3, amlFlag: false, createdAt: '2026-05-20T11:00:00Z', status: 'completed' },

  // CUST-004 Kwame — transactions (Ghana)
  { id: 'TXN-40001', customerId: 'CUST-004', accountId: 'ACC-006', reference: 'REF-D40001', description: 'Market Sales — Accra Central', amount: 1800, transactionType: 'credit', category: 'Income', channel: 'Mobile Money', merchantName: null, location: 'Accra, GH', fraudFlag: false, fraudType: null, fraudRiskScore: 15, amlFlag: false, createdAt: '2026-06-03T07:00:00Z', status: 'completed' },
  { id: 'TXN-40002', customerId: 'CUST-004', accountId: 'ACC-006', reference: 'REF-D40002', description: 'Unusual Cross-border Transfer', amount: 890000, transactionType: 'debit', category: 'Transfer', channel: 'Internet Banking', merchantName: null, location: 'Accra, GH', fraudFlag: true, fraudType: 'Unusual Cross-border', fraudRiskScore: 78, amlFlag: true, createdAt: '2026-06-01T22:00:00Z', status: 'review' },
  { id: 'TXN-40003', customerId: 'CUST-004', accountId: 'ACC-006', reference: 'REF-D40003', description: 'MTN Mobile Money Withdrawal', amount: 500, transactionType: 'debit', category: 'Mobile Money', channel: 'Mobile Money', merchantName: 'MTN MoMo', location: 'Accra, GH', fraudFlag: false, fraudType: null, fraudRiskScore: 5, amlFlag: false, createdAt: '2026-05-30T10:00:00Z', status: 'completed' },

  // CUST-005 Ngozi Eze — corporate transactions
  { id: 'TXN-50001', customerId: 'CUST-005', accountId: 'ACC-007', reference: 'REF-E50001', description: 'Bulk Payment — Supplier Settlement', amount: 4500000, transactionType: 'debit', category: 'Transfer', channel: 'Internet Banking', merchantName: 'Multiple Suppliers', location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 12, amlFlag: false, createdAt: '2026-06-03T10:00:00Z', status: 'completed' },
  { id: 'TXN-50002', customerId: 'CUST-005', accountId: 'ACC-007', reference: 'REF-E50002', description: 'Export Revenue — EU Client', amount: 12400000, transactionType: 'credit', category: 'Income', channel: 'Internet Banking', merchantName: 'EU Imports GmbH', location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 8, amlFlag: false, createdAt: '2026-06-02T14:00:00Z', status: 'completed' },
  { id: 'TXN-50003', customerId: 'CUST-005', accountId: 'ACC-007', reference: 'REF-E50003', description: 'Loan Repayment — LOAN-4417', amount: 850000, transactionType: 'debit', category: 'Loan', channel: 'Internet Banking', merchantName: null, location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 1, amlFlag: false, createdAt: '2026-06-01T08:00:00Z', status: 'completed' },
  { id: 'TXN-50004', customerId: 'CUST-005', accountId: 'ACC-007', reference: 'REF-E50004', description: 'Payroll Processing — 45 Staff', amount: 9800000, transactionType: 'debit', category: 'Transfer', channel: 'Internet Banking', merchantName: null, location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 5, amlFlag: false, createdAt: '2026-05-31T09:00:00Z', status: 'completed' },

  // CUST-007 Chioma Holdings — AML flagged
  { id: 'TXN-70001', customerId: 'CUST-007', accountId: 'ACC-009', reference: 'REF-G70001', description: 'Real Estate Sale Proceeds', amount: 12400000, transactionType: 'credit', category: 'Income', channel: 'Internet Banking', merchantName: null, location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 22, amlFlag: true, createdAt: '2026-06-02T11:00:00Z', status: 'completed' },
  { id: 'TXN-70002', customerId: 'CUST-007', accountId: 'ACC-009', reference: 'REF-G70002', description: 'Offshore Transfer — BVI Account', amount: 8900000, transactionType: 'debit', category: 'Transfer', channel: 'Internet Banking', merchantName: null, location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 45, amlFlag: true, createdAt: '2026-06-02T11:30:00Z', status: 'review' },
  { id: 'TXN-70003', customerId: 'CUST-007', accountId: 'ACC-009', reference: 'REF-G70003', description: 'Cash Deposit — Structured', amount: 4800000, transactionType: 'credit', category: 'Income', channel: 'Branch', merchantName: null, location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 68, amlFlag: true, createdAt: '2026-06-01T15:00:00Z', status: 'completed' },

  // CUST-008 Ade Enterprises — structuring
  { id: 'TXN-80001', customerId: 'CUST-008', accountId: 'ACC-010', reference: 'REF-H80001', description: 'Cash Deposit — Below Threshold', amount: 4800000, transactionType: 'credit', category: 'Income', channel: 'Branch', merchantName: null, location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 72, amlFlag: true, createdAt: '2026-06-03T09:00:00Z', status: 'completed' },
  { id: 'TXN-80002', customerId: 'CUST-008', accountId: 'ACC-010', reference: 'REF-H80002', description: 'Cash Deposit — Below Threshold (2)', amount: 4750000, transactionType: 'credit', category: 'Income', channel: 'Branch', merchantName: null, location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 74, amlFlag: true, createdAt: '2026-06-03T11:00:00Z', status: 'completed' },
  { id: 'TXN-80003', customerId: 'CUST-008', accountId: 'ACC-010', reference: 'REF-H80003', description: 'International Wire — Suspicious Beneficiary', amount: 2100000, transactionType: 'debit', category: 'Transfer', channel: 'Internet Banking', merchantName: null, location: 'Lagos, NG', fraudFlag: false, fraudType: null, fraudRiskScore: 88, amlFlag: true, createdAt: '2026-06-02T16:00:00Z', status: 'blocked' },
];

// ─── Loan Applications ────────────────────────────────────────────────────────
export const DEMO_LOANS: DemoLoanApplication[] = [
  { id: 'LOAN-4421', customerId: 'CUST-001', applicantName: 'Adaeze Okonkwo', loanType: 'MSME', amount: 2500000, purpose: 'Working capital for retail trade expansion', creditScore: 742, riskGrade: 'Low', status: 'approved', interestRate: 18.5, tenure: 24, monthlyPayment: 125000, sector: 'Retail Trade', monthlyIncome: 850000, appliedAt: '2026-06-03T10:00:00Z', alternativeData: 'Regular mobile money transactions ₦2.1M/month avg, utility bills paid on time 24 months, active savings group member' },
  { id: 'LOAN-4420', customerId: 'CUST-002', applicantName: 'Emeka Nwosu', loanType: 'Personal', amount: 500000, purpose: 'Home renovation', creditScore: 618, riskGrade: 'Medium', status: 'review', interestRate: 22.0, tenure: 12, monthlyPayment: 47000, sector: 'Salary Earner', monthlyIncome: 280000, appliedAt: '2026-06-03T09:35:00Z', alternativeData: 'Consistent salary deposits, 2 active loans, moderate utilization' },
  { id: 'LOAN-4419', customerId: 'CUST-003', applicantName: 'Fatima Al-Hassan', loanType: 'MSME', amount: 8000000, purpose: 'Agricultural equipment purchase', creditScore: 589, riskGrade: 'Medium', status: 'review', interestRate: 20.5, tenure: 36, monthlyPayment: 295000, sector: 'Agriculture', monthlyIncome: 1200000, appliedAt: '2026-06-03T08:00:00Z', alternativeData: 'Seasonal income pattern, strong mobile money history, cooperative member' },
  { id: 'LOAN-4418', customerId: 'CUST-004', applicantName: 'Kwame Asante', loanType: 'Personal', amount: 200000, purpose: 'Business stock purchase', creditScore: 481, riskGrade: 'High', status: 'declined', interestRate: 0, tenure: 0, monthlyPayment: 0, sector: 'Informal', monthlyIncome: 95000, appliedAt: '2026-06-02T14:00:00Z', alternativeData: 'Irregular income, no formal credit history, pending KYC' },
  { id: 'LOAN-4417', customerId: 'CUST-005', applicantName: 'Ngozi Eze Trading Co.', loanType: 'MSME', amount: 15000000, purpose: 'Factory expansion — new production line', creditScore: 801, riskGrade: 'Low', status: 'disbursed', interestRate: 16.5, tenure: 48, monthlyPayment: 425000, sector: 'Manufacturing', monthlyIncome: 4500000, appliedAt: '2026-06-01T11:00:00Z', alternativeData: 'Excellent repayment history, strong export revenue, 6 years banking relationship' },
  { id: 'LOAN-4416', customerId: 'CUST-006', applicantName: 'Ibrahim Musa', loanType: 'Personal', amount: 750000, purpose: 'Vehicle purchase', creditScore: 655, riskGrade: 'Low', status: 'approved', interestRate: 20.0, tenure: 18, monthlyPayment: 48000, sector: 'Civil Service', monthlyIncome: 420000, appliedAt: '2026-06-01T09:00:00Z', alternativeData: 'Government salary earner, no existing loans, consistent savings' },
];

// ─── Fraud Cases ──────────────────────────────────────────────────────────────
export const DEMO_FRAUD_CASES: DemoFraudCase[] = [
  { id: 'FRD-8821', transactionId: 'TXN-20006', customerId: 'CUST-002', customerName: 'Emeka Nwosu', fraudType: 'Account Takeover', amount: 180000, location: 'Port Harcourt, NG', channel: 'Internet Banking', riskScore: 94, status: 'blocked', biometric: 'Failed', stepUp: 'Triggered', detectedAt: '2026-06-02T03:15:00Z' },
  { id: 'FRD-8820', transactionId: 'TXN-40002', customerId: 'CUST-004', customerName: 'Kwame Asante', fraudType: 'Unusual Cross-border Transfer', amount: 890000, location: 'Accra, GH', channel: 'Internet Banking', riskScore: 78, status: 'review', biometric: 'N/A', stepUp: 'Pending', detectedAt: '2026-06-01T22:00:00Z' },
  { id: 'FRD-8819', transactionId: 'TXN-10004', customerId: 'CUST-001', customerName: 'Adaeze Okonkwo', fraudType: 'Unusual ATM Time (2:22 AM)', amount: 100000, location: 'Lagos, NG', channel: 'ATM', riskScore: 87, status: 'review', biometric: 'N/A', stepUp: 'Triggered', detectedAt: '2026-06-02T02:22:00Z' },
  { id: 'FRD-8818', transactionId: 'TXN-80003', customerId: 'CUST-008', customerName: 'Ade Enterprises Ltd', fraudType: 'Suspicious International Wire', amount: 2100000, location: 'Lagos, NG', channel: 'Internet Banking', riskScore: 88, status: 'blocked', biometric: 'N/A', stepUp: 'N/A', detectedAt: '2026-06-02T16:00:00Z' },
  { id: 'FRD-8817', transactionId: 'TXN-70002', customerId: 'CUST-007', customerName: 'Chioma Holdings Ltd', fraudType: 'Offshore Transfer — PEP Exposure', amount: 8900000, location: 'Lagos, NG', channel: 'Internet Banking', riskScore: 72, status: 'escalated', biometric: 'N/A', stepUp: 'Pending', detectedAt: '2026-06-02T11:30:00Z' },
  { id: 'FRD-8816', transactionId: 'TXN-80001', customerId: 'CUST-008', customerName: 'Ade Enterprises Ltd', fraudType: 'Structuring — Cash Deposits', amount: 4800000, location: 'Lagos, NG', channel: 'Branch', riskScore: 72, status: 'review', biometric: 'N/A', stepUp: 'N/A', detectedAt: '2026-06-03T09:00:00Z' },
];

// ─── AML Alerts ───────────────────────────────────────────────────────────────
export const DEMO_AML_ALERTS: DemoAmlAlert[] = [
  { id: 'AML-2241', customerId: 'CUST-008', customerName: 'Ade Enterprises Ltd', alertType: 'Structuring', amount: 9550000, currency: 'NGN', riskLevel: 'High', status: 'investigating', jurisdiction: 'Nigeria', detectedAt: '2026-06-03T11:00:00Z', relatedTransactionIds: ['TXN-80001', 'TXN-80002'] },
  { id: 'AML-2240', customerId: 'CUST-004', customerName: 'Kwame Asante', alertType: 'Unusual Cross-border Pattern', amount: 890000, currency: 'GHS', riskLevel: 'Medium', status: 'cleared', jurisdiction: 'Ghana', detectedAt: '2026-06-01T22:00:00Z', relatedTransactionIds: ['TXN-40002'] },
  { id: 'AML-2239', customerId: 'CUST-007', customerName: 'Chioma Holdings Ltd', alertType: 'PEP Exposure — Offshore Transfer', amount: 12400000, currency: 'NGN', riskLevel: 'High', status: 'escalated', jurisdiction: 'Nigeria', detectedAt: '2026-06-02T11:00:00Z', relatedTransactionIds: ['TXN-70001', 'TXN-70002'] },
  { id: 'AML-2238', customerId: 'CUST-008', customerName: 'Ade Enterprises Ltd', alertType: 'Sanctions Match — Beneficiary', amount: 2100000, currency: 'NGN', riskLevel: 'Critical', status: 'blocked', jurisdiction: 'Global', detectedAt: '2026-06-02T16:00:00Z', relatedTransactionIds: ['TXN-80003'] },
  { id: 'AML-2237', customerId: 'CUST-007', customerName: 'Chioma Holdings Ltd', alertType: 'Cash Threshold — Structured Deposits', amount: 4800000, currency: 'NGN', riskLevel: 'Medium', status: 'reported', jurisdiction: 'Nigeria', detectedAt: '2026-06-01T15:00:00Z', relatedTransactionIds: ['TXN-70003'] },
  { id: 'AML-2236', customerId: 'CUST-004', customerName: 'Kwame Asante', alertType: 'Cross-border Velocity', amount: 890000, currency: 'GHS', riskLevel: 'High', status: 'investigating', jurisdiction: 'Ghana', detectedAt: '2026-06-01T22:00:00Z', relatedTransactionIds: ['TXN-40002'] },
];

// ─── Derived Analytics ────────────────────────────────────────────────────────
export const CHANNEL_TRANSACTION_VOLUME = [
  { channel: 'Mobile App', count: 8420, volume: 2840000, fraudRate: 0.8 },
  { channel: 'Internet Banking', count: 5210, volume: 48200000, fraudRate: 1.2 },
  { channel: 'POS Terminal', count: 12400, volume: 3100000, fraudRate: 0.4 },
  { channel: 'ATM', count: 3800, volume: 1900000, fraudRate: 2.1 },
  { channel: 'USSD', count: 6700, volume: 890000, fraudRate: 0.3 },
  { channel: 'Mobile Money', count: 9200, volume: 4600000, fraudRate: 1.5 },
  { channel: 'Branch', count: 1200, volume: 18400000, fraudRate: 0.9 },
];

export const DAILY_TRANSACTION_TREND = [
  { date: 'May 28', transactions: 38200, fraudFlags: 42, amount: 8400000 },
  { date: 'May 29', transactions: 41500, fraudFlags: 38, amount: 9200000 },
  { date: 'May 30', transactions: 39800, fraudFlags: 45, amount: 8800000 },
  { date: 'May 31', transactions: 44200, fraudFlags: 51, amount: 10100000 },
  { date: 'Jun 01', transactions: 47800, fraudFlags: 48, amount: 11200000 },
  { date: 'Jun 02', transactions: 52100, fraudFlags: 62, amount: 12400000 },
  { date: 'Jun 03', transactions: 55400, fraudFlags: 58, amount: 13800000 },
];

export const CATEGORY_SPEND_BREAKDOWN = [
  { name: 'Food & Dining', value: 28, color: '#F47558', totalNGN: 37828000 },
  { name: 'Shopping', value: 22, color: '#1B365D', totalNGN: 29722000 },
  { name: 'Transport', value: 18, color: '#00C896', totalNGN: 24318000 },
  { name: 'Utilities & Bills', value: 15, color: '#FFB020', totalNGN: 20265000 },
  { name: 'Healthcare', value: 10, color: '#7C3AED', totalNGN: 13510000 },
  { name: 'Others', value: 7, color: '#94A3B8', totalNGN: 9457000 },
];

// ─── Helper Functions ─────────────────────────────────────────────────────────
export function getCustomerTransactions(customerId: string): DemoTransaction[] {
  return DEMO_TRANSACTIONS.filter(t => t.customerId === customerId);
}

export function getCustomerLoans(customerId: string): DemoLoanApplication[] {
  return DEMO_LOANS.filter(l => l.customerId === customerId);
}

export function getFlaggedTransactions(): DemoTransaction[] {
  return DEMO_TRANSACTIONS.filter(t => t.fraudFlag || t.amlFlag);
}

export function getCustomerById(id: string): DemoCustomer | undefined {
  return DEMO_CUSTOMERS.find(c => c.id === id);
}

export function fmtNGN(amount: number, currency = 'NGN'): string {
  const symbol = currency === 'GHS' ? 'GH₵' : '₦';
  return `${symbol}${new Intl.NumberFormat('en-NG', { maximumFractionDigits: 0 }).format(Math.abs(amount))}`;
}

export function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}
