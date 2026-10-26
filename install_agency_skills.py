"""Converter and Installer for msitarzewski/agency-agents into Antigravity Skills.

Installs all agency agents into:
1. Global Antigravity skills: C:\\Users\\ADMIN\\.gemini\\config\\skills\\agency-<slug>\\SKILL.md
2. Workspace Antigravity skills: D:\\OMNI-LOGISTICS MASTER AGENT\\.agent\\skills\\agency-<slug>\\SKILL.md
"""
import os
import re
import json
import shutil
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent
TEMP_AGENTS_DIR = REPO_ROOT / "temp_agency_agents"
GLOBAL_SKILLS_DIR = Path.home() / ".gemini" / "config" / "skills"
WORKSPACE_SKILLS_DIR = REPO_ROOT / ".agent" / "skills"

DIVISIONS = [
    "academic", "design", "engineering", "finance", "game-development",
    "gis", "healthcare", "marketing", "paid-media", "product",
    "project-management", "research", "sales", "security",
    "spatial-computing", "specialized", "strategy", "support", "testing"
]


def slugify(text: str) -> str:
    """Convert text to clean kebab-case slug."""
    text = text.lower().strip()
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'[^a-z0-9\-]', '', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')


def parse_agent_file(file_path: Path):
    """Parse YAML frontmatter and markdown body from agent file."""
    content = file_path.read_text(encoding="utf-8")
    frontmatter_match = re.match(r"^---\s*\n(.*?)\n---\s*\n(.*)$", content, re.DOTALL)
    if not frontmatter_match:
        # Fallback if no frontmatter
        name = file_path.stem.replace("-", " ").title()
        description = f"Specialized AI Agent: {name}"
        body = content
        return name, description, body

    raw_yaml, body = frontmatter_match.groups()
    name_match = re.search(r"^name:\s*['\"]?(.*?)['\"]?\s*$", raw_yaml, re.MULTILINE)
    desc_match = re.search(r"^description:\s*['\"]?(.*?)['\"]?\s*$", raw_yaml, re.MULTILINE)

    name = name_match.group(1).strip() if name_match else file_path.stem.replace("-", " ").title()
    description = desc_match.group(1).strip() if desc_match else f"Specialized {name} Agent"
    # Clean description from multi-line folding if any
    description = description.replace("\n", " ").strip()

    return name, description, body.strip()


def install_skills():
    print("Beginning Agency Agents installation for Antigravity...")
    GLOBAL_SKILLS_DIR.mkdir(parents=True, exist_ok=True)
    WORKSPACE_SKILLS_DIR.mkdir(parents=True, exist_ok=True)

    installed_count = 0
    roster = []

    for division in DIVISIONS:
        div_path = TEMP_AGENTS_DIR / division
        if not div_path.exists() or not div_path.is_dir():
            continue

        for md_file in div_path.glob("*.md"):
            if md_file.name.lower() in ["readme.md", "contributing.md"]:
                continue

            try:
                name, description, body = parse_agent_file(md_file)
                slug = f"agency-{slugify(name)}"

                skill_content = f"""---
name: {slug}
description: >-
  {description}
---

{body}
"""
                # 1. Global install
                global_target_dir = GLOBAL_SKILLS_DIR / slug
                global_target_dir.mkdir(parents=True, exist_ok=True)
                (global_target_dir / "SKILL.md").write_text(skill_content, encoding="utf-8")

                # 2. Workspace install
                ws_target_dir = WORKSPACE_SKILLS_DIR / slug
                ws_target_dir.mkdir(parents=True, exist_ok=True)
                (ws_target_dir / "SKILL.md").write_text(skill_content, encoding="utf-8")

                installed_count += 1
                roster.append({
                    "slug": slug,
                    "name": name,
                    "division": division,
                    "description": description[:120] + "..." if len(description) > 120 else description
                })

            except Exception as e:
                print(f"Error processing {md_file}: {e}")

    print(f"\nSuccessfully installed {installed_count} Agency Agent skills into:")
    print(f"  - Global Antigravity Skills: {GLOBAL_SKILLS_DIR}")
    print(f"  - Project Workspace Skills:  {WORKSPACE_SKILLS_DIR}")

    # Write manifest catalog
    manifest_path = REPO_ROOT / "AGENCY_AGENTS_CATALOG.json"
    manifest_path.write_text(json.dumps(roster, indent=2), encoding="utf-8")
    print(f"  - Agency Agents Catalog:     {manifest_path}")

    return installed_count, roster


if __name__ == "__main__":
    count, roster = install_skills()
    print(f"\nTotal ready-made agents available: {count}")
