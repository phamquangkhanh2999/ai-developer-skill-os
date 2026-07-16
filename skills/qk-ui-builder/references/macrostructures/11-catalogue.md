# 11 — Catalogue

**Fingerprint:** product listings, e-commerce grid, filterable cards, scannable.

## Structure

```
+---------------------------+
|   Search + Filters        |
+------+--------------------+
| Facet|  [card][card]      |
| Nav  |  [card][card]      |
|      |  [card][card]      |
|      |                    |
+------+--------------------+
|   Pagination / Load more  |
+---------------------------+
```

## Rules

- Grid: 3–4 columns desktop, 2 tablet, 1 mobile
- Card: image, title, price, rating, quick-add
- Facets: sticky filter sidebar, collapsible on mobile
- Pagination: numbered or infinite scroll, state preserved
- Sorting: visible control (price, popularity)

## Typography

- Heading: display for page title
- Price: tabular-nums, medium weight
- Title: 14px body, truncated to 2 lines

## Spacing

- Grid gap: `--space-4` (16px)
- Card padding: `--space-3` (12px)
- Filter width: 240px

## Anti-Patterns

- ❌ Cards with inconsistent heights breaking grid
- ❌ Hidden or unclear pricing
- ❌ Filters that require page reload

## Theme Affinity

- ✅ Carnival, Cobalt
- ❌ Hum (needs more product pop)
