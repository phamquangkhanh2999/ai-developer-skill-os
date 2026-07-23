---
# ── Identity ───────────────────────────────────────────────
name: qk-devops-platform
version: 8.1.1
status: experimental
description: "Platform engineering: CI/CD strategy, deployment architecture, environment management, and rollback strategy."
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
  stop_early: false

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
- KHÔNG thay thế `qk-production-release` (đóng gói và release app), skill này quản lý *hạ tầng và quy trình* bên dưới việc release đó.
