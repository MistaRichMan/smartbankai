'use client';
import React, { useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);

  const notifications = [
    { id: 1, type: 'alert', message: 'High-risk transaction flagged in Lagos', time: '2m ago', color: 'text-accent-red' },
    { id: 2, type: 'info', message: 'Credit model retrained successfully', time: '15m ago', color: 'text-accent-green' },
    { id: 3, type: 'warn', message: 'Compliance report due in 2 days', time: '1h ago', color: 'text-accent-amber' },
    { id: 4, type: 'info', message: 'New MSME loan application received', time: '3h ago', color: 'text-primary' },
  ];

  return (
    <header className="h-16 bg-white border-b border-surface-border flex items-center px-6 gap-4 flex-shrink-0 shadow-sm">
      <div className="flex-1 min-w-0">
        <h1 className="text-lg font-semibold text-brand-dark truncate">{title}</h1>
        {subtitle && <p className="text-xs text-brand-grey truncate">{subtitle}</p>}
      </div>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-surface-elevated border border-surface-border rounded-xl px-3 py-2 w-64">
        <svg className="w-4 h-4 text-brand-grey flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search agents, transactions..."
          className="bg-transparent text-sm text-brand-dark placeholder-brand-grey outline-none w-full"
        />
        <kbd className="text-xs text-brand-grey bg-surface-border px-1.5 py-0.5 rounded font-mono">⌘K</kbd>
      </div>

      {/* Notifications */}
      <div className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative w-9 h-9 rounded-xl bg-surface-elevated border border-surface-border flex items-center justify-center text-brand-grey hover:text-primary hover:border-primary/30 transition-all"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent-red rounded-full"></span>
        </button>

        {notifOpen && (
          <div className="absolute right-0 top-12 w-80 bg-white border border-surface-border rounded-2xl shadow-card-hover z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-surface-border flex items-center justify-between">
              <span className="text-sm font-semibold text-brand-dark">Notifications</span>
              <span className="text-xs text-primary cursor-pointer hover:underline">Mark all read</span>
            </div>
            <div className="divide-y divide-surface-border">
              {notifications.map((n) => (
                <div key={n.id} className="px-4 py-3 hover:bg-surface-elevated transition-colors cursor-pointer">
                  <p className="text-xs text-brand-dark">{n.message}</p>
                  <p className={`text-xs mt-1 ${n.color}`}>{n.time}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status indicator */}
      <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-accent-green/10 border border-accent-green/20 rounded-xl">
        <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse-slow"></div>
        <span className="text-xs text-accent-green font-medium">Live</span>
      </div>
    </header>
  );
}
