"""Omni-Logistics Master Agent: FastAPI Backend Application.

Provides REST endpoints for live shipment telemetry, simulated disruption injection,
CrewAI/Gemini multi-agent orchestration, and autonomous execution write-backs.
"""
import os
from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.schemas import (
    Shipment,
    Event,
    AgentDecision,
    DelaySimulationRequest,
    DisruptionResolution,
    ExecuteActionRequest,
    ExecuteActionResponse,
    ShipmentStatus
)
from app.services.database import (
    init_db,
    get_all_shipments,
    get_shipment_by_id,
    update_shipment_status,
    create_event,
    get_recent_events,
    record_agent_decision,
    execute_agent_decision,
    get_agent_decisions
)
from app.services.mock_data import (
    seed_initial_data,
    get_tariff_info,
    MOCK_UAE_TARIFF_DATABASE
)
from app.agents.master import MasterOrchestrator
from app.agents.agency_loader import AgencyAgentLoader

load_dotenv()


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB & Seed Synthetic Dubai Corridor Shipments
    init_db()
    seed_initial_data(force=False)
    yield


app = FastAPI(
    title="Omni-Logistics Master Agent API",
    description="Autonomous Multi-Agent Control Tower for Dubai Port & Inland Trade Corridors",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows Next.js local & preview deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = MasterOrchestrator()


@app.get("/health", status_code=status.HTTP_200_OK)
async def health_check():
    """System health check and diagnostic status."""
    return {
        "status": "healthy",
        "service": "Omni-Logistics Master Agent",
        "version": "1.0.0",
        "engine": "Gemini 1.5 Flash",
        "hub": "Jebel Ali / Dubai South Free Zone"
    }


@app.get("/api/shipments", response_model=List[Shipment])
async def list_shipments():
    """Retrieve all active tracked shipments across Dubai trade corridors."""
    shipments = get_all_shipments()
    return shipments


@app.get("/api/shipments/{shipment_id}", response_model=Shipment)
async def get_shipment(shipment_id: str):
    """Retrieve single shipment by UUID or Container ID."""
    shipment = get_shipment_by_id(shipment_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")
    return shipment


@app.get("/api/events", response_model=List[Event])
async def list_events(limit: int = Query(default=10, ge=1, le=50)):
    """Retrieve recent AIS telemetry, weather, and port disruption events."""
    return get_recent_events(limit=limit)


@app.get("/api/agent-decisions", response_model=List[AgentDecision])
async def list_decisions(shipment_id: Optional[str] = None):
    """Audit log of all multi-agent resolution proposals and execution states."""
    return get_agent_decisions(shipment_id=shipment_id)


@app.post("/api/simulate-delay", response_model=DisruptionResolution)
async def simulate_delay(payload: DelaySimulationRequest):
    """
    Ingest a simulated port/vessel delay event.
    Triggers Master Orchestrator + Terminal, Customs, and Routing sub-agents.
    Returns Pydantic-validated resolution plan with ROI calculus and confidence scores.
    """
    shipment = None
    if payload.shipment_id:
        shipment = get_shipment_by_id(payload.shipment_id)
    elif payload.container_id:
        shipment = get_shipment_by_id(payload.container_id)
    else:
        # Default to primary showcase container MSC Zoe / MSCU7829104
        all_s = get_all_shipments()
        if all_s:
            shipment = all_s[0]

    if not shipment:
        raise HTTPException(status_code=404, detail="No active shipment found to inject disruption.")

    # 1. Update shipment state to DELAYED
    update_shipment_status(shipment["id"], ShipmentStatus.DELAYED)

    # 2. Record telemetry event in database
    create_event(
        shipment_id=shipment["id"],
        event_type="AIS_DELAY",
        severity="HIGH",
        description=f"{payload.reason} on {shipment['vessel_name']} (+{payload.delay_hours}h)",
        impact_hours=payload.delay_hours
    )

    # 3. Trigger Multi-Agent System (MAS)
    resolution = await orchestrator.orchestrate_resolution(
        shipment=shipment,
        delay_hours=payload.delay_hours,
        reason=payload.reason,
        berth=payload.affected_berth
    )

    # 4. Record audit decision in agent_decisions table
    record_agent_decision(
        shipment_id=shipment["id"],
        sub_agent="Omni Master Orchestrator",
        proposed_action=resolution.model_dump(),
        cost_impact=resolution.net_cost_impact,
        time_saved_hours=resolution.time_saved_hours,
        confidence_score=resolution.confidence_score,
        reasoning_cot="\n".join(resolution.chain_of_thought),
        requires_human_approval=resolution.requires_human_approval
    )

    return resolution


@app.post("/api/execute-action", response_model=ExecuteActionResponse)
async def execute_action(payload: ExecuteActionRequest):
    """
    Execute autonomous recovery plan.
    Updates shipment status to RESOLVED and records immutable execution timestamp in audit table.
    """
    shipment = get_shipment_by_id(payload.shipment_id)
    if not shipment:
        raise HTTPException(status_code=404, detail="Shipment not found")

    # Locate latest decision for this shipment
    decisions = get_agent_decisions(payload.shipment_id)
    if not decisions:
        # Generate default decision entry if not found
        decision_record = record_agent_decision(
            shipment_id=payload.shipment_id,
            sub_agent="Omni Master Orchestrator",
            proposed_action={"action": "Manual Override / One-Click Resolution"},
            cost_impact=1645.0,
            time_saved_hours=10.0,
            confidence_score=0.95,
            reasoning_cot="Executed one-click autonomous resolution from Control Tower UI."
        )
        decision_id = decision_record["id"]
    else:
        decision_id = decisions[0]["id"]

    res = execute_agent_decision(decision_id)
    if not res:
        raise HTTPException(status_code=500, detail="Failed to commit resolution execution.")

    updated_shipment = get_shipment_by_id(payload.shipment_id)

    return ExecuteActionResponse(
        success=True,
        message="Autonomous recovery plan successfully dispatched to Jebel Ali Terminal and Dubai Customs.",
        shipment_id=payload.shipment_id,
        new_status=ShipmentStatus.RESOLVED,
        decision_id=decision_id,
        executed_at=res["executed_at"],
        updated_shipment=updated_shipment
    )


@app.get("/api/tariff-lookup")
async def tariff_lookup(hs_code: str = Query(..., description="HS Code to query")):
    """Query synthetic UAE Customs Tariff database with official source attribution."""
    return get_tariff_info(hs_code)


@app.get("/api/agency-agents")
async def list_agency_agents(
    division: Optional[str] = Query(None, description="Filter by division (e.g. specialized, gis, finance, engineering)"),
    search: Optional[str] = Query(None, description="Search keyword in name or description")
):
    """Browse the installed 271 ready-made Agency Agent specialists."""
    catalog = AgencyAgentLoader.get_catalog()
    if division:
        catalog = [a for a in catalog if a.get("division", "").lower() == division.lower()]
    if search:
        s_lower = search.lower()
        catalog = [a for a in catalog if s_lower in a.get("name", "").lower() or s_lower in a.get("description", "").lower()]
    return {
        "total_available": len(catalog),
        "agents": catalog
    }


@app.get("/api/agency-agents/{slug}")
async def get_agency_agent_details(slug: str):
    """Retrieve full personality, instructions, and workflows of a ready-made agency agent."""
    agent = AgencyAgentLoader.load_agent(slug)
    if not agent:
        raise HTTPException(status_code=404, detail=f"Agency Agent '{slug}' not found.")
    return agent


@app.post("/api/seed")
async def seed_data(force: bool = False):
    """Reset and re-seed the 5 Dubai corridor baseline shipments."""
    seed_initial_data(force=force)
    return {"message": "Database successfully seeded with 5 baseline shipments."}
