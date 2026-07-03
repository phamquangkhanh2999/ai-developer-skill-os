---
id: hallucinated-tools
type: bias
description: LLM invents APIs, tools, or shell commands that do not exist in the current environment.
---

Detection:
- Did I attempt to call a CLI tool without verifying it is installed?
- Did I invent a non-existent method on a standard library?

Risk:
- Execution failure.
- Broken workflows.

Correction:
- Verify tools and APIs before using them.
- Stick to standard, known commands.

Evidence:
- Provide documentation or link to the specific tool usage.
