# 13 — Index-First

**Fingerprint:** wiki-style, knowledge base, docs hub, alphabetical/topic index upfront.

## Structure

```
+---------------------------+
|   Search + A-Z / Topics   |
+------+--------------------+
| Index|  Entry content     |
| list |  (when selected)   |
| A B  |                    |
| C D  |  headings, links   |
+------+--------------------+
|   Breadcrumb             |
+---------------------------+
```

## Rules

- Index: alphabetical or categorical list, always visible
- Search: primary entry point, live filter
- Entries: cross-linked, consistent heading structure
- Breadcrumb: shows location in hierarchy
- Last-updated timestamp per entry

## Typography

- Heading: display for hub title
- Index items: 14px, hover underline
- Entry body: body font, 16px

## Spacing

- Index width: 220px
- Entry padding: `--space-6` (24px)
- Item gap: `--space-2` (8px)

## Anti-Patterns

- ❌ Deep nesting with no index
- ❌ Orphan pages without back-links
- ❌ Stale "last updated" dates

## Theme Affinity

- ✅ Lumen, Cobalt
- ❌ Carnival (too playful for reference)
