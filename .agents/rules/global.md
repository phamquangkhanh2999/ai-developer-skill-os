---
version: 10.2.0
description: "Agent behavior policies applied globally across all capabilities."
domain: rules
applies_to: all
---

# Global Rules — Agent Behavior Policy

> **Câu hỏi domain này trả lời:** *Agent nên hành xử thế nào?*

---

## R-G-01: Decision Before Action & Review Loop

**MUST** create a plan before executing any task with complexity ≥ medium.

```
Receive request
  ↓
Classify complexity (fast-path or full workflow)
  ↓
If medium/high: outline steps first
  ↓
Execute step by step
  ↓
Post-Implementation Self-Review (Requirements, Diff & Scope)
  ↓
Verify with actual evidence
  ↓
Conclude
```

**Violation:** Starting to write code before understanding the full scope, or claiming completion without self-review.

---

## R-G-02: Evidence Before Conclusion & Causal Chain

**MUST** establish concrete evidence and prove the causal link before stating a finding or applying a fix:

```text
REQUEST ──► SCOPE ──► TARGETED INSPECTION ──► EVIDENCE ──► ROOT CAUSE ──► MINIMAL FIX ──► VERIFY ──► ANALYZE RESULT ──► STATUS
```

- Do NOT jump from Evidence directly to a fix without proving why that evidence points to the root cause.
- Do NOT guess root cause without inspecting the relevant code.
- Do NOT assume a bug is fixed without verification evidence.
- Do NOT report "done" without executing checks and analyzing results.

**Minimum evidence:** File path + line number + quoted code + explicit explanation of why it causes the issue.

---

## R-G-03: Minimal Footprint

**MUST** touch only what is necessary for the task.

- Do NOT refactor code outside the task scope.
- Do NOT "improve" unrelated files while working.
- Do NOT run commands with broad side effects (`rm -rf`, `git reset --hard`) without explicit user confirmation.

---

## R-G-04: Token Budget & Retrieval Discipline

**MUST** respect the token budget and retrieval efficiency:

- Use targeted search tools available in the current environment for pattern discovery.
- Read only the minimum relevant sections and stop retrieval when sufficient evidence has been established.
- Never read: `node_modules/`, `dist/`, `.git/`, binary files.

---

## R-G-05: Retrieval Path

When starting a task, follow this sequence:

```
1. Read .agents/DEV_PROFILE.md     → get role + stack
2. Match intent against routing table in .agents/AGENTS.md
3. Read the matching SKILL.md      → confirm intent + preconditions
4. Load referenced workflow YAML   → understand execution steps
5. Load rules/global.md + coding.md (if edit_files task)
6. Execute step by step
7. Exit with: SUCCESS | BLOCKED | FAILED | PARTIAL
```

**Do NOT:**
- Load all skills at once.
- Scan entire repository before starting.

---

## R-G-06: Exit Code Protocol

Every skill execution MUST terminate with one of:

| Code | Meaning |
|---|---|
| `SUCCESS` | Task completed and verified |
| `BLOCKED` | Precondition not met — request more info |
| `FAILED` | Execution failed after max retries |
| `PARTIAL` | Partially completed — output + reason |

Never silently terminate. Always report exit code and reason.

---

## R-G-07: Language Policy

- **Code, identifiers, filenames, YAML keys:** English only.
- **Explanations, summaries, reports to user:** Vietnamese (match user's language).
- **SKILL.md body headings:** English.
- **Commit messages:** English (Conventional Commits format).

---

## R-G-08: No Silent Errors

**NEVER** use `!` (non-null assertion), empty `try/catch {}` (suppressing errors silently), or blind type casting (`as any`) to hide errors. Optional chaining (`?.`) is allowed and recommended for safe navigation of nullable/optional properties.

Fix root cause. If root cause is unclear → report as `BLOCKED` with evidence.

---

## R-G-09: Legacy Skill Handling

Agent **MUST** prefer stable skills over experimental or deprecated ones.

Deprecated skills **MUST NOT** be selected. If a user asks for a deprecated skill, explain the replacement.

---

## R-G-10: Ambiguity Resolution

Agent **MUST NOT** execute when selection confidence < threshold.

Agent **SHOULD**:
1. Ask clarification.
2. Present top 2-3 candidate skills with brief descriptions.
3. Explain what information is missing.

---

## R-G-11: SKILL.md Description Standard (Anthropic-aligned)

Every SKILL.md `description` field **MUST** satisfy both:

**(a) What it does** — concrete action the skill performs  
**(b) When to use** — trigger context, keywords, situations  

Description phải đủ mạnh để AI **không under-trigger** (bỏ qua skill khi lẽ ra nên dùng).

---

## R-G-12: Progressive Disclosure — SKILL.md Size Limit

SKILL.md body (không tính frontmatter) **MUST** be < 500 lines.

Nếu gần chạm 500 dòng:
- Tách phần chi tiết ra `references/*.md`
- Ghi rõ trong SKILL.md: *"Khi cần X → đọc `references/X.md`"*
- Layer 1 (frontmatter) luôn trong context
- Layer 2 (SKILL.md body) nạp khi skill active
- Layer 3 (references/, scripts/, assets/) nạp on-demand

---

## R-G-13: Laser Focus & Anti-Sprawl

Agent **BẮT BUỘC** khóa chặt phạm vi thực thi theo 3 nguyên tắc thép:

### 13.1. Scope Lock & No Unrelated Changes
- **Chỉ giải quyết đúng yêu cầu hiện tại:** Không tự mở rộng phạm vi sang refactor, bug fixing, optimization, redesign hoặc cleanup không liên quan.
- **Cấm sửa lan man:** Không sửa các file không liên quan chỉ vì phát hiện chúng "có thể cải thiện".
- **Ghi nhận thay vì tự tiện:** Nếu phát hiện vấn đề ngoài phạm vi, **CHỈ GHI NHẬN VÀ BÁO CÁO** trong phần ghi chú, tuyệt đối không tự ý sửa.
- **Câu hỏi phán xét:** Mọi thay đổi phải trả lời được câu hỏi: *"Thay đổi này có cần thiết trực tiếp cho yêu cầu hiện tại không?"*. Nếu câu trả lời là "KHÔNG" ➔ **TUYỆT ĐỐI KHÔNG THỰC HIỆN**.

### 13.2. File Creation Control (Kiểm Soát Sinh File)
- **Không tạo file chỉ để làm kiến trúc trông đẹp hơn.**
- Trước khi tạo file mới, **BẮT BUỘC** kiểm tra repository để xác định:
  1. Có file/component/service/hook hiện tại nào có thể tái sử dụng được không?
  2. Có pattern tương tự trong project hay không?
  3. File mới có thực sự cần thiết cho tính năng hay không?
- **Ưu tiên chỉnh sửa và tái sử dụng cấu trúc hiện có:** Chỉ tạo file mới khi có lý do kỹ thuật rõ ràng và file đó có trách nhiệm riêng biệt (Single Responsibility). Cấm tạo các abstraction trung gian chỉ để "đúng pattern".

### 13.3. Repository Inspection Rule (Quét Có Mục Đích)
- Trước khi triển khai, chỉ quét những file và thư mục **có khả năng liên quan trực tiếp**.
- Tuyệt đối **KHÔNG**:
  - Quét và phân tích toàn bộ repository một cách không cần thiết.
  - Đọc hàng loạt file không liên quan.
  - Biến việc "khảo sát codebase" thành một nhiệm vụ cleanup toàn dự án.

---

## R-G-14: Zero-Faked Pass & Root-Cause Verification

Agent MUST treat **PASS as a verified conclusion, never as a target**.

### 14.1. Root-Cause Gate

Before applying a fix, Agent MUST establish:
1. What is the observed problem?
2. Where does it occur?
3. What code path causes it?
4. What is the root cause?
5. Why will the proposed change remove the root cause?

Do NOT apply speculative fixes.

If root cause cannot be established with sufficient evidence:
```text
BLOCKED
Reason: Root cause cannot be established from available evidence.
```

### 14.2. Minimal Correct Fix

The fix MUST:
- Address the identified root cause.
- Be the smallest change that correctly resolves the problem.
- Preserve unrelated behavior.
- Avoid introducing unnecessary abstractions or files.
- Avoid workaround code whose only purpose is to make verification pass.

### 14.3. Post-Implementation Review Gate — REVIEW TRƯỚC KHI PASS

Agent **MUST NOT** declare a task complete immediately after implementation.

Sau khi hoàn thành thay đổi, Agent **BẮT BUỘC** thực hiện một vòng self-review độc lập trước khi chạy verification và kết luận:

```text
REQUEST ──► PLAN ──► TARGETED INSPECTION ──► EVIDENCE ──► ROOT CAUSE ──► IMPLEMENT
  │
  ▼
🔍 POST-IMPLEMENTATION REVIEW
  ├── 1. Requirement Review: Đã đáp ứng đúng yêu cầu ban đầu? Có thiếu edge case nào không?
  ├── 2. Implementation Review: Code có giải quyết triệt để root cause? Có logic/file thừa không?
  ├── 3. Scope Review (Diff Check): Những file nào đã sửa? Có accidental hay unrelated changes không?
  ├── 4. Quality Review: Có vi phạm as any, @ts-ignore, silent catch, hay dirty workaround không?
  └── 5. Verification Review: Đã xác định đúng lệnh test/build thực tế cần chạy chưa?
  │
  ├── Nếu Review phát hiện lỗi ──► STOP ──► RE-ANALYZE ──► MINIMAL FIX ──► REVIEW AGAIN
  │
  ▼
14.4. VERIFICATION GATE (Chạy lệnh thực tế) ──► 14.5. FAILURE RE-ANALYSIS (nếu fail)
  │
  ▼
14.6. ANTI-FAKE-PASS ──► 14.7. EVIDENCE-BASED STATUS ──► 14.8. TRUTH-FIRST REPORTING
```

#### Final Gate Condition:
Chỉ được kết luận `SUCCESS` khi:
- Requirement đã được đối chiếu đầy đủ.
- Implementation đã được self-review độc lập.
- Scope / Diff đã được kiểm tra (0 unrelated changes).
- Root cause đã được xử lý đúng.
- Verification thực tế đạt yêu cầu (có output lệnh thực tế).
- Không có bất kỳ workaround nào để ép PASS.

> **Implementation complete ≠ Task complete.**  
> **Task complete = Implementation + Review + Verification + Evidence.**

### 14.4. Verification Gate

After applying the fix and completing self-review, Agent MUST run the most relevant available verification:
- Unit tests
- Integration tests
- Type-check
- Lint
- Build
- Relevant runtime/manual verification

Only verification actually executed may be reported as evidence.

### 14.5. Failure Re-Analysis

If verification FAILS:
```text
FAIL
 ↓
STOP
 ↓
Read actual failure
 ↓
Re-analyze root cause
 ↓
Determine whether previous diagnosis was incomplete/wrong
 ↓
Apply corrected minimal fix
 ↓
Review again
 ↓
Verify again
```
Do NOT repeatedly modify code blindly until the check becomes green.

### 14.6. Anti-Fake-Pass

Agent MUST NOT make a verification pass by:
- Adding `as any`
- Adding `@ts-ignore`
- Adding `@ts-expect-error` to suppress a newly introduced error
- Disabling lint/type-check/test rules
- Skipping or deleting failing tests
- Weakening assertions without justification
- Hardcoding fake outputs
- Returning fake/mock data in production code
- Swallowing exceptions (`catch (e) {}` rỗng)
- Changing expected results merely to match incorrect behavior
- Modifying configuration solely to hide failures

### 14.7. Evidence-Based Status

Agent MUST distinguish:

| Status | Requirement |
|---|---|
| `SUCCESS` | Correct fix + self-reviewed + relevant verification passed |
| `BLOCKED` | Root cause/precondition cannot be established or required verification cannot proceed |
| `FAILED` | Correct execution attempted but task could not be completed |
| `PARTIAL` | Some scoped work completed, but required verification or implementation remains incomplete |

Never convert `BLOCKED`, `FAILED`, or `PARTIAL` into `SUCCESS` merely because the code was modified.

### 14.8. Truth-First Reporting

Never claim:
- "100% fixed"
- "All tests pass"
- "Build passes"
- "No issues"
- "Verified"

unless the corresponding verification was actually executed and passed.

If verification cannot be executed:
```text
Status: NOT VERIFIED
Reason: <concrete reason>
```
Do not infer PASS from code inspection alone.

---

## R-G-15: Prompt Interpretation & Control Plane Gate (Risk Gate, Change Budget, Scope Expansion & Evidence Gate)

**MUST** translate raw or concise user requests into an explicit, reviewable **Compiled Execution Prompt**, expose **Prompt Delta**, and enforce 4 control gates before and during execution.

```text
RAW REQUEST ──► COMPILE & DELTA ──► RISK & BUDGET GATE ──► DECIDE MODE (AUTO/CONFIRM/ASK) ──► EXECUTE ──► SCOPE EXPANSION GATE? ──► EVIDENCE GATE ──► REPORT
```

### 15.1. Core Maxim
> `AI MUST NEVER INCREASE THE USER'S INTENDED SCOPE SILENTLY.`  
> *(The AI may increase implementation detail, but must never silently increase business scope, behavioral scope, architectural scope, security scope, data scope, or change budget).*

### 15.2. Mandatory Gates
1. **Risk Gate (`Complexity ≠ Risk`):** Đánh giá độc lập Complexity (`L0–L4`) và Risk (`R0–R4`). Nếu `Risk >= R2` hoặc `Complexity >= L3` hoặc đụng đến Auth/DB/Production → BẮT BUỘC chọn chế độ `CONFIRM`.
2. **Change Budget Gate:** Khóa giới hạn thay đổi (Kỳ vọng 1–3 files, tối đa 5 files; 0 new dependencies; không đổi API/DB trừ khi được yêu cầu).
3. **Scope Expansion Gate:** Trong khi code, nếu phát hiện phạm vi thực tế vượt Compiled Scope → **STOP EXPANSION NGAY LẬP TỨC**, báo cáo nguyên nhân và recompile để chờ người dùng duyệt (`CONFIRM`).
4. **Evidence Gate:** `CLAIM LEVEL <= EVIDENCE LEVEL`. Không được khẳng định pass khi chỉ đọc code. Phải phân biệt rõ `VERIFIED`, `PARTIALLY VERIFIED`, và `UNVERIFIED`.

- **Reference:** Detailed policies in [PROMPT_RULES.md](./PROMPT_RULES.md) and [.agents/rules/prompt-compiler.md](.agents/rules/prompt-compiler.md).



