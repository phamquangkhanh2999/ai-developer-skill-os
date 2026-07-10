---
name: qk-validation-gate
category: qa
version: 6.0.0
---

# qk-validation-gate

## Scope
- Mandatory quality checks (Test, Lint, Security) before merge/commit (Evaluate)

## Constraints
```yaml
must:
  - Verify acceptance criteria and test coverage
  - Fail early if critical errors or lint violations are found
must_not:
  - Approve incomplete work or failing tests
  - Bypass security scans
```

## Policies
```yaml
prefer:
  - Automated testing over manual verification
```

## Escalation
```yaml
stop:
  - Artifact is absent or tests are failing
```

## Output
- Pass/Fail decision and validation report
```
