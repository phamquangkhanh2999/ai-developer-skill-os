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
├── sync-versions.js       # Legacy 10.2 rewrite tool; do not use for 10.3 upgrades
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

## V10.3 Key Principles

1. **Confidence Model**: Every routing decision has HIGH/MEDIUM/LOW confidence
2. **Exit Codes**: Every skill defines SUCCESS/PARTIAL/BLOCKED/FAILED
3. **Evidence Format**: Structured evidence with severity, confidence, fix suggestion
4. **Compliance**: Every skill has a compliance checklist; component versions are independent, runtime_version stays 1
5. **Zero Orphans**: All 11 skills connected in graph (Score 100/100)
6. **No Duplicate Systems**: Single skill system under `.agents/skills/` only

## Controlled orchestration

The target skill reads `.agents/rules/subagent-orchestration.md` before dispatch. Lead selects single-agent or parallel-read based on actual runtime tools, permissions, scope and independent work. Parallel-write requires user opt-in and a verified pilot.

Flow: scope/baseline → capability and ownership → assignment → execution → result/evidence verification → integration if needed → final checks. No new routing skill or graph dependency is introduced. Policy limits two active children and one level of nesting; it is behavioral guidance, not a runtime scheduler or permission enforcement layer.

Lead owns shared files/contracts, deduplicates findings and verifies the final tree. Tool failure/cancel/stale results retain their limitations and trigger fallback. The installer ships GEMINI.md and policy, backs up before overlay, preserves existing profile and unrelated custom files, and resolves global protocol paths.
