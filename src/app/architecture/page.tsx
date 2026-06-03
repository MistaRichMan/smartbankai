'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

type ArchTab = 'overview' | 'security' | 'ai-models' | 'data-integration';

const agents = [
  { name: 'Conversational', icon: '💬', color: '#1B365D', desc: 'NLP & voice banking' },
  { name: 'Fraud Detection', icon: '🛡️', color: '#FF4D4D', desc: 'Real-time monitoring' },
  { name: 'Credit Risk', icon: '📊', color: '#F47558', desc: 'Alternative scoring' },
  { name: 'Personalization', icon: '👤', color: '#7C3AED', desc: 'Behavioral insights' },
  { name: 'Predictive Analytics', icon: '📈', color: '#06B6D4', desc: 'Time-series forecasting' },
  { name: 'Compliance', icon: '⚖️', color: '#00C896', desc: 'Regulatory automation' },
  { name: 'Data Aggregation', icon: '🗄️', color: '#FFB020', desc: 'Unified data layer' },
  { name: 'Smart Dashboard', icon: '🖥️', color: '#0D9488', desc: 'Financial visualization' },
  { name: 'Orchestration', icon: '⚡', color: '#F47558', desc: 'Central coordinator' },
];

const securityLayers = [
  {
    icon: '🔐',
    title: 'End-to-End Encryption',
    color: 'bg-[#1B365D]',
    items: ['AES-256 encryption at rest', 'TLS 1.3 in transit', 'Field-level encryption for PII', 'Hardware Security Modules (HSM)', 'Key rotation & lifecycle management'],
  },
  {
    icon: '🔑',
    title: 'Multi-Factor Authentication',
    color: 'bg-[#7C3AED]',
    items: ['TOTP-based 2FA', 'SMS OTP with fraud detection', 'Push notification approval', 'Hardware token support', 'Adaptive MFA based on risk score'],
  },
  {
    icon: '👁️',
    title: 'Biometric Verification',
    color: 'bg-[#06B6D4]',
    items: ['Fingerprint authentication', 'Face recognition with liveness', 'Voice biometrics', 'Behavioral biometrics (typing, swipe)', 'Continuous passive authentication'],
  },
  {
    icon: '🚨',
    title: 'Anomaly Detection',
    color: 'bg-[#FF4D4D]',
    items: ['Real-time transaction monitoring', 'Behavioral baseline profiling', 'Geo-velocity analysis', 'Device fingerprinting', 'SIM swap & account takeover detection'],
  },
  {
    icon: '🛡️',
    title: 'Intrusion Prevention',
    color: 'bg-[#00C896]',
    items: ['Web Application Firewall (WAF)', 'DDoS protection & rate limiting', 'API gateway security', 'Zero-trust network architecture', 'Automated threat response'],
  },
  {
    icon: '📋',
    title: 'Compliance & Audit',
    color: 'bg-[#FFB020]',
    items: ['NDPR & GDPR compliance', 'CBN regulatory framework', 'ISO 27001 alignment', 'SOC 2 Type II controls', 'Immutable audit trails'],
  },
];

const aiModelStages = [
  {
    phase: '01',
    title: 'Data Collection & Preparation',
    color: '#1B365D',
    steps: ['Ingest from core banking, mobile money, CRM', 'Data cleansing & normalization', 'Feature engineering for African market', 'Privacy-preserving data handling', 'Train/validation/test split'],
  },
  {
    phase: '02',
    title: 'Model Training',
    color: '#7C3AED',
    steps: ['Local training on client data', 'Federated learning where applicable', 'Hyperparameter optimization', 'Cross-validation & regularization', 'Bias detection during training'],
  },
  {
    phase: '03',
    title: 'Performance Monitoring',
    color: '#06B6D4',
    steps: ['Real-time accuracy tracking', 'Precision, recall & F1 dashboards', 'Drift detection (data & concept)', 'Latency & throughput monitoring', 'Business KPI correlation'],
  },
  {
    phase: '04',
    title: 'Retraining & Version Control',
    color: '#00C896',
    steps: ['Automated retraining triggers', 'Performance degradation alerts', 'A/B testing new model versions', 'Rollback capabilities', 'Model registry & lineage tracking'],
  },
];

const dataSources = [
  {
    category: 'Core Banking Systems',
    icon: '🏦',
    color: '#1B365D',
    sources: ['Temenos T24', 'Finacle (Infosys)', 'Flexcube (Oracle)', 'Mambu', 'Custom CBS via REST/SOAP'],
    method: 'Direct DB connectors + REST APIs',
  },
  {
    category: 'Mobile Money Platforms',
    icon: '📱',
    color: '#00C896',
    sources: ['MTN MoMo', 'Airtel Money', 'M-Pesa', 'OPay', 'PalmPay'],
    method: 'Certified API integrations',
  },
  {
    category: 'Payment Gateways',
    icon: '💳',
    color: '#F47558',
    sources: ['Paystack', 'Flutterwave', 'Interswitch', 'NIBSS', 'SWIFT/SEPA'],
    method: 'Webhook + polling integration',
  },
  {
    category: 'External Data Sources',
    icon: '🌐',
    color: '#7C3AED',
    sources: ['Credit bureaus (CRC, FirstCentral)', 'BVN verification (NIBSS)', 'NIN identity verification', 'Market data feeds', 'Alternative data (utility, telco)'],
    method: 'Secure API + batch ingestion',
  },
];

export default function ArchitecturePage() {
  const [activeTab, setActiveTab] = useState<ArchTab>('overview');

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Hero */}
          <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-to-br from-[#0f1f38] via-[#1B365D] to-[#2a4f8a] p-8">
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full border border-white/5"
                  style={{
                    width: `${(i + 1) * 120}px`,
                    height: `${(i + 1) * 120}px`,
                    top: '50%',
                    right: '10%',
                    transform: 'translate(50%, -50%)',
                  }}
                />
              ))}
            </div>
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-white/80 text-xs font-medium mb-4 border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C896] animate-pulse-slow" />
                Platform Architecture
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">Distributed Multi-Agent Architecture</h1>
              <p className="text-white/70 text-sm leading-relaxed max-w-2xl">
                A modular, enterprise-grade AI platform built as a distributed network of 9 specialized agents — each independently scalable, collectively intelligent, and deployed within your controlled environment.
              </p>
              <div className="flex flex-wrap gap-4 mt-6">
                {['9 Specialized Agents', 'Zero Single Point of Failure', 'Sub-100ms Response', 'ISO 27001 Aligned'].map((badge) => (
                  <div key={badge} className="flex items-center gap-1.5 text-xs text-white/70">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00C896]" />
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-surface-elevated rounded-xl p-1 mb-6 w-fit flex-wrap">
            {([
              { key: 'overview', label: 'Architecture Overview' },
              { key: 'security', label: 'Security Infrastructure' },
              { key: 'ai-models', label: 'AI Model Management' },
              { key: 'data-integration', label: 'Data Integration' },
            ] as { key: ArchTab; label: string }[]).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.key ? 'bg-white text-primary shadow-card' : 'text-brand-grey hover:text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab: Architecture Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Agent Grid */}
              <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-card">
                <h2 className="text-lg font-bold text-brand-dark mb-2">9 Specialized AI Agents</h2>
                <p className="text-sm text-brand-grey mb-6">Each agent is an autonomous microservice with its own model, memory, and API surface — coordinated by the Orchestration Layer.</p>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
                  {agents.slice(0, 8).map((agent) => (
                    <div key={agent.name} className="flex flex-col items-center p-3 rounded-xl bg-surface-elevated border border-surface-border hover:border-primary/30 transition-colors text-center">
                      <div className="text-2xl mb-2">{agent.icon}</div>
                      <div className="text-xs font-semibold text-brand-dark leading-tight">{agent.name}</div>
                      <div className="text-xs text-brand-grey mt-1">{agent.desc}</div>
                    </div>
                  ))}
                  <div className="flex flex-col items-center p-3 rounded-xl bg-gradient-primary border border-primary text-center">
                    <div className="text-2xl mb-2">⚡</div>
                    <div className="text-xs font-semibold text-white leading-tight">Orchestration</div>
                    <div className="text-xs text-white/70 mt-1">Central coordinator</div>
                  </div>
                </div>

                {/* Architecture Diagram */}
                <div className="bg-[#0f1f38] rounded-xl p-6 font-mono text-xs">
                  <div className="text-[#00C896] mb-4 text-sm font-bold">// SmartBankAI — Distributed Architecture</div>
                  <div className="space-y-2 text-white/70">
                    <div className="text-[#F47558]">┌─────────────────────────────────────────────────────┐</div>
                    <div className="text-[#F47558]">│           CLIENT ENVIRONMENT (On-Premise / Cloud)   │</div>
                    <div className="text-[#F47558]">├─────────────────────────────────────────────────────┤</div>
                    <div>│  <span className="text-[#06B6D4]">Digital Channels</span>: Mobile App │ Web Banking │ USSD  │</div>
                    <div className="text-[#F47558]">├─────────────────────────────────────────────────────┤</div>
                    <div>│  <span className="text-[#FFB020]">API Gateway</span> → <span className="text-[#7C3AED]">Orchestration Agent</span> (Central Hub)     │</div>
                    <div className="text-[#F47558]">├──────────────┬──────────────┬───────────────────────┤</div>
                    <div>│ <span className="text-white">Conversational</span>│ <span className="text-white">Fraud Detect</span> │ <span className="text-white">Credit Risk</span>           │</div>
                    <div>│ <span className="text-white">Personalization</span>│ <span className="text-white">Predictive</span>  │ <span className="text-white">Compliance</span>            │</div>
                    <div>│ <span className="text-white">Data Aggregation</span>│ <span className="text-white">Dashboard</span>  │ <span className="text-[#00C896]">← Independent Scale</span>  │</div>
                    <div className="text-[#F47558]">├──────────────┴──────────────┴───────────────────────┤</div>
                    <div>│  <span className="text-[#06B6D4]">Data Layer</span>: Core Banking │ Mobile Money │ External  │</div>
                    <div className="text-[#F47558]">└─────────────────────────────────────────────────────┘</div>
                  </div>
                </div>
              </div>

              {/* Inter-Agent Communication */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-card">
                  <h2 className="text-base font-bold text-brand-dark mb-4">Inter-Agent Communication</h2>
                  <div className="space-y-3">
                    {[
                      { label: 'Message Bus', desc: 'Event-driven async messaging between agents via internal message broker', icon: '📨' },
                      { label: 'Context Sharing', desc: 'Shared context store for cross-agent state synchronization and memory', icon: '🔄' },
                      { label: 'Decision Fusion', desc: 'Orchestrator aggregates outputs from multiple agents for unified decisions', icon: '🧠' },
                      { label: 'Health Monitoring', desc: 'Continuous agent health checks with automatic failover and recovery', icon: '💓' },
                      { label: 'Load Balancing', desc: 'Dynamic request distribution based on agent capacity and latency', icon: '⚖️' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-surface-elevated">
                        <span className="text-lg flex-shrink-0">{item.icon}</span>
                        <div>
                          <div className="text-sm font-semibold text-brand-dark">{item.label}</div>
                          <div className="text-xs text-brand-grey mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-card">
                  <h2 className="text-base font-bold text-brand-dark mb-4">Scalability & Resilience</h2>
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border">
                      <div className="text-sm font-bold text-brand-dark mb-2">Independent Scaling</div>
                      <p className="text-xs text-brand-grey leading-relaxed">Each agent scales independently via Kubernetes HPA. High-demand agents (Fraud, Conversational) can scale to 50+ replicas without affecting others.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border">
                      <div className="text-sm font-bold text-brand-dark mb-2">Fault Isolation</div>
                      <p className="text-xs text-brand-grey leading-relaxed">Circuit breakers prevent cascade failures. If one agent fails, others continue operating. Graceful degradation maintains core banking functions.</p>
                    </div>
                    <div className="p-4 rounded-xl bg-surface-elevated border border-surface-border">
                      <div className="text-sm font-bold text-brand-dark mb-2">Containerization</div>
                      <p className="text-xs text-brand-grey leading-relaxed">Docker containers + Kubernetes orchestration. Immutable infrastructure, rolling deployments, zero-downtime updates across all agents.</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mt-2">
                      {[{ v: '99.9%', l: 'Uptime SLA' }, { v: '<100ms', l: 'P99 Latency' }, { v: '50x', l: 'Scale Factor' }].map((m) => (
                        <div key={m.l} className="text-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                          <div className="text-lg font-bold text-primary">{m.v}</div>
                          <div className="text-xs text-brand-grey">{m.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Security */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {securityLayers.map((layer) => (
                  <div key={layer.title} className="bg-white rounded-2xl p-6 border border-surface-border shadow-card">
                    <div className={`w-12 h-12 rounded-2xl ${layer.color} flex items-center justify-center text-2xl mb-4`}>
                      {layer.icon}
                    </div>
                    <h3 className="text-base font-bold text-brand-dark mb-3">{layer.title}</h3>
                    <div className="space-y-2">
                      {layer.items.map((item) => (
                        <div key={item} className="flex items-center gap-2 text-xs text-brand-grey">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] flex-shrink-0" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-[#0f1f38] rounded-2xl p-6 text-white">
                <h2 className="text-lg font-bold mb-4">Security Architecture Principles</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { title: 'Zero Trust', desc: 'Every request is authenticated and authorized regardless of network origin. No implicit trust within the perimeter.', icon: '🔒' },
                    { title: 'Defense in Depth', desc: 'Multiple independent security layers. Compromise of one layer does not expose the system.', icon: '🛡️' },
                    { title: 'Data Sovereignty', desc: 'All data stays within the client\'s controlled environment. No data leaves the deployment boundary.', icon: '🌍' },
                  ].map((p) => (
                    <div key={p.title} className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="text-2xl mb-3">{p.icon}</div>
                      <div className="text-sm font-bold mb-2">{p.title}</div>
                      <div className="text-xs text-white/60 leading-relaxed">{p.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: AI Model Management */}
          {activeTab === 'ai-models' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                {aiModelStages.map((stage) => (
                  <div key={stage.phase} className="bg-white rounded-2xl p-6 border border-surface-border shadow-card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: stage.color }}>
                        {stage.phase}
                      </div>
                      <h3 className="text-base font-bold text-brand-dark">{stage.title}</h3>
                    </div>
                    <div className="space-y-2">
                      {stage.steps.map((step) => (
                        <div key={step} className="flex items-center gap-2 text-sm text-brand-grey">
                          <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
                          {step}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-card">
                  <h2 className="text-base font-bold text-brand-dark mb-4">Bias Detection & Fairness</h2>
                  <p className="text-sm text-brand-grey leading-relaxed mb-4">
                    All models undergo rigorous bias testing across demographic groups before deployment. Continuous fairness monitoring ensures equitable outcomes across gender, geography, and socioeconomic segments.
                  </p>
                  <div className="space-y-3">
                    {['Demographic parity testing', 'Equal opportunity metrics', 'Disparate impact analysis', 'Counterfactual fairness checks', 'Ongoing fairness dashboards'].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-brand-grey">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-card">
                  <h2 className="text-base font-bold text-brand-dark mb-4">Explainability Tools</h2>
                  <p className="text-sm text-brand-grey leading-relaxed mb-4">
                    Regulatory compliance requires that AI decisions be explainable. Every model decision comes with human-readable explanations suitable for customer communication and regulatory examination.
                  </p>
                  <div className="space-y-3">
                    {['SHAP value explanations', 'LIME local interpretability', 'Decision path visualization', 'Feature importance rankings', 'Regulator-ready audit reports'].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-brand-grey">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Data Integration */}
          {activeTab === 'data-integration' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                {dataSources.map((source) => (
                  <div key={source.category} className="bg-white rounded-2xl p-6 border border-surface-border shadow-card">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl" style={{ backgroundColor: `${source.color}15` }}>
                        {source.icon}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-brand-dark">{source.category}</h3>
                        <div className="text-xs text-brand-grey mt-0.5">{source.method}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {source.sources.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-full text-xs font-medium border" style={{ backgroundColor: `${source.color}10`, color: source.color, borderColor: `${source.color}30` }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-card">
                <h2 className="text-base font-bold text-brand-dark mb-5">Data Pipeline Architecture</h2>
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { step: '1', title: 'Ingest', desc: 'Secure connectors pull data from all sources via REST, SOAP, CDC, and batch files', color: '#1B365D' },
                    { step: '2', title: 'Transform', desc: 'Cleanse, normalize, and enrich data. Resolve entity conflicts. Apply governance rules', color: '#7C3AED' },
                    { step: '3', title: 'Unify', desc: 'Build unified customer profiles. Merge identities across systems. Eliminate silos', color: '#06B6D4' },
                    { step: '4', title: 'Serve', desc: 'Real-time streaming to all 9 agents. Sub-second data freshness for fraud and credit decisions', color: '#00C896' },
                  ].map((s) => (
                    <div key={s.step} className="relative">
                      <div className="p-4 rounded-xl border border-surface-border bg-surface-elevated">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold mb-3" style={{ backgroundColor: s.color }}>
                          {s.step}
                        </div>
                        <div className="text-sm font-bold text-brand-dark mb-2">{s.title}</div>
                        <div className="text-xs text-brand-grey leading-relaxed">{s.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { icon: '⚡', title: 'Real-Time Streaming', desc: 'Apache Kafka-based event streaming for sub-second data delivery to all agents', color: '#F47558' },
                  { icon: '🔒', title: 'Data Governance', desc: 'NDPR, GDPR, CBN compliance enforced at the data layer. Field-level access controls', color: '#1B365D' },
                  { icon: '📊', title: 'Quality Assurance', desc: 'Automated data quality scoring. Anomaly detection in data pipelines. SLA monitoring', color: '#00C896' },
                ].map((item) => (
                  <div key={item.title} className="bg-white rounded-2xl p-5 border border-surface-border shadow-card">
                    <div className="text-2xl mb-3">{item.icon}</div>
                    <div className="text-sm font-bold text-brand-dark mb-2">{item.title}</div>
                    <div className="text-xs text-brand-grey leading-relaxed">{item.desc}</div>
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
