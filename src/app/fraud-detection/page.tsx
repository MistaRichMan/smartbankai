'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area } from 'recharts';
import { DEMO_FRAUD_CASES, CHANNEL_TRANSACTION_VOLUME, getFlaggedTransactions, getCustomerById, fmtNGN, fmtDate,  } from '@/lib/demo/bankingData';

// ─── Static chart data ────────────────────────────────────────────────────────
const hourlyFraud = [
  { hour: '00', flagged: 8, blocked: 7, amount: 1.2 },
  { hour: '02', flagged: 5, blocked: 5, amount: 0.8 },
  { hour: '04', flagged: 3, blocked: 3, amount: 0.4 },
  { hour: '06', flagged: 12, blocked: 11, amount: 2.1 },
  { hour: '08', flagged: 28, blocked: 26, amount: 5.4 },
  { hour: '10', flagged: 45, blocked: 42, amount: 9.8 },
  { hour: '12', flagged: 62, blocked: 58, amount: 14.2 },
  { hour: '14', flagged: 54, blocked: 51, amount: 12.1 },
  { hour: '16', flagged: 71, blocked: 67, amount: 16.8 },
  { hour: '18', flagged: 48, blocked: 45, amount: 11.2 },
  { hour: '20', flagged: 35, blocked: 33, amount: 8.1 },
  { hour: '22', flagged: 19, blocked: 18, amount: 4.3 },
];

const fraudTypes = [
  { type: 'Mobile Money Fraud', count: 234, change: +18, color: '#FF4D4D' },
  { type: 'Account Takeover', count: 142, change: -12, color: '#FF6B35' },
  { type: 'Card Fraud', count: 89, change: +5, color: '#FFB020' },
  { type: 'Identity Theft', count: 67, change: -8, color: '#FF4D4D' },
  { type: 'SIM Swap', count: 58, change: -15, color: '#FFB020' },
  { type: 'Phishing', count: 45, change: -22, color: '#FFB020' },
  { type: 'Velocity Abuse', count: 38, change: +3, color: '#FF6B35' },
  { type: 'Insider Threat', count: 12, change: -45, color: '#00C896' },
];

const mlMetrics = [
  { label: 'Detection Rate', value: '99.2%', sub: 'True Positive Rate', color: 'text-accent-green' },
  { label: 'False Positive Rate', value: '0.08%', sub: 'Minimized friction', color: 'text-primary' },
  { label: 'Avg Response Time', value: '45ms', sub: 'Real-time blocking', color: 'text-accent-cyan' },
  { label: 'Model Version', value: 'v4.1.0', sub: 'Last trained 6h ago', color: 'text-accent-purple' },
];

const riskTrendData = [
  { day: 'Mon', score: 72 }, { day: 'Tue', score: 68 }, { day: 'Wed', score: 81 },
  { day: 'Thu', score: 75 }, { day: 'Fri', score: 88 }, { day: 'Sat', score: 65 }, { day: 'Sun', score: 71 },
];

const statusStyle: Record<string, string> = {
  blocked: 'bg-accent-red/10 text-accent-red border-accent-red/20',
  review: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
  cleared: 'bg-accent-green/10 text-accent-green border-accent-green/20',
  escalated: 'bg-accent-red/10 text-accent-red border-accent-red/20',
};

interface FraudAnalysisResult {
  risk_score: number;
  fraud_type: string;
  decision: string;
  confidence: number;
  risk_factors: string[];
  analysis: string;
  recommended_actions: string[];
}

export default function FraudDetectionPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'cases' | 'transactions' | 'analyze' | 'model'>('overview');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<FraudAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState('');
  const [selectedCase, setSelectedCase] = useState<typeof DEMO_FRAUD_CASES[0] | null>(null);
  const [txForm, setTxForm] = useState({
    transactionId: 'TXN-10004',
    amount: '100000',
    currency: 'NGN',
    location: 'Lagos, Nigeria',
    channel: 'ATM',
    customerId: 'CUST-001',
    behavioralSignals: 'ATM withdrawal at 2:22 AM, unusual time for customer, location matches registered address but time is anomalous, no prior ATM usage at this hour in 12 months',
  });

  const flaggedTransactions = getFlaggedTransactions();
  const totalFraudAmount = DEMO_FRAUD_CASES.reduce((s, c) => s + c.amount, 0);
  const blockedCount = DEMO_FRAUD_CASES.filter(c => c.status === 'blocked').length;

  const runFraudAnalysis = async () => {
    setIsAnalyzing(true);
    setAnalysisError('');
    setAnalysisResult(null);
    try {
      const res = await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentType: 'fraud_detection', input: txForm }),
      });
      const data = await res.json();
      if (data.success) {
        setAnalysisResult(data.result as FraudAnalysisResult);
      } else {
        setAnalysisError(data.error || 'Analysis failed');
      }
    } catch {
      setAnalysisError('Failed to connect to Fraud Detection Agent');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Fraud Detection Agent" subtitle="Real-time ML transaction monitoring, behavioral biometrics & step-up authentication" />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* KPI Cards */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {mlMetrics.map((m) => (
              <div key={m.label} className="bg-surface-card border border-surface-border rounded-2xl p-4">
                <div className={`text-2xl font-bold ${m.color} mb-1`}>{m.value}</div>
                <div className="text-sm font-medium text-white">{m.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{m.sub}</div>
              </div>
            ))}
          </div>

          {/* Channel Fraud Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total Flagged', value: DEMO_FRAUD_CASES.length, sub: 'From all channels', color: 'text-accent-amber' },
              { label: 'Blocked', value: blockedCount, sub: 'Auto-blocked by AI', color: 'text-accent-red' },
              { label: 'Under Review', value: DEMO_FRAUD_CASES.filter(c => c.status === 'review').length, sub: 'Pending analyst review', color: 'text-accent-amber' },
              { label: 'Fraud Exposure', value: fmtNGN(totalFraudAmount), sub: 'Total at-risk amount', color: 'text-accent-red' },
            ].map(kpi => (
              <div key={kpi.label} className="bg-surface-card border border-surface-border rounded-xl p-3">
                <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
                <div className="text-xs font-medium text-white mt-0.5">{kpi.label}</div>
                <div className="text-xs text-gray-500">{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {(['overview', 'cases', 'transactions', 'analyze', 'model'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${activeTab === tab ? 'bg-gradient-primary text-white shadow-glow-blue' : 'bg-surface-elevated text-gray-400 hover:text-white border border-surface-border'}`}>
                {tab === 'overview' ? 'Live Overview' : tab === 'cases' ? `Fraud Cases (${DEMO_FRAUD_CASES.length})` : tab === 'transactions' ? `Flagged Txns (${flaggedTransactions.length})` : tab === 'analyze' ? '🔍 Analyze' : 'ML Model'}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h3 className="text-sm font-semibold text-white">Hourly Fraud Activity</h3>
                      <p className="text-xs text-gray-500 mt-0.5">Flagged vs blocked transactions today</p>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-amber inline-block"></span>Flagged</span>
                      <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-red inline-block"></span>Blocked</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={hourlyFraud}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                      <XAxis dataKey="hour" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}:00`} />
                      <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E2D45', borderRadius: '12px', color: '#fff' }} />
                      <Bar dataKey="flagged" fill="#FFB020" radius={[4, 4, 0, 0]} opacity={0.7} />
                      <Bar dataKey="blocked" fill="#FF4D4D" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-1">Weekly Risk Score Trend</h3>
                  <p className="text-xs text-gray-500 mb-4">Portfolio-level fraud risk index (0–100)</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={riskTrendData}>
                      <defs>
                        <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF4D4D" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#FF4D4D" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                      <XAxis dataKey="day" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E2D45', borderRadius: '12px', color: '#fff' }} />
                      <Area type="monotone" dataKey="score" stroke="#FF4D4D" fill="url(#riskGrad)" strokeWidth={2} name="Risk Score" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Channel Fraud Rates */}
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Fraud Rate by Channel — All Banking Channels</h3>
                <div className="space-y-3">
                  {CHANNEL_TRANSACTION_VOLUME.map((ch) => (
                    <div key={ch.channel} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-36 flex-shrink-0">{ch.channel}</span>
                      <div className="flex-1 bg-surface-elevated rounded-full h-2">
                        <div className="h-2 rounded-full transition-all" style={{ width: `${(ch.fraudRate / 2.5) * 100}%`, backgroundColor: ch.fraudRate > 1.5 ? '#FF4D4D' : ch.fraudRate > 1.0 ? '#FFB020' : '#00C896' }}></div>
                      </div>
                      <span className="text-xs font-mono text-white w-12 text-right">{ch.fraudRate}%</span>
                      <span className="text-xs text-gray-500 w-20 text-right">{ch.count.toLocaleString()} txns</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Fraud Type Breakdown — African Market Patterns</h3>
                <div className="space-y-3">
                  {fraudTypes.map((ft) => (
                    <div key={ft.type} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-40 flex-shrink-0">{ft.type}</span>
                      <div className="flex-1 bg-surface-elevated rounded-full h-2">
                        <div className="h-2 rounded-full transition-all" style={{ width: `${(ft.count / 234) * 100}%`, backgroundColor: ft.color }}></div>
                      </div>
                      <span className="text-xs font-mono text-white w-8 text-right">{ft.count}</span>
                      <span className={`text-xs w-12 text-right font-medium ${ft.change < 0 ? 'text-accent-green' : 'text-accent-red'}`}>
                        {ft.change > 0 ? '+' : ''}{ft.change}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="space-y-4">
              <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Fraud Cases — From Banking Channels</h3>
                  <span className="text-xs text-gray-500">Sources: Web Banking · Mobile App · ATM · POS · Mobile Money</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-border">
                        {['Case ID', 'Customer', 'Fraud Type', 'Amount', 'Channel', 'Location', 'Risk Score', 'Status', 'Detected'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {DEMO_FRAUD_CASES.map((c) => {
                        const customer = getCustomerById(c.customerId);
                        return (
                          <tr key={c.id} onClick={() => setSelectedCase(c)} className="hover:bg-surface-elevated transition-colors cursor-pointer">
                            <td className="px-4 py-3 text-xs font-mono text-primary">{c.id}</td>
                            <td className="px-4 py-3">
                              <div className="text-xs text-white font-medium">{c.customerName}</div>
                              <div className="text-xs text-gray-500">{c.customerId} · Score: {customer?.creditScore}</div>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{c.fraudType}</td>
                            <td className="px-4 py-3 text-xs font-medium text-white whitespace-nowrap">{fmtNGN(c.amount)}</td>
                            <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{c.channel}</td>
                            <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{c.location}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-surface-border rounded-full h-1.5">
                                  <div className="h-1.5 rounded-full" style={{ width: `${c.riskScore}%`, backgroundColor: c.riskScore > 80 ? '#FF4D4D' : c.riskScore > 60 ? '#FFB020' : '#00C896' }}></div>
                                </div>
                                <span className="text-xs font-mono text-white">{c.riskScore}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-0.5 rounded-lg border capitalize ${statusStyle[c.status]}`}>{c.status}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(c.detectedAt)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Case Detail Panel */}
              {selectedCase && (
                <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white">Case Detail — {selectedCase.id}</h3>
                    <button onClick={() => setSelectedCase(null)} className="text-xs text-gray-500 hover:text-white">✕ Close</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Transaction ID', value: selectedCase.transactionId },
                      { label: 'Customer', value: selectedCase.customerName },
                      { label: 'Fraud Type', value: selectedCase.fraudType },
                      { label: 'Amount', value: fmtNGN(selectedCase.amount) },
                      { label: 'Channel', value: selectedCase.channel },
                      { label: 'Location', value: selectedCase.location },
                      { label: 'Biometric', value: selectedCase.biometric },
                      { label: 'Step-up Auth', value: selectedCase.stepUp },
                    ].map(item => (
                      <div key={item.label} className="bg-surface-elevated rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                        <p className="text-sm text-white font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex gap-3">
                    <button className="bg-accent-red/10 text-accent-red border border-accent-red/20 px-4 py-2 rounded-xl text-xs font-medium hover:bg-accent-red/20 transition-colors">Confirm Fraud</button>
                    <button className="bg-accent-green/10 text-accent-green border border-accent-green/20 px-4 py-2 rounded-xl text-xs font-medium hover:bg-accent-green/20 transition-colors">Mark as Cleared</button>
                    <button className="bg-accent-amber/10 text-accent-amber border border-accent-amber/20 px-4 py-2 rounded-xl text-xs font-medium hover:bg-accent-amber/20 transition-colors">Escalate to Compliance</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-surface-border">
                <h3 className="text-sm font-semibold text-white">All Flagged Transactions — Across All Channels & Customers</h3>
                <p className="text-xs text-gray-500 mt-0.5">{flaggedTransactions.length} transactions flagged for fraud or AML review</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-border">
                      {['Txn ID', 'Customer', 'Description', 'Amount', 'Channel', 'Fraud Type', 'Risk Score', 'AML', 'Status', 'Date'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {flaggedTransactions.map((tx) => {
                      const customer = getCustomerById(tx.customerId);
                      return (
                        <tr key={tx.id} className="hover:bg-surface-elevated transition-colors">
                          <td className="px-4 py-3 text-xs font-mono text-primary">{tx.id}</td>
                          <td className="px-4 py-3">
                            <div className="text-xs text-white font-medium">{customer?.name}</div>
                            <div className="text-xs text-gray-500">{tx.customerId}</div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-300 max-w-xs truncate">{tx.description}</td>
                          <td className="px-4 py-3 text-xs font-medium text-white whitespace-nowrap">{fmtNGN(tx.amount, tx.accountId.startsWith('ACC-006') ? 'GHS' : 'NGN')}</td>
                          <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{tx.channel}</td>
                          <td className="px-4 py-3 text-xs text-accent-red whitespace-nowrap">{tx.fraudType || '—'}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold ${tx.fraudRiskScore > 80 ? 'text-accent-red' : tx.fraudRiskScore > 60 ? 'text-accent-amber' : 'text-accent-green'}`}>{tx.fraudRiskScore}/100</span>
                          </td>
                          <td className="px-4 py-3">
                            {tx.amlFlag ? <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-lg">AML</span> : <span className="text-xs text-gray-600">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-lg border capitalize ${statusStyle[tx.status] || 'text-gray-400 border-gray-700'}`}>{tx.status}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(tx.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'analyze' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Transaction Risk Analysis</h3>
                <p className="text-xs text-gray-500 mb-4">Pre-filled with TXN-10004 — flagged ATM withdrawal from Web Banking Portal</p>
                <div className="space-y-3">
                  {[
                    { key: 'transactionId', label: 'Transaction ID', type: 'text' },
                    { key: 'amount', label: 'Amount (NGN)', type: 'number' },
                    { key: 'location', label: 'Location', type: 'text' },
                    { key: 'customerId', label: 'Customer ID', type: 'text' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-gray-400 mb-1">{field.label}</label>
                      <input type={field.type} value={txForm[field.key as keyof typeof txForm]}
                        onChange={(e) => setTxForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-primary/50" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Channel</label>
                    <select value={txForm.channel} onChange={(e) => setTxForm(prev => ({ ...prev, channel: e.target.value }))}
                      className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-primary/50">
                      {['Mobile App', 'Internet Banking', 'USSD', 'POS Terminal', 'Mobile Money', 'ATM', 'Web'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Behavioral Signals</label>
                    <textarea value={txForm.behavioralSignals} onChange={(e) => setTxForm(prev => ({ ...prev, behavioralSignals: e.target.value }))}
                      rows={3} className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-primary/50 resize-none" />
                  </div>
                  <button onClick={runFraudAnalysis} disabled={isAnalyzing}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
                    {isAnalyzing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Analyzing...</> : <>🔍 Run Fraud Analysis</>}
                  </button>
                </div>
              </div>

              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">AI Fraud Assessment</h3>
                {analysisError && <div className="px-4 py-3 bg-accent-red/10 border border-accent-red/20 rounded-xl text-sm text-accent-red mb-4">{analysisError}</div>}
                {analysisResult ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border ${analysisResult.decision === 'BLOCK' ? 'bg-accent-red/10 border-accent-red/30' : analysisResult.decision === 'REVIEW' ? 'bg-accent-amber/10 border-accent-amber/30' : 'bg-accent-green/10 border-accent-green/30'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-lg font-bold ${analysisResult.decision === 'BLOCK' ? 'text-accent-red' : analysisResult.decision === 'REVIEW' ? 'text-accent-amber' : 'text-accent-green'}`}>
                          {analysisResult.decision === 'BLOCK' ? '🚫 BLOCKED' : analysisResult.decision === 'REVIEW' ? '⚠ REVIEW' : '✓ APPROVED'}
                        </span>
                        <span className="text-xs text-gray-400">Confidence: <span className="text-white font-semibold">{analysisResult.confidence}%</span></span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400">Risk Score:</span>
                        <div className="flex-1 bg-surface-border rounded-full h-2">
                          <div className="h-2 rounded-full" style={{ width: `${analysisResult.risk_score}%`, backgroundColor: analysisResult.risk_score > 80 ? '#FF4D4D' : analysisResult.risk_score > 60 ? '#FFB020' : '#00C896' }}></div>
                        </div>
                        <span className="text-sm font-bold text-white">{analysisResult.risk_score}/100</span>
                      </div>
                    </div>
                    {analysisResult.risk_factors?.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Risk Factors</p>
                        <div className="space-y-1">{analysisResult.risk_factors.map((f, i) => <div key={i} className="flex items-start gap-2 text-xs text-gray-300"><span className="text-accent-red mt-0.5">•</span>{f}</div>)}</div>
                      </div>
                    )}
                    {analysisResult.recommended_actions?.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Recommended Actions</p>
                        <div className="space-y-1">{analysisResult.recommended_actions.map((a, i) => <div key={i} className="flex items-start gap-2 text-xs text-gray-300"><span className="text-accent-green mt-0.5">→</span>{a}</div>)}</div>
                      </div>
                    )}
                    {analysisResult.analysis && <div className="p-3 bg-surface-elevated rounded-xl"><p className="text-xs text-gray-400 italic">{analysisResult.analysis}</p></div>}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <div className="w-12 h-12 rounded-xl bg-surface-elevated flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <p className="text-sm text-gray-500">Submit a transaction to get AI fraud assessment</p>
                    <p className="text-xs text-gray-600 mt-1">Pre-filled with TXN-10004 from Web Banking Portal</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'model' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Model Performance History</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={[
                    { version: 'v3.8', accuracy: 96.1, precision: 95.2, recall: 97.0 },
                    { version: 'v3.9', accuracy: 97.4, precision: 96.8, recall: 98.0 },
                    { version: 'v4.0', accuracy: 98.1, precision: 97.5, recall: 98.7 },
                    { version: 'v4.1', accuracy: 99.2, precision: 98.9, recall: 99.5 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                    <XAxis dataKey="version" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[94, 100]} tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E2D45', borderRadius: '12px', color: '#fff' }} />
                    <Line type="monotone" dataKey="accuracy" stroke="#0066FF" strokeWidth={2} dot={{ fill: '#0066FF' }} name="Accuracy" />
                    <Line type="monotone" dataKey="precision" stroke="#00C896" strokeWidth={2} dot={{ fill: '#00C896' }} name="Precision" />
                    <Line type="monotone" dataKey="recall" stroke="#7C3AED" strokeWidth={2} dot={{ fill: '#7C3AED' }} name="Recall" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-white">Model Configuration</h3>
                {[
                  { label: 'Algorithm', value: 'Gradient Boosting + Neural Net Ensemble' },
                  { label: 'Training Data', value: '48M transactions (2020–2024)' },
                  { label: 'Feature Count', value: '247 behavioral + transactional features' },
                  { label: 'Retraining Trigger', value: 'Drift > 0.5% or weekly schedule' },
                  { label: 'Bias Detection', value: 'Fairness-aware ML — Enabled' },
                  { label: 'Explainability', value: 'SHAP values — Available per decision' },
                  { label: 'Deployment', value: 'On-premise / Private Cloud' },
                  { label: 'Compliance', value: 'GDPR, CBN, FATF compliant' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-4 py-2 border-b border-surface-border last:border-0">
                    <span className="text-xs text-gray-500 flex-shrink-0">{item.label}</span>
                    <span className="text-xs text-white text-right">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
