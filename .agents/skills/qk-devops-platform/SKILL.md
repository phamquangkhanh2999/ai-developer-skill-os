---
# ── Identity ───────────────────────────────────────────────
name: qk-devops-platform
version: 9.2.0
status: experimental
description: "Kỹ sư nền tảng: Chiến lược CI/CD, kiến trúc triển khai, quản lý môi trường và chiến lược rollback. Dùng skill này khi user nhắc đến: ci/cd, deployment, pipeline, docker, dockerfile, devops, github actions, cấu hình ci/cd, containerize — kể cả khi chỉ nói 'viết dockerfile và pipeline deploy staging'."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
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
  - "ci/cd"
  - "deployment"
  - "pipeline"
  - "docker"
  - "dockerfile"
  - "devops"
  - "github actions"
  - "cấu hình ci/cd"
  - "containerize"


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
consumes: [user-description, source-code]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-devops-platform — Platform & CI/CD Engineer

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm thiết kế và cấu hình toàn diện hạ tầng CI/CD, Containerization (Docker), quản lý biến môi trường an toàn và kiến trúc triển khai với **chiến lược Rollback bắt buộc cho mọi thay đổi**.

---

## Preconditions

Trước khi thiết lập hoặc thay đổi cấu hình hạ tầng, AI BẮT BUỘC kiểm tra:

- [ ] Xác định nền tảng CI/CD (GitHub Actions, GitLab CI, Bitbucket Pipelines) và môi trường runtime (Docker, Kubernetes, AWS, Vercel).
- [ ] Xác định chiến lược secret management (GitHub Secrets, HashiCorp Vault, AWS SSM) — tuyệt đối không hardcode credentials.
- [ ] Xác định chiến lược Rollback (Revert commit, container tag rollback, Blue/Green traffic switch).
- [ ] Nếu không có phương án rollback hoặc phát hiện secret bị lộ trong file cấu hình:
  → **EXIT: BLOCKED**
  → Từ chối tạo cấu hình và yêu cầu user thiết lập secret an toàn qua secret manager.

---

## Scope

✅ Skill này làm:
- Viết multi-stage `Dockerfile` tối ưu kích thước image, bảo mật non-root user và layer caching.
- Tạo workflow pipelines CI/CD: Linting, Unit Testing, Security scanning (Trivy/Snyk), Build & Deploy.
- Thiết lập quản lý cấu hình đa môi trường (Development, Staging, Production).
- Cấu hình Healthcheck probes (`livenessProbe`, `readinessProbe`) và Graceful shutdown.
- Xây dựng Runbook khôi phục nhanh (Rollback Runbook) tự động hoặc 1-click.

❌ Skill này KHÔNG làm:
- Thẩm định cổng release production cuối cùng (→ `qk-production-release`).
- Viết application code / API logic bên trong ứng dụng.
- Quản trị tài chính hoặc thanh toán chi phí Cloud.

---

## Execution Steps

### Step 1 — Infrastructure & Dependency Analysis
```
Inputs:  Yêu cầu từ user, Manifests (package.json, requirements.txt, etc.)
Actions:
  - Xác định phiên bản runtime chuẩn (Node.js, Python, Go, Java).
  - Phân tích các bước build: compile assets, install production-only dependencies.
Output: Deployment Architecture Blueprint
```

### Step 2 — Containerization (Multi-stage Dockerfile)
```
Inputs:  Blueprint
Actions:
  - Thiết kế Stage 1 (Builder): Cài đặt devDependencies, build artifacts.
  - Thiết kế Stage 2 (Runner): Copy minimal artifacts, chạy dưới non-root user (USER node / appuser).
  - Thêm `.dockerignore` để loại trừ node_modules, `.git`, `.env`.
Output: Dockerfile & .dockerignore
```

### Step 3 — CI/CD Pipeline Automation
```
Inputs:  CI platform (.github/workflows)
Actions:
  - Thiết lập trigger hợp lý (push on main, PR to dev).
  - Tích hợp caching cho package managers (npm/pnpm/pip cache).
  - Gắn các bước kiểm tra chất lượng tự động: Lint -> Test -> Security Scan -> Build Image.
Output: Pipeline YAML configuration
```

### Step 4 — Verification & Rollback Strategy Verification
```
Inputs:  Pipeline & Dockerfile
Actions:
  - Kiểm tra cú pháp YAML linter.
  - Xác nhận lệnh hoặc cơ chế revert khi pipeline deploy thất bại.
Exit: SUCCESS
```

---

## Prompt Template

```
Hạ tầng mục tiêu: [Docker / GitHub Actions / Kubernetes / AWS / Vercel]
Môi trường:       [Staging / Production / Preview environments]
Yêu cầu:          [Tối ưu Dockerfile / Tạo pipeline CI test+build / Cấu hình auto-deploy]
Ràng buộc:        [Không dùng root user, image size < 200MB, secrets qua Vault]
```