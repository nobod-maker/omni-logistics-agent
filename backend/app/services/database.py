"""Database abstraction layer supporting local SQLite fallback and Supabase."""
import os
import json
import sqlite3
import uuid
from datetime import datetime
from typing import List, Optional, Dict, Any
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DB_PATH = Path(__file__).resolve().parent.parent.parent / "omni_logistics.db"


def get_db_connection():
    """Get a connection to the local database."""
    conn = sqlite3.connect(str(DB_PATH))
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """Initialize database tables with exact blueprint schema."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # Shipments table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS shipments (
        id TEXT PRIMARY KEY,
        container_id TEXT NOT NULL UNIQUE,
        vessel_name TEXT NOT NULL,
        origin_port TEXT NOT NULL,
        destination TEXT NOT NULL,
        status TEXT NOT NULL,
        expected_arrival TEXT NOT NULL,
        cargo_description TEXT NOT NULL,
        hs_code TEXT NOT NULL,
        value REAL NOT NULL,
        sla_deadline TEXT NOT NULL,
        sla_penalty_rate_per_hour REAL NOT NULL,
        carrier TEXT DEFAULT 'MSC',
        current_berth TEXT DEFAULT 'Berth 4',
        created_at TEXT NOT NULL
    )
    """)

    # Events table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        shipment_id TEXT NOT NULL,
        event_type TEXT NOT NULL,
        severity TEXT NOT NULL,
        description TEXT NOT NULL,
        impact_hours INTEGER NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY(shipment_id) REFERENCES shipments(id)
    )
    """)

    # Agent decisions audit table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS agent_decisions (
        id TEXT PRIMARY KEY,
        shipment_id TEXT NOT NULL,
        sub_agent TEXT NOT NULL,
        proposed_action TEXT NOT NULL,
        cost_impact REAL NOT NULL,
        time_saved_hours REAL NOT NULL,
        confidence_score REAL NOT NULL,
        reasoning_cot TEXT,
        requires_human_approval INTEGER DEFAULT 0,
        executed INTEGER DEFAULT 0,
        created_at TEXT NOT NULL,
        executed_at TEXT,
        FOREIGN KEY(shipment_id) REFERENCES shipments(id)
    )
    """)

    conn.commit()
    conn.close()


def get_all_shipments() -> List[Dict[str, Any]]:
    """Retrieve all tracked shipments."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM shipments ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_shipment_by_id(shipment_id: str) -> Optional[Dict[str, Any]]:
    """Get single shipment by UUID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM shipments WHERE id = ? OR container_id = ?", (shipment_id, shipment_id))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def update_shipment_status(shipment_id: str, new_status: str) -> Optional[Dict[str, Any]]:
    """Update shipment status (e.g. DELAYED, RESOLVED)."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE shipments SET status = ? WHERE id = ? OR container_id = ?", (new_status, shipment_id, shipment_id))
    conn.commit()
    cursor.execute("SELECT * FROM shipments WHERE id = ? OR container_id = ?", (shipment_id, shipment_id))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None


def create_event(shipment_id: str, event_type: str, severity: str, description: str, impact_hours: int) -> Dict[str, Any]:
    """Record an operational disruption event."""
    conn = get_db_connection()
    cursor = conn.cursor()
    event_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat() + "Z"
    cursor.execute("""
    INSERT INTO events (id, shipment_id, event_type, severity, description, impact_hours, timestamp)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (event_id, shipment_id, event_type, severity, description, impact_hours, now))
    conn.commit()
    conn.close()
    return {
        "id": event_id,
        "shipment_id": shipment_id,
        "event_type": event_type,
        "severity": severity,
        "description": description,
        "impact_hours": impact_hours,
        "timestamp": now
    }


def get_events_for_shipment(shipment_id: str) -> List[Dict[str, Any]]:
    """Get disruption events for a shipment."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM events WHERE shipment_id = ? ORDER BY timestamp DESC", (shipment_id,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def get_recent_events(limit: int = 10) -> List[Dict[str, Any]]:
    """Get global recent disruption events."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM events ORDER BY timestamp DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]


def record_agent_decision(
    shipment_id: str,
    sub_agent: str,
    proposed_action: Dict[str, Any],
    cost_impact: float,
    time_saved_hours: float,
    confidence_score: float,
    reasoning_cot: str,
    requires_human_approval: bool = False
) -> Dict[str, Any]:
    """Store audit record of an agent decision."""
    conn = get_db_connection()
    cursor = conn.cursor()
    decision_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat() + "Z"
    cursor.execute("""
    INSERT INTO agent_decisions (
        id, shipment_id, sub_agent, proposed_action, cost_impact,
        time_saved_hours, confidence_score, reasoning_cot, requires_human_approval, executed, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
    """, (
        decision_id, shipment_id, sub_agent, json.dumps(proposed_action),
        cost_impact, time_saved_hours, confidence_score, reasoning_cot,
        1 if requires_human_approval else 0, now
    ))
    conn.commit()
    conn.close()
    return {
        "id": decision_id,
        "shipment_id": shipment_id,
        "sub_agent": sub_agent,
        "proposed_action": proposed_action,
        "cost_impact": cost_impact,
        "time_saved_hours": time_saved_hours,
        "confidence_score": confidence_score,
        "reasoning_cot": reasoning_cot,
        "requires_human_approval": requires_human_approval,
        "executed": False,
        "created_at": now
    }


def execute_agent_decision(decision_id: str) -> Optional[Dict[str, Any]]:
    """Mark an agent decision as executed and resolve the underlying shipment."""
    conn = get_db_connection()
    cursor = conn.cursor()
    now = datetime.utcnow().isoformat() + "Z"
    cursor.execute("""
    UPDATE agent_decisions
    SET executed = 1, executed_at = ?
    WHERE id = ?
    """, (now, decision_id))
    
    cursor.execute("SELECT * FROM agent_decisions WHERE id = ?", (decision_id,))
    decision_row = cursor.fetchone()
    if not decision_row:
        conn.close()
        return None

    shipment_id = decision_row["shipment_id"]
    cursor.execute("UPDATE shipments SET status = 'RESOLVED' WHERE id = ?", (shipment_id,))
    conn.commit()

    cursor.execute("SELECT * FROM shipments WHERE id = ?", (shipment_id,))
    shipment_row = cursor.fetchone()
    conn.close()

    decision_dict = dict(decision_row)
    decision_dict["proposed_action"] = json.loads(decision_dict["proposed_action"])
    decision_dict["requires_human_approval"] = bool(decision_dict["requires_human_approval"])
    decision_dict["executed"] = bool(decision_dict["executed"])
    decision_dict["updated_shipment"] = dict(shipment_row) if shipment_row else None
    return decision_dict


def rollback_agent_decision(decision_id: str) -> Optional[Dict[str, Any]]:
    """Restore previous shipment status using rollback snapshot and log ROLLED_BACK audit event."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM agent_decisions WHERE id = ?", (decision_id,))
    decision_row = cursor.fetchone()
    if not decision_row:
        conn.close()
        return None

    shipment_id = decision_row["shipment_id"]
    raw_action = decision_row["proposed_action"]
    proposed_action = json.loads(raw_action) if isinstance(raw_action, str) else raw_action
    
    snapshot = proposed_action.get("rollback_snapshot", {}) if isinstance(proposed_action, dict) else {}
    target_status = snapshot.get("original_status", "DELAYED")
    if target_status == "RESOLVED":
        target_status = "DELAYED"

    cursor.execute("UPDATE shipments SET status = ? WHERE id = ?", (target_status, shipment_id))
    cursor.execute("UPDATE agent_decisions SET executed = 0, executed_at = NULL WHERE id = ?", (decision_id,))

    event_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat() + "Z"
    cursor.execute("""
    INSERT INTO events (id, shipment_id, event_type, severity, description, impact_hours, timestamp)
    VALUES (?, ?, 'ROLLED_BACK', 'MEDIUM', ?, 0, ?)
    """, (event_id, shipment_id, f"Operator reverted autonomous fix for decision {decision_id[:8]}. Restored status to {target_status}.", now))

    conn.commit()
    cursor.execute("SELECT * FROM shipments WHERE id = ?", (shipment_id,))
    shipment_row = cursor.fetchone()
    conn.close()

    return {
        "success": True,
        "decision_id": decision_id,
        "shipment_id": shipment_id,
        "restored_status": target_status,
        "updated_shipment": dict(shipment_row) if shipment_row else None,
        "rolled_back_at": now
    }



def get_agent_decisions(shipment_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """Get audit history of agent decisions."""
    conn = get_db_connection()
    cursor = conn.cursor()
    if shipment_id:
        cursor.execute("SELECT * FROM agent_decisions WHERE shipment_id = ? ORDER BY created_at DESC", (shipment_id,))
    else:
        cursor.execute("SELECT * FROM agent_decisions ORDER BY created_at DESC")
    rows = cursor.fetchall()
    conn.close()
    results = []
    for r in rows:
        d = dict(r)
        d["proposed_action"] = json.loads(d["proposed_action"]) if isinstance(d["proposed_action"], str) else d["proposed_action"]
        d["requires_human_approval"] = bool(d["requires_human_approval"])
        d["executed"] = bool(d["executed"])
        results.append(d)
    return results
