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

---

## R-C-09: Anti-Patterns Compliance (Cross-Reference)

Ngoài R-C-01 đến R-C-08 ở trên, Agent **MUST** tuân thủ đầy đủ danh sách đỏ tại `references/anti-patterns.md` (TypeScript, React/UI, Architecture, TanStack Ecosystem) trước khi coi một đoạn code là hoàn chỉnh.

- `references/anti-patterns.md` là phần **mở rộng chi tiết** của rule này, không thay thế các rule R-C-01–08.
- Khi viết component UI, đối chiếu thêm với `references/component-cookbook.md` để đảm bảo đúng cấu trúc giải phẫu (Types → Hook → JSX).
- Nếu 2 nguồn mâu thuẫn nhau, `coding.md` (rule cấp cao) được ưu tiên; báo cáo mâu thuẫn để cập nhật `anti-patterns.md`.

---

## R-C-10: Engineering Standards Checklist (Absorbed from qk-engineering-standard)

> Áp dụng cho mọi skill có `side_effects: edit_files`. Đây là checklist tự động — không cần gọi skill riêng.

Trước khi báo cáo task hoàn thành, **MUST** verify từng điểm:

| # | Tiêu chí | Threshold |
|---|---|---|
| 1 | Function length | ≤ 40 lines |
| 2 | File length | ≤ 300 lines |
| 3 | Function params | ≤ 4 |
| 4 | Nesting depth | ≤ 3 levels |
| 5 | Cyclomatic complexity | ≤ 10 |
| 6 | No magic numbers | Dùng named constants |
| 7 | No silent errors | Không empty catch, không `!`, không `any` |
| 8 | DRY | Extract khi logic lặp ≥ 2 lần |
| 9 | Naming conventions | camelCase fn, PascalCase class, UPPER_SNAKE constant |
| 10 | No `console.log` in production code | Dùng logger hoặc xóa trước commit |

**Violation:** Nếu bất kỳ điểm nào không đạt → sửa trước khi report SUCCESS. Không report PARTIAL chỉ vì threshold bị vi phạm.
