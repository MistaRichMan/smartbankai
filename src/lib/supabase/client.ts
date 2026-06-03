import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: 'bank_admin' | 'agent_operator' | 'analyst';
          avatar_url: string | null;
          is_active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      agents: {
        Row: {
          id: string;
          agent_type: string;
          display_name: string;
          description: string | null;
          status: 'online' | 'processing' | 'offline' | 'error';
          uptime_pct: number;
          requests_today: number;
          last_active: string;
          model_version: string;
          config: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
      };
      fraud_cases: {
        Row: {
          id: string;
          case_ref: string;
          transaction_id: string | null;
          customer_id: string | null;
          fraud_type: string;
          amount: number | null;
          currency: string;
          location: string | null;
          channel: string | null;
          risk_score: number | null;
          case_status: 'flagged' | 'blocked' | 'review' | 'cleared';
          biometric_result: string | null;
          ml_model_version: string | null;
          claude_analysis: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
      };
      credit_assessments: {
        Row: {
          id: string;
          application_ref: string;
          customer_name: string;
          customer_type: string;
          loan_amount: number | null;
          loan_purpose: string | null;
          credit_score: number | null;
          risk_grade: string | null;
          decision: 'approved' | 'declined' | 'manual_review' | 'pending';
          income_verified: boolean;
          alternative_data_used: boolean;
          claude_analysis: string | null;
          risk_factors: unknown[];
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
      };
      compliance_reports: {
        Row: {
          id: string;
          report_ref: string;
          report_type: string;
          regulatory_body: string | null;
          period_start: string | null;
          period_end: string | null;
          report_status: 'compliant' | 'non_compliant' | 'pending_review' | 'remediated';
          submission_deadline: string | null;
          submitted_at: string | null;
          claude_summary: string | null;
          findings: unknown[];
          metadata: Record<string, unknown>;
          created_at: string;
          updated_at: string;
        };
      };
      system_alerts: {
        Row: {
          id: string;
          agent_type: string | null;
          alert_type: string;
          title: string;
          description: string | null;
          severity: 'low' | 'medium' | 'high' | 'critical';
          is_read: boolean;
          metadata: Record<string, unknown>;
          created_at: string;
        };
      };
      agent_logs: {
        Row: {
          id: string;
          agent_type: string;
          session_id: string | null;
          user_id: string | null;
          input_data: Record<string, unknown>;
          output_data: Record<string, unknown> | null;
          processing_time_ms: number | null;
          tokens_used: number | null;
          status: string;
          error_message: string | null;
          created_at: string;
        };
      };
      orchestration_tasks: {
        Row: {
          id: string;
          task_ref: string;
          initiating_agent: string | null;
          target_agents: string[];
          task_type: string;
          priority: number;
          input_payload: Record<string, unknown>;
          output_payload: Record<string, unknown> | null;
          task_status: string;
          started_at: string | null;
          completed_at: string | null;
          claude_decision: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      personalization_profiles: {
        Row: {
          id: string;
          customer_id: string;
          customer_name: string | null;
          spending_categories: Record<string, unknown>;
          financial_goals: unknown[];
          product_recommendations: unknown[];
          savings_suggestions: unknown[];
          risk_appetite: string;
          engagement_score: number;
          claude_insights: string | null;
          last_analyzed: string;
          created_at: string;
          updated_at: string;
        };
      };
      predictive_results: {
        Row: {
          id: string;
          customer_id: string | null;
          prediction_type: string;
          forecast_period: string | null;
          predicted_value: number | null;
          confidence_score: number | null;
          cash_flow_forecast: unknown[];
          spending_forecast: unknown[];
          risk_alerts: unknown[];
          claude_narrative: string | null;
          model_version: string | null;
          created_at: string;
        };
      };
      data_aggregation_jobs: {
        Row: {
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
          error_log: unknown[];
          metadata: Record<string, unknown>;
          created_at: string;
        };
      };
      dashboard_snapshots: {
        Row: {
          id: string;
          snapshot_date: string;
          total_transactions: number;
          total_volume: number;
          fraud_blocked_amount: number;
          loans_processed: number;
          ai_accuracy: number;
          active_customers: number;
          kpi_data: Record<string, unknown>;
          chart_data: Record<string, unknown>;
          claude_summary: string | null;
          created_at: string;
        };
      };
      chat_sessions: {
        Row: {
          id: string;
          session_ref: string;
          customer_id: string | null;
          language: string;
          messages: unknown[];
          intent_summary: Record<string, unknown>;
          sentiment: string | null;
          escalated_to_human: boolean;
          session_status: string;
          started_at: string;
          ended_at: string | null;
          created_at: string;
        };
      };
    };
  };
};

export { createClient };