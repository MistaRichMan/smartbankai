'use client';
import React from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import AuthGuard from '@/components/AuthGuard';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const transactionData = [
  { time: '00:00', volume: 2400, fraud: 12, approved: 2388 },
  { time: '04:00', volume: 1800, fraud: 8, approved: 1792 },
  { time: '08:00', volume: 5200, fraud: 24, approved: 5176 },
  { time: '12:00', volume: 8900, fraud: 31, approved: 8869 },
  { time: '16:00', volume: 7600, fraud: 28, approved: 7572 },
  { time: '20:00', volume: 6100, fraud: 19, approved: 6081 },
  { time: '23:59', volume: 4300, fraud: 15, approved: 4285 },
];

const agentPerformance = [
  { name: 'Conversational', uptime: 99.8, requests: 45200 },
  { name: 'Fraud Detection', uptime: 99.9, requests: 128400 },
  { name: 'Credit Risk', uptime: 99.7, requests: 3200 },
  { name: 'Personalization', uptime: 99.5, requests: 89100 },
  { name: 'Predictive', uptime: 99.6, requests: 12300 },
  { name: 'Compliance', uptime: 99.9, requests: 8700 },
];

const riskDistribution = [
  { name: 'Low Risk', value: 68, color: '#00C896' },
  { name: 'Medium Risk', value: 24, color: '#FFB020' },
  { name: 'High Risk', value: 8, color: '#FF4D4D' },
];

const recentAlerts = [
  { id: 'TXN-9821', type: 'Fraud Alert', desc: 'Unusual cross-border transfer pattern detected', severity: 'high', time: '2m ago', agent: 'Fraud Detection' },
  { id: 'LOAN-4421', type: 'Credit Review', desc: 'MSME loan application requires manual review', severity: 'medium', time: '8m ago', agent: 'Credit Risk' },
  { id: 'COMP-112', type: 'Compliance', desc: 'AML report submission deadline approaching', severity: 'medium', time: '1h ago', agent: 'Compliance' },
  { id: 'SYS-003', type: 'System', desc: 'Fraud model retrained with 99.2% accuracy', severity: 'low', time: '2h ago', agent: 'Orchestration' },
  { id: 'TXN-9819', type: 'Fraud Alert', desc: 'Biometric mismatch on mobile transaction', severity: 'high', time: '3h ago', agent: 'Fraud Detection' },
];

const kpiCards = [
  {
    label: 'Transactions Today',
    value: '1.24M',
    change: '+12.4%',
    positive: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-primary/20',
  },
  {
    label: 'Fraud Blocked',
    value: '₦48.2M',
    change: '-8.1% fraud rate',
    positive: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: 'text-accent-green',
    bg: 'bg-accent-green/10',
    border: 'border-accent-green/20',
  },
  {
    label: 'Loans Processed',
    value: '3,847',
    change: '+23.6%',
    positive: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: 'text-accent-cyan',
    bg: 'bg-accent-cyan/10',
    border: 'border-accent-cyan/20',
  },
  {
    label: 'AI Accuracy',
    value: '99.2%',
    change: '+0.3% this week',
    positive: true,
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2h-2" />
      </svg>
    ),
    color: 'text-accent-purple',
    bg: 'bg-accent-purple/10',
    border: 'border-accent-purple/20',
  },
];

const severityConfig: Record<string, { label: string; className: string }> = {
  high: { label: 'HIGH', className: 'bg-accent-red/10 text-accent-red border border-accent-red/20' },
  medium: { label: 'MED', className: 'bg-accent-amber/10 text-accent-amber border border-accent-amber/20' },
  low: { label: 'LOW', className: 'bg-accent-green/10 text-accent-green border border-accent-green/20' },
};

export default function CommandCenterPage() {
  return (
    <AuthGuard>
      <div className="flex h-screen bg-surface overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <Header
            title="Command Center"
            subtitle="Real-time overview of all AI agents and banking operations"
          />
          <main className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {kpiCards.map((card) => (
                <div key={card.label} className={`bg-surface-card border ${card.border} rounded-2xl p-5 hover:shadow-card-hover transition-all duration-300`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-11 h-11 rounded-xl ${card.bg} flex items-center justify-center ${card.color}`}>
                      {card.icon}
                    </div>
                    <span className={`text-xs font-medium px-2 py-1 rounded-lg ${card.positive ? 'bg-accent-green/10 text-accent-green' : 'bg-accent-red/10 text-accent-red'}`}>
                      {card.change}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">{card.value}</div>
                  <div className="text-sm text-gray-500">{card.label}</div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {/* Transaction Volume */}
              <div className="xl:col-span-2 bg-surface-card border border-surface-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Transaction Volume</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Real-time monitoring across all channels</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary inline-block"></span>Approved</span>
                    <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent-red inline-block"></span>Flagged</span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={transactionData}>
                    <defs>
                      <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#0066FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorFraud" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FF4D4D" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#FF4D4D" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E2D45" />
                    <XAxis dataKey="time" tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#6B7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E2D45', borderRadius: '12px', color: '#fff' }}
                      labelStyle={{ color: '#9CA3AF' }}
                    />
                    <Area type="monotone" dataKey="approved" stroke="#0066FF" strokeWidth={2} fill="url(#colorApproved)" />
                    <Area type="monotone" dataKey="fraud" stroke="#FF4D4D" strokeWidth={2} fill="url(#colorFraud)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Risk Distribution */}
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <div className="mb-5">
                  <h3 className="text-sm font-semibold text-white">Risk Distribution</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Portfolio risk breakdown</p>
                </div>
                <div className="flex items-center justify-center mb-4">
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                        {riskDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#111827', border: '1px solid #1E2D45', borderRadius: '12px', color: '#fff' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {riskDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs text-gray-400">{item.name}</span>
                      </div>
                      <span className="text-xs font-semibold text-white">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {/* Agent Performance */}
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Agent Performance</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Uptime & request volume</p>
                  </div>
                  <span className="text-xs text-accent-green bg-accent-green/10 px-2 py-1 rounded-lg border border-accent-green/20">All Healthy</span>
                </div>
                <div className="space-y-3">
                  {agentPerformance.map((agent) => (
                    <div key={agent.name} className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent-green flex-shrink-0"></div>
                      <span className="text-xs text-gray-400 w-28 flex-shrink-0 truncate">{agent.name}</span>
                      <div className="flex-1 bg-surface-elevated rounded-full h-1.5">
                        <div
                          className="h-1.5 rounded-full bg-gradient-primary"
                          style={{ width: `${agent.uptime}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono text-white w-12 text-right">{agent.uptime}%</span>
                      <span className="text-xs text-gray-600 w-16 text-right font-mono">{(agent.requests / 1000).toFixed(1)}K</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Alerts */}
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Recent Alerts</h3>
                    <p className="text-xs text-gray-500 mt-0.5">Live agent notifications</p>
                  </div>
                  <button className="text-xs text-primary hover:underline">View all</button>
                </div>
                <div className="space-y-3">
                  {recentAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 bg-surface-elevated rounded-xl border border-surface-border hover:border-primary/30 transition-colors cursor-pointer">
                      <span className={`text-xs font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 mt-0.5 ${severityConfig[alert.severity].className}`}>
                        {severityConfig[alert.severity].label}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-medium text-white">{alert.type}</span>
                          <span className="text-xs text-gray-600 font-mono">{alert.id}</span>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{alert.desc}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-xs text-gray-600">{alert.time}</div>
                        <div className="text-xs text-primary mt-0.5">{alert.agent}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
