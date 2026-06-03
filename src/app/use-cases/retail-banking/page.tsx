'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Link from 'next/link';
import { useChatCompletion } from '@/lib/ai/chatCompletion';

export default function RetailBankingPage() {
  const [activeUseCase, setActiveUseCase] = useState(0);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const { sendMessage } = useChatCompletion();

  const useCases = [
    {
      id: 'assistant',
      title: 'Intelligent Financial Assistant',
      icon: '💬',
      color: 'bg-[#1B365D]',
      description: 'A conversational AI providing 24/7 personalized banking support across all digital channels. Supports voice and text, understands customer inquiries, guides banking tasks, and handles context-aware multi-turn conversations in 8+ African languages.',
      capabilities: [
        'Voice and text interaction modes',
        'Context-aware multi-turn conversations',
        '8+ African languages including Yoruba, Hausa, Igbo, Swahili',
        '95%+ intent recognition accuracy',
        'Proactive prompts based on usage patterns',
        'Seamless handover to human agents',
        'Banking task guidance (transfers, payments, account management)',
        'Personalized financial advice and tips',
      ],
      benefits: [
        { metric: '40%', label: 'Reduction in call center volume' },
        { metric: '95%+', label: 'Intent recognition accuracy' },
        { metric: '24/7', label: 'Customer support availability' },
        { metric: '4.8/5', label: 'Average customer satisfaction' },
      ],
      kpis: ['Customer Satisfaction Score (CSAT)', 'First Contact Resolution Rate', 'Digital Channel Adoption', 'Cost per Interaction'],
    },
    {
      id: 'insights',
      title: 'Personalized Financial Insights',
      icon: '📊',
      color: 'bg-[#F47558]',
      description: 'AI-powered analysis of spending patterns, income flows, and financial behavior to deliver actionable insights, personalized budgeting recommendations, and financial literacy content tailored to each customer\'s unique situation.',
      capabilities: [
        'Automatic spending categorization and tracking',
        'Personalized budgeting recommendations',
        'Savings goal creation and progress tracking',
        'Bill prediction and payment reminders',
        'Financial health score with improvement tips',
        'Product recommendations based on financial profile',
        'Localized financial literacy content',
        'Anomaly detection for unusual spending',
      ],
      benefits: [
        { metric: '35%', label: 'Increase in product adoption' },
        { metric: '28%', label: 'Improvement in customer engagement' },
        { metric: '22%', label: 'Higher retention rates' },
        { metric: '3x', label: 'More financial goal completions' },
      ],
      kpis: ['Product Adoption Rate', 'Customer Engagement Score', 'Retention Rate', 'Financial Health Improvement'],
    },
    {
      id: 'fraud',
      title: 'Smart Fraud Protection',
      icon: '🛡️',
      color: 'bg-red-600',
      description: 'Real-time transaction monitoring using machine learning models, behavioral biometrics, and pattern analysis to detect and prevent fraudulent activities. Continuously learns from new fraud vectors and adapts to African market-specific fraud patterns.',
      capabilities: [
        'Real-time transaction monitoring (sub-100ms)',
        'Behavioral biometrics for continuous authentication',
        'ML pattern analysis against historical data',
        'SIM swap and USSD fraud detection',
        'Mobile money fraud pattern recognition',
        'Step-up authentication for high-risk transactions',
        'Configurable risk scoring thresholds',
        'Continuous learning from new fraud patterns',
      ],
      benefits: [
        { metric: '60%', label: 'Reduction in fraud losses' },
        { metric: '85%', label: 'Fewer false positives' },
        { metric: '<100ms', label: 'Real-time detection latency' },
        { metric: '99.2%', label: 'Fraud detection accuracy' },
      ],
      kpis: ['Fraud Loss Rate', 'False Positive Rate', 'Detection Latency', 'Customer Trust Score'],
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
          content: 'You are a SmartBankAI banking consultant specializing in retail banking AI use cases. Provide concise, specific, and actionable insights about implementing AI in retail banking. Focus on practical benefits, implementation considerations, and measurable outcomes. Keep responses under 200 words.',
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
        <Header title="Retail Banking Use Cases" subtitle="AI-powered customer experience for retail banking" />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-brand-grey mb-5">
            <Link href="/use-cases" className="hover:text-[#F47558] transition-colors">Use Cases</Link>
            <span>/</span>
            <span className="text-brand-dark font-medium">Retail Banking</span>
          </div>

          {/* Header Card */}
          <div className="bg-[#1B365D] rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#F47558] blur-3xl transform translate-x-1/3 -translate-y-1/3" />
            </div>
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🏦</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">Retail Banking</h2>
                    <p className="text-white/70 text-sm">Intelligent, personalized banking for every customer</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm max-w-2xl">
                  Transform retail banking with AI-powered assistants, personalized financial insights, and smart fraud protection that adapts to each customer&apos;s unique financial journey across all digital channels.
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

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Use Case Selector */}
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
                  placeholder="Ask about retail banking AI implementation..."
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
        </main>
      </div>
    </div>
  );
}
