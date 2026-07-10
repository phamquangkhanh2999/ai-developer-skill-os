---
name: qk-access-policy
category: security
version: 6.0.0
---

# qk-access-policy

## Scope
- Security boundaries and policies (Govern)

## Constraints
```yaml
must:
  - Enforce access controls at API level
  - Check security rules
must_not:
  - Rely on UI-only security
```

## Policies
```yaml
prefer:
  - Deny-by-default
```

## Escalation
```yaml
stop:
  - Policy is missing or ambiguous
```

## Output
- Policy enforcement decision
```
