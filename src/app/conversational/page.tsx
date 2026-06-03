'use client';
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { supabase } from '@/lib/supabase/client';

interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  language?: string;
  intent?: string;
  confidence?: number;
  actions?: string[];
  isStreaming?: boolean;
}

const supportedLanguages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
  { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
  { code: 'ig', name: 'Igbo', flag: '🇳🇬' },
  { code: 'sw', name: 'Swahili', flag: '🇰🇪' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
];

const intentStats = [
  { intent: 'Balance Inquiry', count: 12840, pct: 28 },
  { intent: 'Fund Transfer', count: 9420, pct: 21 },
  { intent: 'Bill Payment', count: 7890, pct: 17 },
  { intent: 'Loan Inquiry', count: 5340, pct: 12 },
  { intent: 'Card Services', count: 4120, pct: 9 },
  { intent: 'Account Opening', count: 2980, pct: 7 },
  { intent: 'Other', count: 2710, pct: 6 },
];

const initialMessages: Message[] = [
  {
    id: '1',
    role: 'agent',
    content: 'Hello! I\'m SmartBank AI, your intelligent banking assistant. I can help you in English, Yoruba, Hausa, Igbo, Swahili, French, Arabic, and Portuguese. How can I assist you today?',
    timestamp: '12:00 AM',
    language: 'English',
    intent: 'greeting',
    confidence: 99.8,
  },
];

export default function ConversationalPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedLang, setSelectedLang] = useState('en');
  const [sessionRef, setSessionRef] = useState('SESS-INIT');
  const [activeTab, setActiveTab] = useState<'chat' | 'analytics'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSessionRef(`SESS-${Date.now()}`);
    setMessages([{
      ...initialMessages[0],
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    const agentPlaceholder: Message = {
      id: (Date.now() + 1).toString(),
      role: 'agent',
      content: '',
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      isStreaming: true,
    };

    setMessages(prev => [...prev, userMsg, agentPlaceholder]);
    setInput('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const conversationHistory = messages.slice(-6).map(m => ({
        role: m.role === 'agent' ? 'assistant' : 'user',
        content: m.content,
      }));

      const res = await fetch('/api/ai/chat-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: 'ANTHROPIC',
          model: 'claude-sonnet-4-6',
          messages: [
            {
              role: 'system',
              content: `You are SmartBank AI, an intelligent banking assistant for African customers. You support English, Yoruba, Hausa, Igbo, Swahili, French, Arabic, and Portuguese. 
              
              Help with: balance inquiries, fund transfers, loan applications, bill payments, card services, account opening, and financial advice.
              
              Always:
              - Detect the customer's language and respond in kind
              - Be warm, professional, and culturally aware of African banking contexts
              - For sensitive transactions (transfers, loans), mention security verification
              - Keep responses concise and actionable
              - Suggest relevant follow-up actions
              
              Customer's preferred language: ${supportedLanguages.find(l => l.code === selectedLang)?.name || 'English'}`,
            },
            ...conversationHistory,
            { role: 'user', content: input },
          ],
          stream: false,
          parameters: { temperature: 0.7, max_tokens: 600 },
        }),
      });

      const data = await res.json();
      const responseContent = data.choices?.[0]?.message?.content || 'I apologize, I could not process your request. Please try again.';

      // Save session to Supabase
      await supabase.from('chat_sessions').upsert({
        session_ref: sessionRef,
        language: selectedLang,
        messages: [...messages, userMsg, { role: 'agent', content: responseContent }],
        session_status: 'active',
      }, { onConflict: 'session_ref' });

      setMessages(prev => prev.map(m =>
        m.id === agentPlaceholder.id
          ? { ...m, content: responseContent, isStreaming: false, language: selectedLang === 'en' ? 'English' : selectedLang }
          : m
      ));
    } catch {
      setMessages(prev => prev.map(m =>
        m.id === agentPlaceholder.id
          ? { ...m, content: 'I apologize, I encountered an error. Please try again.', isStreaming: false }
          : m
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex h-screen bg-surface overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header title="Conversational AI Agent" subtitle="AI-powered NLP banking assistant with African language support" />
        <main className="flex-1 overflow-hidden flex flex-col p-6 gap-4">

          {/* Tabs */}
          <div className="flex gap-1 bg-surface-card border border-surface-border rounded-xl p-1 w-fit">
            {(['chat', 'analytics'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${activeTab === tab ? 'bg-surface-elevated text-white shadow' : 'text-gray-500 hover:text-gray-300'}`}
              >
                {tab === 'chat' ? '💬 Live Chat' : '📊 Analytics'}
              </button>
            ))}
          </div>

          {activeTab === 'chat' && (
            <div className="flex-1 flex gap-4 overflow-hidden">
              {/* Chat Panel */}
              <div className="flex-1 flex flex-col bg-surface-card border border-surface-border rounded-2xl overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-surface-border flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white">SmartBank AI Assistant</div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse-slow"></div>
                      <span className="text-xs text-gray-500">SmartBankAI Engine · Online</span>
                    </div>
                  </div>
                  <div className="ml-auto">
                    <select
                      value={selectedLang}
                      onChange={(e) => setSelectedLang(e.target.value)}
                      className="bg-surface-elevated border border-surface-border rounded-lg px-2 py-1 text-xs text-gray-300 outline-none"
                    >
                      {supportedLanguages.map(l => (
                        <option key={l.code} value={l.code}>{l.flag} {l.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md ${msg.role === 'user' ? 'order-2' : 'order-1'}`}>
                        {msg.role === 'agent' && (
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-5 h-5 rounded-full bg-gradient-primary flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <span className="text-xs text-gray-500">SmartBank AI</span>
                            {msg.confidence && (
                              <span className="text-xs text-accent-green">{msg.confidence}% confidence</span>
                            )}
                          </div>
                        )}
                        <div className={`px-4 py-3 rounded-2xl text-sm ${
                          msg.role === 'user' ?'bg-gradient-primary text-white rounded-tr-sm' :'bg-surface-elevated border border-surface-border text-gray-200 rounded-tl-sm'
                        }`}>
                          {msg.isStreaming ? (
                            <div className="flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          ) : (
                            msg.content
                          )}
                        </div>
                        <div className="text-xs text-gray-600 mt-1 px-1">{msg.timestamp}</div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="px-4 py-3 border-t border-surface-border">
                  <div className="flex items-center gap-3 bg-surface-elevated border border-surface-border rounded-xl px-4 py-2.5">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Type a message in any language..."
                      disabled={isLoading}
                      className="flex-1 bg-transparent text-sm text-brand-dark placeholder-brand-grey outline-none"
                    />
                    <button
                      onClick={sendMessage}
                      disabled={isLoading || !input.trim()}
                      className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Side Panel */}
              <div className="w-64 flex-shrink-0 space-y-4">
                <div className="bg-surface-card border border-surface-border rounded-2xl p-4">
                  <h3 className="text-xs font-semibold text-brand-dark mb-3">Session Info</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-xs text-brand-grey">Session</span>
                      <span className="text-xs font-mono text-primary">{sessionRef.slice(0, 12)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-brand-grey">Messages</span>
                      <span className="text-xs text-brand-dark">{messages.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-brand-grey">Language</span>
                      <span className="text-xs text-brand-dark">{supportedLanguages.find(l => l.code === selectedLang)?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-brand-grey">Model</span>
                      <span className="text-xs text-accent-green">SmartBankAI Engine</span>
                    </div>
                  </div>
                </div>
                <div className="bg-surface-card border border-surface-border rounded-2xl p-4">
                  <h3 className="text-xs font-semibold text-brand-dark mb-3">Quick Prompts</h3>
                  <div className="space-y-1.5">
                    {['Check my balance', 'Transfer funds', 'Apply for loan', 'Pay a bill', 'Block my card'].map((prompt) => (
                      <button
                        key={prompt}
                        onClick={() => setInput(prompt)}
                        className="w-full text-left text-xs text-brand-grey hover:text-brand-dark px-2 py-1.5 rounded-lg hover:bg-surface-elevated transition-all"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="flex-1 overflow-y-auto space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Sessions', value: '45,200', color: 'text-primary' },
                  { label: 'Intent Accuracy', value: '97.4%', color: 'text-accent-green' },
                  { label: 'Avg Response', value: '1.2s', color: 'text-accent-cyan' },
                  { label: 'Escalation Rate', value: '2.1%', color: 'text-accent-amber' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-surface-card border border-surface-border rounded-2xl p-4">
                    <div className="text-xs text-gray-500 mb-1">{stat.label}</div>
                    <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-surface-card border border-surface-border rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-brand-dark mb-4">Intent Distribution</h3>
                <div className="space-y-3">
                  {intentStats.map((stat) => (
                    <div key={stat.intent}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-brand-grey">{stat.intent}</span>
                        <span className="text-xs font-semibold text-brand-dark">{stat.count.toLocaleString()} <span className="text-brand-grey">({stat.pct}%)</span></span>
                      </div>
                      <div className="w-full bg-surface-elevated rounded-full h-1.5">
                        <div className="bg-gradient-primary h-1.5 rounded-full" style={{ width: `${stat.pct * 3}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
