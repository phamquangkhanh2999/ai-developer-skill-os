---
# ── Identity ───────────────────────────────────────────────
name: qk-engineering-standard
version: 8.0.0
status: stable
description: "Ép buộc SOLID, DRY, Clean Code với ngưỡng số liệu cụ thể — không có rule mơ hồ."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: utility

intent:
  - code-quality
  - standards-enforcement

complexity:
  level: medium
  criteria:
    files_affected: "1-5"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "review code"
  - "clean code"
  - "check standard"
  - "refactor clean"
  - "kiểm tra chuẩn"

# ── V8: References ─────────────────────────────────────────
workflow: code-review

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-project-health
  - qk-system-evolution

knowledge_scope:
  owns:
    - coding-standards
    - best-practices
  references:
    - architecture

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: review

selection:
  priority: high
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
consumes: [source-code]

token_budget:
  max_files_read: 5
  max_lines_per_read: 150
  max_shell_commands: 1
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-engineering-standard — Code Quality Enforcer

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

## Preconditions
- [ ] Target file(s) or module(s) are specified

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Vui lòng chỉ định file hoặc module cần kiểm tra."
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Scope
- ✅ Detect violations with exact file:line references
- ✅ Classify by severity with concrete thresholds
- ✅ Suggest minimal, targeted refactors

## Non-Goals
- ❌ Auto-fix code — report only (fixes go to qk-bug-resolution or qk-feature-delivery)
- ❌ Rewrite architecture
- ❌ Touch files outside the specified scope

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Concrete Thresholds (Non-Negotiable)

```yaml
function:
  max_lines: 30              # Lines of code, excluding comments/blanks
  max_cyclomatic_complexity: 10
  max_parameters: 4

file:
  max_lines: 300
  max_public_methods_per_class: 10  # God Class threshold

dry:
  violation_threshold: 3    # Same logic duplicated in ≥ 3 places

separation_of_concerns:
  violation: "File mixes UI rendering + API calls + State management"

naming:
  min_variable_name_length: 2  # Single-letter vars (except i,j,k in loops)
  max_abbreviation_ratio: 0.3  # > 30% abbreviations in identifiers = violation

dependency:
  max_imports_per_file: 15  # Beyond this: likely a God File
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Priority Order

| Priority | Check | Severity | Skip Threshold |
|----------|-------|----------|----------------|
| P1 | Security violations (hardcoded secrets, SQL injection) | CRITICAL | Never |
| P2 | God Functions > 30 lines / complexity > 10 | HIGH | Budget < 30% |
| P3 | God Files > 300 lines / God Classes | HIGH | Budget < 40% |
| P4 | DRY violations (3+ duplicates) | MEDIUM | Budget < 50% |
| P5 | Mixed concerns in single file | MEDIUM | Budget < 60% |
| P6 | Naming convention violations | LOW | Budget < 70% |
| P7 | Excessive imports / coupling | LOW | Budget < 80% |

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Workflow

### Phase 1 — Scan for Critical & High Violations

**Steps:**
1. `grep_search` — search for: hardcoded secrets, `console.log`, `eval(`, `any` types
2. `view_file[targeted]` — read function definitions to count lines and parameters
3. Log each violation with Evidence Format

**Decision:**
```
IF CRITICAL violation found (e.g., hardcoded API key)
  → Report immediately, mark EXIT: FAILED
  → Still continue scanning (don't stop at first critical)

IF function line count > 30 OR complexity > 10
  → Log as [HIGH]

IF file line count > 300
  → Log as [HIGH] — God File suspected
```

**Exit When:**
- All P1+P2+P3 checks done → go to Phase 2
- Token budget < 30% → go to Phase 3 directly with PARTIAL flag

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

### Phase 2 — Scan for Medium & Low Violations

**Steps:**
1. `grep_search` — find duplicate logic patterns (copy-paste code)
2. Check import counts per file
3. Check naming conventions

**Decision:**
```
IF same logic block appears ≥ 3 times
  → Log as [MEDIUM] DRY violation

IF file has > 15 imports
  → Log as [LOW] — potential God File or tight coupling

IF token budget < 50%
  → Skip P6+P7, go to Phase 3
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

### Phase 3 — Score & Report

**Steps:**
1. Count violations by severity
2. Calculate health score: start at 100, deduct per violation
3. Generate report

**Deduction Scale:**
```
CRITICAL: -25 pts each
HIGH:     -10 pts each
MEDIUM:   -5 pts each
LOW:      -2 pts each
```

**Decision:**
```
IF score ≥ 80 AND no CRITICAL violations
  → EXIT: SUCCESS

IF score 60–79 OR any HIGH violations
  → EXIT: PARTIAL — list fixes needed

IF score < 60 OR any CRITICAL violations
  → EXIT: FAILED — requires immediate action
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Confidence Model

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Direct line count, exact pattern match | Report as violation |
| MEDIUM | Inferred cyclomatic complexity without tool | Note estimate |
| LOW | Architectural smell inferred from structure | Mark as "suspected — verify manually" |

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Severity

| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Security risk or data integrity | Hardcoded secret, SQL injection via string concat |
| HIGH | Technical debt that blocks scaling | Function 80 lines, God Class 15+ methods |
| MEDIUM | DRY or SoC violation, fixable in < 1 hour | Same validation logic in 3 components |
| LOW | Style/naming issue, non-blocking | Single-letter variable `x` outside loop |

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Evidence Format

```
[SEVERITY] path/to/file.ts:LINE
Rule:       [FUNCTION_LENGTH | COMPLEXITY | DRY | SOC | NAMING | GOD_CLASS | SECRET]
Reason:     [specific measurement vs threshold]
Confidence: [HIGH|MEDIUM|LOW]
Fix:        [one-line suggestion]
Deduction:  -N pts
```

**Example:**
```
[HIGH] src/services/order.service.ts:45
Rule:       FUNCTION_LENGTH
Reason:     Function `processOrder` is 87 lines (threshold: 30)
Confidence: HIGH
Fix:        Extract payment logic to `processPayment()`, shipping to `scheduleShipment()`
Deduction:  -10 pts
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Retry Policy
```
Audit is read-only — no retry needed.
If file is inaccessible → skip and note in report as PARTIAL.
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Escalation Rules

```
BLOCKED: No target specified
Missing:
  - File path or module name to audit
Questions:
  1. Bạn muốn kiểm tra file nào hoặc toàn bộ module nào?
  2. Có ngưỡng cụ thể nào bạn muốn thay đổi không? (mặc định: 30 lines/function)
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
  "required_fields": ["target_files_or_module"],
  "optional_fields": ["custom_thresholds"]
}
```

### Produces
```json
{
  "to": "user",
  "output_fields": ["health_score", "violations_list", "severity_counts", "exit_code"]
}
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Output Format

```
⚙️ Engineering Standard Audit
─────────────────────────────────────────────────
Target:      [file or module]

Health Score: [X/100]
  CRITICAL violations: [N] (-Npts)
  HIGH violations:     [N] (-Npts)
  MEDIUM violations:   [N] (-Npts)
  LOW violations:      [N] (-Npts)

Violations (priority order):
  [SEVERITY] file:LINE — Rule — reason — Fix — (-Xpts)

Required Actions:
  1. [Most critical fix]
  2. [Second fix]

Exit Code:   [SUCCESS | PARTIAL | FAILED]
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Score ≥ 80, no CRITICAL | Code meets V7.5 standards |
| PARTIAL | Score 60–79 or incomplete scan | Some categories skipped |
| BLOCKED | No target specified | Cannot audit without scope |
| FAILED | Score < 60 or CRITICAL found | Immediate action required |

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## References
- Detailed thresholds with rationale: `references/thresholds.md`

---

