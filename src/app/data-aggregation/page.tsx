'use client';
import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase/client';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface AggregationJob {
  id: string;
  job_ref: string;
  source_system: string;
  data_type: string;
  records_processed: number;
  records_failed: number;
  quality_score: number | null;
  job_status: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
}

interface AgentResult {
  quality_score?: number;
  records_valid?: number;
  records_flagged?: number;
  issues?: string[];
  cleansing_actions?: string[];
  privacy_flags?: string[];
  analysis?: string;
  recommendations?: string[];
}

const sourceSystems = [
  { id: 'core_banking', name: 'Core Banking System', icon: '🏦', records: 1240000, status: 'connected', lastSync: '2 min ago', dataTypes: ['Accounts', 'Transactions', 'Customers'] },
  { id: 'crm', name: 'CRM Platform', icon: '👥', records: 89400, status: 'connected', lastSync: '5 min ago', dataTypes: ['Contacts', 'Interactions', 'Segments'] },
  { id: 'mobile_money', name: 'Mobile Money API', icon: '📱', records: 567000, status: 'connected', lastSync: '1 min ago', dataTypes: ['Transfers', 'Airtime', 'Bills'] },
  { id: 'payment_gateway', name: 'Payment Gateway', icon: '💳', records: 234000, status: 'connected', lastSync: '3 min ago', dataTypes: ['POS', 'Online', 'USSD'] },
  { id: 'credit_bureau', name: 'Credit Bureau', icon: '📊', records: 45200, status: 'syncing', lastSync: 'Syncing...', dataTypes: ['Credit History', 'Scores', 'Defaults'] },
  { id: 'kyc_provider', name: 'KYC Provider', icon: '🔐', records: 12800, status: 'connected', lastSync: '10 min ago', dataTypes: ['Identity', 'Documents', 'Biometrics'] },
];

const dataTypes = ['Customer Profiles', 'Transaction Records', 'KYC Documents', 'Credit History', 'Mobile Money Transactions'];

const qualityTrendData = [
  { date: 'Jun 28', score: 94.2 },
  { date: 'Jun 29', score: 95.1 },
  { date: 'Jun 30', score: 94.8 },
  { date: 'Jul 1', score: 96.3 },
  { date: 'Jul 2', score: 95.9 },
  { date: 'Jul 3', score: 97.1 },
  { date: 'Jul 4', score: 96.8 },
];

const recordVolumeData = [
  { source: 'Core Banking', records: 1240 },
  { source: 'Mobile Money', records: 567 },
  { source: 'Payment GW', records: 234 },
  { source: 'CRM', records: 89 },
  { source: 'Credit Bureau', records: 45 },
  { source: 'KYC', records: 13 },
];

const governancePolicies = [
  { policy: 'Data Encryption at Rest', status: 'enforced', standard: 'AES-256' },
  { policy: 'Data Encryption in Transit', status: 'enforced', standard: 'TLS 1.3' },
  { policy: 'PII Masking', status: 'enforced', standard: 'NDPR / GDPR' },
  { policy: 'Data Retention Policy', status: 'enforced', standard: '7 years' },
  { policy: 'Access Control (RBAC)', status: 'enforced', standard: 'ISO 27001' },
  { policy: 'Audit Trail Logging', status: 'enforced', standard: 'CBN Guidelines' },
  { policy: 'Cross-border Data Transfer', status: 'review', standard: 'NDPR Art. 2.1' },
  { policy: 'Consent Management', status: 'enforced', standard: 'NDPR / GDPR' },
];

const unifiedProfileFields = [
  { field: 'Customer Identity', sources: ['Core Banking', 'KYC Provider'], completeness: 99 },
  { field: 'Transaction History', sources: ['Core Banking', 'Mobile Money', 'Payment GW'], completeness: 97 },
  { field: 'Credit Profile', sources: ['Credit Bureau', 'Core Banking'], completeness: 88 },
  { field: 'Contact Information', sources: ['CRM', 'Core Banking'], completeness: 94 },
  { field: 'Behavioral Data', sources: ['Mobile Money', 'CRM'], completeness: 82 },
  { field: 'KYC Documents', sources: ['KYC Provider'], completeness: 91 },
];

export default function DataAggregationPage() {
  const [jobs, setJobs] = useState<AggregationJob[]>([]);
  const [selectedSource, setSelectedSource] = useState(sourceSystems[0]);
  const [selectedDataType, setSelectedDataType] = useState(dataTypes[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [agentResult, setAgentResult] = useState<AgentResult | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'pipeline' | 'quality' | 'unified' | 'governance'>('pipeline');

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    const { data } = await supabase
      .from('data_aggregation_jobs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setJobs(data as AggregationJob[]);
  };

  const runAggregationAgent = async () => {
    setIsRunning(true);
    setError('');
    try {
      const res = await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentType: 'data_aggregation',
          input: {
            sourceSystem: selectedSource.name,
            dataType: selectedDataType,
            qualityThreshold: 95,
            sampleData: `${selectedSource.records.toLocaleString()} records from ${selectedSource.name}. Data includes customer identifiers, transaction timestamps, amounts, and metadata. Some records may have missing fields or format inconsistencies.`,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setAgentResult(data.result);
        await supabase.from('data_aggregation_jobs').insert({
          job_ref: `JOB-${Date.now()}`,
          source_system: selectedSource.id,
          data_type: selectedDataType,
          records_processed: data.result.records_valid || selectedSource.records,
          records_failed: data.result.records_flagged || 0,
          quality_score: data.result.quality_score || 95,
          job_status: 'completed',
          started_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        });
        fetchJobs();
        setActiveTab('quality');
      } else {
        setError(data.error || 'Aggregation failed');
      }
    } catch {
      setError('Failed to connect to Data Aggregation Agent');
    } finally {
      setIsRunning(false);
    }
  };

  const statusColor: Record<string, string> = {
    connected: 'text-accent-green bg-accent-green/10 border-accent-green/20',
    syncing: 'text-accent-amber bg-accent-amber/10 border-accent-amber/20',
    error: 'text-accent-red bg-accent-red/10 border-accent-red/20',
  };

  const jobStatusColor: Record<string, string> = {
    completed: 'text-accent-green bg-accent-green/10 border-accent-green/20',
    processing: 'text-accent-amber bg-accent-amber/10 border-accent-amber/20',
    failed: 'text-accent-red bg-accent-red/10 border-accent-red/20',
    pending: 'text-brand-grey bg-surface-elevated border-surface-border',
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Data Aggregation Agent" subtitle="Secure connectors, real-time streaming, data cleansing & unified customer profiles" />
        <main className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Source Systems Grid */}
          <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-semibold text-brand-dark">Connected Data Sources</h2>
                <p className="text-xs text-brand-grey mt-0.5">Real-time connectors to all banking data systems</p>
              </div>
              <div className="flex items-center gap-2 text-xs text-accent-green bg-accent-green/10 border border-accent-green/20 px-3 py-1.5 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse-slow"></div>
                5 of 6 Connected
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {sourceSystems.map((src) => (
                <button
                  key={src.id}
                  onClick={() => setSelectedSource(src)}
                  className={`p-3 rounded-xl border text-center transition-all ${selectedSource.id === src.id ? 'border-primary/40 bg-primary/5' : 'border-surface-border bg-surface-elevated hover:border-primary/20'}`}
                >
                  <div className="text-2xl mb-1">{src.icon}</div>
                  <div className="text-xs font-semibold text-brand-dark leading-tight mb-1">{src.name}</div>
                  <div className="text-xs text-brand-grey font-mono">{(src.records / 1000).toFixed(0)}K</div>
                  <div className={`text-xs mt-1 px-1.5 py-0.5 rounded-full border inline-block ${statusColor[src.status]}`}>{src.status}</div>
                  <div className="text-xs text-brand-grey mt-1">{src.lastSync}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Run Agent */}
          <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-48">
                <label className="block text-xs font-semibold text-brand-dark mb-1.5">Data Type to Aggregate</label>
                <select
                  value={selectedDataType}
                  onChange={(e) => setSelectedDataType(e.target.value)}
                  className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2.5 text-sm text-brand-dark outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                >
                  {dataTypes.map(dt => <option key={dt}>{dt}</option>)}
                </select>
              </div>
              <div className="flex-1 min-w-48">
                <label className="block text-xs font-semibold text-brand-dark mb-1.5">Source System</label>
                <div className="px-3 py-2.5 bg-surface-elevated border border-surface-border rounded-xl text-sm text-brand-dark">
                  {selectedSource.name}
                </div>
              </div>
              <button
                onClick={runAggregationAgent}
                disabled={isRunning}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary-light transition-colors disabled:opacity-50"
              >
                {isRunning ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Aggregating...</>
                ) : (
                  <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582 4 8 4" /></svg>Run Aggregation</>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="px-4 py-3 bg-accent-red/5 border border-accent-red/20 rounded-xl text-sm text-accent-red">{error}</div>
          )}

          {/* Tabs */}
          <div className="flex gap-1 bg-white border border-surface-border rounded-2xl p-1 shadow-card">
            {(['pipeline', 'quality', 'unified', 'governance'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 text-xs font-medium rounded-xl capitalize transition-all ${activeTab === tab ? 'bg-primary text-white shadow-sm' : 'text-brand-grey hover:text-brand-dark'}`}
              >
                {tab === 'governance' ? 'Data Governance' : tab === 'quality' ? 'Quality Report' : tab === 'unified' ? 'Unified Profiles' : 'Pipeline Jobs'}
              </button>
            ))}
          </div>

          {activeTab === 'pipeline' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-surface-border rounded-2xl overflow-hidden shadow-card">
                <div className="px-5 py-4 border-b border-surface-border">
                  <h3 className="text-sm font-semibold text-brand-dark">Recent Aggregation Jobs</h3>
                </div>
                {jobs.length > 0 ? (
                  <div className="divide-y divide-surface-border">
                    {jobs.map((job) => (
                      <div key={job.id} className="px-5 py-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-primary font-semibold">{job.job_ref}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border ${jobStatusColor[job.job_status] || jobStatusColor.pending}`}>{job.job_status}</span>
                          </div>
                          <div className="text-xs text-brand-grey mt-0.5">{job.source_system} → {job.data_type}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold text-brand-dark">{job.records_processed.toLocaleString()} records</div>
                          <div className="text-xs text-brand-grey">{job.quality_score ? `${job.quality_score}% quality` : 'Pending'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-8 text-center text-xs text-brand-grey">No jobs yet. Run the aggregation agent to start.</div>
                )}
              </div>
              <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
                <h3 className="text-sm font-semibold text-brand-dark mb-4">Record Volume by Source</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={recordVolumeData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis type="number" tick={{ fill: '#8C757D', fontSize: 10 }} tickFormatter={(v) => `${v}K`} />
                    <YAxis type="category" dataKey="source" tick={{ fill: '#8C757D', fontSize: 10 }} width={80} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#343A40' }} formatter={(v: number) => [`${v}K records`, '']} />
                    <Bar dataKey="records" fill="#1B365D" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {activeTab === 'quality' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
                <h3 className="text-sm font-semibold text-brand-dark mb-4">Quality Score Trend</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={qualityTrendData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="date" tick={{ fill: '#8C757D', fontSize: 10 }} />
                    <YAxis tick={{ fill: '#8C757D', fontSize: 10 }} domain={[90, 100]} />
                    <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', color: '#343A40' }} />
                    <Line type="monotone" dataKey="score" stroke="#1B365D" strokeWidth={2} dot={{ fill: '#1B365D', r: 4 }} name="Quality %" />
                  </LineChart>
                </ResponsiveContainer>
                {agentResult && (
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-brand-grey">Overall Quality Score</span>
                      <span className={`text-lg font-bold ${(agentResult.quality_score || 0) >= 95 ? 'text-accent-green' : 'text-accent-amber'}`}>{agentResult.quality_score || 0}%</span>
                    </div>
                    <div className="w-full bg-surface-elevated rounded-full h-2">
                      <div className="bg-accent-green h-2 rounded-full" style={{ width: `${agentResult.quality_score || 0}%` }}></div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-accent-green/5 border border-accent-green/20 rounded-xl text-center">
                        <div className="text-lg font-bold text-accent-green">{(agentResult.records_valid || 0).toLocaleString()}</div>
                        <div className="text-xs text-brand-grey">Valid Records</div>
                      </div>
                      <div className="p-3 bg-accent-amber/5 border border-accent-amber/20 rounded-xl text-center">
                        <div className="text-lg font-bold text-accent-amber">{(agentResult.records_flagged || 0).toLocaleString()}</div>
                        <div className="text-xs text-brand-grey">Flagged Records</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
                <h3 className="text-sm font-semibold text-brand-dark mb-4">Issues, Cleansing & Privacy</h3>
                {agentResult ? (
                  <div className="space-y-4">
                    {(agentResult.issues || []).length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-accent-amber mb-2">⚠ Data Issues</p>
                        <div className="space-y-1">
                          {(agentResult.issues || []).map((issue, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 bg-accent-amber/5 border border-accent-amber/20 rounded-lg">
                              <span className="text-accent-amber text-xs mt-0.5">⚠</span>
                              <span className="text-xs text-brand-dark">{issue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {(agentResult.cleansing_actions || []).length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-accent-green mb-2">✓ Cleansing Actions</p>
                        <div className="space-y-1">
                          {(agentResult.cleansing_actions || []).map((action, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 bg-accent-green/5 border border-accent-green/20 rounded-lg">
                              <span className="text-accent-green text-xs mt-0.5">✓</span>
                              <span className="text-xs text-brand-dark">{action}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {(agentResult.privacy_flags || []).length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-primary mb-2">🔐 Privacy Flags</p>
                        <div className="space-y-1">
                          {(agentResult.privacy_flags || []).map((flag, i) => (
                            <div key={i} className="flex items-start gap-2 p-2 bg-primary/5 border border-primary/20 rounded-lg">
                              <span className="text-primary text-xs mt-0.5">🔐</span>
                              <span className="text-xs text-brand-dark">{flag}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {agentResult.analysis && (
                      <p className="text-xs text-brand-grey italic p-3 bg-surface-elevated rounded-xl">{agentResult.analysis}</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-sm font-medium text-brand-dark mb-1">Run aggregation to see quality report</p>
                    <p className="text-xs text-brand-grey">Claude AI will analyze data quality and suggest cleansing actions</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'unified' && (
            <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-brand-dark">Unified Customer Profile Schema</h3>
                  <p className="text-xs text-brand-grey mt-0.5">Cross-system data synchronization and completeness</p>
                </div>
                <span className="text-xs bg-accent-green/10 text-accent-green border border-accent-green/20 px-2 py-0.5 rounded-full font-medium">92% avg completeness</span>
              </div>
              <div className="space-y-3">
                {unifiedProfileFields.map((field) => (
                  <div key={field.field} className="p-4 bg-surface-elevated rounded-xl border border-surface-border">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="text-sm font-semibold text-brand-dark">{field.field}</span>
                        <div className="flex gap-1 mt-1">
                          {field.sources.map((src) => (
                            <span key={src} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">{src}</span>
                          ))}
                        </div>
                      </div>
                      <span className={`text-sm font-bold ${field.completeness >= 95 ? 'text-accent-green' : field.completeness >= 85 ? 'text-accent-amber' : 'text-accent-red'}`}>{field.completeness}%</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all ${field.completeness >= 95 ? 'bg-accent-green' : field.completeness >= 85 ? 'bg-accent-amber' : 'bg-accent-red'}`}
                        style={{ width: `${field.completeness}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'governance' && (
            <div className="bg-white border border-surface-border rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-semibold text-brand-dark">Data Governance & Privacy Controls</h3>
                  <p className="text-xs text-brand-grey mt-0.5">NDPR, GDPR, CBN compliance enforcement</p>
                </div>
                <span className="text-xs bg-accent-green/10 text-accent-green border border-accent-green/20 px-2 py-0.5 rounded-full font-medium">7/8 Enforced</span>
              </div>
              <div className="space-y-2">
                {governancePolicies.map((policy) => (
                  <div key={policy.policy} className="flex items-center justify-between p-3 bg-surface-elevated rounded-xl border border-surface-border">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${policy.status === 'enforced' ? 'bg-accent-green' : 'bg-accent-amber'}`}></div>
                      <div>
                        <div className="text-xs font-semibold text-brand-dark">{policy.policy}</div>
                        <div className="text-xs text-brand-grey">{policy.standard}</div>
                      </div>
                    </div>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${policy.status === 'enforced' ? 'text-accent-green bg-accent-green/10 border-accent-green/20' : 'text-accent-amber bg-accent-amber/10 border-accent-amber/20'}`}>
                      {policy.status}
                    </span>
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
