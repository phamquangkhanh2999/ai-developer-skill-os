---
# ── Identity ───────────────────────────────────────────────
name: qk-security-audit
version: 9.2.0
status: experimental
description: "Audit bảo mật ứng dụng theo OWASP: phát hiện lỗ hổng, secret leak, dependency risk, permission model — output là report + remediation plan, KHÔNG tự sửa code. Dùng skill này khi user nhắc đến: security audit, kiểm tra bảo mật, scan lỗ hổng, owasp, tìm secret leak, dependency vulnerability, npm audit, pip audit, lộ api key — kể cả khi chỉ nói 'code này có an toàn không'."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
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
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "security audit"
  - "kiểm tra bảo mật"
  - "scan lỗ hổng"
  - "owasp"
  - "tìm secret leak"
  - "dependency vulnerability"
  - "npm audit"
  - "pip audit"
  - "lộ api key"


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
  delegates_to: []
  # Note: validation/verify logic nằm trong step 'verify' của workflow security-audit.yml
  # qk-validation-gate đã được downgrade thành workflow step (v9.2.1) — không còn là skill độc lập

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
risk: medium        # scan đọc sensitive files (env, config, secrets) — không phải low
side_effects: read_only
produces: [report, remediation_plan]   # read_only = không tự patch code, chỉ báo cáo + đề xuất fix
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

---

## Preconditions

- [ ] Biết scope cần audit: toàn bộ codebase / 1 module / 1 PR / 1 dependency
  → Nếu chưa biết: hỏi user trước khi bắt đầu scan
- [ ] Không được ghi vào bất kỳ file nào trong quá trình audit (`side_effects: read_only`)
- [ ] Nếu phát hiện secret đang live (API key, password): **BLOCKED ngay** — báo user xử lý trước
- [ ] Output là report + remediation_plan — KHÔNG tự sửa code, KHÔNG tự revoke secret

---

## Scope

✅ Skill này làm:
- Scan OWASP Top 10: injection, broken auth, sensitive data exposure, XSS, IDOR...
- Detect secret/credential leak trong code, config, commit history pattern
- Audit dependency vulnerabilities (npm audit / pip audit / cargo audit equivalent)
- Review permission model: RBAC gaps, over-privileged roles, missing auth checks
- Phát hiện prompt injection risk (nếu project có AI/LLM component)
- Output: Severity-ranked finding list + remediation plan cho từng finding

❌ Skill này KHÔNG làm:
- Tự sửa code để fix lỗ hổng (→ dùng `qk-bug-resolution` sau khi có report)
- Implement RBAC/ABAC (→ `qk-access-policy`)
- Penetration testing thực sự (cần human expert)
- Compliance certification (SOC2, ISO27001...)
- Revoke credentials hay rotate secrets (→ user tự làm)

---

## Execution Steps

### Step 1 — Xác định scope và threat model
```
Inputs:  user_description, DEV_PROFILE.md (stack info)
Actions:
  - Xác định: audit toàn bộ / module cụ thể / diff của PR
  - Xác định attack surface dựa trên stack:
    Web app    → injection, XSS, CSRF, auth bypass
    API        → broken auth, IDOR, rate limiting, input validation
    Data       → SQL injection, data exposure, access control
    AI/LLM     → prompt injection, data poisoning, model extraction
    DevOps     → secrets in CI, misconfigured IAM, container escape
  - List top 5 risk areas cần ưu tiên
Outputs: audit_scope, threat_model
Exit: BLOCKED nếu scope quá rộng mà không có priority
```

### Step 2 — Scan theo OWASP Top 10
```
Actions (đọc có mục tiêu, không dump toàn bộ codebase):
  A01 Broken Access Control:
    - Grep auth middleware: routes có bị skip không
    - Check role check consistency (if admin check ở route nhưng thiếu ở service)
  A02 Cryptographic Failures:
    - Tìm hardcoded secrets: grep pattern (password=, api_key=, secret=, token=)
    - Check password hashing: bcrypt/argon2 hay MD5/SHA1?
    - Check TLS config nếu có
  A03 Injection:
    - SQL: tìm string concatenation trong queries
    - Command injection: exec(), eval(), subprocess với user input
    - Template injection (SSTI)
  A05 Security Misconfiguration:
    - .env.example so sánh với .env (nếu đọc được)
    - CORS config: wildcard origin?
    - Debug mode enabled trong production config?
  A06 Vulnerable Components:
    - Đọc package.json / requirements.txt / go.mod
    - Flag packages có known CVE hoặc deprecated
  A09 Logging Failures:
    - Sensitive data trong logs (password, token, PII)?
    - Missing security event logging (failed login, permission denied)?
Token budget: max 10 files, 150 lines/file — ưu tiên auth/middleware/config files
```

### Step 3 — Detect Secret Leak
```
Actions:
  - Grep patterns: (api[_-]?key|secret|password|token|credential)\s*[:=]\s*['"][^'"]{8,}
  - Check: .env files committed? (git ls-files | grep .env)
  - Check config files: database URL có credential?
  - Check source code comments: TODO fix this hardcoded password
  - Check test files: mock credentials có bị copy từ production?
Exit: BLOCKED ngay nếu tìm thấy live credential — báo user xử lý trước khi tiếp tục
```

### Step 4 — Output Report
```
Format bắt buộc:
  CRITICAL (fix ngay, không deploy):
    [C1] [Tên lỗi] — [File:line] — [Mô tả] — [Remediation]

  HIGH (fix trong sprint này):
    [H1] [Tên lỗi] — [File:line] — [Mô tả] — [Remediation]

  MEDIUM (schedule fix):
    [M1] ...

  LOW / INFORMATIONAL:
    [L1] ...

  SUMMARY:
    Critical: N | High: N | Medium: N | Low: N
    Most urgent: [top 3 cần fix ngay]
    Recommended next skill: qk-bug-resolution (để fix từng finding)
                            qk-access-policy (nếu có RBAC gap)
```

---

## Prompt Template

```
Audit scope: [toàn bộ codebase / module X / PR #N / file Y]
Stack:       [đọc từ DEV_PROFILE.md — hoặc ghi rõ nếu chưa có]
Ưu tiên:    [injection / secrets / auth / dependencies / tất cả]
Context:     [sắp deploy production / sau khi thêm auth feature / định kỳ / ...]
```

### Theo Role:

**role: be / fullstack**
```
Audit scope: src/api/ + src/middleware/
Ưu tiên:    auth bypass, SQL injection, secret leak
Context:    Sắp deploy lên production lần đầu
```
→ AI focus: auth middleware completeness, parameterized queries, JWT validation, CORS.

**role: devops**
```
Audit scope: .github/workflows/ + Dockerfile + terraform/
Ưu tiên:    secrets in CI, IAM over-privilege, container security
Context:    Sau khi onboard engineer mới vào team
```
→ AI focus: secrets in env vars vs secrets manager, IAM least privilege, base image CVEs.

**role: ai-engineer**
```
Audit scope: prompts/ + agents/ + retrieval/
Ưu tiên:    prompt injection, data poisoning, PII in context
Context:    RAG system sắp ra production
```
→ AI focus: input sanitization trước khi đưa vào prompt, output filtering,
  PII không được persist trong vector DB, guardrails có đủ không.
