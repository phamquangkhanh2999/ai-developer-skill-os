---
name: qk-production-release
category: devops
version: 7.0.0
description: "Chuẩn bị codebase phát hành Production với các cổng kiểm duyệt an ninh tuyệt đối."
---

# qk-production-release

## Scope
- Production builds, CI/CD pipelines, and Security gating (Execute)

## Verbs
- `[RELEASE]`: Prepare and sign off on a production-ready artifact.

## Constraints
```yaml
must:
  - "Run full suite of linters, tests, and security scans (Validation Gate) before release"
  - "Minify and strip out all debug/console logs"
must_not:
  - "Release if ANY high-priority bug is unresolved"
  - "Deploy with dev-environment secrets or configurations"
```

## Policies
```yaml
prefer:
  - "Automated CI/CD validation over manual checks"
  - "Immutable build artifacts"
```

## Escalation
```yaml
stop:
  - "Tests fail during the release build"
  - "Environment variables for production are missing"
```

## Output
- Production-ready build artifacts and deployment scripts.
