---
name: qk-ui-system-builder
category: frontend
version: 7.5.0
description: "Xây dựng Design System và token library từ DESIGN.md — không tự đặt ra token ngoài contract."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]
execution_mode: deterministic
cost: medium
latency: medium
risk: low
side_effects: edit_files
produces: [code, tokens]
consumes: [design-md]
token_budget:
  max_files_read: 2
  max_lines_per_read: 100
  max_shell_commands: 0
  stop_early: true
exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

# qk-ui-system-builder — Design System Constructor

> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.

---

## Preconditions
- [ ] `DESIGN.md` exists with color, spacing, typography tokens

```
On missing precondition:
  EXIT: BLOCKED
  Message: "DESIGN.md missing. Run qk-project-bootstrap to create one."
```

---

## Scope
- ✅ Extract tokens from DESIGN.md ONLY — never invent
- ✅ Generate CSS custom properties (variables) or framework theme
- ✅ Ensure all components are accessible (A11y)

## Non-Goals
- ❌ Invent tokens not in DESIGN.md (e.g., standard Tailwind defaults)
- ❌ Create duplicate tokens for same visual value
- ❌ Generate component library without token foundation

---

## Token Naming Convention

```css
/* Colors — HSL always */
--color-[role]-[shade]: hsl(H, S%, L%);
/* Example: */
--color-primary-500: hsl(220, 80%, 55%);
--color-surface-100: hsl(220, 15%, 98%);

/* Spacing — scale-based */
--space-[n]: [n * base]px;
/* Example: */
--space-1: 4px; --space-2: 8px; --space-4: 16px;

/* Typography */
--font-[family]: '[Name]', fallback;
--font-size-[scale]: [value]rem;
--font-weight-[name]: [value];

/* Border Radius */
--radius-[size]: [value]px;

/* Shadows */
--shadow-[level]: [value];

/* Animation */
--duration-[speed]: [value]ms;
--ease-[type]: [cubic-bezier or keyword];

/* Z-index */
--z-[layer]: [value];  /* dropdown=100, modal=200, toast=300 */
```

---

## Dark/Light Mode Pattern
```css
:root {
  --color-background: hsl(0, 0%, 100%);
  --color-text: hsl(220, 15%, 10%);
}

[data-theme="dark"] {
  --color-background: hsl(220, 15%, 10%);
  --color-text: hsl(220, 10%, 90%);
}
```

---

## Workflow

### Phase 1 — Extract from DESIGN.md
1. Read DESIGN.md → list all defined tokens
2. Categorize: Colors / Spacing / Typography / Radius / Shadow / Animation

### Phase 2 — Generate Token File
1. Create `src/styles/tokens.css` (or equivalent)
2. Apply naming convention above
3. Add dark mode variants if DESIGN.md specifies

### Phase 3 — Verify No Invented Tokens
1. Cross-check: every generated token has source in DESIGN.md
2. Flag any token that was "inferred" vs explicitly defined

**Decision:**
```
IF all tokens sourced from DESIGN.md → EXIT: SUCCESS
IF some tokens inferred (MEDIUM confidence) → EXIT: PARTIAL, list them
```

---


---

## Priority Order

[Placeholder for Priority Order]


---

## Output Format

[Placeholder for Output Format]


---
## Exit Codes
| Code | Meaning | When |
|------|---------|------|
| SUCCESS | All tokens extracted from DESIGN.md, naming convention applied | All generated |
| PARTIAL | Some tokens inferred (not explicitly in DESIGN.md) | Inferred values used |
| BLOCKED | DESIGN.md missing or has no tokens | Cannot start |
| FAILED | Token conflicts detected (duplicate values, naming collision) | Conflict |

---

## Confidence Model
| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Token explicitly exists in DESIGN.md | Extract and map |
| MEDIUM | Token value inferred or estimated based on related tokens | Note assumption |
| LOW | Core scale missing entirely (e.g. no spacing definition) | EXIT: BLOCKED |

---

## Severity
| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Hardcoded values injected without being tokens | Missing the point of the system |
| HIGH | Token naming convention violated | `primary-color` instead of `--color-primary` |
| MEDIUM | Dark mode not supported | Hardcoded white background |
| LOW | Unused token generated | Extraneous variables |

---

## Evidence Format
```
[SEVERITY] src/styles/tokens.css:LINE
Issue:      [specific violation or gap]
Confidence: HIGH
Fix:        [specific change]
```

---

## Retry Policy
```
Token generation fails
  └─ Check if naming collision or syntax error
       ├─ Syntax error → fix CSS/SCSS format → retry
       └─ Collision → deduplicate → retry
            └─ Do NOT auto-retry more than 1 time
```

---

## Escalation Rules
```
BLOCKED: DESIGN.md missing or empty
Missing:
  - Valid DESIGN.md with token specifications
Questions:
  1. Bạn có file design reference nào khác không?
Recommended Assumptions:
  - Generate default Tailwind-like scale if requested
```

---

## Handoff Contract
### Consumes
```json
{
  "from": "user or project-bootstrap",
  "required_fields": ["design_md_path"],
  "optional_fields": ["css_framework", "output_format"]
}
```
### Produces
```json
{
  "to": "user or design-to-code",
  "output_fields": ["token_file_path", "inferred_tokens", "exit_code"]
}
```

---


