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
    - security
    - anti-patterns

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
produces: [report, specification]
consumes: [user-description]

token_budget:
  max_files_read: 3
  max_lines_per_read: 150
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-product-specification — Product Specifier

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

## Preconditions
- [ ] Tuân thủ workflow `spec-driven-development`.

## Scope
- Tiếp nhận Idea ban đầu từ user, thực hiện phân tích yêu cầu (Requirement Analysis).
- Xác định và làm rõ ranh giới của tính năng.
- Lên danh sách Acceptance Criteria (Tiêu chí nghiệm thu). **BẮT BUỘC có Security Acceptance Criteria để phòng ngừa rủi ro theo R-SEC-04 (Zero-Trust).**
- Đóng gói thành Technical Spec (đặc tả kỹ thuật) để chuẩn bị cho quá trình code (Plan & Implementation).

## Non-Goals
- ❌ Provide implementation outside of Product Thinking & Requirements scope
- ❌ Override explicit user directives without explanation
- ❌ Guess ambiguous requirements without asking

## Priority Order

| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1 | Core Product Thinking & Requirements analysis and decision making | Never |
| P2 | Validation of existing patterns | Budget < 30% |
| P3 | Detailed documentation generation | Budget < 50% |
| P4 | Edge case exploration | Budget < 70% |

## Workflow

### Phase 1 — Context Loading
**Steps:**
1. Read existing configuration and requirements related to Product Thinking & Requirements.
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
1. Analyze the current state against Product Thinking & Requirements best practices.
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
| CRITICAL | Severe violation of Product Thinking & Requirements principles |
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
BLOCKED: Missing critical context for Product Thinking & Requirements
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
| SUCCESS | Product Thinking & Requirements task completed successfully | Strategy/audit generated |
| PARTIAL | Task completed with assumptions | Medium confidence |
| BLOCKED | Missing context | Cannot proceed |
| FAILED | Critical conflict or error | Unresolvable constraint |
