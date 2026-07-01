---
name: ui-builder
description: >-
  Xây dựng các màn hình và layout phức tạp từ yêu cầu, tái sử dụng component và đảm bảo responsive.
version: 1.0.0
category: frontend
tags: [ui, layout, screens, pages, styling, responsive]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
---

# UI Builder

> **Language rule:**
> Use **English** for: code, component names, CSS classes, technical patterns.
> Use **the user's language** for: explanations, questions, and summaries.

---

## Trigger

Activate this skill when:
- User wants to create a new page, screen, or view
- User provides a mockup, wireframe, or visual description
- User asks to "build a layout", "create a dashboard", "make the profile page"
- Refactoring a large, messy view into a structured layout

---

## Scope

- ✅ Translate requirements into a component hierarchy
- ✅ Build layouts using Grid, Flexbox, and project styling conventions
- ✅ Ensure responsive design (mobile-first or desktop-first based on project)
- ✅ Integrate existing shared components (Buttons, Cards, Inputs) via `design-system` rules
- ✅ Define placeholders for data and logic (to be filled by `api-integration` or `state-management`)

---

## Non-goals

- ❌ Do NOT build backend APIs
- ❌ Do NOT implement complex global state (delegate to `state-management`)
- ❌ Do NOT invent new core UI components if they already exist in the design system
- ❌ Do NOT write raw HTML (`<button>`) if a shared component (`<Button>`) exists

---

## Workflow

### Phase 1 — Requirement Analysis

1. Understand the goal: What screen are we building?
2. Identify major sections: Header, Sidebar, Main Content, Footer, Modals.
3. Identify data requirements: What data will populate this view? (Use mock data initially).

---

### Phase 2 — Component Hierarchy Planning

Break the screen down into smaller components.
**Rule of thumb:** If a section has complex logic or is reusable, it should be a separate component.

*Example:*
```text
UserProfilePage
  ├── ProfileHeader
  │     ├── Avatar
  │     └── UserStats
  ├── UserSettingsForm (delegate to form-builder)
  └── UserActivityList
```

---

### Phase 3 — Design System Integration

*(Relies on output from `design-system` skill)*
Identify which existing components will be used for each part of the hierarchy.

- Buttons → `<Button>`
- Layouts → `<Container>`, `<Grid>`
- Typography → `<Typography variant="h2">` or Tailwind text classes

---

### Phase 4 — Implementation

Write the code.
1. Build the layout skeleton first (Flexbox/Grid).
2. Add static/mock data to visualize the structure.
3. Apply styling for layout, spacing, and typography.
4. Ensure responsive behavior (e.g., stack columns on mobile).

---

### Phase 5 — Validation

- [ ] Does it match the requirements?
- [ ] Is it responsive?
- [ ] Does it strictly use the design system?
- [ ] Is the code clean and well-structured (not one giant file)?

---

## Decision Tree

```
Is a section of the UI highly complex or forms a distinct logical unit?
  ├── Yes → Extract it into its own component file (e.g., `ProfileHeader.tsx`)
  └── No  → Keep it inline in the main layout file for now

Does a required base component (e.g., DatePicker) exist in the project?
  ├── Yes → Import and use it
  └── No  → Use a standard HTML fallback or instruct `component-generator` to build it later

Is the UI data-heavy (like a complex form or table)?
  ├── Yes → Delegate specific sections to `form-builder` or `table-crud-generator`
  └── No  → Build it fully within `ui-builder`
```

---

## Output Format

```
🎨 UI Builder Summary
─────────────────────────────────────────────────
Screen:     [Name of the screen/view built]

Component Hierarchy:
  [Tree showing parent and child components]

📁 Files Created/Modified:
  ✅ [path/to/Page.tsx]
  ✅ [path/to/SubComponent.tsx]

🛠️ Implementation Details:
  - Responsive: [Yes - describe breakpoints used]
  - Mock Data:  [Added placeholders for API integration]

🔗 Next Steps:
  → Need to wire up API? Route to `api-integration`.
  → Need complex state? Route to `state-management`.
```

---

## Examples

See `examples/` folder.
