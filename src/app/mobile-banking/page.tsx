'use client';
import React, { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useChat } from '@/lib/hooks/useChat';
import toast from 'react-hot-toast';
import MarkdownMessage from '@/components/ui/MarkdownMessage';
import { DEMO_CUSTOMERS, DEMO_ACCOUNTS, CATEGORY_SPEND_BREAKDOWN, getCustomerTransactions, fmtNGN, type DemoTransaction,  } from '@/lib/demo/bankingData';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Notification {
  id: string;
  type: 'fraud' | 'credit' | 'promo' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
  txId?: string;
}

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// ─── Primary customer data ────────────────────────────────────────────────────
const primaryCustomer = DEMO_CUSTOMERS[0]; // Adaeze Okonkwo
const customerAccounts = DEMO_ACCOUNTS.filter(a => a.customerId === primaryCustomer.id);
const customerTransactions = getCustomerTransactions(primaryCustomer.id);
const totalBalance = customerAccounts.reduce((s, a) => s + a.balance, 0);

// ─── Static chart data ────────────────────────────────────────────────────────
const weeklySpend = [
  { day: 'Mon', amount: 12400 },
  { day: 'Tue', amount: 8200 },
  { day: 'Wed', amount: 31500 },
  { day: 'Thu', amount: 5800 },
  { day: 'Fri', amount: 22100 },
  { day: 'Sat', amount: 45600 },
  { day: 'Sun', amount: 9300 },
];

const balanceTrend = [
  { t: '1', v: 2100000 },
  { t: '2', v: 2350000 },
  { t: '3', v: 2180000 },
  { t: '4', v: 2620000 },
  { t: '5', v: 2490000 },
  { t: '6', v: totalBalance },
];

// ─── Notifications derived from shared fraud cases + transactions ─────────────
const notifications: Notification[] = [
  { id: '1', type: 'fraud', title: '⚠️ Suspicious ATM Activity', body: `ATM withdrawal ₦100,000 at 2:22 AM flagged (TXN-10004). Risk score: 87/100. Fraud Detection Agent alert.`, time: '2m ago', read: false, txId: 'TXN-10004' },
  { id: '2', type: 'credit', title: '💰 Salary Received', body: `₦850,000 salary credit from Employer Ltd (TXN-10001). Account: ****4521.`, time: '3h ago', read: false, txId: 'TXN-10001' },
  { id: '3', type: 'promo', title: '✅ Loan Pre-Approved', body: `LOAN-4421: ₦2.5M MSME loan approved at 18.5% p.a. Monthly repayment ₦125,000 over 24 months.`, time: '1d ago', read: true },
  { id: '4', type: 'promo', title: '🎯 Fixed Deposit Offer', body: `You qualify for a 14.5% Fixed Deposit. Lock ₦500k and earn ₦72,500 in 12 months.`, time: '1d ago', read: true },
  { id: '5', type: 'system', title: '🔒 Biometric Updated', body: `Your biometric login was updated successfully. If this wasn't you, contact support immediately.`, time: '2d ago', read: true },
];

const quickActions = [
  { icon: '↑', label: 'Send', color: '#1B365D' },
  { icon: '↓', label: 'Receive', color: '#00C896' },
  { icon: '📱', label: 'Airtime', color: '#F47558' },
  { icon: '💡', label: 'Bills', color: '#FFB020' },
  { icon: '🏦', label: 'Loans', color: '#7C3AED' },
  { icon: '💳', label: 'Cards', color: '#EC4899' },
  { icon: '📊', label: 'Invest', color: '#06B6D4' },
  { icon: '⚙️', label: 'More', color: '#94A3B8' },
];

type MobileTab = 'home' | 'analytics' | 'chat' | 'notifications' | 'profile';
type AuthState = 'locked' | 'biometric' | 'unlocked';

function fmt(n: number) {
  return fmtNGN(n);
}

function formatTxDate(dateStr: string): string {
  const d = new Date(dateStr);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d.getDate()} ${months[d.getMonth()]}`;
}

// ─── Biometric Lock Screen ────────────────────────────────────────────────────
function BiometricScreen({ onUnlock }: { onUnlock: () => void }) {
  const [scanning, setScanning] = useState(false);
  const [step, setStep] = useState<'idle' | 'scanning' | 'success'>('idle');

  const handleScan = () => {
    setScanning(true);
    setStep('scanning');
    setTimeout(() => {
      setStep('success');
      setTimeout(onUnlock, 800);
    }, 1800);
  };

  return (
    <div className="flex flex-col items-center justify-between h-full bg-[#1B365D] text-white px-8 py-12">
      <div className="text-center mt-8">
        <div className="w-16 h-16 rounded-2xl bg-[#F47558] flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636a9 9 0 010 12.728M5.636 5.636a9 9 0 000 12.728M12 12h.01" /></svg>
        </div>
        <p className="font-bold text-xl">SmartBankAI</p>
        <p className="text-white/50 text-sm mt-1">Mobile Banking</p>
      </div>

      <div className="flex flex-col items-center gap-6">
        <p className="text-white/70 text-sm">Welcome back, {primaryCustomer.name.split(' ')[0]}</p>
        <button onClick={handleScan} disabled={scanning}
          className={`w-24 h-24 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
            step === 'scanning' ? 'border-[#F47558] bg-[#F47558]/20 scale-110' :
            step === 'success' ? 'border-green-400 bg-green-400/20' : 'border-white/30 bg-white/5 hover:border-white/60 hover:bg-white/10'
          }`}>
          {step === 'success' ? (
            <svg className="w-10 h-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          ) : (
            <svg className={`w-10 h-10 ${step === 'scanning' ? 'text-[#F47558]' : 'text-white/60'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          )}
        </button>
        <div className="text-center">
          <p className="text-white/80 text-sm font-medium">
            {step === 'idle' ? 'Touch to authenticate' : step === 'scanning' ? 'Scanning...' : 'Authenticated!'}
          </p>
          {step === 'scanning' && (
            <div className="flex gap-1 justify-center mt-2">
              {[0, 1, 2].map(i => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#F47558] animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />
              ))}
            </div>
          )}
        </div>
        <button onClick={onUnlock} className="text-white/40 text-xs hover:text-white/70 transition-colors">Use PIN instead</button>
      </div>
      <div className="text-center">
        <p className="text-white/30 text-xs">Secured by SmartBankAI · Biometric Auth</p>
      </div>
    </div>
  );
}

// ─── Home Tab ─────────────────────────────────────────────────────────────────
function HomeTab({ onNotifClick }: { onNotifClick: () => void }) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const unreadCount = notifications.filter(n => !n.read).length;
  const recentTx = customerTransactions.slice(0, 5);

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50">
      <div className="bg-[#1B365D] px-5 pt-6 pb-16 relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#F47558] flex items-center justify-center text-white font-bold text-sm">{primaryCustomer.name[0]}</div>
            <div>
              <p className="text-white/60 text-xs">Good morning</p>
              <p className="text-white font-semibold text-sm">{primaryCustomer.name}</p>
            </div>
          </div>
          <button onClick={onNotifClick} className="relative w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
            {unreadCount > 0 && <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#F47558] rounded-full text-white text-xs flex items-center justify-center">{unreadCount}</span>}
          </button>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-2xl p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-white/60 text-xs">Total Balance · {customerAccounts.length} accounts</p>
            <button onClick={() => setBalanceVisible(v => !v)} className="text-white/40 hover:text-white/70">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {balanceVisible
                  ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                }
              </svg>
            </button>
          </div>
          <p className="text-white text-3xl font-bold">{balanceVisible ? fmt(totalBalance) : '₦ ••••••'}</p>
          <p className="text-white/50 text-xs mt-1">Credit Score: {primaryCustomer.creditScore} · {primaryCustomer.segment}</p>
          <div className="mt-3 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceTrend}>
                <defs>
                  <linearGradient id="mobGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F47558" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#F47558" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="v" stroke="#F47558" fill="url(#mobGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-white mx-4 -mt-8 rounded-2xl p-4 shadow-md relative z-10">
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map(action => (
            <button key={action.label} onClick={() => toast.success(`${action.label} — coming soon`)}
              className="flex flex-col items-center gap-1.5">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl" style={{ background: `${action.color}15` }}>
                <span style={{ color: action.color }}>{action.icon}</span>
              </div>
              <span className="text-xs text-gray-500 font-medium">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Fraud Alert Banner if flagged transactions exist */}
      {customerTransactions.some(t => t.fraudFlag) && (
        <div className="mx-4 mt-4 bg-red-50 border border-red-200 rounded-2xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-semibold text-red-800 text-sm">Fraud Alert — Action Required</p>
              <p className="text-red-700 text-xs mt-0.5">ATM withdrawal of ₦100,000 at 2:22 AM was flagged (TXN-10004). Risk score: 87/100. Tap to review or report.</p>
            </div>
          </div>
        </div>
      )}

      <div className="mx-4 mt-4 bg-gradient-to-r from-[#F47558] to-[#e06548] rounded-2xl p-4 text-white">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <p className="font-semibold text-sm">AI Insight · Predictive Analytics Agent</p>
            <p className="text-white/80 text-xs mt-0.5">You spend 28% more on weekends. Setting a ₦20k weekend budget could save ₦96k/year. Your LOAN-4421 repayment of ₦125,000 is due in 5 days.</p>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-sm mb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-[#1B365D] text-sm">Recent Transactions</p>
          <span className="text-xs text-gray-400">{customerTransactions.length} total</span>
        </div>
        <div className="space-y-3">
          {recentTx.map(tx => (
            <div key={tx.id} className={`flex items-center gap-3 ${tx.fraudFlag ? 'bg-red-50 rounded-xl p-2 -mx-2' : ''}`}>
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 ${tx.transactionType === 'credit' ? 'bg-green-100' : 'bg-gray-100'}`}>
                {tx.category === 'Income' ? '💼' : tx.category === 'Shopping' ? '🛒' : tx.category === 'Bills' ? '📄' : tx.category === 'Transport' ? '🚗' : tx.category === 'ATM' ? '🏧' : tx.category === 'Food' ? '🍽️' : tx.category === 'Savings' ? '🏦' : tx.category === 'Loan' ? '💰' : '↕'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{tx.description}</p>
                  {tx.fraudFlag && <span className="text-xs text-red-500 flex-shrink-0">⚠</span>}
                </div>
                <p className="text-xs text-gray-400">{tx.channel} · {formatTxDate(tx.createdAt)}</p>
              </div>
              <p className={`text-sm font-semibold ${tx.transactionType === 'credit' ? 'text-green-600' : 'text-gray-700'}`}>
                {tx.transactionType === 'credit' ? '+' : '-'}{fmt(tx.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Analytics Tab ────────────────────────────────────────────────────────────
function AnalyticsTab() {
  const totalSpend = customerTransactions.filter(t => t.transactionType === 'debit').reduce((s, t) => s + t.amount, 0);
  const weeklyTotal = weeklySpend.reduce((s, d) => s + d.amount, 0);

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50 p-4 space-y-4">
      <div>
        <h2 className="font-bold text-[#1B365D] text-base">Spending Analytics</h2>
        <p className="text-xs text-gray-400">Personalization Agent · Real-time insights</p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="font-semibold text-[#1B365D] text-sm">This Week</p>
          <span className="text-xs text-red-500 bg-red-50 px-2 py-0.5 rounded-full">+12% vs last week</span>
        </div>
        <p className="text-2xl font-bold text-[#1B365D] mb-3">{fmt(weeklyTotal)}</p>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={weeklySpend}>
            <XAxis dataKey="day" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v: number) => fmt(v)} />
            <Bar dataKey="amount" fill="#1B365D" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="font-semibold text-[#1B365D] text-sm mb-3">Category Breakdown</p>
        <div className="space-y-3">
          {CATEGORY_SPEND_BREAKDOWN.slice(0, 5).map(cat => (
            <div key={cat.name}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">{cat.name}</span>
                <span className="font-medium text-gray-800">{fmt(cat.totalNGN / 100)}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className="h-1.5 rounded-full" style={{ width: `${cat.value}%`, background: cat.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction Channel Breakdown */}
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="font-semibold text-[#1B365D] text-sm mb-3">Transactions by Channel</p>
        <div className="space-y-2">
          {(['Mobile App', 'POS Terminal', 'Internet Banking', 'USSD', 'ATM', 'Mobile Money'] as const).map(ch => {
            const count = customerTransactions.filter(t => t.channel === ch).length;
            const pct = Math.round((count / customerTransactions.length) * 100);
            return count > 0 ? (
              <div key={ch}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-600">{ch}</span>
                  <span className="font-medium text-gray-800">{count} txns ({pct}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className="h-1.5 rounded-full bg-[#1B365D]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ) : null;
          })}
        </div>
      </div>

      <div className="bg-[#1B365D] rounded-2xl p-4 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base">🔮</span>
          <p className="font-semibold text-sm">Predictive Forecast</p>
        </div>
        <p className="text-white/70 text-xs">Based on your {customerTransactions.length} transactions, you will spend approximately <span className="text-white font-semibold">₦142,000</span> next week — 5% above this week. Consider reducing weekend dining to stay within budget.</p>
      </div>
    </div>
  );
}

// ─── Chat Tab ─────────────────────────────────────────────────────────────────
function ChatTab() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: `Hi ${primaryCustomer.name.split(' ')[0]}! 👋 I'm your AI banking assistant. You have ${customerAccounts.length} accounts totalling ${fmtNGN(totalBalance)}. I can see ${customerTransactions.filter(t => t.fraudFlag).length} flagged transaction(s) and your LOAN-4421 is approved. Ask me anything!` }
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const { response, isLoading, error, sendMessage } = useChat('ANTHROPIC', 'claude-sonnet-4-6', true);

  useEffect(() => {
    if (error) toast.error('AI unavailable');
  }, [error]);

  useEffect(() => {
    if (response && !isLoading) {
      setMessages(prev => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant' && last.content === '...') {
          return [...prev.slice(0, -1), { role: 'assistant', content: response }];
        }
        return prev;
      });
    }
  }, [response, isLoading]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;
    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg, { role: 'assistant', content: '...' }]);
    const txSummary = customerTransactions.slice(0, 5).map(t => `${t.description}: ${t.transactionType === 'credit' ? '+' : '-'}${fmtNGN(t.amount)}`).join('; ');
    sendMessage([
      { role: 'system' as const, content: `You are a concise mobile banking AI assistant for SmartBankAI. Keep responses under 80 words. Use Nigerian Naira (₦). Customer: ${primaryCustomer.name}, Credit Score: ${primaryCustomer.creditScore}, Segment: ${primaryCustomer.segment}. Total balance: ${fmtNGN(totalBalance)} across ${customerAccounts.length} accounts. Recent transactions: ${txSummary}. Flagged: TXN-10004 ATM ₦100k at 2:22AM risk 87/100. Loan LOAN-4421 ₦2.5M approved 18.5% p.a.` },
      ...messages.filter(m => m.content !== '...').map(m => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      { role: 'user' as const, content: input }
    ], { max_tokens: 200, temperature: 0.7 });
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-[#1B365D] px-4 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-[#F47558] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
        </div>
        <div>
          <p className="text-white font-semibold text-sm">AI Assistant</p>
          <p className="text-white/50 text-xs">SmartBankAI · Online</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.role === 'user' ? 'bg-[#1B365D] text-white rounded-br-sm' : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'}`}>
              {msg.content === '...' ? (
                <div className="flex gap-1 items-center py-0.5">
                  {[0, 1, 2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
                </div>
              ) : msg.role === 'assistant' ? (
                <MarkdownMessage content={msg.content} />
              ) : msg.content}
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div className="p-3 bg-white border-t border-gray-100">
        <div className="flex gap-2 mb-2 overflow-x-auto pb-1">
          {['My balance', 'Flagged transaction TXN-10004', 'Loan LOAN-4421 status', 'Savings tips', 'Spending analysis'].map(q => (
            <button key={q} onClick={() => setInput(q)}
              className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-full whitespace-nowrap hover:bg-gray-200 transition-colors">
              {q}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask anything..." disabled={isLoading}
            className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1B365D]/20" />
          <button onClick={handleSend} disabled={isLoading || !input.trim()}
            className="w-9 h-9 bg-[#1B365D] disabled:opacity-50 rounded-xl flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Notifications Tab ────────────────────────────────────────────────────────
function NotificationsTab() {
  const typeColors: Record<string, string> = { fraud: 'bg-red-100', credit: 'bg-green-100', promo: 'bg-blue-100', system: 'bg-gray-100' };
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-[#1B365D] text-base">Notifications</h2>
        <button className="text-xs text-[#F47558]">Mark all read</button>
      </div>
      {notifications.map(notif => (
        <div key={notif.id} className={`bg-white rounded-2xl p-4 shadow-sm border-l-4 ${notif.read ? 'border-gray-200 opacity-70' : notif.type === 'fraud' ? 'border-red-500' : 'border-[#F47558]'}`}>
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-full ${typeColors[notif.type]} flex items-center justify-center flex-shrink-0`}>
              <span className="text-sm">{notif.title.split(' ')[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold text-gray-800 truncate">{notif.title.replace(/^[^\s]+\s/, '')}</p>
                <span className="text-xs text-gray-400 flex-shrink-0">{notif.time}</span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">{notif.body}</p>
              {notif.txId && <p className="text-xs text-[#F47558] mt-1 font-medium">Ref: {notif.txId}</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Profile Tab ──────────────────────────────────────────────────────────────
function ProfileTab() {
  return (
    <div className="flex flex-col h-full overflow-y-auto bg-gray-50 p-4 space-y-4">
      <div className="bg-[#1B365D] rounded-2xl p-5 text-white text-center">
        <div className="w-16 h-16 rounded-full bg-[#F47558] flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">{primaryCustomer.name[0]}</div>
        <p className="font-bold text-lg">{primaryCustomer.name}</p>
        <p className="text-white/60 text-sm">{primaryCustomer.segment} Customer · Since {new Date(primaryCustomer.since).getFullYear()}</p>
        <div className="flex justify-center gap-4 mt-4">
          <div className="text-center">
            <p className="font-bold text-lg">{primaryCustomer.creditScore}</p>
            <p className="text-white/50 text-xs">Credit Score</p>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <p className="font-bold text-lg">{customerAccounts.length}</p>
            <p className="text-white/50 text-xs">Accounts</p>
          </div>
          <div className="w-px bg-white/20" />
          <div className="text-center">
            <p className="font-bold text-lg">{customerTransactions.length}</p>
            <p className="text-white/50 text-xs">Transactions</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {[
          { icon: '🔒', label: 'Security & Biometrics', sub: 'Fingerprint enabled' },
          { icon: '🔔', label: 'Notifications', sub: `${notifications.filter(n => !n.read).length} unread alerts` },
          { icon: '💳', label: 'Cards', sub: '2 active cards' },
          { icon: '🌐', label: 'Web Banking', sub: 'Session active on Chrome', link: '/banking' },
          { icon: '📞', label: 'Support', sub: '24/7 AI + human support' },
          { icon: '⚙️', label: 'Settings', sub: 'App preferences' },
        ].map((item) => (
          <a key={item.label} href={item.link || '#'}
            className="flex items-center gap-4 px-4 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
            <span className="text-xl w-8 text-center">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{item.label}</p>
              <p className="text-xs text-gray-400">{item.sub}</p>
            </div>
            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </a>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
        <p className="text-xs font-semibold text-amber-800 mb-1">Session Continuity</p>
        <p className="text-xs text-amber-700">Your session is synced with the Web Banking Portal. Switch seamlessly between devices without losing context. {customerTransactions.length} transactions shared across channels.</p>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MobileBankingApp() {
  const [authState, setAuthState] = useState<AuthState>('locked');
  const [activeTab, setActiveTab] = useState<MobileTab>('home');

  const navItems: { tab: MobileTab; icon: React.ReactNode; label: string }[] = [
    { tab: 'home', label: 'Home', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { tab: 'analytics', label: 'Analytics', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { tab: 'chat', label: 'AI Chat', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg> },
    { tab: 'notifications', label: 'Alerts', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg> },
    { tab: 'profile', label: 'Profile', icon: <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
  ];

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="relative bg-[#1a1a1a] rounded-[3rem] p-3 shadow-2xl">
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-[#1a1a1a] rounded-full z-20" />
          <div className="bg-white rounded-[2.5rem] overflow-hidden" style={{ height: '780px' }}>
            <div className="bg-[#1B365D] px-6 pt-8 pb-2 flex items-center justify-between">
              <span className="text-white text-xs font-medium">9:41</span>
              <div className="flex items-center gap-1.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M1.5 8.5a13 13 0 0121 0M5 12a10 10 0 0114 0M8.5 15.5a6 6 0 017 0M12 19h.01" /></svg>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4].map(i => <div key={i} className="w-1 bg-white rounded-sm" style={{ height: `${i * 3}px` }} />)}
                </div>
              </div>
            </div>

            <div className="flex flex-col" style={{ height: 'calc(780px - 56px)' }}>
              {authState === 'locked' ? (
                <BiometricScreen onUnlock={() => setAuthState('unlocked')} />
              ) : (
                <>
                  <div className="flex-1 overflow-hidden">
                    {activeTab === 'home' && <HomeTab onNotifClick={() => setActiveTab('notifications')} />}
                    {activeTab === 'analytics' && <AnalyticsTab />}
                    {activeTab === 'chat' && <ChatTab />}
                    {activeTab === 'notifications' && <NotificationsTab />}
                    {activeTab === 'profile' && <ProfileTab />}
                  </div>

                  <div className="bg-white border-t border-gray-100 px-2 py-2 flex items-center justify-around">
                    {navItems.map(item => {
                      const isActive = activeTab === item.tab;
                      const unread = item.tab === 'notifications' ? notifications.filter(n => !n.read).length : 0;
                      return (
                        <button key={item.tab} onClick={() => setActiveTab(item.tab)}
                          className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all relative ${isActive ? 'text-[#1B365D]' : 'text-gray-400'}`}>
                          {unread > 0 && <span className="absolute -top-0.5 right-1 w-4 h-4 bg-[#F47558] rounded-full text-white text-xs flex items-center justify-center">{unread}</span>}
                          <span className={isActive ? 'text-[#1B365D]' : 'text-gray-400'}>{item.icon}</span>
                          <span className="text-xs font-medium">{item.label}</span>
                          {isActive && <div className="w-1 h-1 rounded-full bg-[#F47558]" />}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="text-center mt-4">
          <p className="text-gray-500 text-sm font-medium">Mobile Banking Super-App</p>
          <p className="text-gray-400 text-xs mt-0.5">SmartBankAI · Powered by SmartBankAI</p>
          <div className="flex items-center justify-center gap-4 mt-2">
            <a href="/banking" className="text-xs text-[#1B365D] hover:underline flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" /></svg>
              Switch to Web Portal
            </a>
            <span className="text-gray-300">·</span>
            <span className="text-xs text-green-600 flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Session Synced
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
