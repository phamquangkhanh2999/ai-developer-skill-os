---
name: refactor
description: >-
  Tái cấu trúc và dọn dẹp mã nguồn để dễ bảo trì hơn mà không làm thay đổi logic hoạt động bên ngoài.
version: 1.0.0
category: engineering
tags: [refactor, clean-code, restructure, technical-debt, maintainability]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
---

# Refactor — Safe Restructuring

> **Language rule:**
> Use **English** for: code, identifiers, pattern names, file paths, technical terms.
> Use **the user's language** for: explanations, questions, and summaries.

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
