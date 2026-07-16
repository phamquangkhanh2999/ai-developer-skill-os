# 20 — Ecosystem Index

**Fingerprint:** integrations, partners, plugins directory, logo grid with search.

## Structure

```
+---------------------------+
|   Search + category tabs  |
+------+--------------------+
| Cat  |  [logo][logo]      |
| nav  |  [logo][logo]      |
|      |  [logo][logo]      |
+------+--------------------+
|   Featured / popular      |
+---------------------------+
```

## Rules

- Logo grid: uniform tile size, grayscale → color on hover
- Categories: tab or sidebar filter
- Search: matches name and tags
- Featured row: highlights top integrations
- Each tile links to detail/install

## Typography

- Heading: display for directory title
- Tile name: 13px medium under logo
- Category: 14px, active state bold

## Spacing

- Grid gap: `--space-4` (16px)
- Tile padding: `--space-4` (16px)
- Cat nav width: 200px

## Anti-Patterns

- ❌ Logos at inconsistent sizes
- ❌ No search on large directories
- ❌ Missing category organization

## Theme Affinity

- ✅ Cobalt, Lumen
- ⚠️ Carnival (logos need neutral bg)
