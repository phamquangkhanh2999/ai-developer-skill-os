---
# ── Identity ───────────────────────────────────────────────
name: qk-frontend-architecture
version: 9.2.1
status: archived
description: "Công cụ quyết định kiến trúc Frontend (Chiến lược component, quản lý state, định tuyến)."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
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

> **⚠️ ARCHIVED (v9.2.1):** Skill này đã được archive. Conflict với `qk-ui-builder`. Quyết định kiến trúc FE được xử lý qua `DEV_PROFILE.md` + `qk-ui-builder`.

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.