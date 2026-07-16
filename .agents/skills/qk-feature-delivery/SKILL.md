---
name: qk-feature-delivery
category: fullstack
version: 7.5.0
description: "Phát triển tính năng mới end-to-end: Requirements → Context → Design → Implement → Self-audit."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]
execution_mode: deterministic

cost: high
latency: slow
risk: medium
side_effects: edit_files
produces: [code, report]
consumes: [context-graph, design-md, user-description]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: false

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

# qk-feature-delivery — End-to-End Feature Builder

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

---

## Preconditions
- [ ] Feature requirement is specific enough to implement (not just "add something")
- [ ] `DESIGN.md` exists with required tokens if UI work is involved (colors, spacing, typography)
- [ ] Context graph available OR `qk-context-loader` run first (for logic work)

```
On missing precondition:
  EXIT: BLOCKED
  Message: "[Precondition] missing. See Escalation Rules."
```

---

## Scope
- ✅ Deliver a complete, verifiable feature end-to-end (FE + BE + API)
- ✅ Adhere to project architecture from context graph
- ✅ Adhere to DESIGN.md for any UI components
- ✅ Self-audit before marking done

## Non-Goals
- ❌ Mix refactoring into feature work
- ❌ Add dependencies without asking user first
- ❌ Emit generic AI-slop UI or unverified logic
- ❌ Ignore backward compatibility on existing APIs
- ❌ Proceed with ambiguous requirements without user confirmation
- ❌ Break existing API contracts — version or deprecate instead

---

## Priority Order

| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1 | Core feature logic (happy path) | Never |
| P2 | Error/loading/empty UI states | Budget < 30% |
| P3 | Edge cases and validation | Budget < 50% |
| P4 | Regression prevention (existing tests) | Budget < 60% |
| P5 | Backend contract validation (API schema, DB migrations) | Budget < 60% |
| P6 | Documentation + comments | Budget < 70% |

---

## Workflow

### Phase 1 — Requirements Clarification

**Steps:**
1. Parse user request → extract: what, where, acceptance criteria
2. Check ambiguity: Can I implement this without assumptions?

**Decision:**
```
IF requirements are specific (what + where + expected behavior)
  → Confidence: HIGH → go to Phase 2

ELSE IF 1–2 ambiguous points
  → ASK USER clarifying questions
  → Confidence: MEDIUM → WAIT for user response
  → Do NOT proceed to Phase 2 until clarified

ELSE IF core requirement unclear
  → EXIT: BLOCKED — ask clarifying questions
```

**Exit When:**
- Requirements understood → go to Phase 2

---

### Phase 2 — Context Loading

**Steps:**
1. If logic work: read context graph from `qk-context-loader` output
2. Identify: entry point, affected modules, existing patterns to reuse
3. If UI work: read `DESIGN.md` → extract tokens for this component
4. Document rollback plan — which files to revert if feature fails

**Decision:**
```
IF context graph available
  → Use it, proceed to Phase 3

ELSE IF no context graph but simple task
  → Simple task = modifies ≤ 1 file, no new dependencies, no new API contracts
  → grep_search for entry point → minimal manual map
  → Confidence: MEDIUM → proceed to Phase 3

ELSE IF complex task without context graph
  → EXIT: BLOCKED — run qk-context-loader first
```

---

### Phase 3 — Implementation

**Steps (in order):**
1. Create/modify files using `replace_file_content` / `multi_replace_file_content`
2. Follow existing code patterns (from context graph)
3. For UI: use DESIGN.md tokens only — no hardcoded colors/sizes
4. Implement backend error handling: try/catch, transaction rollback, input validation
5. Handle all 3 UI states: Loading + Success + Error

**Exit When:**
- Happy path implemented → go to Phase 4
- Blocked by missing dependency → EXIT: BLOCKED, ask user

---

### Phase 4 — Self-Audit

**Steps:**
1. Re-read the code written (targeted view, ≤ 150 lines)
2. Check against: backward compat, DESIGN.md compliance, error states
3. Verify test coverage meets project threshold (default: ≥ 80%)

**Decision:**
```
IF all checks pass
  → EXIT: SUCCESS

ELSE IF minor issues found (missing error state, style token)
  → Fix immediately, EXIT: SUCCESS

ELSE IF significant issue (breaks existing API, wrong architecture)
  → Fix, note change in output, EXIT: FAILED — do not ship breaking changes as PARTIAL

ELSE IF missing backend error handling
  → Fix immediately, EXIT: SUCCESS
```

---

## Confidence Model

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Context graph available, DESIGN.md read, requirements clear | Implement directly |
| MEDIUM | Some assumptions made (≤ 2) | Note assumptions in output |
| LOW | Unclear requirements or missing context OR assumptions > 2 | EXIT: BLOCKED |

---

## Severity (for self-audit findings)

| Level | Definition |
|-------|-----------|
| CRITICAL | Feature breaks existing functionality |
| HIGH | Missing required states (error/loading) or missing backend error handling |
| MEDIUM | Not following DESIGN.md or project patterns |
| LOW | Missing comments or minor style issue |

---

## Evidence Format (Self-Audit)

```
[SEVERITY] path/to/file.ts:LINE
Issue:      [what was found]
Confidence: HIGH
Fix:        [applied immediately OR noted for follow-up]
```

---

## Escalation Rules

```
BLOCKED: [specific reason]
Missing:
  - [What's needed — context graph / DESIGN.md / clear requirements]
Questions:
  1. [Specific clarifying question]
  2. [Second question if needed]
Recommended Assumptions (if proceeding):
  - [Safe assumption 1]
  - [Safe assumption 2 — note these will be in output]
```

---

## Handoff Contract

### Consumes
```json
{
  "from": "qk-context-loader + user",
  "required_fields": ["feature_description", "context_graph"],
  "optional_fields": ["design_md_path", "acceptance_criteria"]
}
```

### Produces
```json
{
  "to": "qk-validation-gate",
  "output_fields": ["changed_files", "assumptions_made", "self_audit_result", "exit_code"]
}
```

---

## Output Format

```
🚀 Feature Delivery
─────────────────────────────────────────────────
Feature:     [feature name]
Confidence:  [HIGH | MEDIUM]

Implementation:
  ✅ [file:line — what was added/changed]
  ✅ [file:line — what was added/changed]

Assumptions made:
  - [assumption 1 — safe/risky]

Self-Audit:
  ✅ Backward compatible
  ✅ Error/Loading states handled
  ✅ DESIGN.md tokens used
  ✅ Backend error handling implemented
  ⚠️ [Any noted issue]

Exit Code:   [SUCCESS | PARTIAL | BLOCKED | FAILED]
```

---

## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Feature complete, self-audit passed | All states handled, patterns followed |
| PARTIAL | Feature works but with minor gaps | Medium confidence, some skipped |
| BLOCKED | Cannot proceed — missing context/design/requirements | Stop and ask user |
| FAILED | Cannot implement — breaks existing system | Architectural conflict or API break |

---

Deliver a complete, verifiable feature end-to-end (FE + BE + API) while adhering to project architecture and DESIGN.md.
This skill is the primary execution skill for building new features. It requires clear requirements, context graph for architecture understanding, and DESIGN.md for UI work.
- Feature description with acceptance criteria
- Context graph (from qk-context-loader)
- DESIGN.md path (if UI involved)
- Existing codebase patterns
- User approval for new dependencies
1. **Clarify:** Parse requirements, identify ambiguities, ask user if needed
2. **Load:** Read context graph and DESIGN.md tokens
3. **Implement:** Build feature following existing patterns
4. **Audit:** Self-audit for backward compat, error states, DESIGN.md compliance
- MUST have context graph OR explicit confirmation for simple tasks
- MUST have DESIGN.md tokens if UI is involved
- MUST handle all 3 UI states: Loading, Success, Error
- MUST NOT exceed token_budget (max 5 files, 150 lines each, 2 shell commands)
- MUST NOT break existing API contracts without versioning
- Zero-Trust: No assumptions without user confirmation
- Backward Compat: Never break existing public APIs
- Design First: UI must use DESIGN.md tokens only
- Error Handling: Backend must have try/catch, validation, rollback
## Retry Policy
```
Fix applied
  └─ Static verification (re-read fixed section)
       ├─ PASS → EXIT: SUCCESS
       └─ Issue detected → attempt 1 correction
            └─ Re-verify
                 ├─ PASS → EXIT: SUCCESS
                 └─ FAIL → EXIT: PARTIAL + report both attempts
                      └─ Do NOT attempt 3rd fix — ESCALATE to user
```

---
