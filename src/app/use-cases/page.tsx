'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Link from 'next/link';

interface UseCase {
  title: string;
  description: string;
  benefits: string[];
}

interface Domain {
  id: string;
  name: string;
  icon: string;
  color: string;
  accentColor: string;
  tagline: string;
  overview: string;
  useCases: UseCase[];
  href: string;
}

const domains: Domain[] = [
  {
    id: 'retail',
    name: 'Retail Banking',
    icon: '🏦',
    color: 'bg-[#1B365D]',
    accentColor: '#1B365D',
    tagline: 'Intelligent, personalized banking for every customer',
    overview: 'Transform retail banking with AI-powered assistants, personalized financial insights, and smart fraud protection that adapts to each customer\'s unique financial journey.',
    useCases: [
      {
        title: 'Intelligent Financial Assistant',
        description: 'Conversational AI providing 24/7 personalized banking support across all channels with context-aware multi-turn dialog.',
        benefits: ['Improved customer satisfaction scores', 'Reduced call center volume by 40%', 'Increased digital channel adoption', '24/7 availability in 8+ languages'],
      },
      {
        title: 'Personalized Financial Insights',
        description: 'AI analysis of spending patterns to deliver actionable insights, budgeting recommendations, and financial literacy content.',
        benefits: ['Enhanced financial literacy', 'Increased product adoption', 'Improved customer engagement', 'Higher retention rates'],
      },
      {
        title: 'Smart Fraud Protection',
        description: 'Real-time transaction monitoring using behavioral biometrics and ML pattern analysis to detect and prevent fraud proactively.',
        benefits: ['Reduced fraud losses by 60%', 'Minimized false positives', 'Enhanced customer trust', 'Proactive security alerts'],
      },
    ],
    href: '/use-cases/retail-banking',
  },
  {
    id: 'lending',
    name: 'Lending & Credit',
    icon: '💳',
    color: 'bg-[#F47558]',
    accentColor: '#F47558',
    tagline: 'Faster, fairer, and more inclusive credit decisions',
    overview: 'Revolutionize credit assessment with AI that analyzes traditional and alternative data sources, enabling faster approvals, reduced defaults, and financial inclusion for underbanked populations.',
    useCases: [
      {
        title: 'Alternative Credit Scoring',
        description: 'AI analysis of traditional and alternative data (utility payments, mobile money, behavioral data) for more inclusive and accurate credit assessments.',
        benefits: ['Expanded lending to underbanked populations', 'Reduced loan defaults by 35%', 'Faster loan approvals', 'Improved risk assessment accuracy'],
      },
      {
        title: 'Automated Loan Processing',
        description: 'End-to-end automation of loan applications with AI-powered document verification, risk assessment, and decision-making.',
        benefits: ['Processing time reduced from days to minutes', 'Lower operational costs by 50%', 'Improved customer experience', 'Consistent credit policy application'],
      },
      {
        title: 'Predictive Loan Monitoring',
        description: 'Continuous AI monitoring of loan portfolios to identify early warning signs of potential defaults and trigger proactive interventions.',
        benefits: ['Proactive risk management', 'Reduced non-performing loans', 'Targeted intervention strategies', 'Optimized collection efforts'],
      },
    ],
    href: '/use-cases/lending-credit',
  },
  {
    id: 'wealth',
    name: 'Wealth Management',
    icon: '📈',
    color: 'bg-purple-600',
    accentColor: '#7c3aed',
    tagline: 'Democratizing personalized wealth management',
    overview: 'Bring institutional-grade wealth management capabilities to every customer with AI-powered financial planning, smart investment recommendations, and retirement planning assistance.',
    useCases: [
      {
        title: 'Automated Financial Planning',
        description: 'AI tools that help customers set financial goals, create personalized plans, and track progress with adaptive recommendations.',
        benefits: ['Increased customer engagement', 'Improved financial outcomes', 'Higher satisfaction scores', 'Scalable advisory at low cost'],
      },
      {
        title: 'Smart Investment Recommendations',
        description: 'Personalized investment recommendations based on customer goals, risk tolerance, market conditions, and portfolio analysis.',
        benefits: ['Enhanced investment performance', 'Increased customer loyalty', 'Better risk-adjusted returns', 'Transparent AI-driven rationale'],
      },
      {
        title: 'Retirement Planning Assistant',
        description: 'AI-powered retirement planning that projects future needs, recommends savings strategies, and adjusts plans as life circumstances change.',
        benefits: ['Improved retirement readiness', 'Increased customer confidence', 'Higher long-term savings rates', 'Proactive plan adjustments'],
      },
    ],
    href: '/use-cases/wealth-management',
  },
  {
    id: 'compliance',
    name: 'Compliance & Reporting',
    icon: '📋',
    color: 'bg-teal-600',
    accentColor: '#0d9488',
    tagline: 'Automated compliance for a complex regulatory landscape',
    overview: 'Reduce compliance burden and regulatory risk with AI-powered automated reporting, KYC/AML automation, and proactive regulatory change management across multiple jurisdictions.',
    useCases: [
      {
        title: 'Automated Regulatory Reporting',
        description: 'AI-driven automated generation of regulatory reports for CBN, SEC, NDIC, and other regulators with built-in validation and audit trails.',
        benefits: ['Reduced reporting costs by 60%', 'Faster report generation', 'Improved accuracy and consistency', 'Comprehensive audit trails'],
      },
      {
        title: 'KYC/AML Automation',
        description: 'Intelligent customer due diligence and transaction monitoring that adapts to evolving AML typologies and regulatory requirements.',
        benefits: ['Faster customer onboarding', 'Reduced false positive rates', 'Improved AML detection accuracy', 'Lower compliance operational costs'],
      },
      {
        title: 'Regulatory Change Management',
        description: 'AI monitoring of regulatory updates across 10+ jurisdictions with automated impact assessment and compliance gap analysis.',
        benefits: ['Proactive compliance management', 'Reduced regulatory penalties', 'Faster adaptation to new rules', 'Comprehensive change tracking'],
      },
    ],
    href: '/compliance',
  },
  {
    id: 'corporate',
    name: 'Corporate Banking',
    icon: '🏢',
    color: 'bg-blue-600',
    accentColor: '#2563eb',
    tagline: 'AI-powered intelligence for corporate clients',
    overview: 'Deliver superior value to corporate clients with AI-powered cash flow forecasting, supply chain finance optimization, and comprehensive business intelligence dashboards.',
    useCases: [
      {
        title: 'Cash Flow Forecasting',
        description: 'AI-powered cash flow prediction models that help corporate clients optimize working capital and treasury operations.',
        benefits: ['Improved liquidity management', 'Reduced financing costs', 'Enhanced business planning', 'Better treasury operations'],
      },
      {
        title: 'Supply Chain Finance Optimization',
        description: 'AI analysis of supply chain data to identify financing opportunities, optimize payment terms, and strengthen supplier relationships.',
        benefits: ['Strengthened supplier relationships', 'Reduced supply chain costs', 'Improved working capital efficiency', 'New revenue opportunities for banks'],
      },
      {
        title: 'Business Intelligence Dashboard',
        description: 'Comprehensive financial analytics and visualizations providing corporate clients with real-time insights for data-driven decision making.',
        benefits: ['Enhanced financial visibility', 'Better strategic planning', 'Stronger bank-client relationships', 'Competitive differentiation'],
      },
    ],
    href: '/use-cases/corporate-banking',
  },
  {
    id: 'customer-service',
    name: 'Customer Service',
    icon: '🎧',
    color: 'bg-pink-600',
    accentColor: '#db2777',
    tagline: 'Exceptional service at every touchpoint',
    overview: 'Elevate customer service with AI-powered intelligent support, personalized customer journeys, and proactive service alerts that anticipate needs before customers even ask.',
    useCases: [
      {
        title: 'Intelligent Customer Support',
        description: 'AI chatbots and virtual assistants handling customer inquiries across multiple channels with seamless escalation to human agents.',
        benefits: ['24/7 support availability', 'Faster resolution times by 65%', 'Reduced support costs', 'Consistent service quality'],
      },
      {
        title: 'Personalized Customer Journeys',
        description: 'AI-driven customization of every customer interaction based on individual needs, preferences, history, and predicted intent.',
        benefits: ['Improved customer satisfaction', 'Higher retention rates', 'Increased product adoption', 'Enhanced cross-selling opportunities'],
      },
      {
        title: 'Proactive Service Alerts',
        description: 'AI anticipates customer needs and delivers relevant information proactively — before issues arise or customers need to ask.',
        benefits: ['Reduced customer effort scores', 'Prevention of service issues', 'Increased customer loyalty', 'Improved overall experience'],
      },
    ],
    href: '/use-cases/customer-service',
  },
  {
    id: 'marketing',
    name: 'Marketing & Sales',
    icon: '🎯',
    color: 'bg-orange-600',
    accentColor: '#ea580c',
    tagline: 'Precision marketing powered by AI intelligence',
    overview: 'Drive revenue growth with hyper-personalized product recommendations, AI-powered customer lifecycle management, and next best action recommendations that maximize value for both bank and customer.',
    useCases: [
      {
        title: 'Hyper-Personalized Offers',
        description: 'AI-powered product recommendations tailored to individual customer needs, behavior, life stage, and financial goals.',
        benefits: ['Higher conversion rates by 45%', 'Increased product adoption', 'Improved customer satisfaction', 'More efficient marketing spend'],
      },
      {
        title: 'Customer Lifecycle Management',
        description: 'AI identification of optimal moments for product offers based on customer life events, needs, and predicted financial milestones.',
        benefits: ['Increased share of wallet', 'Improved customer retention', 'Higher lifetime value', 'More relevant customer interactions'],
      },
      {
        title: 'Next Best Action Recommendations',
        description: 'AI-powered suggestions for customer engagement actions that maximize value for both customer and bank at every touchpoint.',
        benefits: ['Optimized customer interactions', 'Increased sales effectiveness', 'Enhanced customer experience', 'Improved resource allocation'],
      },
    ],
    href: '/use-cases/marketing-sales',
  },
  {
    id: 'risk',
    name: 'Risk Management',
    icon: '⚠️',
    color: 'bg-red-600',
    accentColor: '#dc2626',
    tagline: 'Proactive, comprehensive risk intelligence',
    overview: 'Build a more resilient bank with AI-powered early warning systems, integrated risk assessment across multiple risk types, and sophisticated stress testing and scenario analysis capabilities.',
    useCases: [
      {
        title: 'Early Warning Systems',
        description: 'AI-powered monitoring to identify potential risks before they materialize, enabling proactive intervention across credit, market, and operational risk.',
        benefits: ['Proactive risk management', 'Reduced credit losses', 'Improved portfolio quality', 'Enhanced regulatory compliance'],
      },
      {
        title: 'Integrated Risk Assessment',
        description: 'Comprehensive AI analysis of multiple risk factors simultaneously for holistic risk evaluation across the entire portfolio.',
        benefits: ['More accurate risk assessment', 'Better-informed decision making', 'Optimized capital allocation', 'Reduced unexpected losses'],
      },
      {
        title: 'Stress Testing & Scenario Analysis',
        description: 'AI-driven simulation of various economic scenarios to assess potential impacts on the bank\'s portfolio and capital adequacy.',
        benefits: ['Enhanced strategic planning', 'Better capital management', 'Preparedness for market changes', 'Robust risk management framework'],
      },
    ],
    href: '/use-cases/risk-management',
  },
];

const implementationPhases = [
  {
    phase: 'Assessment',
    number: '01',
    color: 'bg-[#1B365D]',
    description: 'Evaluate current systems, identify challenges, define KPIs, and prioritize use cases for maximum impact.',
    activities: ['Current system evaluation', 'Challenge identification', 'KPI definition', 'Use case prioritization'],
  },
  {
    phase: 'Implementation',
    number: '02',
    color: 'bg-[#F47558]',
    description: 'Deploy SmartBankAI, integrate with existing systems, configure AI agents, and train models with institutional data.',
    activities: ['Platform deployment', 'System integration', 'Agent configuration', 'Model training'],
  },
  {
    phase: 'Optimization',
    number: '03',
    color: 'bg-purple-600',
    description: 'Monitor performance, refine AI models, expand use cases, and measure ROI against defined success metrics.',
    activities: ['Performance monitoring', 'Model refinement', 'Use case expansion', 'ROI measurement'],
  },
];

export default function UseCasesPage() {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState(0);

  const activeDomain = selectedDomain ? domains.find((d) => d.id === selectedDomain) : null;

  return (
    <div className="flex h-screen bg-surface-base overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Use Cases" subtitle="AI-powered banking across all domains" />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Hero */}
          <div className="relative rounded-2xl overflow-hidden mb-6 bg-[#1B365D] p-6">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#F47558] blur-3xl transform translate-x-1/3 -translate-y-1/3" />
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F47558] animate-pulse" />
                8 Banking Domains · 24 AI Use Cases
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Transform Banking Operations with AI</h2>
              <p className="text-white/70 text-sm max-w-2xl">
                SmartBankAI delivers tangible, measurable benefits across every banking domain — from retail customer experience to enterprise risk management. Select a domain to explore specific use cases.
              </p>
            </div>
          </div>

          {/* Domain Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {domains.map((domain) => (
              <button
                key={domain.id}
                onClick={() => setSelectedDomain(selectedDomain === domain.id ? null : domain.id)}
                className={`relative bg-white rounded-2xl border-2 p-4 text-left transition-all duration-200 hover:shadow-card ${
                  selectedDomain === domain.id ? 'border-[#F47558] shadow-card' : 'border-surface-border'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl ${domain.color} flex items-center justify-center text-xl mb-3`}>
                  {domain.icon}
                </div>
                <p className="text-sm font-bold text-brand-dark leading-tight mb-1">{domain.name}</p>
                <p className="text-xs text-brand-grey leading-tight">{domain.useCases.length} use cases</p>
                {selectedDomain === domain.id && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#F47558] flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Domain Detail Panel */}
          {activeDomain && (
            <div className="bg-white rounded-2xl border border-surface-border overflow-hidden mb-6">
              <div className={`${activeDomain.color} p-6`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{activeDomain.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{activeDomain.name}</h3>
                      <p className="text-white/70 text-sm italic mt-0.5">{activeDomain.tagline}</p>
                    </div>
                  </div>
                  <Link
                    href={activeDomain.href}
                    className="flex-shrink-0 px-4 py-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold rounded-xl transition-colors border border-white/20"
                  >
                    Open Module →
                  </Link>
                </div>
                <p className="text-white/80 text-sm mt-4">{activeDomain.overview}</p>
              </div>
              <div className="p-6">
                <h4 className="text-sm font-bold text-brand-dark mb-4">AI-Powered Use Cases</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {activeDomain.useCases.map((uc, i) => (
                    <div key={i} className="bg-surface-elevated rounded-xl border border-surface-border p-4">
                      <div className="flex items-start gap-2 mb-2">
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ backgroundColor: activeDomain.accentColor }}>
                          {i + 1}
                        </div>
                        <h5 className="text-sm font-bold text-brand-dark">{uc.title}</h5>
                      </div>
                      <p className="text-xs text-brand-grey mb-3">{uc.description}</p>
                      <div className="space-y-1.5">
                        {uc.benefits.map((benefit, j) => (
                          <div key={j} className="flex items-center gap-1.5 text-xs text-brand-dark">
                            <div className="w-1 h-1 rounded-full bg-[#F47558] flex-shrink-0" />
                            {benefit}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Implementation Methodology */}
          <div className="bg-white rounded-2xl border border-surface-border p-6 mb-6">
            <h3 className="text-base font-bold text-brand-dark mb-1">Three-Phase Implementation Methodology</h3>
            <p className="text-sm text-brand-grey mb-5">A structured approach to ensure successful deployment and adoption across all use cases.</p>
            <div className="flex gap-2 mb-5">
              {implementationPhases.map((phase, i) => (
                <button
                  key={i}
                  onClick={() => setActivePhase(i)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activePhase === i ? `${phase.color} text-white shadow-sm` : 'bg-surface-elevated text-brand-grey hover:text-brand-dark'
                  }`}
                >
                  {phase.number} {phase.phase}
                </button>
              ))}
            </div>
            <div className="bg-surface-elevated rounded-xl p-5 border border-surface-border">
              <p className="text-sm text-brand-dark mb-4">{implementationPhases[activePhase].description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {implementationPhases[activePhase].activities.map((activity, i) => (
                  <div key={i} className="flex items-center gap-2 bg-white rounded-lg p-3 border border-surface-border">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${implementationPhases[activePhase].color}`} />
                    <span className="text-xs font-medium text-brand-dark">{activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* All Domains Summary */}
          {!activeDomain && (
            <div className="bg-white rounded-2xl border border-surface-border overflow-hidden">
              <div className="p-5 border-b border-surface-border">
                <h3 className="text-base font-bold text-brand-dark">All Banking Domains</h3>
                <p className="text-sm text-brand-grey">Click any domain card above to explore its use cases in detail</p>
              </div>
              <div className="divide-y divide-surface-border">
                {domains.map((domain) => (
                  <div key={domain.id} className="flex items-center gap-4 p-4 hover:bg-surface-elevated/50 transition-colors">
                    <div className={`w-10 h-10 rounded-xl ${domain.color} flex items-center justify-center text-xl flex-shrink-0`}>
                      {domain.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-brand-dark">{domain.name}</p>
                      <p className="text-xs text-brand-grey truncate">{domain.tagline}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {domain.useCases.map((uc, i) => (
                        <span key={i} className="hidden md:block px-2 py-0.5 bg-surface-elevated text-xs text-brand-grey rounded-lg border border-surface-border truncate max-w-28">{uc.title}</span>
                      ))}
                    </div>
                    <Link href={domain.href} className="text-xs font-semibold text-[#F47558] hover:underline flex-shrink-0">
                      Explore →
                    </Link>
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
