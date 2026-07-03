---
id: cosmetic-refactor
type: bias
description: LLM frequently rename variables or restructures code purely for aesthetic reasons without architectural improvement.
---

Detection:
- Did I only rename variables (e.g. `data` to `userData`)?
- Did I fail to split God Objects or reduce coupling?

Risk:
- High noise in Git diffs.
- Low return on investment (ROI).
- Potential regression for zero architectural gain.

Correction:
- Reject cosmetic-only changes.
- Focus strictly on decoupling, dependency injection, or SOLID violations.

Evidence:
- Explain explicitly why the new structure scales better or is more decoupled.
