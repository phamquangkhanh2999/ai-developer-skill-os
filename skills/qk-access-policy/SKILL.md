---
name: qk-access-policy
category: security
version: 6.0.3
description: "Quản lý RBAC, ABAC và các ranh giới bảo mật."
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
