---
name: agent-orchestrator
description: >-
  Phân tích yêu cầu, lên kế hoạch thực thi chi tiết và điều phối các tác vụ cho đúng skill. Không tự viết code.
version: 1.0.0
category: engineering
tags: [orchestration, planning, workflow, task-decomposition]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
---

# Agent Orchestrator

> **Language rule:**
> Use **English** for: skill names, phase labels, technical decisions, file paths.
> Use **the user's language** for: explanations, questions, plan summaries, and feedback.

> ⚠️ **CRITICAL CONSTRAINT: This skill MUST NOT write any code.**
> Its only job is to analyze, plan, and delegate.
> If the orchestrator starts writing implementation code — it is violating its role.
> Immediately stop and delegate to the appropriate skill instead.

---

## Trigger

Activate this skill when:
- User describes a task without knowing where to start
- User request spans multiple concerns (UI + API + state + tests)
- Request is ambiguous and needs decomposition before action
- User says: "help me plan", "what should I do first", "how do I approach this"

---

## Scope

- ✅ Analyze the user's request
- ✅ Identify which skills are needed
- ✅ Define the correct execution order
- ✅ Create a step-by-step plan
- ✅ Delegate each step to the correct skill
- ✅ Track overall progress

---

## Non-goals

- ❌ Do NOT write implementation code
- ❌ Do NOT modify files
- ❌ Do NOT fix bugs directly (delegate to `bug-fix`)
- ❌ Do NOT build UI directly (delegate to `ui-builder`)
- ❌ Do NOT make architectural decisions unilaterally (delegate to `frontend-architecture`)

---

## Workflow

### Phase 1 — Request Analysis

Parse the user's request:

1. **What** is being asked? (feature, fix, refactor, review, deploy?)
2. **Where** does it belong? (frontend, backend, shared, infrastructure?)
3. **What is the scope?** (single component, full feature, entire codebase?)
4. **What is unknown?** List any ambiguities that need clarification.

If critical information is missing → ask before planning.

---

### Phase 2 — Skill Selection

Map the request to skills from the registry:

| Request type | Recommended skill(s) |
|---|---|
| "I don't know what's wrong" | `project-audit` → `bug-fix` |
| "Build a new page" | `frontend-architecture` → `design-system` → `ui-builder` |
| "Add API call" | `context-manager` → `api-integration` |
| "App is slow" | `project-audit` → `frontend-performance` |
| "Upgrade dependencies" | `migration` |
| "Write tests" | `frontend-testing` |

Always check dependencies from `skills.json` — load dependent skills first.

---

### Phase 3 — Execution Plan

Produce a numbered, ordered plan. Each step maps to one skill.

Format:
```
Step 1: [skill-name] — [what it will do]
Step 2: [skill-name] — [what it will do]
Step 3: [skill-name] — [what it will do]
```

Mark dependencies explicitly:
```
Step 2 requires Step 1 to complete first.
```

---

### Phase 4 — Delegation

For each step in the plan:
1. Announce which skill is being activated
2. Pass relevant context to that skill
3. Wait for skill output
4. Confirm completion before moving to next step

---

### Phase 5 — Progress Tracking

After each skill completes:
- Mark step as ✅ done
- Note any output or blockers
- Adjust remaining plan if needed
- Report overall progress to user

---

## Decision Tree

```
Is the request clear enough to plan?
  ├── No  → Ask 1-3 clarifying questions, then plan
  └── Yes → Does it span multiple concerns?
              ├── Yes → Create multi-step plan with skill sequence
              └── No  → Route directly to single skill
```

```
Does a skill dependency exist?
  ├── Yes → Run dependency skill first
  └── No  → Run skill directly
```

---

## Output Format

```
📋 Plan: [Brief description of what we're doing]

Step 1: `[skill-name]` — [Purpose]
Step 2: `[skill-name]` — [Purpose]  ← requires Step 1
Step 3: `[skill-name]` — [Purpose]

⏳ Starting with Step 1...
```

After each step:
```
✅ Step 1 complete: [Brief outcome]
▶️  Moving to Step 2: `[skill-name]`
```

---

## Validation Checklist

Before finishing orchestration:

- [ ] All planned steps completed
- [ ] Each step was handled by the correct skill
- [ ] No code was written by the orchestrator itself
- [ ] User has been informed of final outcome
- [ ] Next recommended actions provided if relevant

---

## Examples

See `examples/` folder.
