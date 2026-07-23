# Versioning Policy — AI Developer Skill OS V8

## Semantic Versioning: `MAJOR.MINOR.PATCH`

Current: `8.0.0`

---

## When to bump each segment

### MAJOR (8.x.x → 9.0.0)
Breaking changes that require skill/workflow authors to update their files.

```
✅ Examples:
- Removing or renaming a required frontmatter field
- Changing the schema of workflow steps (removing inputs/outputs)
- Changing exit_codes semantics
- Architecture restructure that changes file paths
```

**Gate:** Requires ADR + announcement. All existing skills must be migrated.

---

### MINOR (8.0.x → 8.1.0)
Backward-compatible additions.

```
✅ Examples:
- Adding a new skill
- Adding a new workflow
- Adding a new optional frontmatter field
- Adding a new rule to rules/
- Adding a new example or validated learning
```

**Gate:** No migration required. Existing skills remain valid.

---

### PATCH (8.0.0 → 8.0.1)
Backward-compatible fixes and improvements.

```
✅ Examples:
- Fixing a typo in SKILL.md body
- Improving description or explanation
- Adding an example to an existing skill
- Updating triggers list with additional keywords
- Fixing a broken link in docs
```

**Gate:** No review required. Direct commit.

---

## Who can bump versions?

| Type | Who | Process |
|---|---|---|
| MAJOR | Architect (human) | ADR + PR + migration plan |
| MINOR | Skill author | PR with description |
| PATCH | Anyone | Direct commit OK |

---

## Registry versioning

`registry/skills-index.yml` is a **generated file**. Its version tracks the knowledge system version, not the registry format.

It is regenerated whenever any SKILL.md is modified. **Never manually edit it.**

---

## Learning lifecycle versioning

Learnings do not follow semver. They follow a lifecycle:

```
draft/ → validated/ → deprecated/
```

- `draft/`: Created automatically or by human. Not yet reviewed.
- `validated/`: Requires human commit with `[validated]` in message + evidence field filled.
- `deprecated/`: Superseded by newer evidence. Keep for historical reference.
