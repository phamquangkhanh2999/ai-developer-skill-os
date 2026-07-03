---
id: delegation-only
type: rule
description: Restricts the skill from making direct system modifications.
---

Condition:
- The skill must ONLY plan, analyze, and dispatch instructions to sub-skills.
- It must NEVER write code, execute CLI commands, or modify files directly.
