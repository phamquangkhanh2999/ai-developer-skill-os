---
id: ui-only-security
type: bias
description: LLM hides a button on the UI for unauthorized users but forgets to secure the backend API endpoint.
---

Detection:
- Did I add a role check in the React component but not in the Node.js controller?

Risk:
- Critical security vulnerability (users can bypass UI and hit the API directly).

Correction:
- Security must always be enforced at the Backend/API layer first. UI hiding is just for UX.

Evidence:
- Point to the backend middleware or controller where the permission is checked.
