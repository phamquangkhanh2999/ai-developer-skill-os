# Learning Draft — Placeholder

This directory contains draft learnings created by AI agents or humans that have NOT yet been validated.

## How to add a draft learning

Create a new file: `YYYY-MM-[short-slug].md`

```markdown
---
claim: "..."
context: "When does this apply?"
lifecycle: draft
observed_by: agent | human
observed_date: YYYY-MM
related_skills: []
---

## Observation

What was observed?

## Why it matters

Why is this worth noting?

## Counter examples (if any)

When does this NOT apply?
```

## How to promote to validated

1. Fill the `evidence` field with links to issues/experiments
2. Human reviews and agrees
3. Move file to `validated/`
4. Git commit with `[validated]` in message
