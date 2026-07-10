---
name: qk-engineering-standard
category: conventions
version: 6.0.3
description: "Ép buộc áp dụng SOLID, DRY, Clean Code, và các quy tắc đặt tên."
---

# qk-engineering-standard

## Scope
- Readability and structural improvements (Evaluate)

## Constraints
```yaml
must:
  - Preserve business logic exactly
  - Ensure tests pass after refactor
must_not:
  - Invent new requirements
  - Change public API signature
```

## Policies
```yaml
prefer:
  - Readability over cleverness
  - Explain trade-offs
```

## Escalation
```yaml
stop:
  - Tests fail
```

## Output
- Evaluation summary
- Refactored code
```
