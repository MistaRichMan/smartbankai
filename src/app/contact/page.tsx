'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { createClient } from '@/lib/supabase/client';

type InquiryType = 'demo' | 'sales' | 'consultation' | 'partnership' | 'general';
type InstitutionType = 'commercial_bank' | 'microfinance_bank' | 'fintech' | 'mobile_money' | 'investment_bank' | 'other';

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  job_title: string;
  institution_name: string;
  institution_type: InstitutionType | '';
  country: string;
  inquiry_type: InquiryType | '';
  use_cases: string[];
  message: string;
  preferred_date: string;
}

const initialForm: FormData = {
  full_name: '',
  email: '',
  phone: '',
  job_title: '',
  institution_name: '',
  institution_type: '',
  country: '',
  inquiry_type: '',
  use_cases: [],
  message: '',
  preferred_date: '',
};

const useCaseOptions = [
  'Retail Banking AI', 'Fraud Detection', 'Credit Risk & Lending', 'Wealth Management',
  'Compliance & Reporting', 'Corporate Banking', 'Customer Service AI', 'Marketing & Sales',
];

const countries = [
  'Nigeria', 'Ghana', 'Kenya', 'South Africa', 'Ethiopia', 'Tanzania', 'Uganda',
  'Rwanda', 'Senegal', 'Côte d\'Ivoire', 'Cameroon', 'Egypt', 'Morocco', 'Other African Country', 'Outside Africa',
];

const contactInfo = [
  { icon: '📧', label: 'Email', value: 'hello@infinityai.africa', sub: 'Response within 24 hours' },
  { icon: '💼', label: 'Sales', value: 'sales@infinityai.africa', sub: 'Enterprise & partnerships' },
  { icon: '🌍', label: 'Headquarters', value: 'Lagos, Nigeria', sub: 'West Africa Hub' },
];

export default function ContactPage() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleUseCaseToggle = (uc: string) => {
    setForm((prev) => ({
      ...prev,
      use_cases: prev.use_cases.includes(uc)
        ? prev.use_cases.filter((u) => u !== uc)
        : [...prev.use_cases, uc],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.email || !form.institution_name || !form.inquiry_type) {
      setError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: dbError } = await supabase.from('contact_submissions').insert([
        {
          full_name: form.full_name,
          email: form.email,
          phone: form.phone || null,
          job_title: form.job_title || null,
          institution_name: form.institution_name,
          institution_type: form.institution_type || null,
          country: form.country || null,
          inquiry_type: form.inquiry_type,
          use_cases: form.use_cases,
          message: form.message || null,
          preferred_date: form.preferred_date || null,
        },
      ]);
      if (dbError) throw dbError;
      setSubmitted(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Submission failed. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {/* Hero */}
          <div className="relative rounded-2xl overflow-hidden mb-8 bg-gradient-primary p-8">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#F47558] blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            </div>
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-white/80 text-xs font-medium mb-4 border border-white/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00C896] animate-pulse-slow" />
                Contact & Demo Request
              </div>
              <h1 className="text-3xl font-bold text-white mb-3">Start Your AI Banking Journey</h1>
              <p className="text-white/70 text-sm leading-relaxed">
                Whether you're a commercial bank, microfinance institution, fintech, or mobile money operator — we'd love to show you what SmartBankAI can do for your institution. Request a personalized demo or connect with our team.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-white rounded-2xl p-10 border border-surface-border shadow-card text-center">
                  <div className="w-20 h-20 rounded-full bg-[#00C896]/10 flex items-center justify-center text-4xl mx-auto mb-5">✅</div>
                  <h2 className="text-2xl font-bold text-brand-dark mb-3">Request Submitted!</h2>
                  <p className="text-brand-grey text-sm leading-relaxed max-w-md mx-auto mb-6">
                    Thank you for reaching out. Our team will review your request and get back to you within 24 hours. We look forward to showing you what SmartBankAI can do for {form.institution_name}.
                  </p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-surface-elevated rounded-xl text-sm text-brand-grey">
                    <span>📧</span> Confirmation sent to <strong>{form.email}</strong>
                  </div>
                  <div className="mt-6">
                    <button
                      onClick={() => { setSubmitted(false); setForm(initialForm); }}
                      className="px-5 py-2.5 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors"
                    >
                      Submit Another Request
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 border border-surface-border shadow-card space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-brand-dark mb-1">Contact Information</h2>
                    <p className="text-xs text-brand-grey">Fields marked with * are required</p>
                  </div>

                  {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                      {error}
                    </div>
                  )}

                  {/* Personal Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-brand-dark mb-1.5">Full Name *</label>
                      <input
                        type="text"
                        value={form.full_name}
                        onChange={(e) => handleChange('full_name', e.target.value)}
                        placeholder="e.g. Amara Okafor"
                        className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-surface text-sm text-brand-dark placeholder-brand-grey/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-dark mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="you@institution.com"
                        className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-surface text-sm text-brand-dark placeholder-brand-grey/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-dark mb-1.5">Phone Number</label>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="+234 800 000 0000"
                        className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-surface text-sm text-brand-dark placeholder-brand-grey/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-brand-dark mb-1.5">Job Title</label>
                      <input
                        type="text"
                        value={form.job_title}
                        onChange={(e) => handleChange('job_title', e.target.value)}
                        placeholder="e.g. Chief Digital Officer"
                        className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-surface text-sm text-brand-dark placeholder-brand-grey/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  {/* Institution Info */}
                  <div className="pt-4 border-t border-surface-border">
                    <h3 className="text-sm font-bold text-brand-dark mb-4">Institution Details</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-brand-dark mb-1.5">Institution Name *</label>
                        <input
                          type="text"
                          value={form.institution_name}
                          onChange={(e) => handleChange('institution_name', e.target.value)}
                          placeholder="e.g. First Bank of Nigeria"
                          className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-surface text-sm text-brand-dark placeholder-brand-grey/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-brand-dark mb-1.5">Institution Type *</label>
                        <select
                          value={form.institution_type}
                          onChange={(e) => handleChange('institution_type', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-surface text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          required
                        >
                          <option value="">Select type...</option>
                          <option value="commercial_bank">Commercial Bank</option>
                          <option value="microfinance_bank">Microfinance Bank</option>
                          <option value="fintech">Fintech Company</option>
                          <option value="mobile_money">Mobile Money Operator</option>
                          <option value="investment_bank">Investment Bank / OFI</option>
                          <option value="other">Other Financial Institution</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-brand-dark mb-1.5">Country</label>
                        <select
                          value={form.country}
                          onChange={(e) => handleChange('country', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-surface text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                        >
                          <option value="">Select country...</option>
                          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-brand-dark mb-1.5">Inquiry Type *</label>
                        <select
                          value={form.inquiry_type}
                          onChange={(e) => handleChange('inquiry_type', e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-surface text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                          required
                        >
                          <option value="">Select inquiry type...</option>
                          <option value="demo">Request a Demo</option>
                          <option value="sales">Contact Sales</option>
                          <option value="consultation">Schedule Consultation</option>
                          <option value="partnership">Partnership Inquiry</option>
                          <option value="general">General Inquiry</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Use Cases */}
                  <div className="pt-4 border-t border-surface-border">
                    <h3 className="text-sm font-bold text-brand-dark mb-2">Areas of Interest</h3>
                    <p className="text-xs text-brand-grey mb-3">Select all use cases you'd like to explore</p>
                    <div className="flex flex-wrap gap-2">
                      {useCaseOptions.map((uc) => (
                        <button
                          key={uc}
                          type="button"
                          onClick={() => handleUseCaseToggle(uc)}
                          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                            form.use_cases.includes(uc)
                              ? 'bg-primary text-white border-primary' :'bg-surface text-brand-grey border-surface-border hover:border-primary/30 hover:text-primary'
                          }`}
                        >
                          {uc}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Preferred Date */}
                  {(form.inquiry_type === 'demo' || form.inquiry_type === 'consultation') && (
                    <div className="pt-4 border-t border-surface-border">
                      <label className="block text-xs font-semibold text-brand-dark mb-1.5">Preferred Date for Demo/Consultation</label>
                      <input
                        type="date"
                        value={form.preferred_date}
                        onChange={(e) => handleChange('preferred_date', e.target.value)}
                        className="w-full md:w-64 px-3 py-2.5 rounded-xl border border-surface-border bg-surface text-sm text-brand-dark focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                      />
                    </div>
                  )}

                  {/* Message */}
                  <div className="pt-4 border-t border-surface-border">
                    <label className="block text-xs font-semibold text-brand-dark mb-1.5">Message / Additional Context</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      rows={4}
                      placeholder="Tell us about your institution's current challenges, goals, or specific questions about SmartBankAI..."
                      className="w-full px-3 py-2.5 rounded-xl border border-surface-border bg-surface text-sm text-brand-dark placeholder-brand-grey/50 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 bg-primary text-white rounded-xl font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Request
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Sidebar Info */}
            <div className="space-y-5">
              {/* Contact Details */}
              <div className="bg-white rounded-2xl p-5 border border-surface-border shadow-card">
                <h3 className="text-sm font-bold text-brand-dark mb-4">Contact Details</h3>
                <div className="space-y-4">
                  {contactInfo.map((info) => (
                    <div key={info.label} className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-surface-elevated flex items-center justify-center text-lg flex-shrink-0">
                        {info.icon}
                      </div>
                      <div>
                        <div className="text-xs text-brand-grey">{info.label}</div>
                        <div className="text-sm font-semibold text-brand-dark">{info.value}</div>
                        <div className="text-xs text-brand-grey">{info.sub}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* What to Expect */}
              <div className="bg-white rounded-2xl p-5 border border-surface-border shadow-card">
                <h3 className="text-sm font-bold text-brand-dark mb-4">What Happens Next</h3>
                <div className="space-y-3">
                  {[
                    { step: '1', title: 'Review', desc: 'Our team reviews your request within 24 hours' },
                    { step: '2', title: 'Connect', desc: 'A solutions specialist reaches out to understand your needs' },
                    { step: '3', title: 'Demo', desc: 'Personalized demo tailored to your institution type' },
                    { step: '4', title: 'Proposal', desc: 'Custom implementation proposal with pricing & timeline' },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                        {item.step}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-brand-dark">{item.title}</div>
                        <div className="text-xs text-brand-grey">{item.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Trusted By */}
              <div className="bg-gradient-primary rounded-2xl p-5 text-white">
                <h3 className="text-sm font-bold mb-3">Built for African Finance</h3>
                <div className="space-y-2">
                  {[
                    '🏦 Commercial Banks',
                    '🏢 Microfinance Banks',
                    '⚡ Fintech Companies',
                    '📱 Mobile Money Operators',
                    '🌍 Global Financial Institutions',
                  ].map((item) => (
                    <div key={item} className="text-xs text-white/80 flex items-center gap-2">
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-white/10 text-xs text-white/60">
                  Serving institutions across Nigeria, Ghana, Kenya, and 10+ African markets
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
