---
# ── Identity ───────────────────────────────────────────────
name: qk-[skill-name]
version: 8.0.0
status: stable
description: "[One sentence — what this skill does and for whom]"
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability                    # capability | utility | orchestrator

intent:
  - [primary-intent]               # e.g. bug-fixing, feature-building, code-review
  - [secondary-intent]

complexity:
  level: medium                    # low | medium | high | critical
  criteria:
    files_affected: "2-5"
    has_behavior_change: true
    has_external_dependency: false
    has_breaking_change: false

triggers:                          # Keywords that route AI to this skill
  - "[trigger phrase 1]"
  - "[trigger phrase 2]"
  - "[trigger phrase 3]"

selection:
  priority: medium                 # high | medium | low
  confidence_threshold: 0.75       # 0.0 to 1.0
  # fallback_skill: [skill-name]   # Optional fallback

# ── V8: References ─────────────────────────────────────────
workflow: [workflow-name]          # → workflows/[workflow-name].yml

rules:
  - global                         # Always include global
  # - coding                       # Include if skill edits code
  # - safety                       # Include if risk: medium or high

tools:
  - filesystem
  # - git
  # - browser
  # - terminal

related_skills:                    # Skills often used together
  # - qk-context-loader
  # - qk-validation-gate

knowledge_scope:
  owns:
    - [topic this skill is authoritative for]
  references:
    - [topic this skill uses but doesn't own]

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: [bug-fix|refactor|feature|documentation|review]
  # Strategies defined in workflows/_schema.yml > verification_profiles

# ── V8: Knowledge links ────────────────────────────────────
examples: []                       # e.g. examples/good/[example].md
learnings: []                      # e.g. learnings/validated/[learning].md

# ── V7 Runtime (keep as-is) ────────────────────────────────
execution_mode: deterministic
cost: medium                       # low | medium | high
latency: medium                    # fast | medium | slow
risk: medium                       # low | medium | high
side_effects: edit_files           # edit_files | run_commands | read_only | none
produces: [code, report]           # code | report | schema | plan | tokens
consumes: [user-description]       # context-graph | design-md | stack-trace | none

token_budget:
  max_files_read: 3
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-[skill-name] — [Short Title]

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

---

## Preconditions

- [ ] [Required condition 1]
- [ ] [Required condition 2]

```
On missing precondition → EXIT: BLOCKED
Report: "Missing: [what is needed]"
```

---

## Scope

**This skill does:**
- ✅ [What it does — be specific]
- ✅ [Another thing it does]

**This skill does NOT:**
- ❌ [Explicit exclusion 1]
- ❌ [Explicit exclusion 2 — avoid scope creep]

---

## Output Format

```markdown
## [Skill Name] Result

**Status:** SUCCESS | BLOCKED | FAILED | PARTIAL
**Exit:** [exit_code]

### Summary
[1-2 sentences]

### Details
[Main output content]

### Verification
[What was verified and how]
```
