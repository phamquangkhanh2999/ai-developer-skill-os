---
name: qk-project-health
category: qa
version: 7.5.0
description: "Kiểm toán toàn diện Code Smells, Tech Debt, Architecture — health score 0–100 với actionable roadmap."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]
execution_mode: deterministic
cost: high
latency: slow
risk: low
side_effects: read_only
produces: [report]
consumes: [source-code]
token_budget:
  max_files_read: 5
  max_lines_per_read: 100
  max_shell_commands: 1
  stop_early: true
exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

# qk-project-health — Complete Codebase Audit

> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.

---

## Preconditions
- [ ] Project root is accessible

---

## Scope
- ✅ Score 5 health dimensions (0–20 pts each = 100 total)
- ✅ Identify deprecated packages and security vulnerabilities
- ✅ Produce actionable refactoring roadmap

## Non-Goals
- ❌ Fix issues — report only
- ❌ Hide systemic architectural flaws

---

## Health Scoring System

| Dimension | Max Points | Key Checks |
|-----------|-----------|------------|
| Security | 20 | 0 critical CVEs, no hardcoded secrets, auth guards present |
| Code Quality | 20 | Functions ≤ 30L, complexity ≤ 10, no God Files |
| Architecture | 20 | Clean layers (UI/Logic/Data separated), no circular imports |
| Dependencies | 20 | No deprecated packages, no unused deps, versions pinned |
| Documentation | 20 | README complete, public APIs documented, DESIGN.md exists |

**Total: 100 pts. Grades: A (90+) / B (75-89) / C (60-74) / D (<60)**

---

## Priority Order
| P | Dimension | Never Skip? |
|---|-----------|-------------|
| P1 | Security | Yes |
| P2 | Code Quality | Yes |
| P3 | Architecture | Budget < 30% |
| P4 | Dependencies | Budget < 50% |
| P5 | Documentation | Budget < 60% |

---

## Workflow

### Phase 1 — Quick Scan (P1+P2)
1. `grep_search` for: hardcoded secrets, `eval(`, `any` types, `console.log`
2. Sample 3 key files → check function lengths, file sizes
3. Score Security (0–20) + Code Quality (0–20)

### Phase 2 — Structure Scan (P3+P4)
1. Read `package.json` — check outdated/deprecated packages
2. Check import patterns for circular dependencies or layer violations
3. Score Architecture (0–20) + Dependencies (0–20)

### Phase 3 — Docs Scan (P5) + Report
1. Check README, DESIGN.md, key function JSDoc
2. Score Documentation (0–20)
3. Generate full report + prioritized roadmap

---

## Evidence Format
```
[SEVERITY] Dimension: [SECURITY|QUALITY|ARCH|DEPS|DOCS]
Finding:    [specific issue]
Location:   [file:line OR package name]
Confidence: HIGH
Impact:     -N pts
Fix:        [actionable suggestion]
```

---

## Output Format
```
🏥 Project Health Report
─────────────────────────────────────────────────
Grade: [A|B|C|D] ([Score]/100)

Scores:
  Security:      [N/20]
  Code Quality:  [N/20]
  Architecture:  [N/20]
  Dependencies:  [N/20]
  Documentation: [N/20]

Critical Issues (fix immediately):
  [list CRITICAL findings]

Refactoring Roadmap (priority order):
  1. [Most impactful — estimated effort]
  2. [Second — estimated effort]
  3. [Third]

Exit Code: [SUCCESS (A/B) | PARTIAL (C) | FAILED (D)]
```

---

## Exit Codes
| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Audit completed and report generated with scores | Normal completion |
| PARTIAL | Audit completed but some directories skipped (token limit) | Large project |
| BLOCKED | Project is empty or completely unreadable | Missing project |
| FAILED | Cannot calculate score due to tool failure | Linter crashed |

---

## Confidence Model
| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Analyzed via AST, linters, or exhaustive search | Include in report as fact |
| MEDIUM | Sampled a few files, assumed pattern holds | Note as "Project trend" |
| LOW | Did not check | Do NOT include in report |

---

## Severity
| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Security flaw or completely broken architecture | API keys committed, cyclical dependency |
| HIGH | Major tech debt slowing down development | God objects, missing tests on core logic |
| MEDIUM | Inconsistent patterns | Mixing fetch/axios, tabs/spaces |
| LOW | Minor code smell | Magic numbers in UI |

---

## Retry Policy
```
Audit fails
  └─ Token limit hit (project too large)
       ├─ Ask user to narrow scope (e.g., audit only src/api/)
       └─ Do NOT auto-retry full project scan
```

---

## Escalation Rules
```
BLOCKED: Project unreadable or empty
Missing:
  - Source code
Questions:
  1. Thư mục mã nguồn chính nằm ở đâu? (ví dụ: src/, lib/)
Recommended Assumptions:
  - Scan typical directories (src, app, lib, test)
```

---

## Handoff Contract
### Consumes
```json
{
  "from": "user",
  "required_fields": [],
  "optional_fields": ["target_directory"]
}
```
### Produces
```json
{
  "to": "user or qk-system-evolution",
  "output_fields": ["health_score", "critical_issues", "refactoring_roadmap", "exit_code"]
}
```

---

