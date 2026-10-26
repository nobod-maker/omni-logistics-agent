# Omni-Logistics Agent Project Rules

## Tech Stack & Exact Versions
- Frontend: Next.js 14.2+ (App Router), TailwindCSS 3.4+, TypeScript 5+, Lucide Icons.
- Backend: Python 3.11+, FastAPI 0.110+, CrewAI / LangGraph / Gemini Multi-Agent System, Pydantic 2.6+, google-genai SDK.
- Database & LLM: Supabase (PostgreSQL 15) / Local SQLite Fallback | Gemini 1.5 Flash via Google AI Studio.

## Folder Structure & Naming Rules
- `/frontend/src/app` (Next.js routes), `/frontend/src/components` (PascalCase UI components).
- `/backend/app/main.py` (FastAPI entry), `/backend/app/agents/` (Multi-agent system definitions), `/backend/app/services/mock_data.py` (synthetic simulator), `/backend/app/schemas.py` (Pydantic models).

## Strict Architecture & Data Rules
1. NEVER hardcode API keys or DB URLs. Always read `process.env` (Node) or `os.environ` (Python).
2. Synthetic Source Data & Licensing: Because live commercial logistics APIs (e.g., Project44, MarineTraffic) are proprietary and paid, all MVP vessel AIS telemetry, port weather, buyer records, and UAE customs rules are generated deterministically via `services/mock_data.py` under an open MIT project license.
3. Mandatory Source Attribution: Every HS code recommendation, customs pre-clearance draft, and rerouting quote must display its exact underlying data source (e.g., `[Source: Mock-UAE-Tariff-2026-Ch84]` or `[Source: Sim-AIS-JebelAli-Berth04]`).
4. Confidence & Financial Thresholds ("What Happens If the Agent Makes a Mistake?"): The Master Agent evaluates a mathematical confidence score and net financial exposure on every plan. If Cost Impact > $10,000 OR Confidence < 85%, or if tariff data is ambiguous, the agent is strictly forbidden from auto-executing—it must output "I'm not sure — Human Review Required", lock the autonomous execution button, and route the exception to a senior supervisor with a one-click rollback snapshot.
5. Auditability & Chain of Thought: Every resolution card in the UI includes a collapsible "Agent Chain of Thought" drawer exposing the exact sub-agent prompts, SLA penalty math, and variables used by Gemini 1.5 Flash.
