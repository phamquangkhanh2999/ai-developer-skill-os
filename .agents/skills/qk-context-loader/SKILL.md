---
# ── Identity ───────────────────────────────────────────────
name: qk-context-loader
version: 9.1.0
status: stable
description: "Tải context và vẽ dependency graph chính xác trước khi code — ngăn hallucination kiến trúc."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: utility

intent:
  - context-loading
  - project-understanding
  - repository-analysis

complexity:
  level: low
  criteria:
    files_affected: "1-5"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "load context"
  - "understand project"
  - "analyze architecture"
  - "vẽ dependency graph"
  - "build context"

selection:
  priority: high
  confidence_threshold: 0.75

# ── V8: References ─────────────────────────────────────────
workflow: research

rules:
  - global

tools:
  - filesystem
  - terminal

related_skills:
  - qk-feature-delivery
  - qk-orchestrator

knowledge_scope:
  owns:
    - project-context
    - architecture-discovery
  references:
    - coding
    - repository-structure
    - anti-patterns

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: review

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: low
latency: fast
risk: low
side_effects: read_only
produces: [context-graph]
consumes: [source-code]

token_budget:
  max_files_read: 5
  max_lines_per_read: 100
  max_shell_commands: 1
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-context-loader — Dependency Graph Builder

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
  - 👉 *Domain Focus:* Pattern / Architecture (vd: sơ đồ phụ thuộc mô-đun, biểu đồ ngữ cảnh O(1)).

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
  - 👉 *Domain Harvest:* Quyết định Architecture hoặc Pattern quan trọng khi ánh xạ dependency.

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
- 👉 *Domain Ignore:* Cache đồ thị ngữ cảnh tạm thời của một lệnh tìm kiếm.

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
  - 👉 *Domain Focus:* Pattern / Architecture (vd: sơ đồ phụ thuộc mô-đun, biểu đồ ngữ cảnh O(1)).

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
  - 👉 *Domain Harvest:* Quyết định Architecture hoặc Pattern quan trọng khi ánh xạ dependency.

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
- 👉 *Domain Ignore:* Cache đồ thị ngữ cảnh tạm thời của một lệnh tìm kiếm.

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
  - 👉 *Domain Harvest:* Quyết định Architecture hoặc Pattern quan trọng khi ánh xạ dependency.

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
- 👉 *Domain Ignore:* Cache đồ thị ngữ cảnh tạm thời của một lệnh tìm kiếm.

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
  - 👉 *Domain Harvest:* Quyết định Architecture hoặc Pattern quan trọng khi ánh xạ dependency.

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
- 👉 *Domain Ignore:* Cache đồ thị ngữ cảnh tạm thời của một lệnh tìm kiếm.

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---
---
---
---

## Preconditions
- [ ] Entry point file or module name is specified
- [ ] Repository is accessible

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Vui lòng chỉ định entry point (file hoặc module cần map)."
```

## Scope
- ✅ Trace imports/exports from entry point
- ✅ Build topological dependency graph (max depth 3)
- ✅ Identify risk level per module

## Non-Goals
- ❌ Modify any code
- ❌ Load `node_modules` or vendor directories
- ❌ Guess file names — only follow explicit imports
- ❌ Load entire repo (max 5 files)

## Priority Order

| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1 | Trace direct imports of entry point | Never |
| P2 | Trace 2nd-level dependencies | Budget < 40% |
| P3 | Identify shared/risky modules | Budget < 60% |
| P4 | Annotate with risk levels | Budget < 70% |

## Workflow

### Phase 1 — V1 Memory Consultation & Entry Point Analysis

**Steps:**
0. **Pre-flight V1 Memory Check:** Check for `.ai-local/knowledge/index.yaml` or `.agents/knowledge/index.yaml`. If an established architecture fact or module mapping exists in memory (`status: Active`), read it immediately to discover target symbols and entry points in seconds without performing redundant searches.
1. `grep_search` — search for import/export statements in entry file (only if not already resolved via V1 memory)
2. `view_file[StartLine:EndLine]` — read import block only (first ~30 lines)
3. List direct dependencies

**Decision:**
```
IF entry file found and imports readable
  → go to Phase 2

ELSE IF entry file not found
  → EXIT: BLOCKED — ask for correct path
```

### Phase 2 — Graph Traversal (Max Depth 3)

**Steps:**
1. For each direct dependency → `grep_search` for its imports
2. Build adjacency list: `{ file → [imports] }`
3. Stop at depth 3 OR max_files_read reached

**Decision:**
```
IF depth 3 reached OR max_files_read (5) hit
  → EXIT: PARTIAL — note graph is truncated at depth N

IF circular dependency detected
  → Flag as [HIGH RISK] in output
  → Continue building rest of graph
```

### Phase 3 — Risk Assessment & Output

**Steps:**
1. Identify: shared modules (imported by 3+ files) = HIGH risk to change
2. Identify: entry points with many dependents = CRITICAL to change carefully
3. **Identify: file trộn lẫn Server Logic và Client UI, hoặc vi phạm ranh giới bảo mật R-SEC-04 = Bắt buộc flag [HIGH RISK].**
4. Generate graph in standard JSON + Markdown format

## Output Format (Mandatory Schema)

```json
{
  "entry": "src/modules/auth/auth.service.ts",
  "depth_reached": 3,
  "truncated": false,
  "nodes": [
    {
      "file": "src/modules/auth/auth.service.ts",
      "imports": ["src/common/jwt.util.ts", "src/users/users.repository.ts"],
      "exports": ["AuthService"],
      "risk_level": "high",
      "imported_by_count": 4
    }
  ],
  "risks": [
    {
      "file": "src/common/jwt.util.ts",
      "reason": "Imported by 6 modules — changes here have wide blast radius",
      "risk_level": "critical"
    }
  ]
}
```

## Evidence Format

```
[RISK] path/to/file.ts
Reason:     [why this file is risky to change]
Imported by: [N files]
Exports:    [key exports]
```

## Handoff Contract

### Consumes
```json
{
  "from": "user or qk-orchestrator",
  "required_fields": ["entry_point"],
  "optional_fields": ["max_depth", "exclude_patterns"]
}
```

### Produces
```json
{
  "to": "qk-feature-delivery | qk-bug-resolution | qk-data-lifecycle | qk-api-lifecycle",
  "output_fields": ["dependency_graph_json", "risk_summary", "exit_code"]
}
```

## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Full graph built within depth limit | All imports traced |
| PARTIAL | Graph truncated at token/depth limit | Note where it was cut |
| BLOCKED | Entry point not found or inaccessible | Ask for correct path |
| FAILED | Cannot determine architecture (circular imports, obfuscated code) | Report and escalate |

---

