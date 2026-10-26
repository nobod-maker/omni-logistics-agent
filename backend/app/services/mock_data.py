"""Deterministic synthetic Dubai corridor shipment and logistics telemetry generator.

Under MIT Project License as required by Omni-Logistics Master Agent Blueprint.
All live vessel AIS telemetry, port weather, buyer records, and UAE customs rules
are generated deterministically.
"""
import uuid
from datetime import datetime, timedelta
from typing import List, Dict, Any
from app.services.database import (
    get_db_connection,
    init_db,
    get_all_shipments
)

# Synthetic UAE Customs Tariff Database with strict source citations
MOCK_UAE_TARIFF_DATABASE = {
    "8517.62": {
        "hs_code": "8517.62",
        "description": "Machines for the transmission or reception of voice, images or other data, including switching and routing apparatus",
        "category": "Telecommunications & Networking",
        "duty_rate": "0% (Free Zone Exemption) / 5% Mainland",
        "vat_rate": "5%",
        "required_documents": [
            "Commercial Invoice",
            "Packing List",
            "Certificate of Origin (Chamber of Commerce)",
            "TDRA (Telecommunications and Digital Government Regulatory Authority) Type Approval"
        ],
        "inspection_risk_score": 0.12,
        "source_citation": "Mock-UAE-Tariff-2026-Ch85"
    },
    "3002.20": {
        "hs_code": "3002.20",
        "description": "Vaccines for human medicine",
        "category": "Pharmaceuticals & Cold Chain",
        "duty_rate": "0% (Exempt under Essential Medical Goods)",
        "vat_rate": "0%",
        "required_documents": [
            "Commercial Invoice",
            "MOHAP (Ministry of Health & Prevention) Import Permit",
            "Cold Chain Temperature Telemetry Log",
            "Batch Release Certificate"
        ],
        "inspection_risk_score": 0.05,
        "source_citation": "Mock-UAE-Tariff-2026-Ch30"
    },
    "8507.60": {
        "hs_code": "8507.60",
        "description": "Lithium-ion accumulators / battery packs",
        "category": "Hazardous Material / Energy Storage",
        "duty_rate": "5% (Free Zone Transit 0%)",
        "vat_rate": "5%",
        "required_documents": [
            "Commercial Invoice",
            "Material Safety Data Sheet (MSDS)",
            "UN 38.3 Test Summary",
            "Dubai Civil Defense Dangerous Goods Permit"
        ],
        "inspection_risk_score": 0.35,
        "source_citation": "Mock-UAE-Tariff-2026-Ch85"
    },
    "8803.30": {
        "hs_code": "8803.30",
        "description": "Other parts of airplanes or helicopters (Avionics and mechanical systems)",
        "category": "Aerospace & Aviation",
        "duty_rate": "0% (Civil Aviation Exemption)",
        "vat_rate": "0%",
        "required_documents": [
            "Commercial Invoice",
            "FAA/EASA Dual Release Certificate Form 1",
            "End-User Certificate (GCAA Approved)"
        ],
        "inspection_risk_score": 0.08,
        "source_citation": "Mock-UAE-Tariff-2026-Ch88"
    },
    "8504.40": {
        "hs_code": "8504.40",
        "description": "Static converters, power inverters and smart grid rectifiers",
        "category": "Clean Energy & Renewable Infrastructure",
        "duty_rate": "0% (Green Energy Transition Scheme)",
        "vat_rate": "5%",
        "required_documents": [
            "Commercial Invoice",
            "DEWA (Dubai Electricity & Water Authority) Compliance Certificate",
            "IEC 62109 Safety Standard Report"
        ],
        "inspection_risk_score": 0.15,
        "source_citation": "Mock-UAE-Tariff-2026-Ch85"
    }
}


def generate_seed_shipments() -> List[Dict[str, Any]]:
    """Produce the 5 primary Dubai corridor baseline shipments."""
    now = datetime.utcnow()
    
    return [
        {
            "id": "c1f7a834-82a1-4d1a-821b-10f847190001",
            "container_id": "MSCU7829104",
            "vessel_name": "MSC Zoe",
            "origin_port": "Shanghai (CNSHA)",
            "destination": "Jebel Ali Port (AEJEA) -> Dubai South Logistics District",
            "status": "IN_TRANSIT",
            "expected_arrival": (now + timedelta(hours=6)).isoformat() + "Z",
            "cargo_description": "High-Precision 5G Base Stations & Network Switches",
            "hs_code": "8517.62",
            "value": 840000.0,
            "sla_deadline": (now + timedelta(hours=14)).isoformat() + "Z",
            "sla_penalty_rate_per_hour": 450.0,
            "carrier": "MSC",
            "current_berth": "Berth 4",
            "created_at": now.isoformat() + "Z"
        },
        {
            "id": "c1f7a834-82a1-4d1a-821b-10f847190002",
            "container_id": "MAEU9182301",
            "vessel_name": "Maersk Mc-Kinney Moller",
            "origin_port": "Rotterdam (NLRTM)",
            "destination": "Jebel Ali Port (AEJEA) -> JAFZA Free Zone North",
            "status": "IN_TRANSIT",
            "expected_arrival": (now + timedelta(hours=18)).isoformat() + "Z",
            "cargo_description": "Temperature-Controlled Biopharmaceutical Vaccines (2-8°C)",
            "hs_code": "3002.20",
            "value": 1250000.0,
            "sla_deadline": (now + timedelta(hours=26)).isoformat() + "Z",
            "sla_penalty_rate_per_hour": 850.0,
            "carrier": "Maersk",
            "current_berth": "Berth 2",
            "created_at": now.isoformat() + "Z"
        },
        {
            "id": "c1f7a834-82a1-4d1a-821b-10f847190003",
            "container_id": "CMAU6521908",
            "vessel_name": "CMA CGM Saint Exupery",
            "origin_port": "Busan (KRPUS)",
            "destination": "Jebel Ali Port (AEJEA) -> Al Quoz Industrial Area 3",
            "status": "IN_TRANSIT",
            "expected_arrival": (now + timedelta(hours=11)).isoformat() + "Z",
            "cargo_description": "EV Lithium-Ion Battery Storage Modules",
            "hs_code": "8507.60",
            "value": 320000.0,
            "sla_deadline": (now + timedelta(hours=22)).isoformat() + "Z",
            "sla_penalty_rate_per_hour": 250.0,
            "carrier": "CMA CGM",
            "current_berth": "Berth 4",
            "created_at": now.isoformat() + "Z"
        },
        {
            "id": "c1f7a834-82a1-4d1a-821b-10f847190004",
            "container_id": "HLCU4901842",
            "vessel_name": "Hapag-Lloyd Al Jmeliyah",
            "origin_port": "Hamburg (DEHAM)",
            "destination": "Jebel Ali Port (AEJEA) -> DAFZA (Dubai Airport Freezone)",
            "status": "IN_TRANSIT",
            "expected_arrival": (now + timedelta(hours=3)).isoformat() + "Z",
            "cargo_description": "Precision Aircraft Avionics & Hydraulic Assemblies",
            "hs_code": "8803.30",
            "value": 620000.0,
            "sla_deadline": (now + timedelta(hours=8)).isoformat() + "Z",
            "sla_penalty_rate_per_hour": 600.0,
            "carrier": "Hapag-Lloyd",
            "current_berth": "Berth 1",
            "created_at": now.isoformat() + "Z"
        },
        {
            "id": "c1f7a834-82a1-4d1a-821b-10f847190005",
            "container_id": "ONEU3098125",
            "vessel_name": "ONE Apus",
            "origin_port": "Yokohama (JPYOK)",
            "destination": "Jebel Ali Port (AEJEA) -> Dubai Industrial City (DIC)",
            "status": "IN_TRANSIT",
            "expected_arrival": (now + timedelta(hours=36)).isoformat() + "Z",
            "cargo_description": "Solar PV Inverters & Grid Tie Rectifiers",
            "hs_code": "8504.40",
            "value": 195000.0,
            "sla_deadline": (now + timedelta(hours=48)).isoformat() + "Z",
            "sla_penalty_rate_per_hour": 150.0,
            "carrier": "ONE",
            "current_berth": "Berth 3",
            "created_at": now.isoformat() + "Z"
        }
    ]


def seed_initial_data(force: bool = False):
    """Ensure database has the 5 standard shipments seeded."""
    init_db()
    existing = get_all_shipments()
    if existing and not force:
        return

    conn = get_db_connection()
    cursor = conn.cursor()
    
    if force:
        cursor.execute("DELETE FROM events")
        cursor.execute("DELETE FROM agent_decisions")
        cursor.execute("DELETE FROM shipments")

    shipments = generate_seed_shipments()
    for s in shipments:
        cursor.execute("""
        INSERT OR REPLACE INTO shipments (
            id, container_id, vessel_name, origin_port, destination,
            status, expected_arrival, cargo_description, hs_code, value,
            sla_deadline, sla_penalty_rate_per_hour, carrier, current_berth, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            s["id"], s["container_id"], s["vessel_name"], s["origin_port"], s["destination"],
            s["status"], s["expected_arrival"], s["cargo_description"], s["hs_code"], s["value"],
            s["sla_deadline"], s["sla_penalty_rate_per_hour"], s["carrier"], s["current_berth"], s["created_at"]
        ))

    conn.commit()
    conn.close()


def get_tariff_info(hs_code: str) -> Dict[str, Any]:
    """Retrieve official simulated UAE customs tariff record with source attribution."""
    clean_code = hs_code.strip()
    if clean_code in MOCK_UAE_TARIFF_DATABASE:
        return MOCK_UAE_TARIFF_DATABASE[clean_code]
    
    # Generic fallback
    return {
        "hs_code": clean_code,
        "description": "General Commercial Goods (Customs classification pending)",
        "category": "Standard Goods",
        "duty_rate": "5%",
        "vat_rate": "5%",
        "required_documents": ["Commercial Invoice", "Packing List", "Certificate of Origin"],
        "inspection_risk_score": 0.20,
        "source_citation": "Mock-UAE-Tariff-2026-Ch99-Fallback"
    }
