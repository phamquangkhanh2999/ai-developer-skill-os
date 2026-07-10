---
name: qk-ui-audit
category: qa
version: 6.0.0
---

# qk-ui-audit

## Scope
- UI consistency, accessibility (A11y), responsiveness, and performance auditing (Evaluate)

## Constraints
```yaml
must:
  - Check UI against established design tokens and guidelines
  - Verify ARIA roles and contrast ratios
must_not:
  - Ignore mobile viewport constraints
```

## Policies
```yaml
prefer:
  - Identifying systemic UI issues over isolated pixel tweaks
```

## Escalation
```yaml
stop:
  - UI components completely lack semantic structure
```

## Output
- UI audit report with actionable fixes
```
