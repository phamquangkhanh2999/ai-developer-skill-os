---
name: qk-[skill-name]
category: [core|frontend|backend|fullstack|security|qa|maintenance|devops|utilities]
version: 7.5.0
description: "[One sentence — what it does]"
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]
execution_mode: deterministic

# Orchestrator routing metadata
cost: [low|medium|high]
latency: [fast|medium|slow]
risk: [low|medium|high]
side_effects: [edit_files|run_commands|read_only|none]
produces: [report|code|schema|plan|tokens]
consumes: [context-graph|design-md|stack-trace|json-payload|none]

token_budget:
  max_files_read: 3
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-[skill-name]

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese (match user language).

---

## Preconditions
Before executing, verify ALL exist. STOP with `BLOCKED` if any is missing.

- [ ] [Precondition 1 — e.g., "Repository is accessible"]
- [ ] [Precondition 2 — e.g., "DESIGN.md exists in project root"]

```
On missing precondition:
  EXIT: BLOCKED
  Message: "[Precondition X] not found. Please provide: [what]"
```

---

## Scope
- ✅ [What this skill explicitly DOES]
- ✅ [What this skill explicitly DOES]

## Non-Goals
- ❌ [Anti-pattern 1] — because [why]
- ❌ [Anti-pattern 2]
- ❌ Never create helper scripts (Node.js/Python/shell) to apply patches — edit files directly
- ❌ Never read entire files > 150 lines — use targeted reads (StartLine:EndLine)

---

## Priority Order
When token budget is insufficient, execute checks in this order:

| Priority | Check | Skip Threshold |
|----------|-------|----------------|
| P1 | [Most critical — never skip] | Never |
| P2 | [High priority] | Budget < 30% |
| P3 | [Medium priority] | Budget < 50% |
| P4 | [Low priority — always optional] | Budget < 70% |

---

## Workflow

### Phase 1 — [Name: e.g., Triage]

**Steps:**
1. [Concrete step — specify tool: `grep_search` / `view_file[L1:L50]` / `run_command`]
2. [Next step]

**Exit When (stop this phase, move to next):**
- [Condition A — e.g., "Root cause identified"]
- [Condition B — e.g., "`max_files_read` reached"]

**On Blocked:**
```
EXIT: BLOCKED
Missing: [what specific info is needed]
Questions:
  1. [Specific question to user]
```

---

### Phase 2 — [Name: e.g., Analyze]

**Steps:**
1. [Step]

**Decision:**
```
IF [condition met]
  → proceed to Phase 3
ELSE IF [edge case]
  → EXIT: PARTIAL — note: [what was missed]
ELSE
  → ESCALATE
```

---

### Phase 3 — [Name: e.g., Execute]

**Steps:**
1. Apply fix using `replace_file_content` or `multi_replace_file_content` — NEVER via scripts
2. [Verification step]

**Exit When:**
- Fix applied and verified → EXIT: SUCCESS
- Fix applied but unverifiable → EXIT: PARTIAL

---

## Confidence Model

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Direct evidence (file:line, stack trace, exact match) | Proceed |
| MEDIUM | Inferred from patterns or similar code | Note assumption, proceed carefully |
| LOW | Assumption without evidence | STOP — ask user before proceeding |

---

## Severity

| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Data loss / security breach / app down | Hardcoded secret, SQL injection |
| HIGH | Core feature broken, blocking users | Null crash, broken API |
| MEDIUM | Degraded UX, workaround exists | Cyclomatic > 10, missing loading state |
| LOW | Style/cosmetic, non-blocking | Missing comment, minor inconsistency |

---

## Evidence Format

Every finding MUST use this format:
```
[SEVERITY] path/to/file.ts:LINE
Reason:     [why this is a violation or finding]
Confidence: [HIGH|MEDIUM|LOW]
Fix:        [one-line suggestion]
```

**Example:**
```
[HIGH] src/auth.service.ts:132
Reason:     Function length 64 lines exceeds threshold of 30
Confidence: HIGH
Fix:        Extract token validation to `validateToken()`
```

---

## Retry Policy

```
Action fails
  └─ Attempt auto-fix (if fix is deterministic)
       └─ Re-run verification
            ├─ PASS → EXIT: SUCCESS
            └─ FAIL (2nd time) → EXIT: PARTIAL + report
                 └─ Do NOT retry more than 2 times
                      └─ 3rd failure → ESCALATE to user
```

---

## Escalation Rules

When blocked, **never just "STOP"** — return structured response:

```
BLOCKED: [Reason — specific, not vague]
Missing:
  - [Specific artifact or information needed]
Questions:
  1. [Specific question]
  2. [Specific question]
Recommended Assumptions (if you want me to proceed anyway):
  - [Safe assumption 1]
  - [Safe assumption 2]
```

---

## Handoff Contract

### Consumes (Input from upstream)
```json
{
  "from": "[skill-name or 'user']",
  "required_fields": ["field1", "field2"],
  "optional_fields": ["field3"]
}
```

### Produces (Output for downstream)
```json
{
  "to": "[skill-name or 'user']",
  "output_fields": ["changed_files", "summary", "confidence", "exit_code"]
}
```

---

## Output Format

```
[SKILL_NAME] Result
─────────────────────────────────────────────────
Status:      [SUCCESS | PARTIAL | BLOCKED | FAILED]
Confidence:  [HIGH | MEDIUM | LOW]

[Section specific to this skill]

Exit Code:   [SUCCESS | PARTIAL | BLOCKED | FAILED]
```

---

## Exit Codes

| Code | Meaning | Orchestrator Action |
|------|---------|---------------------|
| SUCCESS | All checks passed, task complete | Continue pipeline |
| PARTIAL | Task done with degraded quality or skipped P3/P4 checks | Notify user, continue |
| BLOCKED | Missing precondition or ambiguous requirement | STOP, ask user |
| FAILED | Task failed after 2 retry attempts | STOP, report error |

