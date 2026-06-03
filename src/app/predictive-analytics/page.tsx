'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line, BarChart, Bar, Legend } from 'recharts';

interface PredictiveResult {
  cashFlowForecast: Array<{ month: string; inflow: number; outflow: number; net: number }>;
  financialHealthScore: number;
  riskAlerts: string[];
  opportunities: string[];
  analysis: string;
  confidence: number;
}

const sampleCustomers = [
  { id: 'CUST-4421', name: 'Adaeze Okonkwo', type: 'Individual', avgMonthlyIncome: 450000 },
  { id: 'CUST-8812', name: 'Kwame Mensah', type: 'Individual', avgMonthlyIncome: 280000 },
  { id: 'CUST-3301', name: 'Lagos Micro Finance', type: 'MSME', avgMonthlyIncome: 2400000 },
];

const defaultForecast = [
  { month: 'Jul', inflow: 450000, outflow: 380000, net: 70000 },
  { month: 'Aug', inflow: 460000, outflow: 395000, net: 65000 },
  { month: 'Sep', inflow: 440000, outflow: 410000, net: 30000 },
  { month: 'Oct', inflow: 480000, outflow: 420000, net: 60000 },
  { month: 'Nov', inflow: 520000, outflow: 490000, net: 30000 },
  { month: 'Dec', inflow: 600000, outflow: 580000, net: 20000 },
];

const healthMetrics = [
  { label: 'Savings Rate', value: 18, target: 20, color: '#1B365D' },
  { label: 'Debt-to-Income', value: 32, target: 35, color: '#00C896' },
  { label: 'Emergency Fund', value: 65, target: 100, color: '#FFB020' },
  { label: 'Investment Rate', value: 8, target: 15, color: '#F47558' },
];

const spendingForecastData = [
  { month: 'Jan', food: 35000, transport: 18000, utilities: 12000, entertainment: 8000 },
  { month: 'Feb', food: 38000, transport: 19000, utilities: 11500, entertainment: 9000 },
  { month: 'Mar', food: 33000, transport: 17000, utilities: 13000, entertainment: 7500 },
  { month: 'Apr', food: 40000, transport: 20000, utilities: 12500, entertainment: 10000 },
  { month: 'May', food: 42000, transport: 18500, utilities: 11000, entertainment: 8500 },
  { month: 'Jun', food: 45000, transport: 21000, utilities: 12000, entertainment: 12000 },
];

const billReminders = [
  { bill: 'Electricity (EKEDC)', amount: 18500, dueDate: 'Jul 15', daysLeft: 8, status: 'upcoming' },
  { bill: 'Internet (MTN Fiber)', amount: 12000, dueDate: 'Jul 18', daysLeft: 11, status: 'upcoming' },
  { bill: 'Rent', amount: 150000, dueDate: 'Aug 1', daysLeft: 25, status: 'scheduled' },
  { bill: 'Insurance Premium', amount: 8500, dueDate: 'Jul 10', daysLeft: 3, status: 'urgent' },
];

const biDashboardMetrics = [
  { label: 'Avg Monthly Surplus', value: '₦47.5K', trend: '+12%', positive: true },
  { label: 'Savings Rate', value: '18%', trend: '+2pp', positive: true },
  { label: 'Debt Coverage', value: '3.2x', trend: '+0.4x', positive: true },
  { label: 'Investment Return', value: '11.2%', trend: '+1.8%', positive: true },
];

export default function PredictiveAnalyticsPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(sampleCustomers[0]);
  const [forecastPeriod, setForecastPeriod] = useState('6 months');
  const [isForecasting, setIsForecasting] = useState(false);
  const [result, setResult] = useState<PredictiveResult | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'cashflow' | 'spending' | 'health' | 'bills'>('cashflow');

  const runPredictiveAgent = async () => {
    setIsForecasting(true);
    setError('');
    try {
      const res = await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: 'predictive_analytics',
          input: {
            customerId: selectedCustomer.id,
            historicalTransactions: `Average monthly income: NGN ${selectedCustomer.avgMonthlyIncome.toLocaleString()}. Regular expenses: rent 30%, food 25%, transport 15%, utilities 10%, savings 20%. Seasonal spike in December (festive spending +40%).`,
            forecastPeriod,
            includeMarketTrends: true,
            includeBillReminders: true,
            includeSpendingForecast: true,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        const r = data.result;
        setResult({
          cashFlowForecast: r.cash_flow_forecast || defaultForecast,
          financialHealthScore: r.financial_health_score || 72,
          riskAlerts: r.risk_alerts || [],
          opportunities: r.opportunities || [],
          analysis: r.analysis || '',
          confidence: r.confidence || 85,
        });
      } else {
        setError(data.error || 'Forecast failed');
      }
    } catch {
      setError('Failed to connect to Predictive Analytics Agent');
    } finally {
      setIsForecasting(false);
    }
  };

  const forecastData = result?.cashFlowForecast || defaultForecast;
  const healthScore = result?.financialHealthScore || 72;

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Predictive Analytics Agent" subtitle="Time-series forecasting, cash flow prediction, spending analysis & financial health indicators" />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Controls */}
          <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-48">
                <label className="block text-xs font-semibold text-brand-dark mb-1.5">Customer / Entity</label>
                <select
                  value={selectedCustomer.id}
                  onChange={(e) => setSelectedCustomer(sampleCustomers.find(c => c.id === e.target.value) || sampleCustomers[0])}
                  className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2.5 text-sm text-brand-dark outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                >
                  {sampleCustomers.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-36">
                <label className="block text-xs font-semibold text-brand-dark mb-1.5">Forecast Period</label>
                <select
                  value={forecastPeriod}
                  onChange={(e) => setForecastPeriod(e.target.value)}
                  className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2.5 text-sm text-brand-dark outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                >
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>12 months</option>
                </select>
              </div>
              <button
                onClick={runPredictiveAgent}
                disabled={isForecasting}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-light transition-colors disabled:opacity-50"
              >
                {isForecasting ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Forecasting...</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>Run Forecast</>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 bg-accent-red/5 border border-accent-red/20 rounded-xl text-sm text-accent-red">{error}</div>
          )}

          {/* BI Dashboard KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {biDashboardMetrics.map((m) => (
              <div key={m.label} className="bg-white border border-surface-border rounded-2xl p-4 shadow-card">
                <div className="text-xs text-brand-grey mb-1">{m.label}</div>
                <div className="text-2xl font-bold text-brand-dark">{m.value}</div>
                <div className={`text-xs mt-1 font-medium ${m.positive ? 'text-accent-green' : 'text-accent-red'}`}>{m.trend} vs last period</div>
              </div>
            ))}
          </div>

          {/* Additional KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white border border-surface-border rounded-2xl p-4 shadow-card">
              <div className="text-xs text-brand-grey mb-1">Financial Health Score</div>
              <div className="text-2xl font-bold text-brand-dark">{healthScore}<span className="text-sm text-brand-grey">/100</span></div>
              <div className={`text-xs mt-1 font-medium ${healthScore >= 80 ? 'text-accent-green' : healthScore >= 60 ? 'text-accent-amber' : 'text-accent-red'}`}>
                {healthScore >= 80 ? '● Excellent' : healthScore >= 60 ? '● Good' : '● Needs Attention'}
              </div>
            </div>
            <div className="bg-white border border-surface-border rounded-2xl p-4 shadow-card">
              <div className="text-xs text-brand-grey mb-1">Avg Monthly Net</div>
              <div className="text-2xl font-bold text-brand-dark">₦{((forecastData.reduce((s, d) => s + d.net, 0) / forecastData.length) / 1000).toFixed(0)}K</div>
              <div className="text-xs text-accent-green mt-1 font-medium">Projected surplus</div>
            </div>
            <div className="bg-white border border-surface-border rounded-2xl p-4 shadow-card">
              <div className="text-xs text-brand-grey mb-1">Risk Alerts</div>
              <div className="text-2xl font-bold text-brand-dark">{result?.riskAlerts?.length || 2}</div>
              <div className="text-xs text-accent-amber mt-1 font-medium">Requires attention</div>
            </div>
            <div className="bg-white border border-surface-border rounded-2xl p-4 shadow-card">
              <div className="text-xs text-brand-grey mb-1">Forecast Confidence</div>
              <div className="text-2xl font-bold text-brand-dark">{result?.confidence || 85}%</div>
              <div className="text-xs text-primary mt-1 font-medium">ML model accuracy</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-surface-border rounded-2xl p-1 shadow-card">
            {(['cashflow', 'spending', 'health', 'bills'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-medium rounded-xl capitalize transition-all ${activeTab === tab ? 'bg-primary text-white shadow-sm' : 'text-brand-grey hover:text-brand-dark'}`}
              >
                {tab === 'cashflow' ? 'Cash Flow' : tab === 'health' ? 'Health Indicators' : tab === 'bills' ? 'Bill Reminders' : 'Spending Forecast'}
              </button>
            ))}
          </div>

          {activeTab === 'cashflow' && (
            <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
              <h3 className="text-sm font-semibold text-brand-dark mb-1">Cash Flow Forecast — {forecastPeriod}</h3>
              <p className="text-xs text-brand-grey mb-4">Predicted inflows, outflows, and net position</p>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={forecastData}>
                  <defs>
                    <linearGradient id="inflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00C896" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00C896" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="outflowGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F47558" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#F47558" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fill: '#8C757D', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#8C757D', fontSize: 11 }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}K`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#343A40' }}
                    formatter={(value: number) => [`₦${value.toLocaleString()}`, '']}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="inflow" stroke="#00C896" fill="url(#inflowGrad)" strokeWidth={2} name="Inflow" />
                  <Area type="monotone" dataKey="outflow" stroke="#F47558" fill="url(#outflowGrad)" strokeWidth={2} name="Outflow" />
                  <Line type="monotone" dataKey="net" stroke="#1B365D" strokeWidth={2} dot={{ fill: '#1B365D', r: 4 }} name="Net" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === 'spending' && (
            <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
              <h3 className="text-sm font-semibold text-brand-dark mb-1">Spending Pattern Analysis & Forecast</h3>
              <p className="text-xs text-brand-grey mb-4">Category-level spending trends and predictions</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={spendingForecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fill: '#8C757D', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#8C757D', fontSize: 11 }} tickFormatter={(v) => `₦${(v / 1000).toFixed(0)}K`} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#343A40' }} formatter={(v: number) => [`₦${v.toLocaleString()}`, '']} />
                  <Legend />
                  <Bar dataKey="food" fill="#1B365D" name="Food" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="transport" fill="#F47558" name="Transport" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="utilities" fill="#00C896" name="Utilities" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="entertainment" fill="#FFB020" name="Entertainment" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {activeTab === 'health' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
                <h3 className="text-sm font-semibold text-brand-dark mb-1">Financial Health Indicators</h3>
                <p className="text-xs text-brand-grey mb-4">Key metrics vs recommended targets</p>
                <div className="space-y-5">
                  {healthMetrics.map((metric) => (
                    <div key={metric.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-medium text-brand-dark">{metric.label}</span>
                        <span className="text-xs font-semibold text-brand-dark">{metric.value}% <span className="text-brand-grey font-normal">/ {metric.target}% target</span></span>
                      </div>
                      <div className="w-full bg-surface-elevated rounded-full h-2">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${Math.min((metric.value / metric.target) * 100, 100)}%`, backgroundColor: metric.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-5 h-5 rounded-lg bg-primary flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-brand-dark">AI Forecast Insights</h3>
                </div>
                {result ? (
                  <div className="space-y-3">
                    {result.riskAlerts.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-accent-amber mb-2">⚠ Risk Alerts</p>
                        {result.riskAlerts.map((alert, i) => (
                          <div key={i} className="text-xs text-brand-dark py-1.5 border-b border-surface-border last:border-0">{alert}</div>
                        ))}
                      </div>
                    )}
                    {result.opportunities.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-accent-green mb-2">✓ Opportunities</p>
                        {result.opportunities.map((opp, i) => (
                          <div key={i} className="text-xs text-brand-dark py-1.5 border-b border-surface-border last:border-0">{opp}</div>
                        ))}
                      </div>
                    )}
                    {result.analysis && (
                      <p className="text-xs text-brand-grey italic mt-2 p-3 bg-surface-elevated rounded-xl">{result.analysis}</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm font-medium text-brand-dark mb-1">Run the forecast</p>
                    <p className="text-xs text-brand-grey">Click "Run Forecast" to see AI insights and risk alerts</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'bills' && (
            <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-brand-dark">Predictive Bill Reminders</h3>
                  <p className="text-xs text-brand-grey mt-0.5">Upcoming payments and scheduled bills</p>
                </div>
                <span className="text-xs bg-accent-red/10 text-accent-red border border-accent-red/20 px-2 py-0.5 rounded-full font-medium">1 Urgent</span>
              </div>
              <div className="space-y-3">
                {billReminders.map((bill) => (
                  <div key={bill.bill} className={`flex items-center justify-between p-4 rounded-xl border ${bill.status === 'urgent' ? 'border-accent-red/20 bg-accent-red/5' : bill.status === 'upcoming' ? 'border-accent-amber/20 bg-accent-amber/5' : 'border-surface-border bg-surface-elevated'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${bill.status === 'urgent' ? 'bg-accent-red' : bill.status === 'upcoming' ? 'bg-accent-amber' : 'bg-accent-green'}`}></div>
                      <div>
                        <div className="text-sm font-semibold text-brand-dark">{bill.bill}</div>
                        <div className="text-xs text-brand-grey">Due: {bill.dueDate}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-brand-dark">₦{bill.amount.toLocaleString()}</div>
                      <div className={`text-xs font-medium ${bill.status === 'urgent' ? 'text-accent-red' : bill.status === 'upcoming' ? 'text-accent-amber' : 'text-accent-green'}`}>
                        {bill.daysLeft} days left
                      </div>
                    </div>
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
