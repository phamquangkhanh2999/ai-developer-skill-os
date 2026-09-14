---
version: 9.2.0
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
- Do NOT run commands with broad side effects (`rm -rf`, `git reset --hard`) without explicit user confirmation.

---

## R-G-04: Token Budget Discipline

**MUST** respect the `token_budget` defined in each skill's frontmatter.

- Read files in targeted chunks, never entire large files.
- Use `grep_search` for pattern discovery, not full-file reads.
- Stop reading when sufficient evidence is found (`stop_early: true`).
- Never read: `node_modules/`, `dist/`, `.git/`, binary files.

---

## R-G-05: Retrieval Path (Compact — v9.2)

When starting a task, follow this sequence:

```
1. Read .agents/DEV_PROFILE.md     → get role + stack
2. Match intent against routing table in .agents/AGENTS.md
3. Read the matching SKILL.md      → confirm intent + preconditions
4. Load referenced workflow YAML   → understand execution steps
5. Load rules/global.md + coding.md (if edit_files task)
6. Execute step by step
7. Exit with: SUCCESS | BLOCKED | FAILED | PARTIAL
```

**Do NOT:**
- Read `registry/skills-index.yml` to route — use the inline routing table in `.agents/AGENTS.md`
- Load all skills at once
- Scan entire repository before starting

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
- **Commit messages:** English (Conventional Commits format).

---

## R-G-08: No Silent Errors

**NEVER** use `?.`, `!`, `try/catch {}` (empty catch), or type casting to suppress errors.

Fix root cause. If root cause is unclear → report as `BLOCKED` with evidence.

---

## R-G-09: Legacy Skill Handling

Agent **MUST** prefer stable skills over experimental or deprecated ones.

Deprecated skills **MUST NOT** be selected. If a user asks for a deprecated skill, explain the replacement.

---

## R-G-10: Ambiguity Resolution

Agent **MUST NOT** execute when selection confidence < threshold.

Agent **SHOULD**:
1. Ask clarification
2. Present top 2-3 candidate skills with brief descriptions
3. Explain what information is missing

---

## R-G-11: SKILL.md Description Standard (Anthropic-aligned)

Every SKILL.md `description` field **MUST** satisfy both:

**(a) What it does** — concrete action the skill performs
**(b) When to use** — trigger context, keywords, situations

**Bad:** `"Xử lý dữ liệu."`
**Good:** `"Thiết kế và implement API endpoint mới (REST/GraphQL/tRPC). Dùng skill này khi user nhắc đến: viết api, tạo endpoint, thiết kế api, build api, route handler, controller — kể cả khi chỉ hỏi về request/response schema."`

Description phải đủ mạnh để AI **không under-trigger** (bỏ qua skill khi lẽ ra nên dùng).

---

## R-G-12: Progressive Disclosure — SKILL.md Size Limit

SKILL.md body (không tính frontmatter) **MUST** be < 500 lines.

Nếu gần chạm 500 dòng:
- Tách phần chi tiết ra `references/*.md`
- Ghi rõ trong SKILL.md: *"Khi cần X → đọc `references/X.md`"*
- Layer 1 (frontmatter) luôn trong context
- Layer 2 (SKILL.md body) nạp khi skill active
- Layer 3 (references/, scripts/, assets/) nạp on-demand
