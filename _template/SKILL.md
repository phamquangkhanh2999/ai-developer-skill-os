---
name: <skill-name>
description: >-
  <1-3 lines in English. This is used for trigger matching across all AI agents.
  Be specific and action-oriented. Avoid vague words.>
version: 1.0.0
category: engineering | frontend | backend
tags: [tag1, tag2, tag3]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
---

# <Skill Name>

> **Language rule:**
> Use **English** for: code, identifiers, file names, architecture terms, technical decisions.
> Use **the user's language** for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

When to activate this skill. List specific conditions, user intents, and keywords.

Examples:
- User says "create a new page"
- User provides a UI mockup or wireframe
- User asks to "build", "design", or "implement" a screen

---

## Scope

What this skill is responsible for. Be explicit.

- ✅ [What it covers]
- ✅ [What it covers]

---

## Non-goals

What this skill must NOT do. This prevents scope creep.

- ❌ Do NOT [action A]
- ❌ Do NOT [action B]
- ❌ Do NOT make changes beyond the stated task

---

## Severity Levels

All findings, issues, and risks use this shared scale:

| Level | Label | Meaning |
|-------|-------|---------|
| P0 | Critical | Must fix before any other work |
| P1 | High | Fix in current session |
| P2 | Medium | Schedule soon |
| P3 | Low | Technical debt — fix when possible |

---

## Workflow

### Phase 1 — <Discovery / Analysis>

What to analyze, read, or understand first.

- Read: [files / folders / configs]
- Detect: [patterns / issues / context]
- Output: [brief summary of findings]

---

### Phase 2 — <Planning>

Before writing any code, produce a plan.

- List what will change and why
- Identify risks or conflicts
- Confirm with user if scope is unclear

---

### Phase 3 — <Execution>

Apply changes following the plan.

Rules:
- Smallest safe change
- Preserve existing behavior unless explicitly changing it
- Follow project conventions (naming, structure, style)
- Do not introduce unnecessary dependencies

---

### Phase 4 — <Validation>

Verify the output before finishing.

- [ ] Does it match the requirement?
- [ ] Are edge cases handled?
- [ ] No regressions introduced?
- [ ] Output format is complete?

---

## Decision Tree

Use this to handle branching logic during execution:

```
Condition A?
  ├── Yes → Action X
  └── No  → Condition B?
              ├── Yes → Action Y
              └── No  → Ask user for clarification
```

---

## Output Format

Define exactly what the AI must produce at the end of this skill.

Example:
```
✅ Summary:     <what was done>
📁 Files:       <list of created/modified files>
⚠️  Warnings:   <anything the user should know>
🔗 Next steps:  <suggested follow-up skills or actions>
```

---

## Validation Checklist

Before marking this skill complete:

- [ ] All phases completed
- [ ] Output format produced
- [ ] No TODOs or placeholder code left
- [ ] No hardcoded secrets, URLs, or credentials
- [ ] Follows project naming conventions
- [ ] User has been informed of any side effects

---

## Examples

See `examples/` folder for:
- `example-en.md` — English input/output example
- `example-vi.md` — Vietnamese input/output example
