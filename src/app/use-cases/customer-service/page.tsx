'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Link from 'next/link';
import { useChatCompletion } from '@/lib/ai/chatCompletion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const resolutionData = [
  { channel: 'WhatsApp', ai: 78, human: 22 },
  { channel: 'Mobile App', ai: 85, human: 15 },
  { channel: 'Web Chat', ai: 72, human: 28 },
  { channel: 'USSD', ai: 65, human: 35 },
  { channel: 'Voice', ai: 55, human: 45 },
];

const satisfactionTrend = [
  { month: 'Jan', score: 3.8 },
  { month: 'Feb', score: 3.9 },
  { month: 'Mar', score: 4.1 },
  { month: 'Apr', score: 4.2 },
  { month: 'May', score: 4.5 },
  { month: 'Jun', score: 4.7 },
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
      'Customer journey mapping and pain point identification',
      'Existing support ticket analysis and categorization',
      'Channel usage patterns and volume assessment',
      'Agent skill inventory and knowledge base audit',
      'Language and dialect requirements for African markets',
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
      'Conversational AI engine training on banking domain data',
      'Omnichannel integration (WhatsApp, USSD, mobile, web)',
      'Knowledge base migration and AI indexing',
      'Human-AI handover workflow configuration',
      'Agent augmentation tools and real-time assist deployment',
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
      'Continuous model fine-tuning on new interactions',
      'Sentiment analysis calibration and escalation tuning',
      'New language and dialect expansion',
      'Proactive service capability rollout',
      'Customer satisfaction loop and feedback integration',
    ],
  },
];

export default function CustomerServicePage() {
  const [activeUseCase, setActiveUseCase] = useState(0);
  const [activePhase, setActivePhase] = useState(0);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const { sendMessage } = useChatCompletion();

  const useCases = [
    {
      id: 'intelligent-support',
      title: 'Intelligent Customer Support',
      icon: '🎧',
      color: 'bg-[#1B365D]',
      description: 'AI-powered omnichannel support that handles customer inquiries, complaints, and service requests across WhatsApp, USSD, mobile apps, and web channels — delivering instant, accurate, and empathetic responses in 8+ African languages 24/7.',
      capabilities: [
        '24/7 automated support across all digital channels',
        'Natural language understanding in 8+ African languages',
        'Context-aware multi-turn conversation management',
        'Intelligent ticket routing and prioritization',
        'Real-time sentiment analysis and escalation triggers',
        'Seamless human agent handover with full context',
        'Automated FAQ resolution and knowledge retrieval',
        'Proactive issue notification and status updates',
      ],
      benefits: [
        { metric: '40%', label: 'Reduction in support costs' },
        { metric: '78%', label: 'AI first-contact resolution' },
        { metric: '4.7/5', label: 'Average CSAT score' },
        { metric: '<30s', label: 'Average response time' },
      ],
      kpis: ['First Contact Resolution Rate', 'Average Handle Time', 'Customer Satisfaction Score', 'Cost per Interaction'],
    },
    {
      id: 'complaint-management',
      title: 'AI Complaint Management',
      icon: '📋',
      color: 'bg-[#F47558]',
      description: 'End-to-end AI-driven complaint management that automatically classifies, prioritizes, routes, and tracks customer complaints — ensuring regulatory compliance with CBN and other African financial regulators while maximizing resolution speed and quality.',
      capabilities: [
        'Automatic complaint classification and severity scoring',
        'Regulatory deadline tracking (CBN 48-hour rule)',
        'Root cause analysis using historical complaint data',
        'Intelligent routing to specialist resolution teams',
        'Automated acknowledgment and status communications',
        'Escalation management for high-risk complaints',
        'Trend analysis and systemic issue identification',
        'Regulatory reporting automation (CBN, SEC, NCC)',
      ],
      benefits: [
        { metric: '65%', label: 'Faster complaint resolution' },
        { metric: '99%', label: 'Regulatory deadline compliance' },
        { metric: '45%', label: 'Reduction in repeat complaints' },
        { metric: '30%', label: 'Lower resolution cost' },
      ],
      kpis: ['Complaint Resolution Time', 'Regulatory Compliance Rate', 'Repeat Complaint Rate', 'Resolution Quality Score'],
    },
    {
      id: 'proactive-service',
      title: 'Proactive Service Intelligence',
      icon: '🔔',
      color: 'bg-teal-600',
      description: 'AI that anticipates customer needs and service issues before they arise — proactively notifying customers of relevant events, potential problems, and personalized opportunities to enhance their banking experience and prevent churn.',
      capabilities: [
        'Predictive churn detection and intervention',
        'Proactive fraud alert and account protection notifications',
        'Bill payment reminders and cash flow alerts',
        'Personalized product and service recommendations',
        'Life event detection and relevant offer triggers',
        'Service disruption pre-notification and updates',
        'Account health monitoring and advisory alerts',
        'Behavioral pattern analysis for proactive outreach',
      ],
      benefits: [
        { metric: '25%', label: 'Reduction in customer churn' },
        { metric: '38%', label: 'Increase in proactive engagement' },
        { metric: '20%', label: 'Higher product cross-sell rate' },
        { metric: '50%', label: 'Fewer inbound service calls' },
      ],
      kpis: ['Churn Prevention Rate', 'Proactive Engagement Rate', 'Cross-Sell Conversion', 'Inbound Call Deflection'],
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
          content: 'You are a SmartBankAI customer service consultant specializing in AI-powered banking support, complaint management, and proactive service for African financial institutions. Provide concise, specific, and actionable insights about implementing AI in customer service. Focus on practical benefits, implementation considerations, and measurable outcomes. Keep responses under 200 words.',
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
        <Header title="Customer Service Use Cases" subtitle="AI-powered omnichannel support and complaint management" />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs text-brand-grey mb-5">
            <Link href="/use-cases" className="hover:text-[#F47558] transition-colors">Use Cases</Link>
            <span>/</span>
            <span className="text-brand-dark font-medium">Customer Service</span>
          </div>

          {/* Header Card */}
          <div className="bg-[#1B365D] rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#F47558] blur-3xl transform translate-x-1/3 -translate-y-1/3" />
            </div>
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">🎯</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">Customer Service</h2>
                    <p className="text-white/70 text-sm">Intelligent, empathetic support at every touchpoint</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm max-w-2xl">
                  Elevate customer experience with AI-powered omnichannel support, intelligent complaint management, and proactive service intelligence — delivering instant, accurate, and empathetic banking assistance across all African digital channels.
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
                  placeholder="Ask about customer service AI implementation..."
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
              <h4 className="text-sm font-bold text-brand-dark mb-1">AI vs Human Resolution by Channel</h4>
              <p className="text-xs text-brand-grey mb-4">Percentage of queries resolved without human escalation</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={resolutionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
                  <YAxis type="category" dataKey="channel" tick={{ fontSize: 11 }} width={70} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="ai" name="AI Resolved" fill="#1B365D" stackId="a" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="human" name="Human Escalated" fill="#F47558" stackId="a" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-4 mt-3 justify-center">
                {[{ label: 'AI Resolved', color: '#1B365D' }, { label: 'Human Escalated', color: '#F47558' }]?.map((l) => (
                  <div key={l?.label} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: l?.color }} />
                    <span className="text-xs text-brand-grey">{l?.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-surface-border p-5">
              <h4 className="text-sm font-bold text-brand-dark mb-1">Customer Satisfaction Trend</h4>
              <p className="text-xs text-brand-grey mb-4">CSAT score improvement since AI deployment</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={satisfactionTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} domain={[3.5, 5]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="score" stroke="#F47558" strokeWidth={2.5} dot={{ fill: '#F47558', r: 4 }} name="CSAT Score" />
                </LineChart>
              </ResponsiveContainer>
              <div className="mt-3 flex items-center justify-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F47558]" />
                <span className="text-xs text-brand-grey">CSAT Score (out of 5.0)</span>
              </div>
            </div>
          </div>

          {/* Implementation Methodology */}
          <div className="bg-white rounded-2xl border border-surface-border p-6">
            <h3 className="text-base font-bold text-brand-dark mb-1">Implementation Methodology</h3>
            <p className="text-xs text-brand-grey mb-5">Three-phase approach to deploying AI customer service capabilities</p>
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
