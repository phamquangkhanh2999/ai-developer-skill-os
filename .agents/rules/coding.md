---
version: 8.0.0
description: "Rules governing code writing, editing, and review tasks."
domain: rules
applies_to: [skills-with-side_effects-edit_files]
---

# Coding Rules — Code Quality Policy

> **Câu hỏi domain này trả lời:** *Agent nên viết và sửa code như thế nào?*

---

## R-C-01: Edit Source Files Directly

**MUST** edit source files directly. Do NOT:
- Create wrapper scripts to apply patches.
- Generate intermediary files then ask user to run them.
- Use `sed`, `awk`, or shell substitution to patch files.

---

## R-C-02: Targeted Reads Only

**MUST** use targeted reads. Do NOT read entire files > 200 lines.

```
grep_search → find the relevant section
view_file[StartLine:EndLine] → read only that section
```

---

## R-C-03: SOLID Thresholds (Enforceable)

| Metric | Threshold | Action if violated |
|---|---|---|
| Function length | ≤ 40 lines | Extract sub-function |
| File length | ≤ 300 lines | Consider splitting module |
| Function params | ≤ 4 | Use object/config param |
| Nesting depth | ≤ 3 | Extract early return or helper |
| Cyclomatic complexity | ≤ 10 | Simplify conditions |

---

## R-C-04: Naming Conventions

- **Functions/methods:** `camelCase`, verb prefix (`getUser`, `buildPayload`, `validateInput`)
- **Classes/types:** `PascalCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **Files:** `kebab-case` (e.g., `user-service.ts`)
- **Booleans:** `is`, `has`, `can` prefix (`isLoading`, `hasError`)

---

## R-C-05: No Magic Numbers

Do NOT embed literal values in logic:

```typescript
// ❌ Bad
if (retryCount > 3) { ... }

// ✅ Good
const MAX_RETRIES = 3;
if (retryCount > MAX_RETRIES) { ... }
```

---

## R-C-06: Error Handling — Fix, Don't Suppress

```typescript
// ❌ Never
try { ... } catch (_) {}
const value = data!.field;
const value = data?.field ?? defaultValue; // OK only if intentional

// ✅ Always
try { ... } catch (err) { 
  logger.error(err); 
  throw new AppError('Context message', { cause: err }); 
}
```

---

## R-C-07: DRY — Extract When Duplicated ≥ 2 Times

If the same logic appears in 2+ places:
- Extract to a shared function/utility.
- Reference the single source.
- Do NOT inline-copy.

---

## R-C-08: Verification After Every Edit

After any code change:
1. Re-read the edited section to verify correctness.
2. Check for syntax errors (mentally or with lint if available).
3. Consider: does this change affect any callers or dependents?
