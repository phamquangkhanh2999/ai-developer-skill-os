---
name: qk-orchestrator
category: core
version: 6.0.0
---

# qk-orchestrator

## Scope
- Request analysis and task delegation (Coordinate)

## Constraints
```yaml
must:
  - Route user request to the correct sub-skill
must_not:
  - Write code directly
  - Hallucinate non-existent skills
```

## Policies
```yaml
prefer:
  - Delegate to specialist skills
```

## Escalation
```yaml
stop:
  - No matching skill is found
```

## Output
- Delegation plan
```
