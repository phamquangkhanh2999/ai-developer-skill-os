---
id: swallow-errors
type: bias
description: LLM wraps code in a try/catch block but leaves the catch block empty or just logs to console, effectively hiding fatal errors.
---

Detection:
- Did I write `catch (e) { console.error(e) }` without throwing or returning an error state?
- Did I fail to surface the error to the UI?

Risk:
- Silent failures.
- Extremely difficult debugging.

Correction:
- Always handle the error gracefully (e.g., return a unified error object or show a toast notification).

Evidence:
- Point to the specific error handling logic.
