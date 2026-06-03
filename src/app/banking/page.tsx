'use client';
import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useChat } from '@/lib/hooks/useChat';
import toast from 'react-hot-toast';
import MarkdownMessage from '@/components/ui/MarkdownMessage';
import { DEMO_CUSTOMERS, DEMO_ACCOUNTS, CATEGORY_SPEND_BREAKDOWN, getCustomerTransactions, getCustomerLoans, fmtNGN, fmtDate, type DemoAccount, type DemoTransaction, type DemoLoanApplication,  } from '@/lib/demo/bankingData';

// ─── Types ───────────────────────────────────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

// ─── Static chart data (derived from shared demo data) ───────────────────────
const spendingData = [
  { month: 'Jan', income: 850000, expenses: 420000 },
  { month: 'Feb', income: 920000, expenses: 510000 },
  { month: 'Mar', income: 780000, expenses: 390000 },
  { month: 'Apr', income: 1050000, expenses: 620000 },
  { month: 'May', income: 960000, expenses: 480000 },
  { month: 'Jun', income: 1120000, expenses: 540000 },
];

const cashFlowForecast = [
  { week: 'W1', predicted: 280000, actual: 265000 },
  { week: 'W2', predicted: 310000, actual: 298000 },
  { week: 'W3', predicted: 295000, actual: null },
  { week: 'W4', predicted: 340000, actual: null },
];

const savingsGoals = [
  { id: '1', name: 'Emergency Fund', target: 1500000, current: 847250, color: '#00C896', icon: '🛡️' },
  { id: '2', name: 'New Car', target: 8000000, current: 2100000, color: '#F47558', icon: '🚗' },
  { id: '3', name: 'Vacation', target: 500000, current: 380000, color: '#FFB020', icon: '✈️' },
];

const aiInsights = [
  { id: '1', type: 'saving', title: 'Save ₦18,400/month', body: 'Switching your DSTV plan could save ₦18,400 annually based on your viewing patterns.', icon: '💡', color: 'bg-amber-50 border-amber-200' },
  { id: '2', type: 'alert', title: 'Unusual ATM Activity (TXN-10004)', body: 'ATM withdrawal of ₦100,000 at 2:22 AM flagged by Fraud Detection Agent. Risk score: 87/100. Confirm or report fraud.', icon: '⚠️', color: 'bg-red-50 border-red-200' },
  { id: '3', type: 'forecast', title: 'Cash Flow Forecast', body: 'Based on your patterns, you will have ₦340,000 available next week — 12% above your monthly average.', icon: '📈', color: 'bg-blue-50 border-blue-200' },
  { id: '4', type: 'product', title: 'Fixed Deposit Opportunity', body: 'Your savings balance qualifies for a 14.5% p.a. Fixed Deposit. Lock in ₦500,000 to earn ₦72,500 in 12 months.', icon: '🏦', color: 'bg-green-50 border-green-200' },
  { id: '5', type: 'loan', title: 'Loan Pre-Approved (LOAN-4421)', body: 'Your ₦2.5M MSME loan at 18.5% p.a. has been approved. Monthly repayment: ₦125,000 over 24 months.', icon: '✅', color: 'bg-green-50 border-green-200' },
];

const TABS = ['Dashboard', 'Accounts', 'Transactions', 'AI Assistant', 'Savings', 'Payments', 'Loans'] as const;
type Tab = typeof TABS[number];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return fmtNGN(n);
}

// ─── Sub-components ──────────────────────────────────────────────────────────
function AccountCard({ account, selected, onClick }: { account: DemoAccount; selected: boolean; onClick: () => void }) {
  const typeColors: Record<string, string> = { current: '#1B365D', savings: '#00C896', fixed_deposit: '#F47558', domiciliary: '#7C3AED' };
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-2xl p-5 border-2 transition-all duration-200 ${selected ? 'border-[#F47558] shadow-lg' : 'border-transparent'}`}
      style={{ background: `linear-gradient(135deg, ${typeColors[account.accountType]}ee, ${typeColors[account.accountType]}99)` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="text-white/70 text-xs font-medium uppercase tracking-wider">{account.accountType.replace('_', ' ')}</p>
          <p className="text-white font-semibold text-sm mt-0.5">{account.accountName}</p>
        </div>
        {account.isPrimary && <span className="bg-white/20 text-white text-xs px-2 py-0.5 rounded-full">Primary</span>}
      </div>
      <p className="text-white text-2xl font-bold">{fmt(account.balance)}</p>
      <p className="text-white/60 text-xs mt-1">{account.accountNumber}</p>
    </button>
  );
}

function TransactionRow({ tx }: { tx: DemoTransaction }) {
  const isCredit = tx.transactionType === 'credit';
  const statusColors: Record<string, string> = { completed: '', pending: 'bg-yellow-50 border border-yellow-100', failed: 'bg-gray-50', blocked: 'bg-red-50 border border-red-200' };
  return (
    <div className={`flex items-center gap-4 py-3 px-4 rounded-xl hover:bg-gray-50 transition-colors ${tx.fraudFlag ? 'bg-red-50 border border-red-100' : statusColors[tx.status] || ''}`}>
      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCredit ? 'bg-green-100' : 'bg-gray-100'}`}>
        <span className="text-lg">{isCredit ? '↓' : '↑'}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-gray-800 truncate">{tx.description}</p>
          {tx.fraudFlag && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full flex-shrink-0">⚠ Fraud Flag</span>}
          {tx.amlFlag && <span className="text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded-full flex-shrink-0">🔍 AML</span>}
          {tx.status === 'blocked' && <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded-full flex-shrink-0">Blocked</span>}
        </div>
        <p className="text-xs text-gray-400">{tx.category} · {tx.channel} · {fmtDate(tx.createdAt)}</p>
        <p className="text-xs text-gray-300">{tx.reference}</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`text-sm font-semibold ${isCredit ? 'text-green-600' : 'text-gray-700'}`}>
          {isCredit ? '+' : '-'}{fmt(tx.amount)}
        </p>
        {tx.fraudRiskScore > 50 && (
          <p className="text-xs text-red-500">Risk: {tx.fraudRiskScore}/100</p>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function BankingPortal() {
  const primaryCustomer = DEMO_CUSTOMERS[0]; // Adaeze Okonkwo
  const customerAccounts = DEMO_ACCOUNTS.filter(a => a.customerId === primaryCustomer.id);
  const customerTransactions = getCustomerTransactions(primaryCustomer.id);
  const customerLoans = getCustomerLoans(primaryCustomer.id);
  const flaggedCount = customerTransactions.filter(t => t.fraudFlag).length;

  const [activeTab, setActiveTab] = useState<Tab>('Dashboard');
  const [selectedAccount, setSelectedAccount] = useState(customerAccounts[0]);
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { role: 'assistant', content: `Hello ${primaryCustomer.name.split(' ')[0]}! 👋 I'm your AI banking assistant powered by SmartBankAI. I can help you with account queries, spending analysis, loan applications, and financial advice. You have ${customerAccounts.length} accounts with a total balance of ${fmt(customerAccounts.reduce((s, a) => s + a.balance, 0))}. How can I help you today?` }
  ]);
  const [transferForm, setTransferForm] = useState({ to: '', amount: '', note: '' });
  const [billForm, setBillForm] = useState({ biller: '', accountNo: '', amount: '' });
  const [loanForm, setLoanForm] = useState({ amount: '', purpose: '', tenure: '12' });
  const [loanResult, setLoanResult] = useState<null | { approved: boolean; rate: number; monthly: number }>(null);
  const [txFilter, setTxFilter] = useState<'all' | 'credit' | 'debit' | 'flagged'>('all');
  const [txSearch, setTxSearch] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { response, isLoading: aiLoading, error: aiError, sendMessage } = useChat('ANTHROPIC', 'claude-sonnet-4-6', true);

  useEffect(() => {
    if (aiError) toast.error('AI assistant unavailable. Please try again.');
  }, [aiError]);

  useEffect(() => {
    if (response && !aiLoading) {
      setChatHistory(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && last.content === '...') {
          return [...prev.slice(0, -1), { role: 'assistant', content: response, timestamp: new Date() }];
        }
        return prev;
      });
    }
  }, [response, aiLoading]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleChatSend = () => {
    if (!chatInput.trim() || aiLoading) return;
    const userMsg: ChatMessage = { role: 'user', content: chatInput, timestamp: new Date() };
    const placeholder: ChatMessage = { role: 'assistant', content: '...', timestamp: new Date() };
    setChatHistory(prev => [...prev, userMsg, placeholder]);
    const txSummary = customerTransactions.slice(0, 5).map(t => `${t.description}: ${t.transactionType === 'credit' ? '+' : '-'}${fmt(t.amount)}`).join(', ');
    const messages = [
      { role: 'system' as const, content: `You are an intelligent AI banking assistant for SmartBankAI. Customer: ${primaryCustomer.name}, Credit Score: ${primaryCustomer.creditScore}, Segment: ${primaryCustomer.segment}. Accounts: Primary Current ₦${customerAccounts[0]?.balance?.toLocaleString()}, Savings ₦${customerAccounts[1]?.balance?.toLocaleString()}, Fixed Deposit ₦${customerAccounts[2]?.balance?.toLocaleString()}. Recent transactions: ${txSummary}. Flagged transactions: ${flaggedCount}. Active loan: LOAN-4421 ₦2.5M approved at 18.5% p.a. Be concise, helpful, and professional. Use Nigerian Naira (₦).` },
      ...chatHistory.filter(m => m.content !== '...').map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: chatInput }
    ];
    sendMessage(messages, { max_tokens: 400, temperature: 0.7 });
    setChatInput('');
  };

  const handleLoanCheck = () => {
    const amt = parseFloat(loanForm.amount);
    if (!amt || amt <= 0) return;
    const rate = amt > 2000000 ? 18.5 : 22.0;
    const monthly = (amt * (rate / 100 / 12)) / (1 - Math.pow(1 + rate / 100 / 12, -parseInt(loanForm.tenure)));
    setLoanResult({ approved: amt <= 5000000, rate, monthly });
  };

  const totalBalance = customerAccounts.reduce((s, a) => s + a.balance, 0);

  const filteredTransactions = customerTransactions.filter(tx => {
    const matchesFilter = txFilter === 'all' || (txFilter === 'credit' && tx.transactionType === 'credit') || (txFilter === 'debit' && tx.transactionType === 'debit') || (txFilter === 'flagged' && (tx.fraudFlag || tx.amlFlag));
    const matchesSearch = !txSearch || tx.description.toLowerCase().includes(txSearch.toLowerCase()) || tx.category.toLowerCase().includes(txSearch.toLowerCase()) || tx.reference.toLowerCase().includes(txSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F4F6FA] font-sans">
      {/* Top Bar */}
      <header className="bg-[#1B365D] text-white px-6 py-4 flex items-center justify-between sticky top-0 z-30 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-lg bg-[#F47558] flex items-center justify-center">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M12 12h.01" /></svg>
          </div>
          <div>
            <p className="font-bold text-sm leading-none">SmartBankAI</p>
            <p className="text-white/50 text-xs">Web Banking Portal</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-1">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab ? 'bg-[#F47558] text-white' : 'text-white/70 hover:text-white hover:bg-white/10'}`}>
              {tab}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            </button>
            {flaggedCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#F47558] rounded-full text-white text-xs flex items-center justify-center">{flaggedCount}</span>}
          </div>
          <div className="w-8 h-8 rounded-full bg-[#F47558] flex items-center justify-center text-white text-sm font-bold">{primaryCustomer.name[0]}</div>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-2 overflow-x-auto flex gap-2">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${activeTab === tab ? 'bg-[#1B365D] text-white' : 'text-gray-500 hover:text-gray-800'}`}>
            {tab}
          </button>
        ))}
      </div>

      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* ── DASHBOARD ── */}
        {activeTab === 'Dashboard' && (
          <div className="space-y-6">
            {/* Welcome + Total Balance */}
            <div className="bg-gradient-to-r from-[#1B365D] to-[#2a4a7f] rounded-2xl p-6 text-white">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <p className="text-white/60 text-sm">Good morning, {primaryCustomer.name.split(' ')[0]} 👋</p>
                  <p className="text-3xl font-bold mt-1">{fmt(totalBalance)}</p>
                  <p className="text-white/60 text-sm mt-1">Total across {customerAccounts.length} accounts · Credit Score: <span className="text-[#00C896] font-semibold">{primaryCustomer.creditScore}</span></p>
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button onClick={() => setActiveTab('Payments')} className="bg-[#F47558] hover:bg-[#e06548] text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">Send Money</button>
                  <button onClick={() => setActiveTab('Payments')} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">Pay Bills</button>
                  {flaggedCount > 0 && <button onClick={() => setActiveTab('Transactions')} className="bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">⚠ {flaggedCount} Flagged</button>}
                </div>
              </div>
            </div>

            {/* Account Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {customerAccounts.map(acc => (
                <AccountCard key={acc.id} account={acc} selected={selectedAccount.id === acc.id} onClick={() => setSelectedAccount(acc)} />
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-[#1B365D]">Income vs Expenses</h3>
                    <p className="text-xs text-gray-400">Last 6 months · Powered by Smart Dashboard Agent</p>
                  </div>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">+8.4% vs last period</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={spendingData}>
                    <defs>
                      <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1B365D" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#1B365D" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F47558" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#F47558" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`} />
                    <Tooltip formatter={(v: number) => fmt(v)} />
                    <Area type="monotone" dataKey="income" stroke="#1B365D" fill="url(#incomeGrad)" strokeWidth={2} name="Income" />
                    <Area type="monotone" dataKey="expenses" stroke="#F47558" fill="url(#expGrad)" strokeWidth={2} name="Expenses" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-[#1B365D] mb-1">Spending by Category</h3>
                <p className="text-xs text-gray-400 mb-3">Personalization Agent analysis</p>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={CATEGORY_SPEND_BREAKDOWN} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value">
                      {CATEGORY_SPEND_BREAKDOWN.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => `${v}%`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1.5 mt-2">
                  {CATEGORY_SPEND_BREAKDOWN.slice(0, 4).map(c => (
                    <div key={c.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full" style={{ background: c.color }} />
                        <span className="text-gray-600">{c.name}</span>
                      </div>
                      <span className="font-medium text-gray-800">{c.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Insights + Recent Transactions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-lg bg-[#F47558]/10 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-[#F47558]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                  </div>
                  <h3 className="font-semibold text-[#1B365D]">AI Insights</h3>
                  <span className="ml-auto text-xs text-gray-400">Predictive Analytics Agent</span>
                </div>
                <div className="space-y-3">
                  {aiInsights.map(insight => (
                    <div key={insight.id} className={`rounded-xl p-3 border ${insight.color}`}>
                      <div className="flex items-start gap-2">
                        <span className="text-lg leading-none">{insight.icon}</span>
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{insight.title}</p>
                          <p className="text-xs text-gray-600 mt-0.5">{insight.body}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#1B365D]">Recent Transactions</h3>
                  <button onClick={() => setActiveTab('Transactions')} className="text-xs text-[#F47558] hover:underline">View all ({customerTransactions.length})</button>
                </div>
                <div className="space-y-1">
                  {customerTransactions.slice(0, 6).map(tx => <TransactionRow key={tx.id} tx={tx} />)}
                </div>
              </div>
            </div>

            {/* Cash Flow Forecast */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-[#1B365D]">Cash Flow Forecast</h3>
                  <p className="text-xs text-gray-400">Predictive Analytics Agent · 4-week outlook</p>
                </div>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">94.2% accuracy</span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={cashFlowForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₦${(v / 1000).toFixed(0)}k`} />
                  <Tooltip formatter={(v: number) => fmt(v)} />
                  <Bar dataKey="actual" fill="#1B365D" name="Actual" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="predicted" fill="#F47558" fillOpacity={0.6} name="Predicted" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── ACCOUNTS ── */}
        {activeTab === 'Accounts' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#1B365D]">My Accounts</h2>
              <p className="text-sm text-gray-500">Manage all your accounts in one place</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {customerAccounts.map(acc => (
                <AccountCard key={acc.id} account={acc} selected={selectedAccount.id === acc.id} onClick={() => setSelectedAccount(acc)} />
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1B365D] mb-4">{selectedAccount.accountName} — Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Available Balance', value: fmt(selectedAccount.balance) },
                  { label: 'Account Number', value: selectedAccount.accountNumber },
                  { label: 'Account Type', value: selectedAccount.accountType.replace('_', ' ').toUpperCase() },
                  { label: 'Currency', value: selectedAccount.currency },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs text-gray-400 mb-1">{item.label}</p>
                    <p className="font-semibold text-[#1B365D]">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <button onClick={() => setActiveTab('Payments')} className="bg-[#1B365D] text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-[#2a4a7f] transition-colors">Transfer Funds</button>
                <button className="border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Download Statement</button>
              </div>
            </div>
          </div>
        )}

        {/* ── TRANSACTIONS ── */}
        {activeTab === 'Transactions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#1B365D]">Transaction History</h2>
                <p className="text-sm text-gray-500">Fraud Detection Agent monitors all transactions in real-time · {customerTransactions.length} total</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {flaggedCount > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">⚠ {flaggedCount} flagged</span>}
                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">{customerTransactions.filter(t => t.transactionType === 'credit').length} credits</span>
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{customerTransactions.filter(t => t.transactionType === 'debit').length} debits</span>
              </div>
            </div>
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex gap-3 flex-wrap">
                <input
                  value={txSearch}
                  onChange={e => setTxSearch(e.target.value)}
                  placeholder="Search by description, category, reference..."
                  className="flex-1 min-w-48 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20"
                />
                <select
                  value={txFilter}
                  onChange={e => setTxFilter(e.target.value as typeof txFilter)}
                  className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="credit">Credits Only</option>
                  <option value="debit">Debits Only</option>
                  <option value="flagged">Flagged Only</option>
                </select>
              </div>
              <div className="divide-y divide-gray-50">
                {filteredTransactions.length > 0
                  ? filteredTransactions.map(tx => <TransactionRow key={tx.id} tx={tx} />)
                  : <p className="text-center text-gray-400 py-8 text-sm">No transactions match your filter</p>
                }
              </div>
            </div>
          </div>
        )}

        {/* ── AI ASSISTANT ── */}
        {activeTab === 'AI Assistant' && (
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#1B365D] flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              </div>
              <h2 className="text-xl font-bold text-[#1B365D]">AI Banking Assistant</h2>
              <p className="text-sm text-gray-500">Powered by SmartBankAI Conversational Agent · AI Engine</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col" style={{ height: '500px' }}>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-7 h-7 rounded-full bg-[#1B365D] flex items-center justify-center mr-2 flex-shrink-0 mt-1">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                      </div>
                    )}
                    <div className={`max-w-xs md:max-w-md rounded-2xl px-4 py-3 text-sm ${msg.role === 'user' ? 'bg-[#1B365D] text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                      {msg.content === '...' ? (
                        <div className="flex gap-1 items-center py-1">
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      ) : msg.role === 'assistant' ? (
                        <MarkdownMessage content={msg.content} />
                      ) : msg.content}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>

              {/* Quick prompts */}
              <div className="px-4 py-2 border-t border-gray-100 flex gap-2 overflow-x-auto">
                {['What\'s my balance?', 'Explain flagged transaction', 'Loan status LOAN-4421', 'Spending summary', 'Fraud alert details'].map(q => (
                  <button key={q} onClick={() => setChatInput(q)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full whitespace-nowrap transition-colors">
                    {q}
                  </button>
                ))}
              </div>

              <div className="p-4 border-t border-gray-100 flex gap-2">
                <input
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleChatSend()}
                  placeholder="Ask about your finances..."
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20"
                  disabled={aiLoading}
                />
                <button onClick={handleChatSend} disabled={aiLoading || !chatInput.trim()}
                  className="bg-[#1B365D] hover:bg-[#2a4a7f] disabled:opacity-50 text-white px-4 py-2.5 rounded-xl transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── SAVINGS ── */}
        {activeTab === 'Savings' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#1B365D]">Savings Goals</h2>
              <p className="text-sm text-gray-500">Personalization Agent tracks and optimizes your goals</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {savingsGoals.map(goal => {
                const pct = Math.round((goal.current / goal.target) * 100);
                return (
                  <div key={goal.id} className="bg-white rounded-2xl p-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{goal.icon}</span>
                      <div>
                        <p className="font-semibold text-[#1B365D]">{goal.name}</p>
                        <p className="text-xs text-gray-400">{pct}% complete</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                      <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: goal.color }} />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Saved: <span className="font-medium text-gray-800">{fmt(goal.current)}</span></span>
                      <span className="text-gray-500">Goal: <span className="font-medium text-gray-800">{fmt(goal.target)}</span></span>
                    </div>
                    <button className="mt-3 w-full bg-gray-50 hover:bg-gray-100 text-[#1B365D] text-sm font-medium py-2 rounded-xl transition-colors">Top Up</button>
                  </div>
                );
              })}
            </div>
            <button className="flex items-center gap-2 bg-[#1B365D] text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-[#2a4a7f] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Create New Goal
            </button>
          </div>
        )}

        {/* ── PAYMENTS ── */}
        {activeTab === 'Payments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Fund Transfer */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1B365D] mb-1">Fund Transfer</h3>
              <p className="text-xs text-gray-400 mb-5">Fraud Detection Agent monitors all transfers in real-time</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Recipient Account / Phone</label>
                  <input value={transferForm.to} onChange={e => setTransferForm(p => ({ ...p, to: e.target.value }))}
                    placeholder="0801234567 or account number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Amount (₦)</label>
                  <input value={transferForm.amount} onChange={e => setTransferForm(p => ({ ...p, amount: e.target.value }))}
                    placeholder="0.00" type="number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Note (optional)</label>
                  <input value={transferForm.note} onChange={e => setTransferForm(p => ({ ...p, note: e.target.value }))}
                    placeholder="What's this for?"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20" />
                </div>
                <button onClick={() => toast.success('Transfer initiated — Fraud Detection Agent screening in progress')}
                  className="w-full bg-[#1B365D] hover:bg-[#2a4a7f] text-white py-3 rounded-xl text-sm font-medium transition-colors">
                  Send Money
                </button>
              </div>
            </div>

            {/* Bill Payment */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="font-semibold text-[#1B365D] mb-1">Bill Payment</h3>
              <p className="text-xs text-gray-400 mb-5">Pay utilities, subscriptions, and more</p>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {['DSTV', 'EKEDC', 'MTN', 'Airtel', 'Water', 'Internet'].map(b => (
                  <button key={b} onClick={() => setBillForm(p => ({ ...p, biller: b }))}
                    className={`py-2.5 rounded-xl text-xs font-medium border transition-all ${billForm.biller === b ? 'bg-[#1B365D] text-white border-[#1B365D]' : 'border-gray-200 text-gray-600 hover:border-[#1B365D]/30'}`}>
                    {b}
                  </button>
                ))}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Account / Smart Card Number</label>
                  <input value={billForm.accountNo} onChange={e => setBillForm(p => ({ ...p, accountNo: e.target.value }))}
                    placeholder="Enter account number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 block mb-1">Amount (₦)</label>
                  <input value={billForm.amount} onChange={e => setBillForm(p => ({ ...p, amount: e.target.value }))}
                    placeholder="0.00" type="number"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20" />
                </div>
                <button onClick={() => toast.success(`${billForm.biller || 'Bill'} payment processed successfully`)}
                  className="w-full bg-[#F47558] hover:bg-[#e06548] text-white py-3 rounded-xl text-sm font-medium transition-colors">
                  Pay Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── LOANS ── */}
        {activeTab === 'Loans' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-[#1B365D]">Loan Applications</h2>
              <p className="text-sm text-gray-500">Credit Risk Agent assesses your eligibility in real-time</p>
            </div>

            {/* Existing Loans */}
            {customerLoans.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-[#1B365D] mb-4">Your Loan Applications</h3>
                <div className="space-y-3">
                  {customerLoans.map(loan => (
                    <div key={loan.id} className={`flex items-center justify-between p-4 rounded-xl border ${loan.status === 'approved' || loan.status === 'disbursed' ? 'bg-green-50 border-green-200' : loan.status === 'review' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200'}`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[#1B365D] text-sm">{loan.id}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${loan.status === 'approved' || loan.status === 'disbursed' ? 'bg-green-100 text-green-700' : loan.status === 'review' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{loan.status.toUpperCase()}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{loan.loanType} · {loan.purpose}</p>
                        {loan.status === 'approved' && <p className="text-xs text-gray-400 mt-0.5">{loan.interestRate}% p.a. · {loan.tenure} months · ₦{loan.monthlyPayment.toLocaleString()}/mo</p>}
                      </div>
                      <p className="font-bold text-[#1B365D]">{fmtNGN(loan.amount)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New Loan Application */}
            <div className="max-w-2xl bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-semibold text-[#1B365D]">Apply for New Loan</h3>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Loan Amount (₦)</label>
                <input value={loanForm.amount} onChange={e => setLoanForm(p => ({ ...p, amount: e.target.value }))}
                  placeholder="e.g. 1,000,000" type="number"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Purpose</label>
                <select value={loanForm.purpose} onChange={e => setLoanForm(p => ({ ...p, purpose: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20">
                  <option value="">Select purpose</option>
                  <option>Business Expansion</option>
                  <option>Personal</option>
                  <option>Education</option>
                  <option>Home Improvement</option>
                  <option>Vehicle Purchase</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 block mb-1">Tenure (months)</label>
                <select value={loanForm.tenure} onChange={e => setLoanForm(p => ({ ...p, tenure: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20">
                  {[6, 12, 18, 24, 36, 48, 60].map(t => <option key={t} value={t}>{t} months</option>)}
                </select>
              </div>
              <button onClick={handleLoanCheck}
                className="w-full bg-[#1B365D] hover:bg-[#2a4a7f] text-white py-3 rounded-xl text-sm font-medium transition-colors">
                Check Eligibility
              </button>
            </div>

            {loanResult && (
              <div className={`max-w-2xl rounded-2xl p-6 border-2 ${loanResult.approved ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{loanResult.approved ? '✅' : '❌'}</span>
                  <div>
                    <p className="font-bold text-lg text-[#1B365D]">{loanResult.approved ? 'Pre-Approved!' : 'Not Eligible'}</p>
                    <p className="text-sm text-gray-500">Credit Risk Agent assessment complete · Score: {primaryCustomer.creditScore}</p>
                  </div>
                </div>
                {loanResult.approved && (
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: 'Interest Rate', value: `${loanResult.rate}% p.a.` },
                      { label: 'Monthly Payment', value: fmt(loanResult.monthly) },
                      { label: 'Tenure', value: `${loanForm.tenure} months` },
                    ].map(item => (
                      <div key={item.label} className="bg-white rounded-xl p-3 text-center">
                        <p className="text-xs text-gray-400">{item.label}</p>
                        <p className="font-bold text-[#1B365D] mt-1">{item.value}</p>
                      </div>
                    ))}
                  </div>
                )}
                {loanResult.approved && (
                  <button onClick={() => toast.success('Loan application submitted for final review by Credit Risk Agent')}
                    className="mt-4 w-full bg-[#1B365D] text-white py-3 rounded-xl text-sm font-medium hover:bg-[#2a4a7f] transition-colors">
                    Proceed with Application
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
