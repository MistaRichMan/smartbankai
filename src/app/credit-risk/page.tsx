'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import { DEMO_LOANS, DEMO_CUSTOMERS, getCustomerTransactions, fmtNGN, fmtDate,  } from '@/lib/demo/bankingData';

const scoreDistribution = [
  { range: '300-400', count: 45, risk: 'Very High' },
  { range: '400-500', count: 128, risk: 'High' },
  { range: '500-600', count: 342, risk: 'Medium-High' },
  { range: '600-700', count: 589, risk: 'Medium' },
  { range: '700-800', count: 847, risk: 'Low' },
  { range: '800-900', count: 412, risk: 'Very Low' },
];

const radarData = [
  { subject: 'Payment History', A: 85, B: 62 },
  { subject: 'Credit Utilization', A: 78, B: 45 },
  { subject: 'Alt Data Score', A: 91, B: 70 },
  { subject: 'Business Revenue', A: 88, B: 55 },
  { subject: 'Mobile Money', A: 94, B: 80 },
  { subject: 'Social Capital', A: 72, B: 60 },
];

const nplTrend = [
  { month: 'Jan', npl: 2.8 }, { month: 'Feb', npl: 2.6 }, { month: 'Mar', npl: 2.5 },
  { month: 'Apr', npl: 2.4 }, { month: 'May', npl: 2.3 }, { month: 'Jun', npl: 2.2 },
  { month: 'Jul', npl: 2.1 }, { month: 'Aug', npl: 2.0 }, { month: 'Sep', npl: 2.1 },
  { month: 'Oct', npl: 2.0 }, { month: 'Nov', npl: 2.1 }, { month: 'Dec', npl: 2.1 },
];

const riskConfig: Record<string, string> = {
  Low: 'bg-accent-green/10 text-accent-green border-accent-green/20',
  Medium: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
  High: 'bg-accent-red/10 text-accent-red border-accent-red/20',
};

const statusConfig: Record<string, string> = {
  approved: 'bg-accent-green/10 text-accent-green border-accent-green/20',
  review: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
  declined: 'bg-accent-red/10 text-accent-red border-accent-red/20',
  disbursed: 'bg-primary/10 text-primary border-primary/20',
};

interface CreditRiskResult {
  credit_score: number;
  risk_grade: string;
  decision: string;
  confidence: number;
  risk_factors: string[];
  analysis: string;
  suggested_terms: { interest_rate: string; tenure_months: number; max_amount?: number };
}

export default function CreditRiskPage() {
  const [activeTab, setActiveTab] = useState<'applications' | 'analytics' | 'customers' | 'assess' | 'model'>('applications');
  const [selectedLoan, setSelectedLoan] = useState<typeof DEMO_LOANS[0] | null>(null);
  const [isAssessing, setIsAssessing] = useState(false);
  const [creditResult, setCreditResult] = useState<CreditRiskResult | null>(null);
  const [assessError, setAssessError] = useState('');
  const [assessForm, setAssessForm] = useState({
    applicationRef: 'LOAN-4421',
    customerName: 'Adaeze Okonkwo',
    customerType: 'msme\' as \'individual\' | \'msme',
    loanAmount: '2500000',
    loanPurpose: 'Working capital for retail trade expansion',
    monthlyIncome: '850000',
    existingDebts: '0',
    alternativeData: 'Regular mobile money transactions ₦2.1M/month avg, utility bills paid on time for 24 months, active savings group member, LOAN-4421 from Web Banking Portal',
  });

  const approvedLoans = DEMO_LOANS.filter(l => l.status === 'approved' || l.status === 'disbursed');
  const reviewLoans = DEMO_LOANS.filter(l => l.status === 'review');
  const totalPortfolio = approvedLoans.reduce((s, l) => s + l.amount, 0);

  const runCreditAssessment = async () => {
    setIsAssessing(true);
    setAssessError('');
    setCreditResult(null);
    try {
      const res = await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: 'credit_risk',
          input: {
            ...assessForm,
            loanAmount: parseFloat(assessForm.loanAmount),
            monthlyIncome: parseFloat(assessForm.monthlyIncome),
            existingDebts: parseFloat(assessForm.existingDebts),
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCreditResult(data.result as CreditRiskResult);
      } else {
        setAssessError(data.error || 'Assessment failed');
      }
    } catch {
      setAssessError('Failed to connect to Credit Risk Agent');
    } finally {
      setIsAssessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Credit Risk Agent" subtitle="AI-powered credit scoring for African markets — individuals, MSMEs & alternative data" />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* KPIs */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: 'Total Applications', value: DEMO_LOANS.length, sub: 'From all channels', color: 'text-primary' },
              { label: 'Approved / Disbursed', value: approvedLoans.length, sub: `${fmtNGN(totalPortfolio)} portfolio`, color: 'text-accent-green' },
              { label: 'Under Review', value: reviewLoans.length, sub: 'Pending AI assessment', color: 'text-accent-amber' },
              { label: 'Declined', value: DEMO_LOANS.filter(l => l.status === 'declined').length, sub: 'Risk threshold exceeded', color: 'text-accent-red' },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-surface-card border border-surface-border rounded-2xl p-4">
                <div className={`text-2xl font-bold ${kpi.color} mb-1`}>{kpi.value}</div>
                <div className="text-sm font-medium text-brand-dark">{kpi.label}</div>
                <div className="text-xs text-brand-grey mt-0.5">{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {(['applications', 'analytics', 'customers', 'assess', 'model'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${activeTab === tab ? 'bg-gradient-primary text-white shadow-glow-blue' : 'bg-surface-elevated text-brand-grey hover:text-brand-dark border border-surface-border'}`}>
                {tab === 'applications' ? `Loan Applications (${DEMO_LOANS.length})` : tab === 'analytics' ? 'Portfolio Analytics' : tab === 'customers' ? 'Customer Profiles' : tab === 'assess' ? '🧮 Assess' : 'AI Model'}
              </button>
            ))}
          </div>

          {activeTab === 'applications' && (
            <div className="space-y-4">
              <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-brand-dark">Loan Applications — From Web Banking & Mobile App</h3>
                  <span className="text-xs text-brand-grey">Sources: Web Banking Portal · Mobile Banking Super-App</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-border">
                        {['Loan ID', 'Applicant', 'Type', 'Amount', 'Credit Score', 'Risk', 'Status', 'Sector', 'Monthly Income', 'Applied'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {DEMO_LOANS.map((loan) => (
                        <tr key={loan.id} onClick={() => setSelectedLoan(loan)} className="hover:bg-surface-elevated transition-colors cursor-pointer">
                          <td className="px-4 py-3 text-xs font-mono text-primary">{loan.id}</td>
                          <td className="px-4 py-3">
                            <div className="text-xs text-brand-dark font-medium">{loan.applicantName}</div>
                            <div className="text-xs text-brand-grey">{loan.customerId}</div>
                          </td>
                          <td className="px-4 py-3 text-xs text-brand-grey">{loan.loanType}</td>
                          <td className="px-4 py-3 text-xs font-medium text-brand-dark whitespace-nowrap">{fmtNGN(loan.amount)}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-12 bg-surface-border rounded-full h-1.5">
                                <div className="h-1.5 rounded-full" style={{ width: `${(loan.creditScore / 900) * 100}%`, backgroundColor: loan.creditScore > 700 ? '#00C896' : loan.creditScore > 600 ? '#FFB020' : '#FF4D4D' }}></div>
                              </div>
                              <span className="text-xs font-mono text-brand-dark">{loan.creditScore}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-lg border ${riskConfig[loan.riskGrade]}`}>{loan.riskGrade}</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-lg border capitalize ${statusConfig[loan.status]}`}>{loan.status}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-brand-grey whitespace-nowrap">{loan.sector}</td>
                          <td className="px-4 py-3 text-xs text-brand-grey whitespace-nowrap">{fmtNGN(loan.monthlyIncome)}/mo</td>
                          <td className="px-4 py-3 text-xs text-brand-grey whitespace-nowrap">{fmtDate(loan.appliedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Loan Detail Panel */}
              {selectedLoan && (
                <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-brand-dark">Loan Detail — {selectedLoan.id}</h3>
                    <button onClick={() => setSelectedLoan(null)} className="text-xs text-brand-grey hover:text-brand-dark">✕ Close</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {[
                      { label: 'Applicant', value: selectedLoan.applicantName },
                      { label: 'Loan Type', value: selectedLoan.loanType },
                      { label: 'Amount', value: fmtNGN(selectedLoan.amount) },
                      { label: 'Purpose', value: selectedLoan.purpose },
                      { label: 'Credit Score', value: selectedLoan.creditScore.toString() },
                      { label: 'Risk Grade', value: selectedLoan.riskGrade },
                      { label: 'Interest Rate', value: selectedLoan.interestRate > 0 ? `${selectedLoan.interestRate}% p.a.` : 'N/A' },
                      { label: 'Monthly Payment', value: selectedLoan.monthlyPayment > 0 ? fmtNGN(selectedLoan.monthlyPayment) : 'N/A' },
                    ].map(item => (
                      <div key={item.label} className="bg-surface-elevated rounded-xl p-3">
                        <p className="text-xs text-brand-grey mb-1">{item.label}</p>
                        <p className="text-sm text-brand-dark font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-surface-elevated rounded-xl p-3 mb-4">
                    <p className="text-xs text-brand-grey mb-1">Alternative Data Used</p>
                    <p className="text-xs text-brand-grey">{selectedLoan.alternativeData}</p>
                  </div>
                  <div className="flex gap-3">
                    {selectedLoan.status === 'review' && <>
                      <button onClick={() => { setActiveTab('assess'); setAssessForm(f => ({ ...f, applicationRef: selectedLoan.id, customerName: selectedLoan.applicantName, loanAmount: selectedLoan.amount.toString(), monthlyIncome: selectedLoan.monthlyIncome.toString(), loanPurpose: selectedLoan.purpose })); }} className="bg-gradient-primary text-white px-4 py-2 rounded-xl text-xs font-medium">Run AI Assessment</button>
                      <button className="bg-accent-green/10 text-accent-green border border-accent-green/20 px-4 py-2 rounded-xl text-xs font-medium hover:bg-accent-green/20 transition-colors">Approve</button>
                      <button className="bg-accent-red/10 text-accent-red border border-accent-red/20 px-4 py-2 rounded-xl text-xs font-medium hover:bg-accent-red/20 transition-colors">Decline</button>
                    </>}
                    {(selectedLoan.status === 'approved' || selectedLoan.status === 'disbursed') && <span className="text-xs text-accent-green bg-accent-green/10 border border-accent-green/20 px-4 py-2 rounded-xl">✓ Approved — {selectedLoan.interestRate}% p.a. · {selectedLoan.tenure} months</span>}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-brand-dark mb-4">Credit Score Distribution</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={scoreDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                      <XAxis dataKey="range" tick={{ fill: '#6B7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E2D45', borderRadius: '12px', color: '#fff' }} />
                      <Bar dataKey="count" fill="#0066FF" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-brand-dark mb-1">NPL Ratio Trend</h3>
                  <p className="text-xs text-brand-grey mb-4">Non-Performing Loan ratio — 12 months</p>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={nplTrend}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                      <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis domain={[1.5, 3.5]} tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v}%`} />
                      <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E2D45', borderRadius: '12px', color: '#fff' }} formatter={(v: number) => `${v}%`} />
                      <Line type="monotone" dataKey="npl" stroke="#00C896" strokeWidth={2} dot={{ fill: '#00C896' }} name="NPL Ratio" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-brand-dark mb-4">Credit Scoring Factors — Alternative Data Model</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="#1E2D45" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 11 }} />
                    <Radar name="Approved Customer" dataKey="A" stroke="#00C896" fill="#00C896" fillOpacity={0.2} />
                    <Radar name="Declined Customer" dataKey="B" stroke="#FF4D4D" fill="#FF4D4D" fillOpacity={0.1} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E2D45', borderRadius: '12px', color: '#fff' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'customers' && (
            <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-surface-border">
                <h3 className="text-sm font-semibold text-brand-dark">Customer Credit Profiles — Across All Channels</h3>
                <p className="text-xs text-brand-grey mt-0.5">Transaction history from Web Banking, Mobile App, and Mobile Money channels</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-border">
                      {['Customer', 'Segment', 'Credit Score', 'Risk Tier', 'KYC', 'Monthly Income', 'Transactions', 'Location', 'Since'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {DEMO_CUSTOMERS.map((cust) => {
                      const txCount = getCustomerTransactions(cust.id).length;
                      return (
                        <tr key={cust.id} className="hover:bg-surface-elevated transition-colors">
                          <td className="px-4 py-3">
                            <div className="text-xs text-brand-dark font-medium">{cust.name}</div>
                            <div className="text-xs text-brand-grey">{cust.id} · {cust.email}</div>
                          </td>
                          <td className="px-4 py-3"><span className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-lg">{cust.segment}</span></td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-12 bg-surface-border rounded-full h-1.5">
                                <div className="h-1.5 rounded-full" style={{ width: `${(cust.creditScore / 900) * 100}%`, backgroundColor: cust.creditScore > 700 ? '#00C896' : cust.creditScore > 600 ? '#FFB020' : '#FF4D4D' }}></div>
                              </div>
                              <span className="text-xs font-mono text-brand-dark">{cust.creditScore}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-lg border ${riskConfig[cust.riskTier]}`}>{cust.riskTier}</span></td>
                          <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-lg ${cust.kycStatus === 'verified' ? 'text-accent-green bg-accent-green/10' : cust.kycStatus === 'pending' ? 'text-accent-amber bg-accent-amber/10' : 'text-accent-red bg-accent-red/10'}`}>{cust.kycStatus}</span></td>
                          <td className="px-4 py-3 text-xs text-brand-grey whitespace-nowrap">{fmtNGN(cust.monthlyIncome)}/mo</td>
                          <td className="px-4 py-3 text-xs text-brand-grey">{txCount} txns</td>
                          <td className="px-4 py-3 text-xs text-brand-grey">{cust.location}</td>
                          <td className="px-4 py-3 text-xs text-brand-grey">{new Date(cust.since).getFullYear()}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'assess' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-brand-dark mb-1">Credit Risk Assessment</h3>
                <p className="text-xs text-brand-grey mb-4">Pre-filled with LOAN-4421 from Web Banking Portal</p>
                <div className="space-y-3">
                  {[
                    { key: 'applicationRef', label: 'Application Reference', type: 'text' },
                    { key: 'customerName', label: 'Customer Name', type: 'text' },
                    { key: 'loanAmount', label: 'Loan Amount (NGN)', type: 'number' },
                    { key: 'loanPurpose', label: 'Loan Purpose', type: 'text' },
                    { key: 'monthlyIncome', label: 'Monthly Income (NGN)', type: 'number' },
                    { key: 'existingDebts', label: 'Existing Debts (NGN)', type: 'number' },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-xs font-medium text-brand-grey mb-1">{field.label}</label>
                      <input type={field.type} value={assessForm[field.key as keyof typeof assessForm]}
                        onChange={(e) => setAssessForm(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-sm text-brand-dark outline-none focus:border-primary/50" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-xs font-medium text-brand-grey mb-1">Customer Type</label>
                    <select value={assessForm.customerType} onChange={(e) => setAssessForm(prev => ({ ...prev, customerType: e.target.value as 'individual' | 'msme' }))}
                      className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-sm text-brand-dark outline-none focus:border-primary/50">
                      <option value="individual">Individual</option>
                      <option value="msme">MSME</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-brand-grey mb-1">Alternative Data</label>
                    <textarea value={assessForm.alternativeData} onChange={(e) => setAssessForm(prev => ({ ...prev, alternativeData: e.target.value }))}
                      rows={3} className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-sm text-brand-dark outline-none focus:border-primary/50 resize-none" />
                  </div>
                  <button onClick={runCreditAssessment} disabled={isAssessing}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
                    {isAssessing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Assessing...</> : <>🧮 Run Credit Assessment</>}
                  </button>
                </div>
              </div>

              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-brand-dark mb-4">AI Credit Assessment</h3>
                {assessError && <div className="px-4 py-3 bg-accent-red/10 border border-accent-red/20 rounded-xl text-sm text-accent-red mb-4">{assessError}</div>}
                {creditResult ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border ${creditResult.decision === 'APPROVE' ? 'bg-accent-green/10 border-accent-green/30' : creditResult.decision === 'REVIEW' ? 'bg-accent-amber/10 border-accent-amber/30' : 'bg-accent-red/10 border-accent-red/30'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-lg font-bold ${creditResult.decision === 'APPROVE' ? 'text-accent-green' : creditResult.decision === 'REVIEW' ? 'text-accent-amber' : 'text-accent-red'}`}>
                          {creditResult.decision === 'APPROVE' ? '✓ APPROVED' : creditResult.decision === 'REVIEW' ? '⚠ REVIEW' : '✗ DECLINED'}
                        </span>
                        <span className="text-xs text-gray-400">Confidence: <span className="text-white font-semibold">{creditResult.confidence}%</span></span>
                      </div>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="bg-surface-elevated rounded-lg p-2">
                          <p className="text-xs text-gray-500">AI Credit Score</p>
                          <p className="text-lg font-bold text-white">{creditResult.credit_score}</p>
                        </div>
                        <div className="bg-surface-elevated rounded-lg p-2">
                          <p className="text-xs text-gray-500">Risk Grade</p>
                          <p className="text-lg font-bold text-white">{creditResult.risk_grade}</p>
                        </div>
                      </div>
                    </div>
                    {creditResult.suggested_terms && (
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: 'Interest Rate', value: creditResult.suggested_terms.interest_rate },
                          { label: 'Tenure', value: `${creditResult.suggested_terms.tenure_months} months` },
                          { label: 'Max Amount', value: creditResult.suggested_terms.max_amount ? fmtNGN(creditResult.suggested_terms.max_amount) : 'As requested' },
                        ].map(item => (
                          <div key={item.label} className="bg-surface-elevated rounded-xl p-3 text-center">
                            <p className="text-xs text-gray-500">{item.label}</p>
                            <p className="text-sm font-bold text-white mt-1">{item.value}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {creditResult.risk_factors?.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Risk Factors</p>
                        <div className="space-y-1">{creditResult.risk_factors.map((f, i) => <div key={i} className="flex items-start gap-2 text-xs text-gray-300"><span className="text-accent-amber mt-0.5">•</span>{f}</div>)}</div>
                      </div>
                    )}
                    {creditResult.analysis && <div className="p-3 bg-surface-elevated rounded-xl"><p className="text-xs text-gray-400 italic">{creditResult.analysis}</p></div>}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <div className="w-12 h-12 rounded-xl bg-surface-elevated flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    </div>
                    <p className="text-sm text-gray-500">Submit application to get AI credit assessment</p>
                    <p className="text-xs text-gray-600 mt-1">Pre-filled with LOAN-4421 from Web Banking Portal</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'model' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-brand-dark mb-4">Alternative Data Sources — African Market</h3>
                <div className="space-y-3">
                  {[
                    { source: 'Mobile Money Transactions', weight: 94, status: 'active', description: 'MTN MoMo, Airtel Money, M-Pesa patterns' },
                    { source: 'Utility Bill Payments', weight: 88, status: 'active', description: 'EKEDC, NEPA, water bill consistency' },
                    { source: 'Airtime Purchase Patterns', weight: 82, status: 'active', description: 'Frequency and amount of top-ups' },
                    { source: 'Social Capital Score', weight: 72, status: 'active', description: 'Cooperative membership, guarantors' },
                    { source: 'Business Revenue (POS)', weight: 91, status: 'active', description: 'POS terminal transaction history' },
                    { source: 'Rental Payment History', weight: 78, status: 'active', description: 'Consistent rent payment records' },
                    { source: 'Behavioral Biometrics', weight: 85, status: 'active', description: 'App usage patterns, session behavior' },
                  ].map((s) => (
                    <div key={s.source} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-brand-dark font-medium">{s.source}</span>
                          <span className="text-xs text-brand-grey">{s.weight}% weight</span>
                        </div>
                        <div className="w-full bg-surface-elevated rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-primary" style={{ width: `${s.weight}%` }}></div>
                        </div>
                        <p className="text-xs text-brand-grey mt-0.5">{s.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5 space-y-3">
                <h3 className="text-sm font-semibold text-brand-dark">Model Configuration</h3>
                {[
                  { label: 'Algorithm', value: 'XGBoost + LSTM Ensemble' },
                  { label: 'Training Data', value: '2.3M loan applications (2018–2024)' },
                  { label: 'Alternative Data Features', value: '89 non-traditional credit signals' },
                  { label: 'Traditional Features', value: '34 standard credit bureau signals' },
                  { label: 'Thin-file Coverage', value: '78% of unbanked population scored' },
                  { label: 'Bias Mitigation', value: 'Gender, age, ethnicity fairness checks' },
                  { label: 'Explainability', value: 'LIME + SHAP per decision' },
                  { label: 'Regulatory Compliance', value: 'CBN, BOG, CBK, FSCA compliant' },
                ].map((item) => (
                  <div key={item.label} className="flex items-start justify-between gap-4 py-2 border-b border-surface-border last:border-0">
                    <span className="text-xs text-brand-grey flex-shrink-0">{item.label}</span>
                    <span className="text-xs text-brand-dark text-right">{item.value}</span>
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
