'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Link from 'next/link';
import { useChatCompletion } from '@/lib/ai/chatCompletion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const campaignPerformanceData = [
  { segment: 'Mass Market', reach: 45000, conversions: 3200, roi: 320 },
  { segment: 'Emerging Affluent', reach: 12000, conversions: 1800, roi: 480 },
  { segment: 'SME Owners', reach: 8500, conversions: 1200, roi: 560 },
  { segment: 'Youth (18-30)', reach: 32000, conversions: 4100, roi: 290 },
  { segment: 'HNW', reach: 2200, conversions: 580, roi: 720 },
];

const conversionFunnelData = [
  { stage: 'Awareness', value: 100 },
  { stage: 'Interest', value: 68 },
  { stage: 'Consideration', value: 42 },
  { stage: 'Intent', value: 28 },
  { stage: 'Conversion', value: 18 },
];

const implementationPhases = [
  {
    phase: 'Phase 1',
    title: 'Assessment',
    duration: '3–5 weeks',
    icon: '🔍',
    color: 'bg-blue-50 border-blue-200',
    titleColor: 'text-blue-700',
    steps: [
      'Customer segmentation and persona analysis',
      'Existing campaign performance and channel audit',
      'Data availability and quality assessment',
      'Competitor and market positioning review',
      'Regulatory compliance check for marketing communications',
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Implementation',
    duration: '6–10 weeks',
    icon: '⚙️',
    color: 'bg-[#F47558]/5 border-[#F47558]/20',
    titleColor: 'text-[#F47558]',
    steps: [
      'AI segmentation engine and propensity model deployment',
      'Personalization engine integration with CRM and channels',
      'Campaign automation and A/B testing framework setup',
      'Real-time analytics and attribution model configuration',
      'Sales AI assistant and lead scoring tool rollout',
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
      'Continuous model retraining on campaign outcomes',
      'Multi-touch attribution refinement',
      'New channel and format experimentation',
      'Lifetime value model enhancement',
      'Cross-sell and upsell strategy expansion',
    ],
  },
];

export default function MarketingSalesPage() {
  const [activeUseCase, setActiveUseCase] = useState(0);
  const [activePhase, setActivePhase] = useState(0);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const { sendMessage } = useChatCompletion();

  const useCases = [
    {
      id: 'hyper-personalization',
      title: 'Hyper-Personalized Campaigns',
      icon: '🎯',
      color: 'bg-[#1B365D]',
      description: 'AI-driven marketing that delivers the right product, message, and offer to each customer at the optimal moment — using behavioral data, transaction history, life events, and predictive models to maximize relevance and conversion across all channels.',
      capabilities: [
        'Dynamic customer segmentation with 50+ behavioral signals',
        'Next-best-offer and next-best-action prediction',
        'Real-time personalization across email, SMS, push, and in-app',
        'Life event detection (salary increase, marriage, home purchase)',
        'Optimal send-time and channel selection per customer',
        'A/B and multivariate testing automation',
        'Lookalike audience modeling for acquisition',
        'Churn prediction and win-back campaign triggers',
      ],
      benefits: [
        { metric: '45%', label: 'Higher campaign conversion rate' },
        { metric: '3x', label: 'Improvement in email open rates' },
        { metric: '60%', label: 'Reduction in marketing spend waste' },
        { metric: '28%', label: 'Increase in customer lifetime value' },
      ],
      kpis: ['Campaign Conversion Rate', 'Customer Acquisition Cost', 'Return on Marketing Investment', 'Customer Lifetime Value'],
    },
    {
      id: 'product-recommendation',
      title: 'AI Product Recommendation Engine',
      icon: '💡',
      color: 'bg-[#F47558]',
      description: 'Intelligent product matching that analyzes each customer\'s financial profile, transaction patterns, life stage, and peer behavior to surface the most relevant banking products and services — driving cross-sell, upsell, and new product adoption.',
      capabilities: [
        'Collaborative and content-based filtering models',
        'Financial profile-based product eligibility scoring',
        'Life stage and event-triggered product suggestions',
        'Real-time recommendation updates on new transactions',
        'Contextual recommendations within banking app journeys',
        'Banker-facing recommendation dashboards for relationship managers',
        'Explainable AI for transparent recommendation rationale',
        'Regulatory-compliant product suitability assessment',
      ],
      benefits: [
        { metric: '35%', label: 'Increase in product cross-sell' },
        { metric: '22%', label: 'Higher product adoption rate' },
        { metric: '18%', label: 'Improvement in revenue per customer' },
        { metric: '4.2x', label: 'ROI on recommendation engine' },
      ],
      kpis: ['Cross-Sell Rate', 'Product Adoption Rate', 'Revenue per Customer', 'Recommendation Acceptance Rate'],
    },
    {
      id: 'sales-intelligence',
      title: 'Sales Force Intelligence',
      icon: '📊',
      color: 'bg-indigo-600',
      description: 'AI-powered tools that augment relationship managers and sales teams with real-time customer insights, lead scoring, conversation guidance, and performance analytics — enabling smarter, faster, and more empathetic customer conversations.',
      capabilities: [
        'AI-powered lead scoring and prioritization',
        'Real-time customer 360° profile for sales conversations',
        'Next-best-action recommendations for relationship managers',
        'Automated meeting preparation and briefing generation',
        'Conversation intelligence and coaching insights',
        'Pipeline forecasting and deal probability scoring',
        'Competitive intelligence and objection handling guides',
        'Performance analytics and sales coaching dashboards',
      ],
      benefits: [
        { metric: '30%', label: 'Increase in sales productivity' },
        { metric: '25%', label: 'Higher deal win rate' },
        { metric: '40%', label: 'Faster sales cycle completion' },
        { metric: '20%', label: 'Improvement in quota attainment' },
      ],
      kpis: ['Sales Productivity Score', 'Deal Win Rate', 'Sales Cycle Length', 'Revenue per Sales Rep'],
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
          content: 'You are a SmartBankAI marketing and sales consultant specializing in AI-driven banking campaigns, product recommendations, and sales intelligence for African financial institutions. Provide concise, specific, and actionable insights about implementing AI in marketing and sales. Focus on practical benefits, implementation considerations, and measurable outcomes. Keep responses under 200 words.',
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
        <Header title="Marketing & Sales Use Cases" subtitle="AI-powered personalization, recommendations, and sales intelligence" />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-brand-grey mb-5">
            <Link href="/use-cases" className="hover:text-[#F47558] transition-colors">Use Cases</Link>
            <span>/</span>
            <span className="text-brand-dark font-medium">Marketing &amp; Sales</span>
          </div>

          {/* Header Card */}
          <div className="bg-[#1B365D] rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#F47558] blur-3xl transform translate-x-1/3 -translate-y-1/3" />
            </div>
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">📣</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">Marketing &amp; Sales</h2>
                    <p className="text-white/70 text-sm">Data-driven growth through AI-powered engagement</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm max-w-2xl">
                  Drive revenue growth with hyper-personalized campaigns, intelligent product recommendations, and AI-augmented sales teams — delivering the right message to the right customer at the right moment across all African banking channels.
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
                  placeholder="Ask about marketing & sales AI implementation..."
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
              <h4 className="text-sm font-bold text-brand-dark mb-1">Campaign Performance by Segment</h4>
              <p className="text-xs text-brand-grey mb-4">Conversions and ROI across customer segments</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={campaignPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="segment" tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="conversions" name="Conversions" fill="#1B365D" radius={[4, 4, 0, 0]} />
                  <Bar yAxisId="right" dataKey="roi" name="ROI %" fill="#F47558" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-3 justify-center">
                {[{ label: 'Conversions', color: '#1B365D' }, { label: 'ROI %', color: '#F47558' }].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l.color }} />
                    <span className="text-xs text-brand-grey">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-surface-border p-5">
              <h4 className="text-sm font-bold text-brand-dark mb-1">AI-Optimized Conversion Funnel</h4>
              <p className="text-xs text-brand-grey mb-4">Customer journey from awareness to conversion (%)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={conversionFunnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="stage" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="value" name="Funnel Stage" fill="#1B365D" radius={[0, 4, 4, 0]}
                    label={{ position: 'right', fontSize: 11, fill: '#1B365D', formatter: (v: number) => `${v}%` }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Implementation Methodology */}
          <div className="bg-white rounded-2xl border border-surface-border p-6">
            <h3 className="text-base font-bold text-brand-dark mb-1">Implementation Methodology</h3>
            <p className="text-xs text-brand-grey mb-5">Three-phase approach to deploying AI marketing and sales capabilities</p>
            <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
              {implementationPhases.map((phase, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhase(i)}
                  className={`flex-shrink-0 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    activePhase === i ? 'bg-[#1B365D] text-white' : 'bg-surface-elevated text-brand-grey hover:text-brand-dark'
                  }`}
                >
                  {phase.phase}: {phase.title}
                </button>
              ))}
            </div>
            <div className={`rounded-xl border p-5 ${implementationPhases[activePhase]?.color}`}>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">{implementationPhases[activePhase]?.icon}</span>
                <div>
                  <h4 className={`text-sm font-bold ${implementationPhases[activePhase]?.titleColor}`}>
                    {implementationPhases[activePhase]?.phase}: {implementationPhases[activePhase]?.title}
                  </h4>
                  <span className="text-xs text-brand-grey">{implementationPhases[activePhase]?.duration}</span>
                </div>
              </div>
              <div className="space-y-2">
                {implementationPhases[activePhase]?.steps?.map((step, i) => (
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
