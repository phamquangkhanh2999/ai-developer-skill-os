---
# ── Identity ───────────────────────────────────────────────
name: qk-project-health
version: 9.1.0
status: stable
description: "Kiểm toán toàn diện Code Smells, Tech Debt, Architecture — health score 0–100 với actionable roadmap."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: utility

intent:
  - project-audit
  - codebase-health

complexity:
  level: high
  criteria:
    files_affected: "10+"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "audit code"
  - "check health"
  - "tech debt"
  - "code smell"
  - "kiểm toán"

# ── V8: References ─────────────────────────────────────────
workflow: code-review

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-engineering-standard

knowledge_scope:
  owns:
    - tech-debt
    - codebase-health
  references:
    - architecture
    - security
    - anti-patterns

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: review

selection:
  priority: medium
  confidence_threshold: 0.75

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: high
latency: slow
risk: low
side_effects: read_only
produces: [report]
consumes: [source-code]

token_budget:
  max_files_read: 5
  max_lines_per_read: 100
  max_shell_commands: 1
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-project-health — Complete Codebase Audit

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

---

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
  - 👉 *Domain Focus:* Architecture / Hard Bug (vd: chỉ số sức khỏe codebase 0-100, các điểm nợ kỹ thuật tech debt).

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
  - 👉 *Domain Harvest:* Mô hình Code Smell hoặc Tech Debt hệ thống cần theo dõi tiêu diệt.

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
- 👉 *Domain Ignore:* Report health tạm thời của 1 đợt scan.

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
  - 👉 *Domain Harvest:* Mô hình Code Smell hoặc Tech Debt hệ thống cần theo dõi tiêu diệt.

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
- 👉 *Domain Ignore:* Report health tạm thời của 1 đợt scan.

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
  - 👉 *Domain Harvest:* Mô hình Code Smell hoặc Tech Debt hệ thống cần theo dõi tiêu diệt.

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
- 👉 *Domain Ignore:* Report health tạm thời của 1 đợt scan.

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---
---
---
---

## Preconditions
- [ ] Project root is accessible

---

## Scope
- ✅ Score 5 health dimensions (0–20 pts each = 100 total)
- ✅ Identify deprecated packages and security vulnerabilities
- ✅ Produce actionable refactoring roadmap

## Non-Goals
- ❌ Fix issues — report only
- ❌ Hide systemic architectural flaws

---

## Health Scoring System

| Dimension | Max Points | Key Checks |
|-----------|-----------|------------|
| Security | 20 | 0 critical CVEs, no hardcoded secrets, auth guards present, **tuân thủ Zero-Trust (R-SEC-04)** |
| Code Quality | 20 | Functions ≤ 30L, complexity ≤ 10, no God Files, **sạch bóng Anti-patterns (R-C-09)** |
| Architecture | 20 | Clean layers (UI/Logic/Data separated), no circular imports |
| Dependencies | 20 | No deprecated packages, no unused deps, versions pinned |
| Documentation | 20 | README complete, public APIs documented, DESIGN.md exists |

**Total: 100 pts. Grades: A (90+) / B (75-89) / C (60-74) / D (<60)**

---

## Priority Order
| P | Dimension | Never Skip? |
|---|-----------|-------------|
| P1 | Security | Yes |
| P2 | Code Quality | Yes |
| P3 | Architecture | Budget < 30% |
| P4 | Dependencies | Budget < 50% |
| P5 | Documentation | Budget < 60% |

---

## Workflow

### Phase 1 — Quick Scan (P1+P2)
1. `grep_search` for: hardcoded secrets, `eval(`, `any` types, `console.log`
2. Sample 3 key files → check function lengths, file sizes
3. Score Security (0–20) + Code Quality (0–20)

### Phase 2 — Structure Scan (P3+P4)
1. Read `package.json` — check outdated/deprecated packages
2. Check import patterns for circular dependencies or layer violations
3. Score Architecture (0–20) + Dependencies (0–20)

### Phase 3 — Docs Scan (P5) + Report
1. Check README, DESIGN.md, key function JSDoc
2. Score Documentation (0–20)
3. Generate full report + prioritized roadmap

---

## Evidence Format
```
[SEVERITY] Dimension: [SECURITY|QUALITY|ARCH|DEPS|DOCS]
Finding:    [specific issue]
Location:   [file:line OR package name]
Confidence: HIGH
Impact:     -N pts
Fix:        [actionable suggestion]
```

---

## Output Format
```
🏥 Project Health Report
─────────────────────────────────────────────────
Grade: [A|B|C|D] ([Score]/100)

Scores:
  Security:      [N/20]
  Code Quality:  [N/20]
  Architecture:  [N/20]
  Dependencies:  [N/20]
  Documentation: [N/20]

Critical Issues (fix immediately):
  [list CRITICAL findings]

Refactoring Roadmap (priority order):
  1. [Most impactful — estimated effort]
  2. [Second — estimated effort]
  3. [Third]

Exit Code: [SUCCESS (A/B) | PARTIAL (C) | FAILED (D)]
```

---

## Exit Codes
| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Audit completed and report generated with scores | Normal completion |
| PARTIAL | Audit completed but some directories skipped (token limit) | Large project |
| BLOCKED | Project is empty or completely unreadable | Missing project |
| FAILED | Cannot calculate score due to tool failure | Linter crashed |

---

## Confidence Model
| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Analyzed via AST, linters, or exhaustive search | Include in report as fact |
| MEDIUM | Sampled a few files, assumed pattern holds | Note as "Project trend" |
| LOW | Did not check | Do NOT include in report |

---

## Severity
| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Security flaw or completely broken architecture | API keys committed, cyclical dependency |
| HIGH | Major tech debt slowing down development | God objects, missing tests on core logic |
| MEDIUM | Inconsistent patterns | Mixing fetch/axios, tabs/spaces |
| LOW | Minor code smell | Magic numbers in UI |

---

## Retry Policy
```
Audit fails
  └─ Token limit hit (project too large)
       ├─ Ask user to narrow scope (e.g., audit only src/api/)
       └─ Do NOT auto-retry full project scan
```

---

## Escalation Rules
```
BLOCKED: Project unreadable or empty
Missing:
  - Source code
Questions:
  1. Thư mục mã nguồn chính nằm ở đâu? (ví dụ: src/, lib/)
Recommended Assumptions:
  - Scan typical directories (src, app, lib, test)
```

---

## Handoff Contract
### Consumes
```json
{
  "from": "user",
  "required_fields": [],
  "optional_fields": ["target_directory"]
}
```
### Produces
```json
{
  "to": "user or qk-system-evolution",
  "output_fields": ["health_score", "critical_issues", "refactoring_roadmap", "exit_code"]
}
```

---

