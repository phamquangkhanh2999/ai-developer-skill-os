---
# ── Identity ───────────────────────────────────────────────
name: qk-validation-gate
version: 9.1.0
status: stable
description: "Cổng kiểm tra chất lượng & Eval Pipeline bắt buộc — chạy linters, tests, và đánh giá scorecard.yaml định lượng cho AI Agent."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: utility

intent:
  - quality-assurance
  - verification
  - code-review

complexity:
  level: low
  criteria:
    files_affected: "1-5"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "verify"
  - "kiểm tra"
  - "lint"
  - "test"
  - "run checks"

selection:
  priority: high
  confidence_threshold: 0.75

# ── V8: References ─────────────────────────────────────────
workflow: code-review

rules:
  - global

tools:
  - filesystem
  - terminal

related_skills:
  - qk-engineering-standard

knowledge_scope:
  owns:
    - verification
    - quality-gates
    - test-execution
  references:
    - coding
    - architecture

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: review

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: medium
risk: low
side_effects: run_commands
produces: [report]
consumes: [source-code]

token_budget:
  max_files_read: 3
  max_lines_per_read: 100
  max_shell_commands: 2
  stop_early: false  # Must run all checks — cannot skip for token budget

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-validation-gate — Quality Gate

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
  - 👉 *Domain Focus:* Convention / Architecture (vd: các ngưỡng scorecard, quy định zero hallucination).

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
  - 👉 *Domain Harvest:* Bộ tiêu chí kiểm định mới (Scorecard metric) được tích hợp vào pipeline.

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
- 👉 *Domain Ignore:* Kết quả log pass/fail tạm thời của một build con.

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
  - 👉 *Domain Focus:* Convention / Architecture (vd: các ngưỡng scorecard, quy định zero hallucination).

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
  - 👉 *Domain Harvest:* Bộ tiêu chí kiểm định mới (Scorecard metric) được tích hợp vào pipeline.

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
- 👉 *Domain Ignore:* Kết quả log pass/fail tạm thời của một build con.

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
  - 👉 *Domain Harvest:* Bộ tiêu chí kiểm định mới (Scorecard metric) được tích hợp vào pipeline.

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
- 👉 *Domain Ignore:* Kết quả log pass/fail tạm thời của một build con.

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
  - 👉 *Domain Harvest:* Bộ tiêu chí kiểm định mới (Scorecard metric) được tích hợp vào pipeline.

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
- 👉 *Domain Ignore:* Kết quả log pass/fail tạm thời của một build con.

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---
---
---
---

## Preconditions
- [ ] Project has `package.json` with lint/test scripts (or equivalent for other runtimes)
- [ ] Target scope is specified (specific files, or whole project)

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Không tìm thấy script lint/test. Vui lòng chỉ định lệnh kiểm tra."
```

## Scope & V8.2 Eval Pipeline
- ✅ Run lint, type-check, tests, and security audit in sequence
- ✅ **Execute V8.2 Eval Pipeline:** Read `scorecard.yaml` (or inherited schemas) and compute quantitative scores for AI/Agent outputs.
- ✅ Enforce pass/fail with concrete thresholds (Code coverage >= 80%, Eval scorecard >= passing threshold, typically 80/100).
- ✅ Validate Trace execution logs in `evals/traces/` to ensure zero hallucination and ground-truth compliance.
- ✅ Report results with structured Evidence Format.

## Non-Goals
- ❌ Fix failing tests or lint errors (fixes go to qk-bug-resolution)
- ❌ Skip any gate check or eval scorecard unless user explicitly allows
- ❌ Override failing thresholds with "ignore" flags or fabricated LLM scores without trace evidence

## Pass/Fail Thresholds (Non-Negotiable)

```yaml
lint:
  errors: 0           # Zero tolerance for lint errors
  warnings: allowed   # Warnings do not block

typescript:
  errors: 0           # Zero type errors

tests:
  coverage_minimum: 80%       # Overall coverage
  unit_test_pass_rate: 100%   # All unit tests must pass
  integration_test_pass_rate: 100%

security:
  critical_vulnerabilities: 0
  high_vulnerabilities: 0
  medium_vulnerabilities: 5  # Max allowed (review required)

build:
  must_succeed: true
  max_warnings: 5
  bundle_size_limit: 500KB    # Gzipped (if applicable)

eval_scorecard:
  default_passing_threshold: 80 # minimum weighted evaluation score
  trace_verification_required: true # must log tool executions in evals/traces
  zero_tolerance_hallucination: true
```

## Priority Order

| Priority | Gate | Fail = Block? | Skip Allowed? |
|----------|------|---------------|---------------|
| P1 | Security audit (`npm audit`) | YES | Never |
| P2 | TypeScript / type check | YES | Never |
| P3 | Lint (errors only) | YES | Never |
| P4 | Unit tests | YES | Never |
| P5 | Integration tests | YES | Only if no integration tests exist |
| P6 | Coverage check | YES if < 80% | Never |
| P7 | Build | YES | Never |
| P8 | Bundle size | WARN only | Budget < 80% |

## Workflow

### Phase 1 — Security Gate (P1)

**Steps:**
1. Run: `npm audit --audit-level=high` (or equivalent)
2. Parse output for CRITICAL and HIGH

**Decision:**
```
IF 0 critical + 0 high
  → PASS P1 → go to Phase 2

ELSE IF critical or high found
  → EXIT: FAILED immediately
  → Report: exact package name, CVE, severity
```

### Phase 2 — Type & Lint Gate (P2+P3)

**Steps:**
1. Run: `npm run typecheck` (or `tsc --noEmit`)
2. Run: `npm run lint`
3. Parse error counts

**Decision:**
```
IF 0 type errors AND 0 lint errors
  → PASS P2+P3 → go to Phase 3

ELSE IF type errors > 0
  → EXIT: FAILED — list each error with file:line

ELSE IF lint errors > 0 (warnings OK)
  → EXIT: FAILED — list errors
```

### Phase 3 — Test Gate (P4+P5+P6)

**Steps:**
1. Run: `npm test -- --coverage` (or equivalent)
2. Parse: pass/fail counts, coverage percentage

**Decision:**
```
IF all tests pass AND coverage ≥ 80%
  → PASS P4+P5+P6 → go to Phase 4

ELSE IF any test fails
  → EXIT: FAILED — list failing test names

ELSE IF coverage < 80%
  → EXIT: FAILED — show coverage report (file-level)
```

**Retry Policy:**
```
Test fail
  └─ Check if it's a flaky test (run once more)
       ├─ PASS on retry → note "flaky test detected", continue
       └─ FAIL on retry → EXIT: FAILED — not flaky, real failure
```

### Phase 4 — Build Gate (P7)

**Steps:**
1. Run: `npm run build`
2. Check exit code + warnings count

**Decision:**
```
IF build succeeds AND warnings ≤ 5
  → EXIT: SUCCESS

ELSE IF build fails
  → EXIT: FAILED

ELSE IF warnings > 5
  → EXIT: PARTIAL — list warnings, continue to release if user confirms
```

## Confidence Model

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Command exit code 0/non-0, numeric output | Report directly |
| MEDIUM | Inferred from partial output (truncated logs) | Note potential missing info |
| LOW | Script not found or output format unknown | EXIT: BLOCKED — clarify commands |

## Severity

| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Security vulnerability in production dependency | CVE in auth library |
| HIGH | Type error or failing test | `Cannot read property of undefined` |
| MEDIUM | Coverage below threshold | 67% coverage (threshold 80%) |
| LOW | Build warning | Unused export |

## Evidence Format

```
[SEVERITY] Gate: [SECURITY|TYPE|LINT|TEST|COVERAGE|BUILD]
Command:    [command that was run]
Result:     [PASS | FAIL — exact output snippet]
Threshold:  [what the threshold is]
Actual:     [what was measured]
Fix:        [where to look for the fix]
```

**Example:**
```
[HIGH] Gate: TEST
Command:    npm test -- --coverage
Result:     FAIL — 3 tests failed
Threshold:  100% pass rate
Actual:     47/50 tests passed
Fix:        See failing tests: auth.test.ts:L45, user.test.ts:L23, order.test.ts:L89
```

## Escalation Rules

```
BLOCKED: Cannot run validation
Missing:
  - npm scripts (lint, test, build) in package.json
  - OR test framework setup
Questions:
  1. Dùng lệnh gì để chạy lint? (e.g., eslint, biome, oxlint)
  2. Dùng lệnh gì để chạy test? (e.g., vitest, jest, playwright)
  3. Coverage threshold dự án quy định là bao nhiêu?
Recommended Assumptions:
  - Standard: npm run lint + npm test + npm run build
```

## Handoff Contract

### Consumes
```json
{
  "from": "user or qk-orchestrator",
  "required_fields": ["project_root"],
  "optional_fields": ["custom_commands", "custom_thresholds", "scope_files"]
}
```

### Produces
```json
{
  "to": "qk-production-release (if all pass)",
  "output_fields": ["gate_results", "coverage_percent", "violations_list", "exit_code"]
}
```

## Output Format

```
🔒 Validation Gate Report
─────────────────────────────────────────────────
Project:    [path]

Gate Results:
  P1 Security:    [✅ PASS | ❌ FAIL — N critical, N high]
  P2 TypeScript:  [✅ PASS | ❌ FAIL — N errors]
  P3 Lint:        [✅ PASS | ❌ FAIL — N errors (N warnings)]
  P4 Unit Tests:  [✅ PASS | ❌ FAIL — N/N passed]
  P5 Integration: [✅ PASS | ❌ FAIL | ⏭️ SKIPPED]
  P6 Coverage:    [✅ PASS (N%) | ❌ FAIL (N% < 80%)]
  P7 Build:       [✅ PASS | ❌ FAIL]

Failures (action required):
  [SEVERITY] Gate — detail — Fix hint

Exit Code:   [SUCCESS | PARTIAL | BLOCKED | FAILED]
```

---

## Retry Policy

---
## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | All gates passed, thresholds met | Safe to proceed to release |
| PARTIAL | Build pass, but warnings > 5 OR integration skipped | User confirmation required |
| BLOCKED | Cannot run — missing scripts or config | Setup required |
| FAILED | Any gate failed at threshold | Do NOT release — fix first |

---

