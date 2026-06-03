'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Link from 'next/link';
import { useChatCompletion } from '@/lib/ai/chatCompletion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const cashFlowData = [
  { month: 'Jan', actual: 42, forecast: 44 },
  { month: 'Feb', actual: 38, forecast: 40 },
  { month: 'Mar', actual: 51, forecast: 49 },
  { month: 'Apr', actual: 46, forecast: 48 },
  { month: 'May', actual: 55, forecast: 53 },
  { month: 'Jun', actual: null, forecast: 58 },
  { month: 'Jul', actual: null, forecast: 62 },
];

const supplyChainData = [
  { supplier: 'Supplier A', risk: 15, opportunity: 85 },
  { supplier: 'Supplier B', risk: 32, opportunity: 68 },
  { supplier: 'Supplier C', risk: 8, opportunity: 92 },
  { supplier: 'Supplier D', risk: 45, opportunity: 55 },
  { supplier: 'Supplier E', risk: 22, opportunity: 78 },
];

export default function CorporateBankingPage() {
  const [activeUseCase, setActiveUseCase] = useState(0);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const { sendMessage } = useChatCompletion();

  const useCases = [
    {
      id: 'cashflow',
      title: 'Cash Flow Forecasting',
      icon: '💰',
      color: 'bg-blue-600',
      description: 'AI-powered cash flow prediction models that analyze historical transactions, seasonal patterns, and macroeconomic indicators to help corporate clients optimize working capital and treasury operations.',
      capabilities: [
        'Multi-horizon forecasting (7-day to 12-month)',
        'Seasonal pattern recognition and adjustment',
        'Macroeconomic indicator integration',
        'Multi-currency cash flow modeling',
        'Scenario-based what-if analysis',
        'Automated treasury recommendations',
        'Integration with ERP and accounting systems',
        'Real-time forecast updates on new transactions',
      ],
      benefits: [
        { metric: '35%', label: 'Improved liquidity management' },
        { metric: '28%', label: 'Reduced financing costs' },
        { metric: '92%', label: 'Forecast accuracy (30-day)' },
        { metric: '40%', label: 'Better treasury operations' },
      ],
      kpis: ['Forecast Accuracy', 'Working Capital Efficiency', 'Financing Cost Reduction', 'Treasury Optimization Score'],
    },
    {
      id: 'supply-chain',
      title: 'Supply Chain Finance Optimization',
      icon: '🔗',
      color: 'bg-[#1B365D]',
      description: 'AI analysis of supply chain data to identify financing opportunities, optimize payment terms, assess supplier risk, and create new revenue streams through dynamic discounting and reverse factoring.',
      capabilities: [
        'Supplier financial health scoring',
        'Dynamic discounting optimization',
        'Reverse factoring program management',
        'Supply chain risk mapping',
        'Payment term optimization recommendations',
        'Financing opportunity identification',
        'Supplier onboarding automation',
        'Real-time supply chain visibility dashboard',
      ],
      benefits: [
        { metric: '22%', label: 'Reduced supply chain costs' },
        { metric: '18%', label: 'Improved working capital' },
        { metric: '3x', label: 'New revenue opportunities' },
        { metric: '45%', label: 'Stronger supplier relationships' },
      ],
      kpis: ['Supply Chain Cost Reduction', 'Working Capital Improvement', 'New Revenue Generated', 'Supplier Satisfaction Score'],
    },
    {
      id: 'bi-dashboard',
      title: 'Business Intelligence Dashboard',
      icon: '📊',
      color: 'bg-[#F47558]',
      description: 'Comprehensive financial analytics and AI-powered visualizations providing corporate clients with real-time insights, benchmarking, and strategic recommendations for data-driven decision making.',
      capabilities: [
        'Real-time financial performance monitoring',
        'Industry benchmarking and peer comparison',
        'AI-generated executive insights and narratives',
        'Custom KPI tracking and alerting',
        'Predictive revenue and expense modeling',
        'Regulatory reporting automation',
        'Multi-entity consolidation views',
        'Mobile-optimized executive dashboards',
      ],
      benefits: [
        { metric: '50%', label: 'Faster financial reporting' },
        { metric: '40%', label: 'Better strategic decisions' },
        { metric: '30%', label: 'Stronger client relationships' },
        { metric: '25%', label: 'Increased client retention' },
      ],
      kpis: ['Reporting Speed', 'Decision Quality Score', 'Client Satisfaction', 'Revenue per Client'],
    },
  ];

  const handleAiAnalysis = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiResponse('');
    try {
      const result = await sendMessage([
        {
          role: 'system',
          content: 'You are a SmartBankAI corporate banking specialist. Provide expert insights on AI applications in corporate banking including cash flow management, supply chain finance, and business intelligence. Keep responses under 200 words.',
        },
        { role: 'user', content: aiQuery },
      ]);
      setAiResponse(result?.content || 'Unable to generate response.');
    } catch {
      setAiResponse('Analysis unavailable. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const current = useCases[activeUseCase];

  return (
    <div className="flex h-screen bg-surface-base overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Corporate Banking Use Cases" subtitle="AI-powered intelligence for corporate clients" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-2 text-xs text-brand-grey mb-5">
            <Link href="/use-cases" className="hover:text-[#F47558] transition-colors">Use Cases</Link>
            <span>/</span>
            <span className="text-brand-dark font-medium">Corporate Banking</span>
          </div>

          <div className="bg-blue-600 rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-cyan-400 blur-3xl transform translate-x-1/3 -translate-y-1/3" />
            </div>
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🏢</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">Corporate Banking</h2>
                    <p className="text-white/70 text-sm">AI-powered intelligence for corporate clients</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm max-w-2xl">
                  Deliver superior value to corporate clients with AI-powered cash flow forecasting, supply chain finance optimization, and comprehensive business intelligence that drives data-driven decisions.
                </p>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-2 flex-shrink-0">
                {[{ v: '3', l: 'Use Cases' }, { v: '92%', l: 'Forecast Accuracy' }, { v: '35%', l: 'Cost Reduction' }, { v: '3x', l: 'Revenue Opportunities' }].map((s) => (
                  <div key={s.l} className="bg-white/10 rounded-xl px-3 py-2 text-center">
                    <div className="text-base font-bold text-white">{s.v}</div>
                    <div className="text-xs text-white/60">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <div className="space-y-3">
              {useCases.map((uc, i) => (
                <button
                  key={uc.id}
                  onClick={() => setActiveUseCase(i)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    activeUseCase === i ? 'border-[#F47558] bg-white shadow-card' : 'border-surface-border bg-white hover:border-[#F47558]/40'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <div className={`w-8 h-8 rounded-lg ${uc.color} flex items-center justify-center text-base`}>{uc.icon}</div>
                    <span className="text-sm font-bold text-brand-dark">{uc.title}</span>
                  </div>
                  <p className="text-xs text-brand-grey line-clamp-2 ml-11">{uc.description.slice(0, 70)}...</p>
                </button>
              ))}
              <div className="bg-white rounded-xl border border-surface-border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.75 3.75 0 01-5.303 0l-.347-.347z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-brand-dark">Corporate AI Advisor</span>
                </div>
                <textarea
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ask about corporate banking AI..."
                  className="w-full text-xs border border-surface-border rounded-lg p-2.5 resize-none h-20 focus:outline-none focus:border-blue-600 text-brand-dark"
                />
                <button
                  onClick={handleAiAnalysis}
                  disabled={aiLoading || !aiQuery.trim()}
                  className="w-full mt-2 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {aiLoading ? 'Analyzing...' : 'Get AI Insights'}
                </button>
                {aiResponse && (
                  <div className="mt-3 p-3 bg-surface-elevated rounded-lg border border-surface-border">
                    <p className="text-xs text-brand-dark leading-relaxed">{aiResponse}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
                <div className={`${current.color} p-5`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{current.icon}</span>
                    <h3 className="text-lg font-bold text-white">{current.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-brand-grey mb-4">{current.description}</p>
                  <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wide mb-3">Key Capabilities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {current.capabilities.map((cap, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-brand-dark">
                        <svg className="w-4 h-4 text-[#F47558] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {cap}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {current.benefits.map((b, i) => (
                  <div key={i} className="bg-white rounded-xl border border-surface-border p-4 text-center">
                    <div className="text-xl font-bold text-blue-600 mb-1">{b.metric}</div>
                    <div className="text-xs text-brand-grey">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-surface-border p-5">
              <h3 className="text-sm font-bold text-brand-dark mb-4">Cash Flow Forecast vs Actual (₦M)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={cashFlowData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="actual" stroke="#1B365D" strokeWidth={2} dot={{ r: 3 }} name="Actual" connectNulls={false} />
                  <Line type="monotone" dataKey="forecast" stroke="#F47558" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 3 }} name="AI Forecast" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl border border-surface-border p-5">
              <h3 className="text-sm font-bold text-brand-dark mb-4">Supply Chain Risk vs Opportunity Score</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={supplyChainData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" tick={{ fontSize: 11 }} unit="%" />
                  <YAxis dataKey="supplier" type="category" tick={{ fontSize: 10 }} width={70} />
                  <Tooltip formatter={(v: number) => [`${v}%`]} />
                  <Bar dataKey="opportunity" fill="#1B365D" name="Opportunity" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="risk" fill="#F47558" name="Risk" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
