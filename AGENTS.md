# Omni-Logistics Master Agent — Project & Agency Rules

## 1. Championship Context
- Competition: Create AI Agents Championship (Dubai Chamber of Digital Economy - Best Business AI Agent)
- Core Product: Autonomous Control Tower (MAS) for Dubai Jebel Ali Port, Free Zones, and 3PL inland logistics.
- Must Support: Desktop Control Tower view AND Responsive Mobile Journey view (for Workshop 1 & live demo).

## 2. Tech Stack (100% Zero-Cost Tier)
- Frontend: Next.js 14 (App Router, TypeScript, TailwindCSS, Lucide Icons) — responsive for Desktop & Mobile PWA.
- Backend: Python 3.11/3.12, FastAPI, CrewAI / Multi-Agent System, Pydantic v2.
- Database: Supabase (PostgreSQL 15) with local SQLite fallback.
- LLM Engine: Gemini 1.5 Flash (`google-genai` / AI Studio).
- Agent Persona Catalog: `.agency-agents/` (from `msitarzewski/agency-agents`).

## 3. How to Use `.agency-agents` Specialists During Development
When executing tasks, adopt the corresponding specialist persona from `.agency-agents/`:
- Database & FastAPI architecture -> Use `Engineering/Backend Architect` & `Engineering/Database Optimizer`
- Multi-agent prompts, routing & token guardrails -> Use `Engineering/AI Engineer` & `Engineering/Autonomous Optimization Architect`
- Next.js Control Tower & Mobile UI -> Use `Engineering/Frontend Developer` & `Engineering/Mobile App Builder`
- QA & Milestone Sign-off -> Always run a final check using `Testing/Reality Checker` and `Engineering/Code Reviewer`

## 4. Strict Architecture & Data Guardrails
1. Never hardcode API keys or database URLs. Always use `process.env` (Node) or `os.environ` (Python).
2. The frontend must NEVER call the Gemini API directly. All LLM calls go through FastAPI orchestration.
3. Every sub-agent response must be validated by a strict Pydantic schema before returning to the frontend.
4. Human-in-the-Loop Rule: If `cost_impact > 10000` (USD) or `confidence < 0.85`, set `requires_human_review = True` and block auto-execution until the operator approves.
5. Do not invent live port APIs. Use deterministic Dubai logistics scenarios in `backend/app/services/mock_data.py`.
