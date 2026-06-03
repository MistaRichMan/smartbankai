'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Link from 'next/link';

interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'online' | 'training' | 'standby';
  accuracy: number;
  requestsToday: number;
  avgLatency: string;
  capabilities: string[];
  color: string;
  icon: React.ReactNode;
  lastAction: string;
  version: string;
  href: string;
}

const agents: Agent[] = [
  {
    id: 'conversational',
    name: 'Conversational Agent',
    description: 'NLP-powered chat and voice interface supporting 8+ African languages with 95%+ intent recognition. Guides users through banking tasks with proactive prompts and context-aware multi-turn dialog.',
    status: 'online',
    accuracy: 97.3,
    requestsToday: 45200,
    avgLatency: '120ms',
    capabilities: ['NLP Processing', 'Voice Recognition', 'African Languages', 'Intent Detection', 'Proactive Prompts', 'Multi-turn Dialog'],
    color: 'from-blue-500 to-cyan-500',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    lastAction: 'Resolved customer query in Yoruba',
    version: 'v3.2.1',
    href: '/conversational',
  },
  {
    id: 'fraud',
    name: 'Fraud Detection Agent',
    description: 'Real-time transaction monitoring using ML and behavioral biometrics. Pattern analysis, step-up authentication, continuous learning from new fraud vectors, and risk scoring calibrated for African markets.',
    status: 'online',
    accuracy: 99.2,
    requestsToday: 128400,
    avgLatency: '45ms',
    capabilities: ['Real-time Monitoring', 'Behavioral Biometrics', 'ML Pattern Analysis', 'Step-up Auth', 'Continuous Learning', 'Anomaly Detection'],
    color: 'from-red-500 to-orange-500',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    lastAction: 'Blocked suspicious cross-border transfer',
    version: 'v4.1.0',
    href: '/fraud-detection',
  },
  {
    id: 'credit',
    name: 'Credit Risk Agent',
    description: 'Credit risk evaluation using traditional and alternative data sources. Configurable scoring models calibrated for African markets, supporting individual and MSME lending with IFRS 9 compliance.',
    status: 'online',
    accuracy: 94.8,
    requestsToday: 3200,
    avgLatency: '380ms',
    capabilities: ['Credit Scoring', 'Alternative Data', 'MSME Lending', 'Risk Calibration', 'African Markets', 'Explainable AI'],
    color: 'from-green-500 to-teal-500',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    lastAction: 'Approved MSME loan ₦2.5M — Score 742',
    version: 'v2.8.3',
    href: '/credit-risk',
  },
  {
    id: 'personalization',
    name: 'Personalization Agent',
    description: 'Delivers hyper-personalized banking experiences by analyzing customer behavior, preferences, and financial goals. Surfaces relevant products, automated savings, and real-time expense insights.',
    status: 'online',
    accuracy: 91.5,
    requestsToday: 89100,
    avgLatency: '95ms',
    capabilities: ['Behavioral Analysis', 'Product Recommendations', 'Customer Segmentation', 'Journey Mapping', 'Preference Learning', 'Contextual Offers'],
    color: 'from-purple-500 to-pink-500',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    lastAction: 'Personalized dashboard for 12,400 users',
    version: 'v2.3.0',
    href: '/personalization',
  },
  {
    id: 'predictive',
    name: 'Predictive Analytics Agent',
    description: 'Generates forward-looking financial insights using time-series forecasting, cash flow prediction, financial health indicators, and market trend correlation for proactive customer management.',
    status: 'training',
    accuracy: 88.9,
    requestsToday: 12300,
    avgLatency: '520ms',
    capabilities: ['Time-series Forecasting', 'Churn Prediction', 'Liquidity Forecasting', 'Market Trends', 'Cash Flow Analysis', 'Scenario Modeling'],
    color: 'from-yellow-500 to-amber-500',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    lastAction: 'Model retraining in progress (78%)',
    version: 'v1.9.2',
    href: '/predictive-analytics',
  },
  {
    id: 'compliance',
    name: 'Compliance & Reporting Agent',
    description: 'Automated regulatory compliance monitoring and reporting for CBN, FATF, AML/KYC, and international standards. Real-time audit trails, regulatory change management, and automated submissions.',
    status: 'online',
    accuracy: 99.8,
    requestsToday: 8700,
    avgLatency: '210ms',
    capabilities: ['AML/KYC Monitoring', 'Regulatory Reporting', 'Audit Trails', 'CBN Compliance', 'FATF Standards', 'Real-time Alerts'],
    color: 'from-indigo-500 to-blue-500',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    lastAction: 'Generated monthly AML report',
    version: 'v3.0.1',
    href: '/compliance',
  },
  {
    id: 'data-aggregation',
    name: 'Data Aggregation Agent',
    description: 'Connects legacy banking systems, mobile money platforms, payment gateways, and external data sources with real-time streaming, ETL pipelines, and unified customer profiles.',
    status: 'online',
    accuracy: 99.5,
    requestsToday: 340000,
    avgLatency: '28ms',
    capabilities: ['Legacy Integration', 'Mobile Money', 'Payment Gateways', 'Real-time Streaming', 'ETL Pipelines', 'API Orchestration'],
    color: 'from-cyan-500 to-teal-500',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    lastAction: 'Synced 340K records from 12 sources',
    version: 'v2.1.4',
    href: '/data-aggregation',
  },
  {
    id: 'dashboard',
    name: 'Smart Financial Dashboard Agent',
    description: 'Intelligent financial monitoring and visualization with dynamic dashboards, real-time KPIs, AI-generated narrative insights, scenario planning tools, and adaptive dashboards based on user activity.',
    status: 'online',
    accuracy: 96.1,
    requestsToday: 28900,
    avgLatency: '75ms',
    capabilities: ['Dynamic Dashboards', 'Real-time KPIs', 'AI Narratives', 'Custom Reports', 'Data Visualization', 'Executive Summaries'],
    color: 'from-emerald-500 to-green-500',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
      </svg>
    ),
    lastAction: 'Generated executive summary report',
    version: 'v1.7.0',
    href: '/smart-dashboard',
  },
  {
    id: 'orchestration',
    name: 'Orchestration Agent',
    description: 'Master coordinator managing communication, decision fusion, and task delegation among all 8 specialized agents. Ensures coherent, conflict-free responses with load balancing and failover management.',
    status: 'online',
    accuracy: 99.9,
    requestsToday: 645000,
    avgLatency: '12ms',
    capabilities: ['Agent Coordination', 'Task Delegation', 'Conflict Resolution', 'Decision Fusion', 'Load Balancing', 'Failover Management'],
    color: 'from-violet-500 to-purple-500',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    lastAction: 'Coordinated 645K agent interactions',
    version: 'v5.0.0',
    href: '/orchestration',
  },
];

const bankingDomains = [
  {
    domain: 'Retail Banking',
    icon: '🏦',
    color: 'border-blue-500/20 bg-blue-500/5',
    useCases: [
      { name: 'Intelligent Financial Assistant', agents: ['Conversational', 'Personalization'], benefit: '24/7 personalized banking support, 40% call center reduction' },
      { name: 'Personalized Financial Insights', agents: ['Personalization', 'Predictive'], benefit: 'Spending pattern analysis, improved financial literacy' },
      { name: 'Smart Fraud Protection', agents: ['Fraud Detection', 'Compliance'], benefit: 'Real-time behavioral biometrics, 99.2% detection rate' },
    ],
  },
  {
    domain: 'Lending & Credit',
    icon: '💳',
    color: 'border-green-500/20 bg-green-500/5',
    useCases: [
      { name: 'Alternative Credit Scoring', agents: ['Credit Risk', 'Data Aggregation'], benefit: 'Expanded lending to underbanked, reduced defaults' },
      { name: 'Automated Loan Processing', agents: ['Credit Risk', 'Compliance', 'Orchestration'], benefit: 'Days → minutes, 60% cost reduction' },
      { name: 'Predictive Loan Monitoring', agents: ['Predictive', 'Credit Risk'], benefit: 'Early warning signals, proactive risk management' },
    ],
  },
  {
    domain: 'Wealth Management',
    icon: '📈',
    color: 'border-purple-500/20 bg-purple-500/5',
    useCases: [
      { name: 'Automated Financial Planning', agents: ['Personalization', 'Predictive'], benefit: 'Goal-based planning, increased customer engagement' },
      { name: 'Smart Investment Recommendations', agents: ['Personalization', 'Smart Dashboard'], benefit: 'Risk-adjusted recommendations, improved returns' },
      { name: 'Retirement Planning Assistant', agents: ['Predictive', 'Conversational'], benefit: 'Long-term projections, improved retirement readiness' },
    ],
  },
  {
    domain: 'Compliance & Reporting',
    icon: '⚖',
    color: 'border-indigo-500/20 bg-indigo-500/5',
    useCases: [
      { name: 'Automated Regulatory Reporting', agents: ['Compliance', 'Data Aggregation'], benefit: '80% cost reduction, faster submissions' },
      { name: 'KYC/AML Automation', agents: ['Compliance', 'Fraud Detection'], benefit: 'Real-time screening, 95% accuracy' },
      { name: 'Regulatory Change Management', agents: ['Compliance', 'Orchestration'], benefit: 'Proactive compliance, zero penalty risk' },
    ],
  },
  {
    domain: 'Corporate Banking',
    icon: '🏢',
    color: 'border-cyan-500/20 bg-cyan-500/5',
    useCases: [
      { name: 'Treasury Intelligence', agents: ['Predictive', 'Smart Dashboard'], benefit: 'Liquidity optimization, cash flow forecasting' },
      { name: 'Trade Finance Automation', agents: ['Compliance', 'Credit Risk', 'Data Aggregation'], benefit: 'Document verification, risk assessment' },
      { name: 'Corporate Credit Assessment', agents: ['Credit Risk', 'Data Aggregation'], benefit: 'Multi-source data, faster approvals' },
    ],
  },
  {
    domain: 'Customer Service',
    icon: '🎧',
    color: 'border-amber-500/20 bg-amber-500/5',
    useCases: [
      { name: '24/7 AI Banking Assistant', agents: ['Conversational', 'Orchestration'], benefit: '95%+ intent accuracy, 8 African languages' },
      { name: 'Proactive Issue Resolution', agents: ['Predictive', 'Conversational'], benefit: 'Anticipate problems before customers call' },
      { name: 'Seamless Human Handover', agents: ['Conversational', 'Orchestration'], benefit: 'Context-rich escalation, zero repeat explanations' },
    ],
  },
  {
    domain: 'Marketing & Sales',
    icon: '📣',
    color: 'border-pink-500/20 bg-pink-500/5',
    useCases: [
      { name: 'Hyper-Personalized Campaigns', agents: ['Personalization', 'Predictive'], benefit: '3x conversion rate, reduced churn' },
      { name: 'Next-Best-Action Engine', agents: ['Personalization', 'Conversational'], benefit: 'Real-time product recommendations' },
      { name: 'Customer Lifetime Value', agents: ['Predictive', 'Smart Dashboard'], benefit: 'CLV prediction, targeted retention' },
    ],
  },
  {
    domain: 'Risk Management',
    icon: '🛡',
    color: 'border-red-500/20 bg-red-500/5',
    useCases: [
      { name: 'Portfolio Risk Monitoring', agents: ['Credit Risk', 'Predictive', 'Smart Dashboard'], benefit: 'Real-time NPL alerts, proactive intervention' },
      { name: 'Operational Risk Detection', agents: ['Fraud Detection', 'Compliance'], benefit: 'Insider threat detection, process anomalies' },
      { name: 'Systemic Risk Assessment', agents: ['Predictive', 'Orchestration'], benefit: 'Market correlation analysis, stress testing' },
    ],
  },
];

const statusConfig = {
  online: { label: 'Online', className: 'bg-accent-green/10 text-accent-green border-accent-green/20', dot: 'bg-accent-green' },
  training: { label: 'Training', className: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20', dot: 'bg-accent-amber' },
  standby: { label: 'Standby', className: 'bg-gray-500/10 text-gray-400 border-gray-500/20', dot: 'bg-gray-400' },
};

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [filter, setFilter] = useState<'all' | 'online' | 'training'>('all');
  const [activeView, setActiveView] = useState<'agents' | 'usecases'>('agents');

  const filtered = agents.filter(a => filter === 'all' || a.status === filter);

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="AI Agents Hub" subtitle="9 specialized autonomous agents powering SmartBank AI across all banking domains" />
        <main className="flex-1 overflow-y-auto p-6">

          {/* Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total Agents', value: '9', color: 'text-brand-dark' },
              { label: 'Online', value: '8', color: 'text-accent-green' },
              { label: 'Training', value: '1', color: 'text-accent-amber' },
              { label: 'Avg Accuracy', value: '96.3%', color: 'text-primary' },
            ].map((stat) => (
              <div key={stat.label} className="bg-surface-card border border-surface-border rounded-xl px-4 py-3 text-center">
                <div className={`text-xl font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-brand-grey mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-2 mb-5">
            <div className="flex gap-1 bg-surface-card border border-surface-border rounded-xl p-1">
              {(['agents', 'usecases'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setActiveView(v)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${activeView === v ? 'bg-gradient-primary text-white shadow-glow-blue' : 'text-brand-grey hover:text-brand-dark'}`}
                >
                  {v === 'agents' ? '🤖 Agent Directory' : '🏦 Banking Use Cases'}
                </button>
              ))}
            </div>
            {activeView === 'agents' && (
              <div className="flex items-center gap-2 ml-2">
                {(['all', 'online', 'training'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all capitalize ${
                      filter === f
                        ? 'bg-gradient-primary text-white shadow-glow-blue'
                        : 'bg-surface-elevated text-brand-grey hover:text-brand-dark border border-surface-border'
                    }`}
                  >
                    {f === 'all' ? 'All Agents' : f.charAt(0).toUpperCase() + f.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          {activeView === 'agents' && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((agent) => {
                const sc = statusConfig[agent.status];
                return (
                  <div
                    key={agent.id}
                    onClick={() => setSelectedAgent(selectedAgent?.id === agent.id ? null : agent)}
                    className={`bg-surface-card border rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-card-hover ${
                      selectedAgent?.id === agent.id ? 'border-primary/50 shadow-glow-blue' : 'border-surface-border hover:border-primary/30'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-white flex-shrink-0`}>
                        {agent.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-semibold text-brand-dark truncate">{agent.name}</h3>
                          <span className="text-xs text-brand-grey font-mono">{agent.version}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div className={`w-1.5 h-1.5 rounded-full ${sc.dot} ${agent.status === 'online' ? 'animate-pulse-slow' : ''}`}></div>
                          <span className={`text-xs px-1.5 py-0.5 rounded-full border ${sc.className}`}>{sc.label}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-brand-grey mb-4 line-clamp-2">{agent.description}</p>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="bg-surface-elevated rounded-xl p-2 text-center">
                        <div className="text-sm font-bold text-brand-dark">{agent.accuracy}%</div>
                        <div className="text-xs text-brand-grey">Accuracy</div>
                      </div>
                      <div className="bg-surface-elevated rounded-xl p-2 text-center">
                        <div className="text-sm font-bold text-primary">{(agent.requestsToday / 1000).toFixed(0)}K</div>
                        <div className="text-xs text-brand-grey">Req/day</div>
                      </div>
                      <div className="bg-surface-elevated rounded-xl p-2 text-center">
                        <div className="text-sm font-bold text-accent-cyan">{agent.avgLatency}</div>
                        <div className="text-xs text-brand-grey">Latency</div>
                      </div>
                    </div>

                    {/* Capabilities */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {agent.capabilities.slice(0, 4).map((cap) => (
                        <span key={cap} className="text-xs bg-surface-elevated border border-surface-border text-gray-400 px-2 py-0.5 rounded-full">
                          {cap}
                        </span>
                      ))}
                      {agent.capabilities.length > 4 && (
                        <span className="text-xs text-brand-grey px-1 py-0.5">+{agent.capabilities.length - 4}</span>
                      )}
                    </div>

                    {/* Last Action */}
                    <div className="text-xs text-brand-grey italic mb-3">Last: {agent.lastAction}</div>

                    <Link
                      href={agent.href}
                      onClick={(e) => e.stopPropagation()}
                      className="block w-full py-2 bg-gradient-primary text-white text-xs font-medium rounded-xl text-center hover:opacity-90 transition-opacity"
                    >
                      Open Agent →
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {activeView === 'usecases' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-2">
                {[
                  { label: 'Banking Domains', value: '8', color: 'text-primary' },
                  { label: 'Use Cases', value: '24', color: 'text-accent-green' },
                  { label: 'Agents Involved', value: '9', color: 'text-accent-cyan' },
                  { label: 'Avg ROI', value: '340%', color: 'text-accent-amber' },
                ].map((s) => (
                  <div key={s.label} className="bg-surface-card border border-surface-border rounded-2xl p-4 text-center">
                    <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-xs text-brand-grey mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bankingDomains.map((domain) => (
                  <div key={domain.domain} className={`bg-surface-card border ${domain.color} rounded-2xl p-5`}>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl">{domain.icon}</span>
                      <h3 className="text-sm font-semibold text-brand-dark">{domain.domain}</h3>
                    </div>
                    <div className="space-y-3">
                      {domain.useCases.map((uc) => (
                        <div key={uc.name} className="p-3 bg-surface-elevated rounded-xl border border-surface-border">
                          <div className="flex items-start justify-between gap-2 mb-1.5">
                            <span className="text-xs font-medium text-brand-dark">{uc.name}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-1.5">
                            {uc.agents.map((a) => (
                              <span key={a} className="text-xs bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-full">{a}</span>
                            ))}
                          </div>
                          <p className="text-xs text-brand-grey">{uc.benefit}</p>
                        </div>
                      ))}
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
