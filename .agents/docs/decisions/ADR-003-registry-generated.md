# ADR-003: Registry as Generated Artifact

**Date:** 2026-07  
**Status:** Accepted

---

## Context

V7 had `skills.json` as the primary manifest — manually maintained, often drifting from actual SKILL.md content. This created two sources of truth.

V8 needs a retrieval index for AI agents to find the right skill without reading all 22 SKILL.md files.

---

## Decision

`registry/skills-index.yml` is a **generated file**. It is produced by `tooling/generate-registry.js` by reading all `SKILL.md` frontmatter.

`SKILL.md` is the single source of truth. The registry is a derivative.

```
SKILL.md (source of truth)
    ↓
tooling/generate-registry.js
    ↓
registry/skills-index.yml (DO NOT EDIT MANUALLY)
```

`skills.json` is kept as a compatibility manifest for platforms that expect it (e.g., Antigravity v7 convention). It is also generated, not manually maintained.

---

## Rationale

**Why not edit the registry manually?**  
- Two sources of truth always drift
- Triggers, intent, complexity are already defined in SKILL.md
- Generator can be run as a pre-commit hook or on demand

**Why keep skills.json?**  
- Antigravity and some platforms discover skills via `skills.json`
- Backward compatibility for v7 skill consumers
- It's generated, so no maintenance burden

---

## Consequences

- ✅ Single source of truth: SKILL.md
- ✅ No drift between skill and registry
- ✅ Registry update is automatic when skills are updated
- ⚠️ Requires running generator after any SKILL.md change
- ⚠️ If generator is not run, registry may be stale (mitigated by pre-commit hook)
