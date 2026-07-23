---
# ── Identity ───────────────────────────────────────────────
name: qk-production-release
version: 8.0.0
status: stable
description: "Chuẩn bị release production với 8-gate checklist bắt buộc — không pass gate = không deploy."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability

intent:
  - release-management
  - production-deployment

complexity:
  level: high
  criteria:
    files_affected: "1-5"
    has_behavior_change: false
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "release production"
  - "deploy production"
  - "chuẩn bị release"
  - "kiểm tra release"

# ── V8: References ─────────────────────────────────────────
workflow: internal

rules:
  - global
  - safety

tools:
  - filesystem
  - terminal

related_skills:
  - qk-validation-gate

knowledge_scope:
  owns:
    - release-checklist
    - deployment-gate
  references:
    - architecture

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: release-safety

selection:
  priority: high
  confidence_threshold: 0.85

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: medium
latency: slow
risk: high
side_effects: run_commands
produces: [report, plan]
consumes: [validation-gate-result, source-code]

token_budget:
  max_files_read: 3
  max_lines_per_read: 100
  max_shell_commands: 2
  stop_early: false

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-production-release — Release Gate

> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Preconditions
- [ ] `qk-validation-gate` has been run and returned SUCCESS or PARTIAL
- [ ] All HIGH priority bugs are resolved
- [ ] Production environment variables are configured (not dev)

```
On missing precondition:
  EXIT: BLOCKED
  Message: "qk-validation-gate must pass before release. Run it first."
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Scope
- ✅ Run 8-gate release checklist
- ✅ Verify no dev artifacts in production build
- ✅ Verify environment configuration

## Non-Goals
- ❌ Fix bugs — that's `qk-bug-resolution`
- ❌ Deploy to infrastructure — that's DevOps/CI system
- ❌ Skip any gate unless user explicitly overrides

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Priority Order

| Priority | Gate | Block Release? |
|----------|------|---------------|
| P1 | Validation gate result (from qk-validation-gate) | YES — hard block |
| P2 | No unresolved HIGH/CRITICAL bugs | YES — hard block |
| P3 | No `console.log` / debug artifacts in src/ | YES — hard block |
| P4 | .env.production exists (not .env.development) | YES — hard block |
| P5 | Build succeeds in production mode | YES — hard block |
| P6 | Bundle size within limit (< 500KB gzipped) | WARN only |
| P7 | No dev dependencies in production build | YES — hard block |
| P8 | CHANGELOG.md updated with release notes | WARN only |

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Release Checklist (Mandatory)

```
[ ] P1: qk-validation-gate: SUCCESS
[ ] P2: 0 unresolved HIGH/CRITICAL bugs
[ ] P3: grep -r "console.log\|debugger" src/ → empty
[ ] P4: .env.production configured, NODE_ENV=production
[ ] P5: npm run build (production mode) → exit 0
[ ] P6: Bundle size ≤ 500KB gzipped (warn if exceeded)
[ ] P7: npm audit --production → 0 critical/high
[ ] P8: CHANGELOG.md has entry for this release
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Workflow

### Phase 1 — Pre-flight Checks (P1–P4)

**Steps:**
1. Verify validation-gate result (check previous output or re-read)
2. `grep_search` for `console.log`, `debugger`, `TODO:`, `FIXME:`
3. Check for `.env.production` vs `.env.development` configuration

**Decision:**
```
IF any P1–P4 check fails
  → EXIT: FAILED immediately
  → Report which gate failed and exact fix required

IF all P1–P4 pass
  → go to Phase 2
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

### Phase 2 — Build & Size Gate (P5–P7)

**Steps:**
1. (If allowed) `npm run build` — 1 command used
2. Check bundle size if measurable
3. `npm audit --production` — 2nd command

**Decision:**
```
IF build fails
  → EXIT: FAILED

IF bundle size > 500KB
  → Note as WARNING, do not block

IF production audit has critical/high
  → EXIT: FAILED
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

### Phase 3 — Release Report

Generate signed release report with all gate results.

**Decision:**
```
IF all hard-block gates pass
  → EXIT: SUCCESS — safe to deploy

IF only WARN gates failed (P6, P8)
  → EXIT: PARTIAL — deploy with noted caveats

IF any hard-block gate failed
  → EXIT: FAILED — do NOT deploy
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Evidence Format

```
[SEVERITY] Gate: [P1-P8 name]
Check:      [what was checked]
Result:     [PASS | FAIL | WARN]
Threshold:  [what the rule is]
Actual:     [what was found]
Fix:        [what must be done before release]
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Escalation Rules

```
BLOCKED: qk-validation-gate not run
Missing:
  - Run qk-validation-gate first and share the result
Questions:
  1. Validation gate đã chạy chưa?
  2. Có bug nào HIGH/CRITICAL chưa fix không?
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Handoff Contract

### Consumes
```json
{
  "from": "qk-validation-gate",
  "required_fields": ["gate_result", "coverage_percent"],
  "optional_fields": ["bundle_size", "changelog_entry"]
}
```

### Produces
```json
{
  "to": "CI/CD system or user",
  "output_fields": ["release_checklist_result", "gates_passed", "gates_failed", "exit_code"]
}
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Output Format

```
🚀 Production Release Gate
─────────────────────────────────────────────────
Version:    [vX.Y.Z]
Date:       [YYYY-MM-DD]

Gate Results:
  P1 Validation:    [✅ PASS | ❌ FAIL]
  P2 Open Bugs:     [✅ 0 HIGH/CRITICAL | ❌ N unresolved]
  P3 Debug Cleanup: [✅ Clean | ❌ N artifacts found]
  P4 Environment:   [✅ Production config | ❌ Dev config detected]
  P5 Build:         [✅ SUCCESS | ❌ FAILED]
  P6 Bundle Size:   [✅ NKB | ⚠️ NKB > 500KB]
  P7 Security:      [✅ Clean | ❌ N critical/high]
  P8 Changelog:     [✅ Updated | ⚠️ Missing]

Verdict:    [✅ SAFE TO DEPLOY | ❌ DO NOT DEPLOY — fix: list]
Exit Code:  [SUCCESS | PARTIAL | BLOCKED | FAILED]
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---


---

## Confidence Model


---

## Severity


---

## Retry Policy


---
## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | All hard-block gates pass | Deploy approved |
| PARTIAL | Hard gates pass, warnings exist | Deploy with noted caveats |
| BLOCKED | Prerequisites missing | Run validation-gate first |
| FAILED | Any hard gate failed | Do NOT deploy |

---


