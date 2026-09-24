# ADR-002: Workflow Separation from Skills

**Date:** 2026-07  
**Status:** Accepted

---

## Context

In V7, each SKILL.md contained its own workflow embedded in the body. This meant:
- Workflow for bug-fixing existed in `qk-bug-resolution/SKILL.md`
- Similar steps were duplicated across multiple skills
- No way to reuse or compose workflows

---

## Decision

Extract workflows into dedicated `workflows/*.yml` files. Skills reference workflows by name:

```yaml
# In SKILL.md frontmatter:
workflow: bug-resolution  # → workflows/bug-resolution.yml
```

Each workflow step MUST define `inputs` and `outputs` (not just `actions`) so agents understand what a step achieves, not just how to do it.

---

## Rationale

**Why YAML instead of Markdown?**  
- Machine-readable: easier for agents to parse step inputs/outputs
- Structured: enforces schema compliance
- If found to be too rigid, can switch to Markdown+frontmatter without breaking skill references

**Why inputs/outputs per step?**  
- Agents need to know WHAT each step achieves, not just HOW
- Enables future: step skipping based on already-available outputs
- Better debugging: "step X failed because output Y was not produced"

---

## Consequences

- ✅ Workflows are reusable across skills
- ✅ Each step has clear contract (inputs → outputs)
- ✅ Easier to add new skills that reuse existing workflows
- ⚠️ YAML can be verbose — acceptable tradeoff for clarity
- ⚠️ If workflow changes, all referencing skills remain valid (they only reference by name)
