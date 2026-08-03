---
name: qk-agent-observability
version: 9.1.0
status: experimental
description: "Lớp theo dõi (Observability) cho phép giám sát quyết định, luân chuyển và các mô hình lỗi."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

type: capability

intent:
  - observability
  - agent-metrics
  - decision-trace

triggers:
  - "agent observability"
  - "routing logs"
  - "skill failure"

workflow: skill-evolution

complexity:
  level: medium
  criteria:
    files_affected: "1-3"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

rules:
  - global

tools:
  - filesystem

related_skills:
  - qk-validation-gate
knowledge_scope:
  domain:
    - agent-telemetry
    - decision-tracking
    - routing-accuracy
  concepts:
    - observability-patterns
    - evaluation-metrics
  references:
    - architecture
    - scorecard          # bổ sung: file scorecard.yaml giờ nằm trong evals/ của skill này

decision_boundary:
  owns:
    - agent_decision_trace
    - routing_accuracy_metrics
    - skill_success_rate
    - failure_pattern_detection
    - feedback_loop
  does_not_own:
    - application_monitoring
    - infrastructure_monitoring
    - log_aggregation
    - uptime_monitoring
    - pass_fail_enforcement   # bổ sung: việc chấm đậu/rớt theo threshold thuộc qk-validation-gate
  conflicts_with: []

verification:
  required: true
  strategy: feature

lifecycle:
  promotion_gate:
    tests:
      minimum_pass_rate: 0.9
    usage:
      minimum_runs: 20
    conflicts:
      zero_boundary_violation: true
  demotion_gate:
    triggers:
      - repeated_failure
      - boundary_violation
      - outdated_reference
    action:
      change_status: "stable -> experimental"

selection:
  priority: medium
  confidence_threshold: 0.85

execution_mode: deterministic
cost: low
latency: fast
risk: low
side_effects: edit_files
produces: [report]
consumes: [source-code, execution-trace]

# Bổ sung: thiếu field này trong bản gốc — mọi skill phải khai báo theo global.md R-G-06.
exit_codes: [SUCCESS, BLOCKED, PARTIAL, FAILED]

token_budget:
  max_files_read: 3
  max_lines_per_read: 100
  max_shell_commands: 0
  stop_early: true
---

# Agent Observability Capability
This skill enables tracking and observing the AI agent's own behavior, decisions, and accuracy metrics without interfering with application or infrastructure observability systems.

---

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
  - 👉 *Domain Focus:* Hard Bug / Convention (vd: mô hình lỗi lặp vô tận, giới hạn token budget).

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
  - 👉 *Domain Harvest:* Hard Bug mới có khả năng tái diễn (vd: lỗi loop định tuyến cần blacklist).

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
- 👉 *Domain Ignore:* Trace log của một session đơn lẻ (tự XÓA sau khi thực thi).

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
  - 👉 *Domain Focus:* Hard Bug / Convention (vd: mô hình lỗi lặp vô tận, giới hạn token budget).

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
  - 👉 *Domain Harvest:* Hard Bug mới có khả năng tái diễn (vd: lỗi loop định tuyến cần blacklist).

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
- 👉 *Domain Ignore:* Trace log của một session đơn lẻ (tự XÓA sau khi thực thi).

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
  - 👉 *Domain Harvest:* Hard Bug mới có khả năng tái diễn (vd: lỗi loop định tuyến cần blacklist).

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
- 👉 *Domain Ignore:* Trace log của một session đơn lẻ (tự XÓA sau khi thực thi).

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
  - 👉 *Domain Harvest:* Hard Bug mới có khả năng tái diễn (vd: lỗi loop định tuyến cần blacklist).

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
- 👉 *Domain Ignore:* Trace log của một session đơn lẻ (tự XÓA sau khi thực thi).

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---
---
---
---

## Scope
- ✅ Monitor agent decision boundaries and token budgets during execution
- ✅ Record execution traces and accuracy metrics into `evals/traces/` for quantitative verification
- ✅ Detect failure patterns or repetitive tool calling loops to trigger safe demotion/stopping

## Non-Goals
- ❌ Monitor infrastructure servers, Kubernetes pods, or external application metrics
- ❌ Alter runtime execution paths outside of established boundary validation rules
- ❌ Tự tính pass/fail hay enforce threshold — đó là việc của `qk-validation-gate` (xem `decision_boundary.does_not_own`)

---

## 🧭 V1 Knowledge Protocol (AI Skin V9)
- **Pre-flight Check:** BẮT BUỘC tra cứu `.ai-local/knowledge/index.yaml` hoặc `.agents/knowledge/index.yaml` (nếu tồn tại) trước khi tiến hành tìm kiếm mù toàn dự án. Nếu có pattern/fact liên quan (`status: Active`), áp dụng ngay để bỏ qua bước search dài dòng.
- **Post-flight Harvest (AI Đề xuất -> Con người Phê duyệt):** Sau khi hoàn thành task, nếu phát hiện tri thức thuộc 4 loại (`Architecture`, `Convention`, `Pattern`, `Hard Bug`) có giá trị giảm thời gian cho tương lai, hãy tóm tắt đề xuất và yêu cầu Người dùng xác nhận trước khi lưu lại. Bỏ qua các thay đổi lặt vặt (typo, CSS, CRUD thường).

---

## Preconditions

- [ ] Task vừa hoàn tất (bất kỳ `exit_code` nào — kể cả `FAILED`/`BLOCKED` cũng phải ghi trace, vì thất bại cũng là dữ liệu quan sát quan trọng).
- [ ] `evals/scorecard.yaml` tồn tại và định nghĩa được metric cần ghi nhận.

```
On missing scorecard.yaml:
  EXIT: BLOCKED
  Message: "Không tìm thấy scorecard.yaml — không xác định được field nào cần ghi vào trace."
```

---

## Workflow

### Bước 1 — Xác định có cần ghi trace không

Chỉ ghi trace khi task vừa thực hiện có `complexity >= medium` (theo `global.md` R-G-01), hoặc khi task có `side_effects` khác `read_only` (nghĩa là có khả năng ảnh hưởng hệ thống thật). Task đọc-hiểu đơn giản (fast-path, complexity `low`, `read_only`) **không bắt buộc** ghi trace — tránh phình `evals/traces/` với dữ liệu ít giá trị (đúng tinh thần `token_budget.stop_early`).

### Bước 2 — Thu thập dữ liệu quan sát trong lúc chạy task chính

Trong lúc skill khác (không phải chính observability) thực thi, thu thập các tín hiệu sau — không cần thêm shell command nào (`max_shell_commands: 0`), chỉ đọc lại chính transcript/tool-call history của phiên:

| Field cần thu thập | Lấy từ đâu |
|---|---|
| `skill_used`, `skill_candidates_considered` | Bước retrieval path (`global.md` R-G-05) |
| `routing.selected_on_first_try`, `clarification_asked`, `skill_switched_mid_task` | Diễn biến thực tế của phiên |
| `boundary.anti_pattern_violations`, `out_of_scope_edits`, `violated_rule_ids` | Đối chiếu file đã sửa với `coding.md` R-C-09 và `global.md` R-G-03 |
| `token_budget.actual_files_read`, `actual_shell_commands` | Đếm số lần gọi `view`/`bash` thực tế trong phiên |
| `zero_trust.*` | Có gặp nội dung nghi injection không, có báo cáo không (`security.md` R-SEC-04) |
| `exit_code` | Exit code thật của task chính (`global.md` R-G-06) |

### Bước 3 — Ghi file trace

Ghi 1 file JSON vào `evals/traces/{yyyy-mm-dd}_{task-slug}.json`, đúng cấu trúc `evals/traces/TRACE_SCHEMA.md`. Để `final_score: null` — **KHÔNG** tự tính điểm ở bước này (thuộc về `qk-validation-gate`).

### Bước 4 — Phát hiện pattern lỗi lặp lại (Failure Pattern Detection)

Nếu `evals/traces/` đã có ≥ 3 trace gần nhất cùng `skill_used` với `routing.selected_on_first_try: false` hoặc `boundary.anti_pattern_violations > 0`, đánh dấu cảnh báo trong report cuối: skill đó có dấu hiệu cần xem lại `decision_boundary` hoặc bổ sung tài liệu tham chiếu (theo `demotion_gate.triggers: repeated_failure`).

---

## Output Format

```
📊 Observability Trace Recorded
─────────────────────────────────────────────────
Session:     [session_id]
Skill used:  [skill_used]
Trace file:  evals/traces/[filename].json

Signals ghi nhận:
  Routing:      [selected_on_first_try / clarification / switched]
  Boundary:     [N vi phạm | 0 vi phạm]
  Token budget: [actual/declared files_read]
  Zero-trust:   [injection detected & reported | không có injection | KHÔNG phát hiện]

⚠️ Failure pattern: [nếu có, nêu skill nào cần review]

Exit Code: SUCCESS
```

---

## Exit Codes

| Code | Khi nào |
|---|---|
| `SUCCESS` | Trace đã ghi thành công vào `evals/traces/` |
| `BLOCKED` | Thiếu `scorecard.yaml` hoặc không xác định được `session_id`/`skill_used` |
| `PARTIAL` | Ghi được trace nhưng thiếu một số field không bắt buộc (ví dụ không đếm được `actual_shell_commands` chính xác) |
| `FAILED` | Không ghi được file (lỗi filesystem) |
