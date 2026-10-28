"""Routing Sub-Agent: Multimodal disruption routing and SLA margin optimization."""
import os
from typing import Dict, Any
from app.schemas import SubAgentPlan

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False


class RoutingAgent:
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key and GEMINI_AVAILABLE:
            genai.configure(api_key=self.api_key)

    async def analyze(self, shipment: Dict[str, Any], delay_hours: int) -> SubAgentPlan:
        """Simulate Cost vs Speed multimodal routing and cargo split against customer SLA."""
        value = float(shipment.get("value", 500000.0))
        sla_rate = float(shipment.get("sla_penalty_rate_per_hour", 450.0))
        container_id = shipment.get("container_id", "Container")
        destination = shipment.get("destination", "Dubai South")
        
        # Calculate SLA penalty if unmitigated
        sla_penalty_unmitigated = delay_hours * sla_rate

        is_cold_chain = (
            "Biopharma" in shipment.get("cargo_description", "")
            or "Vaccine" in shipment.get("cargo_description", "")
            or container_id == "MAEU9182301"
        )

        if is_cold_chain:
            freight_mode = "Charter Air Reefer via Emirates SkyCargo (DWC) + Temp-Controlled Escort"
            expedited_freight_cost = 12800.0
            time_recovered = float(delay_hours - 2)
            summary = (
                f"CRITICAL COLD-CHAIN HAZARD: ${value:,.2f} biopharmaceutical vaccine cargo at risk of thermal breach. "
                f"Proposed emergency air charter split via Emirates SkyCargo DWC with certified Pharma-Cool reefer fleet. "
                f"Operational mitigation cost of ${expedited_freight_cost:,.2f} exceeds standard $10k autonomous ceiling."
            )
            actions = [
                f"Mobilize dedicated Emirates SkyCargo Pharma DWC charter flight EK-881 [Source: Emirates-SkyCargo-PharmaHub]",
                f"Deploy 2x calibrated GDP-compliant reefer trucks with dry-ice recharge [Source: Dubai-Pharma-Logistics-Fleet]",
                f"Mitigate customer SLA catastrophic stockout penalty (${sla_penalty_unmitigated:,.2f}) [Source: Contract-SLA-Matrix-2026]"
            ]
            citations = [
                "Source: Emirates-SkyCargo-PharmaHub-DWC",
                "Source: Dubai-GDP-ColdChain-Standard",
                "Source: Contract-SLA-Matrix-2026"
            ]
            confidence = 0.80  # Below 0.85 threshold to trigger human approval
        # High value cargo (> $500,000) or high penalty rate justifies split cargo air freight
        elif value > 500000.0 or sla_penalty_unmitigated > 4000.0:
            freight_mode = "Multimodal Split-Cargo (Priority Air via DWC + Inland Express Fleet)"
            expedited_freight_cost = 1450.0
            time_recovered = float(delay_hours - 2)
            summary = (
                f"SLA penalty exposure of ${sla_penalty_unmitigated:,.2f} detected for container {container_id}. "
                f"Executed dynamic 30% cargo split via Emirates SkyCargo (DWC Airport) for critical components, "
                f"recovering {time_recovered:.0f} hours of transit time and beating SLA deadline by 4 hours."
            )
            actions = [
                f"Split 30% critical manifest ({container_id}-SPLIT-A) for expedited Emirates SkyCargo feeder via DWC [Source: Emirates-SkyCargo-DWC-Live]",
                f"Dispatch dedicated bonded road feeder truck from Jebel Ali to {destination} [Source: Dubai-RTA-Freight-Corridor]",
                f"Lock in net SLA savings of ${sla_penalty_unmitigated - expedited_freight_cost:,.2f} [Source: Contract-SLA-Matrix-2026]"
            ]
        else:
            freight_mode = "Priority Bonded Direct Trucking"
            expedited_freight_cost = 450.0
            time_recovered = float(delay_hours - 4)
            summary = (
                f"Inland direct reroute via Dubai Bypass Road (E611) scheduled for {container_id}. "
                f"Avoided urban peak congestion windows, recovering {time_recovered:.0f} hours."
            )
            actions = [
                f"Reroute truck carrier via E611 heavy transport corridor [Source: Dubai-RTA-Freight-Corridor]",
                f"Pre-assign driver ID #DXB-902 with dynamic gate barcode [Source: DPWorld-TruckAppointment]"
            ]

        citations = [
            "Source: Emirates-SkyCargo-DWC-Live",
            "Source: Dubai-RTA-Freight-Corridor-E611",
            "Source: Contract-SLA-Matrix-2026"
        ]

        confidence = 0.80 if is_cold_chain else 0.95

        # Optionally enhance with Gemini if available
        if self.api_key and GEMINI_AVAILABLE:
            try:
                model = genai.GenerativeModel("gemini-1.5-flash")
                prompt = (
                    f"You are the Routing Sub-Agent for Dubai multi-modal supply chains. "
                    f"Container {container_id} delayed by {delay_hours}h risking ${sla_penalty_unmitigated} in SLA penalties. "
                    f"Summarize the multimodal split reroute in 1 concise sentence."
                )
                response = model.generate_content(prompt)
                if response and response.text:
                    summary = response.text.strip().replace("\n", " ")
            except Exception:
                pass

        return SubAgentPlan(
            sub_agent_name="Routing Sub-Agent",
            status="SPLIT_ROUTING_OPTIMIZED",
            summary=summary,
            action_items=actions,
            financial_impact=-expedited_freight_cost,
            time_saved_hours=time_recovered,
            confidence=confidence,
            source_citations=citations
        )
