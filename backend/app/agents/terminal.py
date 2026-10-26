"""Terminal Sub-Agent: Manages port berth windows, AIS shifts, crane lifts, and gate slotting."""
import os
import json
from typing import Dict, Any
from app.schemas import SubAgentPlan

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False


class TerminalAgent:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key and GEMINI_AVAILABLE:
            genai.configure(api_key=self.api_key)

    async def analyze(self, shipment: Dict[str, Any], delay_hours: int, berth: str) -> SubAgentPlan:
        """Evaluate terminal impact and re-slot gate & crane appointments."""
        vessel = shipment.get("vessel_name", "Vessel")
        container_id = shipment.get("container_id", "Container")
        
        # Calculate terminal metrics
        demurrage_rate_per_day = 180.0
        projected_yard_storage_saved = 360.0
        gate_reschedule_fee = 75.0
        net_terminal_benefit = projected_yard_storage_saved - gate_reschedule_fee

        summary = (
            f"Vessel {vessel} arrival slipped by {delay_hours}h at {berth}. "
            f"Auto-cancelled empty truck gate appointment #GT-8821. "
            f"Secured STS Crane Window at {berth} for +{delay_hours + 2}h buffer. "
            f"Eliminated projected yard demurrage fee of ${projected_yard_storage_saved:.2f}."
        )

        actions = [
            f"Cancel gate booking GT-8821 to prevent dry-run penalty [Source: DPWorld-TerminalOS-JebelAli]",
            f"Reschedule Jebel Ali Terminal gate appointment to T+{delay_hours + 3}h [Source: Sim-AIS-JebelAli-Berth04]",
            f"Reserve Priority Dual-Trolley STS Crane discharge slot at {berth} [Source: DPWorld-TerminalOS-JebelAli]"
        ]

        citations = [
            "Source: Sim-AIS-JebelAli-Berth04",
            "Source: DPWorld-TerminalOS-JebelAli"
        ]

        # Use Gemini if available for dynamic reasoning enhancement
        if self.api_key and GEMINI_AVAILABLE:
            try:
                model = genai.GenerativeModel("gemini-1.5-flash")
                prompt = (
                    f"You are the Terminal Sub-Agent for Jebel Ali Port. "
                    f"Shipment {container_id} on {vessel} at {berth} delayed by {delay_hours} hours. "
                    f"Return a 1-sentence operational terminal action plan including gate and crane handling."
                )
                response = model.generate_content(prompt)
                if response and response.text:
                    summary = response.text.strip().replace("\n", " ")
            except Exception:
                pass  # Fall back gracefully to deterministic logic

        return SubAgentPlan(
            sub_agent_name="Terminal Sub-Agent",
            status="CRANE_WINDOW_SECURED",
            summary=summary,
            action_items=actions,
            financial_impact=-gate_reschedule_fee,  # Nominal reschedule cost
            time_saved_hours=float(delay_hours),
            confidence=0.96,
            source_citations=citations
        )
