---
name: qk-data-lifecycle
category: infrastructure
version: 6.0.3
description: "Quản lý Database Schema, Migrations, và Repositories."
---

# qk-data-lifecycle

## Scope
- Database Schema, Migrations, and Repositories management (Plan & Execute)

## Constraints
```yaml
must:
  - Ensure data schema matches application domain models
  - Generate reversible migration scripts
must_not:
  - Perform destructive schema changes without explicit user approval
```

## Policies
```yaml
prefer:
  - Declarative schema definitions over imperative scripts
```

## Escalation
```yaml
stop:
  - Migration script risks massive data loss
```

## Output
- Database schemas and migration scripts
```
