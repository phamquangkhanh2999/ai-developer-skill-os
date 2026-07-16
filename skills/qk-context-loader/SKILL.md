---
name: qk-context-loader
category: utilities
version: 7.5.1
description: "Tải context và vẽ dependency graph chính xác trước khi code — ngăn hallucination kiến trúc."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]
execution_mode: deterministic

cost: low
latency: fast
risk: low
side_effects: read_only
produces: [context-graph]
consumes: [source-code]

token_budget:
  max_files_read: 5
  max_lines_per_read: 100
  max_shell_commands: 1
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

# qk-context-loader — Dependency Graph Builder

> **Language rule:** Code, identifiers, file names ? English. Explanations, summaries ? Vietnamese.

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

## Preconditions
- [ ] Entry point file or module name is specified
- [ ] Repository is accessible

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Vui lòng chỉ định entry point (file hoặc module cần map)."
```

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

## Scope
- ✅ Trace imports/exports from entry point
- ✅ Build topological dependency graph (max depth 3)
- ✅ Identify risk level per module

## Non-Goals
- ❌ Modify any code
- ❌ Load `node_modules` or vendor directories
- ❌ Guess file names — only follow explicit imports
- ❌ Load entire repo (max 5 files)

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

## Priority Order

| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1 | Trace direct imports of entry point | Never |
| P2 | Trace 2nd-level dependencies | Budget < 40% |
| P3 | Identify shared/risky modules | Budget < 60% |
| P4 | Annotate with risk levels | Budget < 70% |

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

## Workflow

### Phase 1 — Entry Point Analysis

**Steps:**
1. `grep_search` — search for import/export statements in entry file
2. `view_file[StartLine:EndLine]` — read import block only (first ~30 lines)
3. List direct dependencies

**Decision:**
```
IF entry file found and imports readable
  → go to Phase 2

ELSE IF entry file not found
  → EXIT: BLOCKED — ask for correct path
```

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

### Phase 2 — Graph Traversal (Max Depth 3)

**Steps:**
1. For each direct dependency → `grep_search` for its imports
2. Build adjacency list: `{ file → [imports] }`
3. Stop at depth 3 OR max_files_read reached

**Decision:**
```
IF depth 3 reached OR max_files_read (5) hit
  → EXIT: PARTIAL — note graph is truncated at depth N

IF circular dependency detected
  → Flag as [HIGH RISK] in output
  → Continue building rest of graph
```

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

### Phase 3 — Risk Assessment & Output

**Steps:**
1. Identify: shared modules (imported by 3+ files) = HIGH risk to change
2. Identify: entry points with many dependents = CRITICAL to change carefully
3. Generate graph in standard JSON + Markdown format

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

## Output Format (Mandatory Schema)

```json
{
  "entry": "src/modules/auth/auth.service.ts",
  "depth_reached": 3,
  "truncated": false,
  "nodes": [
    {
      "file": "src/modules/auth/auth.service.ts",
      "imports": ["src/common/jwt.util.ts", "src/users/users.repository.ts"],
      "exports": ["AuthService"],
      "risk_level": "high",
      "imported_by_count": 4
    }
  ],
  "risks": [
    {
      "file": "src/common/jwt.util.ts",
      "reason": "Imported by 6 modules — changes here have wide blast radius",
      "risk_level": "critical"
    }
  ]
}
```

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

## Evidence Format

```
[RISK] path/to/file.ts
Reason:     [why this file is risky to change]
Imported by: [N files]
Exports:    [key exports]
```

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

## Handoff Contract

### Consumes
```json
{
  "from": "user or qk-orchestrator",
  "required_fields": ["entry_point"],
  "optional_fields": ["max_depth", "exclude_patterns"]
}
```

### Produces
```json
{
  "to": "qk-feature-delivery | qk-bug-resolution | qk-data-lifecycle | qk-api-lifecycle",
  "output_fields": ["dependency_graph_json", "risk_summary", "exit_code"]
}
```

skill_version: 7.5.1
runtime_version: 1
schema_version: 2
---

## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Full graph built within depth limit | All imports traced |
| PARTIAL | Graph truncated at token/depth limit | Note where it was cut |
| BLOCKED | Entry point not found or inaccessible | Ask for correct path |
| FAILED | Cannot determine architecture (circular imports, obfuscated code) | Report and escalate |

---


