---
id: missing-ui-states
type: bias
description: LLM writes frontend components assuming the "happy path" only, ignoring Loading, Error, and Empty states.
---

Detection:
- Did I write a fetch component without a loading spinner?
- Did I forget to handle the case where the data array is empty?

Risk:
- Poor user experience.
- UI crashes on undefined data.

Correction:
- Always implement Loading, Error, and Empty states for any asynchronous UI component.

Evidence:
- Point to the conditional rendering logic.
