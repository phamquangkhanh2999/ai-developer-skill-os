# Theme: Editorial

**Genre:** editorial  
**Use case:** magazines, news, blogs

## Axes

| Axis | Value |
|------|-------|
| Paper band | light (85–100% lightness) |
| Display style | roman-serif |
| Accent hue | warm (20–50°) |

## Token Overrides

```css
:root {
  --color-background: hsl(40, 15%, 97%);
  --color-surface: hsl(40, 15%, 100%);
  --color-text: hsl(40, 15%, 10%);
  --color-text-muted: hsl(40, 5%, 40%);
  --color-accent: hsl(30, 60%, 50%);
  --color-accent-hover: hsl(30, 60%, 42%);
  --font-display: 'Merriweather', 'Georgia', serif;
  --font-body: 'Merriweather', 'Georgia', serif;
  --radius-sm: 4px;
  --radius-md: 4px;
  --shadow-sm: 0 1px 2px hsl(40, 15%, 90%);
  --shadow-md: 0 4px 12px hsl(40, 15%, 90%);
}
```

## Macrostructure Affinity

- ✅ Long Document
- ✅ Quote-Led
- ✅ Letter
- ❌ Bento Grid (too tech)
- ❌ Workbench (too dashboard)

## Anti-Patterns (Editorial-specific)

- ❌ Card-based layouts
- ❌ Icon grids
- ❌ Sans-serif headings
- ❌ Dashboard-style navigation

## Voice

- Headlines with strong verbs: "Revealed", "Analysis", "Opinion"
- Byline prominence
- Timestamps and read-time indicators
