---
name: qk-ui-builder
category: frontend
version: 7.5.0
description: "Xây dựng, sửa, audit, và học UI — từ Figma/ảnh, map API, fix bug UI, đến redesign cấu trúc."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]
execution_mode: deterministic

cost: high
latency: slow
risk: low
side_effects: edit_files
produces: [code, report]
consumes: [design-md, design-asset, source-code, api-schema]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 0
  stop_early: false

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

# qk-ui-builder — UI Builder & Auditor

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

---

## Verbs

| Verb | Trigger | Behavior |
|------|---------|----------|
| *(default)* | `./qk-ui-builder` | Build or edit UI from design reference |
| `--audit` | `./qk-ui-builder --audit` | Score UI against anti-slop checklist, no edits |
| `--redesign` | `./qk-ui-builder --redesign` | Rebuild structure, keep copy/IA/brand |
| `--study` | `./qk-ui-builder --study <screenshot\|URL>` | Extract design DNA → `design.md` |

---

## Preconditions
- [ ] `DESIGN.md` exists with color tokens, spacing scale, typography
- [ ] For default/edit: design reference or target component specified
- [ ] For `--audit`: target UI file(s) specified
- [ ] For `--redesign`: target page + brand/copy context provided
- [ ] For `--study`: screenshot file or public URL provided

```
On missing precondition:
  EXIT: BLOCKED
  Message: "[Missing item]. See Escalation Rules."
```

---

## Scope

### Default verb
- ✅ Build new UI from Figma/ảnh/design reference
- ✅ Sửa text, thêm nội dung, map API key vào component
- ✅ Fix UI bug: padding, màu, hiển thị, responsive
- ✅ Generate strict UI từ DESIGN.md tokens

### `--audit`
- ✅ Score UI against anti-slop checklist (58 gates)
- ✅ Detect generic AI aesthetics, hardcoded values
- ✅ Verify ARIA, contrast, responsive states

### `--redesign`
- ✅ Thay đổi cấu trúc page, giữ nội dung/IA/brand
- ✅ Pick new macrostructure + theme fingerprint

### `--study`
- ✅ Extract design DNA từ ảnh/Figma/URL
- ✅ Emit portable `design.md` for handoff

## Non-Goals
- ❌ Invent design tokens not in DESIGN.md
- ❌ Use hardcoded hex colors, px sizes not from token system
- ❌ Copy generic Tailwind/Bootstrap templates
- ❌ Skip loading/error/empty states
- ❌ Clone paid templates or violate design copyright

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

---

## Workflow

### Phase 1 — Route by Verb

**Decision:**
```
IF --audit
  → Load slop-test gates → go to Audit phase

ELSE IF --redesign
  → Load macrostructure index → pick new fingerprint → go to Build phase

ELSE IF --study
  → Load study protocol → extract DNA → emit design.md → EXIT: SUCCESS

ELSE (default: build/edit)
  → go to Build phase
```

---

### Phase 2 — Load Design Context (default/edit/redesign only)

**Load Discipline (MANDATORY):**

```
EAGER (load every build):
  - typography.md
  - color.md
  - layout-and-space.md
  - copy.md
  - anti-patterns.md

INDEX-THEN-PICK (load index, choose ONE):
  - macrostructures.md → pick ONE → load only that file

CONDITIONAL (load only if needed):
  - themes/[name].md → only if project has locked theme
  - motion.md → only if animation requested
  - interaction-and-states.md → only if complex interactions
  - responsive.md → only if mobile breakpoints needed
  - component-cookbook.md → only if building known archetype

LOAD-AT-END (post-emit only):
  - slop-test.md → run AFTER build completes
```

**Steps:**
1. Read `DESIGN.md` → extract tokens: colors (HSL), spacing, fonts, radius, shadows
2. Load eager references (typography, color, layout, copy, anti-patterns)
3. Check `.agents/memory/ui-diversification.json` for last theme/macrostructure used
4. If redesign: read `references/macrostructures.md` index → pick ONE different from last → load only that file
5. If project has locked theme: load `references/themes/[name].md`

**Diversification rule:** consecutive builds must use different theme + macrostructure from `ui-diversification.json`.

---

### Phase 3 — Build or Edit

**Steps:**
1. For new UI: create component from design reference using DESIGN.md tokens
2. For edit: modify existing component per user request (text, API mapping, layout)
3. Apply theme + macrostructure fingerprint
4. Handle all 3 UI states: Loading, Success, Error

**API mapping rule:**
- Bind API response to component props via generated TypeScript interfaces
- NEVER hardcode API URLs in component
- Use existing API client pattern from project

---

### Phase 4 — Slop Test (post-emit)

Load `references/slop-test.md` and verify all 58 gates pass.

```
IF all 58 gates pass
  → EXIT: SUCCESS

ELSE IF critical gate fails (hardcoded purple gradient, banned font)
  → EXIT: FAILED — rebuild required
```
1. Read `references/macrostructures.md` (index only)
2. Pick ONE macrostructure different from last build
3. Load only that macrostructure file from `references/macrostructures/`

---

### Phase 3 — Build or Edit

**Steps:**
1. For new UI: create component from design reference using DESIGN.md tokens
2. For edit: modify existing component per user request (text, API mapping, layout)
3. Apply theme + macrostructure fingerprint
4. Handle all 3 UI states: Loading, Success, Error

**API mapping rule:**
- Bind API response to component props via generated TypeScript interfaces
- NEVER hardcode API URLs in component
- Use existing API client pattern from project

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
IF all checks pass
  → EXIT: SUCCESS

ELSE IF 1–2 minor fails
  → Fix immediately, EXIT: SUCCESS

ELSE IF > 2 fails OR hardcoded colors found
  → Fix all, re-audit, EXIT: PARTIAL if still one gap
```

---

### Phase 5 — Slop Test (post-emit)

Load `references/slop-test.md` and verify all 58 gates pass.

```
IF all 58 gates pass
  → EXIT: SUCCESS

ELSE IF critical gate fails (hardcoded purple gradient, banned font)
  → EXIT: FAILED — rebuild required
```

---

## Confidence Model

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | DESIGN.md complete, design reference clear, API schema provided | Build directly |
| MEDIUM | Some tokens missing or design reference ambiguous | Note gaps, proceed |
| LOW | DESIGN.md missing or design reference too vague | EXIT: BLOCKED |

---

## Severity

| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Hardcoded API URL in component, banned font used | `axios.get("http://localhost")` in JSX |
| HIGH | Missing error/loading state, hardcoded color not in DESIGN.md | No 500 handler |
| MEDIUM | Missing hover state, spacing off by 1 unit | Button without focus ring |
| LOW | Comment missing, minor naming inconsistency | `temp` variable name |

---

## Evidence Format

```
[SEVERITY] path/to/Component.tsx:LINE
Category:   [TOKEN|SEMANTIC|INTERACTION|RESPONSIVE|STATE|ARIA|SLOP]
Reason:     [specific violation]
Confidence: HIGH
Fix:        [one-line actionable suggestion]
Points:     -N pts (for audit mode)
```

---

## Retry Policy

```
Build/Edit fails
  └─ Check failure type
       ├─ Token missing → infer from DESIGN.md, note assumption
       └─ Design reference unclear → EXIT: BLOCKED, ask user

Slop test fails
  └─ Critical gate (hardcoded color, banned font)
       └─ EXIT: FAILED — do not ship, rebuild required
```

---

## Escalation Rules

```
BLOCKED: DESIGN.md missing or design reference unclear
Missing:
  - DESIGN.md with color/spacing/typography tokens
  - Design reference (Figma/ảnh/wireframe)
  - For --study: screenshot or public URL
Questions:
  1. Bạn có DESIGN.md chưa? (chạy qk-project-bootstrap nếu chưa)
  2. Design reference là gì? (Figma link / ảnh / mô tả)
  3. Cho phép tạo DESIGN.md mới không?
Recommended Assumptions (if proceeding):
  - Use industry-standard: 8px spacing, Inter font, neutral gray palette
```

---

## Handoff Contract

### Consumes
```json
{
  "from": "user or qk-orchestrator",
  "required_fields": ["verb", "design_md_path"],
  "optional_fields": ["design_reference", "target_component", "api_schema", "framework"]
}
```

### Produces
```json
{
  "to": "user or qk-ui-audit (if --audit)",
  "output_fields": ["component_files", "tokens_used", "states_implemented", "slop_test_result", "exit_code"]
}
```

---

## Output Format

### Default (build/edit)
```
🎨 UI Builder
─────────────────────────────────────────────────
Component:   [ComponentName]
Theme:       [theme name from references/themes/]
Macrostructure: [macrostructure name]

States implemented:
  ✅ Loading / ✅ Success / ✅ Error
  ✅ Hover / ✅ Focus / ✅ Active / ✅ Disabled

Tokens used:
  - --color-primary-500, --space-4, --font-size-base

API Mapping:
  ✅ [endpoint → prop] mapped

Exit Code:   [SUCCESS | PARTIAL | BLOCKED | FAILED]
```

### `--audit`
```
🎨 UI Audit Report
─────────────────────────────────────────────────
Component:   [path/to/component]
Theme:       [N/A — read-only audit]

Scores:
  P1 Accessibility:  [X/15]
  P2 Layout:         [X/15]
  P3 Typography:     [X/15]
  P4 Interactions:   [X/15]
  P5 Anti-Slop:      [X/15]
  P6 Performance:    [X/10]
  ─────────────────
  Total:             [X/85] → [PASS ≥ 90% | FAIL < 90%]

Violations (top priority first):
  [SEVERITY] file:LINE — reason — Fix: suggestion (-Xpts)

Verdict:     [PASS | FAIL — requires redesign]
Exit Code:   [SUCCESS | PARTIAL | FAILED]
```

### `--redesign`
```
🎨 UI Redesign
─────────────────────────────────────────────────
Component:   [ComponentName]
Old macrostructure: [old name]
New macrostructure: [new name]
Old theme:   [old theme]
New theme:   [new theme]

Kept:
  - Copy/IA structure
  - Brand colors
  - Primary user flow

Changed:
  - Layout fingerprint
  - Section ordering
  - Visual hierarchy

Exit Code:   [SUCCESS | PARTIAL | BLOCKED | FAILED]
```

### `--study`
```
🎨 Design Study
─────────────────────────────────────────────────
Source:      [screenshot path | URL]
DNA extracted:
  - Macrostructure: [name]
  - Theme axes: [paper band / display style / accent hue]
  - Type pairing: [font1 + font2]
  - Color anchor: [primary / secondary / accent]

Output:      design.md written to [path]
Next:        ./qk-ui-builder --redesign with extracted DNA

Exit Code:   [SUCCESS | BLOCKED]
```

---

## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Build/edit/audit/study completed successfully | All checks passed |
| PARTIAL | Built with minor gaps or incomplete audit | Budget exhausted or 1-2 fixes pending |
| BLOCKED | Missing DESIGN.md, design reference, or screenshot | Cannot proceed |
| FAILED | Slop test critical failure or architectural conflict | Rebuild required |

---

## References

- `references/themes/` — Theme catalog (20 themes)
- `references/macrostructures/` — 21 page shapes
- `references/slop-test.md` — 58 anti-slop gates
- `references/anti-patterns.md` — Named tells to avoid

---
