---
name: qk-production-release
category: devops
version: 6.0.0
---

# qk-production-release

## Scope
- Preparing codebase for production release including Build, CI/CD, and Security checks (Plan & Govern)

## Constraints
```yaml
must:
  - Verify that all tests pass and linters are clean
  - Check for exposed secrets or misconfigurations
must_not:
  - Deploy code that fails security audits
```

## Policies
```yaml
prefer:
  - Immutable artifacts and deterministic builds
```

## Escalation
```yaml
stop:
  - Security vulnerabilities or critical test failures are detected
```

## Output
- Release checklist and deployment readiness status
```
