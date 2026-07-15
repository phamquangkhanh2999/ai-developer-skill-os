---
name: qk-engineering-standard
category: qa
version: 7.0.0
description: "Ép buộc áp dụng SOLID, DRY, Clean Code, và chống Spaghetti code."
---

# qk-engineering-standard

## Scope
- Code Quality, Architecture, and Standards Enforcement (Audit)

## Verbs
- `[ENFORCE]`: Reject code that violates engineering standards.

## Constraints
```yaml
must:
  - "Enforce SOLID principles and DRY"
  - "Keep cyclomatic complexity low (Functions must do ONE thing)"
  - "Enforce strict naming conventions"
must_not:
  - "Allow spaghetti code or mega-functions"
  - "Merge logic that mixes UI, State, and Network in one file"
```

## Policies
```yaml
prefer:
  - "Composition over inheritance"
  - "Early returns and guard clauses"
```

## Escalation
```yaml
stop:
  - "Cyclomatic complexity exceeds acceptable thresholds"
  - "Code violates V7 Anti-Slop architectural rules"
```

## Output
- Refactored code or Audit rejection report.
