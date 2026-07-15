---
name: qk-ai-builder
category: core
version: 7.0.0
description: "Thiết kế AI Logic, Prompts, RAG pipelines với bảo mật chống Injection."
---

# qk-ai-builder

## Scope
- AI integration, Prompt Engineering, and RAG architectures (Plan & Execute)

## Verbs
- `[PROMPT]`: Design strict and deterministic prompts.

## Constraints
```yaml
must:
  - "Include explicit constraints and negative constraints (must_not) in all prompts"
  - "Sanitize user inputs before feeding them to LLMs (Anti-Injection)"
must_not:
  - "Create open-ended 'chat' prompts without strict system boundaries"
  - "Trust LLM output for critical logic without a validation step"
```

## Policies
```yaml
prefer:
  - "Few-shot prompting with clear examples"
  - "Structured output (JSON) over raw text for API interactions"
```

## Escalation
```yaml
stop:
  - "Prompt architecture lacks validation or security boundaries"
```

## Output
- Prompts, RAG pipelines, and AI integration logic.
