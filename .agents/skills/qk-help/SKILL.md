---
# ── Identity ───────────────────────────────────────────────
name: qk-help
version: 8.0.0
status: stable
description: "Hiển thị danh sách skills V8 và hướng dẫn dùng lệnh ./qk-[skill-name]."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

# ── V8: Classification ─────────────────────────────────────
type: capability

intent:
  - skill-discovery
  - command-help

complexity:
  level: low
  criteria:
    files_affected: "1"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - "help"
  - "có những skill nào"
  - "danh sách skill"
  - "làm sao để dùng"
  - "qk-help"

# ── V8: References ─────────────────────────────────────────
workflow: internal

rules:
  - global

tools:
  - filesystem
  - terminal

related_skills:
  - qk-orchestrator

knowledge_scope:
  owns:
    - skill-directory
  references:
    - registry

# ── V8: Verification ───────────────────────────────────────
verification:
  required: false
  strategy: none

selection:
  priority: low
  confidence_threshold: 0.75

examples: []
learnings: []

# ── V7 Runtime ─────────────────────────────────────────────
execution_mode: deterministic
cost: low
latency: fast
risk: low
side_effects: none
produces: [skill-recommendation]
consumes: [registry]

token_budget:
  max_files_read: 1
  max_lines_per_read: 150
  max_shell_commands: 0
  stop_early: true

exit_codes: [SUCCESS]
---

# qk-help — Skill Directory V7.5

> **Language rule:** Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

When triggered, display this reference and exit with SUCCESS.

---

## Scope
- ✅ Display available skills and their purposes
- ✅ Show common pipelines and best practices
- ✅ Provide quick reference for skill commands

## Non-Goals
- ❌ Execute any skill — only display information
- ❌ Modify project files or configuration
- ❌ Answer questions outside the skill system

---

## Preconditions
- [ ] User requests help or list of skills

```
On missing precondition:
  EXIT: BLOCKED
  Message: "Vui lòng hỏi trợ giúp hoặc liệt kê skills."
```

---

## Scope
- ✅ Display available skills and their purposes
- ✅ Show common pipelines and best practices
- ✅ Provide quick reference for skill commands

## Non-Goals
- ❌ Execute any skill — only display information
- ❌ Modify project files or configuration
- ❌ Answer questions outside the skill system

---

## Priority Order

| Priority | Task | Skip Threshold |
|----------|------|----------------|
| P1 | List all available skills | Never |
| P2 | Show common pipelines | Never |
| P3 | Provide usage examples | Never |

---

## Workflow

### Phase 1 — Display Skills

**Steps:**
1. Read `.agents/registry/skills-index.yml` to get active skill list
2. Format as table: Command | Purpose | Cost
3. Display common pipelines

**Exit When:**
- Help displayed → EXIT: SUCCESS

---

## Confidence Model

| Level | Condition | Action |
|-------|-----------|--------|
| HIGH | .agents/registry/skills-index.yml readable | Display directly |
| MEDIUM | .agents/registry/skills-index.yml partially readable | Display what's available |
| LOW | Cannot access .agents/registry/skills-index.yml | EXIT: BLOCKED |

---

## Severity

| Level | Definition | Example |
|-------|-----------|---------|
| CRITICAL | N/A — this skill is read-only | — |
| HIGH | N/A — this skill is read-only | — |
| MEDIUM | N/A — this skill is read-only | — |
| LOW | N/A — this skill is read-only | — |

---

## Evidence Format

```
[INFO] qk-help
Message: [help content displayed]
Confidence: HIGH
```

---

## Retry Policy

```
Display fails
  └─ Check if .agents/registry/skills-index.yml is accessible
       ├─ Accessible → retry display
       └─ Not accessible → EXIT: BLOCKED
```

---

## Escalation Rules

```
BLOCKED: Cannot access .agents/registry/skills-index.yml
Missing:
  - .agents/registry/skills-index.yml file
Questions:
  1. Bạn cần hỗ trợ gì? (liệt kê skills / hướng dẫn dùng)
```

---

## Handoff Contract

### Consumes
```json
{
  "from": "user",
  "required_fields": ["help_request"],
  "optional_fields": ["specific_skill"]
}
```

### Produces
```json
{
  "to": "user",
  "output_fields": ["skill_list", "pipelines", "usage_examples"],
  "exit_code": "SUCCESS"
}
```

---

## Output Format

```
📚 Help — Available Skills
─────────────────────────────────────────────────
[table of skills]

Common Pipelines:
[common workflows]

Exit Code: SUCCESS
```

---

## Exit Codes

| Code | Meaning | When |
|------|---------|------|
| SUCCESS | Help displayed successfully | Normal completion |
| BLOCKED | Cannot access .agents/registry/skills-index.yml | Setup required |

---
