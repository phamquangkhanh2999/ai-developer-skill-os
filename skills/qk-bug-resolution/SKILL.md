---
name: qk-bug-resolution
description: Tái hiện lỗi, tìm root cause, sửa lỗi và chống hồi quy (Regression check).
mode_supported: [standard]
input: [Bug report]
output: [Fixed code, Regression test]
workflow: [1. Reproduce -> 2. Root Cause -> 3. Fix -> 4. Test]
allowed_tools: [grep_search, run_command, replace_file_content]
handoff_to: [qk-validation-gate]
---

# 🛠️ qk-bug-resolution - Quy Trình Vận Hành Chuẩn (SOP)

> **Mô tả:** Tái hiện lỗi, tìm root cause, sửa lỗi và chống hồi quy (Regression check).

## 🎯 1. Mục Tiêu (Goal)
- Hoàn thành thành công tác vụ được giao liên quan đến nhiệm vụ của skill.
- Đảm bảo chất lượng mã nguồn và tính nhất quán của hệ thống.

## 🔄 2. Chuỗi Hành Động (Chain of Thought / SOP)
*(Bắt buộc AI phải suy nghĩ và làm theo đúng thứ tự)*
1. **Phân tích (Analyze):** Thu thập ngữ cảnh và hiểu rõ yêu cầu đầu vào.
2. **Lên kế hoạch (Plan):** Xác định các bước cần thay đổi/tạo mới dựa trên bộ luật (rules).
3. **Thực thi (Execute):** Tiến hành sửa đổi mã nguồn hoặc tạo tài liệu.
4. **Xác thực (Verify):** Đảm bảo đầu ra đáp ứng đúng yêu cầu và không vi phạm quy định.

## 🛡️ 3. Ràng Buộc & Quy Tắc (Constraints)
- CẤM bỏ qua việc kiểm tra `qk-engineering-standard` trước khi viết code.
- Mọi quyết định kỹ thuật phải dựa trên nội dung tại phần Deep Knowledge (nếu có).

## 🤝 4. Giao Thức Bàn Giao (Handoff Protocol)
- Đích đến: `qk-validation-gate`
- Nội dung bàn giao: Chuyển toàn bộ ngữ cảnh và kết quả đã thực thi cho bước tiếp theo.

## 📚 5. Kiến Thức Chuyên Sâu (Deep Knowledge)

*(Nền tảng kiến thức và quy tắc chi tiết kế thừa từ kỹ sư)*

---



# Bug Fix — Diagnose & Repair

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

Activate this skill when:
- User reports a specific bug with a stack trace, error message, or behavior description
- A test is failing
- The app crashes or hangs
- A regression occurred after a code change
- User says "it's broken", "this doesn't work", "I'm getting an error"

**Not this skill** → Use `project-audit` if the problem is unknown and needs discovery first.

---

## Scope

- ✅ Reproduce the reported bug
- ✅ Identify the root cause (not just the symptom)
- ✅ Apply a minimal, targeted fix
- ✅ Verify the fix with evidence (tests, logs, comparison)
- ✅ Prevent recurrence with guards or tests

---

## Non-goals

- ❌ Do NOT refactor code outside the buggy area
- ❌ Do NOT change public APIs unless the bug requires it
- ❌ Do NOT silence errors with empty `try/catch` or blind `?.` / `!`
- ❌ Do NOT change formatting or unrelated code
- ❌ Do NOT mark as done without verifying the fix

---

## Severity Levels

| Level | Meaning |
|-------|---------|
| P0 | Production down, data loss, security breach |
| P1 | Core feature broken, blocking users |
| P2 | Non-critical feature broken, workaround exists |
| P3 | Edge case, cosmetic, minor annoyance |

---

## Workflow

### Phase 1 — Triage & Understand

Before touching code, gather:
- What is the symptom? (error message, wrong behavior, crash)
- What is the expected behavior?
- How to reproduce? (steps, conditions, environment)
- What changed recently? (git log, deployment, dependency update)
- What is the severity and impact scope?

If critical information is missing → ask before proceeding.

---

### Phase 2 — Reproduce the Issue

1. Write a failing test or script that triggers the bug
2. Confirm the bug is consistently reproducible
3. For intermittent bugs → identify timing, data, or environment conditions
4. Document the exact reproduction steps

> Rule: **Never skip reproduction.** A fix without a repro is a guess.

---

### Phase 3 — Localize the Problem

1. Read the stack trace top-down, following frames inside project code
2. Use logs, breakpoints, or `git blame` / `git bisect` to narrow scope
3. Identify the exact file and line where the failure originates
4. Trace the data flow that leads to the failure

---

### Phase 4 — Root Cause Analysis

Answer: *Why does this happen? What condition triggers it?*

Common root cause categories:
- Logic error (wrong condition, wrong operator)
- Off-by-one or boundary case
- Null / undefined / missing data
- Async timing or race condition
- Type mismatch
- Stale state or stale closure
- Config or environment issue
- API contract change
- Dependency version change

Use 5 Whys: keep asking "why" until you reach the actual cause, not just the symptom.

---

### Phase 5 — Apply the Fix

Rules:
- Fix the root cause, not the symptom
- Smallest possible change that fully resolves the issue
- Keep existing code style, naming, and conventions
- Handle related edge cases to prevent similar bugs
- Remove all debug code, console.logs, and temporary patches
- Do not change public APIs unless strictly required

---

### Phase 6 — Verify the Result

- [ ] The failing test from Phase 2 now passes
- [ ] Run the related test suite — no new failures
- [ ] Run lint and type-check — clean
- [ ] Manually reproduce the original steps — bug is gone
- [ ] No regressions in adjacent functionality

---

### Phase 7 — Report & Prevent

Summarize and propose prevention:
- What was the root cause?
- What was changed and why?
- Are there similar patterns elsewhere in the codebase?
- Should a test be added to prevent regression?

---

## Decision Tree

```
Is the bug reproducible?
  ├── No  → Isolate timing, data, environment conditions first
  └── Yes → Is the root cause known?
              ├── No  → Run Phase 3-4 (localize + analyze)
              └── Yes → Apply minimal fix → verify → report
```

```
Is the fix risky (touches shared code / public API)?
  ├── Yes → Confirm scope with user before applying
  └── No  → Apply fix
```

---

## Output Format

```
🐛 Bug Report
─────────────────────────────────────────────────
Symptom:     [What broke + how to reproduce]
Root cause:  [Exact file:line — why it happens]
Severity:    [P0 / P1 / P2 / P3]

🔧 Fix Applied
─────────────────────────────────────────────────
Changed:     [File(s) modified]
Change:      [What was changed and why it's minimal]

✅ Verification
─────────────────────────────────────────────────
Tests:       [Test name / command — PASSED]
Lint/Types:  [Clean / warnings noted]
Manual:      [Reproduced original steps — bug gone]
Regression:  [No new failures]

🛡️ Prevention
─────────────────────────────────────────────────
Test added:  [Yes / No — reason]
Similar areas to check: [file or pattern to review]
```

---

## Validation Checklist

- [ ] Bug was reproduced before fixing
- [ ] Root cause identified at exact file:line with explanation
- [ ] Fix is minimal — only changes what's needed
- [ ] Failing test now passes
- [ ] Related tests and lint/type-check clean
- [ ] No debug code left behind
- [ ] Side effects documented
- [ ] Prevention strategy noted

---

## Examples

See `examples/` folder.

---



# Frontend Debugger

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

Activate this skill when:
- User reports a UI-specific bug ("screen is blank", "button doesn't work")
- React throws a Hydration Error (`Text content did not match. Server: "A" Client: "B"`)
- React throws an infinite loop error (`Too many re-renders`)
- CSS styling is broken or overflowing unexpectedly
- Form validation behaves incorrectly

**Note:** For backend or general logic bugs, use `bug-fix`. For performance issues, use `frontend-performance`.

---

## Scope

- ✅ Diagnose and fix React hydration mismatches (Next.js / SSR)
- ✅ Fix infinite loops in `useEffect` and missing dependencies
- ✅ Resolve state staleness (stale closures in async functions or hooks)
- ✅ Fix CSS layout issues (Flexbox/Grid blowouts, z-index stacking context)
- ✅ Provide a targeted, minimal fix that doesn't break other UI elements

---

## Non-goals

- ❌ Do NOT rewrite the entire component to fix a small CSS bug
- ❌ Do NOT disable hydration checks (`suppressHydrationWarning`) unless absolutely necessary and justified
- ❌ Do NOT apply quick-fixes (like `// @ts-ignore` or wrapping everything in `setTimeout`) without understanding the root cause

---

## Workflow

### Phase 1 — Reproduction & Isolation

1. Identify the exact error message or visual symptom.
2. Isolate the component causing the issue.
3. Determine the environment (SSR, CSR, mobile, specific browser).

---

### Phase 2 — Common Issue Diagnosis

**Hydration Errors (Next.js/SSR):**
- Cause: Rendering `window`, `localStorage`, or random data (e.g., `Math.random()`, Dates) on the first pass.
- Fix: Move client-only rendering inside a `useEffect` (isMounted pattern) or use dynamic imports with `ssr: false`.

**Too many re-renders:**
- Cause: Updating state directly in the render body, or inside a `useEffect` without proper dependencies.
- Fix: Move state updates into event handlers, or fix `useEffect` dependencies.

**Stale Closures:**
- Cause: A `useEffect` or `useCallback` is using old state because it's missing from the dependency array.
- Fix: Add dependencies, use refs (`useRef`) for mutable values, or use functional state updates (`setState(prev => prev + 1)`).

**CSS Z-Index/Stacking Issues:**
- Cause: Missing `position: relative/absolute` on parent, or a new stacking context was created.
- Fix: Inspect parent elements, adjust `z-index`, or use Portals for modals.

---

### Phase 3 — Fix Application

Apply the minimal fix required to resolve the issue while preserving surrounding logic and styles.

---

## Decision Tree

```
Is it a Hydration Error?
  ├── Yes → Is it caused by client-side APIs (window/localStorage)?
  │           ├── Yes → Use `useEffect` to delay rendering until mounted
  │           └── No  → Check for mismatched HTML tags (e.g., <p> inside <p>)
  └── No  → Proceed to next check

Is it an infinite loop?
  ├── Yes → Check `useEffect` dependencies. Are objects/arrays re-created every render?
  │           ├── Yes → Memoize them (`useMemo`) or move outside component
  │           └── No  → Ensure `setState` isn't called unconditionally in render
  └── No  → Proceed
```

---

## Output Format

```
🪲 Frontend Debug Report
─────────────────────────────────────────────────
Symptom:    [Description of the bug]
Root Cause: [Explanation of why it failed, e.g., Stale Closure in useEffect]

🔧 Fix Applied:
  [Brief description of the code change]

✅ Verification:
  - Error no longer throws
  - UI renders correctly

⚠️ Notes:
  [Any side effects or things to watch out for]
```

---

## Validation Checklist

- [ ] Root cause clearly identified (not just patched)
- [ ] Fix is minimal and targeted
- [ ] No Hydration warnings remain
- [ ] Component doesn't infinitely loop
- [ ] No regression on related UI
