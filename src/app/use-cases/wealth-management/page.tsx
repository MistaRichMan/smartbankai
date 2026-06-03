'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Link from 'next/link';
import { useChatCompletion } from '@/lib/ai/chatCompletion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const portfolioData = [
  { month: 'Jan', conservative: 100, balanced: 100, aggressive: 100 },
  { month: 'Feb', conservative: 101.2, balanced: 102.1, aggressive: 103.8 },
  { month: 'Mar', conservative: 100.8, balanced: 101.5, aggressive: 101.2 },
  { month: 'Apr', conservative: 102.1, balanced: 104.3, aggressive: 107.5 },
  { month: 'May', conservative: 103.4, balanced: 106.8, aggressive: 112.1 },
  { month: 'Jun', conservative: 104.2, balanced: 108.2, aggressive: 115.6 },
];

const riskProfileData = [
  { subject: 'Equities', A: 80, B: 45, C: 20 },
  { subject: 'Fixed Income', A: 10, B: 35, C: 60 },
  { subject: 'Real Estate', A: 5, B: 10, C: 10 },
  { subject: 'Alternatives', A: 3, B: 7, C: 5 },
  { subject: 'Cash', A: 2, B: 3, C: 5 },
];

const implementationPhases = [
  {
    phase: 'Phase 1',
    title: 'Assessment',
    duration: '4–6 weeks',
    icon: '🔍',
    color: 'bg-blue-50 border-blue-200',
    titleColor: 'text-blue-700',
    steps: [
      'Client financial profile & risk tolerance mapping',
      'Existing portfolio analysis and gap identification',
      'Regulatory compliance review (SEC, CBN guidelines)',
      'Data infrastructure readiness assessment',
      'AI model selection and customization planning',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Implementation',
    duration: '8–12 weeks',
    icon: '⚙️',
    color: 'bg-[#F47558]/5 border-[#F47558]/20',
    titleColor: 'text-[#F47558]',
    steps: [
      'AI portfolio optimization engine deployment',
      'Robo-advisory platform integration',
      'Real-time market data feed connections',
      'Client-facing dashboard and mobile app setup',
      'Advisor augmentation tools rollout',
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Optimization',
    duration: 'Ongoing',
    icon: '🚀',
    color: 'bg-green-50 border-green-200',
    titleColor: 'text-green-700',
    steps: [
      'Continuous model retraining on market data',
      'Client behavior analysis and personalization tuning',
      'Performance benchmarking and reporting',
      'Regulatory change adaptation',
      'New asset class and product expansion',
    ],
  },
];

export default function WealthManagementPage() {
  const [activeUseCase, setActiveUseCase] = useState(0);
  const [activePhase, setActivePhase] = useState(0);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const { sendMessage } = useChatCompletion();

  const useCases = [
    {
      id: 'robo-advisory',
      title: 'AI-Powered Robo-Advisory',
      icon: '🤖',
      color: 'bg-[#1B365D]',
      description: 'Automated, AI-driven investment advisory that democratizes wealth management by delivering institutional-grade portfolio construction, rebalancing, and optimization to all client segments — from mass affluent to ultra-high-net-worth individuals.',
      capabilities: [
        'Automated portfolio construction and rebalancing',
        'Risk tolerance profiling and dynamic adjustment',
        'Tax-loss harvesting and optimization',
        'Goal-based investment planning',
        'ESG and impact investing integration',
        'Multi-asset class allocation (equities, bonds, alternatives)',
        'Fractional investing for low-minimum entry',
        'Continuous performance monitoring and alerts',
      ],
      benefits: [
        { metric: '65%', label: 'Lower advisory cost per client' },
        { metric: '3x', label: 'More clients served per advisor' },
        { metric: '18%', label: 'Better risk-adjusted returns' },
        { metric: '92%', label: 'Client satisfaction score' },
      ],
      kpis: ['Assets Under Management Growth', 'Client Acquisition Cost', 'Portfolio Performance vs Benchmark', 'Client Retention Rate'],
    },
    {
      id: 'portfolio-optimization',
      title: 'Dynamic Portfolio Optimization',
      icon: '📈',
      color: 'bg-[#F47558]',
      description: 'Real-time portfolio optimization using advanced ML models that continuously analyze market conditions, macroeconomic signals, and individual client goals to maximize risk-adjusted returns and adapt to changing market environments.',
      capabilities: [
        'Real-time market signal processing',
        'Multi-factor risk model integration',
        'Scenario analysis and stress testing',
        'Correlation-aware diversification engine',
        'Liquidity-constrained optimization',
        'Currency hedging recommendations',
        'Alternative data integration (satellite, sentiment)',
        'Automated rebalancing triggers and execution',
      ],
      benefits: [
        { metric: '22%', label: 'Improved portfolio efficiency' },
        { metric: '35%', label: 'Reduced portfolio volatility' },
        { metric: '15%', label: 'Higher alpha generation' },
        { metric: '<5min', label: 'Rebalancing execution time' },
      ],
      kpis: ['Sharpe Ratio Improvement', 'Maximum Drawdown Reduction', 'Alpha Generation', 'Rebalancing Frequency'],
    },
    {
      id: 'estate-planning',
      title: 'Intelligent Estate & Succession Planning',
      icon: '🏛️',
      color: 'bg-purple-600',
      description: 'AI-assisted estate planning that analyzes family structures, asset compositions, tax implications, and regulatory frameworks to create comprehensive succession strategies tailored to African high-net-worth families and business owners.',
      capabilities: [
        'Automated estate valuation and asset mapping',
        'Tax-efficient wealth transfer strategies',
        'Trust structure recommendations',
        'Business succession planning models',
        'Cross-border asset and regulatory analysis',
        'Beneficiary scenario modeling',
        'Document generation and management',
        'Periodic review and update triggers',
      ],
      benefits: [
        { metric: '40%', label: 'Reduction in estate planning time' },
        { metric: '28%', label: 'Tax savings for clients' },
        { metric: '95%', label: 'Regulatory compliance rate' },
        { metric: '2x', label: 'More comprehensive plans' },
      ],
      kpis: ['Estate Plan Completion Rate', 'Tax Efficiency Score', 'Client Wealth Preservation', 'Succession Success Rate'],
    },
  ];

  const handleAiAnalysis = async () => {
    if (!aiQuery?.trim()) return;
    setAiLoading(true);
    setAiResponse('');
    try {
      const result = await sendMessage([
        {
          role: 'system',
          content: 'You are a SmartBankAI wealth management consultant specializing in AI-driven investment advisory, portfolio optimization, and estate planning for African markets. Provide concise, specific, and actionable insights about implementing AI in wealth management. Focus on practical benefits, implementation considerations, and measurable outcomes. Keep responses under 200 words.',
        },
        {
          role: 'user',
          content: aiQuery,
        },
      ]);
      setAiResponse(result?.content || 'Unable to generate response.');
    } catch {
      setAiResponse('Analysis unavailable. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const current = useCases?.[activeUseCase];

  return (
    <div className="flex h-screen bg-surface-base overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Wealth Management Use Cases" subtitle="AI-powered investment advisory and portfolio optimization" />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-brand-grey mb-5">
            <Link href="/use-cases" className="hover:text-[#F47558] transition-colors">Use Cases</Link>
            <span>/</span>
            <span className="text-brand-dark font-medium">Wealth Management</span>
          </div>

          {/* Header Card */}
          <div className="bg-[#1B365D] rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#F47558] blur-3xl transform translate-x-1/3 -translate-y-1/3" />
            </div>
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">💎</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">Wealth Management</h2>
                    <p className="text-white/70 text-sm">Democratizing institutional-grade investment intelligence</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm max-w-2xl">
                  Transform wealth management with AI-powered robo-advisory, dynamic portfolio optimization, and intelligent estate planning — delivering personalized, data-driven financial strategies to every client segment across African markets.
                </p>
              </div>
              <div className="hidden md:flex flex-col gap-2 flex-shrink-0">
                <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                  <div className="text-lg font-bold text-white">3</div>
                  <div className="text-xs text-white/60">Use Cases</div>
                </div>
                <div className="bg-white/10 rounded-xl px-4 py-2 text-center">
                  <div className="text-lg font-bold text-white">12</div>
                  <div className="text-xs text-white/60">Key Benefits</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Use Case Selector + AI Consultant */}
            <div className="space-y-3">
              {useCases?.map((uc, i) => (
                <button
                  key={uc?.id}
                  onClick={() => setActiveUseCase(i)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                    activeUseCase === i ? 'border-[#F47558] bg-white shadow-card' : 'border-surface-border bg-white hover:border-[#F47558]/40'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-9 h-9 rounded-lg ${uc?.color} flex items-center justify-center text-lg`}>
                      {uc?.icon}
                    </div>
                    <span className="text-sm font-bold text-brand-dark">{uc?.title}</span>
                  </div>
                  <p className="text-xs text-brand-grey line-clamp-2">{uc?.description?.slice(0, 80)}...</p>
                </button>
              ))}

              {/* AI Consultant */}
              <div className="bg-white rounded-xl border border-surface-border p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-[#1B365D] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.75 3.75 0 01-5.303 0l-.347-.347z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-brand-dark">Ask AI Consultant</span>
                </div>
                <textarea
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e?.target?.value)}
                  placeholder="Ask about wealth management AI implementation..."
                  className="w-full text-xs border border-surface-border rounded-lg p-2.5 resize-none h-20 focus:outline-none focus:border-[#1B365D] text-brand-dark"
                />
                <button
                  onClick={handleAiAnalysis}
                  disabled={aiLoading || !aiQuery?.trim()}
                  className="w-full mt-2 py-2 bg-[#1B365D] text-white text-xs font-semibold rounded-lg hover:bg-[#152a4a] transition-colors disabled:opacity-50"
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

            {/* Use Case Detail */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
                <div className={`${current?.color} p-5`}>
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{current?.icon}</span>
                    <h3 className="text-lg font-bold text-white">{current?.title}</h3>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-brand-grey mb-5">{current?.description}</p>
                  <h4 className="text-xs font-bold text-brand-dark uppercase tracking-wide mb-3">Key Capabilities</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-5">
                    {current?.capabilities?.map((cap, i) => (
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

              {/* Metrics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {current?.benefits?.map((b, i) => (
                  <div key={i} className="bg-white rounded-xl border border-surface-border p-4 text-center">
                    <div className="text-2xl font-bold text-[#1B365D] mb-1">{b?.metric}</div>
                    <div className="text-xs text-brand-grey">{b?.label}</div>
                  </div>
                ))}
              </div>

              {/* KPIs */}
              <div className="bg-white rounded-xl border border-surface-border p-5">
                <h4 className="text-sm font-bold text-brand-dark mb-3">Success KPIs</h4>
                <div className="flex flex-wrap gap-2">
                  {current?.kpis?.map((kpi, i) => (
                    <span key={i} className="px-3 py-1.5 bg-[#1B365D]/5 text-[#1B365D] text-xs font-semibold rounded-lg border border-[#1B365D]/10">
                      {kpi}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Data Visualizations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-2xl border border-surface-border p-5">
              <h4 className="text-sm font-bold text-brand-dark mb-1">Portfolio Performance by Strategy</h4>
              <p className="text-xs text-brand-grey mb-4">Indexed growth (Base = 100) across risk profiles</p>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={portfolioData}>
                  <defs>
                    <linearGradient id="colorConservative" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1B365D" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#1B365D" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorBalanced" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F47558" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#F47558" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorAggressive" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[98, 120]} />
                  <Tooltip />
                  <Area type="monotone" dataKey="conservative" stroke="#1B365D" fill="url(#colorConservative)" strokeWidth={2} name="Conservative" />
                  <Area type="monotone" dataKey="balanced" stroke="#F47558" fill="url(#colorBalanced)" strokeWidth={2} name="Balanced" />
                  <Area type="monotone" dataKey="aggressive" stroke="#10b981" fill="url(#colorAggressive)" strokeWidth={2} name="Aggressive" />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-3 justify-center">
                {[{ label: 'Conservative', color: '#1B365D' }, { label: 'Balanced', color: '#F47558' }, { label: 'Aggressive', color: '#10b981' }]?.map((l) => (
                  <div key={l?.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l?.color }} />
                    <span className="text-xs text-brand-grey">{l?.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-surface-border p-5">
              <h4 className="text-sm font-bold text-brand-dark mb-1">Asset Allocation by Risk Profile</h4>
              <p className="text-xs text-brand-grey mb-4">AI-optimized allocation across asset classes</p>
              <ResponsiveContainer width="100%" height={200}>
                <RadarChart data={riskProfileData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis tick={{ fontSize: 10 }} />
                  <Radar name="Aggressive" dataKey="A" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                  <Radar name="Balanced" dataKey="B" stroke="#F47558" fill="#F47558" fillOpacity={0.2} />
                  <Radar name="Conservative" dataKey="C" stroke="#1B365D" fill="#1B365D" fillOpacity={0.2} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-3 justify-center">
                {[{ label: 'Aggressive', color: '#10b981' }, { label: 'Balanced', color: '#F47558' }, { label: 'Conservative', color: '#1B365D' }]?.map((l) => (
                  <div key={l?.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l?.color }} />
                    <span className="text-xs text-brand-grey">{l?.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Implementation Methodology */}
          <div className="bg-white rounded-2xl border border-surface-border p-6">
            <h3 className="text-base font-bold text-brand-dark mb-1">Implementation Methodology</h3>
            <p className="text-xs text-brand-grey mb-5">Three-phase approach to deploying AI wealth management capabilities</p>
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {implementationPhases?.map((phase, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhase(i)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activePhase === i ? 'bg-[#1B365D] text-white' : 'bg-surface-elevated text-brand-grey hover:text-brand-dark'
                  }`}
                >
                  {phase?.phase}: {phase?.title}
                </button>
              ))}
            </div>
            <div className={`rounded-xl border p-5 ${implementationPhases?.[activePhase]?.color}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{implementationPhases?.[activePhase]?.icon}</span>
                <div>
                  <h4 className={`text-sm font-bold ${implementationPhases?.[activePhase]?.titleColor}`}>
                    {implementationPhases?.[activePhase]?.phase}: {implementationPhases?.[activePhase]?.title}
                  </h4>
                  <span className="text-xs text-brand-grey">{implementationPhases?.[activePhase]?.duration}</span>
                </div>
              </div>
              <div className="space-y-2">
                {implementationPhases?.[activePhase]?.steps?.map((step, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <div className="w-5 h-5 rounded-full bg-white border border-current flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-brand-dark">{i + 1}</span>
                    </div>
                    <p className="text-sm text-brand-dark">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
