"""Pydantic Schemas for Omni-Logistics Master Agent"""
from datetime import datetime
from enum import Enum
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field, ConfigDict


class ShipmentStatus(str, Enum):
    IN_TRANSIT = "IN_TRANSIT"
    DELAYED = "DELAYED"
    PENDING_REVIEW = "PENDING_REVIEW"
    RESOLVED = "RESOLVED"
    DELIVERED = "DELIVERED"


class EventType(str, Enum):
    AIS_DELAY = "AIS_DELAY"
    WEATHER_ALERT = "WEATHER_ALERT"
    BERTH_CONGESTION = "BERTH_CONGESTION"
    CUSTOMS_HOLD = "CUSTOMS_HOLD"


class SeverityLevel(str, Enum):
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"


class ShipmentBase(BaseModel):
    container_id: str
    vessel_name: str
    origin_port: str
    destination: str
    status: ShipmentStatus = ShipmentStatus.IN_TRANSIT
    expected_arrival: datetime
    cargo_description: str
    hs_code: str
    value: float
    sla_deadline: datetime
    sla_penalty_rate_per_hour: float
    carrier: Optional[str] = "MSC"
    current_berth: Optional[str] = "Berth 4"


class ShipmentCreate(ShipmentBase):
    pass


class Shipment(ShipmentBase):
    id: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class EventBase(BaseModel):
    shipment_id: str
    event_type: EventType
    severity: SeverityLevel
    description: str
    impact_hours: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class EventCreate(EventBase):
    pass


class Event(EventBase):
    id: str
    model_config = ConfigDict(from_attributes=True)


class SubAgentPlan(BaseModel):
    sub_agent_name: str
    status: str
    summary: str
    action_items: List[str]
    financial_impact: float
    time_saved_hours: float
    confidence: float
    source_citations: List[str]


class DisruptionResolution(BaseModel):
    shipment_id: str
    container_id: str
    vessel_name: str
    event_description: str
    recommended_action_title: str
    recommended_actions: List[str]
    terminal_plan: SubAgentPlan
    customs_plan: SubAgentPlan
    routing_plan: SubAgentPlan
    net_cost_impact: float
    time_saved_hours: float
    sla_penalties_prevented: float
    net_margin_delta: float
    confidence_score: float
    source_attributions: List[str]
    chain_of_thought: List[str]
    requires_human_approval: bool
    human_approval_reason: Optional[str] = None
    rollback_snapshot: Optional[Dict[str, Any]] = None


class AgentDecisionBase(BaseModel):
    shipment_id: str
    sub_agent: str
    proposed_action: Dict[str, Any]
    cost_impact: float
    time_saved_hours: float
    confidence_score: float
    reasoning_cot: Optional[str] = None
    requires_human_approval: bool = False
    executed: bool = False


class AgentDecisionCreate(AgentDecisionBase):
    pass


class AgentDecision(AgentDecisionBase):
    id: str
    created_at: datetime
    executed_at: Optional[datetime] = None
    model_config = ConfigDict(from_attributes=True)


class DelaySimulationRequest(BaseModel):
    shipment_id: Optional[str] = None
    container_id: Optional[str] = None
    delay_hours: int = 12
    reason: str = "Severe fog & AIS reported berth congestion at Jebel Ali Berth 4"
    affected_berth: str = "Jebel Ali Terminal 2 - Berth 4"


class ExecuteActionRequest(BaseModel):
    shipment_id: str
    decision_id: Optional[str] = None
    notes: Optional[str] = "Executed autonomous resolution via Control Tower"


class ExecuteActionResponse(BaseModel):
    success: bool
    message: str
    shipment_id: str
    new_status: ShipmentStatus
    decision_id: str
    executed_at: datetime
    updated_shipment: Shipment
