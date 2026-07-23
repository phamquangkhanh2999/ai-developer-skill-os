---
# ── Identity ───────────────────────────────────────────────
name: qk-test-engineering
version: 8.1.0
status: experimental
description: "Testing strategy decision engine (Unit, Integration, E2E, Coverage, Regression, Mock strategy)."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability

intent:
  - testing-strategy
  - unit-test
  - integration-test
  - e2e-test
  - mock-strategy
  - test-coverage

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
  concepts:
    - test-pyramid
    - mock-strategy
  references:
    - architecture

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
  stop_early: false

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
- Không tự động sinh test trừ khi user yêu cầu implement, skill này chủ yếu tư vấn architecture và strategy cho QA/Testing.
