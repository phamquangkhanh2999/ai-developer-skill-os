---
# ── Identity ───────────────────────────────────────────────
name: qk-orchestrator
version: 8.0.0
status: stable
description: "Điều hướng yêu cầu của người dùng đến đúng skill với kỷ luật thép — kiểm tra preconditions và routing table."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: orchestrator

intent:
  - task-routing
  - skill-selection
  - precondition-checking

complexity:
  level: low
  criteria:
    files_affected: "1"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "which skill"
  - "what should i use"
  - "route this"
  - "help me choose"
  - "what skill for"
  - "help"
  - "list skills"
  - "what can you do"

selection:
  priority: high
  confidence_threshold: 0.80

# ── V8: References ─────────────────────────────────────────
workflow: research                  # Uses research workflow to understand request

rules:
  - global

tools:
  - filesystem

related_skills:
  - qk-context-loader

knowledge_scope:
  owns:
    - task-routing
    - skill-selection
    - precondition-validation
  references:
    - all-skills                    # References registry to make decisions

# ── V8: Verification ───────────────────────────────────────
verification:
  required: true
  strategy: review

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: low
latency: fast
risk: low
side_effects: none
produces: [plan]
consumes: [user-request]

token_budget:
  max_files_read: 1
  max_lines_per_read: 50
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-orchestrator — Request Routing

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.


## Preconditions
- [ ] User request is provided (any language)

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Vui lòng mô tả yêu cầu của bạn."
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Scope
- ✅ Analyze user intent and route to the correct skill
- ✅ Verify preconditions of target skill BEFORE delegating
- ✅ Enforce sequential pipeline when skills depend on each other

## Non-Goals
- ❌ Write code directly — delegate to specialist skills
- ❌ Hallucinate non-existent skills
- ❌ Allow UI work without `DESIGN.md` verified
- ❌ Allow logic work without context graph from `qk-context-loader`

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Priority Order

| Priority | Check | Skip Threshold |
|----------|-------|----------------|
| P1 | Match intent to routing table | Never |
| P2 | Verify target skill preconditions | Never |
| P3 | Check pipeline dependencies (e.g., context-loader first) | Never for logic tasks |
| P4 | Estimate cost/latency for user info | Budget < 70% |

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Workflow

### Phase 1 — Intent Classification

**Steps:**
1. Parse user request → extract intent keywords
2. Match against routing table (see `references/routing-table.md`)
3. Resolve to primary skill + pipeline order

**Decision:**
```
IF single clear match found
  → Confidence: HIGH → go to Phase 2

ELSE IF 2–3 possible matches
  → Pick highest-priority match
  → Confidence: MEDIUM → go to Phase 2, note ambiguity

ELSE IF no match
  → EXIT: BLOCKED — ask clarifying question
```

**Exit When:**
- Skill identified → go to Phase 2
- No matching skill → EXIT: BLOCKED

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

### Phase 2 — Precondition Check

**Steps:**
1. Read target skill's `Preconditions` section
2. Verify each precondition against current context

**Decision:**
```
IF all preconditions met
  → go to Phase 3

ELSE IF missing precondition is resolvable
  → Resolve it first (e.g., run qk-context-loader, find DESIGN.md)
  → Then go to Phase 3

ELSE
  → EXIT: BLOCKED
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

### Phase 3 — Pipeline Enforcement

**Steps:**
1. Check if target skill `consumes` output from another skill
2. If yes → ensure that upstream skill has run first
3. Delegate to target skill with full context

**Pipeline Rules:**
```
UI tasks:
  [DESIGN.md check] → [qk-ui-audit (optional)] → [qk-ui-builder | qk-feature-delivery]

Logic tasks:
  [qk-context-loader] → [qk-feature-delivery | qk-bug-resolution | qk-api-lifecycle]

Data tasks:
  [qk-context-loader] → [qk-data-lifecycle | qk-db-optimizer]

Release tasks:
  [qk-validation-gate] → [qk-production-release]
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Routing Table (Quick Reference)
Full table: see `references/routing-table.md`

| Intent Keywords | Primary Skill | Pipeline |
|----------------|---------------|----------|
| bug, lỗi, error, broken, crash, fix, sửa | `qk-bug-resolution` | direct |
| tính năng, feature, thêm, mới, add, implement | `qk-feature-delivery` | context-loader first |
| UI, giao diện, design, component, layout, màn hình | `qk-ui-builder` | DESIGN.md check |
| slow, query, index, N+1, performance DB | `qk-db-optimizer` | context-loader first |
| deploy, release, production, CI/CD, build | `qk-production-release` | validation-gate first |
| schema, migration, database, table, model | `qk-data-lifecycle` | context-loader first |
| refactor, clean, SOLID, DRY, code quality | `qk-engineering-standard` | direct |
| test, lint, validate, check quality | `qk-validation-gate` | direct |
| upgrade, update thư viện, migrate library | `qk-system-evolution` | direct |
| docs, documentation, README, comment | `qk-docs` | direct |
| API, endpoint, route, contract | `qk-api-lifecycle` | context-loader first |
| access, role, permission, RBAC, auth | `qk-access-policy` | direct |
| AI, prompt, RAG, LLM, embedding | `qk-ai-builder` | direct |
| design system, token, CSS variable | `qk-ui-system-builder` | DESIGN.md check |
| project audit, health, tech debt | `qk-project-health` | direct |
| new project, bootstrap, init | `qk-project-bootstrap` | direct |
| memory, context, recall, lưu | `qk-project-memory` | direct |

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Confidence Model

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | Single clear keyword match | Route directly |
| MEDIUM | Multiple possible skills | Route to most likely, note ambiguity |
| LOW | Request is too vague | Ask clarifying question |

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Escalation Rules

```
BLOCKED: Cannot determine correct skill
Missing:
  - More specific description of the task
Questions:
  1. Bạn muốn làm gì? (fix bug / thêm tính năng / tối ưu / deploy)
  2. File hoặc module nào bị ảnh hưởng?
Recommended Assumptions: none — routing requires clear intent
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Handoff Contract

### Consumes
```json
{
  "from": "user",
  "required_fields": ["request_text"],
  "optional_fields": ["affected_file", "context"]
}
```

### Produces
```json
{
  "to": "[target-skill]",
  "output_fields": ["routed_skill", "pipeline_order", "preconditions_verified", "exit_code"]
}
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Output Format

```
🧭 Orchestrator Routing
─────────────────────────────────────────────────
Intent:      [Classified intent]
Skill:       [qk-skill-name]
Pipeline:    [skill-a → skill-b → skill-c]
Confidence:  [HIGH | MEDIUM | LOW]

Preconditions:
  ✅ [Condition met]
  ✅ [Condition met]

Exit Code:   SUCCESS
```

skill_version: 7.5.0
runtime_version: 1
schema_version: 2
---

## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Skill routed, preconditions verified, delegation in progress | Normal flow |
| PARTIAL | Routed with MEDIUM confidence — ambiguity noted | Multi-match situation |
| BLOCKED | Cannot classify intent or precondition missing | Vague request or missing DESIGN.md |
| FAILED | No skill matches and cannot escalate | Unknown domain request |

---


