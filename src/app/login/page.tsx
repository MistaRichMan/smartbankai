'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && user) {
      router.replace('/');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError);
      setIsLoading(false);
    } else {
      router.replace('/');
    }
  };

  const demoAccounts = [
    { role: 'Bank Admin', email: 'admin@smartbank.ai', password: 'SmartBank2026!', color: 'text-accent-red', bg: 'bg-accent-red/5 border-accent-red/20' },
    { role: 'Agent Operator', email: 'operator@smartbank.ai', password: 'SmartBank2026!', color: 'text-accent-amber', bg: 'bg-accent-amber/5 border-accent-amber/20' },
    { role: 'Analyst', email: 'analyst@smartbank.ai', password: 'SmartBank2026!', color: 'text-primary', bg: 'bg-primary/5 border-primary/20' },
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #F8F9FA 0%, #EEF2F7 100%)' }}>
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(27,54,93,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(27,54,93,0.03)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <Image
              src="/assets/images/Infinity_AI_s_Tentative_Final_Logo_-_1_version-1780483037129.png"
              alt="Infinity AI Logo"
              width={180}
              height={54}
              className="object-contain"
              priority
            />
          </div>
          <p className="text-sm text-brand-grey mt-1 font-medium">Agentic Banking Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-surface-border rounded-2xl p-6 shadow-card">
          <h2 className="text-lg font-semibold text-brand-dark mb-1">Sign in to your account</h2>
          <p className="text-sm text-brand-grey mb-6">Access the AI agent command center</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@infinityai.com"
                required
                className="w-full bg-surface-elevated border border-surface-border rounded-xl px-4 py-3 text-sm text-brand-dark placeholder-brand-grey outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-surface-elevated border border-surface-border rounded-xl px-4 py-3 text-sm text-brand-dark placeholder-brand-grey outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10 transition-all"
              />
            </div>

            {error && (
              <div className="px-4 py-3 bg-accent-red/5 border border-accent-red/20 rounded-xl text-sm text-accent-red">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        {/* Demo Accounts */}
        <div className="mt-4 bg-white border border-surface-border rounded-2xl p-4 shadow-card">
          <p className="text-xs font-semibold text-brand-grey mb-3 uppercase tracking-wider">Demo Accounts</p>
          <div className="space-y-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.email}
                onClick={() => { setEmail(acc.email); setPassword(acc.password); }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl border ${acc.bg} hover:opacity-80 transition-opacity`}
              >
                <div className="text-left">
                  <div className={`text-xs font-semibold ${acc.color}`}>{acc.role}</div>
                  <div className="text-xs text-brand-grey font-mono">{acc.email}</div>
                </div>
                <svg className={`w-4 h-4 ${acc.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
          <p className="text-xs text-brand-grey mt-3 text-center">Password: SmartBank2026!</p>
        </div>

        <p className="text-center text-xs text-brand-grey mt-6">
          © 2026 SmartBankAI. All rights reserved.
        </p>
      </div>
    </div>
  );
}
