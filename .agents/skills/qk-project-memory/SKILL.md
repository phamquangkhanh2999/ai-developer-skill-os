---
name: qk-project-memory
category: core
version: 7.5.0
description: "Lưu trữ và truy xuất ngữ cảnh dự án dài hạn — chỉ lưu fact đã xác minh, không lưu giả thuyết."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]
execution_mode: deterministic
cost: low
latency: fast
risk: low
side_effects: edit_files
produces: [plan]
consumes: [source-code, context-graph]
token_budget:
  max_files_read: 2
  max_lines_per_read: 100
  max_shell_commands: 0
  stop_early: true
exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

# qk-project-memory — Long-Term Context Store

> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.

---

## Preconditions
- [ ] Project has a `.agents/memory/` directory OR user confirms creation

---

## Scope
- ✅ Store verified facts about project (architecture, decisions, patterns)
- ✅ Retrieve facts for current session context
- ✅ Invalidate stale entries when code changes

## Non-Goals
- ❌ Store assumptions or unverified hypotheses
- ❌ Overwrite architectural rules without explicit user consent
- ❌ Store sensitive data (env vars, secrets)

---

## Memory Schema (Required Format)

```json
{
  "id": "mem_[timestamp]",
  "category": "architecture|pattern|decision|warning|preference",
  "fact": "[Verified, specific statement]",
  "evidence": "path/to/file.ts:LINE",
  "confidence": "HIGH|MEDIUM",
  "created_at": "ISO8601",
  "expires_at": "ISO8601 OR null (permanent)",
  "tags": ["auth", "database", "api"]
}
```

---

## Storage Path
```
.agents/memory/
├── architecture.json    # System architecture facts
├── patterns.json        # Established code patterns
├── decisions.json       # Technical decisions made
└── warnings.json        # Known risks or debt items
```

---

## [MEMORIZE] Workflow
1. Verify fact against actual codebase (grep_search or view_file)
2. Confirm confidence is HIGH or MEDIUM
3. Write to appropriate `.agents/memory/[category].json` file

**Decision:** `IF confidence is LOW → do NOT store — collect more evidence`

## [RECALL] Workflow
1. Read relevant memory file
2. Check `expires_at` — skip stale entries
3. Return matching facts with their evidence references

---

## Exit Codes
| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Fact stored/retrieved with verified evidence | HIGH/MEDIUM confidence |
| PARTIAL | Fact stored but evidence is indirect (MEDIUM confidence) | Indirect source |
| BLOCKED | Cannot verify fact against codebase | No evidence available |
| FAILED | Memory file corrupted or schema mismatch | Structural error |

---

## Confidence Model
| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Fact directly read from code (grep_search returned file:line) | Store immediately |
| MEDIUM | Fact inferred from patterns (not direct file reference) | Store with note: "inferred" |
| LOW | Assumption without code evidence | Do NOT store — collect more evidence first |

---

## Severity
| Level | Definition | Example |
|-------|-----------|----------|
| CRITICAL | Storing incorrect architectural fact misleads all future work | Wrong auth pattern stored |
| HIGH | Storing stale fact that conflicts with current code | Outdated API path remembered |
| MEDIUM | Missing important fact causing repeated re-discovery | Auth pattern unknown |
| LOW | Memory file not organized by category | All facts in one file |

---

## Evidence Format
```
[CONFIDENCE] path/to/file.ts:LINE
Fact:       [what was stored]
Category:   [architecture|pattern|decision|warning|preference]
Expires:    [ISO8601 date | null]
```

---

## Retry Policy
```
Fact unverifiable
  └─ Read 1 more file for evidence
       ├─ Evidence found → upgrade to MEDIUM/HIGH → store
       └─ Still unverifiable → do NOT store
            └─ Do NOT retry more than 1 additional evidence read
```

---

## Escalation Rules
```
BLOCKED: Cannot verify fact against codebase
Missing:
  - Access to relevant source file
  - Or explicit user confirmation
Questions:
  1. Bạn có thể xác nhận: [fact statement] là đúng không?
Recommended Assumptions:
  - Do NOT store until confirmed
```

---

## Handoff Contract
### Consumes
```json
{
  "from": "user or any skill",
  "required_fields": ["fact_statement"],
  "optional_fields": ["evidence_location", "expiry_date", "category"]
}
```
### Produces
```json
{
  "to": "any downstream skill",
  "output_fields": ["recalled_facts", "confidence_levels", "evidence_refs", "exit_code"]
}
```

---

