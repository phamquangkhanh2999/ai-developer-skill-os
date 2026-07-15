---
name: qk-policy-engine
category: security
version: 7.0.0
description: "Hệ thống đánh giá chính sách để đảm bảo các hành động an toàn và được ủy quyền."
---

# qk-policy-engine

## Scope
- Security policies, authorization rules, and compliance (Evaluate)

## Verbs
- `[AUTHORIZE]`: Evaluate requests against the strict policy matrix.

## Constraints
```yaml
must:
  - "Enforce Principle of Least Privilege (PoLP) on all operations"
  - "Log all authorization failures for audit purposes"
must_not:
  - "Bypass security checks for 'admin' or 'dev' accounts in production"
  - "Hardcode plain-text secrets in policy rules"
```

## Policies
```yaml
prefer:
  - "Explicit Deny by default"
```

## Escalation
```yaml
stop:
  - "Policy evaluation fails (Unauthorized Action)"
```

## Output
- Policy evaluation result (Allow/Deny) and audit trail.
