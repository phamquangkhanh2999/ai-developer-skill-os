---
name: qk-ui-system-builder
category: frontend
version: 7.0.0
description: "Xây dựng và duy trì Design Systems, Token extraction, và các thư viện UI dùng chung."
---

# qk-ui-system-builder

## Scope
- Building and maintaining Design Systems and shared UI tokens (Plan & Execute)
- Enforcing Open Design constraints via `DESIGN.md`

## Verbs
- `[EXTRACT]`: Read `DESIGN.md` and generate CSS variables/tokens.
- `[ENFORCE]`: Ensure no generic "AI-slop" tokens are created.

## Constraints
```yaml
must:
  - "Extract reusable design tokens (colors, spacing, typography) from DESIGN.md ONLY"
  - "Ensure components are accessible (A11y)"
must_not:
  - "Create duplicate tokens for the same visual value"
  - "Invent tokens (e.g., standard Tailwind colors) not explicitly defined in DESIGN.md"
```

## Policies
```yaml
prefer:
  - Strict adherence to HSL/Oklch over generic HEX colors
  - Composable components over rigid layouts
```

## Escalation
```yaml
stop:
  - "DESIGN.md is missing (Prompt user to run bootstrap or provide one)"
  - "Design tokens conflict with existing DESIGN.md guidelines"
```

## Output
- Strict UI component library or Design System tokens mapped to `DESIGN.md`
