---
name: qk-project-health
purpose: Kiểm toán Code Smell, Tech Debt, Architecture (Audit Only).
mode_supported: [enterprise]
input: [Codebase]
output: [Health Report]
workflow: [1. Scan Repo -> 2. Check Architecture -> 3. Report]
allowed_tools: [run_command, grep_search]
handoff_to: [qk-bug-resolution]
---

# 🛠️ qk-project-health - Quy Trình Vận Hành Chuẩn (SOP)

> **Mô tả:** Kiểm toán Code Smell, Tech Debt, Architecture (Audit Only).

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
- Đích đến: `qk-bug-resolution`
- Nội dung bàn giao: Chuyển toàn bộ ngữ cảnh và kết quả đã thực thi cho bước tiếp theo.

## 📚 5. Kiến Thức Chuyên Sâu (Deep Knowledge)

*(Nền tảng kiến thức và quy tắc chi tiết kế thừa từ kỹ sư)*

---



# Project Audit

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

> ⚠️ **CRITICAL: Do NOT modify any code during audit.**
> The audit produces a report. Changes happen only after the user reviews and approves.

---

## Trigger

Activate this skill when:
- User says "audit", "review", "health check", "what's wrong with my project"
- Before starting a large feature or refactor
- After inheriting a codebase
- Before a major release
- When the system behaves unexpectedly and the root cause is unknown

---

## Scope

- ✅ Detect hidden bugs, race conditions, and unstable areas
- ✅ Review architecture and separation of concerns
- ✅ Identify security vulnerabilities
- ✅ Find performance bottlenecks
- ✅ Audit dependencies (outdated, risky, unused)
- ✅ Produce prioritized findings with recommended fixes

---

## Non-goals

- ❌ Do NOT fix anything during the audit
- ❌ Do NOT refactor code
- ❌ Do NOT make assumptions — document uncertainty instead
- ❌ Do NOT audit `node_modules`, `dist`, `build`, `.git`

---

## Audit Modes

Choose based on context:

| Mode | Scope | When to use |
|------|-------|-------------|
| **Quick** | Changed files only (git diff / recent edits) | Fast pre-commit check, small bug scope |
| **Standard** | Current feature / module being worked on | Default — before implementing changes |
| **Full** | Entire repository | Onboarding, pre-release, inherited codebase |

**Default: Standard mode.**
Use Full mode only when explicitly requested or before a major release.

---

## Severity Levels

All findings use this shared scale:

| Level | Label | Meaning |
|-------|-------|---------|
| P0 | Critical | Security breach, data loss, production crash — fix immediately |
| P1 | High | Bug affecting core functionality — fix before shipping |
| P2 | Medium | Performance issue or bad pattern — schedule soon |
| P3 | Low | Technical debt, code smell — fix when possible |

---

## Workflow

### Phase 1 — Project Discovery

*(Use `context-manager` if project context is not yet loaded)*

Analyze:
- Framework, language, build system
- Folder structure and architecture style
- Key dependencies and their versions
- Entry points, routing, data flow

Output: **Project Overview** (2-5 lines)

---

### Phase 2 — Architecture Review

Check:

**Separation of concerns:**
- Are UI components mixing API calls and business logic?
- Are services doing too much?
- Is there duplicated logic across modules?

**Folder structure:**
- Does file placement follow the declared architecture?
- Are there misplaced files or responsibilities?

**Patterns:**
- Are patterns applied consistently? (hooks, services, stores)
- Are there anti-patterns? (prop drilling, God components, circular imports)

---

### Phase 3 — Bug Detection

#### Frontend

Check for:
- `useEffect` with missing or wrong dependency arrays
- State updates after component unmount (memory leak)
- Missing cleanup in subscriptions, timers, event listeners
- Stale closures in async callbacks
- Race conditions in data fetching
- Infinite re-render loops
- `key` prop issues in lists

#### Backend

Check for:
- Unhandled promise rejections
- Missing input validation
- Incorrect HTTP status codes
- Transaction issues (missing rollback on error)
- Race conditions in concurrent operations

#### API Layer

Check for:
- Inconsistent response handling
- Missing error states
- Duplicate requests without debounce/cancellation
- Missing loading/error/empty states in UI

---

### Phase 4 — Security Audit

Check for:
- Hardcoded secrets, tokens, credentials in code
- Sensitive data in `localStorage` or URL params
- Missing authentication/authorization checks
- SQL injection or NoSQL injection risks
- XSS vulnerabilities (dangerouslySetInnerHTML, unsanitized input)
- Insecure direct object references (IDOR)
- CORS misconfiguration

---

### Phase 5 — Performance Audit

Check for:
- Large bundle size (missing code splitting, lazy loading)
- Expensive computations on every render (missing `useMemo`, `useCallback`)
- Unnecessary re-renders (missing `memo`, wrong dependency arrays)
- N+1 query problems
- Missing pagination on large datasets
- Unoptimized images or assets

---

### Phase 6 — Dependency Audit

Check:
- Outdated packages with known CVEs
- Packages with very low maintenance (abandoned)
- Duplicate packages doing the same job
- Unused dependencies in `package.json`
- Major version gaps that indicate deferred upgrades

---

## Decision Tree

```
Which audit mode?
  ├── Quick   → Read only git diff / recently changed files
  ├── Standard → Read current feature/module files + related
  └── Full    → Scan entire src/ directory systematically

Issue found → Assess severity:
  ├── P0 → Flag immediately, recommend pausing current work
  ├── P1 → Include in required fixes before shipping
  ├── P2 → Include in scheduled improvements
  └── P3 → Log as technical debt

No issues found in area → Mark as ✅ Clean
```

---

## Output Format

### Executive Summary

```
🏥 Project Health Report
─────────────────────────
Health:          [Excellent / Good / Needs Attention / Critical]
Risk Level:      [Low / Medium / High / Critical]
Audit Mode:      [Quick / Standard / Full]
Files Reviewed:  [N]
Total Findings:  [N]  (P0: N · P1: N · P2: N · P3: N)
```

### Findings (one per issue)

```
───────────────────────────────
ID:        AUDIT-001
Severity:  P1 — High
Location:  src/hooks/useUserData.ts:47
Problem:   useEffect fetches data but missing cleanup — causes state update
           on unmounted component, triggering React warning and potential
           memory leak under slow networks.
Impact:    Console errors in production, potential memory leak.
Root cause: No AbortController or isMounted flag used.
Fix:       Add AbortController + cleanup return in useEffect.
Effort:    ~15 min
```

### Priority Roadmap

```
🗺️  Fix Roadmap
──────────────────
P0 — Fix immediately (before anything else):
  • [AUDIT-00X] [Brief description]

P1 — Fix before shipping:
  • [AUDIT-00X] [Brief description]

P2 — Schedule this sprint:
  • [AUDIT-00X] [Brief description]

P3 — Technical debt backlog:
  • [AUDIT-00X] [Brief description]
```

### Next Steps

```
🔗 Recommended next skills:
  → bug-fix        (for P0/P1 issues)
  → refactor       (for architecture issues)
  → migration      (for outdated dependencies)
  → frontend-performance  (for P2 performance issues)

⏳ Awaiting your approval to proceed with fixes.
```

---

## Validation Checklist

- [ ] Correct audit mode selected for the task
- [ ] All 6 phases covered (or scoped ones for Quick/Standard)
- [ ] Every finding has: ID, severity, location, problem, root cause, fix, effort
- [ ] Priority roadmap is ordered correctly (P0 first)
- [ ] No code was modified during audit
- [ ] User informed — awaiting approval before any changes

---

## Examples

See `examples/` folder.

---



# Frontend Performance Optimizer

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

Activate this skill when:
- User reports "app is slow", "loading takes too long", or "UI freezes"
- Core Web Vitals (LCP, FID/INP, CLS) are failing
- React DevTools shows excessive re-renders
- `project-audit` flags a performance issue (P2)
- Need to optimize images, bundle size, or data fetching

---

## Scope

- ✅ **Render Optimization:** Prevent unnecessary re-renders (React `memo`, `useMemo`, `useCallback`).
- ✅ **Bundle Optimization:** Code splitting, lazy loading components/routes (`React.lazy`, Next.js `dynamic`).
- ✅ **Asset Optimization:** Image optimization (WebP, Next/Image, lazy loading `loading="lazy"`).
- ✅ **Data Fetching:** Caching, prefetching, pagination, virtualization for large lists.
- ✅ **Core Web Vitals:** Fix layout shifts (CLS), improve Largest Contentful Paint (LCP).

---

## Non-goals

- ❌ Do NOT blindly wrap everything in `useMemo` or `React.memo` (this can degrade performance).
- ❌ Do NOT optimize prematurely if there is no measured performance issue.
- ❌ Do NOT rewrite business logic unless it is the direct cause of the bottleneck.

---

## Workflow

### Phase 1 — Identify the Bottleneck

Determine what kind of performance issue it is:
1. **Network/Load Time:** Slow initial page load, large bundle size, heavy images.
2. **Render/Runtime:** UI is sluggish, typing lags, animation stutters (too many re-renders).
3. **Data/Memory:** App crashes or slows down over time, large lists lagging.

### Phase 2 — Common Fixes by Category

#### 1. Fixing Unnecessary Re-renders (React)
- Move state down to the smallest possible component.
- Use `React.memo` for heavy pure components that receive the same props.
- Stable references: Use `useMemo` for expensive calculations or object props, and `useCallback` for function props passed to memoized children.
- *Warning:* Measure first! Memoization has an upfront cost.

#### 2. Fixing Bundle Size (Code Splitting)
- Are large libraries (like `lodash`, `moment`, `echarts`) imported entirely? Use named imports or alternative libraries.
- Lazy load routes or heavy components below the fold:
  ```typescript
  const HeavyChart = React.lazy(() => import('./HeavyChart'));
  // Wrap in <Suspense fallback={<Spinner />}>
  ```

#### 3. Asset & UI Optimization
- Add fixed `width` and `height` to images to prevent Cumulative Layout Shift (CLS).
- Virtualize large lists (e.g., `react-window` or `@tanstack/react-virtual`) instead of rendering 1000 DOM nodes.
- Debounce rapid events (typing in search, window resize).

---

### Phase 3 — Implementation

Apply the targeted fix. Document why the fix improves performance.

---

## Decision Tree

```
Is the issue related to initial load time?
  ├── Yes → Focus on Code Splitting (lazy loading), Image Optimization, and bundle size reduction.
  └── No  → Is the UI lagging during interaction?
              ├── Yes → Profile renders. Check for state updates triggering massive re-renders. Use `memo` or state colocation.
              └── No  → Is a specific list or table slow?
                          ├── Yes → Implement virtualization (react-window) or pagination.
```

---

## Output Format

```
⚡ Performance Optimization Report
─────────────────────────────────────────────────
Target:      [Component / Page]
Bottleneck:  [Brief description, e.g., "Expensive list rendering on every keystroke"]

🔧 Fixes Applied:
  ✅ Extracted Search Input state to prevent list re-rendering
  ✅ Wrapped heavy `ChartComponent` in `React.memo`
  ✅ Lazy-loaded below-the-fold content (`Suspense`)

📈 Expected Impact:
  - Reduced re-renders on typing from O(N) to O(1)
  - Initial JS bundle size reduced by ~X KB

⚠️ Notes:
  Please test this on lower-end devices to confirm smooth interactions.
```

---

## Validation Checklist

- [ ] Fix addresses the specific bottleneck
- [ ] No premature memoization applied blindly
- [ ] Layout shift (CLS) prevented (if changing images/layout)
- [ ] Application behavior remains completely unchanged

---



# Refactor — Safe Restructuring

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

> ⚠️ **Core constraint: Refactoring must NOT change observable behavior.**
> If behavior changes are needed → that is a feature, not a refactor.
> Stop and clarify with the user before proceeding.

---

## Trigger

Activate this skill when:
- User says "clean up", "refactor", "it's too messy", "hard to maintain"
- Code has grown beyond its original design (God component, fat service, spaghetti logic)
- Duplicate patterns exist across multiple files
- `project-audit` identified architecture issues (P2/P3) ready to be addressed
- User asks to "improve code quality" without changing functionality

**Not this skill** → Use `bug-fix` if behavior is wrong. Use `migration` if upgrading dependencies.

---

## Scope

- ✅ Rename for clarity (variables, functions, files, components)
- ✅ Extract reusable logic into functions, hooks, services, or utilities
- ✅ Remove dead code, unused imports, and orphaned files
- ✅ Split large components / functions into focused units
- ✅ Apply consistent patterns across the codebase
- ✅ Improve type coverage (replace `any`, add missing types)
- ✅ Reduce complexity (flatten nested conditions, simplify logic)

---

## Non-goals

- ❌ Do NOT change behavior — if you must, stop and discuss first
- ❌ Do NOT change public APIs or exported interfaces without explicit approval
- ❌ Do NOT rewrite everything — prefer incremental, targeted changes
- ❌ Do NOT apply opinionated style changes (formatting belongs to linter/prettier)
- ❌ Do NOT introduce new dependencies
- ❌ Do NOT refactor code unrelated to the stated scope

---

## Severity Levels (for issues found during analysis)

| Level | Meaning |
|-------|---------|
| P0 | Refactor introduces breaking change — stop immediately |
| P1 | High coupling or duplication blocking feature work |
| P2 | Code smell reducing maintainability |
| P3 | Minor naming or style inconsistency |

---

## Workflow

### Phase 1 — Understand Current State

Before changing anything:
1. Read the target code thoroughly
2. Identify what it does (behavior, inputs, outputs, side effects)
3. Note all callers and dependents of the code being refactored
4. Check for existing tests — these are the safety net

If there are **no tests** for the code being refactored → recommend writing characterization tests first, or proceed with extra caution and document risks.

---

### Phase 2 — Identify Refactor Targets

Common code smells to look for:

| Smell | Description |
|-------|-------------|
| God Component/Function | Does too many things — split by responsibility |
| Duplicate Logic | Same pattern repeated — extract to shared utility |
| Long Parameter Lists | >4 params — use options object |
| Deep Nesting | >3 levels of if/else — flatten with early returns |
| Magic Numbers/Strings | Unnamed constants — extract to named constants |
| Dead Code | Unused variables, functions, imports — remove |
| Inconsistent Naming | Mixed conventions — standardize |
| Missing Types | `any`, missing return types — add precise types |
| Large Files | >300 lines — consider splitting by concern |

---

### Phase 3 — Plan the Refactor

Create a step-by-step plan before touching code:

1. List each specific change with its justification
2. Order changes from lowest to highest risk
3. Identify what tests must pass after each step
4. Flag any changes that touch shared/exported code

Present plan to user if scope is large or changes are risky.

---

### Phase 4 — Execute Incrementally

Apply changes in small, verifiable steps:

**Safe refactor order:**
1. Rename (lowest risk — IDEs can do this safely)
2. Extract (pull logic into new functions/hooks without changing callers)
3. Inline (remove unnecessary abstraction)
4. Move (relocate to correct file/folder)
5. Simplify (reduce complexity in logic)
6. Remove (delete dead code last — confirm nothing breaks)

After **each step** → verify tests still pass before moving on.

---

### Phase 5 — Verify Behavior Preserved

- [ ] All existing tests pass
- [ ] Run lint and type-check — clean
- [ ] Manual smoke test of affected functionality
- [ ] No new `any` types introduced
- [ ] No unused imports or dead code left
- [ ] Public API unchanged (or explicitly approved to change)

---

### Phase 6 — Report

Document what changed and why:

```
What changed:   [List of changes]
Why:            [Specific smell or issue addressed]
Risk level:     [Low / Medium / High]
Tests status:   [All pass / N new tests added]
Behavior:       [Unchanged — verified]
```

---

## Decision Tree

```
Is there existing test coverage?
  ├── Yes → Proceed — tests are the safety net
  └── No  → Recommend characterization tests first
              ├── User agrees → write tests then refactor
              └── User wants to proceed anyway → proceed with caution, document risk

Does the refactor change public APIs?
  ├── Yes → Stop — confirm with user, this may be a breaking change
  └── No  → Proceed

Is the scope larger than expected?
  ├── Yes → Present updated plan, get approval before continuing
  └── No  → Continue
```

---

## Output Format

```
🔧 Refactor Summary
─────────────────────────────────────────────────
Scope:        [What was refactored]
Changes:      [N files modified, N extracted, N removed]

Changes applied:
  ✅ [Rename: oldName → newName in path/to/file.ts]
  ✅ [Extract: logic → useCustomHook in path/to/hook.ts]
  ✅ [Remove: dead code in path/to/old.ts]
  ✅ [Split: LargeComponent → ComponentA + ComponentB]

📊 Quality improvement:
  Before: [brief description of the problem]
  After:  [brief description of improvement]

✅ Verification:
  Tests:     PASS (N tests)
  Lint:      Clean
  Types:     No new `any`
  Behavior:  Unchanged

⚠️  Notes:
  [Any assumptions, risks, or follow-up suggestions]
```

---

## Validation Checklist

- [ ] Behavior is unchanged — verified with tests or manual check
- [ ] All tests pass
- [ ] Lint and type-check clean
- [ ] No dead code, unused imports, or console.logs left
- [ ] Public APIs unchanged (or explicitly approved)
- [ ] Changes are documented with justification
- [ ] No new dependencies introduced

---

## Examples

See `examples/` folder.
