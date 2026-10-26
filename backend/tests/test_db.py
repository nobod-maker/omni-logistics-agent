"""Unit tests for database abstraction and synthetic seed data."""
import pytest
from app.services.database import (
    init_db,
    get_all_shipments,
    get_shipment_by_id,
    update_shipment_status,
    create_event,
    record_agent_decision,
    execute_agent_decision,
    get_agent_decisions
)
from app.services.mock_data import seed_initial_data, get_tariff_info


def test_database_initialization_and_seeding():
    """Verify database creates tables and seeds 5 baseline shipments."""
    init_db()
    seed_initial_data(force=True)
    shipments = get_all_shipments()
    
    assert len(shipments) == 5
    container_ids = [s["container_id"] for s in shipments]
    assert "MSCU7829104" in container_ids
    assert "MAEU9182301" in container_ids


def test_shipment_retrieval_and_status_update():
    """Verify retrieval by ID and updating shipment status."""
    shipments = get_all_shipments()
    assert len(shipments) > 0
    target = shipments[0]

    updated = update_shipment_status(target["id"], "DELAYED")
    assert updated["status"] == "DELAYED"

    fetched = get_shipment_by_id(target["id"])
    assert fetched["status"] == "DELAYED"


def test_event_creation():
    """Verify creation and query of disruption events."""
    shipments = get_all_shipments()
    target_id = shipments[0]["id"]

    event = create_event(
        shipment_id=target_id,
        event_type="AIS_DELAY",
        severity="HIGH",
        description="Vessel delayed by 12 hours at Berth 4",
        impact_hours=12
    )
    assert event["event_type"] == "AIS_DELAY"
    assert event["impact_hours"] == 12


def test_tariff_lookup_attribution():
    """Verify UAE HS code tariff lookup returns source citations."""
    tariff = get_tariff_info("8517.62")
    assert tariff["hs_code"] == "8517.62"
    assert "Mock-UAE-Tariff" in tariff["source_citation"]
    assert "TDRA" in str(tariff["required_documents"])


def test_agent_decision_audit_and_execution():
    """Verify recording an agent decision and executing resolution write-back."""
    shipments = get_all_shipments()
    target_id = shipments[0]["id"]

    decision = record_agent_decision(
        shipment_id=target_id,
        sub_agent="Omni Master Orchestrator",
        proposed_action={"action": "Reschedule gate slot & split air freight"},
        cost_impact=1645.0,
        time_saved_hours=10.0,
        confidence_score=0.95,
        reasoning_cot="Test Chain-of-thought",
        requires_human_approval=False
    )
    assert decision["executed"] is False

    exec_result = execute_agent_decision(decision["id"])
    assert exec_result["executed"] is True
    assert exec_result["updated_shipment"]["status"] == "RESOLVED"
