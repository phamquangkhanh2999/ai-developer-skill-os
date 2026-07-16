# 15 — Split Studio

**Fingerprint:** before/after, comparison layouts, side-by-side, A/B showcase.

## Structure

```
+---------------------------+
|   Title + toggle (vs)     |
+-------------+-------------+
|   BEFORE    |   AFTER     |
|   (media)   |   (media)   |
|   caption   |   caption   |
+-------------+-------------+
|   Diff / notes row        |
+---------------------------+
```

## Rules

- Two equal panes, clear "vs" divider or toggle
- Sync scroll when comparing scrollable content
- Optional slider for wipe comparison
- Captions: label each side unambiguously
- Notes: explain the difference below

## Typography

- Heading: display for comparison title
- Pane labels: uppercase, 13px muted
- Notes: body font, 15px

## Spacing

- Pane gap: `--space-2` (8px) or divider line
- Pane padding: `--space-4` (16px)
- Notes margin-top: `--space-6` (24px)

## Anti-Patterns

- ❌ Asymmetric panes implying bias
- ❌ No labels on before/after
- ❌ Wipe slider that lags input

## Theme Affinity

- ✅ Cobalt, Lumen
- ⚠️ Carnival (keep divider clean)
