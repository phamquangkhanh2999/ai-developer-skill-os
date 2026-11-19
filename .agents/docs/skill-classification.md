# Skill Classifications (5 Core Skills)

Skills are organized into five core functional boundaries that define their **Primary Objective** and **Evidence Strategy**, governed by `.agents/rules/global.md` and `.agents/rules/safety.md`.

## 1. Read-Only & Audit (`qk-code-review`)
- **Primary Goal:** Audit code, architecture, and security risks without modifying the working tree.
- **Evidence Strategy:** Cite exact `file:line` locations, code snippets, and concrete impact mechanisms. Never invent synthetic aggregate scores.

## 2. Feature Delivery & Specifications (`qk-feature-delivery`)
- **Primary Goal:** Implement new capabilities, handle requirement changes, or operate in non-code modes (`plan-only`, `discovery-only`, `prompt-only`).
- **Evidence Strategy:** Verify against explicit Acceptance Criteria; load domain references (`requirements.md`, `ui.md`, `backend-data.md`, `api-discovery.md`, `prompt-authoring.md`) on demand.

## 3. Root-Cause Bug Resolution (`qk-bug-resolution`)
- **Primary Goal:** Diagnose and eliminate root causes of defects via `Observe → Evidence → Cause → Minimal Fix → Verify`.
- **Evidence Strategy:** Inspect source, callers, contracts, and logs first; apply minimal fixes at the point of behavior ownership and run targeted verification.

## 4. Behavior-Preserving Refactoring & Testing (`qk-code-cleaner`)
- **Primary Goal:** Improve internal code structure, upgrade dependencies safely, and expand automated test coverage with zero behavior change.
- **Evidence Strategy:** Establish a baseline before refactoring and prove behavior preservation with passing test suites.

## 5. Platform Operations, Release & Documentation (`qk-devops-release`)
- **Primary Goal:** Maintain CI/CD pipelines, Docker/deployment configs, proportional documentation, and opt-in project memory (`.ai-local/`).
- **Evidence Strategy:** Validate configurations locally (`lint`, `test`, `npm pack --dry-run`), prepare rollback plans, and require explicit user authorization before any publish or production deployment.
