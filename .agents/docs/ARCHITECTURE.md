# AI Developer Skill OS — Antigravity Architecture

## Scope

This package ships one supported agent runtime: Google Antigravity. The installer writes the Antigravity workspace configuration, the `.agents/` skill system, shared rules and generated skill registry. Other IDE wrappers and generic execution-pipeline tooling are not part of the supported runtime.

## Source of truth

`.agents/skills/**/SKILL.md` is the editable source for skill metadata. Registry files are generated and must not be edited by hand:

```bash
node tooling/build-registry.js
```

| File | Role |
|---|---|
| `.agents/AGENTS.md` | Antigravity skin entry point and task routing |
| `.agents/rules/*.md` | Shared and domain-specific behavior policies |
| `.agents/skills/*/SKILL.md` | Five core skills and the authoring template |
| `.agents/references/*.md` | On-demand domain guidance |
| `.agents/registry/index.yaml` | Generated skill lookup index |
| `.agents/registry/graph.json` | Generated dependency graph |
| `GEMINI.md` | Antigravity instruction adapter |
| `tooling/` | Registry generation, validation and installer support |

## Request flow

```text
User request
  → Antigravity loads GEMINI.md and .agents/AGENTS.md
  → entry point selects one of five core skills
  → selected skill loads only relevant rules/references
  → skill executes within user authorization and runtime permissions
  → lead verifies changes and reports evidence and limitations
```

## Subagent behavior

`.agents/rules/subagent-orchestration.md` is policy guidance, not a scheduler or permission-enforcement mechanism. A skill may delegate only when the active Antigravity runtime exposes a suitable tool and its actual arguments and permissions have been checked. If capability is unavailable or unclear, use the lead agent and report the limitation. Policy limits do not grant tools or override runtime/user permissions.

## Installation and upgrades

The installer targets Antigravity local or global configuration. It backs up managed targets before replacement, preserves user profile/custom files according to the managed-file manifest, and does not install adapters for other IDEs. Upgrade behavior is covered by isolated installer tests; this documentation does not imply the user's live Antigravity runtime was exercised.
