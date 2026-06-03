'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface PersonalizationProfile {
  customerId: string;
  customerName: string;
  engagementScore: number;
  riskAppetite: string;
  spendingCategories: Record<string, number>;
  insights: string[];
  productRecommendations: string[];
  savingsOpportunities: string[];
  budgetingTips: string[];
    aiInsights: string;
}

const sampleProfiles = [
  { id: 'CUST-4421', name: 'Adaeze Okonkwo', segment: 'Premium', engagement: 87, balance: 847250, riskAppetite: 'moderate', monthlyIncome: 450000 },
  { id: 'CUST-8812', name: 'Kwame Mensah', segment: 'Standard', engagement: 62, balance: 234100, riskAppetite: 'conservative', monthlyIncome: 280000 },
  { id: 'CUST-3301', name: 'Fatima Al-Hassan', segment: 'Premium', engagement: 91, balance: 1240000, riskAppetite: 'aggressive', monthlyIncome: 680000 },
  { id: 'CUST-7712', name: 'Emeka Okafor', segment: 'Standard', engagement: 45, balance: 89400, riskAppetite: 'conservative', monthlyIncome: 180000 },
];

const spendingRadarData = [
  { category: 'Food', value: 35 },
  { category: 'Transport', value: 18 },
  { category: 'Utilities', value: 12 },
  { category: 'Entertainment', value: 8 },
  { category: 'Savings', value: 20 },
  { category: 'Healthcare', value: 7 },
];

const engagementData = [
  { month: 'Jan', score: 72 },
  { month: 'Feb', score: 75 },
  { month: 'Mar', score: 68 },
  { month: 'Apr', score: 81 },
  { month: 'May', score: 87 },
  { month: 'Jun', score: 91 },
];

const productCatalog = [
  { name: 'Premium Savings Account', category: 'Savings', rate: '8.5% p.a.', match: 96, icon: '🏦' },
  { name: 'Micro Investment Plan', category: 'Investment', rate: 'From ₦5,000/mo', match: 89, icon: '📈' },
  { name: 'Education Loan', category: 'Credit', rate: '12% p.a.', match: 82, icon: '🎓' },
  { name: 'Home Ownership Plan', category: 'Mortgage', rate: '15% p.a.', match: 74, icon: '🏠' },
  { name: 'Business Starter Pack', category: 'Business', rate: 'Zero fees 6mo', match: 68, icon: '💼' },
  { name: 'Insurance Bundle', category: 'Insurance', rate: '₦2,500/mo', match: 61, icon: '🛡️' },
];

const savingsGoals = [
  { goal: 'Emergency Fund', target: 1350000, current: 847250, color: '#1B365D' },
  { goal: 'Children Education', target: 5000000, current: 1200000, color: '#F47558' },
  { goal: 'Home Ownership', target: 15000000, current: 2400000, color: '#00C896' },
];

const expenseAlerts = [
  { category: 'Dining Out', amount: 45000, budget: 30000, status: 'over', pct: 150 },
  { category: 'Transport', amount: 18000, budget: 25000, status: 'ok', pct: 72 },
  { category: 'Entertainment', amount: 12000, budget: 15000, status: 'ok', pct: 80 },
  { category: 'Utilities', amount: 28000, budget: 30000, status: 'warning', pct: 93 },
];

export default function PersonalizationPage() {
  const [selectedCustomer, setSelectedCustomer] = useState(sampleProfiles[0]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [profile, setProfile] = useState<PersonalizationProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'insights' | 'recommendations' | 'savings' | 'budgeting'>('insights');
  const [error, setError] = useState('');

  const runPersonalizationAgent = async () => {
    setIsAnalyzing(true);
    setError('');
    try {
      const res = await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: 'personalization',
          input: {
            customerId: selectedCustomer.id,
            customerName: selectedCustomer.name,
            accountBalance: selectedCustomer.balance,
            monthlyIncome: selectedCustomer.monthlyIncome,
            spendingData: 'Food: 35%, Transport: 18%, Utilities: 12%, Entertainment: 8%, Savings: 20%, Healthcare: 7%',
            savingsGoals: 'Emergency fund, children education, home ownership',
            productHistory: 'Basic savings account, mobile banking active, no loans',
            riskAppetite: selectedCustomer.riskAppetite,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        const r = data.result;
        setProfile({
          customerId: selectedCustomer.id,
          customerName: selectedCustomer.name,
          engagementScore: r.engagement_score || selectedCustomer.engagement,
          riskAppetite: selectedCustomer.riskAppetite,
          spendingCategories: r.spending_categories || {},
          insights: r.insights || [],
          productRecommendations: r.product_recommendations || [],
          savingsOpportunities: r.savings_opportunities || [],
          budgetingTips: r.budgeting_tips || [],
                    aiInsights: r.analysis || '',
        });
      } else {
        setError(data.error || 'Analysis failed');
      }
    } catch {
      setError('Failed to connect to Personalization Agent');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Personalization Agent" subtitle="AI-powered spending insights, smart budgeting, product recommendations & automated savings" />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Customer Selector */}
          <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-brand-dark">Customer Profile Analysis</h2>
                <p className="text-xs text-brand-grey mt-0.5">Select a customer to generate AI-powered personalization insights</p>
              </div>
              <button
                onClick={runPersonalizationAgent}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-light transition-colors disabled:opacity-50"
              >
                {isAnalyzing ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Analyzing...</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>Run Agent</>
                )}
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {sampleProfiles.map((cust) => (
                <button
                  key={cust.id}
                  onClick={() => { setSelectedCustomer(cust); setProfile(null); }}
                  className={`p-3 rounded-xl border text-left transition-all ${selectedCustomer.id === cust.id ? 'border-primary/40 bg-primary/5' : 'border-surface-border bg-surface-elevated hover:border-primary/20'}`}
                >
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white mb-2">
                    {cust.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="text-xs font-semibold text-brand-dark truncate">{cust.name}</div>
                  <div className="text-xs text-brand-grey">{cust.id}</div>
                  <div className={`text-xs mt-1 font-medium ${cust.segment === 'Premium' ? 'text-accent-amber' : 'text-brand-grey'}`}>{cust.segment}</div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 bg-accent-red/5 border border-accent-red/20 rounded-xl text-sm text-accent-red">{error}</div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Spending Radar */}
            <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
              <h3 className="text-sm font-semibold text-brand-dark mb-1">Spending Pattern</h3>
              <p className="text-xs text-brand-grey mb-4">AI-powered spending categorization</p>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={spendingRadarData}>
                  <PolarGrid stroke="#E2E8F0" />
                  <PolarAngleAxis dataKey="category" tick={{ fill: '#8C757D', fontSize: 11 }} />
                  <Radar name="Spending" dataKey="value" stroke="#1B365D" fill="#1B365D" fillOpacity={0.15} />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            {/* Engagement Trend */}
            <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
              <h3 className="text-sm font-semibold text-brand-dark mb-1">Engagement Score Trend</h3>
              <p className="text-xs text-brand-grey mb-4">Monthly digital banking engagement</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                  <XAxis dataKey="month" tick={{ fill: '#8C757D', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#8C757D', fontSize: 11 }} domain={[0, 100]} />
                  <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#343A40' }} />
                  <Bar dataKey="score" fill="#F47558" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Customer Stats */}
            <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card space-y-4">
              <h3 className="text-sm font-semibold text-brand-dark">Customer Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-brand-grey">Customer ID</span>
                  <span className="text-xs font-mono text-primary font-semibold">{selectedCustomer.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-brand-grey">Balance</span>
                  <span className="text-xs font-semibold text-brand-dark">₦{selectedCustomer.balance.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-brand-grey">Monthly Income</span>
                  <span className="text-xs font-semibold text-brand-dark">₦{selectedCustomer.monthlyIncome.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-brand-grey">Segment</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${selectedCustomer.segment === 'Premium' ? 'text-accent-amber bg-accent-amber/10' : 'text-brand-grey bg-surface-elevated'}`}>{selectedCustomer.segment}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-brand-grey">Risk Appetite</span>
                  <span className="text-xs text-brand-dark capitalize font-medium">{selectedCustomer.riskAppetite}</span>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-brand-grey">Engagement Score</span>
                    <span className="text-xs font-semibold text-accent-green">{profile?.engagementScore || selectedCustomer.engagement}%</span>
                  </div>
                  <div className="w-full bg-surface-elevated rounded-full h-2">
                    <div className="bg-accent-green h-2 rounded-full transition-all" style={{ width: `${profile?.engagementScore || selectedCustomer.engagement}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expense Alerts */}
          <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-brand-dark">Real-Time Expense Tracking & Alerts</h3>
                <p className="text-xs text-brand-grey mt-0.5">Budget vs actual spending this month</p>
              </div>
              <span className="text-xs bg-accent-red/10 text-accent-red border border-accent-red/20 px-2 py-0.5 rounded-full font-medium">1 Over Budget</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {expenseAlerts.map((item) => (
                <div key={item.category} className={`p-4 rounded-xl border ${item.status === 'over' ? 'border-accent-red/20 bg-accent-red/5' : item.status === 'warning' ? 'border-accent-amber/20 bg-accent-amber/5' : 'border-surface-border bg-surface-elevated'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-brand-dark">{item.category}</span>
                    <span className={`text-xs font-bold ${item.status === 'over' ? 'text-accent-red' : item.status === 'warning' ? 'text-accent-amber' : 'text-accent-green'}`}>{item.pct}%</span>
                  </div>
                  <div className="w-full bg-white rounded-full h-1.5 mb-2">
                    <div
                      className={`h-1.5 rounded-full transition-all ${item.status === 'over' ? 'bg-accent-red' : item.status === 'warning' ? 'bg-accent-amber' : 'bg-accent-green'}`}
                      style={{ width: `${Math.min(item.pct, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-brand-grey">
                    <span>₦{(item.amount / 1000).toFixed(0)}K spent</span>
                    <span>₦{(item.budget / 1000).toFixed(0)}K budget</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Savings Goals */}
          <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-brand-dark">Automated Savings Goals</h3>
                <p className="text-xs text-brand-grey mt-0.5">Goal progress tracking & smart savings suggestions</p>
              </div>
              <button className="text-xs text-primary font-medium hover:underline">+ Add Goal</button>
            </div>
            <div className="space-y-4">
              {savingsGoals.map((goal) => {
                const pct = Math.round((goal.current / goal.target) * 100);
                return (
                  <div key={goal.goal} className="p-4 bg-surface-elevated rounded-xl border border-surface-border">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-brand-dark">{goal.goal}</span>
                      <span className="text-xs font-bold text-brand-dark">{pct}%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-2 mb-2">
                      <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: goal.color }}></div>
                    </div>
                    <div className="flex justify-between text-xs text-brand-grey">
                      <span>₦{(goal.current / 1000000).toFixed(2)}M saved</span>
                      <span>Target: ₦{(goal.target / 1000000).toFixed(1)}M</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* AI Insights */}
          <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
                <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-brand-dark">AI Personalization Analysis</h3>
              {profile && <span className="ml-auto text-xs text-accent-green bg-accent-green/10 border border-accent-green/20 px-2 py-0.5 rounded-full">Live Analysis</span>}
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mb-4 bg-surface-elevated rounded-xl p-1">
              {(['insights', 'recommendations', 'savings', 'budgeting'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${activeTab === tab ? 'bg-white text-primary shadow-sm' : 'text-brand-grey hover:text-brand-dark'}`}
                >
                  {tab === 'recommendations' ? 'Products' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'insights' && (
              <div className="space-y-2">
                {profile && profile.insights.length > 0 ? profile.insights.map((insight, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-surface-elevated rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-primary font-bold">{i + 1}</span>
                    </div>
                    <p className="text-xs text-brand-dark">{insight}</p>
                  </div>
                )) : profile ? (
                                  <p className="text-xs text-brand-grey italic p-3 bg-surface-elevated rounded-xl">{profile.aiInsights}</p>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium text-brand-dark mb-1">Run the Personalization Agent</p>
                    <p className="text-xs text-brand-grey">Select a customer and click "Run Agent" to generate AI-powered insights</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {(profile && profile.productRecommendations.length > 0 ? profile.productRecommendations.map((rec, i) => ({ name: rec, category: 'AI Recommended', rate: '', match: 90 - i * 5, icon: '✨' })) : productCatalog).map((prod, i) => (
                  <div key={i} className="p-4 bg-surface-elevated rounded-xl border border-surface-border hover:border-primary/30 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-lg">{typeof prod === 'object' && 'icon' in prod ? prod.icon : '✨'}</span>
                      <span className="text-xs font-bold text-accent-green bg-accent-green/10 px-2 py-0.5 rounded-full">{typeof prod === 'object' && 'match' in prod ? prod.match : 90}% match</span>
                    </div>
                    <div className="text-xs font-semibold text-brand-dark mb-1">{typeof prod === 'string' ? prod : prod.name}</div>
                    {typeof prod === 'object' && 'category' in prod && <div className="text-xs text-brand-grey">{prod.category}</div>}
                    {typeof prod === 'object' && 'rate' in prod && prod.rate && <div className="text-xs text-primary font-medium mt-1">{prod.rate}</div>}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'savings' && (
              <div className="space-y-3">
                {(profile && profile.savingsOpportunities.length > 0 ? profile.savingsOpportunities : [
                  'Redirect ₦15,000/month from dining to emergency fund — reach target 4 months sooner',
                  'Enable auto-save on salary credit: 10% auto-transfer to high-yield savings',
                  'Consolidate 3 small subscriptions saving ₦4,500/month',
                  'Invest idle balance above ₦500K in money market fund at 12% p.a.',
                ]).map((opp, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-accent-green/5 border border-accent-green/20 rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-accent-green/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-accent-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-xs text-brand-dark">{opp}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'budgeting' && (
              <div className="space-y-3">
                {(profile && profile.budgetingTips.length > 0 ? profile.budgetingTips : [
                  'Apply the 50/30/20 rule: 50% needs, 30% wants, 20% savings — currently at 62/18/20',
                  'Set up weekly spending alerts at 75% of category budget to avoid overruns',
                  'Dining budget exceeded by 50% — consider meal planning to save ₦15,000/month',
                  'Utilities approaching budget limit — review subscription services for savings',
                  'Transport costs are well-managed — consider investing the surplus ₦7,000/month',
                ]).map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-xl">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs text-primary font-bold">{i + 1}</span>
                    </div>
                    <p className="text-xs text-brand-dark">{tip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
