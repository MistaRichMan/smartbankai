'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import {
  DEMO_TRANSACTIONS, DEMO_CUSTOMERS, DEMO_LOANS, DEMO_FRAUD_CASES, DEMO_AML_ALERTS,
  DAILY_TRANSACTION_TREND, CHANNEL_TRANSACTION_VOLUME, CATEGORY_SPEND_BREAKDOWN,
  fmtNGN,
} from '@/lib/demo/bankingData';

interface DashboardInsights {
  executive_summary: string;
  key_trends: string[];
  anomalies: string[];
  opportunities: string[];
  risk_areas: string[];
  recommended_actions: string[];
  confidence: number;
}

const riskDistribution = [
  { name: 'Low Risk', value: 68, color: '#00C896' },
  { name: 'Medium Risk', value: 24, color: '#FFB020' },
  { name: 'High Risk', value: 8, color: '#FF4D4D' },
];

const agentPerformance = [
  { name: 'Conversational', uptime: 99.8, requests: 45200, color: '#1B365D' },
  { name: 'Fraud Detection', uptime: 99.9, requests: 128400, color: '#00C896' },
  { name: 'Credit Risk', uptime: 99.7, requests: 3200, color: '#F47558' },
  { name: 'Personalization', uptime: 99.5, requests: 89100, color: '#FFB020' },
  { name: 'Predictive', uptime: 99.6, requests: 12300, color: '#06B6D4' },
  { name: 'Compliance', uptime: 99.9, requests: 8700, color: '#7C3AED' },
  { name: 'Data Aggregation', uptime: 99.4, requests: 234000, color: '#EC4899' },
  { name: 'Orchestration', uptime: 100.0, requests: 287600, color: '#10B981' },
];

const anomalyData = [
  { time: 'Mon', normal: 4200, anomaly: 0 },
  { time: 'Tue', normal: 4800, anomaly: 0 },
  { time: 'Wed', normal: 4100, anomaly: 890 },
  { time: 'Thu', normal: 5200, anomaly: 0 },
  { time: 'Fri', normal: 6800, anomaly: 0 },
  { time: 'Sat', normal: 3200, anomaly: 420 },
  { time: 'Sun', normal: 2100, anomaly: 0 },
];

export default function SmartDashboardPage() {
  const { profile } = useAuth();
  const [insights, setInsights] = useState<DashboardInsights | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [alertCount, setAlertCount] = useState(0);
  const [timeRange, setTimeRange] = useState('Today');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'overview' | 'channels' | 'customers' | 'anomalies' | 'agents'>('overview');

  useEffect(() => {
    fetchAlertCount();
  }, []);

  const fetchAlertCount = async () => {
    const { count } = await supabase
      .from('system_alerts')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);
    setAlertCount(count || 0);
  };

  // Derived stats from shared demo data
  const totalTransactions = DEMO_TRANSACTIONS.length;
  const totalVolume = DEMO_TRANSACTIONS.reduce((s, t) => s + t.amount, 0);
  const fraudFlagged = DEMO_TRANSACTIONS.filter(t => t.fraudFlag).length;
  const amlFlagged = DEMO_TRANSACTIONS.filter(t => t.amlFlag).length;
  const approvedLoans = DEMO_LOANS.filter(l => l.status === 'approved' || l.status === 'disbursed').length;
  const blockedFraud = DEMO_FRAUD_CASES.filter(c => c.status === 'blocked').length;

  const generateInsights = async () => {
    setIsGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: 'smart_dashboard',
          input: {
            timeRange,
            userRole: profile?.role || 'analyst',
            kpiData: {
              transactions_total: totalTransactions,
              transaction_volume_ngn: totalVolume,
              fraud_flagged: fraudFlagged,
              aml_flagged: amlFlagged,
              fraud_blocked: blockedFraud,
              loans_approved: approvedLoans,
              active_customers: DEMO_CUSTOMERS.length,
              ai_accuracy: 99.2,
              active_agents: 9,
              agent_uptime_avg: 99.7,
              total_alerts: alertCount + DEMO_AML_ALERTS.length,
              risk_distribution: riskDistribution,
              channel_volumes: CHANNEL_TRANSACTION_VOLUME,
            },
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setInsights(data.result);
      } else {
        setError(data.error || 'Failed to generate insights');
      }
    } catch {
      setError('Failed to connect to Smart Dashboard Agent');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Smart Dashboard Agent" subtitle="Unified analytics across Web Banking, Mobile Banking, and all back-office agents" />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* Top KPIs — from shared demo data */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: 'Total Transactions', value: totalTransactions, sub: 'Across all channels', color: 'text-primary' },
              { label: 'Transaction Volume', value: fmtNGN(totalVolume), sub: 'Web + Mobile + Branch', color: 'text-accent-green' },
              { label: 'Fraud Flagged', value: `${fraudFlagged} txns`, sub: `${blockedFraud} blocked by AI`, color: 'text-accent-red' },
              { label: 'AML Alerts', value: DEMO_AML_ALERTS.length, sub: `${amlFlagged} transactions flagged`, color: 'text-accent-amber' },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-surface-card border border-surface-border rounded-2xl p-4">
                <div className={`text-2xl font-bold ${kpi.color} mb-1`}>{kpi.value}</div>
                <div className="text-sm font-medium text-white">{kpi.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* Secondary KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Active Customers', value: DEMO_CUSTOMERS.length, sub: 'Across all segments', color: 'text-accent-cyan' },
              { label: 'Loans Approved', value: approvedLoans, sub: `${DEMO_LOANS.length} total applications`, color: 'text-accent-green' },
              { label: 'AI Accuracy', value: '99.2%', sub: 'Fraud detection rate', color: 'text-primary' },
              { label: 'Agent Uptime', value: '99.7%', sub: '9 agents operational', color: 'text-accent-green' },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-surface-card border border-surface-border rounded-xl p-3">
                <div className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</div>
                <div className="text-xs font-medium text-white mt-0.5">{kpi.label}</div>
                <div className="text-xs text-gray-500">{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* AI Insights Generator */}
          <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">AI Executive Insights</h3>
                <p className="text-xs text-gray-500 mt-0.5">Claude AI analyzes {totalTransactions} transactions across all channels</p>
              </div>
              <div className="flex items-center gap-3">
                <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)}
                  className="bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-primary/50">
                  {['Today', 'This Week', 'This Month', 'This Quarter'].map(r => <option key={r}>{r}</option>)}
                </select>
                <button onClick={generateInsights} disabled={isGenerating}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-primary text-white text-xs font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
                  {isGenerating ? <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Generating...</> : <>✨ Generate Insights</>}
                </button>
              </div>
            </div>
            {error && <div className="mt-3 px-4 py-3 bg-accent-red/10 border border-accent-red/20 rounded-xl text-sm text-accent-red">{error}</div>}
            {insights && (
              <div className="mt-4 space-y-4">
                <div className="p-4 bg-surface-elevated rounded-xl border border-surface-border">
                  <p className="text-xs text-gray-500 mb-1">Executive Summary</p>
                  <p className="text-sm text-white">{insights.executive_summary}</p>
                  <p className="text-xs text-gray-500 mt-2">Confidence: {insights.confidence}%</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {[
                    { title: 'Key Trends', items: insights.key_trends, color: 'text-primary', icon: '📈' },
                    { title: 'Anomalies Detected', items: insights.anomalies, color: 'text-accent-red', icon: '⚠️' },
                    { title: 'Opportunities', items: insights.opportunities, color: 'text-accent-green', icon: '💡' },
                    { title: 'Risk Areas', items: insights.risk_areas, color: 'text-accent-amber', icon: '🔴' },
                    { title: 'Recommended Actions', items: insights.recommended_actions, color: 'text-accent-cyan', icon: '→' },
                  ].map((section) => section.items?.length > 0 && (
                    <div key={section.title} className="bg-surface-elevated rounded-xl p-4">
                      <p className="text-xs font-semibold text-gray-400 mb-2">{section.icon} {section.title}</p>
                      <div className="space-y-1">
                        {section.items.map((item, i) => (
                          <div key={i} className={`text-xs ${section.color} flex items-start gap-1.5`}>
                            <span className="mt-0.5 flex-shrink-0">•</span>{item}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {(['overview', 'channels', 'customers', 'anomalies', 'agents'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${activeTab === tab ? 'bg-gradient-primary text-white shadow-glow-blue' : 'bg-surface-elevated text-gray-400 hover:text-white border border-surface-border'}`}>
                {tab === 'overview' ? 'Transaction Overview' : tab === 'channels' ? 'Channel Analytics' : tab === 'customers' ? 'Customer Summary' : tab === 'anomalies' ? 'Anomaly Detection' : 'Agent Performance'}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="xl:col-span-2 bg-surface-card border border-surface-border rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-1">Daily Transaction Volume — 7 Days</h3>
                  <p className="text-xs text-gray-500 mb-4">All channels: Web Banking, Mobile App, POS, ATM, USSD, Mobile Money, Branch</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={DAILY_TRANSACTION_TREND}>
                      <defs>
                        <linearGradient id="txGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="fraudGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#FF4D4D" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#FF4D4D" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                      <XAxis dataKey="date" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E2D45', borderRadius: '12px', color: '#fff' }} />
                      <Area type="monotone" dataKey="transactions" stroke="#0066FF" fill="url(#txGrad)" strokeWidth={2} name="Transactions" />
                      <Area type="monotone" dataKey="fraudFlags" stroke="#FF4D4D" fill="url(#fraudGrad)" strokeWidth={2} name="Fraud Flags" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-1">Risk Distribution</h3>
                  <p className="text-xs text-gray-500 mb-4">Customer portfolio risk profile</p>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                        {riskDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E2D45', borderRadius: '12px', color: '#fff' }} formatter={(v: number) => `${v}%`} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-2 mt-2">
                    {riskDistribution.map(r => (
                      <div key={r.name} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                          <span className="text-gray-400">{r.name}</span>
                        </div>
                        <span className="text-white font-medium">{r.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Spending Categories */}
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Spending Category Analysis — All Customers</h3>
                <div className="space-y-3">
                  {CATEGORY_SPEND_BREAKDOWN.map((cat) => (
                    <div key={cat.name} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-32 flex-shrink-0">{cat.name}</span>
                      <div className="flex-1 bg-surface-elevated rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${cat.value}%`, backgroundColor: cat.color }}></div>
                      </div>
                      <span className="text-xs font-mono text-white w-8 text-right">{cat.value}%</span>
                      <span className="text-xs text-gray-500 w-28 text-right">{fmtNGN(cat.totalNGN)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'channels' && (
            <div className="space-y-4">
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Transaction Volume by Channel</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={CHANNEL_TRANSACTION_VOLUME}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                    <XAxis dataKey="channel" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E2D45', borderRadius: '12px', color: '#fff' }} />
                    <Bar dataKey="count" fill="#0066FF" radius={[4, 4, 0, 0]} name="Transaction Count" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-surface-border">
                  <h3 className="text-sm font-semibold text-white">Channel Performance Summary</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-border">
                        {['Channel', 'Transaction Count', 'Total Volume', 'Fraud Rate', 'Status'].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {CHANNEL_TRANSACTION_VOLUME.map(ch => (
                        <tr key={ch.channel} className="hover:bg-surface-elevated transition-colors">
                          <td className="px-4 py-3 text-xs font-medium text-white">{ch.channel}</td>
                          <td className="px-4 py-3 text-xs text-gray-400">{ch.count.toLocaleString()}</td>
                          <td className="px-4 py-3 text-xs text-gray-400">{fmtNGN(ch.volume)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium ${ch.fraudRate > 1.5 ? 'text-accent-red' : ch.fraudRate > 1.0 ? 'text-accent-amber' : 'text-accent-green'}`}>{ch.fraudRate}%</span>
                          </td>
                          <td className="px-4 py-3"><span className="text-xs bg-accent-green/10 text-accent-green border border-accent-green/20 px-2 py-0.5 rounded-lg">Active</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-surface-border">
                <h3 className="text-sm font-semibold text-white">Customer Summary — All Channels</h3>
                <p className="text-xs text-gray-500 mt-0.5">{DEMO_CUSTOMERS.length} customers · {totalTransactions} transactions · {fmtNGN(totalVolume)} total volume</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-border">
                      {['Customer', 'Segment', 'Credit Score', 'Risk', 'Transactions', 'Fraud Flags', 'AML Flags', 'Loans', 'Location'].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {DEMO_CUSTOMERS.map(cust => {
                      const txns = DEMO_TRANSACTIONS.filter(t => t.customerId === cust.id);
                      const fraudTxns = txns.filter(t => t.fraudFlag).length;
                      const amlTxns = txns.filter(t => t.amlFlag).length;
                      const loans = DEMO_LOANS.filter(l => l.customerId === cust.id).length;
                      return (
                        <tr key={cust.id} className="hover:bg-surface-elevated transition-colors">
                          <td className="px-4 py-3">
                            <div className="text-xs text-white font-medium">{cust.name}</div>
                            <div className="text-xs text-gray-500">{cust.id}</div>
                          </td>
                          <td className="px-4 py-3"><span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-lg">{cust.segment}</span></td>
                          <td className="px-4 py-3 text-xs font-mono text-white">{cust.creditScore}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-medium ${cust.riskTier === 'Low' ? 'text-accent-green' : cust.riskTier === 'Medium' ? 'text-accent-amber' : 'text-accent-red'}`}>{cust.riskTier}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400">{txns.length}</td>
                          <td className="px-4 py-3">
                            {fraudTxns > 0 ? <span className="text-xs text-accent-red font-medium">{fraudTxns} ⚠</span> : <span className="text-xs text-gray-600">—</span>}
                          </td>
                          <td className="px-4 py-3">
                            {amlTxns > 0 ? <span className="text-xs text-purple-400 font-medium">{amlTxns} 🔍</span> : <span className="text-xs text-gray-600">—</span>}
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-400">{loans}</td>
                          <td className="px-4 py-3 text-xs text-gray-400">{cust.location}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'anomalies' && (
            <div className="space-y-4">
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-1">Anomaly Detection — Weekly Pattern</h3>
                <p className="text-xs text-gray-500 mb-4">Normal vs anomalous transaction patterns</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={anomalyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                    <XAxis dataKey="time" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E2D45', borderRadius: '12px', color: '#fff' }} />
                    <Legend />
                    <Bar dataKey="normal" fill="#0066FF" radius={[4, 4, 0, 0]} name="Normal" />
                    <Bar dataKey="anomaly" fill="#FF4D4D" radius={[4, 4, 0, 0]} name="Anomaly" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Active Anomalies — From Banking Channels</h3>
                <div className="space-y-3">
                  {[
                    { id: 'TXN-10004', type: 'Unusual ATM Time', customer: 'Adaeze Okonkwo', detail: 'ATM withdrawal ₦100,000 at 2:22 AM', risk: 87, channel: 'ATM', status: 'review' },
                    { id: 'TXN-20006', type: 'Account Takeover Attempt', customer: 'Emeka Nwosu', detail: 'New device login + ₦180,000 transfer from Port Harcourt', risk: 94, channel: 'Internet Banking', status: 'blocked' },
                    { id: 'TXN-80001/80002', type: 'Structuring Pattern', customer: 'Ade Enterprises Ltd', detail: 'Two cash deposits ₦4.8M + ₦4.75M within 2 hours', risk: 73, channel: 'Branch', status: 'investigating' },
                    { id: 'TXN-70002', type: 'PEP Offshore Transfer', customer: 'Chioma Holdings Ltd', detail: 'Offshore transfer ₦8.9M to BVI account post large credit', risk: 45, channel: 'Internet Banking', status: 'escalated' },
                  ].map(anomaly => (
                    <div key={anomaly.id} className={`flex items-start justify-between p-4 rounded-xl border ${anomaly.status === 'blocked' ? 'bg-accent-red/5 border-accent-red/20' : anomaly.status === 'escalated' ? 'bg-accent-red/5 border-accent-red/20' : 'bg-accent-amber/5 border-accent-amber/20'}`}>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-mono text-primary">{anomaly.id}</span>
                          <span className="text-xs text-white font-medium">{anomaly.type}</span>
                        </div>
                        <p className="text-xs text-gray-400">{anomaly.customer} · {anomaly.channel}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{anomaly.detail}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-4">
                        <div className="text-xs font-bold text-accent-red">Risk: {anomaly.risk}/100</div>
                        <span className={`text-xs px-2 py-0.5 rounded-lg mt-1 inline-block ${anomaly.status === 'blocked' ? 'bg-accent-red/10 text-accent-red' : anomaly.status === 'escalated' ? 'bg-accent-red/10 text-accent-red' : 'bg-accent-amber/10 text-accent-amber'}`}>{anomaly.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="space-y-4">
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Agent Performance — All 9 AI Agents</h3>
                <div className="space-y-3">
                  {agentPerformance.map((agent) => (
                    <div key={agent.name} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent-green flex-shrink-0"></div>
                      <span className="text-xs text-gray-400 w-36 flex-shrink-0">{agent.name}</span>
                      <div className="flex-1 bg-surface-elevated rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${agent.uptime}%`, backgroundColor: agent.color }}></div>
                      </div>
                      <span className="text-xs font-mono text-white w-12 text-right">{agent.uptime}%</span>
                      <span className="text-xs text-gray-500 w-24 text-right">{agent.requests.toLocaleString()} reqs</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
