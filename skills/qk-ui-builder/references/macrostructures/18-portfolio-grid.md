# 18 — Portfolio Grid

**Fingerprint:** creative portfolio, masonry grid, varied tile sizes, visual-first.

## Structure

```
+---------------------------+
|   Name + filter (tags)    |
+---------------------------+
| [big][sm][sm]             |
| [sm  ][med  ]             |
| [med ][sm][big]           |
+---------------------------+
|   Hover = reveal meta     |
+---------------------------+
```

## Rules

- Masonry or bento-style varied tile sizes
- Hover/focus: reveal title, category, year
- Filter: by tag/category, animates layout
- Click: opens project detail
- No fixed equal rows; embrace asymmetry

## Typography

- Heading: display for name/title
- Tile meta: 13px muted, revealed on hover
- Tags: 12px uppercase labels

## Spacing

- Grid gap: `--space-3` (12px)
- Tile min-height: 200px
- Filter margin-bottom: `--space-6` (24px)

## Anti-Patterns

- ❌ Rigid equal grid hiding creativity
- ❌ No hover state on tiles
- ❌ Missing project metadata

## Theme Affinity

- ✅ Carnival, Hum
- ❌ Cobalt (too rigid)
