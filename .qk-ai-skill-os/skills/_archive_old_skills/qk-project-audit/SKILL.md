---
name: qk-project-audit
description: >-
  Kiểm toán toàn bộ dự án để phát hiện bug ẩn, rủi ro bảo mật, vấn đề hiệu năng và nợ kỹ thuật trước khi sửa code.
version: 1.0.0
category: engineering
tags: [audit, review, bug-detection, architecture, security, performance]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
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

