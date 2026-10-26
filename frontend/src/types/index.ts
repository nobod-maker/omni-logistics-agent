export type ShipmentStatus = 'IN_TRANSIT' | 'DELAYED' | 'PENDING_REVIEW' | 'RESOLVED' | 'DELIVERED';

export type EventType = 'AIS_DELAY' | 'WEATHER_ALERT' | 'BERTH_CONGESTION' | 'CUSTOMS_HOLD';

export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Shipment {
  id: string;
  container_id: string;
  vessel_name: string;
  origin_port: string;
  destination: string;
  status: ShipmentStatus;
  expected_arrival: string;
  cargo_description: string;
  hs_code: string;
  value: number;
  sla_deadline: string;
  sla_penalty_rate_per_hour: number;
  carrier?: string;
  current_berth?: string;
  created_at?: string;
}

export interface DisruptionEvent {
  id: string;
  shipment_id: string;
  event_type: EventType;
  severity: SeverityLevel;
  description: string;
  impact_hours: number;
  timestamp: string;
}

export interface SubAgentPlan {
  sub_agent_name: string;
  status: string;
  summary: string;
  action_items: string[];
  financial_impact: number;
  time_saved_hours: number;
  confidence: number;
  source_citations: string[];
}

export interface DisruptionResolution {
  shipment_id: string;
  container_id: string;
  vessel_name: string;
  event_description: string;
  recommended_action_title: string;
  recommended_actions: string[];
  terminal_plan: SubAgentPlan;
  customs_plan: SubAgentPlan;
  routing_plan: SubAgentPlan;
  net_cost_impact: number;
  time_saved_hours: number;
  sla_penalties_prevented: number;
  net_margin_delta: number;
  confidence_score: number;
  source_attributions: string[];
  chain_of_thought: string[];
  requires_human_approval: boolean;
  human_approval_reason?: string | null;
  rollback_snapshot?: Record<string, any> | null;
}

export interface AgentDecision {
  id: string;
  shipment_id: string;
  sub_agent: string;
  proposed_action: any;
  cost_impact: number;
  time_saved_hours: number;
  confidence_score: number;
  reasoning_cot?: string;
  requires_human_approval: boolean;
  executed: boolean;
  created_at: string;
  executed_at?: string;
}

export interface TariffRecord {
  hs_code: string;
  description: string;
  category: string;
  duty_rate: string;
  vat_rate: string;
  required_documents: string[];
  inspection_risk_score: number;
  source_citation: string;
}
