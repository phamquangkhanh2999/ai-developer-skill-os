---
name: qk-frontend-debug
description: >-
  Chẩn đoán và sửa các lỗi đặc thù frontend như Hydration error, infinite re-render, stale closure và vỡ CSS.
version: 1.0.0
category: frontend
tags: [debug, react, hydration, rerender, css, state-bug]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
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

