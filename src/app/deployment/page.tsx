'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

type DeployTab = 'models' | 'delivery' | 'infrastructure' | 'omnichannel' | 'process';

const deploymentModels = [
  {
    id: 'on-premise',
    title: 'On-Premise Installation',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12H3l9-9 9 9h-2M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    color: 'bg-[#1B365D]',
    accent: '#1B365D',
    description: 'Full deployment within your own data center infrastructure. Complete data sovereignty with maximum control over security, compliance, and performance.',
    features: [
      'Full data sovereignty — no data leaves your premises',
      'Direct integration with legacy core banking systems',
      'Custom hardware optimization for peak performance',
      'Air-gapped deployment option for maximum security',
      'Dedicated IT team support and maintenance',
      'Compliance with local data residency regulations',
    ],
    bestFor: 'Tier-1 banks with existing data center infrastructure and strict regulatory requirements',
    deployTime: '8–12 weeks',
    scalability: 'Manual scaling',
  },
  {
    id: 'private-cloud',
    title: 'Private Cloud Deployment',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    color: 'bg-[#F47558]',
    accent: '#F47558',
    description: 'Dedicated private cloud environment on AWS, Azure, or GCP. Combines cloud elasticity with the isolation and control of a private environment.',
    features: [
      'Private VPC with dedicated compute resources',
      'Available on AWS, Microsoft Azure, and Google Cloud',
      'Auto-scaling based on transaction volume',
      'Managed Kubernetes orchestration',
      'Private peering to core banking systems',
      'Multi-region replication for disaster recovery',
    ],
    providers: ['AWS', 'Azure', 'GCP'],
    bestFor: 'Banks seeking cloud agility without multi-tenant risk',
    deployTime: '4–6 weeks',
    scalability: 'Auto-scaling',
  },
  {
    id: 'hybrid',
    title: 'Hybrid Model',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    color: 'bg-purple-600',
    accent: '#7c3aed',
    description: 'Sensitive data and core AI models remain on-premise while cloud resources handle burst workloads and non-sensitive processing.',
    features: [
      'Sensitive data stays on-premise, burst workloads in cloud',
      'Intelligent workload routing based on data classification',
      'Seamless failover between on-premise and cloud',
      'Unified management plane across environments',
      'Cost optimization through cloud bursting',
      'Gradual cloud migration path',
    ],
    bestFor: 'Banks transitioning from legacy infrastructure to cloud',
    deployTime: '6–10 weeks',
    scalability: 'Elastic hybrid',
  },
  {
    id: 'containerization',
    title: 'Containerization',
    icon: (
      <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    color: 'bg-teal-600',
    accent: '#0d9488',
    description: 'Docker containers orchestrated by Kubernetes enable consistent deployment across any environment with microservices isolation and rapid scaling.',
    features: [
      'Docker containers for each AI agent microservice',
      'Kubernetes orchestration with Helm charts',
      'Horizontal pod autoscaling per agent',
      'Rolling updates with zero downtime',
      'Service mesh for secure inter-agent communication',
      'Prometheus + Grafana observability stack',
    ],
    bestFor: 'DevOps-mature banks requiring rapid iteration and portability',
    deployTime: '3–5 weeks',
    scalability: 'Kubernetes HPA',
  },
];

const deliveryModels = [
  {
    id: 'standalone',
    title: 'Standalone Platform',
    subtitle: 'SaaS Layer Model',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    tagline: 'AI capabilities via API into your existing channels',
    description: 'SmartBankAI operates as an intelligent layer behind your existing digital banking channels. Your current mobile app and web portal remain unchanged — they simply gain AI superpowers through our API integration.',
    benefits: [
      { label: 'Minimal disruption', detail: 'No changes to existing customer-facing apps' },
      { label: 'Rapid deployment', detail: 'Go live in weeks, not months' },
      { label: 'Proven channels', detail: 'Leverage your existing UX investments' },
      { label: 'Incremental rollout', detail: 'Enable AI features module by module' },
    ],
    integrations: ['RESTful APIs', 'Webhooks', 'SDK Libraries', 'Event Streams'],
    color: 'border-[#1B365D]',
    badge: 'Most Popular',
    badgeColor: 'bg-[#1B365D]',
  },
  {
    id: 'integrated',
    title: 'Integrated Solution',
    subtitle: 'Full AI-Native Experience',
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    tagline: 'Co-developed AI-powered mobile and web banking channels',
    description: 'A complete digital banking platform co-developed with SmartBankAI. Custom-built mobile super-app and web banking portal designed from the ground up to deliver a fully optimized AI-native banking experience.',
    benefits: [
      { label: 'AI-first UX', detail: 'Every interaction designed around AI capabilities' },
      { label: 'Unified data layer', detail: 'Seamless context across all touchpoints' },
      { label: 'Faster innovation', detail: 'New AI features ship without integration overhead' },
      { label: 'Brand differentiation', detail: 'Unique digital experience vs. competitors' },
    ],
    integrations: ['Native iOS App', 'Native Android App', 'Web Banking Portal', 'PWA'],
    color: 'border-[#F47558]',
    badge: 'Full Suite',
    badgeColor: 'bg-[#F47558]',
  },
];

const infraSections = [
  {
    title: 'Containerization & Orchestration',
    icon: '🐳',
    items: [
      'Docker containers for each AI agent microservice',
      'Kubernetes cluster management with Helm charts',
      'Horizontal pod autoscaling per agent workload',
      'Rolling deployments with zero-downtime updates',
    ],
  },
  {
    title: 'Microservices Architecture',
    icon: '⚡',
    items: [
      'Independent scaling per agent service',
      'Fault isolation — one agent failure does not cascade',
      'Service mesh (Istio) for encrypted inter-service comms',
      'API gateway with rate limiting and circuit breakers',
    ],
  },
  {
    title: 'Enterprise Security',
    icon: '🔒',
    items: [
      'End-to-end encryption (AES-256 at rest, TLS 1.3 in transit)',
      'Role-based access control (RBAC) with least privilege',
      'Private VPCs with no public internet exposure',
      'Secure API gateways with OAuth 2.0 / JWT',
    ],
  },
  {
    title: 'Integration Layer',
    icon: '🔗',
    items: [
      'RESTful APIs and GraphQL endpoints',
      'Core banking connectors (Temenos, Finacle, Flexcube)',
      'Event-driven architecture with Apache Kafka',
      'Data transformation pipelines with schema validation',
    ],
  },
  {
    title: 'Observability & Monitoring',
    icon: '📊',
    items: [
      'Prometheus metrics collection per agent',
      'Grafana dashboards for real-time visibility',
      'Distributed tracing with OpenTelemetry',
      'Automated alerting with PagerDuty integration',
    ],
  },
  {
    title: 'Compliance & Governance',
    icon: '📋',
    items: [
      'Compliance with ISO 27001, SOC 2 Type II',
      'GDPR, NDPR, and local banking regulation alignment',
      'Immutable audit logs for all AI decisions',
      'Model explainability reports for regulators',
    ],
  },
];

const omnichannelFeatures = [
  {
    platform: 'Mobile Banking Super-App',
    icon: '📱',
    color: 'bg-[#1B365D]',
    features: [
      { name: 'Native iOS & Android', detail: 'Device-optimized performance and UX' },
      { name: 'Biometric Authentication', detail: 'Face ID, fingerprint, and voice recognition' },
      { name: 'Push Notifications', detail: 'AI-triggered proactive alerts and insights' },
      { name: 'Offline Functionality', detail: 'Core features available without connectivity' },
      { name: 'Conversational Banking', detail: 'In-app AI assistant with voice and text' },
      { name: 'Personalized Dashboard', detail: 'Adaptive UI based on usage patterns' },
    ],
  },
  {
    platform: 'Web Banking Platform',
    icon: '💻',
    color: 'bg-[#F47558]',
    features: [
      { name: 'Responsive Design', detail: 'Optimized for all screen sizes and browsers' },
      { name: 'Progressive Web App', detail: 'App-like experience without app store' },
      { name: 'Enhanced Data Visualization', detail: 'Rich charts and financial analytics' },
      { name: 'Accessibility Compliance', detail: 'WCAG 2.1 AA compliant for all users' },
      { name: 'Session Continuity', detail: 'Seamless handoff from mobile to web' },
      { name: 'Advanced Security', detail: 'Hardware security keys and step-up auth' },
    ],
  },
];

const deploymentPhases = [
  {
    phase: '01',
    title: 'Assessment',
    duration: '2–3 weeks',
    color: 'bg-[#1B365D]',
    borderColor: 'border-[#1B365D]',
    description: 'Deep-dive evaluation of your current infrastructure, data landscape, and business objectives.',
    activities: [
      'Current system architecture review',
      'Data quality and availability assessment',
      'Integration complexity mapping',
      'Security and compliance gap analysis',
      'KPI definition and success metrics',
      'Use case prioritization workshop',
    ],
    deliverable: 'Deployment Blueprint & Risk Register',
  },
  {
    phase: '02',
    title: 'Preparation',
    duration: '3–4 weeks',
    color: 'bg-[#F47558]',
    borderColor: 'border-[#F47558]',
    description: 'Infrastructure provisioning, data pipeline setup, and team readiness for deployment.',
    activities: [
      'Infrastructure provisioning (cloud/on-premise)',
      'Network and security configuration',
      'Core banking connector setup',
      'Data pipeline and ETL configuration',
      'AI model pre-training with historical data',
      'Staff training and change management',
    ],
    deliverable: 'Staging Environment Ready',
  },
  {
    phase: '03',
    title: 'Deployment',
    duration: '4–6 weeks',
    color: 'bg-purple-600',
    borderColor: 'border-purple-600',
    description: 'Phased rollout of AI agents with continuous monitoring and rapid iteration.',
    activities: [
      'Agent-by-agent phased deployment',
      'Integration testing with live systems',
      'Parallel running with existing processes',
      'Performance benchmarking and tuning',
      'User acceptance testing (UAT)',
      'Gradual traffic migration',
    ],
    deliverable: 'Production System Live',
  },
  {
    phase: '04',
    title: 'Validation',
    duration: '2–3 weeks',
    color: 'bg-teal-600',
    borderColor: 'border-teal-600',
    description: 'Comprehensive validation against defined KPIs, regulatory sign-off, and hypercare support.',
    activities: [
      'KPI performance validation',
      'Regulatory compliance verification',
      'Security penetration testing',
      'Load and stress testing',
      'Hypercare support period',
      'ROI measurement and reporting',
    ],
    deliverable: 'Go-Live Sign-off & SLA Agreement',
  },
];

export default function DeploymentPage() {
  const [activeTab, setActiveTab] = useState<DeployTab>('models');

  const tabs: { id: DeployTab; label: string }[] = [
    { id: 'models', label: 'Deployment Models' },
    { id: 'delivery', label: 'Solution Delivery' },
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'omnichannel', label: 'Omnichannel' },
    { id: 'process', label: 'Deployment Process' },
  ];

  return (
    <div className="flex h-screen bg-surface-base overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Deployment Options" subtitle="Flexible deployment models for every banking environment" />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Hero Banner */}
          <div className="relative rounded-2xl overflow-hidden mb-6 bg-[#1B365D] p-6">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#F47558] blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-blue-400 blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            </div>
            <div className="relative z-10 flex items-start justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F47558] animate-pulse" />
                  Enterprise-Grade Deployment
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Deploy SmartBankAI Your Way</h2>
                <p className="text-white/70 text-sm max-w-xl">
                  A vertical stack of specialized AI agents hosted within your controlled environment — on-premise, private cloud, or hybrid. Full data sovereignty with enterprise-grade security and compliance.
                </p>
              </div>
              <div className="hidden lg:grid grid-cols-2 gap-3 flex-shrink-0">
                {[
                  { label: 'Deployment Models', value: '4' },
                  { label: 'Cloud Providers', value: '3' },
                  { label: 'Avg. Deploy Time', value: '6 wks' },
                  { label: 'Uptime SLA', value: '99.9%' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/10 rounded-xl px-4 py-3 text-center">
                    <div className="text-xl font-bold text-white">{stat.value}</div>
                    <div className="text-xs text-white/60">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-white rounded-xl p-1 border border-surface-border mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-max px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#1B365D] text-white shadow-sm'
                    : 'text-brand-grey hover:text-primary hover:bg-surface-elevated'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Deployment Models */}
          {activeTab === 'models' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {deploymentModels.map((model) => (
                <div key={model.id} className="bg-white rounded-2xl border border-surface-border overflow-hidden hover:shadow-card transition-shadow">
                  <div className={`${model.color} p-5`}>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                        {model.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{model.title}</h3>
                        <div className="flex gap-3 mt-1">
                          <span className="text-xs text-white/70">⏱ {model.deployTime}</span>
                          <span className="text-xs text-white/70">📈 {model.scalability}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-sm text-brand-grey mb-4">{model.description}</p>
                    {'providers' in model && (
                      <div className="flex gap-2 mb-4">
                        {model.providers?.map((p) => (
                          <span key={p} className="px-2.5 py-1 bg-surface-elevated text-xs font-semibold text-brand-dark rounded-lg border border-surface-border">{p}</span>
                        ))}
                      </div>
                    )}
                    <ul className="space-y-2 mb-4">
                      {model.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-brand-dark">
                          <svg className="w-4 h-4 text-[#F47558] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                    <div className="bg-surface-elevated rounded-xl p-3 border border-surface-border">
                      <span className="text-xs font-semibold text-brand-grey">Best for: </span>
                      <span className="text-xs text-brand-dark">{model.bestFor}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tab: Solution Delivery */}
          {activeTab === 'delivery' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {deliveryModels.map((model) => (
                  <div key={model.id} className={`bg-white rounded-2xl border-2 ${model.color} overflow-hidden`}>
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-surface-elevated flex items-center justify-center text-[#1B365D]">
                            {model.icon}
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-brand-dark">{model.title}</h3>
                            <p className="text-xs text-brand-grey">{model.subtitle}</p>
                          </div>
                        </div>
                        <span className={`${model.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded-full`}>{model.badge}</span>
                      </div>
                      <p className="text-sm text-brand-grey mb-5 italic">&ldquo;{model.tagline}&rdquo;</p>
                      <p className="text-sm text-brand-dark mb-5">{model.description}</p>
                      <div className="space-y-3 mb-5">
                        {model.benefits.map((b, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <div className="w-5 h-5 rounded-full bg-[#F47558]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-3 h-3 text-[#F47558]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <div>
                              <span className="text-sm font-semibold text-brand-dark">{b.label}: </span>
                              <span className="text-sm text-brand-grey">{b.detail}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-surface-border pt-4">
                        <p className="text-xs font-semibold text-brand-grey mb-2">Integration Methods</p>
                        <div className="flex flex-wrap gap-2">
                          {model.integrations.map((int) => (
                            <span key={int} className="px-2.5 py-1 bg-surface-elevated text-xs font-medium text-brand-dark rounded-lg border border-surface-border">{int}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-surface-border p-6">
                <h3 className="text-base font-bold text-brand-dark mb-4">Choosing the Right Model</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-surface-border">
                        <th className="text-left py-2 pr-4 text-brand-grey font-semibold">Consideration</th>
                        <th className="text-center py-2 px-4 text-[#1B365D] font-semibold">Standalone Platform</th>
                        <th className="text-center py-2 px-4 text-[#F47558] font-semibold">Integrated Solution</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {[
                        ['Existing digital channels', '✅ Keeps existing', '🔄 Replaces with AI-native'],
                        ['Time to market', '⚡ 4–8 weeks', '📅 12–20 weeks'],
                        ['Customer disruption', '🟢 Minimal', '🟡 Managed migration'],
                        ['AI optimization', '🔵 Good', '🟣 Maximum'],
                        ['Investment level', '💰 Lower', '💰💰 Higher'],
                        ['Long-term flexibility', '🔵 High', '🟣 Maximum'],
                      ].map(([consideration, standalone, integrated], i) => (
                        <tr key={i} className="hover:bg-surface-elevated/50">
                          <td className="py-2.5 pr-4 text-brand-dark font-medium">{consideration}</td>
                          <td className="py-2.5 px-4 text-center text-brand-grey">{standalone}</td>
                          <td className="py-2.5 px-4 text-center text-brand-grey">{integrated}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Infrastructure */}
          {activeTab === 'infrastructure' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {infraSections.map((section, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-surface-border p-5 hover:shadow-card transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">{section.icon}</span>
                      <h3 className="text-sm font-bold text-brand-dark">{section.title}</h3>
                    </div>
                    <ul className="space-y-2.5">
                      {section.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-brand-grey">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#F47558] flex-shrink-0 mt-1.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="bg-[#1B365D] rounded-2xl p-6">
                <h3 className="text-base font-bold text-white mb-4">Architecture Overview</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { layer: 'Presentation Layer', items: ['Mobile App', 'Web Portal', 'API Gateway'], color: 'bg-[#F47558]/20 border-[#F47558]/30' },
                    { layer: 'AI Agent Layer', items: ['9 Specialized Agents', 'Orchestration Engine', 'Model Registry'], color: 'bg-blue-500/20 border-blue-500/30' },
                    { layer: 'Data Layer', items: ['Unified Data Store', 'Real-time Streams', 'Data Governance'], color: 'bg-purple-500/20 border-purple-500/30' },
                    { layer: 'Integration Layer', items: ['Core Banking', 'Mobile Money', 'External APIs'], color: 'bg-teal-500/20 border-teal-500/30' },
                  ].map((layer, i) => (
                    <div key={i} className={`rounded-xl border p-4 ${layer.color}`}>
                      <p className="text-xs font-bold text-white mb-3">{layer.layer}</p>
                      {layer.items.map((item, j) => (
                        <div key={j} className="text-xs text-white/70 py-1 border-b border-white/10 last:border-0">{item}</div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Omnichannel */}
          {activeTab === 'omnichannel' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {omnichannelFeatures.map((platform, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-surface-border overflow-hidden">
                    <div className={`${platform.color} p-5`}>
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{platform.icon}</span>
                        <h3 className="text-lg font-bold text-white">{platform.platform}</h3>
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="grid grid-cols-1 gap-3">
                        {platform.features.map((feature, j) => (
                          <div key={j} className="flex items-start gap-3 p-3 bg-surface-elevated rounded-xl border border-surface-border">
                            <div className="w-2 h-2 rounded-full bg-[#F47558] flex-shrink-0 mt-1.5" />
                            <div>
                              <p className="text-sm font-semibold text-brand-dark">{feature.name}</p>
                              <p className="text-xs text-brand-grey">{feature.detail}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-surface-border p-6">
                <h3 className="text-base font-bold text-brand-dark mb-4">Omnichannel AI Capabilities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { capability: 'Personalization', detail: 'AI-driven UX adaptation per user', icon: '🎯' },
                    { capability: 'Conversational Banking', detail: 'Voice and text AI assistant', icon: '💬' },
                    { capability: 'Intelligent Dashboards', detail: 'Real-time financial insights', icon: '📊' },
                    { capability: 'Session Continuity', detail: 'Seamless cross-channel context', icon: '🔄' },
                  ].map((cap, i) => (
                    <div key={i} className="bg-surface-elevated rounded-xl p-4 border border-surface-border text-center">
                      <div className="text-2xl mb-2">{cap.icon}</div>
                      <p className="text-sm font-bold text-brand-dark mb-1">{cap.capability}</p>
                      <p className="text-xs text-brand-grey">{cap.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Deployment Process */}
          {activeTab === 'process' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {deploymentPhases.map((phase, i) => (
                  <div key={i} className={`bg-white rounded-2xl border-l-4 ${phase.borderColor} border border-surface-border overflow-hidden`}>
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`${phase.color} w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                            {phase.phase}
                          </div>
                          <div>
                            <h3 className="text-base font-bold text-brand-dark">{phase.title}</h3>
                            <span className="text-xs text-brand-grey">⏱ {phase.duration}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-brand-grey mb-4">{phase.description}</p>
                      <ul className="space-y-2 mb-4">
                        {phase.activities.map((activity, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-brand-dark">
                            <svg className="w-4 h-4 text-[#F47558] flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {activity}
                          </li>
                        ))}
                      </ul>
                      <div className="bg-surface-elevated rounded-xl p-3 border border-surface-border">
                        <span className="text-xs font-semibold text-brand-grey">📦 Deliverable: </span>
                        <span className="text-xs font-semibold text-brand-dark">{phase.deliverable}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-[#1B365D] rounded-2xl p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h3 className="text-base font-bold text-white mb-1">Ready to Deploy SmartBankAI?</h3>
                    <p className="text-sm text-white/70">Schedule a technical consultation to design your deployment blueprint.</p>
                  </div>
                  <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-[#F47558] text-white text-sm font-semibold rounded-xl hover:bg-[#e8654a] transition-colors">
                      Schedule Consultation
                    </button>
                    <button className="px-5 py-2.5 bg-white/10 text-white text-sm font-semibold rounded-xl hover:bg-white/20 transition-colors border border-white/20">
                      Download Architecture Guide
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
