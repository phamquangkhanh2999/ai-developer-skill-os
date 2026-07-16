# Changelog

All notable changes to the **AI Developer Skill OS** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [7.0.2] - 2026-07-15

### Added
- **Frontend Integration**: Added `qk-fe-api-integration` skill to strictly enforce zero-overhead base API consumption, DTO mapping, and resilient UI states.

## [7.0.0] - 2026-07-15

### Changed (The "Anti-Slop & Zero-Trust" Architecture Upgrade)
- **Zero-Trust Logic**: Core logic skills (`qk-context-loader`, `qk-orchestrator`, `qk-feature-delivery`) now mandate a Topological Context Graph prior to any code generation.
- **Strict Design Contract**: Frontend skills (`qk-ui-system-builder`, `qk-design-to-code`, `qk-ui-audit`) now explicitly reject generic styling (slop) and enforce strict token matching against a mandated `DESIGN.md`.
- **Repair Loop Enforcement**: `qk-bug-resolution` updated to strictly prohibit jumping to fixes without explicitly establishing an `Observe -> Hypothesis -> Evidence` chain.
- **Contract-First APIs**: `qk-api-lifecycle` now requires explicit OpenAPI/Swagger definitions prior to endpoint implementation.
- **Upgraded Testing Framework**: Fixed regex and validation logic in `behavior-conformance.test.js` to rigorously support YAML array strings and precise V7 markdown constraints. All 22 skills bumped to `v7.0.0`.
- **Project Bootstrapping**: `qk-project-bootstrap` now scaffolds `DESIGN.md` explicitly upon initialization.


## [4.0.0] - 2026-07-02

### Changed (Major Architecture Upgrade)
- **Intent-Based Agent Architecture:** Replaced rule-based individual skill exceptions with global behavioral group classifications (Static Analysis, Development, Validation, Maintenance).
- **OS Kernel Refactor:** Completely rewrote `AGENTS.md` (the "OS Kernel") into a strictly organized, lightweight structure under 100 lines.
- **Progressive Evidence Collection:** Agents now enforce an 80% Confidence Threshold and incremental Context Budget (`1 file` → `3 files`) to prevent over-fetching and hallucination loops.
- **Cost & Escalation Policies:** Introduced strict cost-optimization logic, Stopping Criteria, and Escalation protocols to prevent infinite `run_command` retries.
- **Risk-based Verification:** Dynamic test execution based on the risk level of changes (Levels 0-3).

### Added
- **Registry Validation Suite:** Full Vitest test suite enforcing SKILL.md frontmatter compliance against `docs/SPEC.md`.
- **GitHub Actions CI:** Automated validation on every PR and push to main.
- **Idempotent Installer:** `bin/install.js` now detects and updates existing rule blocks instead of duplicating them.
- **Kilo Code Native Support:** First-class support for `CLAUDE.md` + `kilo.json` config generation.
- **Governance Docs:** `docs/GOVERNANCE.md`, ADRs, and skill classification policy for enterprise maintainability.
- **Engineering Standards:** `qk-engineering-standard` and `qk-validation-gate` skills enforce SOLID, DRY, Clean Code, and mandatory quality gates.

## [1.0.1] - 2026-07-01
### Fixed
- Standardized Language rule across all 23 SKILL.md files for consistency.
- Updated registry version to match package.json.

## [1.0.0] - 2026-07-01

### Added
- Released the complete AI Developer Skill OS with 23 targeted skills for coding agents.
- **Engineering Core (8 skills):**
  - `agent-orchestrator` for planning and delegating tasks.
  - `context-manager` for project context and file selection.
  - `project-audit` for 3-mode health checks.
  - `bug-fix` with root cause analysis.
  - `refactor` for safe, behavior-preserving code restructuring.
  - `migration` for dependency updates and library swapping.
  - `api-integration` for robust API connections.
  - `git-engineer` for commit messages and PR documentation.
- **Frontend Core (11 skills):**
  - `frontend-architecture`, `design-system`, `ui-builder`, `component-generator`.
  - `state-management`, `form-builder`, `table-crud-generator`.
  - `frontend-debug`, `frontend-testing`, `accessibility-audit`, `frontend-performance`.
- **Backend Core (4 skills):**
  - `backend-architecture`, `database-engineer`, `auth-security`, `deployment`.
- Added comprehensive `skills.json` registry with dependencies and trigger keywords.
- Added bilingual `README.md` (English/Vietnamese).
- Added detailed user documentation in `docs/HUONG_DAN_SU_DUNG.md` and `docs/CHI_TIET_SKILLS.md`.
- Translated all skill frontmatter descriptions to Vietnamese for better UX in agent terminals.
- Included generic English and Vietnamese usage examples in `_template/examples/`.
