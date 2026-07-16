---
name: qk-design-to-code
category: frontend
version: 7.5.0
description: "Chuyển thiết kế Figma/Image thành UI component chuẩn pixel — zero AI-slop, 100% DESIGN.md."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]
execution_mode: deterministic

cost: high
latency: slow
risk: low
side_effects: edit_files
produces: [code]
consumes: [design-md, design-asset]

token_budget:
  max_files_read: 4
  max_lines_per_read: 150
  max_shell_commands: 0
  stop_early: false

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

# qk-design-to-code — Pixel-Perfect Builder

> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Preconditions
- [ ] `DESIGN.md` exists with color tokens, spacing scale, typography
- [ ] Design reference (Figma link, image, or wireframe description) provided

```
On missing precondition:
  EXIT: BLOCKED
  Message: "DESIGN.md missing or design reference not provided."
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Scope
- ✅ Build UI from design reference using ONLY DESIGN.md tokens
- ✅ Include all interactive states: hover, focus, active, disabled, loading
- ✅ Responsive layouts (mobile + desktop)
- ✅ Semantic HTML with ARIA roles

## Non-Goals
- ❌ Invent design tokens not in DESIGN.md
- ❌ Use hardcoded hex colors, px sizes not from token system
- ❌ Copy generic Tailwind/Bootstrap templates
- ❌ Skip loading/error/empty states

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Priority Order

| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1 | HTML structure + semantic markup | Never |
| P2 | DESIGN.md token application (colors, spacing, typography) | Never |
| P3 | Interactive states (hover, focus, active) | Budget < 30% |
| P4 | Responsive breakpoints (mobile) | Budget < 50% |
| P5 | Loading / error / empty states | Budget < 60% |
| P6 | Animation / micro-interactions | Budget < 70% |
| P7 | ARIA roles + keyboard navigation | Budget < 80% |

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Workflow

### Phase 1 — Extract Design System

**Steps:**
1. Read `DESIGN.md` → extract: colors (HSL), spacing scale, font families, border-radius, shadows, animation timing
2. Map tokens to CSS variables or framework equivalents

**Decision:**
```
IF DESIGN.md has all required tokens
  → go to Phase 2

ELSE IF some tokens missing
  → Use reasonable fallback, note gap in output
  → Confidence: MEDIUM

ELSE IF DESIGN.md empty
  → EXIT: BLOCKED
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

### Phase 2 — Build Structure

**Steps:**
1. Create HTML structure (semantic: `article`, `section`, `nav`, `button`, NOT `div` soup)
2. Apply layout: CSS Grid / Flexbox (NO absolute positioning unless unavoidable)
3. Apply DESIGN.md tokens for colors, spacing, typography

**Self-Check before next phase:**
```
✅ No hardcoded hex/rgb values (only CSS vars or DESIGN.md tokens)
✅ No magic numbers for spacing (only from scale: 4, 8, 16, 24, 32...)
✅ Semantic HTML elements used
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

### Phase 3 — Interactive States

**Steps:**
1. Add hover, focus, active states for all interactive elements
2. Add disabled state for form elements
3. Use CSS transitions (duration from DESIGN.md, typically 150–300ms)

**Self-Check:**
```
✅ Every button/link has hover + focus state
✅ Focus visible (not outline: none without replacement)
✅ Transition duration matches DESIGN.md
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

### Phase 4 — Self-Audit (Anti-Slop Check)

**Checklist (must pass ALL):**
- [ ] No hardcoded colors — only DESIGN.md tokens
- [ ] No font-size in px without token — use rem/token
- [ ] No `margin: auto` soup — use proper grid/flex
- [ ] All interactive elements have hover + focus state
- [ ] Mobile viewport works (no horizontal overflow)
- [ ] No `!important` overrides (except resets)
- [ ] No inline styles except dynamic values
- [ ] Loading state implemented (skeleton or spinner)
- [ ] Error state implemented (clear message)
- [ ] Empty state implemented (helpful illustration/text)

**Decision:**
```
IF all 10 anti-slop checks pass
  → EXIT: SUCCESS

ELSE IF 1–2 minor fails
  → Fix immediately, EXIT: SUCCESS

ELSE IF > 2 fails OR hardcoded colors found
  → Fix all, re-audit, EXIT: PARTIAL if still one gap
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Confidence Model

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | DESIGN.md complete, design reference clear | Build directly |
| MEDIUM | Some tokens missing, inferring from context | Note gaps, proceed |
| LOW | Design reference too vague or DESIGN.md empty | EXIT: BLOCKED |

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Evidence Format (Self-Audit Violations)

```
[SEVERITY] path/to/Component.tsx:LINE
Category:   [TOKEN|SEMANTIC|INTERACTION|RESPONSIVE|STATE|ARIA]
Reason:     [specific anti-slop violation]
Confidence: HIGH
Fix:        [applied immediately]
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Handoff Contract

### Consumes
```json
{
  "from": "user",
  "required_fields": ["design_reference", "design_md_path"],
  "optional_fields": ["component_name", "framework"]
}
```

### Produces
```json
{
  "to": "qk-ui-audit (for verification)",
  "output_fields": ["component_files", "tokens_used", "states_implemented", "exit_code"]
}
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Output Format

```
🎨 Design → Code
─────────────────────────────────────────────────
Component:   [ComponentName]
Tokens used: [list of DESIGN.md tokens applied]

States implemented:
  ✅ Default / ✅ Hover / ✅ Focus / ✅ Active
  ✅ Loading / ✅ Error / ✅ Empty
  ⚠️ [any state skipped — reason]

Anti-Slop Audit:
  ✅ [10/10 checks passed | N/10 — list failures]

Exit Code:   [SUCCESS | PARTIAL | BLOCKED | FAILED]
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---


---

## Escalation Rules


---

## Severity


---

## Retry Policy


---
## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Component built, all 10 anti-slop checks passed | Production ready |
| PARTIAL | Built but 1–2 minor gaps (e.g., animation skipped) | User review recommended |
| BLOCKED | DESIGN.md or design reference missing | Cannot build |
| FAILED | Anti-slop audit finds > 2 violations or hardcoded values | Rebuild required |

---


