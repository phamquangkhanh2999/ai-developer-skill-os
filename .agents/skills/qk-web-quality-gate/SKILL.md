---
# ── Identity ───────────────────────────────────────────────
name: qk-web-quality-gate
version: 8.1.0
status: experimental
description: "Kiểm toán tổng thể chất lượng Web: Accessibility (A11y), SEO, Web Performance, Security, UX Heuristics."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability

intent:
  - web-performance
  - accessibility
  - seo
  - lighthouse
  - ux-audit

complexity:
  level: high
  criteria:
    files_affected: "1-5"
    has_behavior_change: false
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "kiểm tra web"
  - "tối ưu web"
  - "lighthouse"
  - "audit ui"
  - "core web vitals"

# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-frontend-architecture

knowledge_scope:
  domain:
    - web-performance
    - web-accessibility
  concepts:
    - lighthouse
    - seo
    - ux-heuristics
  references:
    - architecture

decision_boundary:
  owns:
    - lighthouse audit
    - accessibility review
    - performance audit
    - seo audit
  does_not_own:
    - ui component implementation
  conflicts_with: []

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: web-quality-review

selection:
  priority: medium
  confidence_threshold: 0.80

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: slow
risk: low
side_effects: read_only
produces: [report]
consumes: [user-description]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-web-quality-gate — Web Quality Auditor

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

## Preconditions
- [ ] Ứng dụng web đã có thể chạy hoặc code đã được viết một phần.

## Scope
- Thực hiện kiểm toán A11y (Accessibility standards như WCAG).
- Đánh giá Performance (Core Web Vitals, Bundle size, Lazy loading, Cache, Optimize images).
- Kiểm tra SEO best practices (Meta tags, heading structure, semantic HTML).
- Đánh giá UX Heuristics cơ bản.
- Đưa ra khuyến nghị (Recommendation), không phải tự tay fix code nếu chưa được yêu cầu.

## Non-Goals
- ❌ Provide implementation outside of Web Performance & Accessibility scope
- ❌ Override explicit user directives without explanation
- ❌ Guess ambiguous requirements without asking

## Priority Order

| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1 | Core Web Performance & Accessibility analysis and decision making | Never |
| P2 | Validation of existing patterns | Budget < 30% |
| P3 | Detailed documentation generation | Budget < 50% |
| P4 | Edge case exploration | Budget < 70% |

## Workflow

### Phase 1 — Context Loading
**Steps:**
1. Read existing configuration and requirements related to Web Performance & Accessibility.
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
1. Analyze the current state against Web Performance & Accessibility best practices.
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
| CRITICAL | Severe violation of Web Performance & Accessibility principles |
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
BLOCKED: Missing critical context for Web Performance & Accessibility
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
| SUCCESS | Web Performance & Accessibility task completed successfully | Strategy/audit generated |
| PARTIAL | Task completed with assumptions | Medium confidence |
| BLOCKED | Missing context | Cannot proceed |
| FAILED | Critical conflict or error | Unresolvable constraint |
