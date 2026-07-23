---
# ── Identity ───────────────────────────────────────────────
name: qk-data-lifecycle
version: 8.0.0
status: stable
description: "Quản lý Schema, Migrations an toàn — schema freeze → backward-compat migration → cleanup."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability

intent:
  - schema-management
  - database-migration

complexity:
  level: high
  criteria:
    files_affected: "1-5"
    has_behavior_change: true
    has_external_dependency: true
    has_breaking_change: false

triggers:
  - "sửa schema"
  - "cập nhật database"
  - "tạo migration"
  - "đổi model"

# ── V8: References ─────────────────────────────────────────
workflow: feature-delivery

rules:
  - global
  - coding

tools:
  - filesystem
  - terminal

related_skills:
  - qk-db-optimizer

knowledge_scope:
  owns:
    - schema
    - migrations
  references:
    - architecture

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: migration-safety

selection:
  priority: high
  confidence_threshold: 0.85

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: high
latency: slow
risk: high
side_effects: edit_files
produces: [code, schema]
consumes: [context-graph, user-description]

token_budget:
  max_files_read: 4
  max_lines_per_read: 100
  max_shell_commands: 1
  stop_early: false

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-data-lifecycle — Database Schema & Repository Manager

> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.

---

## Preconditions
- [ ] Existing schema is identified (ORM model files)
- [ ] Change intent is clear (add field / modify field / drop field)

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Cần xác định: schema hiện tại + loại thay đổi (add/modify/drop)."
```

---

## Scope
- ✅ Define strict schema BEFORE writing repository code
- ✅ Always backward-compatible migrations (never destructive in first pass)
- ✅ Separate schema (models) from business logic (services)

## Non-Goals
- ❌ DROP columns without deprecation phase first
- ❌ Write complex business logic inside repositories
- ❌ Dynamic queries without schema definitions

---

## Priority Order
| P | Task | Skip Threshold |
|---|------|----------------|
| P1 | Read existing schema | Never |
| P2 | Design migration (backward-compat) | Never |
| P3 | Write migration file | Never |
| P4 | Update repository layer | Budget < 30% |
| P5 | Update affected service layer | Budget < 50% |

---

## Migration Safety Rules
```yaml
add_column:
  strategy: nullable OR has default value (never NOT NULL without default)
  
modify_column:
  strategy: add new column → migrate data → drop old column (3-phase)
  
drop_column:
  strategy: Phase 1 — mark deprecated (keep in schema)
            Phase 2 — next release — remove from queries
            Phase 3 — next migration — DROP COLUMN

rename_table:
  strategy: create new table → migrate → drop old (never ALTER TABLE RENAME in prod)
```

---

## Workflow

### Phase 1 — Schema Read
1. `grep_search` for existing model/entity file
2. Read current schema (targeted, ≤ 100 lines)
3. Identify impact of proposed change

### Phase 2 — Migration Design
1. Choose safety strategy (see Migration Safety Rules)
2. Write migration file (up + down)
3. Verify down() is always defined (rollback support)

### Phase 3 — Repository Update
1. Update repository methods to use new schema
2. Verify no raw queries reference old column names

**Decision:**
```
IF migration is backward-compat AND down() defined → EXIT: SUCCESS
ELSE IF destructive migration attempted → EXIT: BLOCKED — apply 3-phase strategy
```

---

## Evidence Format
```
[SEVERITY] migration: [filename]
Issue:      [NOT NULL without default | missing down() | direct DROP]
Confidence: HIGH
Fix:        [specific safer strategy]
```

---

## Exit Codes
| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Schema, migration, and repository complete | Validated execution |
| PARTIAL | Migration generated but untested | Missing DB connection |
| BLOCKED | Fields or relationships ambiguous | Missing entity data |
| FAILED | Migration involves destructive DROP without backup | Architecture violation |

---

## Confidence Model
| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Entity schema completely defined by user | Implement immediately |
| MEDIUM | Schema inferred from JSON or forms | Ask for review before generating migration |
| LOW | "Add database" request with no schema | EXIT: BLOCKED |

---

## Severity
| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | Data loss risk in migration | Direct `DROP TABLE` without data copy |
| HIGH | Missing index on foreign key | Performance degrade on JOIN |
| MEDIUM | N+1 query vulnerability in repository | Fetching related entities in a loop |
| LOW | Naming convention violation | `userId` instead of `user_id` in DB |

---

## Retry Policy
```
Migration generation fails
  └─ Syntax error in SQL/ORM
       ├─ Fix syntax based on engine (Postgres/MySQL)
       └─ Do NOT retry more than 1 time — risk of bad migration state
```

---

## Escalation Rules
```
BLOCKED: Entity schema undefined
Missing:
  - List of fields (types, constraints)
  - Relationships (1:1, 1:N, M:N)
Questions:
  1. Bảng này cần lưu những trường dữ liệu nào?
  2. Bảng này có liên kết với bảng nào khác không? (ví dụ User)
Recommended Assumptions:
  - Add standard created_at, updated_at timestamps
  - UUID primary keys
```

---

## Handoff Contract
### Consumes
```json
{
  "from": "user",
  "required_fields": ["entity_name", "fields"],
  "optional_fields": ["relationships", "db_engine"]
}
```
### Produces
```json
{
  "to": "user or db-optimizer",
  "output_fields": ["schema_file", "migration_file", "repository_file", "exit_code"]
}
```

---

