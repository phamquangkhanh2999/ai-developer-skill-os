# AI Developer Skill OS - Specification (v4)

This document defines the strict contract and schema for developing Custom Skills in the AI Developer Skill OS. The metadata frontmatter is frozen to ensure cross-platform compatibility (Cursor, Claude Code, Windsurf, Gemini).

## 1. Frontmatter Contract (YAML)

Every `SKILL.md` must begin with this exact YAML structure. Do not add, remove, or rename fields.

```yaml
---
name: qk-[skill-name]
version: X.Y.Z
updated: YYYY-MM-DD
description: Brief summary of what this skill accomplishes.
behavior: static-analysis | development | validation | maintenance
intent: review-code | fix-bug | implement-feature | validate | maintain
priority: low | medium | high | critical
tags: [tag1, tag2]
platforms: [claude-code, cursor, windsurf, gemini-cli]
trigger: Natural language phrase that activates this skill.
inputs: [Required inputs]
outputs: [Expected outputs]
allowed_tools: [Tool1, Tool2]
pipeline: [analyze, plan, implement, validate, complete]
---
```

## 2. Skill Body Structure (Markdown)

The body of the `SKILL.md` file MUST contain the following sections:

1. **Goal:** The core objective of the skill.
2. **Chain of Thought (SOP):** The exact step-by-step reasoning the agent must follow.
3. **Constraints & Rules:** Hard boundaries and limits for this specific skill.
4. **Handoff Pipeline (Optional):** How this skill transitions to the next phase (e.g. passing to validation).

*Note: Skill documents MUST NOT declare Verification Levels or override Tool Efficiency policies. Those are exclusively managed by the Global Kernel (`AGENTS.md`).*
