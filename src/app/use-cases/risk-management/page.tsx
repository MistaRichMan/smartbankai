'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Link from 'next/link';
import { useChatCompletion } from '@/lib/ai/chatCompletion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const riskTrendData = [
  { month: 'Jan', credit: 4.2, market: 2.8, operational: 1.5 },
  { month: 'Feb', credit: 3.9, market: 3.1, operational: 1.3 },
  { month: 'Mar', credit: 3.5, market: 2.6, operational: 1.6 },
  { month: 'Apr', credit: 3.1, market: 2.2, operational: 1.2 },
  { month: 'May', credit: 2.8, market: 1.9, operational: 1.1 },
  { month: 'Jun', credit: 2.4, market: 1.7, operational: 0.9 },
];

const scenarioData = [
  { scenario: 'Base', capital: 18.5, npl: 2.4, revenue: 100 },
  { scenario: 'Mild Stress', capital: 16.2, npl: 4.1, revenue: 88 },
  { scenario: 'Moderate', capital: 13.8, npl: 6.8, revenue: 74 },
  { scenario: 'Severe', capital: 11.2, npl: 9.5, revenue: 61 },
  { scenario: 'Extreme', capital: 8.9, npl: 13.2, revenue: 48 },
];

export default function RiskManagementPage() {
  const [activeUseCase, setActiveUseCase] = useState(0);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const { sendMessage } = useChatCompletion();

  const useCases = [
    {
      id: 'early-warning',
      title: 'Early Warning Systems',
      icon: '🚨',
      color: 'bg-red-600',
      description: 'AI-powered monitoring to identify potential risks before they materialize across credit, market, and operational risk domains. Enables proactive intervention to prevent losses.',
      capabilities: [
        'Multi-dimensional risk signal monitoring',
        'Behavioral pattern change detection',
        'Macroeconomic indicator correlation',
        'Portfolio concentration risk alerts',
        'Counterparty risk monitoring',
        'Automated escalation workflows',
        'Configurable alert thresholds by risk appetite',
        'Integration with core banking for real-time data',
      ],
      benefits: [
        { metric: '45%', label: 'Reduction in credit losses' },
        { metric: '72h', label: 'Earlier risk identification' },
        { metric: '38%', label: 'Improved portfolio quality' },
        { metric: '99.1%', label: 'Monitoring coverage' },
      ],
      kpis: ['Credit Loss Rate', 'Early Warning Lead Time', 'Portfolio Quality Score', 'NPL Ratio'],
    },
    {
      id: 'integrated-risk',
      title: 'Integrated Risk Assessment',
      icon: '🔍',
      color: 'bg-[#1B365D]',
      description: 'Comprehensive AI analysis of multiple risk factors simultaneously — credit, market, liquidity, and operational — for holistic risk evaluation across the entire portfolio.',
      capabilities: [
        'Cross-risk correlation analysis',
        'Real-time portfolio risk aggregation',
        'IFRS 9 ECL calculation engine',
        'Basel III/IV capital adequacy modeling',
        'Concentration risk measurement',
        'Liquidity risk stress indicators',
        'Operational risk event tracking',
        'Explainable AI risk rationale',
      ],
      benefits: [
        { metric: '30%', label: 'More accurate risk assessment' },
        { metric: '25%', label: 'Better capital allocation' },
        { metric: '40%', label: 'Reduction in unexpected losses' },
        { metric: '2x', label: 'Faster risk reporting' },
      ],
      kpis: ['Risk Assessment Accuracy', 'Capital Adequacy Ratio', 'Unexpected Loss Rate', 'Risk Reporting Speed'],
    },
    {
      id: 'stress-testing',
      title: 'Stress Testing & Scenario Analysis',
      icon: '📉',
      color: 'bg-orange-600',
      description: 'AI-driven simulation of various economic scenarios to assess potential impacts on the bank\'s portfolio, capital adequacy, and revenue streams under adverse conditions.',
      capabilities: [
        'Historical scenario replay (2008, COVID-19, etc.)',
        'Hypothetical scenario construction',
        'Regulatory stress test automation (CBN, EBA)',
        'Monte Carlo simulation engine',
        'Reverse stress testing capabilities',
        'Capital impact quantification',
        'Revenue sensitivity analysis',
        'Automated regulatory report generation',
      ],
      benefits: [
        { metric: '60%', label: 'Faster stress test execution' },
        { metric: '5+', label: 'Scenarios run simultaneously' },
        { metric: '100%', label: 'Regulatory compliance coverage' },
        { metric: '35%', label: 'Better capital planning accuracy' },
      ],
      kpis: ['Stress Test Completion Time', 'Scenario Coverage', 'Capital Planning Accuracy', 'Regulatory Compliance Rate'],
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
          content: 'You are a SmartBankAI risk management specialist. Provide concise, expert insights on AI-powered risk management in banking. Focus on practical implementation, regulatory considerations, and measurable risk reduction outcomes. Keep responses under 200 words.',
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
        <Header title="Risk Management Use Cases" subtitle="AI-powered proactive risk intelligence" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-2 text-xs text-brand-grey mb-5">
            <Link href="/use-cases" className="hover:text-[#F47558] transition-colors">Use Cases</Link>
            <span>/</span>
            <span className="text-brand-dark font-medium">Risk Management</span>
          </div>

          {/* Header */}
          <div className="bg-red-600 rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-orange-400 blur-3xl transform translate-x-1/3 -translate-y-1/3" />
            </div>
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">⚠️</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">Risk Management</h2>
                    <p className="text-white/70 text-sm">Proactive, comprehensive risk intelligence</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm max-w-2xl">
                  Build a more resilient bank with AI-powered early warning systems, integrated risk assessment across multiple risk types, and sophisticated stress testing capabilities that keep you ahead of emerging risks.
                </p>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-2 flex-shrink-0">
                {[{ v: '3', l: 'Use Cases' }, { v: '99.1%', l: 'Coverage' }, { v: '72h', l: 'Early Warning' }, { v: '45%', l: 'Loss Reduction' }].map((s) => (
                  <div key={s.l} className="bg-white/10 rounded-xl px-3 py-2 text-center">
                    <div className="text-base font-bold text-white">{s.v}</div>
                    <div className="text-xs text-white/60">{s.l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Selector + AI */}
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
                  <div className="w-6 h-6 rounded-lg bg-red-600 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.75 3.75 0 01-5.303 0l-.347-.347z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-brand-dark">Risk AI Consultant</span>
                </div>
                <textarea
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ask about risk management AI..."
                  className="w-full text-xs border border-surface-border rounded-lg p-2.5 resize-none h-20 focus:outline-none focus:border-red-600 text-brand-dark"
                />
                <button
                  onClick={handleAiAnalysis}
                  disabled={aiLoading || !aiQuery.trim()}
                  className="w-full mt-2 py-2 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {aiLoading ? 'Analyzing...' : 'Get Risk Insights'}
                </button>
                {aiResponse && (
                  <div className="mt-3 p-3 bg-surface-elevated rounded-lg border border-surface-border">
                    <p className="text-xs text-brand-dark leading-relaxed">{aiResponse}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Detail */}
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
                    <div className="text-xl font-bold text-red-600 mb-1">{b.metric}</div>
                    <div className="text-xs text-brand-grey">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-surface-border p-5">
              <h3 className="text-sm font-bold text-brand-dark mb-4">Risk Trend Analysis (AI-Monitored)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={riskTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v: number) => [`${v}%`]} />
                  <Line type="monotone" dataKey="credit" stroke="#dc2626" strokeWidth={2} dot={false} name="Credit Risk" />
                  <Line type="monotone" dataKey="market" stroke="#F47558" strokeWidth={2} dot={false} name="Market Risk" />
                  <Line type="monotone" dataKey="operational" stroke="#1B365D" strokeWidth={2} dot={false} name="Operational Risk" />
                </LineChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-2 justify-center">
                {[{ color: '#dc2626', label: 'Credit' }, { color: '#F47558', label: 'Market' }, { color: '#1B365D', label: 'Operational' }].map((l) => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-0.5 rounded" style={{ backgroundColor: l.color }} />
                    <span className="text-xs text-brand-grey">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-surface-border p-5">
              <h3 className="text-sm font-bold text-brand-dark mb-4">Stress Test Scenario Impact</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={scenarioData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="scenario" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Area type="monotone" dataKey="capital" stroke="#1B365D" fill="#1B365D20" strokeWidth={2} name="Capital Ratio %" />
                  <Area type="monotone" dataKey="revenue" stroke="#F47558" fill="#F4755820" strokeWidth={2} name="Revenue Index" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
