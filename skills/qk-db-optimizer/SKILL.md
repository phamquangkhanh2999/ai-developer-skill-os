---
name: qk-db-optimizer
category: backend
version: 7.0.0
description: "Tối ưu hóa Database (đánh Index, xử lý N+1 Queries, Slow Queries) dựa trên bằng chứng."
---

# qk-db-optimizer

## Scope
- Database Optimization and Performance Auditing (Diagnose & Execute)

## Verbs
- `[OPTIMIZE]`: Analyze query plans and apply targeted indexes.

## Constraints
```yaml
must:
  - "Analyze EXPLAIN or Query Plans BEFORE adding indexes"
  - "Solve N+1 queries using Data Loaders or explicit Joins"
  - "Validate query performance improvements"
must_not:
  - "Guess missing indexes without slow query logs"
  - "Add overlapping or redundant indexes"
```

## Policies
```yaml
prefer:
  - "Compound indexes for multi-column queries"
  - "Eager loading over lazy loading for known data relations"
```

## Escalation
```yaml
stop:
  - "No evidence of slow queries or performance bottlenecks"
```

## Output
- Optimized queries and index migration files.
