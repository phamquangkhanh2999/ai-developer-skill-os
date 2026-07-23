# Executable Case Study: qk-engineering-standard Architecture Review

Skill: `qk-engineering-standard` (v2.0.0 Governance Orchestrator)
Case ID: `CASE-ENG-GOV-001`
Target File: `src/components/admin/UsersManager.tsx`

---

## 1. Skill Execution Trace

```text
[qk-engineering-standard] Initiating code governance review on UsersManager.tsx...
[Capability Request] Consuming code.ast and code.references capabilities...
[Measure Metrics] Captured EngineeringEvidence:
  - Cognitive Complexity: 28 (Target: <= 15) -> FAIL
  - Duplication Percentage: 4.2% (Target: <= 5%) -> PASS
  - Dependency Direction: Component makes direct fetch API calls -> FAIL

[Standard Evaluation] Evaluated against Hierarchy Matrix:
  1. Architecture Integrity (100): FAIL (UI -> Direct Fetch API violation)
  2. Maintainability (70): FAIL (Cognitive Complexity 28 > 15)

[Governance Decision] Decision: REFACTOR_REQUIRED
  - Reason: Violates Architecture Boundary Integrity & Cognitive Complexity Limits
  - Delegate Target: `./qk-bug-resolution` (Strategy: `extract_custom_hook_and_service`)

[Refactoring Plan Delegated]
  Step 1: Extract fetch and state handling to `useUsersManager` hook
  Step 2: Simplify UsersManager.tsx to presentational container
  Step 3: Re-verify against POL-ENG-QUALITY-CORE-01
```
