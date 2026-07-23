# Changelog

All notable changes to AI Developer Skill OS are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

---

## [8.0.0] — 2026-07 — Agent Knowledge System

### Philosophy shift
- **V7:** Skill Repository — human selects skill, AI executes
- **V8:** Agent Knowledge System — AI retrieves context, selects capability, executes workflow, verifies

### Added
- `rules/` — Agent behavior policies (global, coding, safety)
- `workflows/` — Reusable execution pipelines (YAML, with inputs/outputs per step)
- `examples/` — Few-shot knowledge (good/, bad/)
- `learnings/` — Evidence-based learning lifecycle (draft/, validated/, deprecated/)
- `registry/` — Generated AI retrieval index (skills-index.yml)
- `docs/ARCHITECTURE.md` — Agent request flow diagram
- `docs/VERSIONING.md` — Semantic versioning policy
- `docs/schemas/` — Schema definitions for all knowledge objects
- `docs/decisions/` — Architecture Decision Records (ADRs)
- `.agentsignore` — AI boundary file (what agents should NOT load)
- `tooling/` — Dev automation (generate-registry.js, validate-skills.js)
- `tests/agent-evaluation/` — Agent behavior test harness

### Changed
- SKILL.md schema upgraded to V8: added `type`, `intent`, `triggers`, `complexity`, `workflow`, `verification`, `related_skills`
- `skills.json` demoted to **generated compatibility manifest** (source of truth = SKILL.md)
- Workflows extracted from individual skills → shared reusable templates

### Removed
- Embedded workflows inside SKILL.md body (moved to workflows/)
- Old migration scripts (migrate-v*.js, patch*.py, add_lang.*, etc.)
- Duplicate documentation (CLAUDE.md, old docs/)
- Experimental packages (packages/edaos-sdk)
- framework/, knowledge/, specs/, templates/ directories

### Migration
- V7.5.1 tagged at git: `v7.5.1`
- V7 skills preserved in git history; migration is additive schema upgrade

---

## [7.5.1] — 2026-07 — Final V7 Release

- Bumped all skill versions to 7.5.1
- Added qk-fe-api-integration skill
- Added qk-performance-tuner (global config)
- Stabilized frontmatter schema across all 22 skills

## [7.5.0] — 2026-07

- Major skills refactor with EDAOS runtime adapter
- Added MCP server integration
- Added qk-bug-resolution workflow contracts

## [7.0.0] — 2026

- V7 release: 22 skills, YAML frontmatter, token budget system
