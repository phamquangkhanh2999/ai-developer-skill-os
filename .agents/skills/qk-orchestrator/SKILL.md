---
# ── Identity ───────────────────────────────────────────────
name: qk-orchestrator
version: 9.1.0
status: stable
description: "Điều hướng yêu cầu của người dùng đến đúng skill với kỷ luật thép — kiểm tra preconditions và routing table."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: orchestrator

intent:
  - task-routing
  - skill-selection
  - precondition-checking

complexity:
  level: low
  criteria:
    files_affected: "1"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "which skill"
  - "what should i use"
  - "route this"
  - "help me choose"
  - "what skill for"
  - "help"
  - "list skills"
  - "what can you do"

selection:
  priority: high
  confidence_threshold: 0.80

# ── V8: References ─────────────────────────────────────────
workflow: research                  # Uses research workflow to understand request

rules:
  - global

tools:
  - filesystem

related_skills:
  - qk-context-loader

knowledge_scope:
  owns:
    - task-routing
    - skill-selection
    - precondition-validation
  references:
    - all-skills                    # References registry to make decisions
    - architecture

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
side_effects: none
produces: [plan]
consumes: [user-request]

token_budget:
  max_files_read: 1
  max_lines_per_read: 50
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-orchestrator — Request Routing

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
  - 👉 *Domain Focus:* Architecture / Convention (vd: bảng điều hướng kỹ năng, ràng buộc ranh giới rõ ràng).

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
  - 👉 *Domain Harvest:* Quy luật phân phối routing hiệu quả mới.

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
- 👉 *Domain Ignore:* Trình tự gọi lệnh tạm thời của một prompt user.

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
  - 👉 *Domain Harvest:* Quy luật phân phối routing hiệu quả mới.

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
- 👉 *Domain Ignore:* Trình tự gọi lệnh tạm thời của một prompt user.

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
  - 👉 *Domain Harvest:* Quy luật phân phối routing hiệu quả mới.

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
- 👉 *Domain Ignore:* Trình tự gọi lệnh tạm thời của một prompt user.

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---
---
---
---

## Preconditions
- [ ] User request is provided (any language)

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Vui lòng mô tả yêu cầu của bạn."
```

## Scope
- ✅ Analyze user intent and route to the correct skill
- ✅ Verify preconditions of target skill BEFORE delegating
- ✅ Enforce sequential pipeline when skills depend on each other

## Non-Goals
- ❌ Write code directly — delegate to specialist skills
- ❌ Hallucinate non-existent skills
- ❌ Allow UI work without `DESIGN.md` verified
- ❌ Allow logic work without context graph from `qk-context-loader`

## Priority Order

| Priority | Check | Skip Threshold |
|----------|-------|----------------|
| P1 | Match intent to routing table | Never |
| P2 | Verify target skill preconditions | Never |
| P3 | Check pipeline dependencies (e.g., context-loader first) | Never for logic tasks |
| P4 | Estimate cost/latency for user info | Budget < 70% |

## Workflow

### Phase 1 — Intent Classification

**Steps:**
1. Parse user request → extract intent keywords
2. Match against routing table (see `references/routing-table.md`)
3. Resolve to primary skill + pipeline order

**Decision:**
```
IF single clear match found
  → Confidence: HIGH → go to Phase 2

ELSE IF 2–3 possible matches
  → Pick highest-priority match
  → Confidence: MEDIUM → go to Phase 2, note ambiguity

ELSE IF no match
  → EXIT: BLOCKED — ask clarifying question
```

**Exit When:**
- Skill identified → go to Phase 2
- No matching skill → EXIT: BLOCKED

### Phase 2 — Precondition Check

**Steps:**
1. Read target skill's `Preconditions` section
2. Verify each precondition against current context

**Decision:**
```
IF all preconditions met
  → go to Phase 3

ELSE IF missing precondition is resolvable
  → Resolve it first (e.g., run qk-context-loader, find DESIGN.md)
  → Then go to Phase 3

ELSE
  → EXIT: BLOCKED
```

### Phase 3 — Pipeline Enforcement

**Steps:**
1. Check if target skill `consumes` output from another skill
2. If yes → ensure that upstream skill has run first
3. Delegate to target skill with full context

**Pipeline Rules:**
```
UI tasks:
  [DESIGN.md check] → [qk-ui-audit (optional)] → [qk-ui-builder | qk-feature-delivery]

Logic tasks:
  [qk-context-loader] → [qk-feature-delivery | qk-bug-resolution | qk-api-lifecycle]

Data tasks:
  [qk-context-loader] → [qk-data-lifecycle | qk-db-optimizer]

Release tasks:
  [qk-validation-gate] → [qk-production-release]
```

## Routing Table (Quick Reference)
Single source of truth: `references/routing-table.md` — do not duplicate here. Read that file before routing.

## Confidence Model

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Single clear keyword match | Route directly |
| MEDIUM | Multiple possible skills | Route to most likely, note ambiguity |
| LOW | Request is too vague | Ask clarifying question |

## Escalation Rules

```
BLOCKED: Cannot determine correct skill
Missing:
  - More specific description of the task
Questions:
  1. Bạn muốn làm gì? (fix bug / thêm tính năng / tối ưu / deploy)
  2. File hoặc module nào bị ảnh hưởng?
Recommended Assumptions: none — routing requires clear intent
```

## Handoff Contract

### Consumes
```json
{
  "from": "user",
  "required_fields": ["request_text"],
  "optional_fields": ["affected_file", "context"]
}
```

### Produces
```json
{
  "to": "[target-skill]",
  "output_fields": ["routed_skill", "pipeline_order", "preconditions_verified", "exit_code"]
}
```

## Output Format

```
🧭 Orchestrator Routing
─────────────────────────────────────────────────
Intent:      [Classified intent]
Skill:       [qk-skill-name]
Pipeline:    [skill-a → skill-b → skill-c]
Confidence:  [HIGH | MEDIUM | LOW]

Preconditions:
  ✅ [Condition met]
  ✅ [Condition met]

Exit Code:   SUCCESS
```

## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Skill routed, preconditions verified, delegation in progress | Normal flow |
| PARTIAL | Routed with MEDIUM confidence — ambiguity noted | Multi-match situation |
| BLOCKED | Cannot classify intent or precondition missing | Vague request or missing DESIGN.md |
| FAILED | No skill matches and cannot escalate | Unknown domain request |

---

