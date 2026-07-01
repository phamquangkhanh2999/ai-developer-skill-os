---
name: accessibility-audit
description: >-
  Kiểm tra và sửa lỗi khả năng tiếp cận (a11y/WCAG). Đảm bảo hỗ trợ phím, screen reader và semantic HTML.
version: 1.0.0
category: frontend
tags: [accessibility, a11y, aria, wcag, screen-reader, keyboard]
platforms: [antigravity, claude-code, kilo-code, cursor, windsurf]
---

# Accessibility (A11y) Audit

> **Language rule:**
> Use **English** for: ARIA attributes, HTML tags, WCAG guidelines, technical terms.
> Use **the user's language** for: explanations, summaries, and questions.

---

## Trigger

Activate this skill when:
- User asks to "make this accessible", "fix a11y", or "audit accessibility"
- Building complex interactive components (modals, dropdowns, tabs, sliders)
- Preparing an app for production or public release
- Project audit flags missing semantic HTML or ARIA issues

---

## Scope

- ✅ **Keyboard Navigation:** Ensure all interactive elements are reachable via `Tab`, and operable via `Enter`/`Space`/Arrows. Focus management (trapping focus in modals).
- ✅ **Screen Reader Support:** Add proper `aria-` attributes, `alt` text, and visually hidden text (`sr-only`).
- ✅ **Semantic HTML:** Replace `div` soups with `<nav>`, `<main>`, `<article>`, `<button>`, etc.
- ✅ **Color Contrast:** Verify text vs. background contrast meets WCAG AA (4.5:1 for normal text).
- ✅ **Form Labels:** Ensure all inputs have associated `<label>`s or `aria-label`s.

---

## Non-goals

- ❌ Do NOT completely redesign the UI visually (unless fixing a severe contrast issue, and even then, ask first).
- ❌ Do NOT overuse ARIA. The first rule of ARIA is: "No ARIA is better than bad ARIA." Use semantic HTML first.

---

## Workflow

### Phase 1 — Semantic HTML Check

Scan the component for basic HTML semantics:
- Are buttons actually `<button>` elements (not `<div onClick>`)?
- Are links actually `<a>` elements with `href`s?
- Do images have meaningful `alt` text (or `alt=""` if decorative)?
- Are headings (`h1`-`h6`) in a logical, unbroken hierarchy?

### Phase 2 — Keyboard & Focus Management

- Can the user tab through the component logically?
- Does every interactive element have a visible focus state (`:focus-visible`)?
- For Modals/Dialogs: Is focus trapped inside when open? Is focus restored when closed?
- For custom widgets (Tabs/Dropdowns): Implement correct arrow key navigation per WAI-ARIA authoring practices.

### Phase 3 — Screen Reader (ARIA) Check

- Do custom interactive elements have correct `role`s (e.g., `role="tablist"`)?
- Is dynamic state communicated? (`aria-expanded`, `aria-selected`, `aria-invalid`, `aria-busy`).
- Are icon-only buttons properly labeled? (`aria-label` or `<span className="sr-only">Label</span>`).
- Are dynamic live regions used for important announcements (`aria-live="polite"` or `assertive`)?

### Phase 4 — Contrast & Visuals

- Check text colors against backgrounds.
- Ensure form fields have visible borders or indicators.
- Ensure information is not conveyed *only* by color (e.g., a red border for an error must also have error text).

---

## Decision Tree

```
Is the component a native HTML element (e.g., standard `<button>`)?
  ├── Yes → Ensure it has accessible text/labels. No ARIA roles needed.
  └── No  → (e.g., a custom `div` acting as a checkbox)
              ├── Can it be refactored to use native HTML?
              │     ├── Yes → Refactor to native HTML `<input type="checkbox">`
              │     └── No  → Apply `role="checkbox"`, `tabIndex={0}`, `aria-checked`, and keyboard event handlers.
```

---

## Output Format

```
♿ Accessibility Audit Report
─────────────────────────────────────────────────
Component:  [ComponentName]

Issues Found & Fixed:
  ✅ Semantic HTML: Replaced `<div onClick>` with `<button>`
  ✅ Screen Readers: Added `aria-label` to icon-only close button
  ✅ Keyboard: Added focus trap inside the Modal
  ✅ Forms: Associated `<label htmlFor="email">` with Input

⚠️ Remaining Warnings (Manual Check Required):
  - Please verify color contrast of primary button in light mode (needs 4.5:1 ratio).

🔗 Next Steps:
  Code updated. Recommend testing with a screen reader (VoiceOver/NVDA).
```

---

## Validation Checklist

- [ ] Semantic HTML preferred over ARIA
- [ ] Keyboard navigation (Tab + Enter/Space) works correctly
- [ ] Focus is visible on all interactive elements
- [ ] Forms have proper labels
- [ ] Icon-only buttons have accessible names
