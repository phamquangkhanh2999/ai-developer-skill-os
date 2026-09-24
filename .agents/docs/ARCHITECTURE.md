# AI Developer Skill OS — V10 Architecture

## Source of Truth

> [!IMPORTANT]
> The **only** editable skill metadata source is: `.agents/skills/**/SKILL.md`
>
> All other manifests are **generated artifacts** — manual modification is prohibited.

| File | Editable? | Generated from |
|---|---|---|
| `.agents/skills/*/SKILL.md` | ✅ YES | — (source) |
| `.agents/registry/index.yaml` | ❌ NO | `node tooling/build-registry.js` |
| `.agents/registry/graph.json` | ❌ NO | `node tooling/build-registry.js` |

Regenerate after any SKILL.md change:
```bash
node tooling/build-registry.js
```

---

## Directory Structure

```
.agents/
├── AGENTS.md              # Master configuration for all AI coding agents
├── DEV_PROFILE.md         # Developer role + stack profile
├── rules/                 # Behavior policies (global, coding, security, safety...)
├── skills/                # 11 Super-Skills + _template
│   ├── qk-orchestrator/
│   ├── qk-prompt-compiler/
│   ├── qk-product-spec/
│   ├── qk-feature-delivery/
│   ├── qk-bug-resolution/
│   ├── qk-code-cleaner/
│   ├── qk-code-review/
│   ├── qk-ui-engineer/
│   ├── qk-backend-data/
│   ├── qk-devops-release/
│   ├── qk-api-data-discovery/
│   └── _template/
├── workflows/             # 12 execution pipelines (YAML)
│   ├── shared/
│   └── *_workflow*.yml
├── registry/              # Generated runtime artifacts
│   ├── index.yaml         # Lightweight lookup
│   └── graph.json         # O(1) adjacency graph
├── docs/                  # Architecture documentation
└── knowledge/             # Design intelligence patterns & templates

tooling/
├── build-registry.js      # Generate index.yaml + graph.json
├── validate-skills.js     # Validate all SKILL.md files
├── validate-graph.js      # Validate graph integrity
├── sync-versions.js       # Sync version across all files
└── run-aar.js             # Run after-action review
```

---

## Request Flow

```
User / Calling Agent
        │
        ▼
   AGENTS.md               ← Entry point. Read this first.
        │
        ▼
   qk-orchestrator         ← Route to correct Super-Skill
        │
        ▼
   [Target Super-Skill]    ← Execute with Role Adaptation
        │
        ▼
   Evidence Gate           ← Verify CLAIM <= EVIDENCE
        │
        ▼
   Exit Code               ← SUCCESS | PARTIAL | BLOCKED | FAILED
```

---

## V10.2 Key Principles

1. **Confidence Model**: Every routing decision has HIGH/MEDIUM/LOW confidence
2. **Exit Codes**: Every skill defines SUCCESS/PARTIAL/BLOCKED/FAILED
3. **Evidence Format**: Structured evidence with severity, confidence, fix suggestion
4. **Compliance**: Every skill has a compliance checklist with schema_version 10.2.0
5. **Zero Orphans**: All 11 skills connected in graph (Score 100/100)
6. **No Duplicate Systems**: Single skill system under `.agents/skills/` only
