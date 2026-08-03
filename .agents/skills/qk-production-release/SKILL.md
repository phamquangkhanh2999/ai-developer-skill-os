---
# ── Identity ───────────────────────────────────────────────
name: qk-production-release
version: 9.1.0
status: stable
description: "Chuẩn bị release production với 8-gate checklist bắt buộc — không pass gate = không deploy."
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
  - "release production"
  - "deploy production"
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
  - qk-validation-gate

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
consumes: [validation-gate-result, source-code]

token_budget:
  max_files_read: 3
  max_lines_per_read: 100
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-production-release — Release Gate

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

## Memory Workflow

### 0. Self-Init Protocol (Khởi Tạo Bộ Nhớ Local & Gitignore)
- Trước khi tra cứu hoặc lưu trữ tri thức, BẮT BUỘC kiểm tra sự tồn tại của thư mục `.ai-local/` tại gốc dự án:
  - **Tự động tạo mới:** Nếu `.ai-local/` chưa tồn tại, AI phải tự động tạo cấu trúc thư mục `.ai-local/knowledge/` (và file `index.yaml` nếu cần thiết) cùng `.ai-local/candidates/`. Tuyệt đối không ngưng chạy hay hỏi ý kiến người dùng về thao tác khởi tạo tiêu chuẩn này.
  - **Bảo mật Gitignore:** BẮT BUỘC kiểm tra file `.gitignore` của dự án, nếu chưa có dòng `.ai-local/` thì phải tự động thêm vào để tuyệt đối bảo mật tri thức cá nhân và tránh lộ lọt lên Git.

---

### Pre-flight Retrieve (Trước khi thực thi)
- Trước các task có tính lặp lại, debug, refactor, kiến trúc hoặc rủi ro cao:
  bắt buộc tra cứu:
  - `.ai-local/knowledge/index.yaml` (Private Local Knowledge)

- Ưu tiên sử dụng các Knowledge đang có trạng thái `Active` thuộc:
  - Architecture
  - Hard Bug
  - Convention
  - Pattern
  - Tech Debt Pattern
  - 👉 *Domain Focus:* Convention / Hard Bug (vd: 8-gate checklist release, rủi ro production cũ).

- Memory chỉ đóng vai trò **Navigator (bản đồ chỉ đường)**.
  Không được xem Memory là Source of Truth.
  Luôn xác minh lại bằng source code, configuration và trạng thái hiện tại của dự án trước khi áp dụng.

---

### Learning Flow (AI tự học có kiểm soát)
- Trong quá trình làm việc, AI được phép tự phát hiện và tạo **Candidate Memory** khi nhận thấy:
  - Hard Bug có khả năng tái diễn.
  - Pattern làm việc lặp lại trong dự án.
  - Convention hoặc quy tắc kiến trúc mới.
  - Quyết định Architecture quan trọng.
  - Tech Debt Pattern hoặc Code Smell có tính hệ thống.
  - 👉 *Domain Harvest:* Checklist hoặc Gate bảo vệ Production mới được đưa ra từ post-mortem.

- Candidate Memory chỉ là bản nháp quan sát, chưa phải tri thức chính thức.
- Candidate Memory có thể lưu tạm tại: `.ai-local/candidates/`
- AI không được tự động Promote Candidate Memory thành Project Knowledge.

---

### Post-flight Harvest (Đề xuất → Phê duyệt)
Sau khi hoàn thành task:
- AI đánh giá các Candidate Memory đã tạo.
- Nếu phát hiện tri thức có giá trị tái sử dụng:
  - Đề xuất người dùng xem xét.
  - Gửi yêu cầu phê duyệt thông qua:
    - `/learn`
    - `qk-project-memory`
- Chỉ sau khi được phê duyệt, Candidate Memory mới được chuyển thành Knowledge chính thức:

```
.ai-local/candidates/  ──(Approve)──>  .ai-local/knowledge/index.yaml
```

- Project Knowledge phải được xem như tài sản kỹ thuật của dự án:
  - Có thể review, cập nhật, loại bỏ và có lịch sử thay đổi.

---

### Ignore (Không đưa vào Memory)
Không lưu:
- Trace log của một session đơn lẻ.
- Temporary debugging data.
- Output của một lần chạy test/scan.
- Report health tạm thời của một đợt kiểm tra.
- Lỗi nhỏ chỉ xảy ra một lần.
- Thông tin không có khả năng tái sử dụng.
- 👉 *Domain Ignore:* Log deploy staging tạm thời.

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---



### Pre-flight Retrieve (Trước khi thực thi)
- Trước các task có tính lặp lại, debug, refactor, kiến trúc hoặc rủi ro cao:
  bắt buộc tra cứu:
  - `.agents/knowledge/index.yaml` (Shared Project Knowledge)
  - `.ai-local/knowledge/index.yaml` (Private Local Knowledge)

- Ưu tiên sử dụng các Knowledge đang có trạng thái `Active` thuộc:
  - Architecture
  - Hard Bug
  - Convention
  - Pattern
  - Tech Debt Pattern
  - 👉 *Domain Focus:* Convention / Hard Bug (vd: 8-gate checklist release, rủi ro production cũ).

- Memory chỉ đóng vai trò **Navigator (bản đồ chỉ đường)**.
  Không được xem Memory là Source of Truth.
  Luôn xác minh lại bằng source code, configuration và trạng thái hiện tại của dự án trước khi áp dụng.

---

### Learning Flow (AI tự học có kiểm soát)
- Trong quá trình làm việc, AI được phép tự phát hiện và tạo **Candidate Memory** khi nhận thấy:
  - Hard Bug có khả năng tái diễn.
  - Pattern làm việc lặp lại trong dự án.
  - Convention hoặc quy tắc kiến trúc mới.
  - Quyết định Architecture quan trọng.
  - Tech Debt Pattern hoặc Code Smell có tính hệ thống.
  - 👉 *Domain Harvest:* Checklist hoặc Gate bảo vệ Production mới được đưa ra từ post-mortem.

- Candidate Memory chỉ là bản nháp quan sát, chưa phải tri thức chính thức.
- Candidate Memory có thể lưu tạm tại: `.ai-local/candidates/`
- AI không được tự động Promote Candidate Memory thành Project Knowledge.

---

### Post-flight Harvest (Đề xuất → Phê duyệt)
Sau khi hoàn thành task:
- AI đánh giá các Candidate Memory đã tạo.
- Nếu phát hiện tri thức có giá trị tái sử dụng:
  - Đề xuất người dùng xem xét.
  - Gửi yêu cầu phê duyệt thông qua:
    - `/learn`
    - `qk-project-memory`
- Chỉ sau khi được phê duyệt, Candidate Memory mới được chuyển thành Knowledge chính thức:

```
.ai-local/candidates/  ──(Approve)──>  .agents/knowledge/index.yaml
```

- Project Knowledge phải được xem như tài sản kỹ thuật của dự án:
  - Có thể review, cập nhật, loại bỏ và có lịch sử thay đổi.

---

### Ignore (Không đưa vào Memory)
Không lưu:
- Trace log của một session đơn lẻ.
- Temporary debugging data.
- Output của một lần chạy test/scan.
- Report health tạm thời của một đợt kiểm tra.
- Lỗi nhỏ chỉ xảy ra một lần.
- Thông tin không có khả năng tái sử dụng.
- 👉 *Domain Ignore:* Log deploy staging tạm thời.

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---
---

### Learning Flow (AI tự học có kiểm soát)
- Trong quá trình làm việc, AI được phép tự phát hiện và tạo **Candidate Memory** khi nhận thấy:
  - Hard Bug có khả năng tái diễn.
  - Pattern làm việc lặp lại trong dự án.
  - Convention hoặc quy tắc kiến trúc mới.
  - Quyết định Architecture quan trọng.
  - Tech Debt Pattern hoặc Code Smell có tính hệ thống.
  - 👉 *Domain Harvest:* Checklist hoặc Gate bảo vệ Production mới được đưa ra từ post-mortem.

- Candidate Memory chỉ là bản nháp quan sát, chưa phải tri thức chính thức.
- Candidate Memory có thể lưu tạm tại: `.ai-local/candidates/`
- AI không được tự động Promote Candidate Memory thành Project Knowledge.

---

### Post-flight Harvest (Đề xuất → Phê duyệt)
Sau khi hoàn thành task:
- AI đánh giá các Candidate Memory đã tạo.
- Nếu phát hiện tri thức có giá trị tái sử dụng:
  - Đề xuất người dùng xem xét.
  - Gửi yêu cầu phê duyệt thông qua:
    - `/learn`
    - `qk-project-memory`
- Chỉ sau khi được phê duyệt, Candidate Memory mới được chuyển thành Knowledge chính thức:

```
.ai-local/candidates/  ──(Approve)──>  .agents/knowledge/index.yaml
```

- Project Knowledge phải được xem như tài sản kỹ thuật của dự án:
  - Có thể review, cập nhật, loại bỏ và có lịch sử thay đổi.

---

### Ignore (Không đưa vào Memory)
Không lưu:
- Trace log của một session đơn lẻ.
- Temporary debugging data.
- Output của một lần chạy test/scan.
- Report health tạm thời của một đợt kiểm tra.
- Lỗi nhỏ chỉ xảy ra một lần.
- Thông tin không có khả năng tái sử dụng.
- 👉 *Domain Ignore:* Log deploy staging tạm thời.

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---
---

### Learning Flow (AI tự học có kiểm soát)
- Trong quá trình làm việc, AI được phép tự phát hiện và tạo **Candidate Memory** khi nhận thấy:
  - Hard Bug có khả năng tái diễn.
  - Pattern làm việc lặp lại trong dự án.
  - Convention hoặc quy tắc kiến trúc mới.
  - Quyết định Architecture quan trọng.
  - Tech Debt Pattern hoặc Code Smell có tính hệ thống.
  - 👉 *Domain Harvest:* Checklist hoặc Gate bảo vệ Production mới được đưa ra từ post-mortem.

- Candidate Memory chỉ là bản nháp quan sát, chưa phải tri thức chính thức.
- Candidate Memory có thể lưu tạm tại: `.ai-local/candidates/`
- AI không được tự động Promote Candidate Memory thành Project Knowledge.

---

### Post-flight Harvest (Đề xuất → Phê duyệt)
Sau khi hoàn thành task:
- AI đánh giá các Candidate Memory đã tạo.
- Nếu phát hiện tri thức có giá trị tái sử dụng:
  - Đề xuất người dùng xem xét.
  - Gửi yêu cầu phê duyệt thông qua:
    - `/learn`
    - `qk-project-memory`
- Chỉ sau khi được phê duyệt, Candidate Memory mới được chuyển thành Knowledge chính thức:

```
.ai-local/candidates/  ──(Approve)──>  .agents/knowledge/index.yaml
```

- Project Knowledge phải được xem như tài sản kỹ thuật của dự án:
  - Có thể review, cập nhật, loại bỏ và có lịch sử thay đổi.

---

### Ignore (Không đưa vào Memory)
Không lưu:
- Trace log của một session đơn lẻ.
- Temporary debugging data.
- Output của một lần chạy test/scan.
- Report health tạm thời của một đợt kiểm tra.
- Lỗi nhỏ chỉ xảy ra một lần.
- Thông tin không có khả năng tái sử dụng.
- 👉 *Domain Ignore:* Log deploy staging tạm thời.

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---
---
---
---

## Preconditions
- [ ] `qk-validation-gate` has been run and returned SUCCESS or PARTIAL
- [ ] All HIGH priority bugs are resolved
- [ ] Production environment variables are configured (not dev)

```
On missing precondition:
  EXIT: BLOCKED
  Message: "qk-validation-gate must pass before release. Run it first."
```

## Scope
- ✅ Run 8-gate release checklist
- ✅ Verify no dev artifacts in production build
- ✅ Verify environment configuration

## Non-Goals
- ❌ Fix bugs — that's `qk-bug-resolution`
- ❌ Deploy to infrastructure — that's DevOps/CI system
- ❌ Skip any gate unless user explicitly overrides

## Priority Order

| Priority | Gate | Block Release? |
|----------|------|---------------|
| P1 | Validation gate result (from qk-validation-gate) | YES — hard block |
| P2 | No unresolved HIGH/CRITICAL bugs | YES — hard block |
| P3 | No `console.log` / debug artifacts in src/ | YES — hard block |
| P4 | .env.production exists (not .env.development) | YES — hard block |
| P5 | Build succeeds in production mode | YES — hard block |
| P6 | Bundle size within limit (< 500KB gzipped) | WARN only |
| P7 | No dev dependencies in production build. Check vulnerabilities (`npm audit`) | YES — hard block (Nếu có CRITICAL, báo gọi `qk-security-audit`) |
| P8 | CHANGELOG.md updated with release notes | WARN only |

## Release Checklist (Mandatory)

```
[ ] P1: qk-validation-gate: SUCCESS
[ ] P2: 0 unresolved HIGH/CRITICAL bugs
[ ] P3: grep -r "console.log\|debugger" src/ → empty
[ ] P4: .env.production configured, NODE_ENV=production
[ ] P5: npm run build (production mode) → exit 0
[ ] P6: Bundle size ≤ 500KB gzipped (warn if exceeded)
[ ] P7: npm audit --production → 0 critical/high
[ ] P8: CHANGELOG.md has entry for this release
```

## Workflow

### Phase 1 — Pre-flight Checks (P1–P4)

**Steps:**
1. Verify validation-gate result (check previous output or re-read)
2. `grep_search` for `console.log`, `debugger`, `TODO:`, `FIXME:`
3. Check for `.env.production` vs `.env.development` configuration

**Decision:**
```
IF any P1–P4 check fails
  → EXIT: FAILED immediately
  → Report which gate failed and exact fix required

IF all P1–P4 pass
  → go to Phase 2
```

### Phase 2 — Build & Size Gate (P5–P7)

**Steps:**
1. (If allowed) `npm run build` — 1 command used
2. Check bundle size if measurable
3. `npm audit --production` — 2nd command

**Decision:**
```
IF build fails
  → EXIT: FAILED

IF bundle size > 500KB
  → Note as WARNING, do not block

IF production audit has critical/high
  → EXIT: FAILED
```

### Phase 3 — Release Report

Generate signed release report with all gate results.

**Decision:**
```
IF all hard-block gates pass
  → EXIT: SUCCESS — safe to deploy

IF only WARN gates failed (P6, P8)
  → EXIT: PARTIAL — deploy with noted caveats

IF any hard-block gate failed
  → EXIT: FAILED — do NOT deploy
```

## Evidence Format

```
[SEVERITY] Gate: [P1-P8 name]
Check:      [what was checked]
Result:     [PASS | FAIL | WARN]
Threshold:  [what the rule is]
Actual:     [what was found]
Fix:        [what must be done before release]
```

## Escalation Rules

```
BLOCKED: qk-validation-gate not run
Missing:
  - Run qk-validation-gate first and share the result
Questions:
  1. Validation gate đã chạy chưa?
  2. Có bug nào HIGH/CRITICAL chưa fix không?
```

## Handoff Contract

### Consumes
```json
{
  "from": "qk-validation-gate",
  "required_fields": ["gate_result", "coverage_percent"],
  "optional_fields": ["bundle_size", "changelog_entry"]
}
```

### Produces
```json
{
  "to": "CI/CD system or user",
  "output_fields": ["release_checklist_result", "gates_passed", "gates_failed", "exit_code"]
}
```

## Output Format

```
🚀 Production Release Gate
─────────────────────────────────────────────────
Version:    [vX.Y.Z]
Date:       [YYYY-MM-DD]

Gate Results:
  P1 Validation:    [✅ PASS | ❌ FAIL]
  P2 Open Bugs:     [✅ 0 HIGH/CRITICAL | ❌ N unresolved]
  P3 Debug Cleanup: [✅ Clean | ❌ N artifacts found]
  P4 Environment:   [✅ Production config | ❌ Dev config detected]
  P5 Build:         [✅ SUCCESS | ❌ FAILED]
  P6 Bundle Size:   [✅ NKB | ⚠️ NKB > 500KB]
  P7 Security:      [✅ Clean | ❌ N critical/high]
  P8 Changelog:     [✅ Updated | ⚠️ Missing]

Verdict:    [✅ SAFE TO DEPLOY | ❌ DO NOT DEPLOY — fix: list]
Exit Code:  [SUCCESS | PARTIAL | BLOCKED | FAILED]
```

---

## Confidence Model

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | validation-gate result confirmed + all 8 gates checked directly | Deploy approved |
| MEDIUM | some gates inferred from partial CI output | Deploy with caution |
| LOW | validation-gate not run / gate results stale | EXIT: BLOCKED |

---

## Severity

| Level | Definition |
|-------|-----------|
| CRITICAL | deploying with unresolved P1–P5 hard-block gate failure |
| HIGH | P6/P7 warning ignored without user override |
| MEDIUM | CHANGELOG missing |
| LOW | minor formatting in release report |

---

## Retry Policy

```
Build fails during Phase 2
  └─ check syntax vs. environment error
       ├─ fix and retry once
       └─ do not retry more than 1 time (risk of masking a real failure)
```
## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | All hard-block gates pass | Deploy approved |
| PARTIAL | Hard gates pass, warnings exist | Deploy with noted caveats |
| BLOCKED | Prerequisites missing | Run validation-gate first |
| FAILED | Any hard gate failed | Do NOT deploy |

---

