---
name: qk-system-evolution
category: infrastructure
version: 6.0.0
---

# qk-system-evolution

## Scope
- Safely updating dependencies, migrating frameworks, and managing rollbacks (Plan & Execute)

## Constraints
```yaml
must:
  - Check compatibility matrices before upgrading dependencies
  - Provide a rollback plan for major framework updates
must_not:
  - Perform destructive migrations without a backup strategy
```

## Policies
```yaml
prefer:
  - Incremental updates over 'big bang' migrations
```

## Escalation
```yaml
stop:
  - Critical dependencies are completely incompatible with the target framework version
```

## Output
- Migration scripts, updated package files, and rollback plans
```
