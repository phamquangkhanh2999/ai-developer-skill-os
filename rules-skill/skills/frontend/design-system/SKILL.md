---
name: design-system
description: >-
  Ép buộc sử dụng design system, component library và token hiện có, ngăn chặn việc viết HTML/CSS rác.
version: 1.0.0
category: frontend
tags: [design-system, ui-components, styling, tailwind, material-ui, shadcn]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
---

# Design System Enforcer

> **Language rule:**
> Use **English** for: component names, CSS classes, design tokens, technical terms.
> Use **the user's language** for: explanations, summaries, and questions.

---

## Trigger

Activate this skill when:
- About to build UI screens or components
- Styling or layout work is required
- User asks to "make it look good" or "match the design"
- Integrating a third-party UI library (Tailwind, MUI, AntD, Shadcn)

---

## Scope

- ✅ Identify the UI library or design system in use
- ✅ Map standard HTML elements to project-specific components (e.g., `<button>` → `<Button>`)
- ✅ Enforce usage of design tokens (colors, spacing, typography) instead of hardcoded values
- ✅ Provide available component variants and props to downstream skills (`ui-builder`)
- ✅ Prevent generation of raw CSS/inline styles if utility classes or styled-components are standard

---

## Non-goals

- ❌ Do NOT create new base components if an equivalent already exists
- ❌ Do NOT introduce a new styling method (e.g., don't add Tailwind if project uses CSS Modules)
- ❌ Do NOT design full pages (delegate to `ui-builder`)

---

## Workflow

### Phase 1 — Detect Design System

Analyze dependencies and project files to identify:
1. **Component Library:** Shadcn UI, MUI, Ant Design, Chakra, Bootstrap, custom internal library?
2. **Styling Method:** Tailwind CSS, CSS Modules, Styled Components, Emotion, SCSS, Vanilla CSS?
3. **Location of Shared Components:** Usually `src/components/ui/`, `src/shared/components/`, or from an npm package.
4. **Design Tokens:** `tailwind.config.js`, `theme.ts`, `variables.scss`.

---

### Phase 2 — Component Mapping

Before `ui-builder` generates code, create a mapping table for required elements:

| Standard Element | Project Component | Source / Import Path |
|------------------|-------------------|----------------------|
| `<button>` | `<Button>` | `@/components/ui/button` |
| `<input type="text">` | `<Input>` | `@/components/ui/input` |
| `<div>` (Card) | `<Card>` | `@/components/ui/card` |
| `<h1>` | `<Typography variant="h1">` | `@mui/material` |

---

### Phase 3 — Token Extraction

Identify available tokens for spacing, colors, and typography to avoid hardcoding:
- *Instead of:* `margin-top: 16px; color: #3b82f6;`
- *Use:* `mt-4 text-blue-500` (Tailwind) or `theme.spacing(2)` (MUI) or `var(--primary-color)`.

---

### Phase 4 — Rule Enforcement

Pass strict instructions to `ui-builder` or `component-generator`:
- "You MUST use `<Button>` instead of `<button>`."
- "You MUST use Tailwind classes for all styling. No inline `style={{}}` allowed."

---

## Decision Tree

```
Does the project use a component library (e.g., Shadcn, MUI)?
  ├── Yes → Is the required component available?
  │           ├── Yes → Require its use
  │           └── No  → Instruct `component-generator` to create it following library style
  └── No  → Check if custom shared components exist
              ├── Yes → Map to custom shared components
              └── No  → Use raw HTML but enforce project's styling method (e.g., Tailwind)

Does the project use utility classes (Tailwind)?
  ├── Yes → Forbid inline styles or custom CSS files
  └── No  → Enforce existing CSS Modules / Styled Components patterns
```

---

## Output Format

```
🎨 Design System Rules
─────────────────────────────────────────────────
Library:        [Shadcn / MUI / Tailwind / Custom / etc.]
Styling Method: [Tailwind / CSS Modules / Styled Components]

Component Mapping for this task:
  ✅ Button  → `<Button>` from `@/components/ui/button`
  ✅ Input   → `<Input>` from `@/components/ui/input`
  ✅ Layout  → Flexbox with Tailwind (`flex flex-col gap-4`)

Styling Rules Enforced:
  • No raw HTML `<button>` allowed
  • No inline styles allowed
  • Use primary color token for CTAs

🔗 Next Steps:
  Passing these rules to `ui-builder` to generate the UI.
```

---

## Validation Checklist

- [ ] Design system and styling method correctly identified
- [ ] Mappings created for all necessary UI elements
- [ ] Design tokens (spacing/colors) prioritized over hardcoded values
- [ ] Strict enforcement rules passed to next skill
