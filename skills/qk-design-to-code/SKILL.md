---
name: qk-design-to-code
category: frontend
version: 6.0.3
description: "Chuyển đổi thiết kế từ Figma/Images thành các UI component hoàn chỉnh, chuẩn pixel."
---

# qk-design-to-code

## Scope
- Converting Figma/UI designs into pixel-perfect frontend code (Execute)

## Constraints
```yaml
must:
  - Use the project's existing design system / tokens
  - Ensure responsive layouts
must_not:
  - Hardcode magic numbers for spacing/colors
  - Invent new UI components if existing ones suffice
```

## Policies
```yaml
prefer:
  - Semantic HTML elements
  - CSS Grid / Flexbox over absolute positioning
```

## Escalation
```yaml
stop:
  - Design assets or requirements are ambiguous
```

## Output
- Frontend components and stylesheets
```
