---
# ── Identity ───────────────────────────────────────────────
name: qk-system-evolution
version: 9.0.0
status: stable
description: "Nâng cấp thư viện/framework an toàn với rollback plan bắt buộc — incremental, không big-bang."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: capability

intent:
  - framework-upgrade
  - system-maintenance

complexity:
  level: high
  criteria:
    files_affected: "10+"
    has_behavior_change: false
    has_external_dependency: true
    has_breaking_change: true

triggers:
  - "upgrade package"
  - "nâng cấp"
  - "update framework"
  - "migration framework"
  - "system evolution"

# ── V8: References ─────────────────────────────────────────
workflow: refactor

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-engineering-standard
  - qk-project-health

knowledge_scope:
  owns:
    - upgrade-strategy
    - rollback-plan
  references:
    - testing
    - architecture
    - security
    - anti-patterns

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: refactor

selection:
  priority: medium
  confidence_threshold: 0.85

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: high
latency: slow
risk: high
side_effects: edit_files
produces: [code, report, plan]
consumes: [context-graph, source-code]

token_budget:
  max_files_read: 4
  max_lines_per_read: 100
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-system-evolution — Safe Upgrade Manager

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

## Memory Workflow

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
  - 👉 *Domain Focus:* Architecture / Hard Bug (vd: kế hoạch nâng cấp thư viện incremental, breaking changes).

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
  - 👉 *Domain Harvest:* Kinh nghiệm xử lý xung đột dependency hoặc bài học downgrade/rollback.

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
- 👉 *Domain Ignore:* Lockfile changes tạm thời trong local cache.

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
  - 👉 *Domain Harvest:* Kinh nghiệm xử lý xung đột dependency hoặc bài học downgrade/rollback.

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
- 👉 *Domain Ignore:* Lockfile changes tạm thời trong local cache.

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---
---
---
---

## Preconditions
- [ ] Current version and target version are specified
- [ ] Rollback strategy is defined (git tag OR package-lock.json snapshot)
- [ ] Existing test suite is available to verify after upgrade

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Rollback plan required before any major upgrade. Specify: target version + rollback method."
```

## Scope
- ✅ Read official Changelog/Migration Guide for breaking changes
- ✅ Apply incremental upgrades (not big-bang)
- ✅ Verify each step with existing tests
- ✅ Document rollback procedure

## Non-Goals
- ❌ Blindly run `npm update` — only targeted upgrades
- ❌ Skip reading Changelog for major version bumps
- ❌ Upgrade multiple major versions at once (one at a time)

## Priority Order

| Priority | Check | Skip Threshold |
|----------|-------|----------------|
| P1 | Read Changelog for breaking changes | Never |
| P2 | Snapshot rollback point (git tag) | Never |
| P3 | Apply upgrade to package.json only | Never |
| P4 | Run tests to detect breakage | Never |
| P5 | Fix breaking changes if minor (< 3 files affected) | Budget < 40% |
| P6 | Update documentation/README | Budget < 70% |

## Workflow

### Phase 1 — Breaking Change Analysis

**Steps:**
1. `view_file` or `read_url` — read official Changelog for target version. **Đồng thời kiểm tra Security Advisory (CVEs) của version cũ.**
2. List all `BREAKING CHANGE` entries
3. Map each breaking change to affected files in current codebase (`grep_search`)
4. *Lưu ý:* Nếu đây là bản vá bảo mật khẩn cấp (Security Patch), phải ưu tiên nâng cấp ngay cả khi có minor breaking changes, nhưng vẫn tuân thủ rollback plan.

**Decision:**
```
IF 0 breaking changes
  → Confidence: HIGH → go to Phase 2 (minor/patch upgrade)

IF 1–3 breaking changes, all in < 5 files
  → Confidence: MEDIUM → go to Phase 2

IF > 3 breaking changes OR affects core files
  → EXIT: BLOCKED — this is architectural migration, not an upgrade
  → Recommend: plan as a dedicated migration project
```

### Phase 2 — Rollback Snapshot

**Steps:**
1. Verify `git tag` or instruct user to create one: `git tag pre-upgrade-[package]-[version]`
2. Copy `package-lock.json` snapshot reference
3. Document exact rollback command:
   ```
   Rollback: git checkout pre-upgrade-[package]-[version]
   OR: npm install [package]@[previous-version]
   ```

**Exit When:** Rollback procedure documented → go to Phase 3

### Phase 3 — Incremental Upgrade

**Steps:**
1. Edit `package.json` — change version (one package at a time)
2. Apply code changes for breaking changes (using `replace_file_content`)
3. Run: `npm install` (1 command)

**Decision:**
```
IF install succeeds
  → go to Phase 4

IF install fails (peer dep conflict)
  → EXIT: PARTIAL — report conflict, suggest resolution
```

### Phase 4 — Verification

**Steps:**
1. Run tests: `npm test` (2nd command)
2. Parse test results for failures

**Decision:**
```
IF all tests pass
  → EXIT: SUCCESS

IF 1–3 tests fail (related to upgrade)
  → Fix if minor (< 10 lines change per fix)
  → EXIT: PARTIAL

IF > 3 tests fail OR core tests fail
  → EXIT: FAILED — rollback recommended
  → Provide exact rollback command
```

## Confidence Model

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Changelog read, breaking changes mapped, tests pass | Proceed |
| MEDIUM | Changelog read, some uncertainties remain | Proceed with caution, note risks |
| LOW | Cannot access Changelog or no tests available | EXIT: BLOCKED |

## Severity

| Level | Definition |
|-------|-----------|
| CRITICAL | Core authentication/security package upgrade |
| HIGH | ORM, framework, or router upgrade |
| MEDIUM | Utility library, build tool upgrade |
| LOW | Dev dependency, formatter upgrade |

## Evidence Format

```
[SEVERITY] package: [name] v[old] → v[new]
Breaking changes: [list from Changelog]
Affected files:   [N files — list]
Confidence:       [HIGH|MEDIUM|LOW]
Rollback:         git checkout [tag] OR npm install [name]@[old-version]
```

## Rollback Procedure (Required Output)

Every upgrade must document:
```
🔄 Rollback Procedure
─────────────────────────────────────────────────
Method 1 (Git):  git checkout [tag-name]
Method 2 (npm):  npm install [package]@[previous-version]
Snapshot tag:    [pre-upgrade-[package]-[date]]
```

## Handoff Contract

### Consumes
```json
{
  "from": "user",
  "required_fields": ["package_name", "target_version", "rollback_method"],
  "optional_fields": ["changelog_url", "affected_scope"]
}
```

### Produces
```json
{
  "to": "qk-validation-gate",
  "output_fields": ["upgraded_packages", "breaking_changes_fixed", "rollback_procedure", "exit_code"]
}
```

---

## Escalation Rules
```
BLOCKED: Missing rollback plan
Questions:
  1. Bạn muốn rollback bằng git tag hay snapshot?
  2. Có test suite nào để chạy sau khi upgrade không?
Recommended Assumptions: none
```
---

## Retry Policy
```
Install fails due to peer conflict
  └─ run with --legacy-peer-deps
       ├─ PASS → log as PARTIAL
       └─ FAIL → DO NOT retry again
```
---
## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Upgrade complete, all tests pass | Clean upgrade |
| PARTIAL | Upgrade done, some tests fail or peer conflict | Needs follow-up |
| BLOCKED | No rollback plan or too many breaking changes | Plan migration instead |
| FAILED | Tests fail after upgrade, rollback recommended | Provide rollback command |

---

