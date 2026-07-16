---
name: qk-docs
category: documentation
version: 7.5.1
description: "Viết và duy trì tài liệu chính xác tuyệt đối — phải match code thực tế, cấm bịa đặt."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]
execution_mode: deterministic
cost: low
latency: fast
risk: low
side_effects: edit_files
produces: [report]
consumes: [source-code]
token_budget:
  max_files_read: 3
  max_lines_per_read: 100
  max_shell_commands: 0
  stop_early: true
exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

# qk-docs — Technical Writer & Documentation Maintainer

> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.

---

## Preconditions
- [ ] Target code file or module is specified

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Chỉ định file cần viết docs."
```

---

## Scope
- ✅ Document ONLY what exists in code — never invent params/behavior
- ✅ Update docs whenever corresponding code changes
- ✅ Use living documentation (JSDoc/TSDoc/Swagger) over isolated Markdown

## Non-Goals
- ❌ Guess API params not in the code
- ❌ Write generic/useless comments (`// gets the user`)
- ❌ Write docs for code that hasn't been read yet

---

## Priority Order
| P | Task | Skip Threshold |
|---|------|----------------|
| P1 | Read source code first (never write before reading) | Never |
| P2 | Document public API (exported functions/classes) | Never |
| P3 | Document complex logic with WHY (not WHAT) | Budget < 40% |
| P4 | Update README if public interface changed | Budget < 60% |

---

## Workflow

### Phase 1 — Read Code
1. `view_file[targeted]` — read function/class signatures
2. Identify: params, return type, side effects, error cases

**Decision:** `IF code is not readable → EXIT: BLOCKED — read code first`

### Phase 2 — Write Documentation
1. JSDoc/TSDoc format for functions: `@param`, `@returns`, `@throws`
2. Comment: WHY (not WHAT) — code already shows what
3. Example usage for complex APIs

### Phase 3 — Verify Accuracy
1. Re-read written docs vs code → spot check each param name

**Decision:**
```
IF docs match code exactly → EXIT: SUCCESS
IF any param name or type mismatch → fix immediately
```

---

## Documentation Templates

### Function (JSDoc)
```typescript
/**
 * [One sentence — what it does and WHY it exists]
 *
 * @param {Type} paramName - [description]
 * @returns {Type} [description of return value]
 * @throws {ErrorType} [when this error is thrown]
 * @example
 * const result = functionName(arg);
 */
```

### README Section
```markdown
## [Feature Name]
[What it does — user-facing description]

### Usage
[Code example]

### Configuration
| Option | Type | Default | Description |
```

---

## Evidence Format
```
[SEVERITY] path/to/file.ts:LINE
Issue:      [MISSING_PARAM | WRONG_TYPE | STALE_DOC | GENERIC_COMMENT]
Confidence: HIGH
Fix:        [specific correction]
```

---

## Exit Codes
| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Docs written and verified against source code | Execution complete |
| PARTIAL | Docs written but some parts inferred (not verified) | MEDIUM confidence |
| BLOCKED | Target source file missing or inaccessible | Cannot read source |
| FAILED | Documentation fundamentally misrepresents the code | Gross error |

---

## Confidence Model
| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Target code read, behavior understood | Write docs definitively |
| MEDIUM | Target code too large, inferred from types/tests | Write with disclaimer |
| LOW | "Write docs for this feature" without pointing to code | EXIT: BLOCKED |

---

## Severity
| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Docs instruct user to do something dangerous | Documenting destructive API without warnings |
| HIGH | API params documented incorrectly | Says string instead of object |
| MEDIUM | Missing docs for edge cases | Doesn't explain error throws |
| LOW | Typo or poor formatting | Misaligned markdown table |

---

## Retry Policy
```
Doc verification fails
  └─ Target code changed during doc writing
       ├─ Re-read target code
       └─ Do NOT retry more than 1 time
```

---

## Escalation Rules
```
BLOCKED: Target source file missing
Missing:
  - Exact path to the code that needs documenting
Questions:
  1. File code nào bạn muốn viết doc? (Xin đường dẫn)
  2. Mục tiêu của doc này là cho user hay cho developer nội bộ?
Recommended Assumptions:
  - Developer-facing JSDoc if inside source files
```

---

## Handoff Contract
### Consumes
```json
{
  "from": "user",
  "required_fields": ["target_file", "doc_type"],
  "optional_fields": ["context"]
}
```
### Produces
```json
{
  "to": "user",
  "output_fields": ["updated_files", "exit_code"]
}
```

---


