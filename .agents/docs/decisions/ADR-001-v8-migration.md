# ADR-001: V8 Architecture Migration Strategy

**Date:** 2026-07  
**Status:** Accepted  
**Deciders:** Quang Khánh

---

## Context

V7 (7.5.1) had 22 skills, each a monolithic SKILL.md containing:
- Routing logic
- Execution workflow
- Verification steps
- Rules and policies

This made skills hard to reuse, workflows inconsistent across skills, and AI agents often confused about which skill to choose.

---

## Decision

Migrate to V8 **Agent Knowledge System** using **Structured Monolith** approach:

1. **Keep skills** — don't split SKILL.md into multiple files
2. **Add schema** — new frontmatter fields (intent, triggers, workflow ref, verification)
3. **Extract workflows** — move execution pipelines to shared `workflows/*.yml`
4. **Extract rules** — move global policies to `rules/*.md`
5. **Add registry** — generated `registry/skills-index.yml` for AI retrieval

---

## Rationale

**Why not split SKILL.md into separate files?**  
- Migration cost too high (22 skills × 4 extractions = 88 operations)
- Risk of losing embedded knowledge in the split
- Structured Monolith achieves the same retrieval benefit via references

**Why pilot 5 skills first?**  
- Schema may need adjustment based on real agent behavior
- Safer to validate on 5 before committing to 22

**Why keep git history instead of `archive/` folder?**  
- V7.5.1 tagged at git → complete history available
- Archive folder in repo creates noise for AI agents
- Clean break is cleaner than carrying historical artifacts

---

## Consequences

- ✅ Workflows are now reusable (shared across skills)
- ✅ AI retrieval is faster (registry index)
- ✅ Rules are explicit and non-duplicated
- ✅ Verification is mandatory and standardized
- ⚠️ New schema requires migration of all 22 skills (3 weeks)
- ⚠️ `skills.json` is now generated, not authoritative
