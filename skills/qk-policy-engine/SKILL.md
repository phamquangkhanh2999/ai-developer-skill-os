---
name: qk-policy-engine
category: security
version: 6.0.0
---

# qk-policy-engine

## Scope
- System policy evaluation for safe and authorized actions (Govern)

## Constraints
```yaml
must:
  - Evaluate requested actions against defined system constraints
  - Enforce OS-level invariants
must_not:
  - Allow destructive commands (e.g. rm -rf /) to bypass checks
```

## Policies
```yaml
prefer:
  - Strict adherence to policy over convenience
```

## Escalation
```yaml
stop:
  - Action explicitly violates core safety policies
```

## Output
- Policy evaluation result (Allow/Deny)
```
