---
name: qk-design-to-code
category: frontend
version: 7.0.0
description: "Chuyển đổi thiết kế từ Figma/Images thành các UI component hoàn chỉnh, chuẩn pixel."
---

# qk-design-to-code

## Scope
- Converting Figma/UI designs into pixel-perfect frontend code (Execute)
- Rejecting generic templates and enforcing bespoke, high-quality aesthetics.

## Verbs
- `[REDESIGN]`: Discard generic UI structure, keep data, and rebuild with strict Hallmark/Open Design principles.
- `[BUILD]`: Generate UI adhering 100% to `DESIGN.md`.

## Constraints
```yaml
must:
  - Use the project's existing `DESIGN.md` design system / tokens ONLY
  - Ensure responsive layouts and generous whitespace
  - Include micro-interactions and smooth transitions
must_not:
  - Hardcode magic numbers for spacing/colors
  - Invent new UI components if existing ones suffice
  - Use generic "AI-slop" aesthetics (e.g., default Tailwind blue/red, cluttered layouts, 1px default borders)
```

## Policies
```yaml
prefer:
  - Semantic HTML elements
  - CSS Grid / Flexbox over absolute positioning
  - High-end aesthetics (glassmorphism, organic shadows, exact typography)
```

## Escalation
```yaml
stop:
  - "Design assets or requirements are ambiguous"
  - "DESIGN.md is missing"
```

## Output
- Frontend components and stylesheets (Anti-Slop compliant)
