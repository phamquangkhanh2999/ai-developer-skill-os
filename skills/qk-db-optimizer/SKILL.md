---
name: qk-db-optimizer
category: backend
version: 7.5.1
description: "Tối ưu Database dựa trên bằng chứng: EXPLAIN → phân tích → index/join — không đoán mò."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]
execution_mode: deterministic
cost: medium
latency: medium
risk: medium
side_effects: edit_files
produces: [code, report]
consumes: [query-log, source-code]
token_budget:
  max_files_read: 3
  max_lines_per_read: 100
  max_shell_commands: 2
  stop_early: true
exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

# qk-db-optimizer — Database Performance Tuner

> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.

---

## Preconditions
- [ ] Slow query log OR specific slow query is provided
- [ ] Database schema/ORM models accessible

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Cần: slow query log hoặc query cụ thể cần tối ưu."
```

---

## Scope
- ✅ Analyze EXPLAIN/query plans before adding indexes
- ✅ Solve N+1 with Data Loaders or explicit Joins
- ✅ Validate performance improvement

## Non-Goals
- ❌ Add indexes without slow query evidence
- ❌ Add overlapping or redundant indexes
- ❌ Optimize queries not shown in slow query log

---

## Priority Order
| P | Issue Type | Action | Skip Threshold |
|---|-----------|--------|----------------|
| P1 | Sequential scan on large table (> 10k rows) | Add composite index | Never |
| P2 | N+1 query pattern | Eager load / DataLoader | Budget < 30% |
| P3 | Missing JOIN (multiple queries for related data) | Rewrite with JOIN | Budget < 50% |
| P4 | SELECT * (over-fetching) | Select specific columns | Budget < 60% |

---

## EXPLAIN Decision Tree

```
Run EXPLAIN ANALYZE on slow query

IF "Seq Scan" on table > 10k rows
  → Check cardinality of filter column
  → IF cardinality > 100 → add B-tree index
  → IF low cardinality → add partial index or reconsider query

IF "Nested Loop" with many iterations
  → Check: is this N+1?
  → IF yes → rewrite as single JOIN or use DataLoader

IF "Sort" without index
  → Add index on ORDER BY column

IF index exists but not used ("Index Scan" missing)
  → Check: is WHERE clause using non-leading column of composite index?
  → Reorder composite index columns
```

---

## Workflow

### Phase 1 — Evidence Collection
1. Read slow query log or provided query
2. Run EXPLAIN ANALYZE (1 command) — or analyze ORM-generated SQL
3. Identify bottleneck pattern (seq scan / N+1 / sort / over-fetch)

### Phase 2 — Solution Design
1. Apply Decision Tree above
2. Design minimal index or query rewrite

### Phase 3 — Apply & Verify
1. Apply change (add index migration OR rewrite query via `replace_file_content`)
2. (Optional) Re-run EXPLAIN to verify improvement (2nd command)

**Decision:**
```
IF improvement verified → EXIT: SUCCESS
IF improvement not measurable → EXIT: PARTIAL, note "verify in production"
```

---

## Evidence Format
```
[SEVERITY] query in src/repositories/[name].ts:LINE
Pattern:    [SEQ_SCAN | N+1 | MISSING_JOIN | OVER_FETCH | UNUSED_INDEX]
Table:      [table_name] (~N rows estimated)
Confidence: HIGH
Fix:        [specific index or rewrite]
Estimated improvement: [X% reduction in scan rows]
```

---

## Exit Codes
| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Index added or query rewritten, improvement verified | Post-optimization |
| PARTIAL | Optimization applied but could not verify via EXPLAIN | DB access blocked |
| BLOCKED | Log not provided or DB engine unknown | Missing inputs |
| FAILED | Optimization breaks existing test or query syntax | Logic error |

---

## Confidence Model
| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | EXPLAIN plan shows SEQ SCAN, user confirms index is missing | Add index / rewrite |
| MEDIUM | Query looks inefficient but no EXPLAIN available | Ask to run EXPLAIN |
| LOW | "Make DB faster" with no slow query log | EXIT: BLOCKED |

---

## Severity
| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Query locking table in production | Long running UPDATE |
| HIGH | Missing index on frequently joined table | Full scan on million rows |
| MEDIUM | N+1 queries due to missing JOIN | ORM fetching relations in loop |
| LOW | Over-fetching columns | `SELECT *` instead of specific |

---

## Retry Policy
```
EXPLAIN query fails
  └─ Check SQL syntax error vs connection error
       ├─ Syntax error → correct SQL → retry EXPLAIN
       └─ Do NOT retry more than 1 time — risk of locking
```

---

## Escalation Rules
```
BLOCKED: Slow query log not provided
Missing:
  - The actual slow query SQL
  - Current schema of the involved tables
Questions:
  1. Câu query nào đang bị chậm? (Xin SQL / ORM log)
  2. Bảng này hiện đang có những index nào?
Recommended Assumptions:
  - Do NOT assume table size or indexes blindly
```

---

## Handoff Contract
### Consumes
```json
{
  "from": "user",
  "required_fields": ["slow_query"],
  "optional_fields": ["schema", "explain_plan", "db_engine"]
}
```
### Produces
```json
{
  "to": "user",
  "output_fields": ["optimized_query", "migration_file", "explain_diff", "exit_code"]
}
```

---


