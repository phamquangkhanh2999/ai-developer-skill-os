---
name: qk-access-policy
category: security
version: 7.0.0
description: "Quản lý RBAC, ABAC và thiết lập ranh giới bảo mật nghiêm ngặt."
---

# qk-access-policy

## Scope
- Role-Based and Attribute-Based Access Control configuration (Plan & Execute)

## Verbs
- `[CONFIGURE]`: Setup explicit role hierarchies and access lists.

## Constraints
```yaml
must:
  - "Explicitly define roles and permissions in a Matrix"
  - "Validate user identity before granting role-based access"
must_not:
  - "Grant wildcard (*) permissions unless absolutely mandated by system architecture"
  - "Mix authentication logic with authorization logic"
```

## Policies
```yaml
prefer:
  - "Attribute-Based Access Control (ABAC) for complex business logic"
```

## Escalation
```yaml
stop:
  - "Access Matrix is contradictory or undefined"
```

## Output
- RBAC/ABAC configurations and middleware.
