---
name: qk-bug-resolution
category: maintenance
version: 6.0.0
---

# qk-bug-resolution

## Scope
- Existing defects only (Diagnose)

## Constraints
```yaml
must:
  - Collect evidence (stack trace/logs) before diagnosis
  - Verify fix before completion
must_not:
  - Rewrite modules
  - Guess root cause without evidence
```

## Policies
```yaml
prefer:
  - Minimal patch
  - Regression prevention
```

## Escalation
```yaml
stop:
  - Missing logs/evidence
  - Fix requires major architectural changes
```

## Output
- Minimal patch
- Risk summary
```
