'use client';
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  DEMO_AML_ALERTS, DEMO_TRANSACTIONS, DEMO_CUSTOMERS,
  getCustomerById, fmtNGN, fmtDate,
} from '@/lib/demo/bankingData';

const complianceFrameworks = [
  { name: 'CBN AML/CFT', status: 'compliant', score: 98.4, lastAudit: '2024-11-15', nextDue: '2025-02-15', region: 'Nigeria' },
  { name: 'FATF Recommendations', status: 'compliant', score: 96.2, lastAudit: '2024-10-20', nextDue: '2025-01-20', region: 'Global' },
  { name: 'GDPR', status: 'compliant', score: 94.8, lastAudit: '2024-09-10', nextDue: '2025-03-10', region: 'EU' },
  { name: 'PCI DSS v4.0', status: 'review', score: 87.3, lastAudit: '2024-11-01', nextDue: '2025-01-05', region: 'Global' },
  { name: 'Basel III', status: 'compliant', score: 99.1, lastAudit: '2024-10-30', nextDue: '2025-04-30', region: 'Global' },
  { name: 'IFRS 9', status: 'compliant', score: 97.6, lastAudit: '2024-11-10', nextDue: '2025-05-10', region: 'Global' },
  { name: 'Ghana BOG', status: 'compliant', score: 95.3, lastAudit: '2024-10-15', nextDue: '2025-01-15', region: 'Ghana' },
  { name: 'Kenya CBK', status: 'review', score: 89.7, lastAudit: '2024-09-25', nextDue: '2025-01-10', region: 'Kenya' },
  { name: 'GIABA', status: 'compliant', score: 96.8, lastAudit: '2024-11-05', nextDue: '2025-02-05', region: 'W. Africa' },
  { name: 'South Africa FSCA', status: 'compliant', score: 93.4, lastAudit: '2024-10-01', nextDue: '2025-04-01', region: 'S. Africa' },
];

const reportingData = [
  { month: 'Jul', submitted: 24, pending: 2, overdue: 0 },
  { month: 'Aug', submitted: 28, pending: 1, overdue: 0 },
  { month: 'Sep', submitted: 31, pending: 3, overdue: 1 },
  { month: 'Oct', submitted: 26, pending: 2, overdue: 0 },
  { month: 'Nov', submitted: 29, pending: 4, overdue: 0 },
  { month: 'Dec', submitted: 22, pending: 6, overdue: 0 },
];

const kycStats = [
  { label: 'KYC Verified', value: '2,847,291', pct: 94.2, color: '#00C896' },
  { label: 'Pending Verification', value: '142,830', pct: 4.7, color: '#FFB020' },
  { label: 'Failed KYC', value: '32,140', pct: 1.1, color: '#FF4D4D' },
];

const regulatoryChanges = [
  { regulation: 'CBN Circular 2024/12', impact: 'High', status: 'mapped', deadline: 'Mar 2025', description: 'Enhanced due diligence for high-risk customers' },
  { regulation: 'FATF Guidance Update', impact: 'Medium', status: 'in_progress', deadline: 'Feb 2025', description: 'Virtual asset service provider requirements' },
  { regulation: 'GDPR Amendment', impact: 'Low', status: 'mapped', deadline: 'Jun 2025', description: 'AI decision-making transparency requirements' },
  { regulation: 'Basel IV Transition', impact: 'High', status: 'planning', deadline: 'Jan 2026', description: 'Credit risk capital requirement changes' },
];

const statusStyle: Record<string, string> = {
  investigating: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
  cleared: 'bg-accent-green/10 text-accent-green border-accent-green/20',
  escalated: 'bg-accent-red/10 text-accent-red border-accent-red/20',
  blocked: 'bg-accent-red/10 text-accent-red border-accent-red/20',
  reported: 'bg-primary/10 text-primary border-primary/20',
};

const riskStyle: Record<string, string> = {
  Critical: 'text-accent-red font-bold',
  High: 'text-accent-red',
  Medium: 'text-accent-amber',
  Low: 'text-accent-green',
};

const changeStatusStyle: Record<string, string> = {
  mapped: 'bg-accent-green/10 text-accent-green border-accent-green/20',
  in_progress: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
  planning: 'bg-primary/10 text-primary border-primary/20',
};

interface ComplianceCheckResult {
  compliance_status: string;
  risk_level: string;
  findings: string[];
  violations: string[];
  remediation_actions: string[];
  report_summary: string;
  confidence: number;
}

export default function CompliancePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'aml' | 'transactions' | 'reporting' | 'regulatory' | 'assess'>('overview');
  const [isAssessing, setIsAssessing] = useState(false);
  const [assessmentResult, setAssessmentResult] = useState<ComplianceCheckResult | null>(null);
  const [assessError, setAssessError] = useState('');
  const [selectedAlert, setSelectedAlert] = useState<typeof DEMO_AML_ALERTS[0] | null>(null);
  const [assessForm, setAssessForm] = useState({
    framework: 'CBN AML/CFT',
    period: 'Q4 2024',
    scope: 'Full compliance assessment including AML/KYC, transaction monitoring, and regulatory reporting',
  });

  const compliantCount = complianceFrameworks.filter(f => f.status === 'compliant').length;
  const reviewCount = complianceFrameworks.filter(f => f.status === 'review').length;

  // AML transactions from shared data
  const amlTransactions = DEMO_TRANSACTIONS.filter(t => t.amlFlag);
  const criticalAlerts = DEMO_AML_ALERTS.filter(a => a.riskLevel === 'Critical' || a.riskLevel === 'High');

  const runComplianceAssessment = async () => {
    setIsAssessing(true);
    setAssessError('');
    setAssessmentResult(null);
    try {
      const res = await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: 'compliance_reporting',
          input: {
            framework: assessForm.framework,
            period: assessForm.period,
            scope: assessForm.scope,
            currentStatus: complianceFrameworks.find(f => f.name === assessForm.framework),
            recentAlerts: DEMO_AML_ALERTS.slice(0, 3).map(a => ({ id: a.id, type: a.alertType, customer: a.customerName, amount: fmtNGN(a.amount, a.currency), risk: a.riskLevel, status: a.status })),
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAssessmentResult(data.result as ComplianceCheckResult);
      } else {
        setAssessError(data.error || 'Assessment failed');
      }
    } catch {
      setAssessError('Failed to connect to Compliance Agent');
    } finally {
      setIsAssessing(false);
    }
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Compliance & Regulatory Agent" subtitle="AML/KYC monitoring, regulatory reporting & real-time compliance across African markets" />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* KPIs */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: 'Compliant Frameworks', value: `${compliantCount}/${complianceFrameworks.length}`, sub: 'Regulatory frameworks', color: 'text-accent-green' },
              { label: 'AML Alerts', value: DEMO_AML_ALERTS.length, sub: `${criticalAlerts.length} critical/high`, color: 'text-accent-red' },
              { label: 'AML Transactions', value: amlTransactions.length, sub: 'Flagged for review', color: 'text-accent-amber' },
              { label: 'Under Review', value: reviewCount, sub: 'Frameworks needing attention', color: 'text-accent-amber' },
            ].map((kpi) => (
              <div key={kpi.label} className="bg-surface-card border border-surface-border rounded-2xl p-4">
                <div className={`text-2xl font-bold ${kpi.color} mb-1`}>{kpi.value}</div>
                <div className="text-sm font-medium text-white">{kpi.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {(['overview', 'aml', 'transactions', 'reporting', 'regulatory', 'assess'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${activeTab === tab ? 'bg-gradient-primary text-white shadow-glow-blue' : 'bg-surface-elevated text-gray-400 hover:text-white border border-surface-border'}`}>
                {tab === 'overview' ? 'Compliance Overview' : tab === 'aml' ? `AML Alerts (${DEMO_AML_ALERTS.length})` : tab === 'transactions' ? `AML Transactions (${amlTransactions.length})` : tab === 'reporting' ? 'Regulatory Reporting' : tab === 'regulatory' ? 'Regulatory Changes' : '🔍 Assess'}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-4">
              {/* KYC Stats */}
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">KYC Status — Customer Base</h3>
                <div className="grid grid-cols-3 gap-4">
                  {kycStats.map((stat) => (
                    <div key={stat.label} className="text-center">
                      <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                      <div className="text-xs text-gray-400 mb-2">{stat.label}</div>
                      <div className="w-full bg-surface-elevated rounded-full h-2">
                        <div className="h-2 rounded-full" style={{ width: `${stat.pct}%`, backgroundColor: stat.color }}></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{stat.pct}%</div>
                    </div>
                  ))}
                </div>
                {/* Demo customers KYC */}
                <div className="mt-4 pt-4 border-t border-surface-border">
                  <p className="text-xs text-gray-500 mb-3">Demo Customer KYC Status</p>
                  <div className="flex flex-wrap gap-2">
                    {DEMO_CUSTOMERS.map(c => (
                      <div key={c.id} className={`text-xs px-2 py-1 rounded-lg border ${c.kycStatus === 'verified' ? 'bg-accent-green/10 text-accent-green border-accent-green/20' : c.kycStatus === 'pending' ? 'bg-accent-amber/10 text-accent-amber border-accent-amber/20' : 'bg-accent-red/10 text-accent-red border-accent-red/20'}`}>
                        {c.name.split(' ')[0]} — {c.kycStatus}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Compliance Frameworks */}
              <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-surface-border">
                  <h3 className="text-sm font-semibold text-white">Regulatory Framework Compliance</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-border">
                        {['Framework', 'Region', 'Score', 'Status', 'Last Audit', 'Next Due'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {complianceFrameworks.map((f) => (
                        <tr key={f.name} className="hover:bg-surface-elevated transition-colors">
                          <td className="px-4 py-3 text-xs font-medium text-white">{f.name}</td>
                          <td className="px-4 py-3 text-xs text-gray-400">{f.region}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-surface-border rounded-full h-1.5">
                                <div className="h-1.5 rounded-full" style={{ width: `${f.score}%`, backgroundColor: f.score > 95 ? '#00C896' : f.score > 90 ? '#FFB020' : '#FF4D4D' }}></div>
                              </div>
                              <span className="text-xs font-mono text-white">{f.score}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-lg border ${f.status === 'compliant' ? 'bg-accent-green/10 text-accent-green border-accent-green/20' : 'bg-accent-amber/10 text-accent-amber border-accent-amber/20'}`}>{f.status}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500">{f.lastAudit}</td>
                          <td className="px-4 py-3 text-xs text-gray-400">{f.nextDue}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'aml' && (
            <div className="space-y-4">
              <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">AML Alerts — From Banking Channels</h3>
                  <span className="text-xs text-gray-500">Sources: Web Banking · Mobile Money · Branch · Internet Banking</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-border">
                        {['Alert ID', 'Customer', 'Alert Type', 'Amount', 'Risk Level', 'Status', 'Jurisdiction', 'Detected', 'Related Txns'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {DEMO_AML_ALERTS.map((alert) => {
                        const customer = getCustomerById(alert.customerId);
                        return (
                          <tr key={alert.id} onClick={() => setSelectedAlert(alert)} className="hover:bg-surface-elevated transition-colors cursor-pointer">
                            <td className="px-4 py-3 text-xs font-mono text-primary">{alert.id}</td>
                            <td className="px-4 py-3">
                              <div className="text-xs text-white font-medium">{alert.customerName}</div>
                              <div className="text-xs text-gray-500">{alert.customerId} · {customer?.segment}</div>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-300 whitespace-nowrap">{alert.alertType}</td>
                            <td className="px-4 py-3 text-xs font-medium text-white whitespace-nowrap">{fmtNGN(alert.amount, alert.currency)}</td>
                            <td className="px-4 py-3">
                              <span className={`text-xs font-medium ${riskStyle[alert.riskLevel]}`}>{alert.riskLevel}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-xs px-2 py-0.5 rounded-lg border capitalize ${statusStyle[alert.status]}`}>{alert.status}</span>
                            </td>
                            <td className="px-4 py-3 text-xs text-gray-400">{alert.jurisdiction}</td>
                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(alert.detectedAt)}</td>
                            <td className="px-4 py-3 text-xs text-gray-400">{alert.relatedTransactionIds.join(', ')}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Alert Detail */}
              {selectedAlert && (
                <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-white">Alert Detail — {selectedAlert.id}</h3>
                    <button onClick={() => setSelectedAlert(null)} className="text-xs text-gray-500 hover:text-white">✕ Close</button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {[
                      { label: 'Customer', value: selectedAlert.customerName },
                      { label: 'Alert Type', value: selectedAlert.alertType },
                      { label: 'Amount', value: fmtNGN(selectedAlert.amount, selectedAlert.currency) },
                      { label: 'Risk Level', value: selectedAlert.riskLevel },
                      { label: 'Status', value: selectedAlert.status },
                      { label: 'Jurisdiction', value: selectedAlert.jurisdiction },
                      { label: 'Detected', value: fmtDate(selectedAlert.detectedAt) },
                      { label: 'Related Txns', value: selectedAlert.relatedTransactionIds.join(', ') },
                    ].map(item => (
                      <div key={item.label} className="bg-surface-elevated rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                        <p className="text-sm text-white font-medium">{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    <button className="bg-accent-red/10 text-accent-red border border-accent-red/20 px-4 py-2 rounded-xl text-xs font-medium hover:bg-accent-red/20 transition-colors">File STR</button>
                    <button className="bg-accent-amber/10 text-accent-amber border border-accent-amber/20 px-4 py-2 rounded-xl text-xs font-medium hover:bg-accent-amber/20 transition-colors">Escalate</button>
                    <button className="bg-accent-green/10 text-accent-green border border-accent-green/20 px-4 py-2 rounded-xl text-xs font-medium hover:bg-accent-green/20 transition-colors">Clear Alert</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-surface-border">
                <h3 className="text-sm font-semibold text-white">AML-Flagged Transactions — All Channels</h3>
                <p className="text-xs text-gray-500 mt-0.5">{amlTransactions.length} transactions flagged for AML review across Web Banking, Mobile Money, Branch, and Internet Banking</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-surface-border">
                      {['Txn ID', 'Customer', 'Description', 'Amount', 'Channel', 'Location', 'Risk Score', 'Status', 'Date'].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-border">
                    {amlTransactions.map((tx) => {
                      const customer = getCustomerById(tx.customerId);
                      return (
                        <tr key={tx.id} className="hover:bg-surface-elevated transition-colors">
                          <td className="px-4 py-3 text-xs font-mono text-primary">{tx.id}</td>
                          <td className="px-4 py-3">
                            <div className="text-xs text-white font-medium">{customer?.name}</div>
                            <div className="text-xs text-gray-500">{tx.customerId}</div>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-300 max-w-xs truncate">{tx.description}</td>
                          <td className="px-4 py-3 text-xs font-medium text-white whitespace-nowrap">{fmtNGN(tx.amount)}</td>
                          <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{tx.channel}</td>
                          <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">{tx.location}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-bold ${tx.fraudRiskScore > 70 ? 'text-accent-red' : tx.fraudRiskScore > 50 ? 'text-accent-amber' : 'text-accent-green'}`}>{tx.fraudRiskScore}/100</span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-lg border capitalize ${statusStyle[tx.status] || 'text-gray-400 border-gray-700'}`}>{tx.status}</span>
                          </td>
                          <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{fmtDate(tx.createdAt)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reporting' && (
            <div className="space-y-4">
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Monthly Regulatory Reporting</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={reportingData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                    <XAxis dataKey="month" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E2D45', borderRadius: '12px', color: '#fff' }} />
                    <Bar dataKey="submitted" fill="#00C896" radius={[4, 4, 0, 0]} name="Submitted" />
                    <Bar dataKey="pending" fill="#FFB020" radius={[4, 4, 0, 0]} name="Pending" />
                    <Bar dataKey="overdue" fill="#FF4D4D" radius={[4, 4, 0, 0]} name="Overdue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'regulatory' && (
            <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-surface-border">
                <h3 className="text-sm font-semibold text-white">Upcoming Regulatory Changes</h3>
              </div>
              <div className="divide-y divide-surface-border">
                {regulatoryChanges.map((change) => (
                  <div key={change.regulation} className="px-5 py-4 flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-white">{change.regulation}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-lg border ${changeStatusStyle[change.status]}`}>{change.status.replace('_', ' ')}</span>
                      </div>
                      <p className="text-xs text-gray-400">{change.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className={`text-xs font-medium ${change.impact === 'High' ? 'text-accent-red' : change.impact === 'Medium' ? 'text-accent-amber' : 'text-accent-green'}`}>{change.impact} Impact</div>
                      <div className="text-xs text-gray-500 mt-0.5">Due: {change.deadline}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'assess' && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-1">Compliance Assessment</h3>
                <p className="text-xs text-gray-500 mb-4">Powered by SmartBankAI Engine · Uses live AML alerts from banking channels</p>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Framework</label>
                    <select value={assessForm.framework} onChange={(e) => setAssessForm(prev => ({ ...prev, framework: e.target.value }))}
                      className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-primary/50">
                      {complianceFrameworks.map(f => <option key={f.name}>{f.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Assessment Period</label>
                    <input value={assessForm.period} onChange={(e) => setAssessForm(prev => ({ ...prev, period: e.target.value }))}
                      className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-primary/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1">Scope</label>
                    <textarea value={assessForm.scope} onChange={(e) => setAssessForm(prev => ({ ...prev, scope: e.target.value }))}
                      rows={3} className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 text-sm text-white outline-none focus:border-primary/50 resize-none" />
                  </div>
                  <div className="bg-surface-elevated rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-2">Live AML Context (from banking channels)</p>
                    <div className="space-y-1">
                      {DEMO_AML_ALERTS.slice(0, 3).map(a => (
                        <div key={a.id} className="text-xs text-gray-400">{a.id}: {a.alertType} — {a.customerName} ({a.riskLevel})</div>
                      ))}
                    </div>
                  </div>
                  <button onClick={runComplianceAssessment} disabled={isAssessing}
                    className="w-full flex items-center justify-center gap-2 py-2.5 bg-gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50">
                    {isAssessing ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Assessing...</> : <>🔍 Run Compliance Assessment</>}
                  </button>
                </div>
              </div>

              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">AI Compliance Report</h3>
                {assessError && <div className="px-4 py-3 bg-accent-red/10 border border-accent-red/20 rounded-xl text-sm text-accent-red mb-4">{assessError}</div>}
                {assessmentResult ? (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border ${assessmentResult.compliance_status === 'COMPLIANT' ? 'bg-accent-green/10 border-accent-green/30' : assessmentResult.compliance_status === 'PARTIAL' ? 'bg-accent-amber/10 border-accent-amber/30' : 'bg-accent-red/10 border-accent-red/30'}`}>
                      <div className="flex items-center justify-between">
                        <span className={`text-lg font-bold ${assessmentResult.compliance_status === 'COMPLIANT' ? 'text-accent-green' : assessmentResult.compliance_status === 'PARTIAL' ? 'text-accent-amber' : 'text-accent-red'}`}>
                          {assessmentResult.compliance_status}
                        </span>
                        <div className="text-right">
                          <div className="text-xs text-gray-400">Risk Level: <span className={`font-semibold ${riskStyle[assessmentResult.risk_level] || 'text-white'}`}>{assessmentResult.risk_level}</span></div>
                          <div className="text-xs text-gray-400">Confidence: <span className="text-white font-semibold">{assessmentResult.confidence}%</span></div>
                        </div>
                      </div>
                    </div>
                    {assessmentResult.findings?.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Findings</p>
                        <div className="space-y-1">{assessmentResult.findings.map((f, i) => <div key={i} className="flex items-start gap-2 text-xs text-gray-300"><span className="text-primary mt-0.5">•</span>{f}</div>)}</div>
                      </div>
                    )}
                    {assessmentResult.violations?.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Violations</p>
                        <div className="space-y-1">{assessmentResult.violations.map((v, i) => <div key={i} className="flex items-start gap-2 text-xs text-gray-300"><span className="text-accent-red mt-0.5">!</span>{v}</div>)}</div>
                      </div>
                    )}
                    {assessmentResult.remediation_actions?.length > 0 && (
                      <div>
                        <p className="text-xs text-gray-500 mb-2">Remediation Actions</p>
                        <div className="space-y-1">{assessmentResult.remediation_actions.map((a, i) => <div key={i} className="flex items-start gap-2 text-xs text-gray-300"><span className="text-accent-green mt-0.5">→</span>{a}</div>)}</div>
                      </div>
                    )}
                    {assessmentResult.report_summary && <div className="p-3 bg-surface-elevated rounded-xl"><p className="text-xs text-gray-400 italic">{assessmentResult.report_summary}</p></div>}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <div className="w-12 h-12 rounded-xl bg-surface-elevated flex items-center justify-center mb-3">
                      <svg className="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                    </div>
                    <p className="text-sm text-gray-500">Run assessment to get AI compliance report</p>
                    <p className="text-xs text-gray-600 mt-1">Uses live AML alerts from banking channels</p>
                  </div>
                )}
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
