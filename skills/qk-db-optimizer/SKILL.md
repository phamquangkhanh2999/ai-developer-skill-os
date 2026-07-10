---
name: qk-db-optimizer
category: infrastructure
version: 6.0.3
description: "Tối ưu hóa Database (đánh Index, xử lý N+1 Queries, Slow Queries)."
---

# qk-db-optimizer

## Scope
- Database optimization (Indexes, N+1 Queries, Slow Queries) (Diagnose & Evaluate)

## Constraints
```yaml
must:
  - Analyze query execution plans if available
  - Suggest non-breaking performance fixes
must_not:
  - Change database engine or major architecture without consent
```

## Policies
```yaml
prefer:
  - Adding indexes before rewriting complex queries
```

## Escalation
```yaml
ask:
  - For exact slow query logs if not provided
```

## Output
- Optimization plan and SQL patches
```
