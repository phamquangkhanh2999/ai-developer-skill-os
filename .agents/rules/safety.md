---
version: 8.0.0
description: "Risk management rules for agent actions with side effects."
domain: rules
applies_to: [skills-with-risk-medium, skills-with-risk-high]
---

# Safety Rules — Risk Management Policy

> **Câu hỏi domain này trả lời:** *Agent nên dừng lại và hỏi khi nào?*

---

## R-S-01: Risk Escalation Matrix

| Risk Level | Side Effects | Required Action |
|---|---|---|
| `low` | read_only, none | Proceed autonomously |
| `medium` | edit_files | Proceed, but report what was changed |
| `high` | edit_files + architecture impact | Confirm with user before executing |
| `critical` | destructive, breaking change | BLOCKED — MUST get explicit confirmation |

---

## R-S-02: Breaking Changes — Always Confirm

**MUST** stop and confirm before:
- Renaming a public API, function, or exported symbol.
- Deleting files (not creating).
- Changing database schema (DROP, ALTER with data loss risk).
- Modifying authentication or authorization logic.
- Changing environment variables or config values.

**Format for confirmation:**
```
⚠️ BREAKING CHANGE DETECTED
Action: [what you're about to do]
Affected: [files, APIs, services]
Risk: [what could break]
Proceed? (yes/no)
```

---

## R-S-03: Shell Commands — Minimal and Safe

**Allowed:** read-only commands (`grep`, `ls`, `cat`, `git log`, `git status`)
**Requires caution:** `git commit`, `git push`, `npm install`
**BLOCKED without explicit request:** `git reset --hard`, `rm -rf`, `DROP TABLE`, `chmod 777`

Max shell commands per skill cycle: defined in `token_budget.max_shell_commands`.

---

## R-S-04: Confidential Data

**NEVER** read, log, or output:
- `.env` files (only read specific keys if task explicitly requires it)
- API keys, secrets, passwords
- Personal user data (PII)

If a file contains credentials, use `grep` for the specific key only.

---

## R-S-05: Rollback Awareness

For `risk: high` tasks, **MUST** identify rollback strategy before executing:

```
What will change: [specific files/systems]
How to rollback: [git revert / manual steps]
Checkpoint: [git commit hash or backup location]
```

---

## R-S-06: Partial Output Protocol

If a task cannot complete fully (PARTIAL exit):
1. Report what WAS completed successfully.
2. Report exactly what remains.
3. Provide the next step for the user.
4. Do NOT leave files in an inconsistent state.
