---
name: qk-validation-gate
category: qa
version: 7.5.0
description: "Cổng kiểm tra chất lượng bắt buộc với ngưỡng pass/fail cụ thể — chặn đứng mọi mã nguồn lỗi."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]
execution_mode: deterministic

cost: medium
latency: medium
risk: low
side_effects: run_commands
produces: [report]
consumes: [source-code]

token_budget:
  max_files_read: 3
  max_lines_per_read: 100
  max_shell_commands: 2
  stop_early: false  # Must run all checks — cannot skip for token budget

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

# qk-validation-gate — Quality Gate

> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Preconditions
- [ ] Project has `package.json` with lint/test scripts (or equivalent for other runtimes)
- [ ] Target scope is specified (specific files, or whole project)

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Không tìm thấy script lint/test. Vui lòng chỉ định lệnh kiểm tra."
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Scope
- ✅ Run lint, type-check, tests, security audit in sequence
- ✅ Enforce pass/fail with concrete thresholds
- ✅ Report results with structured Evidence Format

## Non-Goals
- ❌ Fix failing tests or lint errors (fixes go to qk-bug-resolution)
- ❌ Skip any gate check unless user explicitly allows
- ❌ Override failing thresholds with "ignore" flags

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Pass/Fail Thresholds (Non-Negotiable)

```yaml
lint:
  errors: 0           # Zero tolerance for lint errors
  warnings: allowed   # Warnings do not block

typescript:
  errors: 0           # Zero type errors

tests:
  coverage_minimum: 80%       # Overall coverage
  unit_test_pass_rate: 100%   # All unit tests must pass
  integration_test_pass_rate: 100%

security:
  critical_vulnerabilities: 0
  high_vulnerabilities: 0
  medium_vulnerabilities: 5  # Max allowed (review required)

build:
  must_succeed: true
  max_warnings: 5
  bundle_size_limit: 500KB    # Gzipped (if applicable)
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Priority Order

| Priority | Gate | Fail = Block? | Skip Allowed? |
|----------|------|---------------|---------------|
| P1 | Security audit (`npm audit`) | YES | Never |
| P2 | TypeScript / type check | YES | Never |
| P3 | Lint (errors only) | YES | Never |
| P4 | Unit tests | YES | Never |
| P5 | Integration tests | YES | Only if no integration tests exist |
| P6 | Coverage check | YES if < 80% | Never |
| P7 | Build | YES | Never |
| P8 | Bundle size | WARN only | Budget < 80% |

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Workflow

### Phase 1 — Security Gate (P1)

**Steps:**
1. Run: `npm audit --audit-level=high` (or equivalent)
2. Parse output for CRITICAL and HIGH

**Decision:**
```
IF 0 critical + 0 high
  → PASS P1 → go to Phase 2

ELSE IF critical or high found
  → EXIT: FAILED immediately
  → Report: exact package name, CVE, severity
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

### Phase 2 — Type & Lint Gate (P2+P3)

**Steps:**
1. Run: `npm run typecheck` (or `tsc --noEmit`)
2. Run: `npm run lint`
3. Parse error counts

**Decision:**
```
IF 0 type errors AND 0 lint errors
  → PASS P2+P3 → go to Phase 3

ELSE IF type errors > 0
  → EXIT: FAILED — list each error with file:line

ELSE IF lint errors > 0 (warnings OK)
  → EXIT: FAILED — list errors
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

### Phase 3 — Test Gate (P4+P5+P6)

**Steps:**
1. Run: `npm test -- --coverage` (or equivalent)
2. Parse: pass/fail counts, coverage percentage

**Decision:**
```
IF all tests pass AND coverage ≥ 80%
  → PASS P4+P5+P6 → go to Phase 4

ELSE IF any test fails
  → EXIT: FAILED — list failing test names

ELSE IF coverage < 80%
  → EXIT: FAILED — show coverage report (file-level)
```

**Retry Policy:**
```
Test fail
  └─ Check if it's a flaky test (run once more)
       ├─ PASS on retry → note "flaky test detected", continue
       └─ FAIL on retry → EXIT: FAILED — not flaky, real failure
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

### Phase 4 — Build Gate (P7)

**Steps:**
1. Run: `npm run build`
2. Check exit code + warnings count

**Decision:**
```
IF build succeeds AND warnings ≤ 5
  → EXIT: SUCCESS

ELSE IF build fails
  → EXIT: FAILED

ELSE IF warnings > 5
  → EXIT: PARTIAL — list warnings, continue to release if user confirms
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Confidence Model

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Command exit code 0/non-0, numeric output | Report directly |
| MEDIUM | Inferred from partial output (truncated logs) | Note potential missing info |
| LOW | Script not found or output format unknown | EXIT: BLOCKED — clarify commands |

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Severity

| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Security vulnerability in production dependency | CVE in auth library |
| HIGH | Type error or failing test | `Cannot read property of undefined` |
| MEDIUM | Coverage below threshold | 67% coverage (threshold 80%) |
| LOW | Build warning | Unused export |

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Evidence Format

```
[SEVERITY] Gate: [SECURITY|TYPE|LINT|TEST|COVERAGE|BUILD]
Command:    [command that was run]
Result:     [PASS | FAIL — exact output snippet]
Threshold:  [what the threshold is]
Actual:     [what was measured]
Fix:        [where to look for the fix]
```

**Example:**
```
[HIGH] Gate: TEST
Command:    npm test -- --coverage
Result:     FAIL — 3 tests failed
Threshold:  100% pass rate
Actual:     47/50 tests passed
Fix:        See failing tests: auth.test.ts:L45, user.test.ts:L23, order.test.ts:L89
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Escalation Rules

```
BLOCKED: Cannot run validation
Missing:
  - npm scripts (lint, test, build) in package.json
  - OR test framework setup
Questions:
  1. Dùng lệnh gì để chạy lint? (e.g., eslint, biome, oxlint)
  2. Dùng lệnh gì để chạy test? (e.g., vitest, jest, playwright)
  3. Coverage threshold dự án quy định là bao nhiêu?
Recommended Assumptions:
  - Standard: npm run lint + npm test + npm run build
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Handoff Contract

### Consumes
```json
{
  "from": "user or qk-orchestrator",
  "required_fields": ["project_root"],
  "optional_fields": ["custom_commands", "custom_thresholds", "scope_files"]
}
```

### Produces
```json
{
  "to": "qk-production-release (if all pass)",
  "output_fields": ["gate_results", "coverage_percent", "violations_list", "exit_code"]
}
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Output Format

```
🔒 Validation Gate Report
─────────────────────────────────────────────────
Project:    [path]

Gate Results:
  P1 Security:    [✅ PASS | ❌ FAIL — N critical, N high]
  P2 TypeScript:  [✅ PASS | ❌ FAIL — N errors]
  P3 Lint:        [✅ PASS | ❌ FAIL — N errors (N warnings)]
  P4 Unit Tests:  [✅ PASS | ❌ FAIL — N/N passed]
  P5 Integration: [✅ PASS | ❌ FAIL | ⏭️ SKIPPED]
  P6 Coverage:    [✅ PASS (N%) | ❌ FAIL (N% < 80%)]
  P7 Build:       [✅ PASS | ❌ FAIL]

Failures (action required):
  [SEVERITY] Gate — detail — Fix hint

Exit Code:   [SUCCESS | PARTIAL | BLOCKED | FAILED]
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---


---

## Retry Policy

[Placeholder for Retry Policy]


---
## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | All gates passed, thresholds met | Safe to proceed to release |
| PARTIAL | Build pass, but warnings > 5 OR integration skipped | User confirmation required |
| BLOCKED | Cannot run — missing scripts or config | Setup required |
| FAILED | Any gate failed at threshold | Do NOT release — fix first |

---


