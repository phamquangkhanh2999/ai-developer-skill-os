---
# ── Identity ───────────────────────────────────────────────
name: qk-design-system-engineering
version: 8.1.0
status: experimental
description: "Quản trị hệ thống thiết kế (Định nghĩa quy tắc hệ thống, tokens, các biến thể component)."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability

intent:
  - design-system
  - tokens
  - component-library
  - accessibility

complexity:
  level: medium
  criteria:
    files_affected: "1-5"
    has_behavior_change: true
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "định nghĩa design system"
  - "cấu trúc token"
  - "quy chuẩn ui"
  - "variants"

# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding

tools:
  - filesystem

related_skills:
  - qk-frontend-architecture

knowledge_scope:
  domain:
    - design-system
    - tokens
  concepts:
    - visual-consistency
    - components-rules
  references:
    - architecture
    - anti-patterns

decision_boundary:
  owns:
    - tokens
    - components rules
    - design governance
  does_not_own:
    - page implementation
    - business logic
  conflicts_with:
    - qk-ui-system-builder

knowledge_dependencies:
  - design-intelligence
  - accessibility-guidelines
  - component-patterns

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
produces: [report, tokens_definition]
consumes: [user-description]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-design-system-engineering — Design System Governance

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

## Preconditions
- [ ] Brand guidelines hoặc UX heuristics cơ bản đã có.

## Scope
- Định nghĩa các quy tắc hệ thống cho tokens, khoảng cách (spacing), màu sắc, phông chữ (typography).
- Xác định quy chuẩn xây dựng component (composition, variants).
- Thiết lập quy tắc A11y (Accessibility) ở cấp độ token.
- **Ngăn chặn triệt để UI Slop từ cấp độ Token (Không cung cấp màu tương phản quá thấp, kích thước quá bé).**
- KHÔNG thay thế việc viết UI code (`qk-ui-system-builder`). Skill này là "governance", không phải "implementation".

## Non-Goals
- ❌ Provide implementation outside of Design System Governance scope
- ❌ Override explicit user directives without explanation
- ❌ Guess ambiguous requirements without asking

## Priority Order

| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1 | Core Design System Governance analysis and decision making | Never |
| P2 | Validation of existing patterns | Budget < 30% |
| P3 | Detailed documentation generation | Budget < 50% |
| P4 | Edge case exploration | Budget < 70% |

## Workflow

### Phase 1 — Context Loading
**Steps:**
1. Read existing configuration and requirements related to Design System Governance.
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
1. Analyze the current state against Design System Governance best practices.
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
| CRITICAL | Severe violation of Design System Governance principles |
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
BLOCKED: Missing critical context for Design System Governance
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
| SUCCESS | Design System Governance task completed successfully | Strategy/audit generated |
| PARTIAL | Task completed with assumptions | Medium confidence |
| BLOCKED | Missing context | Cannot proceed |
| FAILED | Critical conflict or error | Unresolvable constraint |
