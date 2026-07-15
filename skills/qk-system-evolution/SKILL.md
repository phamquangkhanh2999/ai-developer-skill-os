---
name: qk-system-evolution
category: maintenance
version: 7.0.0
description: "Cập nhật an toàn các thư viện, di chuyển frameworks với kế hoạch rollback nghiêm ngặt."
---

# qk-system-evolution

## Scope
- Dependency upgrades, Framework migrations, and rollback management (Execute)

## Verbs
- `[UPGRADE]`: Migrate systems with zero-trust testing.

## Constraints
```yaml
must:
  - "MUST have a Rollback Plan before executing any major upgrade"
  - "Verify all dependencies against the Context Graph to catch breaking changes"
must_not:
  - "Upgrade major versions without reading the Changelog/Migration Guide"
  - "Blindly run 'npm update' or equivalent"
```

## Policies
```yaml
prefer:
  - "Incremental upgrades over 'big bang' migrations"
```

## Escalation
```yaml
stop:
  - "Dependency upgrades break existing test suites"
  - "No Rollback Plan provided"
```

## Output
- Upgraded dependencies and migration logs.
