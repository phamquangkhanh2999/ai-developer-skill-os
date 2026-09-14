---
# ── Identity ───────────────────────────────────────────────
name: qk-validation-gate
version: 9.2.1
status: relocated
description: "Cổng kiểm tra chất lượng & Eval Pipeline bắt buộc — chạy linters, tests, và đánh giá scorecard.yaml định lượng cho AI Agent."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: utility

intent:
  - quality-assurance
  - verification
  - code-review

complexity:
  level: low
  criteria:
    files_affected: "1-5"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "verify"
  - "kiểm tra"
  - "lint"
  - "test"
  - "run checks"

selection:
  priority: high
  confidence_threshold: 0.75

# ── V8: References ─────────────────────────────────────────
workflow: code-review

rules:
  - global

tools:
  - filesystem
  - terminal

related_skills:
  - qk-engineering-standard

knowledge_scope:
  owns:
    - verification
    - quality-gates
    - test-execution
  references:
    - coding
    - architecture

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: review

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: medium
risk: low
side_effects: run_commands
produces: [report]
consumes: [source-code]

token_budget:
  max_files_read: 3
  max_lines_per_read: 100
  max_shell_commands: 2
  stop_early: false  # Must run all checks — cannot skip for token budget

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-validation-gate — Quality Gate

> **⚠️ ARCHIVED (v9.2.1):** Downgraded thành workflow step. Logic verify đã được embed vào step `verify` của `feature-delivery.yml`, `bug-resolution.yml`, `refactor.yml`. Không cần gọi trực tiếp.

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.