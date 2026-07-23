# AI Developer Skill OS — V8 Architecture

## Request Flow

```
User / Calling Agent
        │
        ▼
   AGENTS.md               ← Entry point. Read this first.
        │
        ▼
 registry/skills-index.yml ← Find candidate skills by task keywords
        │
        ▼
  skills/qk-*/SKILL.md     ← Confirm intent, preconditions, complexity
        │
        ├── rules: [global, coding, safety]   ← Load relevant rules
        │
        ├── workflow: bug-resolution          ← Load execution pipeline
        │
        └── verification: strategy           ← Know how to verify
                │
                ▼
        Execute workflow steps
                │
                ▼
        Exit with: SUCCESS | BLOCKED | FAILED | PARTIAL
                │
                ▼
        learnings/ ← (human) Document lessons learned
```

---

## Domain Map

| Domain | Path | Question Answered | Owner |
|---|---|---|---|
| Rules | `.agents/rules/` | How should agent behave? | Architect |
| Workflows | `.agents/workflows/` | What sequence to follow? | Architect |
| Skills | `.agents/skills/` | What can agent do? | Skill author |
| Examples | `.agents/examples/` | What does good output look like? | Human |
| Learnings | `.agents/learnings/` | What lessons are validated? | Human |
| Registry | `.agents/registry/` | Which skill for this task? | Generated |

---

## Skill Anatomy (V8)

```
SKILL.md
├── frontmatter (YAML)
│   ├── Identity: name, version, description
│   ├── Classification: type, intent, triggers, complexity
│   ├── References: workflow, rules, tools, related_skills
│   ├── Verification: required, strategy
│   └── Runtime: execution_mode, token_budget, exit_codes
│
└── body (Markdown)
    ├── Preconditions
    ├── Scope (✅ does / ❌ does not)
    └── Output Format
```

The skill body contains **what** and **when**. The referenced **workflow** contains **how**.

---

## Retrieval Path (AI-Native)

When given a task, the agent MUST:

```
1. Read registry/skills-index.yml
   → triggers matching → candidate_skills[]

2. Read candidate SKILL.md(s)
   → confirm intent + preconditions met?
   → if BLOCKED: ask user for missing info

3. Load workflow YAML
   → understand step inputs/outputs

4. Load referenced rules (global.md always, coding.md if edit_files)

5. Execute step by step
   → each step: check inputs → execute → verify outputs

6. Exit with code + report
```

**Do NOT:**
- Load all 22 skills at once
- Read entire files without targeted grep first
- Proceed without verifying preconditions

---

## Knowledge Lifecycle

```
Observation (agent)
      ↓
Draft Learning (auto-created on FAILED exit)
      ↓
Human Review
      ↓
Validated Learning (human promotes with evidence)
      ↓
Referenced in Skill / Workflow
      ↓
Deprecated (when superseded by newer evidence)
```

---

## Versioning Summary

See [VERSIONING.md](./VERSIONING.md) for full policy.

| Change Type | Version Bump |
|---|---|
| Breaking schema change | Major (8.x.x → 9.0.0) |
| New skill / workflow | Minor (8.0.x → 8.1.0) |
| Fix typo / improve description | Patch (8.0.0 → 8.0.1) |

---

## File Conventions

| Pattern | Purpose |
|---|---|
| `_schema.yml` | Schema definition (not a skill/workflow) |
| `README.md` in empty dirs | Placeholder + instructions |
| `ADR-NNN-*.md` | Architecture Decision Record |
| `[validated]` in git message | Promotes draft learning to validated |
