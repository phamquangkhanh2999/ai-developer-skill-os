---
# ── Identity ───────────────────────────────────────────────
name: qk-security-audit
version: 8.1.0
status: experimental
description: "Security audit (OWASP, dependency security, secret detection, permission model)."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability

intent:
  - security-audit
  - vulnerability-scan
  - secret-detection
  - permission-review

complexity:
  level: high
  criteria:
    files_affected: "1-10"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "kiểm tra bảo mật"
  - "scan lỗ hổng"
  - "audit code"
  - "tìm secret leak"

# ── V8: References ─────────────────────────────────────────
workflow: security-audit

rules:
  - global
  - security

tools:
  - filesystem
  - terminal

related_skills:
  - qk-access-policy

knowledge_scope:
  domain:
    - security-practices
    - vulnerability-detection
  concepts:
    - owasp
    - secret-detection
  references:
    - architecture

decision_boundary:
  owns:
    - application-security
    - agent-security
    - prompt-injection
    - dependency-risk
  does_not_own:
    - access control implementation
    - penetration testing
    - compliance certification
  conflicts_with: []
  delegates_to:
    - qk-validation-gate

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
  priority: high
  confidence_threshold: 0.85

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: slow
risk: low
side_effects: read_only
produces: [report, security_fixes]
consumes: [user-description]

token_budget:
  max_files_read: 10
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: false

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-security-audit — Security Auditor

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

## Preconditions
- [ ] Tuân thủ `security.md`.
- [ ] Xác định phạm vi codebase cần audit.

## Scope
- Quét và phát hiện các rủi ro bảo mật từ dependencies bên thứ ba.
- Nhận diện secret bị hardcode/leak (API keys, passwords, tokens).
- Rà soát mô hình phân quyền (RBAC, ABAC) và kiểm tra lỗ hổng logic (BOLA, Broken Auth).
- Check dựa trên OWASP Top 10.
- Khuyến nghị bản vá bảo mật tương ứng.
