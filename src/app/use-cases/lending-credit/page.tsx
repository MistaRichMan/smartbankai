'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Link from 'next/link';
import { useChatCompletion } from '@/lib/ai/chatCompletion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const approvalData = [
  { category: 'Traditional Only', approved: 42, rejected: 58 },
  { category: 'With Alt Data', approved: 68, rejected: 32 },
];

const nplData = [
  { name: 'Performing', value: 91.2, color: '#1B365D' },
  { name: 'Watch List', value: 5.3, color: '#F47558' },
  { name: 'NPL', value: 3.5, color: '#dc2626' },
];

export default function LendingCreditPage() {
  const [activeUseCase, setActiveUseCase] = useState(0);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const { sendMessage } = useChatCompletion();

  const useCases = [
    {
      id: 'alt-scoring',
      title: 'Alternative Credit Scoring',
      icon: '🎯',
      color: 'bg-[#F47558]',
      description: 'AI analysis of traditional and alternative data sources — utility payments, mobile money transactions, behavioral data, and social signals — for more inclusive and accurate credit assessments that reach underbanked populations.',
      capabilities: [
        'Traditional credit bureau data integration',
        'Mobile money transaction analysis',
        'Utility and telecoms payment history',
        'Behavioral and psychometric data scoring',
        'Social and business network analysis',
        'Configurable scoring models per segment',
        'MSME-specific scoring algorithms',
        'Explainable AI credit decisions',
      ],
      benefits: [
        { metric: '40%', label: 'Expanded lending reach' },
        { metric: '35%', label: 'Reduced loan defaults' },
        { metric: '60%', label: 'Faster loan approvals' },
        { metric: '25%', label: 'Better risk accuracy' },
      ],
      kpis: ['Loan Approval Rate', 'Default Rate', 'Financial Inclusion Score', 'Risk Assessment Accuracy'],
    },
    {
      id: 'auto-processing',
      title: 'Automated Loan Processing',
      icon: '⚡',
      color: 'bg-[#1B365D]',
      description: 'End-to-end automation of loan applications with AI-powered document verification, risk assessment, and decision-making that reduces processing time from days to minutes while ensuring consistent credit policy application.',
      capabilities: [
        'Intelligent document capture and OCR',
        'Automated document verification and fraud detection',
        'Real-time credit decision engine',
        'Automated income and employment verification',
        'Digital signature and e-KYC integration',
        'Straight-through processing for low-risk loans',
        'Exception handling workflow automation',
        'Regulatory compliance checks at each step',
      ],
      benefits: [
        { metric: '95%', label: 'Reduction in processing time' },
        { metric: '50%', label: 'Lower operational costs' },
        { metric: '4.7/5', label: 'Customer experience score' },
        { metric: '100%', label: 'Policy compliance rate' },
      ],
      kpis: ['Processing Time', 'Operational Cost per Loan', 'Customer Satisfaction', 'Policy Compliance Rate'],
    },
    {
      id: 'loan-monitoring',
      title: 'Predictive Loan Monitoring',
      icon: '📡',
      color: 'bg-purple-600',
      description: 'Continuous AI monitoring of loan portfolios to identify early warning signs of potential defaults, enabling proactive intervention strategies that reduce NPLs and optimize collection efforts.',
      capabilities: [
        'Real-time portfolio health monitoring',
        'Behavioral change detection algorithms',
        'Macroeconomic stress correlation',
        'Early warning signal scoring (1-100)',
        'Automated intervention trigger workflows',
        'Personalized restructuring recommendations',
        'Collection strategy optimization',
        'IFRS 9 staging automation',
      ],
      benefits: [
        { metric: '45%', label: 'Reduction in NPL ratio' },
        { metric: '72h', label: 'Earlier default detection' },
        { metric: '30%', label: 'Better collection efficiency' },
        { metric: '38%', label: 'Proactive interventions' },
      ],
      kpis: ['NPL Ratio', 'Early Warning Lead Time', 'Collection Efficiency', 'Intervention Success Rate'],
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
          content: 'You are a SmartBankAI lending and credit specialist. Provide expert insights on AI applications in lending, credit scoring, and loan management. Focus on African market realities, financial inclusion, and measurable outcomes. Keep responses under 200 words.',
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
        <Header title="Lending & Credit Use Cases" subtitle="Faster, fairer, and more inclusive credit decisions" />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex items-center gap-2 text-xs text-brand-grey mb-5">
            <Link href="/use-cases" className="hover:text-[#F47558] transition-colors">Use Cases</Link>
            <span>/</span>
            <span className="text-brand-dark font-medium">Lending & Credit</span>
          </div>

          <div className="bg-[#F47558] rounded-2xl p-6 mb-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-yellow-400 blur-3xl transform translate-x-1/3 -translate-y-1/3" />
            </div>
            <div className="relative z-10 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">💳</span>
                  <div>
                    <h2 className="text-xl font-bold text-white">Lending & Credit</h2>
                    <p className="text-white/70 text-sm">Faster, fairer, and more inclusive credit decisions</p>
                  </div>
                </div>
                <p className="text-white/80 text-sm max-w-2xl">
                  Revolutionize credit assessment with AI that analyzes traditional and alternative data sources, enabling faster approvals, reduced defaults, and financial inclusion for underbanked populations across Africa.
                </p>
              </div>
              <div className="hidden md:grid grid-cols-2 gap-2 flex-shrink-0">
                {[{ v: '3', l: 'Use Cases' }, { v: '40%', l: 'More Approvals' }, { v: '35%', l: 'Fewer Defaults' }, { v: '95%', l: 'Faster Processing' }].map((s) => (
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
                  <div className="w-6 h-6 rounded-lg bg-[#F47558] flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.347.347a3.75 3.75 0 01-5.303 0l-.347-.347z" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold text-brand-dark">Credit AI Advisor</span>
                </div>
                <textarea
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  placeholder="Ask about lending AI use cases..."
                  className="w-full text-xs border border-surface-border rounded-lg p-2.5 resize-none h-20 focus:outline-none focus:border-[#F47558] text-brand-dark"
                />
                <button
                  onClick={handleAiAnalysis}
                  disabled={aiLoading || !aiQuery.trim()}
                  className="w-full mt-2 py-2 bg-[#F47558] text-white text-xs font-semibold rounded-lg hover:bg-[#e8654a] transition-colors disabled:opacity-50"
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
                    <div className="text-xl font-bold text-[#F47558] mb-1">{b.metric}</div>
                    <div className="text-xs text-brand-grey">{b.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl border border-surface-border p-5">
              <h3 className="text-sm font-bold text-brand-dark mb-4">Approval Rate: Traditional vs AI-Enhanced</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={approvalData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="category" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} unit="%" />
                  <Tooltip formatter={(v: number) => [`${v}%`]} />
                  <Bar dataKey="approved" fill="#1B365D" name="Approved %" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="rejected" fill="#F47558" name="Rejected %" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white rounded-2xl border border-surface-border p-5">
              <h3 className="text-sm font-bold text-brand-dark mb-4">Portfolio Health Distribution</h3>
              <div className="flex items-center gap-6">
                <ResponsiveContainer width="50%" height={180}>
                  <PieChart>
                    <Pie data={nplData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                      {nplData.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}%`]} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-3">
                  {nplData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="text-xs font-semibold text-brand-dark">{item.name}</p>
                        <p className="text-sm font-bold" style={{ color: item.color }}>{item.value}%</p>
                      </div>
                    </div>
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
