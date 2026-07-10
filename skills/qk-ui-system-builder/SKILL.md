---
name: qk-ui-system-builder
category: frontend
version: 6.0.3
description: "Xây dựng và duy trì Design Systems, Token extraction, và các thư viện UI dùng chung."
---

# qk-ui-system-builder

## Scope
- Building and maintaining Design Systems and shared UI tokens (Plan & Execute)

## Constraints
```yaml
must:
  - Extract reusable design tokens (colors, spacing, typography)
  - Ensure components are accessible (A11y)
must_not:
  - Create duplicate tokens for the same visual value
```

## Policies
```yaml
prefer:
  - Composable components over rigid layouts
```

## Escalation
```yaml
stop:
  - Design tokens conflict with existing design guidelines
```

## Output
- UI component library or Design System tokens
```
