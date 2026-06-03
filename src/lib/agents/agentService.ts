import { getChatCompletion } from '@/lib/ai/chatCompletion';
import { createServerClient } from '@/lib/supabase/server';

export interface AgentResult {
  analysis: string;
  decision?: string;
  confidence?: number;
  actions?: string[];
  metadata?: Record<string, unknown>;
}

// ============================================================
// FRAUD DETECTION AGENT
// ============================================================
export async function runFraudDetectionAgent(input: {
  transactionId: string;
  amount: number;
  currency: string;
  location: string;
  channel: string;
  customerId: string;
  behavioralSignals?: string;
}): Promise<AgentResult> {
  const startTime = Date.now();
  const supabase = createServerClient();

  const messages = [
    {
      role: 'system' as const,
      content: `You are the SmartBank AI Fraud Detection Agent. You analyze financial transactions using machine learning patterns, behavioral biometrics, and regional fraud intelligence for African banking markets. 
      
      Your analysis must:
      1. Assess transaction risk (0-100 score)
      2. Identify specific fraud patterns (Account Takeover, Card Fraud, SIM Swap, Phishing, Velocity Abuse, etc.)
      3. Recommend action: BLOCK, REVIEW, or APPROVE
      4. Explain reasoning with specific risk factors
      5. Consider African market fraud patterns (mobile money fraud, SIM swap attacks, USSD fraud)
      
      Respond in JSON format: {"risk_score": number, "fraud_type": string, "decision": "BLOCK"|"REVIEW"|"APPROVE", "confidence": number, "risk_factors": string[], "analysis": string, "recommended_actions": string[]}`
    },
    {
      role: 'user' as const,
      content: `Analyze this transaction for fraud:
      Transaction ID: ${input.transactionId}
      Amount: ${input.currency} ${input.amount.toLocaleString()}
      Location: ${input.location}
      Channel: ${input.channel}
      Customer ID: ${input.customerId}
      Behavioral Signals: ${input.behavioralSignals || 'Normal session behavior'}
      
      Provide fraud risk assessment.`
    }
  ];

  const response = await getChatCompletion('ANTHROPIC', 'claude-sonnet-4-6', messages, {
    temperature: 0.2,
    max_tokens: 1000,
  });

  const content = response.choices[0].message.content;
  let parsed: Record<string, unknown> = {};
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
  } catch {
    parsed = { analysis: content };
  }

  const processingTime = Date.now() - startTime;

  // Log to Supabase
  await supabase.from('agent_logs').insert({
    agent_type: 'fraud_detection',
    session_id: input.transactionId,
    input_data: input as unknown as Record<string, unknown>,
    output_data: parsed,
    processing_time_ms: processingTime,
    tokens_used: response.usage?.total_tokens || 0,
    status: 'completed',
  });

  return {
    analysis: (parsed.analysis as string) || content,
    decision: parsed.decision as string,
    confidence: parsed.confidence as number,
    actions: parsed.recommended_actions as string[],
    metadata: parsed,
  };
}

// ============================================================
// CREDIT RISK AGENT
// ============================================================
export async function runCreditRiskAgent(input: {
  applicationRef: string;
  customerName: string;
  customerType: 'individual' | 'msme';
  loanAmount: number;
  loanPurpose: string;
  monthlyIncome?: number;
  existingDebts?: number;
  alternativeData?: string;
}): Promise<AgentResult> {
  const startTime = Date.now();
  const supabase = createServerClient();

  const messages = [
    {
      role: 'system' as const,
      content: `You are the SmartBank AI Credit Risk Agent. You evaluate creditworthiness for African banking markets using both traditional financial data and alternative data sources (mobile money history, utility payments, social data).
      
      Your assessment must:
      1. Generate a credit score (300-850)
      2. Assign risk grade (A+, A, A-, B+, B, B-, C+, C, D)
      3. Make lending decision: APPROVED, DECLINED, or MANUAL_REVIEW
      4. Identify key risk factors
      5. Consider African market realities (informal income, mobile money usage, MSME characteristics)
      6. Suggest loan terms if approved
      
      Respond in JSON: {"credit_score": number, "risk_grade": string, "decision": "APPROVED"|"DECLINED"|"MANUAL_REVIEW", "confidence": number, "risk_factors": string[], "analysis": string, "suggested_terms": {"interest_rate": string, "tenure_months": number, "max_amount": number}}`
    },
    {
      role: 'user' as const,
      content: `Assess credit risk for:
      Application: ${input.applicationRef}
      Customer: ${input.customerName} (${input.customerType})
      Loan Amount: NGN ${input.loanAmount.toLocaleString()}
      Purpose: ${input.loanPurpose}
      Monthly Income: ${input.monthlyIncome ? 'NGN ' + input.monthlyIncome.toLocaleString() : 'Not provided'}
      Existing Debts: ${input.existingDebts ? 'NGN ' + input.existingDebts.toLocaleString() : 'None declared'}
      Alternative Data: ${input.alternativeData || 'Mobile money transactions available, utility payment history regular'}`
    }
  ];

  const response = await getChatCompletion('ANTHROPIC', 'claude-sonnet-4-6', messages, {
    temperature: 0.2,
    max_tokens: 1200,
    reasoning_effort: 'medium',
  });

  const content = response.choices[0].message.content;
  let parsed: Record<string, unknown> = {};
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
  } catch {
    parsed = { analysis: content };
  }

  const processingTime = Date.now() - startTime;

  await supabase.from('agent_logs').insert({
    agent_type: 'credit_risk',
    session_id: input.applicationRef,
    input_data: input as unknown as Record<string, unknown>,
    output_data: parsed,
    processing_time_ms: processingTime,
    tokens_used: response.usage?.total_tokens || 0,
    status: 'completed',
  });

  return {
    analysis: (parsed.analysis as string) || content,
    decision: parsed.decision as string,
    confidence: parsed.confidence as number,
    metadata: parsed,
  };
}

// ============================================================
// PERSONALIZATION AGENT
// ============================================================
export async function runPersonalizationAgent(input: {
  customerId: string;
  customerName: string;
  spendingData: string;
  accountBalance?: number;
  savingsGoals?: string;
  productHistory?: string;
}): Promise<AgentResult> {
  const startTime = Date.now();
  const supabase = createServerClient();

  const messages = [
    {
      role: 'system' as const,
      content: `You are the SmartBank AI Personalization Agent. You analyze customer financial behavior to deliver hyper-personalized banking experiences for African customers.
      
      Your analysis must:
      1. Categorize spending patterns (food, transport, utilities, entertainment, savings, etc.)
      2. Generate personalized financial insights and tips
      3. Recommend relevant banking products (savings accounts, loans, insurance, investments)
      4. Suggest automated savings opportunities
      5. Provide budgeting recommendations
      6. Consider African financial context (mobile money, informal savings groups, seasonal income)
      
      Respond in JSON: {"spending_categories": object, "insights": string[], "product_recommendations": string[], "savings_opportunities": string[], "budgeting_tips": string[], "engagement_score": number, "analysis": string}`
    },
    {
      role: 'user' as const,
      content: `Personalize experience for:
      Customer: ${input.customerName} (ID: ${input.customerId})
      Account Balance: ${input.accountBalance ? 'NGN ' + input.accountBalance.toLocaleString() : 'Not provided'}
      Spending Data: ${input.spendingData}
      Savings Goals: ${input.savingsGoals || 'Not specified'}
      Product History: ${input.productHistory || 'Basic savings account, no loans'}`
    }
  ];

  const response = await getChatCompletion('ANTHROPIC', 'claude-sonnet-4-6', messages, {
    temperature: 0.5,
    max_tokens: 1500,
  });

  const content = response.choices[0].message.content;
  let parsed: Record<string, unknown> = {};
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
  } catch {
    parsed = { analysis: content };
  }

  const processingTime = Date.now() - startTime;

  await supabase.from('agent_logs').insert({
    agent_type: 'personalization',
    session_id: input.customerId,
    input_data: input as unknown as Record<string, unknown>,
    output_data: parsed,
    processing_time_ms: processingTime,
    tokens_used: response.usage?.total_tokens || 0,
    status: 'completed',
  });

  return {
    analysis: (parsed.analysis as string) || content,
    metadata: parsed,
  };
}

// ============================================================
// PREDICTIVE ANALYTICS AGENT
// ============================================================
export async function runPredictiveAnalyticsAgent(input: {
  customerId: string;
  historicalTransactions: string;
  forecastPeriod: string;
  includeMarketTrends?: boolean;
}): Promise<AgentResult> {
  const startTime = Date.now();
  const supabase = createServerClient();

  const messages = [
    {
      role: 'system' as const,
      content: `You are the SmartBank AI Predictive Analytics Agent. You use time-series analysis and ML models to forecast financial patterns for African banking customers.
      
      Your predictions must:
      1. Forecast cash flow for the specified period (monthly breakdown)
      2. Predict spending patterns by category
      3. Identify upcoming financial risks (overdraft risk, bill payment stress)
      4. Generate financial health score (0-100)
      5. Provide early warning alerts
      6. Consider African seasonal patterns (harvest seasons, school fees, festive spending)
      
      Respond in JSON: {"cash_flow_forecast": [{"month": string, "inflow": number, "outflow": number, "net": number}], "spending_forecast": object, "financial_health_score": number, "risk_alerts": string[], "opportunities": string[], "analysis": string, "confidence": number}`
    },
    {
      role: 'user' as const,
      content: `Generate predictions for:
      Customer ID: ${input.customerId}
      Forecast Period: ${input.forecastPeriod}
      Historical Data: ${input.historicalTransactions}
      Include Market Trends: ${input.includeMarketTrends ? 'Yes' : 'No'}`
    }
  ];

  const response = await getChatCompletion('ANTHROPIC', 'claude-sonnet-4-6', messages, {
    temperature: 0.3,
    max_tokens: 2000,
    reasoning_effort: 'medium',
  });

  const content = response.choices[0].message.content;
  let parsed: Record<string, unknown> = {};
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
  } catch {
    parsed = { analysis: content };
  }

  const processingTime = Date.now() - startTime;

  await supabase.from('agent_logs').insert({
    agent_type: 'predictive_analytics',
    session_id: input.customerId,
    input_data: input as unknown as Record<string, unknown>,
    output_data: parsed,
    processing_time_ms: processingTime,
    tokens_used: response.usage?.total_tokens || 0,
    status: 'completed',
  });

  return {
    analysis: (parsed.analysis as string) || content,
    confidence: parsed.confidence as number,
    metadata: parsed,
  };
}

// ============================================================
// COMPLIANCE & REPORTING AGENT
// ============================================================
export async function runComplianceAgent(input: {
  reportType: string;
  regulatoryBody: string;
  periodStart: string;
  periodEnd: string;
  transactionData?: string;
  kycData?: string;
}): Promise<AgentResult> {
  const startTime = Date.now();
  const supabase = createServerClient();

  const messages = [
    {
      role: 'system' as const,
      content: `You are the SmartBank AI Compliance & Reporting Agent. You automate regulatory compliance monitoring and report generation for African financial institutions.
      
      Your compliance analysis must:
      1. Assess compliance status against specified regulatory requirements
      2. Identify specific violations or areas of concern
      3. Generate structured compliance report summary
      4. Recommend remediation actions
      5. Flag high-risk transactions for AML/KYC review
      6. Consider African regulatory frameworks: CBN (Nigeria), Bank of Ghana, CBK (Kenya), FATF, GIABA
      
      Respond in JSON: {"compliance_status": "COMPLIANT"|"NON_COMPLIANT"|"PARTIAL", "risk_level": "LOW"|"MEDIUM"|"HIGH", "findings": string[], "violations": string[], "remediation_actions": string[], "report_summary": string, "confidence": number}`
    },
    {
      role: 'user' as const,
      content: `Generate compliance assessment:
      Report Type: ${input.reportType}
      Regulatory Body: ${input.regulatoryBody}
      Period: ${input.periodStart} to ${input.periodEnd}
      Transaction Data Summary: ${input.transactionData || 'Standard transaction volume, no unusual patterns'}
      KYC Data: ${input.kycData || 'All customers verified, 98.2% KYC completion rate'}`
    }
  ];

  const response = await getChatCompletion('ANTHROPIC', 'claude-sonnet-4-6', messages, {
    temperature: 0.1,
    max_tokens: 2000,
    reasoning_effort: 'high',
  });

  const content = response.choices[0].message.content;
  let parsed: Record<string, unknown> = {};
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
  } catch {
    parsed = { analysis: content };
  }

  const processingTime = Date.now() - startTime;

  await supabase.from('agent_logs').insert({
    agent_type: 'compliance_reporting',
    session_id: `${input.reportType}-${input.periodStart}`,
    input_data: input as unknown as Record<string, unknown>,
    output_data: parsed,
    processing_time_ms: processingTime,
    tokens_used: response.usage?.total_tokens || 0,
    status: 'completed',
  });

  return {
    analysis: (parsed.report_summary as string) || content,
    confidence: parsed.confidence as number,
    metadata: parsed,
  };
}

// ============================================================
// DATA AGGREGATION AGENT
// ============================================================
export async function runDataAggregationAgent(input: {
  sourceSystem: string;
  dataType: string;
  sampleData?: string;
  qualityThreshold?: number;
}): Promise<AgentResult> {
  const startTime = Date.now();
  const supabase = createServerClient();

  const messages = [
    {
      role: 'system' as const,
      content: `You are the SmartBank AI Data Aggregation Agent. You analyze data quality, identify inconsistencies, and provide data governance recommendations for African banking data pipelines.
      
      Your analysis must:
      1. Assess data quality score (0-100)
      2. Identify data issues (missing fields, duplicates, format inconsistencies)
      3. Recommend data cleansing actions
      4. Validate data against banking standards
      5. Flag privacy/GDPR compliance issues
      6. Provide unified customer profile recommendations
      
      Respond in JSON: {"quality_score": number, "records_valid": number, "records_flagged": number, "issues": string[], "cleansing_actions": string[], "privacy_flags": string[], "analysis": string, "recommendations": string[]}`
    },
    {
      role: 'user' as const,
      content: `Analyze data from:
      Source System: ${input.sourceSystem}
      Data Type: ${input.dataType}
      Quality Threshold: ${input.qualityThreshold || 95}%
      Sample Data: ${input.sampleData || 'Standard banking transaction records with customer profiles'}`
    }
  ];

  const response = await getChatCompletion('ANTHROPIC', 'claude-sonnet-4-6', messages, {
    temperature: 0.2,
    max_tokens: 1200,
  });

  const content = response.choices[0].message.content;
  let parsed: Record<string, unknown> = {};
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
  } catch {
    parsed = { analysis: content };
  }

  const processingTime = Date.now() - startTime;

  await supabase.from('agent_logs').insert({
    agent_type: 'data_aggregation',
    session_id: `${input.sourceSystem}-${Date.now()}`,
    input_data: input as unknown as Record<string, unknown>,
    output_data: parsed,
    processing_time_ms: processingTime,
    tokens_used: response.usage?.total_tokens || 0,
    status: 'completed',
  });

  return {
    analysis: (parsed.analysis as string) || content,
    metadata: parsed,
  };
}

// ============================================================
// SMART DASHBOARD AGENT
// ============================================================
export async function runDashboardAgent(input: {
  kpiData: Record<string, unknown>;
  timeRange: string;
  userRole: string;
}): Promise<AgentResult> {
  const startTime = Date.now();
  const supabase = createServerClient();

  const messages = [
    {
      role: 'system' as const,
      content: `You are the SmartBank AI Smart Financial Dashboard Agent. You generate intelligent financial narratives and insights from banking KPI data for African financial institutions.
      
      Your dashboard intelligence must:
      1. Summarize key performance trends
      2. Highlight anomalies and significant changes
      3. Provide actionable executive insights
      4. Identify growth opportunities
      5. Flag risk areas requiring attention
      6. Tailor insights to user role (bank_admin, agent_operator, analyst)
      
      Respond in JSON: {"executive_summary": string, "key_trends": string[], "anomalies": string[], "opportunities": string[], "risk_areas": string[], "recommended_actions": string[], "confidence": number}`
    },
    {
      role: 'user' as const,
      content: `Generate dashboard intelligence for:
      Time Range: ${input.timeRange}
      User Role: ${input.userRole}
      KPI Data: ${JSON.stringify(input.kpiData)}`
    }
  ];

  const response = await getChatCompletion('ANTHROPIC', 'claude-sonnet-4-6', messages, {
    temperature: 0.4,
    max_tokens: 1500,
  });

  const content = response.choices[0].message.content;
  let parsed: Record<string, unknown> = {};
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) parsed = JSON.parse(jsonMatch[0]);
  } catch {
    parsed = { analysis: content };
  }

  const processingTime = Date.now() - startTime;

  await supabase.from('agent_logs').insert({
    agent_type: 'smart_dashboard',
    session_id: `dashboard-${Date.now()}`,
    input_data: input as unknown as Record<string, unknown>,
    output_data: parsed,
    processing_time_ms: processingTime,
    tokens_used: response.usage?.total_tokens || 0,
    status: 'completed',
  });

  return {
    analysis: (parsed.executive_summary as string) || content,
    metadata: parsed,
  };
}
