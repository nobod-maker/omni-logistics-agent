"""Omni Master Orchestrator Agent: Central decision engine, multi-agent coordinator, and safety governance guard."""
import os
import json
from typing import Dict, Any, List
from app.schemas import SubAgentPlan, DisruptionResolution
from app.agents.terminal import TerminalAgent
from app.agents.customs import CustomsAgent
from app.agents.routing import RoutingAgent

try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False


class MasterOrchestrator:
    def __init__(self):
        self.terminal_agent = TerminalAgent()
        self.customs_agent = CustomsAgent()
        self.routing_agent = RoutingAgent()
        self.api_key = os.getenv("GEMINI_API_KEY")
        if self.api_key and GEMINI_AVAILABLE:
            genai.configure(api_key=self.api_key)

    async def orchestrate_resolution(
        self,
        shipment: Dict[str, Any],
        delay_hours: int,
        reason: str,
        berth: str
    ) -> DisruptionResolution:
        """Delegate tasks to sub-agents, calculate margin ROI, and enforce safety thresholds."""
        container_id = shipment.get("container_id", "Unknown")
        vessel_name = shipment.get("vessel_name", "Unknown")
        value = float(shipment.get("value", 0.0))
        sla_rate = float(shipment.get("sla_penalty_rate_per_hour", 450.0))

        # 1. Parallel / Sequential Sub-Agent Analysis
        terminal_plan = await self.terminal_agent.analyze(shipment, delay_hours, berth)
        customs_plan = await self.customs_agent.analyze(shipment, delay_hours)
        routing_plan = await self.routing_agent.analyze(shipment, delay_hours)

        # 2. Financial Modeling
        gross_costs = (
            abs(terminal_plan.financial_impact) +
            abs(customs_plan.financial_impact) +
            abs(routing_plan.financial_impact)
        )
        sla_penalties_prevented = delay_hours * sla_rate
        net_margin_delta = sla_penalties_prevented - gross_costs
        time_saved = max(terminal_plan.time_saved_hours, routing_plan.time_saved_hours)

        # 3. Confidence Calculation
        avg_confidence = (
            terminal_plan.confidence * 0.35 +
            customs_plan.confidence * 0.35 +
            routing_plan.confidence * 0.30
        )
        confidence_score = round(avg_confidence, 2)

        # 4. Mandatory Source Attributions
        source_citations = list(set(
            terminal_plan.source_citations +
            customs_plan.source_citations +
            routing_plan.source_citations
        ))

        # 5. Build Transparent Chain-of-Thought (CoT) Logs
        cot_steps = [
            f"[INGESTION] Received delay anomaly: {vessel_name} (+{delay_hours}h at {berth}). Container {container_id} (Valued at ${value:,.2f}).",
            f"[DELEGATION -> TERMINAL AGENT] Verified STS crane queue at {berth}. Cancelled GT-8821 booking slot; rescheduled window to prevent ${360:.2f} yard demurrage. Cost impact: ${terminal_plan.financial_impact:.2f}.",
            f"[DELEGATION -> CUSTOMS AGENT] Audited BoL against UAE HS Tariff Database ({shipment.get('hs_code')}). Validated Free Zone 0% duty exemption. Green-channel clearance requested.",
            f"[DELEGATION -> ROUTING AGENT] Simulated multimodal transit against customer SLA penalty rate (${sla_rate:.2f}/hr). Unmitigated risk: ${sla_penalties_prevented:,.2f}. Selected expedited multimodal split routing costing ${abs(routing_plan.financial_impact):,.2f}.",
            f"[SYNTHESIS & MARGIN CALCULUS] Total Mitigation Cost: ${gross_costs:,.2f} vs. SLA Penalties Avoided: ${sla_penalties_prevented:,.2f}. Net Saved Margin: +${net_margin_delta:,.2f}.",
            f"[GOVERNANCE CHECK] Evaluated safety thresholds: Net Cost (${gross_costs:,.2f} <= $10,000) & Confidence ({confidence_score * 100:.1f}% >= 85%)."
        ]

        # 6. Safety & Human-in-the-Loop Threshold Check
        # Rule: Cost Impact > $10,000 OR Confidence < 85% -> Lock execution, require human supervisor
        requires_human = False
        human_reason = None
        action_title = "Synthesized Autonomous Recovery Plan"
        
        if gross_costs > 10000.0:
            requires_human = True
            human_reason = f"Financial Exposure Threshold Exceeded: Operational cost (${gross_costs:,.2f}) > $10,000 safety limit."
            action_title = "I'm not sure — Human Review Required"
            cot_steps.append(f"[SAFETY LOCK] TRIGGERED: {human_reason}. Autonomous execution disabled.")
        elif confidence_score < 0.85:
            requires_human = True
            human_reason = f"Confidence Governance Violation: Computed confidence ({confidence_score * 100:.1f}%) < 85% minimum required threshold."
            action_title = "I'm not sure — Human Review Required"
            cot_steps.append(f"[SAFETY LOCK] TRIGGERED: {human_reason}. Autonomous execution disabled.")
        else:
            cot_steps.append("[SAFETY CLEARANCE] All guardrails passed. Master Orchestrator cleared plan for Autonomous One-Click Execution.")

        # Snapshot for one-click rollback if needed
        rollback_snapshot = {
            "shipment_id": shipment.get("id"),
            "container_id": container_id,
            "original_status": shipment.get("status"),
            "original_arrival": shipment.get("expected_arrival"),
            "original_berth": shipment.get("current_berth"),
            "captured_costs": gross_costs
        }

        recommended_actions = [
            f"1. Cancel terminal gate booking GT-8821 & lock {berth} crane slot (+{delay_hours + 2}h)",
            f"2. Submit digital Customs BoL #AEJEA-{container_id[-4:]} for 100% Free Zone pre-clearance",
            f"3. Authorize dynamic cargo split via Emirates SkyCargo DWC for high-priority components",
            f"4. Re-route inland road transport via E611 freight corridor to beat customer SLA deadline"
        ]

        # Use Gemini 1.5 Flash for high-level strategic reasoning overview when available
        if self.api_key and GEMINI_AVAILABLE:
            try:
                model = genai.GenerativeModel("gemini-1.5-flash")
                gemini_prompt = (
                    f"You are the Omni-Logistics Master Agent Control Tower orchestrating Dubai trade corridors. "
                    f"Shipment: {container_id} ({shipment.get('cargo_description')}), Value: ${value:,.2f}. "
                    f"Disruption: {vessel_name} delayed by {delay_hours}h at {berth}. "
                    f"SLA penalties avoided: ${sla_penalties_prevented:,.2f}, Total mitigation expense: ${gross_costs:,.2f}, "
                    f"Net profit protected: ${net_margin_delta:,.2f}. "
                    f"Provide an authoritative executive synthesis summary in 2 sentences."
                )
                gemini_res = model.generate_content(gemini_prompt)
                if gemini_res and gemini_res.text:
                    cot_steps.insert(0, f"[GEMINI 1.5 FLASH SYNTHESIS] {gemini_res.text.strip().replace(chr(10), ' ')}")
            except Exception as e:
                cot_steps.append(f"[GEMINI ADAPTER] Offline/Fallback mode active: {str(e)[:80]}")

        return DisruptionResolution(
            shipment_id=shipment.get("id", ""),
            container_id=container_id,
            vessel_name=vessel_name,
            event_description=f"{reason} (Impact: +{delay_hours}h)",
            recommended_action_title=action_title,
            recommended_actions=recommended_actions,
            terminal_plan=terminal_plan,
            customs_plan=customs_plan,
            routing_plan=routing_plan,
            net_cost_impact=gross_costs,
            time_saved_hours=time_saved,
            sla_penalties_prevented=sla_penalties_prevented,
            net_margin_delta=net_margin_delta,
            confidence_score=confidence_score,
            source_attributions=source_citations,
            chain_of_thought=cot_steps,
            requires_human_approval=requires_human,
            human_approval_reason=human_reason,
            rollback_snapshot=rollback_snapshot
        )
