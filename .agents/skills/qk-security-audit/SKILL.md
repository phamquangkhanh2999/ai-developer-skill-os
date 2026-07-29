---
# ── Identity ───────────────────────────────────────────────
name: qk-security-audit
version: 8.3.1
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
    - security
    - anti-patterns

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
  stop_early: true

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
- **Quét lỗ hổng Prompt Injection và xác minh ranh giới Zero-Trust theo đúng R-SEC-04.**
- Check dựa trên OWASP Top 10.
- Khuyến nghị bản vá bảo mật tương ứng.

## Non-Goals
- ❌ Provide implementation outside of Security Vulnerability Detection scope
- ❌ Override explicit user directives without explanation
- ❌ Guess ambiguous requirements without asking

## Priority Order

| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1 | Core Security Vulnerability Detection analysis and decision making | Never |
| P2 | Validation of existing patterns | Budget < 30% |
| P3 | Detailed documentation generation | Budget < 50% |
| P4 | Edge case exploration | Budget < 70% |

## Workflow

### Phase 1 — Context Loading
**Steps:**
1. Read existing configuration and requirements related to Security Vulnerability Detection.
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
1. Analyze the current state against Security Vulnerability Detection best practices.
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
| CRITICAL | Severe violation of Security Vulnerability Detection principles |
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
BLOCKED: Missing critical context for Security Vulnerability Detection
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
| SUCCESS | Security Vulnerability Detection task completed successfully | Strategy/audit generated |
| PARTIAL | Task completed with assumptions | Medium confidence |
| BLOCKED | Missing context | Cannot proceed |
| FAILED | Critical conflict or error | Unresolvable constraint |
