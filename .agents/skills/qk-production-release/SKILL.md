---
# ── Identity ───────────────────────────────────────────────
name: qk-production-release
version: 9.2.0
status: stable
description: "Chuẩn bị release production với 8-gate checklist bắt buộc — không pass gate = không deploy. Dùng skill này khi user nhắc đến: deploy production, release checklist, go live, rollout, chuẩn bị release, kiểm tra release — kể cả khi chỉ hỏi 'đã đủ điều kiện đưa lên production chưa'."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: capability

intent:
  - release-management
  - production-deployment

complexity:
  level: high
  criteria:
    files_affected: "1-5"
    has_behavior_change: false
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "deploy production"
  - "release checklist"
  - "go live"
  - "rollout"
  - "chuẩn bị release"
  - "kiểm tra release"


# ── V8: References ─────────────────────────────────────────
workflow: production-release

rules:
  - global
  - safety

tools:
  - filesystem
  - terminal

related_skills:
  - qk-devops-platform
  - qk-security-audit

knowledge_scope:
  owns:
    - release-checklist
    - deployment-gate
  references:
    - architecture
    - security
    - anti-patterns

decision_boundary:
  owns:
    - release-gate-checklist
    - deployment-readiness-verdict
  does_not_own:
    - ci-cd-pipeline-design
    - infrastructure-provisioning
  conflicts_with:
    - qk-devops-platform

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: release-safety

selection:
  priority: high
  confidence_threshold: 0.85

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: slow
risk: high
side_effects: run_commands
produces: [report, plan]
consumes: [source-code, test-results]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-production-release — Production Release Gate & Readiness Auditor

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

Chịu trách nhiệm thẩm tra toàn diện sự sẵn sàng của hệ thống trước khi đưa lên môi trường Production thông qua **8-Gate Checklist bắt buộc**. Nguyên tắc bất di bất dịch: **1 Gate không đạt = DỪNG DEPLOY**.

---

## Preconditions

Trước khi cấp quyền release, AI BẮT BUỘC kiểm tra:

- [ ] Xác định commit hash hoặc release tag chuẩn bị deploy.
- [ ] Xác định môi trường đích (Production) và biến môi trường cần thiết.
- [ ] Đảm bảo có kế hoạch Rollback khẩn cấp (Rollback Runbook) đã được xác nhận.
- [ ] Nếu có bất kỳ test suite nào thất bại hoặc phát hiện secret leak:
  → **EXIT: BLOCKED**
  → Từ chối release và lập báo cáo chi tiết các lỗi cần khắc phục.

---

## Scope

✅ Skill này làm:
- Thẩm định 8 Cổng An toàn (8-Gate Checklist):
  1. Build & Compile Gate (Build pass 100%, không type errors).
  2. Test Suite Gate (Unit + Integration tests pass).
  3. Security Gate (Không có critical CVE, không leak secrets trong code).
  4. Database Migration Gate (Migration an toàn, backward-compatible).
  5. Environment Config Gate (.env.production đầy đủ keys, không thiếu config).
  6. Performance & Health Check Gate (Có endpoint /healthz, /readyz).
  7. Rollback Plan Gate (Có lệnh hoặc pipeline rollback rõ ràng).
  8. Observability Gate (Logging, Error monitoring Sentry/Datadog đã sẵn sàng).
- Lập Báo cáo Thẩm định Sẵn sàng (Production Readiness Report).
- Khuyến nghị quyết định: **GO** (Cho phép deploy) hoặc **NO-GO** (Chặn deploy).

❌ Skill này KHÔNG làm:
- Trực tiếp chạy lệnh deploy phá hủy môi trường live nếu chưa có xác nhận từ người dùng.
- Thiết kế hạ tầng CI/CD pipeline từ đầu (→ `qk-devops-platform`).
- Sửa lỗi code trực tiếp (→ `qk-bug-resolution`).

---

## Execution Steps

### Step 1 — Artifact & Build Verification
```
Inputs:  Commit hash/tag, Build scripts
Actions:
  - Kiểm tra trạng thái build và artifact tĩnh.
  - Xác thực không có file nhạy cảm lọt vào distribution build (.map files nhạy cảm, dev configs).
Output: Build status verdict
```

### Step 2 — 8-Gate Audit Execution
```
Inputs:  Source code, Config manifests, Test logs
Actions:
  - Kiểm tra lần lượt 8 cổng theo checklist.
  - Ghi nhận chi tiết trạng thái (PASS / FAIL / WARN) cho từng cổng.
Exit: BLOCKED ngay khi phát hiện Gate mang tính chặn (Security, Build, Test) bị FAIL.
```

### Step 3 — Rollback & Contingency Assessment
```
Inputs:  Deployment strategy (Blue/Green, Rolling, Canary)
Actions:
  - Xác nhận thời gian phục hồi tối đa (RTO) và kịch bản revert DB nếu migration lỗi.
  - Soạn sẵn câu lệnh khôi phục trạng thái cũ.
Output: Rollback verification checklist
```

### Step 4 — Readiness Verdict Delivery
```
Inputs:  Audit results
Actions:
  - Xuất bảng tổng kết 8-Gate với kết luận rõ ràng GO / NO-GO.
  - Bàn giao hướng dẫn các bước release thủ công hoặc qua pipeline cho kỹ sư vận hành.
Exit: SUCCESS
```

---

## Prompt Template

```
Phiên bản / Tag: [Release version — ví dụ: v2.4.0 hoặc commit hash]
Môi trường:      [Production / Staging-to-Production]
Thay đổi chính:  [Tóm tắt tính năng / bugfix trong đợt release này]
DB Migration:    [Có migration không? Có thay đổi bảng dữ liệu nào?]
Kế hoạch Rollback: [Đã có phương án revert chưa?]
```