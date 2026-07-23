---
# ── Identity ───────────────────────────────────────────────
name: qk-bug-resolution
version: 8.0.0
status: stable
description: "Sửa lỗi (bugs) bằng chu trình khép kín: Quan sát → Giả thuyết → Bằng chứng → Sửa."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability

intent:
  - bug-fixing
  - debugging
  - error-resolution

complexity:
  level: medium
  criteria:
    files_affected: "2-5"
    has_behavior_change: true
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "fix bug"
  - "sửa lỗi"
  - "crash"
  - "error"
  - "not working"

# ── V8: References ─────────────────────────────────────────
workflow: bug-resolution

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-context-loader
  - qk-validation-gate

knowledge_scope:
  owns:
    - bug-diagnosis
    - fix-strategies
    - root-cause-analysis
  references:
    - testing
    - language-specific-features

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: bug-fix

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: medium
risk: medium
side_effects: edit_files
produces: [code, report]
consumes: [stack-trace, error-message, user-description, context-graph]

token_budget:
  max_files_read: 3
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-bug-resolution — Diagnose & Repair

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

---

## Preconditions
- [ ] A specific symptom is provided (error message, wrong behavior, crash)
- [ ] The affected file or feature area is identifiable
- [ ] Reproduction steps or stack trace provided

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Cần thêm thông tin: [error message / stack trace / bước tái hiện lỗi]"
```

---

## Scope
- ✅ Diagnose existing defects with concrete evidence
- ✅ Apply minimal targeted patches directly to source files
- ✅ Verify fix with evidence (static or runtime)

## Non-Goals
- ❌ Refactor code outside the buggy area
- ❌ Create Node.js/Python/shell scripts to apply patches — edit source files directly
- ❌ Read entire files > 150 lines — use `grep_search` or targeted `view_file[StartLine:EndLine]`
- ❌ Run shell commands > 2 times per cycle
- ❌ Guess root cause without concrete evidence
- ❌ Mark as done without verifying the fix
- ❌ Proceed with MEDIUM confidence — only HIGH confidence is acceptable for fix
- ❌ Use `?.` or `!` to silence errors instead of fixing root cause

---

## Priority Order

| Priority | Check | Skip Threshold |
|----------|-------|----------------|
| P1 | Identify exact file:line of failure | Never |
| P2 | Trace data flow to root cause | Budget < 30% → EXIT: BLOCKED |
| P3 | Check adjacent code for similar bugs | Budget < 50% |
| P4 | Suggest regression test | Budget < 70% |

---

## Workflow

### Phase 1 — Triage (Read Only)

**Steps:**
1. `grep_search` — search for error message, function name, or symptom keyword
2. `view_file[StartLine:EndLine]` — read ONLY the relevant section (≤ 150 lines)
3. Identify the exact file and approximate line of failure

**Exit When:**
- Exact file:line identified → go to Phase 2
- `max_files_read` (3) reached without exact identification → EXIT: BLOCKED

**Decision:**
```
IF stack trace provided
  → Parse top frame inside project code → go to Phase 2

ELSE IF error message provided
  → grep_search for error string → go to Phase 2

ELSE
  → EXIT: BLOCKED — ask for reproduction steps
```

**On Blocked:**
```
EXIT: BLOCKED
Missing: Reproduction steps or error output
Questions:
  1. Lỗi xảy ra ở bước nào? (URL / action / input)
  2. Error message hoặc stack trace cụ thể là gì?
Recommended Assumptions: none — cannot proceed without this
```

---

### Phase 2 — Root Cause Analysis

**Steps:**
1. Read the identified file section (`view_file[StartLine:EndLine]`, ≤ 150 lines)
2. Trace: What condition triggers the failure?
3. Check context graph for blast radius assessment
4. Assign confidence level

**Common Root Cause Categories:**
- Logic error (wrong condition, wrong operator)
- Null / undefined / missing data
- Async timing or race condition
- Type mismatch or stale state
- API contract change

**Decision:**
```
IF root cause found with direct evidence (file:line + stack trace confirms)
  → Confidence: HIGH → go to Phase 3

ELSE IF root cause still unclear after reading identified file
  → Read 1 more file (budget check)
  → Still unclear → EXIT: BLOCKED

ELSE IF root cause inferred from pattern (no direct evidence)
  → EXIT: BLOCKED — cannot fix without concrete evidence
```

---

### Phase 3 — Apply Fix (Direct Edit Only)

**Steps:**
1. Apply fix using `replace_file_content` or `multi_replace_file_content`
   - **NEVER** create a helper script to do the patching
   - Keep the change minimal — smallest diff that resolves the issue
2. Re-read the fixed section to confirm correctness (static verification)
3. Run shell command ONLY if runtime verification is strictly required (counts toward max 2)

**Exit When:**
- Fix applied and verified statically → EXIT: SUCCESS
- Fix applied but runtime verification needed and command budget exhausted → EXIT: FAILED — cannot verify

---

## Confidence Model

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Direct evidence — exact file:line + stack trace confirms it | Proceed with fix |
| MEDIUM | Inferred from code patterns, similar bugs nearby | EXIT: BLOCKED — collect more evidence |
| LOW | Assumption without code evidence | STOP — ask user before applying fix |

---

## Severity

| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Data loss / security / app crash | Hardcoded secret, unhandled null crash on login |
| HIGH | Core feature broken, blocking users | API returns 500, form submission fails |
| MEDIUM | Degraded UX, workaround exists | Wrong label, minor calculation off |
| LOW | Cosmetic, non-blocking | Console.log left in code |

---

## Evidence Format

```
[SEVERITY] path/to/file.ts:LINE
Reason:     [why this causes the bug]
Impact:     [which modules/users are affected]
Confidence: [HIGH|MEDIUM|LOW]
Fix:        [what was changed]
```

**Example:**
```
[HIGH] src/services/auth.service.ts:87
Reason:     Missing null check on `user.profile` — crashes when profile is not yet loaded
Impact:     Affects all login flows; 100% of users hitting this path
Confidence: HIGH
Fix:        Added `user.profile?.email ?? ''` guard
```

---

## Retry Policy

```
Fix applied
  └─ Static verification (re-read fixed section)
       ├─ PASS → EXIT: SUCCESS
       └─ Issue detected → attempt 1 correction
            └─ Re-verify
                 ├─ PASS → EXIT: SUCCESS
                 └─ FAIL → EXIT: FAILED + report both attempts
                      └─ Do NOT attempt 3rd fix — ESCALATE to user
```

---

## Escalation Rules

```
BLOCKED: [Specific reason]
Missing:
  - [Stack trace / error message / reproduction steps]
Questions:
  1. Lỗi xuất hiện khi nào? (action/URL/input cụ thể)
  2. Lỗi có tái hiện được không?
Recommended Assumptions (if proceeding without full info):
  - [Safe assumption based on available context]
```

---

## Handoff Contract

### Consumes
```json
{
  "from": "user or qk-orchestrator",
  "required_fields": ["symptom_description", "context_graph"],
  "optional_fields": ["stack_trace", "error_message", "affected_file"]
}
```

### Produces
```json
{
  "to": "user",
  "output_fields": ["changed_files", "root_cause", "impact", "severity", "confidence", "exit_code"]
}
```

---

## Output Format

```
🐛 Bug Report
─────────────────────────────────────────────────
Symptom:     [What broke + how to reproduce]
Root cause:  [file:line — exact reason]
Severity:    [CRITICAL | HIGH | MEDIUM | LOW]
Confidence:  [HIGH | MEDIUM | LOW]
Impact:      [Which modules/users affected]

🔧 Fix Applied
─────────────────────────────────────────────────
File:        [path/to/file.ts]
Change:      [What changed and why it's minimal]

✅ Verification
─────────────────────────────────────────────────
Static:      [Re-read section — looks correct]
Runtime:     [PASS | SKIPPED — reason]

Exit Code:   [SUCCESS | PARTIAL | BLOCKED | FAILED]
```

---

## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Bug fixed and verified | Fix applied + static/runtime check passed |
| PARTIAL | Fix applied, verification inconclusive | Budget exhausted or environment inaccessible |
| BLOCKED | Cannot diagnose without more info | Missing stack trace / reproduction steps |
| FAILED | Fix attempted, issue persists after 2 retries OR budget exhausted without verification | Complex race condition or architectural issue |

---

Diagnose and fix a specific bug with minimal, targeted changes while preserving all existing behavior.
This skill is triggered when a user reports a specific defect with a stack trace, error message, or reproduction steps. It requires concrete evidence before any code modification.
- Symptom description (error message, wrong behavior, crash)
- Stack trace or reproduction steps
- Affected file or feature area (if known)
- Context graph (for blast radius assessment)
1. **Observe:** Read error output, stack trace, and affected code section
2. **Hypothesize:** Identify potential root causes based on evidence
3. **Verify:** Confirm root cause with direct file:line evidence
4. **Fix:** Apply minimal patch using direct edit only
5. **Verify:** Re-read fixed code and confirm correctness
- MUST have exact file:line before proceeding to fix
- MUST NOT guess root cause without direct evidence
- MUST keep changes minimal — smallest diff that resolves the issue
- MUST NOT exceed token_budget (max 3 files, 150 lines each, 2 shell commands)
- MUST verify fix before marking done
- Zero-Trust: No fix without HIGH confidence (direct evidence)
- Minimal Change: Fix only the bug, no refactoring
- Backward Compat: Preserve all existing public API behavior
- Evidence First: Every finding must use Evidence Format with file:line
---
