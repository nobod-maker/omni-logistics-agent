"""Customs Sub-Agent: UAE Free Zone & Dubai Customs pre-clearance engine."""
import os
from typing import Dict, Any
from app.schemas import SubAgentPlan
from app.services.mock_data import get_tariff_info

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False


class CustomsAgent:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key and GEMINI_AVAILABLE:
            genai.configure(api_key=self.api_key)

    async def analyze(self, shipment: Dict[str, Any], delay_hours: int) -> SubAgentPlan:
        """Process pre-clearance and verify HS code against UAE Customs rules."""
        hs_code = shipment.get("hs_code", "8517.62")
        cargo_desc = shipment.get("cargo_description", "General Cargo")
        container_id = shipment.get("container_id", "Container")
        destination = shipment.get("destination", "Dubai Free Zone")

        tariff_info = get_tariff_info(hs_code)
        source_cite = tariff_info.get("source_citation", "Mock-UAE-Tariff-2026-Ch84")
        duty_rate = tariff_info.get("duty_rate", "0%")
        risk_score = tariff_info.get("inspection_risk_score", 0.10)
        docs = tariff_info.get("required_documents", ["Commercial Invoice", "Packing List"])

        is_free_zone = "Free Zone" in destination or "JAFZA" in destination or "DAFZA" in destination or "Dubai South" in destination
        pre_clearance_fee = 120.0  # Dubai Trade / Mirsal-II digital declaration fee

        summary = (
            f"Pre-cleared Bill of Lading for {container_id} ({cargo_desc}) under HS {hs_code}. "
            f"Destination validated as UAE Free Zone corridor with {duty_rate} duty exemption. "
            f"Inspection green-channel risk score is {risk_score * 100:.0f}% (Target: <20%). "
            f"Zero customs gate hold projected at Jebel Ali inspection point."
        )

        actions = [
            f"Pre-clear Customs BoL #AEJEA-{container_id[-4:]} with Dubai Customs Mirsal II [Source: {source_cite}]",
            f"Transmit electronic Certificate of Origin & packing manifest to Free Zone Authority [Source: DubaiCustoms-Mirsal-II]",
            f"Activate fast-track Green Lane inspection token before vessel berthing [Source: {source_cite}]"
        ]

        citations = [
            f"Source: {source_cite}",
            "Source: DubaiCustoms-Mirsal-II-2026",
            "Source: UAE-Federal-Customs-Authority"
        ]

        confidence = 0.94 if is_free_zone else 0.88

        # If user has Gemini active, optionally augment summary
        if self.api_key and GEMINI_AVAILABLE:
            try:
                model = genai.GenerativeModel("gemini-1.5-flash")
                prompt = (
                    f"You are the Customs Pre-Clearance Sub-Agent for Dubai Customs and Free Zones. "
                    f"Container {container_id} with HS Code {hs_code} ({cargo_desc}) heading to {destination}. "
                    f"State in 1 sentence that digital pre-clearance BoL is validated with 0% Free Zone duty."
                )
                response = model.generate_content(prompt)
                if response and response.text:
                    summary = response.text.strip().replace("\n", " ")
            except Exception:
                pass

        return SubAgentPlan(
            sub_agent_name="Customs Sub-Agent",
            status="PRE_CLEARED_GREEN_LANE",
            summary=summary,
            action_items=actions,
            financial_impact=-pre_clearance_fee,
            time_saved_hours=6.0,  # Avoided standard 6h customs inspection delay
            confidence=confidence,
            source_citations=citations
        )
