---
name: qk-component-generator
description: >-
  Tạo các UI Component độc lập, tái sử dụng được, có type an toàn và tuân thủ chuẩn design system.
version: 1.0.0
category: frontend
tags: [component, react, vue, ui, props, reusable]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
---

# Component Generator

> **Language rule:**
> Use English for: code, identifiers, file names, architecture terms, technical decisions.
> Use the user's language for: explanations, questions, summaries, and feedback.
> The user may write in any language — detect and match it automatically.

---

## Trigger

Activate this skill when:
- User says "create a Card component", "make a reusable Button", "extract this into a component"
- A larger skill (`ui-builder`, `form-builder`) requires a new isolated UI piece to be built
- Refactoring a large component by splitting it into smaller, reusable parts

---

## Scope

- ✅ Generate a single, focused component (e.g., `UserCard`, `StatBadge`, `Dropdown`)
- ✅ Define strict, explicit types/interfaces for all props
- ✅ Implement component variants (e.g., `size`, `color`, `variant`) if needed
- ✅ Follow project styling rules (Tailwind, CSS Modules, Styled Components)
- ✅ Ensure accessibility (ARIA attributes, semantic HTML) where applicable

---

## Non-goals

- ❌ Do NOT build full pages or complex screens (delegate to `ui-builder`)
- ❌ Do NOT handle complex business logic or data fetching inside a dumb/presentational component
- ❌ Do NOT overwrite existing components without explicit instruction

---

## Workflow

### Phase 1 — Component Design

Determine:
1. **Name:** PascalCase (e.g., `ProductCard`).
2. **Responsibility:** What exactly does this component do? Keep it single-responsibility.
3. **Props:** What data does it need from its parent? What events does it emit?

---

### Phase 2 — API (Props) Definition

Draft the interface first.
- Make required props explicit.
- Use optional props (`?`) for variants or non-essential data.
- Avoid `any`.

*Example:*
```typescript
interface ProductCardProps {
  id: string;
  title: string;
  price: number;
  imageUrl?: string;
  isAvailable?: boolean;
  onAddToCart: (id: string) => void;
}
```

---

### Phase 3 — Implementation

Write the component code.
1. Use destructuring for props.
2. Apply styling based on `design-system` rules.
3. Handle empty/null states (e.g., if `imageUrl` is missing, show a placeholder).
4. Add basic interactivity (e.g., calling `onAddToCart` when clicked).

---

### Phase 4 — Validation

- [ ] Are all props typed correctly?
- [ ] Is it truly reusable (no hardcoded data)?
- [ ] Does it use project design tokens?
- [ ] Is it exported correctly according to project conventions (default vs. named export)?

---

## Decision Tree

```
Does the component need to manage its own state (e.g., an accordion opening/closing)?
  ├── Yes → Add local state (`useState`). Keep it minimal.
  └── No  → Make it a pure "dumb" component receiving props.

Are there multiple visual styles requested (e.g., primary, secondary, outline)?
  ├── Yes → Add a `variant` prop and map it to style classes.
  └── No  → Implement the single required style.
```

---

## Output Format

```
🧩 Component Generated
─────────────────────────────────────────────────
Name:     [ComponentName]
Path:     [path/to/Component.tsx]

Props Interface:
  [List key props here briefly]

Features:
  • [Feature 1, e.g., "Supports primary/secondary variants"]
  • [Feature 2, e.g., "Fully typed with TypeScript"]

🔗 Next Steps:
  Component is ready to be imported into your layout.
```

---

## Examples

See `examples/` folder.
