'use client';
import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface AgentNode {
  id: string;
  name: string;
  status: 'online' | 'training' | 'standby' | 'error';
  health: number;
  latency: string;
  requestsPerMin: number;
  lastPing: string;
  version: string;
  color: string;
}

interface WorkflowTask {
  id: string;
  taskRef: string;
  type: string;
  initiator: string;
  agents: string[];
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: number;
  startedAt: string;
  duration: string;
  decision: string;
}

interface AgentMessage {
  id: string;
  from: string;
  to: string;
  type: 'context_share' | 'decision_request' | 'data_sync' | 'alert' | 'health_check';
  payload: string;
  timestamp: string;
  latency: string;
}

const agentNodes: AgentNode[] = [
  { id: 'conversational', name: 'Conversational', status: 'online', health: 99.8, latency: '120ms', requestsPerMin: 748, lastPing: '1s ago', version: 'v3.2.1', color: '#3B82F6' },
  { id: 'fraud', name: 'Fraud Detection', status: 'online', health: 99.9, latency: '45ms', requestsPerMin: 2140, lastPing: '0.5s ago', version: 'v4.1.0', color: '#EF4444' },
  { id: 'credit', name: 'Credit Risk', status: 'online', health: 99.7, latency: '380ms', requestsPerMin: 53, lastPing: '2s ago', version: 'v2.8.3', color: '#10B981' },
  { id: 'personalization', name: 'Personalization', status: 'online', health: 99.5, latency: '95ms', requestsPerMin: 1485, lastPing: '1s ago', version: 'v2.3.0', color: '#A855F7' },
  { id: 'predictive', name: 'Predictive Analytics', status: 'training', health: 97.2, latency: '520ms', requestsPerMin: 205, lastPing: '3s ago', version: 'v1.9.2', color: '#F59E0B' },
  { id: 'compliance', name: 'Compliance', status: 'online', health: 99.9, latency: '210ms', requestsPerMin: 145, lastPing: '1s ago', version: 'v3.0.1', color: '#6366F1' },
  { id: 'data_agg', name: 'Data Aggregation', status: 'online', health: 99.4, latency: '28ms', requestsPerMin: 5667, lastPing: '0.2s ago', version: 'v2.1.4', color: '#06B6D4' },
  { id: 'dashboard', name: 'Smart Dashboard', status: 'online', health: 96.1, latency: '75ms', requestsPerMin: 481, lastPing: '1s ago', version: 'v1.7.0', color: '#22C55E' },
];

const recentWorkflows: WorkflowTask[] = [
  { id: '1', taskRef: 'ORCH-1748921', type: 'Loan Application Processing', initiator: 'credit', agents: ['data_agg', 'credit', 'compliance', 'personalization'], status: 'completed', priority: 9, startedAt: '2m ago', duration: '1.2s', decision: 'APPROVED — Score 742, Low Risk, Terms: 18% p.a., 24 months' },
  { id: '2', taskRef: 'ORCH-1748920', type: 'Fraud + Compliance Escalation', initiator: 'fraud', agents: ['fraud', 'compliance', 'conversational'], status: 'completed', priority: 10, startedAt: '5m ago', duration: '0.8s', decision: 'BLOCKED — Account takeover detected, AML alert raised, customer notified' },
  { id: '3', taskRef: 'ORCH-1748919', type: 'Customer Onboarding', initiator: 'conversational', agents: ['conversational', 'data_agg', 'compliance', 'personalization'], status: 'completed', priority: 7, startedAt: '12m ago', duration: '2.1s', decision: 'COMPLETED — KYC verified, profile created, personalized welcome package sent' },
  { id: '4', taskRef: 'ORCH-1748918', type: 'Portfolio Risk Assessment', initiator: 'dashboard', agents: ['predictive', 'credit', 'compliance', 'dashboard'], status: 'processing', priority: 8, startedAt: '18m ago', duration: '—', decision: 'IN PROGRESS — Analyzing 3,847 loan accounts for early warning signals' },
  { id: '5', taskRef: 'ORCH-1748917', type: 'Regulatory Report Generation', initiator: 'compliance', agents: ['compliance', 'data_agg', 'dashboard'], status: 'completed', priority: 6, startedAt: '1h ago', duration: '4.3s', decision: 'SUBMITTED — CBN Monthly AML Report generated and filed automatically' },
  { id: '6', taskRef: 'ORCH-1748916', type: 'Personalized Campaign Trigger', initiator: 'personalization', agents: ['personalization', 'predictive', 'conversational'], status: 'completed', priority: 5, startedAt: '2h ago', duration: '0.9s', decision: 'SENT — 12,400 customers targeted with savings product recommendations' },
];

const agentMessages: AgentMessage[] = [
  { id: '1', from: 'Fraud Detection', to: 'Compliance', type: 'alert', payload: 'High-risk transaction FRD-8821 requires AML review — ₦450K account takeover attempt', timestamp: '2m ago', latency: '8ms' },
  { id: '2', from: 'Data Aggregation', to: 'Credit Risk', type: 'data_sync', payload: 'Customer CUST-4421 mobile money history synced — 18 months of transaction data available', timestamp: '3m ago', latency: '12ms' },
  { id: '3', from: 'Conversational', to: 'Orchestration', type: 'decision_request', payload: 'Customer requesting ₦2.5M MSME loan — route to Credit Risk + Compliance for parallel assessment', timestamp: '5m ago', latency: '5ms' },
  { id: '4', from: 'Predictive Analytics', to: 'Personalization', type: 'context_share', payload: 'Customer CUST-8812 cash flow risk detected for December — recommend emergency savings product', timestamp: '8m ago', latency: '15ms' },
  { id: '5', from: 'Orchestration', to: 'All Agents', type: 'health_check', payload: 'Scheduled health check — all agents responding within SLA thresholds', timestamp: '10m ago', latency: '2ms' },
  { id: '6', from: 'Compliance', to: 'Data Aggregation', type: 'decision_request', payload: 'AML-2241 structuring pattern — request full 90-day transaction history for Ade Enterprises', timestamp: '15m ago', latency: '9ms' },
];

const healthHistory = [
  { time: '00:00', orchestration: 100, fraud: 99.9, credit: 99.8, compliance: 100 },
  { time: '04:00', orchestration: 100, fraud: 99.9, credit: 99.7, compliance: 100 },
  { time: '08:00', orchestration: 99.9, fraud: 99.8, credit: 99.9, compliance: 99.9 },
  { time: '12:00', orchestration: 100, fraud: 100, credit: 99.6, compliance: 100 },
  { time: '16:00', orchestration: 100, fraud: 99.9, credit: 99.8, compliance: 99.8 },
  { time: '20:00', orchestration: 100, fraud: 100, credit: 99.9, compliance: 100 },
  { time: 'Now', orchestration: 100, fraud: 99.9, credit: 99.7, compliance: 99.9 },
];

const throughputData = [
  { time: '00:00', tasks: 1240 },
  { time: '04:00', tasks: 890 },
  { time: '08:00', tasks: 4200 },
  { time: '12:00', tasks: 8900 },
  { time: '16:00', tasks: 7600 },
  { time: '20:00', tasks: 6100 },
  { time: 'Now', tasks: 5400 },
];

const msgTypeStyle: Record<string, string> = {
  alert: 'bg-accent-red/10 text-accent-red border-accent-red/20',
  data_sync: 'bg-accent-cyan/10 text-accent-cyan border-accent-cyan/20',
  decision_request: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
  context_share: 'bg-accent-green/10 text-accent-green border-accent-green/20',
  health_check: 'bg-primary/10 text-primary border-primary/20',
};

const workflowStatusStyle: Record<string, string> = {
  completed: 'bg-accent-green/10 text-accent-green border-accent-green/20',
  processing: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
  failed: 'bg-accent-red/10 text-accent-red border-accent-red/20',
  pending: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
};

const agentStatusStyle: Record<string, string> = {
  online: 'bg-accent-green/10 text-accent-green border-accent-green/20',
  training: 'bg-accent-amber/10 text-accent-amber border-accent-amber/20',
  standby: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  error: 'bg-accent-red/10 text-accent-red border-accent-red/20',
};

export default function OrchestrationPage() {
  const [activeTab, setActiveTab] = useState<'topology' | 'workflows' | 'messages' | 'health'>('topology');
  const [isOrchestrating, setIsOrchestrating] = useState(false);
  const [orchestrationResult, setOrchestrationResult] = useState<Record<string, unknown> | null>(null);
  const [taskType, setTaskType] = useState('Loan Application Processing');
  const [orchestrationError, setOrchestrationError] = useState('');
  const [ticker, setTicker] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTicker(t => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const runOrchestration = async () => {
    setIsOrchestrating(true);
    setOrchestrationError('');
    setOrchestrationResult(null);
    try {
      const res = await fetch('/api/agents/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskType,
          payload: {
            description: taskType,
            context: 'Multi-agent banking workflow requiring coordination across specialized agents',
            priority: 'high',
            timestamp: new Date().toISOString(),
          },
          initiatingAgent: 'orchestration',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setOrchestrationResult(data.orchestration);
      } else {
        setOrchestrationError(data.error || 'Orchestration failed');
      }
    } catch {
      setOrchestrationError('Failed to connect to Orchestration Agent');
    } finally {
      setIsOrchestrating(false);
    }
  };

  const totalRequestsPerMin = agentNodes.reduce((s, a) => s + a.requestsPerMin, 0);
  const avgHealth = (agentNodes.reduce((s, a) => s + a.health, 0) / agentNodes.length).toFixed(1);
  const onlineCount = agentNodes.filter(a => a.status === 'online').length;

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header
          title="Orchestration Layer"
          subtitle="Inter-agent communication, context sharing, decision fusion, and workflow coordination"
        />
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* KPI Row */}
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-4">
            {[
              { label: 'Agents Online', value: `${onlineCount}/9`, color: 'text-accent-green', sub: '1 in training' },
              { label: 'Avg Health Score', value: `${avgHealth}%`, color: 'text-primary', sub: 'System-wide SLA' },
              { label: 'Requests / Min', value: totalRequestsPerMin.toLocaleString(), color: 'text-white', sub: 'All agents combined' },
              { label: 'Workflows Today', value: '645K', color: 'text-accent-cyan', sub: 'Coordinated tasks' },
              { label: 'Avg Latency', value: '12ms', color: 'text-accent-purple', sub: 'Orchestration overhead' },
            ].map((k) => (
              <div key={k.label} className="bg-surface-card border border-surface-border rounded-2xl p-4">
                <div className={`text-2xl font-bold ${k.color} mb-1`}>{k.value}</div>
                <div className="text-sm font-medium text-white">{k.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-2 flex-wrap">
            {(['topology', 'workflows', 'messages', 'health'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-gradient-primary text-white shadow-glow-blue'
                    : 'bg-surface-elevated text-gray-400 hover:text-white border border-surface-border'
                }`}
              >
                {tab === 'topology' ? '🔗 Agent Topology' : tab === 'workflows' ? '⚙ Workflow Queue' : tab === 'messages' ? '📡 Message Bus' : '❤ Health Monitor'}
              </button>
            ))}
          </div>

          {/* TOPOLOGY TAB */}
          {activeTab === 'topology' && (
            <div className="space-y-4">
              {/* Orchestration Control */}
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <div className="flex flex-wrap items-end gap-4 mb-4">
                  <div className="flex-1 min-w-64">
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Workflow Type</label>
                    <select
                      value={taskType}
                      onChange={(e) => setTaskType(e.target.value)}
                      className="w-full bg-surface-elevated border border-surface-border rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-primary/50"
                    >
                      {['Loan Application Processing', 'Fraud + Compliance Escalation', 'Customer Onboarding', 'Portfolio Risk Assessment', 'Regulatory Report Generation', 'Personalized Campaign Trigger', 'Cross-border Payment Routing', 'KYC/AML Verification'].map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={runOrchestration}
                    disabled={isOrchestrating}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-primary text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isOrchestrating ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>Orchestrating...</>
                    ) : (
                      <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>Run Orchestration</>
                    )}
                  </button>
                </div>

                {orchestrationError && (
                  <div className="px-4 py-3 bg-accent-red/10 border border-accent-red/20 rounded-xl text-sm text-accent-red mb-4">{orchestrationError}</div>
                )}

                {orchestrationResult && (
                  <div className="bg-surface-elevated rounded-xl p-4 border border-primary/20">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-5 h-5 rounded-lg bg-gradient-primary flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-white">Claude Orchestration Decision</span>
                      <span className="ml-auto text-xs text-accent-green bg-accent-green/10 border border-accent-green/20 px-2 py-0.5 rounded-full">Live</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {orchestrationResult.decision && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Decision</p>
                          <p className="text-sm text-white">{String(orchestrationResult.decision)}</p>
                        </div>
                      )}
                      {orchestrationResult.task_plan && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Task Plan</p>
                          <p className="text-sm text-gray-300">{String(orchestrationResult.task_plan)}</p>
                        </div>
                      )}
                      {Array.isArray(orchestrationResult.agent_sequence) && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Agent Sequence</p>
                          <div className="flex flex-wrap gap-1">
                            {(orchestrationResult.agent_sequence as Array<{agent?: string} | string>).map((a, i) => (
                              <span key={i} className="text-xs bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-full">
                                {typeof a === 'object' && a.agent ? a.agent : String(a)}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {orchestrationResult.estimated_time_ms && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Estimated Time</p>
                          <p className="text-sm text-accent-cyan">{String(orchestrationResult.estimated_time_ms)}ms</p>
                        </div>
                      )}
                    </div>
                    {orchestrationResult.analysis && (
                      <p className="text-xs text-gray-400 mt-3 pt-3 border-t border-surface-border">{String(orchestrationResult.analysis)}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Agent Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {agentNodes.map((agent) => (
                  <div key={agent.id} className="bg-surface-card border border-surface-border rounded-2xl p-4 hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${agent.color}20`, border: `1px solid ${agent.color}40` }}>
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: agent.color }}></div>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${agentStatusStyle[agent.status]}`}>{agent.status}</span>
                    </div>
                    <div className="text-xs font-semibold text-white mb-1">{agent.name}</div>
                    <div className="text-xs text-gray-500 mb-2">{agent.version}</div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Health</span>
                        <span className="text-xs font-mono text-accent-green">{agent.health}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Latency</span>
                        <span className="text-xs font-mono text-white">{agent.latency}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Req/min</span>
                        <span className="text-xs font-mono text-primary">{agent.requestsPerMin.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs text-gray-600">Last ping</span>
                        <span className="text-xs text-gray-500">{agent.lastPing}</span>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-surface-elevated rounded-full h-1">
                      <div className="h-1 rounded-full transition-all" style={{ width: `${agent.health}%`, backgroundColor: agent.health >= 99 ? '#00C896' : agent.health >= 95 ? '#FFB020' : '#FF4D4D' }}></div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Orchestration Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    title: 'Context Sharing & Synchronization',
                    icon: '🔄',
                    color: 'border-primary/20',
                    items: ['Shared customer context across all agents', 'Real-time state synchronization', 'Conflict-free concurrent access', 'Distributed cache with TTL management', 'Cross-agent session continuity'],
                  },
                  {
                    title: 'Decision Fusion Engine',
                    icon: '🧠',
                    color: 'border-accent-purple/20',
                    items: ['Multi-agent consensus scoring', 'Weighted confidence aggregation', 'Conflict resolution protocols', 'Explainable fusion reasoning', 'Regulatory-grade audit trail'],
                  },
                  {
                    title: 'Workflow Orchestration',
                    icon: '⚡',
                    color: 'border-accent-green/20',
                    items: ['Sequential & parallel execution', 'Dependency graph management', 'Automatic failover & retry', 'Load balancing across agents', 'SLA-aware task scheduling'],
                  },
                ].map((feature) => (
                  <div key={feature.title} className={`bg-surface-card border ${feature.color} rounded-2xl p-5`}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-lg">{feature.icon}</span>
                      <h3 className="text-sm font-semibold text-white">{feature.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {feature.items.map((item, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0"></div>
                          <span className="text-xs text-gray-400">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* WORKFLOWS TAB */}
          {activeTab === 'workflows' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Completed', value: '644,892', color: 'text-accent-green' },
                  { label: 'Processing', value: '108', color: 'text-accent-amber' },
                  { label: 'Failed', value: '12', color: 'text-accent-red' },
                  { label: 'Avg Duration', value: '1.4s', color: 'text-primary' },
                ].map((s) => (
                  <div key={s.label} className="bg-surface-card border border-surface-border rounded-2xl p-4 text-center">
                    <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Recent Workflow Tasks</h3>
                  <span className="text-xs text-accent-amber bg-accent-amber/10 px-2 py-1 rounded-lg border border-accent-amber/20">1 Processing</span>
                </div>
                <div className="divide-y divide-surface-border">
                  {recentWorkflows.map((wf) => (
                    <div key={wf.id} className="px-5 py-4">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-xs font-mono text-primary">{wf.taskRef}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${workflowStatusStyle[wf.status]}`}>{wf.status}</span>
                            <span className="text-xs text-gray-600">Priority: <span className={`font-semibold ${wf.priority >= 9 ? 'text-accent-red' : wf.priority >= 7 ? 'text-accent-amber' : 'text-gray-400'}`}>{wf.priority}/10</span></span>
                          </div>
                          <div className="text-sm font-medium text-white mt-1">{wf.type}</div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="text-xs text-gray-500">{wf.startedAt}</div>
                          <div className="text-xs text-gray-600 mt-0.5">Duration: {wf.duration}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {wf.agents.map((a) => (
                          <span key={a} className="text-xs bg-surface-elevated border border-surface-border text-gray-400 px-2 py-0.5 rounded-full">{a.replace('_', ' ')}</span>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 italic">{wf.decision}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Throughput Chart */}
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Workflow Throughput — Today</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={throughputData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                    <XAxis dataKey="time" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E2D45', borderRadius: '12px', color: '#fff' }} />
                    <Bar dataKey="tasks" fill="#0066FF" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { type: 'alert', label: 'Alerts', count: 24, color: 'text-accent-red' },
                  { type: 'data_sync', label: 'Data Sync', count: 1840, color: 'text-accent-cyan' },
                  { type: 'decision_request', label: 'Decision Req.', count: 312, color: 'text-accent-amber' },
                  { type: 'context_share', label: 'Context Share', count: 5621, color: 'text-accent-green' },
                  { type: 'health_check', label: 'Health Checks', count: 288, color: 'text-primary' },
                ].map((m) => (
                  <div key={m.type} className="bg-surface-card border border-surface-border rounded-2xl p-4 text-center">
                    <div className={`text-xl font-bold ${m.color}`}>{m.count.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 mt-1">{m.label}</div>
                  </div>
                ))}
              </div>

              <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-surface-border flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Inter-Agent Message Bus</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-accent-green animate-pulse-slow"></div>
                    <span className="text-xs text-gray-500">Live stream</span>
                  </div>
                </div>
                <div className="divide-y divide-surface-border">
                  {agentMessages.map((msg) => (
                    <div key={msg.id} className="px-5 py-4">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <span className="text-xs font-medium text-white">{msg.from}</span>
                        <svg className="w-3 h-3 text-gray-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                        <span className="text-xs font-medium text-white">{msg.to}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${msgTypeStyle[msg.type]}`}>{msg.type.replace('_', ' ')}</span>
                        <span className="ml-auto text-xs text-gray-600">{msg.timestamp}</span>
                        <span className="text-xs text-accent-cyan font-mono">{msg.latency}</span>
                      </div>
                      <p className="text-xs text-gray-400">{msg.payload}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orchestration Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-4">Orchestration Benefits</h3>
                  <div className="space-y-3">
                    {[
                      { benefit: 'Seamless agent integration', metric: '100% API compatibility', icon: '🔗' },
                      { benefit: 'Fault tolerance & recovery', metric: '99.99% uptime SLA', icon: '🛡' },
                      { benefit: 'Load balancing efficiency', metric: '40% latency reduction', icon: '⚖' },
                      { benefit: 'Comprehensive audit trails', metric: '100% decision traceability', icon: '📋' },
                      { benefit: 'Security context propagation', metric: 'Zero-trust enforcement', icon: '🔐' },
                      { benefit: 'Distributed transaction mgmt', metric: 'ACID compliance', icon: '⚡' },
                    ].map((b) => (
                      <div key={b.benefit} className="flex items-center gap-3 py-2 border-b border-surface-border last:border-0">
                        <span className="text-base">{b.icon}</span>
                        <div className="flex-1">
                          <div className="text-xs font-medium text-white">{b.benefit}</div>
                          <div className="text-xs text-gray-500">{b.metric}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-4">Fallback & Degradation</h3>
                  <div className="space-y-3">
                    {[
                      { scenario: 'Agent timeout', action: 'Auto-retry with exponential backoff (3x)', status: 'active' },
                      { scenario: 'Agent failure', action: 'Failover to standby replica', status: 'active' },
                      { scenario: 'Partial data', action: 'Graceful degradation with cached context', status: 'active' },
                      { scenario: 'High load', action: 'Queue overflow to secondary cluster', status: 'active' },
                      { scenario: 'Network partition', action: 'Local decision cache activation', status: 'standby' },
                      { scenario: 'Model drift detected', action: 'Automatic retraining trigger', status: 'active' },
                    ].map((f) => (
                      <div key={f.scenario} className="flex items-start gap-3 py-2 border-b border-surface-border last:border-0">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${f.status === 'active' ? 'bg-accent-green' : 'bg-accent-amber'}`}></div>
                        <div>
                          <div className="text-xs font-medium text-white">{f.scenario}</div>
                          <div className="text-xs text-gray-500">{f.action}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HEALTH TAB */}
          {activeTab === 'health' && (
            <div className="space-y-4">
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Agent Health History — Today</h3>
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={healthHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                    <XAxis dataKey="time" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[96, 100]} tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                    <Tooltip contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E2D45', borderRadius: '12px', color: '#fff' }} formatter={(v: number) => [`${v}%`, '']} />
                    <Line type="monotone" dataKey="orchestration" stroke="#0066FF" strokeWidth={2} dot={false} name="Orchestration" />
                    <Line type="monotone" dataKey="fraud" stroke="#EF4444" strokeWidth={2} dot={false} name="Fraud" />
                    <Line type="monotone" dataKey="credit" stroke="#10B981" strokeWidth={2} dot={false} name="Credit" />
                    <Line type="monotone" dataKey="compliance" stroke="#6366F1" strokeWidth={2} dot={false} name="Compliance" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-surface-border">
                  <h3 className="text-sm font-semibold text-white">Agent Health Status</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-surface-border">
                        {['Agent', 'Status', 'Health', 'Latency', 'Req/min', 'Version', 'Last Ping'].map((h) => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                      {agentNodes.map((agent) => (
                        <tr key={agent.id} className="hover:bg-surface-elevated transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: agent.color }}></div>
                              <span className="text-xs font-medium text-white whitespace-nowrap">{agent.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs px-2 py-0.5 rounded-full border capitalize ${agentStatusStyle[agent.status]}`}>{agent.status}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-surface-border rounded-full h-1.5">
                                <div className="h-1.5 rounded-full" style={{ width: `${agent.health}%`, backgroundColor: agent.health >= 99 ? '#00C896' : '#FFB020' }}></div>
                              </div>
                              <span className="text-xs font-mono text-white">{agent.health}%</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-xs font-mono text-white">{agent.latency}</td>
                          <td className="px-4 py-3 text-xs font-mono text-primary">{agent.requestsPerMin.toLocaleString()}</td>
                          <td className="px-4 py-3 text-xs text-gray-400 font-mono">{agent.version}</td>
                          <td className="px-4 py-3 text-xs text-gray-500">{agent.lastPing}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SLA Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-4">SLA Performance</h3>
                  <div className="space-y-3">
                    {[
                      { metric: 'System Uptime (30d)', value: 99.97, target: 99.9 },
                      { metric: 'P95 Response Time', value: 92, target: 100, label: '< 500ms' },
                      { metric: 'Error Rate', value: 99.8, target: 99.5, label: '< 0.2%' },
                      { metric: 'Throughput SLA', value: 98.4, target: 95, label: '> 500K req/day' },
                    ].map((s) => (
                      <div key={s.metric}>
                        <div className="flex justify-between mb-1">
                          <span className="text-xs text-gray-400">{s.metric}</span>
                          <span className={`text-xs font-semibold ${s.value >= s.target ? 'text-accent-green' : 'text-accent-red'}`}>{s.label || `${s.value}%`}</span>
                        </div>
                        <div className="w-full bg-surface-elevated rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-accent-green" style={{ width: `${Math.min(s.value, 100)}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-white mb-4">Infrastructure</h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Deployment Model', value: 'On-premise / Private Cloud' },
                      { label: 'Agent Isolation', value: 'Containerized microservices' },
                      { label: 'Scaling', value: 'Independent horizontal scaling' },
                      { label: 'Security', value: 'Zero-trust, E2E encryption' },
                      { label: 'Compliance', value: 'GDPR, CBN, FATF, Basel III' },
                      { label: 'Monitoring', value: 'Real-time telemetry + alerting' },
                      { label: 'Backup', value: 'Multi-region replication' },
                      { label: 'Audit', value: 'Immutable decision logs' },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between py-1.5 border-b border-surface-border last:border-0">
                        <span className="text-xs text-gray-500">{item.label}</span>
                        <span className="text-xs text-white text-right">{item.value}</span>
                      </div>
                    ))}
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
