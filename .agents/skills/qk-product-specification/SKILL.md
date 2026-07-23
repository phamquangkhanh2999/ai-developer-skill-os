---
# ── Identity ───────────────────────────────────────────────
name: qk-product-specification
version: 8.1.0
status: experimental
description: "Product thinking (Idea → Requirement → Acceptance criteria → Technical spec)."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability

intent:
  - product-specification
  - requirement-analysis
  - acceptance-criteria
  - technical-spec

complexity:
  level: medium
  criteria:
    files_affected: "1-3"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "viết spec"
  - "phân tích yêu cầu"
  - "ý tưởng sản phẩm"
  - "acceptance criteria"

# ── V8: References ─────────────────────────────────────────
workflow: spec-driven-development

rules:
  - global
  - coding

tools:
  - filesystem

related_skills:
  - qk-feature-delivery

knowledge_scope:
  domain:
    - product-requirements
    - technical-specifications
  concepts:
    - user-story
    - acceptance-criteria
  references:
    - architecture

decision_boundary:
  owns:
    - technical-ready specification
    - acceptance criteria
  does_not_own:
    - market research
    - pricing
    - roadmap
  conflicts_with: []
  delegates_to:
    - qk-feature-delivery

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: feature

lifecycle:
  promotion_gate:
    tests:
      minimum_pass_rate: 0.9
    usage:
      minimum_runs: 20
    conflicts:
      zero_boundary_violation: true
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
produces: [report, specification]
consumes: [user-description]

token_budget:
  max_files_read: 3
  max_lines_per_read: 150
  max_shell_commands: 0
  stop_early: false

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-product-specification — Product Specifier

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

## Preconditions
- [ ] Tuân thủ workflow `spec-driven-development`.

## Scope
- Tiếp nhận Idea ban đầu từ user, thực hiện phân tích yêu cầu (Requirement Analysis).
- Xác định và làm rõ ranh giới của tính năng.
- Lên danh sách Acceptance Criteria (Tiêu chí nghiệm thu).
- Đóng gói thành Technical Spec (đặc tả kỹ thuật) để chuẩn bị cho quá trình code (Plan & Implementation).
