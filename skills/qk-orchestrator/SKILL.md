---
name: qk-orchestrator
category: core
version: 6.0.3
description: "Điều hướng yêu cầu của người dùng, phân tích ý định và ủy quyền cho các sub-skills phù hợp."
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
