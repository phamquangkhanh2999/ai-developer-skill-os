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
  strategy: 
    - lighthouse
    - accessibility
    - performance

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
  stop_early: false

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
