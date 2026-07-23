---
# ── Identity ───────────────────────────────────────────────
name: qk-design-system-engineering
version: 8.1.0
status: experimental
description: "Governance cho Design System (Định nghĩa system rules, tokens, component variants)."
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
  stop_early: false

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-design-system-engineering — Design System Governance

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

## Preconditions
- [ ] Brand guidelines hoặc UX heuristics cơ bản đã có.

## Scope
- Define system rules for tokens, spacing, colors, typography.
- Xác định quy chuẩn xây dựng component (composition, variants).
- Thiết lập quy tắc A11y (Accessibility) ở cấp độ token.
- KHÔNG thay thế việc viết UI code (`qk-ui-system-builder`). Skill này là "governance", không phải "implementation".
