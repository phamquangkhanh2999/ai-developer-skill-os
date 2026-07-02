# 2. Kernel Freeze

Date: 2026-07-02

## Status
Accepted

## Context
The Global Policy file (`AGENTS.md`), which acts as the OS Kernel, was continuously expanding. Policies like Language, Decision, Engineering, Output, Tool Efficiency, Context Budget, and Escapation were all piled into a single document, threatening to balloon past 1,000 lines. A bloated kernel leads to Agent Hallucinations (due to context window pressure) and conflicting priorities.

## Decision
We officially "Freeze" the Kernel (`AGENTS.md`) at v4.0.0. The file is strictly rewritten to under 100 lines using absolute Rules (MUST/MUST NOT) and Guidelines (Prefer/Avoid). 
Moving forward, no new policies will be added to the Kernel. All future expansions must occur at the higher layers:
- New Capabilities
- New Skills
- New Knowledge documents
- New Templates

## Consequences
- **Positive:** The baseline ruleset is locked, highly token-efficient, and easily digestible by any LLM. The framework achieves enterprise stability.
- **Negative:** Feature requests that require global policy shifts will be rejected by default unless they fundamentally rewrite the OS paradigm.
