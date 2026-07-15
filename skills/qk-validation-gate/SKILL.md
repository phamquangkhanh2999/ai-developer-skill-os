---
name: qk-validation-gate
category: qa
version: 7.0.0
description: "Cổng kiểm tra chất lượng bắt buộc (Test, Lint, Security) chặn đứng mọi mã nguồn lỗi."
---

# qk-validation-gate

## Scope
- Pre-commit/Pre-push Quality Gates and Test execution (Evaluate)

## Verbs
- `[VALIDATE]`: Run tests, linters, and security checks before any merge or commit.

## Constraints
```yaml
must:
  - "Run all unit/integration tests before passing the gate"
  - "Run static analysis (Linting, Type-checking) on modified files"
must_not:
  - "Bypass failing tests with generic 'ignore' flags"
  - "Allow commits with unaddressed security warnings"
```

## Policies
```yaml
prefer:
  - "Strict failure over silent continuation"
```

## Escalation
```yaml
stop:
  - "Tests fail or Code coverage drops below threshold"
  - "Linter reports errors (not just warnings)"
```

## Output
- Validation report (Pass/Fail) and execution logs.
