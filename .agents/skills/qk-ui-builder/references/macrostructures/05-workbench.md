# 05 — Workbench

**Fingerprint:** sidebar + main content, tool-first, dense information, keyboard-centric.

## Structure

```
+---------+------------------+
| Sidebar |   Main Content   |
| Nav     |                  |
| Tools   |   Editor/Canvas  |
| Status  |                  |
+---------+------------------+
```

## Rules

- Sidebar width: 260px fixed on desktop, collapsible on mobile
- Main content: fluid, max-width 1200px
- Toolbar: sticky top of main content
- Status bar: sticky bottom of main content

## Typography

- Heading: mono (Lumen) or geometric-sans (Cobalt)
- Body: body font, 14px base
- Code: mono, 13px

## Spacing

- Sidebar padding: `--space-4`
- Main padding: `--space-6`
- Toolbar height: 48px

## Anti-Patterns

- ❌ Centered hero in workbench
- ❌ Large decorative images
- ❌ Excessive whitespace

## Theme Affinity

- ✅ Lumen, Cobalt
- ❌ Carnival (too playful)
