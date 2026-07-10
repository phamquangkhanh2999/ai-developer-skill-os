---
name: qk-feature-delivery
category: fullstack
version: 6.0.0
---

# qk-feature-delivery

## Scope
- New capabilities (Execute)

## Constraints
```yaml
must:
  - Clarify requirements if unclear
  - Implement complete end-to-end flow
must_not:
  - Mix refactoring into feature work
  - Ignore backward compatibility
```

## Policies
```yaml
prefer:
  - Plan before implementing
  - Cover UI loading/error states
```

## Escalation
```yaml
stop:
  - Requirements are ambiguous
ask:
  - Before adding heavy dependencies
```

## Output
- Feature implementation
```
