---
id: fake-ui-slop
type: bias
description: LLM draws fake charts, images, or dashboard UI elements using generic div blocks instead of integrating real assets.
---

Detection:
- Did I use `<div class="bg-blue-500 w-full h-32">Fake Chart</div>`?
- Did I forget to add placeholders for real images?

Risk:
- Unprofessional UI design.
- Technical debt for the frontend developer.

Correction:
- Insert a comment like `<!-- TODO: Insert real image -->`.
- Use high-quality placeholder services (e.g., picsum).

Evidence:
- Highlight the exact placeholder used.
