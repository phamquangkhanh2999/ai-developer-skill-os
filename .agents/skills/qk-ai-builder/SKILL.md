---
# ── Identity ───────────────────────────────────────────────
name: qk-ai-builder
version: 9.1.0
status: stable
description: "Thiết kế Governed AI Agent & RAG pipelines theo chuẩn V8.2 — Đóng gói bằng capability.yaml, data discipline 4-folder và Eval Pipeline."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V9: Classification ─────────────────────────────────────
type: capability

intent:
  - ai-integration
  - agent-behavior

complexity:
  level: high
  criteria:
    files_affected: "1-5"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "build ai"
  - "viết prompt"
  - "thiết kế bot"
  - "ai logic"
  - "tạo skill"

# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-system-evolution

knowledge_scope:
  owns:
    - agent-architecture
    - skill-generation
  references:
    - architecture
    - security
    - anti-patterns

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: feature

selection:
  priority: high
  confidence_threshold: 0.85

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: high
latency: slow
risk: high
side_effects: edit_files
produces: [code, schema]
consumes: [user-description]

token_budget:
  max_files_read: 3
  max_lines_per_read: 100
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-ai-builder — AI Integration Designer

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

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
  - 👉 *Domain Focus:* Architecture/Pattern (vd: cấu hình provider LLM, chuẩn RAG pipeline, prompt template).

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
  - 👉 *Domain Harvest:* Pattern hoặc Convention mới (vd: quy chuẩn JSON schema cho prompt, scorecard định lượng).

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
- 👉 *Domain Ignore:* Các thao tác tinh chỉnh từ ngữ prompt tạm thời cho 1 task đơn lẻ.

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
  - 👉 *Domain Focus:* Architecture/Pattern (vd: cấu hình provider LLM, chuẩn RAG pipeline, prompt template).

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
  - 👉 *Domain Harvest:* Pattern hoặc Convention mới (vd: quy chuẩn JSON schema cho prompt, scorecard định lượng).

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
- 👉 *Domain Ignore:* Các thao tác tinh chỉnh từ ngữ prompt tạm thời cho 1 task đơn lẻ.

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
  - 👉 *Domain Harvest:* Pattern hoặc Convention mới (vd: quy chuẩn JSON schema cho prompt, scorecard định lượng).

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
- 👉 *Domain Ignore:* Các thao tác tinh chỉnh từ ngữ prompt tạm thời cho 1 task đơn lẻ.

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
  - 👉 *Domain Harvest:* Pattern hoặc Convention mới (vd: quy chuẩn JSON schema cho prompt, scorecard định lượng).

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
- 👉 *Domain Ignore:* Các thao tác tinh chỉnh từ ngữ prompt tạm thời cho 1 task đơn lẻ.

---

### Golden Rule
> **AI được phép học, nhưng không được tự quyết định tri thức chính thức.**
> **AI quan sát → Đề xuất → Con người phê duyệt → Dự án tiến hóa.**

---
---
---
---

## Preconditions
- [ ] AI task is defined: what input → what output
- [ ] LLM provider is specified (OpenAI, Anthropic, Gemini, local)

---

## Scope & V8.2 Governed Capability Design
- ✅ **Capability Packaging:** Design modular AI capabilities paired with machine-readable `capability.yaml` and `scorecard.yaml` eval rubrics. *(Note: This packaging requirement applies only to new AI-agent/RAG capabilities generated by this skill, not to general-purpose dev-tooling skills).*
- ✅ **Universal 4-Folder Discipline:** Enforce clean separation of Prompt Engineering (`prompts/`), Immutable Raw Data vs Clean Processed Chunks (`data/`), Modular Micro-skills (`agents/`), and Empirical Evals (`evals/`).
- ✅ **Eval-Driven Pipeline:** Move from static `Prompt -> Output` to the closed-loop V8.2 workflow:
  `Prompt -> Execution -> Trace Log -> Evaluation (scorecard) -> Quality Gate -> Release Report`
- ✅ Design strict, deterministic system prompts with structured JSON outputs.
- ✅ Sanitize user inputs before LLM ingestion (Anti-Injection).

## Non-Goals
- ❌ Modify or override files located in `data/raw/` (must remain immutable ground-truth)
- ❌ Create unguided AI chat loops without structured eval criteria or trace records
- ❌ Trust LLM output for critical logic without quantitative verification via `qk-validation-gate`
- ❌ Use raw user input directly in prompts without sanitization

---

## System Prompt Template (Required Structure)

```
[ROLE]
You are a [specific role]. You [specific expertise].

[TASK]
Your task is to [exact task description].

[CONSTRAINTS]
- Always [constraint 1]
- Never [constraint 2]
- If [edge case] → [specific action]

[OUTPUT FORMAT]
Return ONLY valid JSON matching this schema:
{
  "field1": "string",
  "field2": number,
  "confidence": "high|medium|low"
}

[EXAMPLES]
Input: [example]
Output: {"field1": "...", "field2": 0, "confidence": "high"}
```

---

## Anti-Injection Checklist (Tuân thủ R-SEC-04)
```
[ ] User input is wrapped in XML tags: <user_input>{input}</user_input>
[ ] System instructions are separate from user content
[ ] Input is validated/sanitized before injection (no raw HTML/JS)
[ ] Max token limit set for user input
[ ] Output is parsed as JSON (not eval'd)
[ ] Confidence field in output triggers human review if "low"
```

---

## RAG Pipeline Pattern
```
User Query
  └─ Sanitize + embed query
       └─ Vector search (top-K = 5)
            └─ Re-rank by relevance
                 └─ Build prompt: [System] + [Retrieved Context] + [User Query]
                      └─ LLM call
                           └─ Validate output schema
                                └─ Return to user
```

---

---

## Priority Order

| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1 | System Prompt structure defined | Never |
| P2 | Anti-Injection checklist applied | Never |
| P3 | Output schema validated | Budget < 30% |
| P4 | 4-folder discipline (prompts/data/agents/evals) set up | Budget < 50% |
| P5 | Examples/few-shot added | Budget < 70% |

---

## Workflow

### Phase 1 — Prompt Design
**Steps:**
1. Define the system prompt using the Required Structure (ROLE, TASK, CONSTRAINTS).
2. Explicitly specify the OUTPUT FORMAT as structured JSON.
3. Add few-shot EXAMPLES to guide the LLM.

**Decision:**
```
IF prompt has all sections
  → Confidence: HIGH → go to Phase 2
ELSE
  → EXIT: BLOCKED — request missing details
```

### Phase 2 — Security & Validation
**Steps:**
1. Apply the Anti-Injection Checklist.
2. Validate that user inputs are wrapped in XML tags and sanitized.
3. Ensure the output schema contains a confidence score field.

**Decision:**
```
IF all security checks pass
  → Confidence: HIGH → go to Phase 3
ELSE
  → EXIT: FAILED — fix security gaps
```

### Phase 3 — Pipeline & Packaging
**Steps:**
1. Map the process to the RAG Pipeline Pattern if context retrieval is needed.
2. Ensure files are organized into the 4-Folder Discipline (prompts/, data/, agents/, evals/).
3. Generate `capability.yaml` and `scorecard.yaml` for evaluation.

**Decision:**
```
IF packaging complete
  → EXIT: SUCCESS
ELSE
  → EXIT: PARTIAL — note missing folder structure or evals
```

---

## Output Format

```
🤖 AI Builder Output
─────────────────────────────────────────────────
Task:        [Description of the AI task]
Confidence:  [HIGH | MEDIUM | LOW]

Design:
  ✅ System Prompt Template created
  ✅ Output JSON Schema defined
  ✅ [N] few-shot examples included

Security & Validation:
  ✅ User input wrapped in <user_input> tags
  ✅ Anti-Injection checklist passed

Packaging:
  ✅ 4-folder structure initialized
  ✅ capability.yaml & scorecard.yaml generated

Exit Code:   [SUCCESS | PARTIAL | BLOCKED | FAILED]
```

---
## Exit Codes
| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Prompt designed with all required sections, anti-injection applied | All checks passed |
| PARTIAL | Prompt works but missing examples or output validation | Medium confidence result |
| BLOCKED | Task or output format not defined clearly enough | Cannot design without clear spec |
| FAILED | Prompt design has security vulnerability (direct injection risk) | Security gate failure |

---

## Confidence Model
| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Task clearly defined, output format specified, examples provided | Build directly |
| MEDIUM | Task clear but output format ambiguous | Note assumption, add validation layer |
| LOW | Task too vague ("make an AI assistant") | EXIT: BLOCKED — define specific task |

---

## Severity
| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Prompt injection attack possible | User input directly in system prompt |
| HIGH | LLM output used without validation in business logic | JSON parse without schema check |
| MEDIUM | Missing examples leads to inconsistent output | No few-shot examples in prompt |
| LOW | Output format not explicitly stated | Returns text instead of JSON |

---

## Evidence Format
```
[SEVERITY] src/prompts/[name].ts:LINE
Issue:      [specific vulnerability or gap]
Confidence: HIGH
Fix:        [specific change]
```

**Example:**
```
[CRITICAL] src/prompts/chat.ts:34
Issue:      User input `${userMessage}` injected directly in system prompt — injection risk
Confidence: HIGH
Fix:        Wrap in <user_input>{userMessage}</user_input> XML tags
```

---

## Retry Policy
```
LLM output validation fails
  └─ Retry with stronger output format instruction (add explicit JSON schema)
       ├─ PASS on retry → EXIT: SUCCESS, note "required stronger schema enforcement"
       └─ FAIL on retry → EXIT: PARTIAL — add human review gate
            └─ Do NOT auto-retry more than 1 time — risk of infinite loop
```

---

## Escalation Rules
```
BLOCKED: AI task not specific enough to design prompt
Missing:
  - Specific task description (what input → what output)
  - Output format specification (JSON schema or text structure)
Questions:
  1. Input cụ thể là gì? (user text, document, structured data)
  2. Output cần trả về dạng gì? (JSON với field gì / plain text)
Recommended Assumptions (if proceeding):
  - Structured JSON output with confidence field
  - Deny-by-default: reject off-topic requests in system prompt
```

---

## Handoff Contract
### Consumes
```json
{
  "from": "user",
  "required_fields": ["task_description", "input_type", "output_format"],
  "optional_fields": ["examples", "llm_provider", "max_tokens"]
}
```
### Produces
```json
{
  "to": "user or qk-validation-gate",
  "output_fields": ["system_prompt", "output_schema", "anti_injection_checklist", "exit_code"]
}
```

---

