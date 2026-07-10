---
name: qk-project-health
category: maintenance
version: 6.0.3
description: "Kiểm toán toàn diện về Code Smells, Tech Debt, và Architecture."
---

# qk-project-health

## Scope
- Comprehensive auditing of Code Smells, Tech Debt, and Architecture (Diagnose & Evaluate)

## Constraints
```yaml
must:
  - Analyze dependency graphs and code complexity metrics
  - Highlight architectural anti-patterns
must_not:
  - Rewrite major components without user consent
  - Focus purely on stylistic lints (leave that to linter)
```

## Policies
```yaml
prefer:
  - Structural and performance improvements over minor refactors
```

## Escalation
```yaml
stop:
  - The project lacks basic structure making analysis impossible
```

## Output
- Health report and refactoring plan
```
