---
# ── Identity ───────────────────────────────────────────────
name: qk-devops-platform
version: 8.3.1
status: experimental
description: "Kỹ sư nền tảng: Chiến lược CI/CD, kiến trúc triển khai, quản lý môi trường và chiến lược rollback."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability

intent:
  - devops-strategy
  - cicd-pipeline
  - deployment-architecture
  - environment-management

complexity:
  level: high
  criteria:
    files_affected: "1-5"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "cấu hình ci/cd"
  - "deployment strategy"
  - "quản lý môi trường"
  - "devops platform"
  - "dockerize"

# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding
  - security

tools:
  - filesystem
  - terminal

related_skills:
  - qk-production-release
  - qk-security-audit

knowledge_scope:
  domain:
    - devops
    - platform-engineering
    - cloud-infrastructure
  concepts:
    - continuous-integration
    - continuous-deployment
    - containerization
    - rollback-strategy
  references:
    - architecture
    - security
    - anti-patterns

decision_boundary:
  owns:
    - CI/CD strategy
    - deployment architecture
    - environment management
    - rollback strategy
  does_not_own:
    - application code
    - cloud billing
    - releasing features
  conflicts_with:
    - qk-production-release

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
risk: high
side_effects: edit_files
produces: [report, plan, code]
consumes: [user-description]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-devops-platform — Platform Engineer

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

## Preconditions
- [ ] Requirements cho môi trường triển khai đã có sẵn.

## Scope
- Thiết kế và thiết lập luồng CI/CD (GitHub Actions, GitLab CI, v.v.).
- Xây dựng kiến trúc deployment, quản lý các container (Docker, Kubernetes).
- Đưa ra chiến lược Rollback an toàn khi có sự cố.
- Quản lý và phân tách các môi trường (Dev, Staging, Prod).
- **Bắt buộc tuân thủ R-SEC-04: Mọi secrets/credentials trong CI/CD phải được inject qua biến môi trường an toàn (Github Secrets/Vault), KHÔNG BAO GIỜ hardcode.**
- KHÔNG thay thế `qk-production-release` (đóng gói và release app), skill này quản lý *hạ tầng và quy trình* bên dưới việc release đó.

## Non-Goals
- ❌ Provide implementation outside of DevOps & CI/CD scope
- ❌ Override explicit user directives without explanation
- ❌ Guess ambiguous requirements without asking

## Priority Order

| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1 | Core DevOps & CI/CD analysis and decision making | Never |
| P2 | Validation of existing patterns | Budget < 30% |
| P3 | Detailed documentation generation | Budget < 50% |
| P4 | Edge case exploration | Budget < 70% |

## Workflow

### Phase 1 — Context Loading
**Steps:**
1. Read existing configuration and requirements related to DevOps & CI/CD.
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
1. Analyze the current state against DevOps & CI/CD best practices.
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
| CRITICAL | Severe violation of DevOps & CI/CD principles |
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
BLOCKED: Missing critical context for DevOps & CI/CD
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
| SUCCESS | DevOps & CI/CD task completed successfully | Strategy/audit generated |
| PARTIAL | Task completed with assumptions | Medium confidence |
| BLOCKED | Missing context | Cannot proceed |
| FAILED | Critical conflict or error | Unresolvable constraint |
