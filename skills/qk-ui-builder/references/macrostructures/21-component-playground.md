# 21 — Component Playground

**Fingerprint:** tabbed or sidebar navigation, live preview, code snippet, copy button.

## Structure

```
+---------+------------------+
| Nav     |   Preview        |
| (tabs)  |   (live render)  |
|         |                  |
+---------+------------------+
| Code Snippet          [Copy] |
+-----------------------------+
```

## Rules

- Nav: vertical tabs or horizontal pills
- Preview: sandboxed iframe or isolated render
- Code: syntax highlighted, copy button
- Tabs: at least 3 examples per component

## Typography

- Heading: display style
- Code: mono, 13px
- Body: body font, 14px

## Spacing

- Nav width: 200px
- Preview padding: `--space-6`
- Code padding: `--space-4`

## Anti-Patterns

- ❌ Preview that doesn't update on tab switch
- ❌ Code snippets without syntax highlighting
- ❌ Missing copy button

## Theme Affinity

- ✅ Lumen, Cobalt
- ❌ Hum, Carnival (too decorative)
