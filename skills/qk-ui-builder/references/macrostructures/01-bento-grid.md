# 01 — Bento Grid

**Fingerprint:** asymmetric grid, mixed card sizes, icon-led sections, no equal-height rows.

## Structure

```
+-------+-------+
|       |       |
|  A    |   B   |
|       |       |
+---+---+-------+
|   C   |   D   |
+---+---+-------+
|        E       |
+-----------------+
```

## Rules

- Card A: hero metric or primary action (spans 2 cols on desktop)
- Card B: secondary metric or visual
- Card C: tertiary content
- Card D: tertiary content
- Card E: full-width footer or CTA

## Typography

- Heading: display style from theme
- Body: body font from theme
- Metric numbers: tabular-nums, display weight

## Spacing

- Grid gap: `--space-6` (24px)
- Card padding: `--space-5` (20px)
- Inner padding: `--space-4` (16px)

## Anti-Patterns

- ❌ 3 equal columns
- ❌ Card-in-card
- ❌ All cards same height

## Theme Affinity

- ✅ Cobalt, Carnival, Lumen
- ⚠️ Hum (needs more whitespace)
