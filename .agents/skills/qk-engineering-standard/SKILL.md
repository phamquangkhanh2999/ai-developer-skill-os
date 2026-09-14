---
# ── Identity ───────────────────────────────────────────────
name: qk-engineering-standard
version: 9.2.1
status: relocated
description: "Ép buộc SOLID, DRY, Clean Code với ngưỡng số liệu cụ thể — không có rule mơ hồ."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: utility

intent:
  - code-quality
  - standards-enforcement

complexity:
  level: medium
  criteria:
    files_affected: "1-5"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "review code"
  - "clean code"
  - "check standard"
  - "refactor clean"
  - "kiểm tra chuẩn"

# ── V8: References ─────────────────────────────────────────
workflow: code-review

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-project-health
  - qk-system-evolution

knowledge_scope:
  owns:
    - coding-standards
    - best-practices
  references:
    - architecture
    - security
    - anti-patterns

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: review

selection:
  priority: high
  confidence_threshold: 0.80

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: medium
risk: low
side_effects: read_only
produces: [report]
consumes: [source-code]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 1
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-engineering-standard — Code Quality Enforcer

> **⚠️ ARCHIVED (v9.2.1):** Downgraded thành rule. Nội dung đã được merge vào `.agents/rules/coding.md` (R-C-10). Không cần gọi trực tiếp — áp dụng tự động trong mọi skill có `side_effects: edit_files`.

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.