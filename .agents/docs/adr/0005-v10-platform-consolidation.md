# ADR-005: V10 Platform Consolidation

**Date:** 2026-09-24
**Status:** Accepted
**Deciders:** AI Developer Skill OS Team

## Context

The V8-V9 architecture supported 29+ skills across multiple IDEs including Cursor, Windsurf, Kilo Code, and OpenAI Codex. This led to:

- Two parallel skill systems (`/skills/` and `.agents/skills/`)
- Registry inconsistency between `capability-graph.yml` (old) and `graph.json` (new)
- Version fragmentation (8.0.0, 9.1.0, 9.2.0, 10.1.0, 11.1.0)
- Missing validation sections (Exit Codes, Confidence Model, Evidence Format, Compliance)
- No automated testing for skill structure

## Decision

Consolidate to **3 IDE platforms** with a clean architecture:

| Platform | Config | Context Window |
|----------|--------|----------------|
| **Antigravity** | `.agents/AGENTS.md` | Large (Gemini) |
| **Claude** | `.claude/CLAUDE.md` | ~200K tokens |
| **OpenCode** | `.opencode/config.yaml` | ~128K tokens |

### Structural Changes

1. **Removed `/skills/` directory** — single system under `.agents/skills/`
2. **Removed `capability-graph.yml` and `skills-index.yml`** — replaced by `graph.json` and `index.yaml`
3. **Removed old worktrees** — `.kilo/worktrees/stealth-octagon`
4. **Added `platforms` field** to all SKILL.md frontmatters
5. **Added required sections** to all SKILL.md: Exit Codes, Confidence Model, Evidence Format, Compliance, Platform-Specific Instructions
6. **Created `tooling/validate-skills.js`** — validates all skill structure
7. **Created `tooling/validate-graph.js`** — validates graph integrity (Score 100/100)
8. **Updated all versions** to `10.2.0` consistently

### Consequences

- Single source of truth: `.agents/skills/**/SKILL.md`
- Automated validation: `npm run test:registry` (10/10 tests)
- Graph integrity: `npm run test:graph` (100/100)
- IDE-specific wrappers: `.claude/CLAUDE.md`, `.opencode/config.yaml`
- 11 Super-Skills, 12 workflows, 9 rules, all at version 10.2.0

### Future Considerations

- Add platform-specific skill variants if context window differences require
- Add `qk-help` skill if routing needs improvement
- Consider adding ADR for each major version bump
