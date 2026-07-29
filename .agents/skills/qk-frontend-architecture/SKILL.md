---
# ── Identity ───────────────────────────────────────────────
name: qk-frontend-architecture
version: 8.1.0
status: experimental
description: "Công cụ quyết định kiến trúc Frontend (Chiến lược component, quản lý state, định tuyến)."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability

intent:
  - frontend-architecture
  - component-strategy
  - state-management

complexity:
  level: high
  criteria:
    files_affected: "5-10"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "cấu trúc frontend"
  - "thiết kế component"
  - "quản lý state"
  - "kiến trúc react"

# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding

tools:
  - filesystem

related_skills:
  - qk-design-system-engineering
  - qk-web-quality-gate

knowledge_scope:
  domain:
    - react
    - frontend-architecture
    - state-management
  concepts:
    - component-hierarchy
    - routing-strategy
  references:
    - architecture
    - coding
    - anti-patterns

decision_boundary:
  owns:
    - architecture decisions
    - state strategy
  does_not_own:
    - component implementation
    - pixel styling
  conflicts_with:
    - qk-ui-builder
  delegates_to:
    - qk-ui-builder
    - qk-ui-system-builder

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
produces: [report, architecture_plan]
consumes: [user-description]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-frontend-architecture — Frontend Architect

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

## Preconditions
- [ ] Xác định framework (React/Next.js/Vue, v.v.).
- [ ] Phạm vi hệ thống frontend cần phân tích rõ ràng.

## Scope
- Đánh giá kiến trúc hiện tại của dự án Frontend.
- Đưa ra quyết định chia nhỏ (breakdown) components.
- Lựa chọn mô hình quản lý state (Global vs Local, Client vs Server). **BẮT BUỘC: Ưu tiên TanStack Query cho Server State; Zustand/Context cho Client State. Tránh Redux trừ khi legacy project bắt buộc.**
- Thiết kế hệ thống routing. **BẮT BUỘC: Sử dụng Next.js App Router (nếu framework là Next.js) hoặc TanStack Router (cho SPA).**
- KHÔNG thay thế việc viết UI code (`qk-ui-builder`). Chỉ giới hạn ở quyết định kiến trúc.
- BẮT BUỘC tuân thủ `anti-patterns.md` (đặc biệt R-C-09) khi thiết kế luồng dữ liệu.

## Non-Goals
- ❌ Provide implementation outside of Frontend Macro Architecture scope
- ❌ Override explicit user directives without explanation
- ❌ Guess ambiguous requirements without asking

## Priority Order

| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1 | Core Frontend Macro Architecture analysis and decision making | Never |
| P2 | Validation of existing patterns | Budget < 30% |
| P3 | Detailed documentation generation | Budget < 50% |
| P4 | Edge case exploration | Budget < 70% |

## Workflow

### Phase 1 — Context Loading
**Steps:**
1. Read existing configuration and requirements related to Frontend Macro Architecture.
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
1. Analyze the current state against Frontend Macro Architecture best practices.
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
| CRITICAL | Severe violation of Frontend Macro Architecture principles |
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
BLOCKED: Missing critical context for Frontend Macro Architecture
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
| SUCCESS | Frontend Macro Architecture task completed successfully | Strategy/audit generated |
| PARTIAL | Task completed with assumptions | Medium confidence |
| BLOCKED | Missing context | Cannot proceed |
| FAILED | Critical conflict or error | Unresolvable constraint |
