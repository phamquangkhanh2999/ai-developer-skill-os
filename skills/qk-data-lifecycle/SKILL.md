---
name: qk-data-lifecycle
category: backend
version: 7.0.0
description: "Quản lý Database Schema, Migrations, và Repositories khắt khe với Zero-Trust."
---

# qk-data-lifecycle

## Scope
- Database Schema management, Migrations, and Repositories (Plan & Execute)
- Enforcing structural database contracts before implementation.

## Verbs
- `[SCHEMA]`: Define database tables/models explicitly.
- `[MIGRATE]`: Safely manage state changes.

## Constraints
```yaml
must:
  - "MUST define explicitly strict database schemas (e.g., Prisma/TypeORM) before writing repository code"
  - "Enforce strict types for all database operations"
must_not:
  - "Create dynamic queries without schema definitions"
  - "Delete or drop columns without a deprecation phase"
  - "Write complex business logic inside repository files"
```

## Policies
```yaml
prefer:
  - "Separation of concerns (Repositories handle data, Services handle logic)"
  - "Transactions for multi-table updates"
```

## Escalation
```yaml
stop:
  - "Missing database schema or ORM models"
  - "Attempting destructive migrations on production"
```

## Output
- ORM Schema, Repositories, and Migration files.
