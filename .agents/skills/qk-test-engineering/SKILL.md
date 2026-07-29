---
# ── Identity ───────────────────────────────────────────────
name: qk-test-engineering
version: 8.3.1
status: experimental
description: "Công cụ quyết định chiến lược kiểm thử (Unit, Integration, E2E, Coverage, Regression, Mock)."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability

intent:
  - testing-strategy
  - unit-test-strategy
  - integration-test-strategy
  - e2e-test-strategy
  - mock-strategy
  - test-coverage-planning

complexity:
  level: high
  criteria:
    files_affected: "1-5"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "chiến lược test"
  - "viết test"
  - "mock data"
  - "test coverage"

# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-engineering-standard

knowledge_scope:
  domain:
    - testing-strategy
    - quality-assurance
    - unit-testing
    - integration-testing
    - e2e-testing
    - visual-regression
  concepts:
    - test-pyramid
    - mock-strategy
  references:
    - architecture
    - anti-patterns
    - playwright
    - vitest
    - storybook-testing

decision_boundary:
  owns:
    - test pyramid
    - coverage strategy
    - regression planning
  does_not_own:
    - business logic implementation
    - writing tests
  conflicts_with: []

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: feature

lifecycle:
  promotion_gate:
    requirements:
      tests:
        minimum_pass_rate: 0.95
      usage:
        minimum_runs: 20
      conflicts:
        zero_boundary_violation: true
      evidence:
        required:
          - evaluation_report
          - usage_history
          - boundary_audit
  demotion_gate:
    triggers:
      - repeated_failure
      - boundary_violation
      - outdated_reference
    action:
      change_status: "stable -> experimental"

selection:
  priority: medium
  confidence_threshold: 0.80

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: medium
risk: low
side_effects: read_only
produces: [report, test_plan]
consumes: [user-description]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-test-engineering — Test Engineering Strategist

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

## Preconditions
- [ ] Có code hoặc requirement rõ ràng cần kiểm thử.

## Scope
- Đưa ra quyết định chọn loại test (Unit, Integration, E2E) theo Test Pyramid.
- Thiết kế chiến lược Mock (Mocking vs Stubbing vs Faking).
- Đánh giá Test Coverage hiện tại và đưa ra target.
- Quyết định Regression analysis (những phần nào cần test lại khi file A thay đổi).
- **Bắt buộc thiết kế test case cho ranh giới dữ liệu (Negative Testing / Boundary Testing) để đảm bảo tuân thủ R-SEC-04.**
- Không tự động sinh test trừ khi user yêu cầu implement, skill này chủ yếu tư vấn architecture và strategy cho QA/Testing.

## Non-Goals
- ❌ Provide implementation outside of Testing Strategy scope
- ❌ Override explicit user directives without explanation
- ❌ Guess ambiguous requirements without asking

## Priority Order

| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1 | Core Testing Strategy analysis and decision making | Never |
| P2 | Validation of existing patterns | Budget < 30% |
| P3 | Detailed documentation generation | Budget < 50% |
| P4 | Edge case exploration | Budget < 70% |

## Workflow

### Phase 1 — Context Loading
**Steps:**
1. Read existing configuration and requirements related to Testing Strategy.
2. Check for missing preconditions.

**Decision:**
```
IF context is clear
  → Confidence: HIGH → go to Phase 2
ELSE
  → EXIT: BLOCKED — ask user
```

### Phase 2 — Analysis & Strategy
**Steps:**
1. Analyze the current state against Testing Strategy best practices.
2. Formulate strategy or audit report based on findings.

**Decision:**
```
IF strategy/audit is complete
  → Confidence: HIGH → go to Phase 3
ELSE IF minor gaps exist
  → Confidence: MEDIUM → proceed with assumptions noted
```

### Phase 3 — Finalization
**Steps:**
1. Generate final report or configuration.
2. Prepare handoff data for subsequent skills.

## Confidence Model

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | All preconditions met, context fully understood | Proceed directly |
| MEDIUM | Some context missing but safe defaults exist | Proceed and note assumptions |
| LOW | Core requirements missing | EXIT: BLOCKED |

## Severity (for findings)

| Level | Definition |
|-------|-----------|
| CRITICAL | Severe violation of Testing Strategy principles |
| HIGH | Significant risk or technical debt |
| MEDIUM | Suboptimal pattern but functional |
| LOW | Minor style or documentation issue |

## Evidence Format

```
[SEVERITY] Context/File
Issue:      [what was found]
Confidence: HIGH
Recommendation: [actionable advice]
```

## Retry Policy
```
Task fails due to missing context
  └─ Ask user for clarification
       ├─ Provided → Retry Phase 1
       └─ Not provided → EXIT: BLOCKED
```

## Escalation Rules

```
BLOCKED: Missing critical context for Testing Strategy
Missing:
  - [Specific requirement]
Questions:
  1. Bạn có thể cung cấp thêm thông tin về yêu cầu này không?
  2. Mục tiêu chính của bạn là gì?
Recommended Assumptions: none
```

## Handoff Contract

### Consumes
```json
{
  "from": "user or qk-orchestrator",
  "required_fields": ["context"],
  "optional_fields": ["existing_config"]
}
```

### Produces
```json
{
  "to": "user or downstream skill",
  "output_fields": ["strategy_report", "exit_code"]
}
```

## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Testing Strategy task completed successfully | Strategy/audit generated |
| PARTIAL | Task completed with assumptions | Medium confidence |
| BLOCKED | Missing context | Cannot proceed |
| FAILED | Critical conflict or error | Unresolvable constraint |
