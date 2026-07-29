---
# ── Identity ───────────────────────────────────────────────
name: qk-feature-delivery
version: 8.3.1
status: stable
description: "Phát triển tính năng mới end-to-end: Requirements → Context → Design → Implement → Self-audit."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability

intent:
  - feature-building
  - end-to-end-development
  - implementation

complexity:
  level: high
  criteria:
    files_affected: "5+"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "add feature"
  - "build new"
  - "implement"
  - "phát triển tính năng"
  - "tạo mới"

selection:
  priority: medium
  confidence_threshold: 0.85

# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding
  - safety

tools:
  - filesystem
  - terminal

related_skills:
  - qk-context-loader
  - qk-validation-gate

knowledge_scope:
  owns:
    - feature-implementation
    - requirement-analysis
  references:
    - testing
    - security
    - anti-patterns
    - design-system

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: feature

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
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
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
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
- ✅ Read requirements and design docs (Context Loading)
- ✅ Implement feature adhering to R-C-09 (Anti-slop) and R-SEC-04 (Zero-Trust)
- ✅ Write unit/integration tests as required
- ✅ Run self-audit using qk-validation-gate before finishing

## Non-Goals
- ❌ Skip validation gate
- ❌ Bypass R-SEC-04 (Zero-Trust) input validation
- ❌ Write 'spaghetti' code or giant God Files

---

## Priority Order
| P | Task | Skip Threshold |
|---|------|----------------|
| P1 | Load and read requirements & design | Never |
| P2 | Context Graph verification (dependencies) | Never |
| P3 | Implementation (Code) | Never |
| P4 | Testing & Validation Gate | Never |
| P5 | Documentation | Budget < 30% |

---

## Workflow

### Phase 1 — Context Loading
1. Read feature spec / requirements.
2. Read `DESIGN.md` if UI is involved.
3. Verify dependency graph via `qk-context-loader`.

**Decision:**
IF context is clear → go to Phase 2
ELSE → EXIT: BLOCKED — ask user

### Phase 2 — Implementation (Code)
1. Write code in isolated steps.
2. **BẮT BUỘC tuân thủ R-C-09 (Zero Slop) và R-SEC-04 (Zero Trust).**
3. Keep functions < 30 lines, avoid God Files.

### Phase 3 — Testing
1. Write unit tests / integration tests.
2. Run test commands to verify.

### Phase 4 — Validation Gate (Self-Audit)
1. Hand off to `qk-validation-gate` or run linters.
2. Fix any reported violations immediately.

**Decision:**
IF validation passes → EXIT: SUCCESS
IF validation fails → Fix and retry

---

## Confidence Model
| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Requirements clear, tests pass, validation clean | Report SUCCESS |
| MEDIUM | Specs ambiguous, some assumptions made | Ask user to review |
| LOW | Lacking specs or API contracts | EXIT: BLOCKED |

---

## Severity
| Level | Definition |
|-------|-----------|
| CRITICAL | Broken functionality, security risk |
| HIGH | Missing tests, validation gate failed |
| MEDIUM | Minor UX issues |
| LOW | Code style issues |

---

## Evidence Format
```
[SEVERITY] path/to/file.ts
Action:     [What was implemented/fixed]
Confidence: HIGH
Validation: [PASS | FAIL]
```

---

## Handoff Contract
### Consumes
```json
{
  "from": "user or qk-product-specification",
  "required_fields": ["feature_spec", "acceptance_criteria"]
}
```
### Produces
```json
{
  "to": "qk-validation-gate",
  "output_fields": ["implemented_files", "test_status", "exit_code"]
}
```

---

## Exit Codes
| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Feature completed, tests pass, validation clean | Normal |
| PARTIAL | Feature mostly done, some minor issues | Budget hit |
| BLOCKED | Missing requirements or design | Cannot start |
| FAILED | Implementation fundamentally broken | Tests/Validation failed |

---
