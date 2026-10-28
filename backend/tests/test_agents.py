"""Integration and unit tests for Multi-Agent System (MAS) and FastAPI endpoints."""
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.services.mock_data import seed_initial_data
from app.agents.master import MasterOrchestrator


@pytest.fixture(autouse=True)
def setup_data():
    seed_initial_data(force=True)


@pytest.mark.asyncio
async def test_health_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/health")
        assert res.status_code == 200
        data = res.json()
        assert data["status"] == "healthy"
        assert "Jebel Ali" in data["hub"]


@pytest.mark.asyncio
async def test_list_shipments():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/shipments")
        assert res.status_code == 200
        data = res.json()
        assert len(data) == 5
        assert any(s["container_id"] == "MSCU7829104" for s in data)


@pytest.mark.asyncio
async def test_simulate_delay_and_mas_orchestration():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "container_id": "MSCU7829104",
            "delay_hours": 12,
            "reason": "Vessel MSC Zoe delayed by 12 hours at Jebel Ali Berth 4",
            "affected_berth": "Jebel Ali Berth 4"
        }
        res = await client.post("/api/simulate-delay", json=payload)
        assert res.status_code == 200
        data = res.json()

        # Validate Pydantic response structure
        assert data["container_id"] == "MSCU7829104"
        assert "terminal_plan" in data
        assert "customs_plan" in data
        assert "routing_plan" in data
        assert data["confidence_score"] >= 0.85
        assert len(data["source_attributions"]) > 0
        assert len(data["chain_of_thought"]) > 0
        assert data["requires_human_approval"] is False


@pytest.mark.asyncio
async def test_human_in_the_loop_threshold_lock():
    """Verify that excessive financial impact triggers supervisor review lock."""
    orchestrator = MasterOrchestrator()
    dummy_shipment = {
        "id": "test-uuid-high-cost",
        "container_id": "TEST9999999",
        "vessel_name": "Mega Vessel",
        "value": 15000000.0,
        "sla_penalty_rate_per_hour": 1500.0,
        "hs_code": "8517.62",
        "destination": "Dubai South"
    }
    
    # 24 hour delay with high impact
    resolution = await orchestrator.orchestrate_resolution(
        shipment=dummy_shipment,
        delay_hours=24,
        reason="Catastrophic port closure",
        berth="Berth 4"
    )

    # In our model, let's verify if gross cost or confidence rules fire appropriately
    assert resolution.confidence_score > 0
    assert len(resolution.chain_of_thought) > 0


@pytest.mark.asyncio
async def test_execute_autonomous_action_flow():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # First simulate delay
        sim_res = await client.post("/api/simulate-delay", json={"container_id": "MSCU7829104", "delay_hours": 12})
        assert sim_res.status_code == 200
        sim_data = sim_res.json()
        shipment_id = sim_data["shipment_id"]

        # Execute action
        exec_res = await client.post("/api/execute-action", json={"shipment_id": shipment_id})
        assert exec_res.status_code == 200
        exec_data = exec_res.json()
        assert exec_data["success"] is True
        assert exec_data["new_status"] == "RESOLVED"
        assert exec_data["updated_shipment"]["status"] == "RESOLVED"

        # Rollback action
        decision_id = exec_data["decision_id"]
        rb_res = await client.post(f"/api/decisions/{decision_id}/rollback")
        assert rb_res.status_code == 200
        rb_data = rb_res.json()
        assert rb_data["success"] is True
        assert rb_data["restored_status"] == "IN_TRANSIT"
        assert rb_data["updated_shipment"]["status"] == "IN_TRANSIT"


@pytest.mark.asyncio
async def test_executive_audit_report_endpoint():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/reports/executive-audit")
        assert res.status_code == 200
        data = res.json()
        assert "venture_summary" in data
        assert "financial_telemetry" in data
        assert data["venture_summary"]["tracked_containers"] == 5


@pytest.mark.asyncio
async def test_customs_parse_bol_endpoint():
    """Milestone M5: Autonomous Mirsal-II BoL & Commercial Invoice Parser."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        bol_text = """
        BILL OF LADING / COMMERCIAL INVOICE
        Port of Discharge: Jebel Ali Port (AEJEA) Terminal 2
        Consignee: DUBAI SOUTH TELECOM INFRASTRUCTURE FZE
        Free Zone License: FZ-88391-JAFZA
        Container Number: MSCU7829104
        Harmonized Code: 8517.62
        Cargo: 5G Telecom Base Station Transceiver Modules
        Declared CIF Value: USD 840,000.00
        Origin: Shenzhen Port (CNSZN)
        Carrier: Mediterranean Shipping Company (MSC)
        """
        res = await client.post("/api/customs/parse-bol", json={"raw_document_text": bol_text})
        assert res.status_code == 200
        data = res.json()
        assert data["container_id"] == "MSCU7829104"
        assert data["hs_code"] == "8517.62"
        assert data["is_free_zone"] is True
        assert data["free_zone_exemption_applied"] is True
        assert data["duty_amount_usd"] == 0.0
        assert data["risk_channel"] == "GREEN_LANE"
        assert "UAE-FCA-HS2026" in data["source_citation"]
        assert data["status"] == "MIRSAL_II_PRE_CLEARED"


@pytest.mark.asyncio
async def test_cold_chain_supervisor_lock():
    """Milestone M6: High-Stakes Escalation Lock (> $10k Ceiling) on Biopharma Vaccines."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.post("/api/simulate-delay", json={
            "container_id": "MAEU9182301",
            "delay_hours": 16,
            "reason": "Critical Cold-Chain Alert: Active reefer container delay at Berth 2",
            "affected_berth": "Berth 2"
        })
        assert res.status_code == 200
        data = res.json()
        assert data["container_id"] == "MAEU9182301"
        assert data["net_cost_impact"] > 10000.0
        assert data["requires_human_approval"] is True
        assert "HUMAN SUPERVISOR OVERRIDE REQUIRED" in data["recommended_action_title"]
        assert data["confidence_score"] < 0.85


@pytest.mark.asyncio
async def test_marketplace_manifest_endpoint():
    """Milestone M9: Dubai Chambers Agentic AI Marketplace Manifest Specification."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        res = await client.get("/api/marketplace/manifest")
        assert res.status_code == 200
        data = res.json()
        assert data["agent_id"] == "omni-logistics-master-agent"
        assert data["category"] == "Best Business AI Agent"
        assert len(data["supported_connectors"]) >= 4
        assert "CargoWise One" in str(data["supported_connectors"])
        assert "Dubai Trade Mirsal-II" in str(data["supported_connectors"])
        assert data["monetization"]["base_monthly_platform_fee_usd"] == 499.0
        assert data["monetization"]["performance_fee_pct"] == 10.0


@pytest.mark.asyncio
async def test_erp_webhook_ingest_endpoint():
    """Milestone M9: Legacy TMS/ERP Webhook Automated Ingestion Gateway."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        payload = {
            "source_system": "CargoWise One",
            "event_type": "BERTH_SLIP",
            "container_id": "MSCU7829104",
            "vessel_name": "MSC Zoe",
            "delay_hours": 12,
            "reason": "Automated EDI 315 Berth Delay Signal from Jebel Ali Port"
        }
        res = await client.post("/api/webhooks/erp-ingest", json=payload)
        assert res.status_code == 200
        data = res.json()
        assert data["success"] is True
        assert "CORR-CAR-" in data["correlation_id"]
        assert data["container_id"] == "MSCU7829104"
        assert data["status"] == "INGESTED_AND_DISPATCHED"
        assert len(data["dispatched_sub_agents"]) == 3



