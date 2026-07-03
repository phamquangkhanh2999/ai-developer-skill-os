---
id: strictness
type: dial
description: Defines how rigidly the AI enforces patterns and rules.
---

Levels:
- **Level 1 (Lenient):** Fix only syntax errors and fatal bugs. Ignore bad architecture.
- **Level 5 (Balanced):** Suggest improvements but don't rewrite entire files.
- **Level 10 (Draconian):** Fail immediately on any Linter warning. Enforce strict SOLID principles.

Usage:
- Adjust based on the user's intent. If they just want a quick fix, lower the strictness. If they ask for an audit, raise it.
