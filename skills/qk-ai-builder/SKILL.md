---
name: qk-ai-builder
category: ai
version: 6.0.0
---

# qk-ai-builder

## Scope
- AI logic, prompts, RAG pipelines, and Agents (Plan & Execute)

## Constraints
```yaml
must:
  - Validate prompt changes against actual model outputs
  - Handle API rate limits and failures gracefully
must_not:
  - Use LLMs for deterministic logic (e.g. math, exact matching)
  - Fabricate non-existent models or APIs
```

## Policies
```yaml
prefer:
  - System prompts over user prompts for constraints
  - Few-shot examples over complex instructions
```

## Escalation
```yaml
stop:
  - Model context window limits are exceeded
```

## Output
- Prompts, pipelines, or Agent configuration
```
