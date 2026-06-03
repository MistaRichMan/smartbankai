'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Link from 'next/link';

const coreValues = [
  {
    icon: '⭐',
    title: 'Excellence',
    description: 'We hold ourselves to the highest standards in everything we build — from model accuracy to user experience. Mediocrity is not an option when financial institutions and their customers depend on us.',
    color: 'bg-[#1B365D]',
  },
  {
    icon: '🤝',
    title: 'Collaboration',
    description: 'We believe the best outcomes emerge from deep partnerships — with our clients, their customers, and each other. We co-create solutions, not just deliver software.',
    color: 'bg-[#F47558]',
  },
  {
    icon: '💡',
    title: 'Innovation',
    description: 'We push the boundaries of what AI can do in banking. We experiment boldly, learn rapidly, and continuously evolve our platform to stay ahead of the curve.',
    color: 'bg-[#00C896]',
  },
  {
    icon: '🔒',
    title: 'Integrity',
    description: 'Trust is the foundation of banking. We build systems that are transparent, explainable, and auditable — and we operate with the same honesty we expect from our models.',
    color: 'bg-[#7C3AED]',
  },
  {
    icon: '🌍',
    title: 'Adaptability',
    description: 'Africa\'s financial landscape is diverse and dynamic. We design for local realities — multiple languages, varied infrastructure, unique regulatory environments — not just global defaults.',
    color: 'bg-[#06B6D4]',
  },
  {
    icon: '❤️',
    title: 'Customer Focus',
    description: 'Every feature we build traces back to a real customer need. We obsess over the end-user experience and measure our success by the financial outcomes we enable for real people.',
    color: 'bg-[#FFB020]',
  },
];

const stats = [
  { value: '9', label: 'Specialized AI Agents', sub: 'Working in concert' },
  { value: '8+', label: 'African Languages', sub: 'Supported natively' },
  { value: '95%+', label: 'Intent Recognition', sub: 'Accuracy rate' },
  { value: '6', label: 'Banking Domains', sub: 'Fully automated' },
];

const timeline = [
  { year: '2023', title: 'Foundation', desc: 'SmartBankAI founded with a mission to bring enterprise-grade AI to African financial institutions.' },
  { year: '2024', title: 'Platform Build', desc: 'Core multi-agent architecture developed. First 9 specialized AI agents deployed in controlled environments.' },
  { year: '2025', title: 'Pilot Programs', desc: 'Successful pilots with commercial banks and microfinance institutions across Nigeria and Ghana.' },
  { year: '2026', title: 'Scale & Expand', desc: 'Full platform launch. Expanding to East Africa and global markets with enterprise partnerships.' },
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'mission' | 'values' | 'team'>('overview');

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Hero */}
          <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-primary p-8 md:p-12">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white blur-3xl transform translate-x-1/2 -translate-y-1/2" />
              <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#F47558] blur-3xl transform -translate-x-1/2 translate-y-1/2" />
            </div>
            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-white/80 text-xs font-medium mb-4 border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C896] animate-pulse-slow" />
                About SmartBankAI
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Redefining Digital Banking<br />
                <span className="text-[#F47558]">Across Africa & Beyond</span>
              </h1>
              <p className="text-white/75 text-base md:text-lg leading-relaxed max-w-2xl">
                SmartBankAI is a modular, AI-driven digital banking platform that transforms traditional banking into a proactive, intelligent, and highly personalized financial journey — built specifically for the African market and designed for global scale.
              </p>
              <div className="flex flex-wrap gap-3 mt-6">
                <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F47558] text-white rounded-xl font-semibold text-sm hover:bg-[#d95e3f] transition-colors">
                  Request a Demo
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </Link>
                <Link href="/architecture" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 text-white rounded-xl font-semibold text-sm hover:bg-white/20 transition-colors border border-white/20">
                  View Architecture
                </Link>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl p-5 border border-surface-border shadow-card text-center">
                <div className="text-3xl font-bold text-primary mb-1">{s.value}</div>
                <div className="text-sm font-semibold text-brand-dark">{s.label}</div>
                <div className="text-xs text-brand-grey mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-surface-elevated rounded-xl p-1 mb-6 w-fit">
            {(['overview', 'mission', 'values', 'team'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeTab === tab ? 'bg-white text-primary shadow-card' : 'text-brand-grey hover:text-primary'
                }`}
              >
                {tab === 'overview' ? 'Company Overview' : tab === 'mission' ? 'Mission & Vision' : tab === 'values' ? 'Core Values' : 'Leadership'}
              </button>
            ))}
          </div>

          {/* Tab: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-card">
                  <h2 className="text-lg font-bold text-brand-dark mb-4">What We Build</h2>
                  <p className="text-brand-grey text-sm leading-relaxed mb-4">
                    SmartBankAI operates as a vertical stack hosted within client banks' environments — either on-premise or private cloud. The platform functions as a distributed network of specialized, interconnected AI Agents that combine foundational infrastructure, an AI software layer, and Retrieval-Augmented Generation (RAG) tailored specifically for banking.
                  </p>
                  <p className="text-brand-grey text-sm leading-relaxed">
                    Unlike generic AI platforms, every component of SmartBankAI is purpose-built for financial services — from our credit risk models calibrated for African market realities to our conversational agent supporting 8+ local languages and dialects.
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    {['On-Premise Deployment', 'Private Cloud', 'Hybrid Architecture', 'API-First Design'].map((f) => (
                      <div key={f} className="flex items-center gap-2 text-xs text-brand-dark">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00C896] flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-card">
                  <h2 className="text-lg font-bold text-brand-dark mb-4">Who We Serve</h2>
                  <div className="space-y-3">
                    {[
                      { icon: '🏦', label: 'Commercial Banks', desc: 'Full-service banks seeking AI-powered digital transformation' },
                      { icon: '🏢', label: 'Microfinance Banks', desc: 'MFBs expanding financial inclusion with intelligent credit tools' },
                      { icon: '⚡', label: 'Fintech Companies', desc: 'Digital-native fintechs building next-gen banking products' },
                      { icon: '📱', label: 'Mobile Money Operators', desc: 'Telco-led financial services platforms across Africa' },
                    ].map((item) => (
                      <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-surface-elevated">
                        <span className="text-xl">{item.icon}</span>
                        <div>
                          <div className="text-sm font-semibold text-brand-dark">{item.label}</div>
                          <div className="text-xs text-brand-grey mt-0.5">{item.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-card">
                <h2 className="text-lg font-bold text-brand-dark mb-6">Our Journey</h2>
                <div className="grid md:grid-cols-4 gap-4">
                  {timeline.map((item, i) => (
                    <div key={item.year} className="relative">
                      {i < timeline.length - 1 && (
                        <div className="hidden md:block absolute top-5 left-full w-full h-0.5 bg-surface-border z-0" style={{ width: 'calc(100% - 2.5rem)', left: '2.5rem' }} />
                      )}
                      <div className="relative z-10">
                        <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold mb-3">{item.year.slice(2)}</div>
                        <div className="text-sm font-bold text-brand-dark mb-1">{item.year} — {item.title}</div>
                        <div className="text-xs text-brand-grey leading-relaxed">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Mission & Vision */}
          {activeTab === 'mission' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-primary rounded-2xl p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5 transform translate-x-1/2 -translate-y-1/2" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl mb-5">🎯</div>
                    <h2 className="text-xl font-bold mb-4">Our Mission</h2>
                    <p className="text-white/80 text-sm leading-relaxed">
                      To empower banks, OFIs, fintechs, and mobile money providers across Nigeria and Africa with intelligent, secure, and personalized mobile banking experiences — using advanced AI to deliver real-time insights, prevent fraud, and provide tailored financial guidance that drives genuine financial inclusion.
                    </p>
                    <div className="mt-6 pt-6 border-t border-white/10">
                      <div className="text-xs text-white/60 uppercase tracking-wider mb-3">Key Focus Areas</div>
                      <div className="space-y-2">
                        {['Real-time AI insights', 'Fraud prevention at scale', 'Personalized financial guidance', 'Financial inclusion enablement'].map((f) => (
                          <div key={f} className="flex items-center gap-2 text-sm text-white/80">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#F47558]" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-8 border border-surface-border shadow-card relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-[#F47558]/5 transform translate-x-1/2 -translate-y-1/2" />
                  <div className="relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#F47558]/10 flex items-center justify-center text-2xl mb-5">🔭</div>
                    <h2 className="text-xl font-bold text-brand-dark mb-4">Our Vision</h2>
                    <p className="text-brand-grey text-sm leading-relaxed">
                      To redefine digital banking as a transformative experience — where every interaction is hyper-personalized, every decision is data-driven, and every customer feels genuinely understood by their bank. We envision a future where AI-powered banking fosters financial inclusion, builds lasting trust, and creates measurable economic impact across Africa and the world.
                    </p>
                    <div className="mt-6 pt-6 border-t border-surface-border">
                      <div className="text-xs text-brand-grey uppercase tracking-wider mb-3">Vision Pillars</div>
                      <div className="space-y-2">
                        {['Hyper-personalized banking at scale', 'Real-time, secure automation', 'Financial inclusion & trust', 'Measurable economic impact'].map((f) => (
                          <div key={f} className="flex items-center gap-2 text-sm text-brand-dark">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#F47558]" />
                            {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-surface-border shadow-card">
                <h2 className="text-lg font-bold text-brand-dark mb-5">Strategic Objectives</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { icon: '🌍', title: 'Pan-African Reach', desc: 'Deploy across Nigeria, Ghana, Kenya, South Africa, and 10+ African markets by 2027, serving 50+ financial institutions.' },
                    { icon: '🤖', title: 'AI Leadership', desc: 'Maintain the most accurate, explainable, and compliant AI models in African banking — continuously retrained on local data.' },
                    { icon: '🔐', title: 'Security Standard', desc: 'Set the benchmark for AI security in African financial services — zero data breaches, full regulatory compliance, complete auditability.' },
                  ].map((obj) => (
                    <div key={obj.title} className="p-5 rounded-xl bg-surface-elevated border border-surface-border">
                      <div className="text-2xl mb-3">{obj.icon}</div>
                      <div className="text-sm font-bold text-brand-dark mb-2">{obj.title}</div>
                      <div className="text-xs text-brand-grey leading-relaxed">{obj.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab: Core Values */}
          {activeTab === 'values' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {coreValues.map((value) => (
                  <div key={value.title} className="bg-white rounded-2xl p-6 border border-surface-border shadow-card hover:shadow-card-hover transition-shadow group">
                    <div className={`w-12 h-12 rounded-2xl ${value.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                      {value.icon}
                    </div>
                    <h3 className="text-base font-bold text-brand-dark mb-3">{value.title}</h3>
                    <p className="text-sm text-brand-grey leading-relaxed">{value.description}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-primary rounded-2xl p-8 text-white">
                <div className="max-w-2xl">
                  <h2 className="text-xl font-bold mb-3">Values in Practice</h2>
                  <p className="text-white/75 text-sm leading-relaxed mb-6">
                    Our values aren't aspirational posters on a wall — they're embedded in how we build, deploy, and support our platform. From bias detection in our credit models to multi-language support in our conversational agent, every technical decision reflects our commitment to these principles.
                  </p>
                  <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#F47558] text-white rounded-xl font-semibold text-sm hover:bg-[#d95e3f] transition-colors">
                    Join Our Mission
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Tab: Leadership */}
          {activeTab === 'team' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Richard Anwanakak */}
                <div className="bg-white rounded-2xl p-8 border border-surface-border shadow-card">
                  <div className="flex items-start gap-5 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-primary flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
                      RA
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark">Richard Anwanakak</h3>
                      <div className="text-[#F47558] font-semibold text-sm mt-1">Founder & CEO</div>
                      <div className="flex gap-2 mt-3">
                        <span className="px-2.5 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium">Founder</span>
                        <span className="px-2.5 py-1 bg-[#F47558]/10 text-[#F47558] text-xs rounded-full font-medium">CEO</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-brand-grey text-sm leading-relaxed mb-5">
                    Richard founded SmartBankAI with a singular vision: to bring the power of enterprise-grade artificial intelligence to financial institutions across Africa. With deep expertise in banking technology and AI systems, he leads the company's strategic direction, product vision, and market expansion across the continent.
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-brand-dark uppercase tracking-wider mb-3">Areas of Focus</div>
                    {['Strategic vision & company direction', 'Banking technology transformation', 'African market expansion', 'Investor & partner relations', 'Product roadmap & innovation'].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-brand-grey">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Naveen Srinivas */}
                <div className="bg-white rounded-2xl p-8 border border-surface-border shadow-card">
                  <div className="flex items-start gap-5 mb-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7C3AED] to-[#06B6D4] flex items-center justify-center text-3xl font-bold text-white flex-shrink-0">
                      NS
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-brand-dark">Naveen Srinivas</h3>
                      <div className="text-[#7C3AED] font-semibold text-sm mt-1">Chief Scientific Officer</div>
                      <div className="flex gap-2 mt-3">
                        <span className="px-2.5 py-1 bg-[#7C3AED]/10 text-[#7C3AED] text-xs rounded-full font-medium">CSO</span>
                        <span className="px-2.5 py-1 bg-[#06B6D4]/10 text-[#06B6D4] text-xs rounded-full font-medium">AI Research</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-brand-grey text-sm leading-relaxed mb-5">
                    Naveen leads SmartBankAI's scientific research and AI model development. He oversees the design and training of all 9 specialized AI agents, ensuring each model meets the highest standards of accuracy, fairness, and explainability. His work on RAG architectures tailored for banking has been foundational to the platform's performance.
                  </p>
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-brand-dark uppercase tracking-wider mb-3">Areas of Expertise</div>
                    {['Multi-agent AI architecture', 'RAG systems for financial services', 'Model bias detection & mitigation', 'Explainable AI for regulatory compliance', 'African language NLP models'].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-brand-grey">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] flex-shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Open Role */}
              <div className="bg-white rounded-2xl p-6 border border-dashed border-[#F47558]/50 shadow-card">
                <div className="flex items-start gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-surface-elevated border-2 border-dashed border-surface-border flex items-center justify-center text-2xl flex-shrink-0">
                    🔍
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-brand-dark">Chief Technology Officer / Chief AI Engineer</h3>
                      <span className="px-2.5 py-1 bg-[#F47558]/10 text-[#F47558] text-xs rounded-full font-semibold">Open Role</span>
                    </div>
                    <p className="text-brand-grey text-sm leading-relaxed mb-4">
                      We're seeking a world-class CTO/Chief AI Engineer to own our technical vision, AI/ML architecture, infrastructure design, security framework, and regulatory compliance strategy. This is a founding leadership role with significant equity and the opportunity to shape the future of AI banking in Africa.
                    </p>
                    <div className="grid md:grid-cols-2 gap-3 mb-5">
                      {['AI, ML & deep learning expertise', 'Banking technology systems', 'Cloud architecture & infrastructure', 'Security & regulatory compliance', 'Team leadership & mentorship', 'Distributed systems design'].map((req) => (
                        <div key={req} className="flex items-center gap-2 text-xs text-brand-grey">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#F47558] flex-shrink-0" />
                          {req}
                        </div>
                      ))}
                    </div>
                    <Link href="/contact" className="inline-flex items-center gap-2 px-4 py-2 bg-[#F47558] text-white rounded-xl font-semibold text-sm hover:bg-[#d95e3f] transition-colors">
                      Apply for This Role
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </Link>
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
