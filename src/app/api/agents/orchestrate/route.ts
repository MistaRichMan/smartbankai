import { NextRequest, NextResponse } from 'next/server';
import { getChatCompletion } from '../../../../lib/ai/chatCompletion';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { taskType, payload, initiatingAgent } = body;

    const supabase = createServerClient();
    const taskRef = `ORCH-${Date.now()}`;

    // Insert orchestration task
    await supabase.from('orchestration_tasks').insert({
      task_ref: taskRef,
      initiating_agent: initiatingAgent || 'orchestration',
      task_type: taskType,
      input_payload: payload,
      task_status: 'processing',
      started_at: new Date().toISOString(),
    });

    const messages = [
      {
        role: 'system' as const,
        content: `You are the SmartBank AI Orchestration Agent — the central coordinator of a 9-agent banking AI platform. 
        
        Available agents:
        1. conversational — NLP banking assistant (8+ African languages)
        2. fraud_detection — Real-time ML transaction monitoring
        3. credit_risk — Alternative data credit scoring
        4. personalization — Customer behavior analysis
        5. predictive_analytics — Cash flow forecasting
        6. compliance_reporting — Regulatory compliance automation
        7. data_aggregation — Data quality and governance
        8. smart_dashboard — Financial intelligence visualization
        
        For each task:
        1. Analyze the request and determine which agents are needed
        2. Define the execution sequence (some can run in parallel)
        3. Specify data flow between agents
        4. Make the final coordinated decision
        5. Estimate completion time
        
        Respond in JSON: {
          "task_plan": string,
          "agent_sequence": [{"agent": string, "action": string, "depends_on": string[]}],
          "parallel_groups": string[][],
          "decision": string,
          "priority": number,
          "estimated_time_ms": number,
          "expected_outcome": string,
          "analysis": string
        }`
      },
      {
        role: 'user' as const,
        content: `Orchestrate this banking task:
        Task Type: ${taskType}
        Initiating Agent: ${initiatingAgent || 'user_request'}
        Payload: ${JSON.stringify(payload)}`
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

    // Update orchestration task with result
    await supabase.from('orchestration_tasks')
      .update({
        output_payload: parsed,
        task_status: 'completed',
        completed_at: new Date().toISOString(),
        claude_decision: parsed.decision as string || content,
      })
      .eq('task_ref', taskRef);

    // Create system alert for high-priority tasks
    if ((parsed.priority as number) >= 8) {
      await supabase.from('system_alerts').insert({
        agent_type: 'orchestration',
        alert_type: 'High Priority Task',
        title: `Orchestration: ${taskType}`,
        description: parsed.decision as string || 'High priority task completed',
        severity: 'high',
      });
    }

    return NextResponse.json({
      success: true,
      taskRef,
      orchestration: parsed,
      rawContent: content,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Orchestration failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
