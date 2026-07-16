# 02 — Long Document

**Fingerprint:** single-column long scroll, generous line length control, anchored section nav, docs/blogs.

## Structure

```
+---------------------+
|   Sticky Title Bar  |
+------+--------------+
|  TOC |   Content    |
|  Nav |   (headings, |
|      |    paragraphs|
|      |    code, img)|
|      |              |
+------+--------------+
|   Footer / Pager    |
+---------------------+
```

## Rules

- Content column: max-width 70ch, centered within reading area
- TOC: sticky, scrollspy active section highlight
- Headings: sequential h2/h3 hierarchy, no skipped levels
- Code blocks: full-width within column, syntax highlighted
- Support reading progress bar at top

## Typography

- Heading: display or editorial serif from theme
- Body: body font, 18px base for reading comfort
- Code: mono, 14px

## Spacing

- Content padding: `--space-8` (32px)
- Paragraph spacing: `--space-4` (16px)
- Section gap: `--space-10` (40px)

## Anti-Patterns

- ❌ Multi-column body text
- ❌ Full-bleed images breaking reading rhythm
- ❌ Missing table of contents on long pages

## Theme Affinity

- ✅ Hum, Lumen
- ⚠️ Carnival (needs restraint on decoration)
