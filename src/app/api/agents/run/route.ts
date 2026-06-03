import { NextRequest, NextResponse } from 'next/server';
import { getChatCompletion } from '@/lib/ai/chatCompletion';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { agentType, input } = body;

    if (!agentType || !input) {
      return NextResponse.json({ error: 'agentType and input are required' }, { status: 400 });
    }

    const supabase = createServerClient();
    const startTime = Date.now();

    const agentConfigs: Record<string, { systemPrompt: string; temperature: number; maxTokens: number }> = {
      fraud_detection: {
        systemPrompt: `You are the SmartBank AI Fraud Detection Agent. Analyze transactions for fraud using ML patterns and African market intelligence. Assess risk (0-100), identify fraud type, recommend BLOCK/REVIEW/APPROVE. Consider mobile money fraud, SIM swap, USSD fraud patterns common in Africa. Respond in JSON: {"risk_score": number, "fraud_type": string, "decision": "BLOCK"|"REVIEW"|"APPROVE", "confidence": number, "risk_factors": string[], "analysis": string, "recommended_actions": string[]}`,
        temperature: 0.2,
        maxTokens: 1000,
      },
      credit_risk: {
        systemPrompt: `You are the SmartBank AI Credit Risk Agent. Evaluate creditworthiness using traditional and alternative data for African markets. Generate credit score (300-850), risk grade, and lending decision. Consider informal income, mobile money usage, MSME characteristics. Respond in JSON: {"credit_score": number, "risk_grade": string, "decision": "APPROVED"|"DECLINED"|"MANUAL_REVIEW", "confidence": number, "risk_factors": string[], "analysis": string, "suggested_terms": {"interest_rate": string, "tenure_months": number}}`,
        temperature: 0.2,
        maxTokens: 1200,
      },
      personalization: {
        systemPrompt: `You are the SmartBank AI Personalization Agent. Analyze customer financial behavior to deliver personalized African banking experiences. Categorize spending, recommend products, suggest savings. Consider mobile money, informal savings groups, seasonal income. Respond in JSON: {"spending_categories": object, "insights": string[], "product_recommendations": string[], "savings_opportunities": string[], "budgeting_tips": string[], "engagement_score": number, "analysis": string}`,
        temperature: 0.5,
        maxTokens: 1500,
      },
      predictive_analytics: {
        systemPrompt: `You are the SmartBank AI Predictive Analytics Agent. Forecast financial patterns using time-series analysis for African banking customers. Predict cash flow, spending patterns, identify risks. Consider African seasonal patterns (harvest, school fees, festive). Respond in JSON: {"cash_flow_forecast": [{"month": string, "inflow": number, "outflow": number, "net": number}], "financial_health_score": number, "risk_alerts": string[], "opportunities": string[], "analysis": string, "confidence": number}`,
        temperature: 0.3,
        maxTokens: 2000,
      },
      compliance_reporting: {
        systemPrompt: `You are the SmartBank AI Compliance & Reporting Agent. Automate regulatory compliance for African financial institutions. Assess compliance against CBN, Bank of Ghana, CBK, FATF, GIABA requirements. Flag AML/KYC issues. Respond in JSON: {"compliance_status": "COMPLIANT"|"NON_COMPLIANT"|"PARTIAL", "risk_level": "LOW"|"MEDIUM"|"HIGH", "findings": string[], "violations": string[], "remediation_actions": string[], "report_summary": string, "confidence": number}`,
        temperature: 0.1,
        maxTokens: 2000,
      },
      data_aggregation: {
        systemPrompt: `You are the SmartBank AI Data Aggregation Agent. Analyze data quality and governance for African banking data pipelines. Assess quality score, identify issues, recommend cleansing. Flag privacy/GDPR issues. Respond in JSON: {"quality_score": number, "records_valid": number, "records_flagged": number, "issues": string[], "cleansing_actions": string[], "privacy_flags": string[], "analysis": string, "recommendations": string[]}`,
        temperature: 0.2,
        maxTokens: 1200,
      },
      smart_dashboard: {
        systemPrompt: `You are the SmartBank AI Smart Financial Dashboard Agent. Generate intelligent financial narratives from banking KPI data for African institutions. Summarize trends, highlight anomalies, provide executive insights. Respond in JSON: {"executive_summary": string, "key_trends": string[], "anomalies": string[], "opportunities": string[], "risk_areas": string[], "recommended_actions": string[], "confidence": number}`,
        temperature: 0.4,
        maxTokens: 1500,
      },
      conversational: {
        systemPrompt: `You are SmartBank AI, an intelligent banking assistant for African customers. You support English, Yoruba, Hausa, Igbo, Swahili, French, Arabic, and Portuguese. Help with balance inquiries, transfers, loan applications, bill payments, and financial advice. Be warm, professional, and culturally aware. Detect the customer's language and respond in kind. Always confirm sensitive transactions with security verification. Respond naturally as a banking assistant.`,
        temperature: 0.7,
        maxTokens: 800,
      },
      orchestration: {
        systemPrompt: `You are the SmartBank AI Orchestration Agent. You coordinate all 9 specialized agents (Conversational, Fraud Detection, Credit Risk, Personalization, Predictive Analytics, Compliance, Data Aggregation, Smart Dashboard) to handle complex multi-agent banking workflows. Analyze the task, determine which agents to invoke, sequence their execution, and synthesize results. Respond in JSON: {"task_plan": string[], "agent_sequence": string[], "decision": string, "priority": number, "expected_outcome": string, "analysis": string}`,
        temperature: 0.3,
        maxTokens: 1500,
      },
    };

    const config = agentConfigs[agentType];
    if (!config) {
      return NextResponse.json({ error: `Unknown agent type: ${agentType}` }, { status: 400 });
    }

    const messages = [
      { role: 'system' as const, content: config.systemPrompt },
      { role: 'user' as const, content: typeof input === 'string' ? input : JSON.stringify(input) },
    ];

    const response = await getChatCompletion('ANTHROPIC', 'claude-sonnet-4-6', messages, {
      temperature: config.temperature,
      max_tokens: config.maxTokens,
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
      agent_type: agentType,
      input_data: { input },
      output_data: parsed,
      processing_time_ms: processingTime,
      tokens_used: response.usage?.total_tokens || 0,
      status: 'completed',
    });

    // Update agent request count
    await supabase.rpc('increment_agent_requests', { p_agent_type: agentType }).catch(() => {});

    return NextResponse.json({
      success: true,
      agentType,
      result: parsed,
      rawContent: content,
      processingTime,
      tokensUsed: response.usage?.total_tokens || 0,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Agent processing failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
