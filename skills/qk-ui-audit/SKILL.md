---
name: qk-ui-audit
category: qa
version: 6.0.3
description: "Kiểm toán giao diện (UI) để đảm bảo tính nhất quán, khả năng truy cập (A11y), độ phản hồi (Responsive) và hiệu suất."
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
