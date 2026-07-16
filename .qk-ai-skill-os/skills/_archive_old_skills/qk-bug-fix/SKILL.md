---
name: qk-bug-fix
description: >-
  Chẩn đoán và sửa lỗi an toàn. Tái hiện lỗi, tìm nguyên nhân gốc rễ và áp dụng bản sửa lỗi tối thiểu, có kiểm chứng.
version: 2.0.0
category: engineering
tags: [bug, fix, debug, root-cause, regression]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
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

