"""Agency Agents Integration Layer for Omni-Logistics Master Agent.

Loads ready-made specialist agent personas from the installed Agency Agents skill catalog:
- agency-agents-orchestrator (Specialized) -> Master Orchestrator Intelligence
- agency-supply-chain-strategist (Specialized) -> Supply Chain & Crisis Routing Intelligence
- agency-operations-manager (Specialized) -> Terminal & Berth Operations Intelligence
- agency-automation-governance-architect (Specialized) -> Customs & Rule Compliance Intelligence
- agency-financial-analyst (Finance) -> SLA & Financial Margin Analytics
- agency-gis-spatial-data-engineer (GIS) -> Spatial Telemetry & Route Network Intelligence
"""
import os
import json
import re
from pathlib import Path
from typing import Dict, Any, List, Optional

SKILLS_WORKSPACE_DIR = Path(__file__).resolve().parent.parent.parent / ".agent" / "skills"
SKILLS_GLOBAL_DIR = Path.home() / ".gemini" / "config" / "skills"
PERSONAS_DIR = Path(__file__).resolve().parent / "personas"
CATALOG_PATH = Path(__file__).resolve().parent.parent.parent / "AGENCY_AGENTS_CATALOG.json"


class AgencyAgentLoader:
    _cache: Dict[str, Dict[str, Any]] = {}

    @classmethod
    def get_catalog(cls) -> List[Dict[str, Any]]:
        """Return the roster manifest of all 271 installed agency agents."""
        if CATALOG_PATH.exists():
            try:
                return json.loads(CATALOG_PATH.read_text(encoding="utf-8"))
            except Exception:
                pass
        return []

    @classmethod
    def load_agent(cls, slug: str) -> Optional[Dict[str, Any]]:
        """Load a ready-made agency agent skill definition or custom runtime persona."""
        if slug in cls._cache:
            return cls._cache[slug]

        clean_slug = slug if slug.startswith("agency-") else f"agency-{slug}"
        bare_slug = slug.replace("agency-", "")

        # 1. Check custom runtime logistics personas directory first
        target_path = None
        for cand in [PERSONAS_DIR / f"{bare_slug}.md", PERSONAS_DIR / f"{slug}.md"]:
            if cand.exists():
                target_path = cand
                break

        # 2. Check workspace .agent/skills/
        if not target_path or not target_path.exists():
            ws_cand = SKILLS_WORKSPACE_DIR / clean_slug / "SKILL.md"
            if ws_cand.exists():
                target_path = ws_cand

        # 3. Check global ~/.gemini/config/skills/
        if not target_path or not target_path.exists():
            glob_cand = SKILLS_GLOBAL_DIR / clean_slug / "SKILL.md"
            if glob_cand.exists():
                target_path = glob_cand

        if not target_path or not target_path.exists():
            return None

        content = target_path.read_text(encoding="utf-8")
        frontmatter_match = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", content, re.DOTALL)
        if frontmatter_match:
            raw_yaml, body = frontmatter_match.groups()
            name_match = re.search(r"^name:\s*['\"]?(.*?)['\"]?\s*$", raw_yaml, re.MULTILINE)
            desc_match = re.search(r"^description:\s*['\"]?(.*?)['\"]?\s*$", raw_yaml, re.MULTILINE)

            agent_data = {
                "slug": clean_slug,
                "name": name_match.group(1).strip() if name_match else clean_slug,
                "description": desc_match.group(1).strip() if desc_match else "",
                "system_instructions": body.strip(),
                "path": str(target_path)
            }
            cls._cache[slug] = agent_data
            return agent_data

        return None

    @classmethod
    def get_system_prompt_for(cls, slug: str, default_prompt: str) -> str:
        """Retrieve instruction guidelines from ready-made agent to enrich Gemini prompts."""
        agent = cls.load_agent(slug)
        if agent and agent.get("system_instructions"):
            # Extract first 600 characters of mission/identity for lean token footprint
            instructions = agent["system_instructions"][:800]
            return f"Specialist Persona Guidance ({agent['name']}):\n{instructions}\n\nTask:\n{default_prompt}"
        return default_prompt
