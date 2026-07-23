---
version: 8.0.0
description: "Agent behavior policies applied globally across all capabilities."
domain: rules
applies_to: all
---

# Global Rules — Agent Behavior Policy

> **Câu hỏi domain này trả lời:** *Agent nên hành xử thế nào?*

---

## R-G-01: Decision Before Action

**MUST** create a plan before executing any task with complexity ≥ medium.

```
Receive request
  ↓
Classify complexity (fast-path or full workflow)
  ↓
If medium/high: outline steps first
  ↓
Execute step by step
  ↓
Verify each step before next
```

**Violation:** Starting to write code before understanding the full scope.

---

## R-G-02: Evidence Before Conclusion

**MUST** have concrete evidence before stating a finding or applying a fix.

- Do NOT guess root cause without reading the relevant code.
- Do NOT assume a bug is fixed without verification.
- Do NOT report "done" without checking the output.

**Minimum evidence:** File path + line number + quoted code.

---

## R-G-03: Minimal Footprint

**MUST** touch only what is necessary for the task.

- Do NOT refactor code outside the task scope.
- Do NOT "improve" unrelated files while working.
- Do NOT run commands with broad side effects (e.g., `rm -rf`, `git reset --hard`) without explicit user confirmation.

---

## R-G-04: Token Budget Discipline

**MUST** respect the `token_budget` defined in each skill's frontmatter.

- Read files in targeted chunks (`view_file[start:end]`), never entire large files.
- Use `grep_search` for pattern discovery, not full-file reads.
- Stop reading when sufficient evidence is found (`stop_early: true`).
- Never read: `node_modules/`, `dist/`, `.git/`, binary files.

---

## R-G-05: Retrieval Path (AI-Native)

When starting a task, the agent MUST follow this retrieval sequence:

```
1. Read registry/skills-index.yml → identify candidate skills
2. Read candidate SKILL.md(s) → confirm intent + preconditions
3. Load referenced workflow → understand execution steps
4. Load referenced rules (this file + coding.md if needed)
5. Execute
```

Do NOT load all skills. Do NOT scan the entire repository.

---

## R-G-06: Exit Code Protocol

Every skill execution MUST terminate with one of:

| Code | Meaning |
|---|---|
| `SUCCESS` | Task completed and verified |
| `BLOCKED` | Precondition not met — request more info |
| `FAILED` | Execution failed after max retries |
| `PARTIAL` | Partially completed — output + reason |

Never silently terminate. Always report exit code and reason.

---

## R-G-07: Language Policy

- **Code, identifiers, filenames, YAML keys:** English only.
- **Explanations, summaries, reports to user:** Vietnamese (match user's language).
- **SKILL.md body headings:** English.

---

## R-G-08: No Silent Errors

**NEVER** use `?.`, `!`, `try/catch {}` (empty catch), or type casting to suppress errors.

Fix root cause. If root cause is unclear → report as BLOCKED with evidence.

---

## R-G-09: Legacy Skill Handling

Agent **MUST** prefer stable skills.

Legacy skills **MAY** be selected only when:
1. No stable candidate exists
2. User explicitly requests legacy behavior
3. Migration incomplete

Legacy skills **MUST NOT** outrank stable skills.

---

## R-G-10: Ambiguity Resolution

Agent **MUST NOT** execute when:
`selection confidence < threshold`

Agent **SHOULD**:
1. Ask clarification
2. Present top candidates
3. Explain missing information
