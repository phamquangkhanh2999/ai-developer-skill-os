# Changelog

All notable changes to AI Developer Skill OS are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.0.0/)

---

## [10.1.0] — 2026-09-15 — AI Developer Skill OS v10.1: 11 Super-Skills, API-to-Data Discovery & Prompt Compiler v11.1

### Added
- **`qk-api-data-discovery` (Super-Skill thứ 11)**: Kỹ nghệ Khám phá API & Hợp đồng Dữ liệu thực nghiệm (API Discovery → Real Evidence → Schema Discovery → Data Contract → Bronze Medallion Assessment).
  - Tôn chỉ vàng: *"Never infer an API contract from endpoint names alone. Observe the real API response first, preserve raw evidence, then derive the schema and standardized collection from observed evidence."*
  - Mô hình 2 Pha với **Checkpoint STOP**: Pha A (Khám phá & xuất báo cáo Checkpoint `docs/api-discovery/<collection>-analysis.md`) → Dừng lại chờ người dùng quyết định → Pha B (Triển khai đúng Option được chọn).
  - Quy tắc Handoff Contract: Báo cáo checkpoint chứa 3 tầng thông tin độc lập (FACT, ANALYSIS, DECISION OPTIONS) để chuyển giao quyền kiểm soát cho người dùng.
- **`qk-prompt-compiler` v11.1**: Tích hợp Control Plane & Behavioral Gate với 4 chốt chặn kiểm soát: Risk Gate (`Complexity ≠ Risk`), Change Budget Gate (1–5 files, 0 deps), Scope Expansion Gate (chặn lan tầng), và Evidence Gate (`CLAIM LEVEL <= EVIDENCE LEVEL`).
- **Nâng cấp Antigravity Cockpit**: Hỗ trợ 14 Senior Developer Roles, Interactive Planning Mode tự động (`RequestFeedback: true`), Dual-Stream Reporting và Unicode Box Drawing Diagrams.

### Changed
- **Quy hoạch 11 Core Super-Skills**: Đồng bộ hóa toàn bộ registry O(1), routing table và tài liệu hướng dẫn về chuẩn 11 Super-Skills tập trung, xóa bỏ hoàn toàn phân mảnh.
- **Test Suite v10+**: Nâng cấp test suite tự động nhận diện các phiên bản Super-Skills v10+ và v11+, đạt 10/10 test cases passed (<1s).

---

## [9.3.1] — 2026-09-14 — EDAOS v9.3: SSOT Trigger Discipline, Full-Body Execution & Complete Documentation

### Added
- **Complete v9.3 Documentation Sync**: Updated `README.md` and `CHANGELOG.md` with comprehensive architectural documentation, active skill breakdown, and governance notes.
- **SSOT 2-Clause Trigger Standard**: Implemented Anthropic 2-clause standard across all 29 active skills (`qk-*`). Clause 1 defines primary responsibility; Clause 2 defines explicit trigger intents including colloquial Vietnamese triggers ("kể cả khi chỉ nói...").
- **Closed-Loop 4-Tier Body Architecture**: Completed full execution body across all 29 active skills (Preconditions, In/Out-of-Scope boundaries, Step-by-step pipeline, Role-aware Prompt Templates & Command argument specs).
- **Direct Terminal Visual Rendering**: Enforced Unicode/ASCII Box Drawing for architectural diagrams, sequence flows, and decision trees directly in terminal output (GEMINI.md).
- **Vitest Isolation Engine**: Added isolated `vitest.config.js` ignoring external IDE worktrees (`.kilo/`) for fast (<1s) 10/10 test suite execution.

### Changed
- **Boundary Disambiguation**: Resolved trigger overlaps between paired skills:
  - `qk-project-audit` (pre-code gap analysis & feasibility) vs `qk-project-health` (code smells & technical debt audit of running codebase).
  - `qk-ui-audit` (visual consistency & 57-check anti-slop) vs `qk-web-quality-gate` (WCAG a11y, performance, lighthouse).
  - `qk-access-policy` (RBAC/ABAC & auth middleware) vs `qk-security-audit` (OWASP scan & vulnerability detection).
- **Skill Restructuring & Governance**:
  - Archived `qk-frontend-architecture` and `qk-agent-observability` with deprecation paths.
  - Relocated `qk-engineering-standard` to Behavior Policy Rule (`.agents/rules/coding.md`).
  - Relocated `qk-validation-gate` to Eval Pipeline Engine (`evals/runner.js`).
  - Preserved 3 legacy v9.1 skills (`qk-fe-api-integration`, `qk-help`, `qk-system-evolution`) for zero-breaking backward compatibility.

---

## [9.2.0] — 2026-09-11 — EDAOS v9.2: Role-Aware Execution & Semantic Naming

### Added
- **DEV_PROFILE.md**: Project-level role and stack context file automatically loaded at session start.
- **Role Behavior Matrix**: Added 6 developer profiles (`fe`, `be`, `fullstack`, `data`, `ai-engineer`, `devops`) with focus, depth, and skip guidance.
- **Role-Aware Prompt Templates**: Integrated role-specific templates in key skills.

### Changed
- Renamed `qk-fe-api-integration` → `qk-api-consumer`.
- Renamed `qk-system-evolution` → `qk-upgrade`.
- Renamed `qk-project-analyst` → `qk-project-audit`.
- Renamed workflows: `skill-evolution.yml` → `skin-governance.yml`, `research.yml` → `context-discovery.yml`.
- Deprecated and removed legacy `qk-help` in favor of `qk-orchestrator`.

---

## [9.0.0] — 2026-08 — EDAOS v9.0: Universal Project Knowledge V1 & Dual-Mode Memory Architecture

### Added
- **Universal Project Knowledge Protocol V1 (AI Skin V9)**: Core memory discipline integrated across all 32 developer skills (`qk-*`) and core OS rules.
- **Dual-Mode Memory Setup**: Fully automated support for Private Mode (`.ai-local/`, git-ignored by default) and Shared Team Mode (`.agents/`, commit/reviewable via PRs).
- **Pre-flight & Post-flight Governance**: Skills automatically check memory before performing redundant project searches (Navigator pattern) and propose structured knowledge harvesting (`Architecture`, `Convention`, `Pattern`, `Hard Bug`) subject to human confirmation (AI proposes → Human approves).
- **Zero-Overwrite & Portable References**: Mandatory 100-line limit for project `AGENTS.md`, workspace-relative symbol paths, and immutable memory history (`status: Active` → `Archived`).

## [8.3.1] — 2026-07 — EDAOS v8.3.1: Eval Pipeline & Agentic Governance

### Added
- **evals/runner.js**: Automated evaluation pipeline script to parse `scorecard.yaml`, run linting, verify agent traces, and calculate total scores against thresholds.
- **Eval Scripts**: Added `npm run eval` and `npm run eval:all` in `package.json` for running automated validations.
- **Scorecards**: Created comprehensive, quantitative AI-eval `evals/scorecard.yaml` for all 31 standard skills.
- **.agents/rules/anti-patterns.md (R-C-09)**: Strict global rule prohibiting AI-slop, God Files, Circular Dependencies, and poor code quality practices.

## [8.3.0] — 2026-07 — EDAOS v8.3: Design System, IDE Config & Infrastructure Fixes

### Added
- **DESIGN.md**: Design system contract with HSL color tokens, spacing scale, typography, border radius, shadows, animation tokens, dark mode support, and z-index layers
- **vite.config.js**: Vitest configuration with coverage (v8 provider), reporter setup, and test isolation
- **bin/lint.js**: Lint script for validating SKILL.md spec compliance, workflow structure, and rule files
- **.kilo/kilo.json**: Kilo IDE configuration with project paths, commands, agent model settings, and skin design token reference
- **.kilo/command/ and .kilo/agent/ directories**: Standardized Kilo command and agent configuration directories
- **qk-context-loader/references/**: Loading patterns document for context dependency graph construction

### Fixed
- **.agentsignore**: Removed `schemas/` from rogue artifacts list; legitimate schema files at `.agents/docs/schemas/` are now accessible to AI agents
- **ADR-008 renamed to ADR-005**: Corrected decision sequence to remove gap between ADR-004 and ADR-005
- **qk-design-system-engineering status**: Changed from `experimental` to `stable` to reflect full V8.2 review compliance
- **Source .agentsignore**: Fixed same `schemas/` issue in root `.agentsignore` (not just worktree copy)

### Removed
- **Legacy agent-skills dirs**: Removed obsolete `khanhmcp-server/agent-skills-eval/` and `khanhmcp-server/agent-skills-tool/` directories (pre-V8 artifacts)

## [8.2.1] — 2026-07 — Token Optimization Patch

### Fixed
- **`stop_early: false` → `true` in 13 skills**: `qk-code-review`, `qk-data-lifecycle`, `qk-design-system-engineering`, `qk-devops-platform`, `qk-feature-delivery`, `qk-frontend-architecture`, `qk-production-release`, `qk-product-specification`, `qk-project-bootstrap`, `qk-security-audit`, `qk-system-evolution`, `qk-test-engineering`, `qk-ui-builder`, `qk-web-quality-gate` — skills now self-terminate when token budget is exhausted instead of running indefinitely.
- **Removed 20 duplicate metadata blocks**: Stripped repeated `skill_version/runtime_version/schema_version` YAML blocks from `qk-orchestrator` (11×) and `qk-context-loader` (9×) — saves ~1320 chars per context load.
- **`qk-code-review` Dynamic Context Loading: mandatory → on-demand**: References are now only read when a specific issue is found, not before every review. Eliminates 2 forced `view_file` calls per review session.
- **`qk-feature-delivery` FAST PATH**: Simple tasks (≤1 file, no new API, no DB migration) now bypass `qk-context-loader` and Phase 1 clarification — saves 2–3 turns per simple fix.

---

## [8.2.0] — 2026-07 — EDAOS v8.2: Governed Capability Metadata & Eval Platform

### Added
- **Manifest-First Architecture & Registry Engine**: Created `tooling/build-registry.js` (`npm run build:registry`) generating lightweight lookup index `.agents/registry/index.yaml` and O(1) runtime adjacency graph `.agents/registry/graph.json` with cycle/orphan detection.
- **V8.2 Blueprint Plugins**: Introduced customizable project scaffolding templates under `.agents/blueprints/` (`rag`, `coding`, `workflow`) featuring multi-profile environments (`development`, `production`, `testing`) and feature flags.
- **Governed Capability Manifests**: Created minimalist `.agents/skills/_template/capability.yaml` (`schema_version: 1`) to decouple execution metadata from natural language instructions.
- **Eval Pipeline Platform**: Added quantitative verification frameworks via inheritance-ready `.agents/skills/_template/evals/scorecard.yaml` (`extends: default`), linking ground-truth execution traces with automated score rubrics.
- **Domain Patterns Reference Architecture**: Added reference blueprint for Enterprise Domain AI at `.agents/knowledge/domain-patterns/construction/ddc-construction-ai-blueprint.md` (Construction AI, DDC 192 domain skills, QTO IFC bóc tách, n8n automation workflows) showcasing zero interference with core developer capabilities.

### Changed
- **`qk-project-bootstrap` Evolution (v8.2.0)**: Upgraded to support One-Click Blueprint selection, automated `project.yaml` generation, and the Universal 4-Folder RAG Architecture (`prompts/`, `data/`, `agents/`, `evals/`).
- **`qk-validation-gate` Evolution (v8.2.0)**: Integrated automated Eval Pipeline validation, reading `scorecard.yaml` rubrics, verifying trace logs in `evals/traces/`, and enforcing quantitative pass thresholds.
- **`qk-ai-builder` Evolution (v8.2.0)**: Upgraded to Manifest-first capability packaging and strict 4-folder data discipline (immutable `data/raw/` vs cleaned `data/processed/`).
- Updated system core description in `package.json` to reflect the EDAOS v8.2 paradigm shift.
- Synced `.agents/CHANGELOG.md` and `.agents/README.md` with root documentation.

---

## [8.1.7] — 2026-07 — README Sync

### Changed
- **README Sync**: Synced `.agents/README.md` with root `README.md` so the installed documentation is fully up-to-date with V8.1 architecture.
- Bumped version to `8.1.7`.

---

## [8.1.6] — 2026-07 — Design Intelligence Content & Sync

### Added
- **Design Intelligence Populated**: Sourced core market-standard knowledge (Tailwind, Radix, Apple, Vercel-like principles) into `.agents/knowledge/design-intelligence/` covering components, patterns, industries, themes, and references.
- **Animation Knowledge**: Added `visual-language/animation.md` for micro-interactions and transition durations.
- **Dependency Wiring**: Linked `qk-ui-system-builder` to `design-intelligence` so it utilizes the newly generated design constraints.
- **Changelog Sync**: Synced `.agents/CHANGELOG.md` with root `CHANGELOG.md` so the installed copy reflects the true V8 evolution.

### Changed
- All skill descriptions properly translated to Vietnamese for ecosystem consistency.
- Bumped version to `8.1.6` for final, truly complete Design Intelligence NPM Release.

---

## [8.1.4] — 2026-07 — Design Intelligence Pack

### Added
- **Design Intelligence Layer**: `.agents/knowledge/design-intelligence/` (industries, themes, patterns, visual-language, components, templates)
- **Knowledge Dependencies**: `qk-design-system-engineering` and `qk-ui-builder` now have strict dependency bounds tied to Design Intelligence without bloating the Capability Graph.
- **Design Routing Test Cases**: `design-intel-01`, `02`, `03` for validating routing logic in design scenarios.
- **Re-introduced CLI Installer**: Restored and refactored `bin/install.js` to correctly copy `.agents` across global/local directories for easy NPM setup.

### Changed
- Refined **Decision Boundaries**: `qk-ui-builder` explicitly forbidden from defining visual direction or brand identity (strict capability bounds).
- **README.md** reflects 30 Master Skills and the "Agent Engineering OS" mindset.
- **package.json**: Version bump `8.1.4` and whitelisted files for npm publish.

---

## [8.1.3] — 2026-07 — Architecture Freeze & Governance

### Added
- **Capability Graph & Routing**: `.agents/registry/capability-graph.yml` to define skill relations (`depends_on`, `delegates_to`).
- **Priority Governance**: `.agents/rules/priorities.yml` enforcing safety layers (`P1: System Integrity`, `P2: Guardrails`).
- **Audit Tools**: `tooling/run-aar.js` for architectural acceptance testing.
- Test cases for routing and boundary attacks.

### Changed
- Name transition from "Self-Improving" to **Adaptive Agent OS** (Self Optimizing ≠ Self Modifying).
- Enforced hard cap of **30 Skills** to prevent Skill Inflation.
- Frozen Baseline achieved: `v8.1.3-agent-os-production`.

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
