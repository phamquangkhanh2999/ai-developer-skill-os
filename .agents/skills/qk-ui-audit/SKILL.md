---
# ── Identity ───────────────────────────────────────────────
name: qk-ui-audit
version: 8.0.0
status: stable
description: "Kiểm toán giao diện (UI) với 57-check Anti-Slop checklist — fail nếu score < 76/85 base."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: utility

intent:
  - ui-audit
  - codebase-health

complexity:
  level: medium
  criteria:
    files_affected: "1-5"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "audit ui"
  - "check ui"
  - "kiểm tra giao diện"
  - "ui slop"
  - "review ui"

# ── V8: References ─────────────────────────────────────────
workflow: code-review

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-ui-builder

knowledge_scope:
  owns:
    - ui-standards
    - anti-slop
  references:
    - design-system
    - security
    - anti-patterns

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: review

selection:
  priority: medium
  confidence_threshold: 0.80

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: medium
risk: low
side_effects: read_only
produces: [report]
consumes: [design-md, source-code]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-ui-audit — Anti-Slop UI Inspector

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

## Preconditions
- [ ] `DESIGN.md` exists in project root
- [ ] Target UI file(s) or component(s) are specified

```
On missing precondition:
  EXIT: BLOCKED
  Message: "DESIGN.md not found. Run qk-project-bootstrap to create one, or provide design tokens manually."
```

## Scope
- ✅ Score UI components against DESIGN.md tokens
- ✅ Detect generic AI-slop aesthetics
- ✅ Verify ARIA roles and contrast ratios
- ✅ Validate responsive, interactive, and animation states

## Non-Goals
- ❌ Fix the UI — only audit and report (fixes go to qk-ui-builder)
- ❌ Pixel-level screenshot comparison
- ❌ Read entire CSS files — use targeted reads

## Priority Order

| Priority | Category | Points | Skip Threshold |
|----------|----------|--------|----------------|
| P1 | Accessibility (ARIA, contrast, keyboard) | 15pts | Never |
| P2 | Layout & Spacing (tokens, grid, whitespace) | 15pts | Budget < 30% |
| P3 | Typography & Colors (DESIGN.md compliance) | 15pts | Budget < 50% |
| P4 | Interactions & Animations (hover, focus, transitions) | 15pts | Budget < 60% |
| P5 | Anti-Slop Detection (Tra chéo với R-C-09: thẻ card xám xịt, viền nhạt nhòa, text nhỏ...) | 15pts | Budget < 70% |
| P6 | Performance & Best Practices | 10pts | Budget < 80% |
| BONUS | Mobile & Cross-browser | 5pts extra | Always optional |
| EXTENDED | Edge cases | 9pts extra | Always optional |

**Total: 85 base + 14 bonus/extended = 99 max. Pass threshold: ≥ 76/85 base (90%)**

## Workflow

### Phase 1 — Load Design Contract

**Steps:**
1. `grep_search` for DESIGN.md → read color tokens, spacing scale, typography
2. Extract key tokens: primary colors (HSL), spacing unit, font families, border-radius, shadow levels

**Exit When:**
- Tokens extracted → go to Phase 2
- DESIGN.md empty or incomplete → EXIT: BLOCKED

### Phase 2 — Scan Target UI

**Steps:**
1. `view_file[targeted]` — read component file(s), focus on className, style, and JSX structure
2. Check against each Priority category in order (P1 → P6)
3. Log each finding with Evidence Format

**Decision:**
```
IF score accumulates ≥ 76 after P1+P2+P3
  → Can skip P4–P6 if token budget < 40%
  → EXIT: PARTIAL (pass, but incomplete audit noted)

IF CRITICAL violation found (e.g., hardcoded password in UI, broken ARIA)
  → STOP audit, report immediately
  → EXIT: FAILED
```

**Exit When:**
- All categories checked → go to Phase 3
- Token budget < 20% → go to Phase 3 with PARTIAL flag

### Phase 3 — Score & Report

**Steps:**
1. Calculate total score per category
2. Identify top 3 most impactful fixes
3. Generate report with Evidence Format entries

**Decision:**
```
IF total score ≥ 76
  → EXIT: SUCCESS

IF total score 60–75
  → EXIT: PARTIAL — list required fixes

IF total score < 60
  → EXIT: FAILED — demand redesign, not patch
```

## Confidence Model

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Token clearly absent/present, ARIA attribute visible | Report directly |
| MEDIUM | Inferred from surrounding code patterns | Note assumption |
| LOW | Cannot verify without rendering (e.g., animation timing) | Mark as "unverifiable — manual check required" |

## Severity

| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Accessibility violation blocking disabled users | Missing alt text, contrast ratio < 3:1 |
| HIGH | Design system contract broken | Hardcoded hex color not in DESIGN.md |
| MEDIUM | UX degraded, workaround exists | Missing hover state, no loading indicator |
| LOW | Minor inconsistency | Spacing off by 1 unit |

## Evidence Format

```
[SEVERITY] path/to/Component.tsx:LINE
Category:   [Accessibility|Layout|Typography|Interaction|Anti-Slop|Performance]
Reason:     [specific violation description]
Confidence: [HIGH|MEDIUM|LOW]
Fix:        [one-line actionable suggestion]
Points:     -N pts
```

**Example:**
```
[HIGH] src/components/Button.tsx:23
Category:   Typography
Reason:     font-size hardcoded as "16px" — should use DESIGN.md token `--font-size-base`
Confidence: HIGH
Fix:        Replace with `var(--font-size-base)`
Points:     -3 pts
```

## Retry Policy
```
Audit is read-only — no retry needed.
If file is inaccessible → note as PARTIAL and continue with other files.
```

## Escalation Rules

```
BLOCKED: DESIGN.md missing or unreadable
Missing:
  - DESIGN.md with color tokens, spacing scale, typography definition
Questions:
  1. Có file design system nào khác không? (tokens.css, theme.ts, etc.)
  2. Bạn có thể cung cấp màu sắc / font / spacing chính của dự án không?
Recommended Assumptions (if proceeding):
  - Use industry-standard: 8px spacing unit, Inter font, neutral gray palette
```

## Handoff Contract

### Consumes
```json
{
  "from": "user or qk-orchestrator",
  "required_fields": ["target_component_path", "design_md_path"],
  "optional_fields": ["specific_checklist_categories"]
}
```

### Produces
```json
{
  "to": "qk-ui-builder (if fixes needed)",
  "output_fields": ["audit_score", "violations_list", "top_3_fixes", "exit_code"]
}
```

## Output Format

```
🎨 UI Audit Report
─────────────────────────────────────────────────
Component:   [path/to/component]
DESIGN.md:   [found | not found]

Scores:
  P1 Accessibility:  [X/15]
  P2 Layout:         [X/15]
  P3 Typography:     [X/15]
  P4 Interactions:   [X/15]
  P5 Anti-Slop:      [X/15]
  P6 Performance:    [X/10]
  ─────────────────
  Total:             [X/85 base] → [PASS ≥ 76/85 | FAIL < 76/85]

Violations (top priority first):
  [SEVERITY] file:LINE — reason — Fix: suggestion (-Xpts)

Top 3 Required Fixes:
  1. [Most impactful fix]
  2. [Second fix]
  3. [Third fix]

Verdict:     [PASS | FAIL — requires redesign]
Exit Code:   [SUCCESS | PARTIAL | FAILED]
```

## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Score ≥ 76 — UI passes Anti-Slop | All checks done, no critical violations |
| PARTIAL | Score 60–75 or incomplete audit | Some categories skipped due to token budget |
| BLOCKED | DESIGN.md missing or target not specified | Cannot audit without design contract |
| FAILED | Score < 60 or CRITICAL violation found | Generic slop detected, redesign required |

## References
- Full 57-check checklist: `references/anti-slop-checklist.md`

---

