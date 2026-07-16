# Theme: Cobalt

**Genre:** modern-minimal  
**Use case:** SaaS, developer tools, B2B products

## Axes

| Axis | Value |
|------|-------|
| Paper band | mid (30–85% lightness) |
| Display style | geometric-sans |
| Accent hue | cool (200–300°) |

## Token Overrides

```css
:root {
  --color-background: hsl(220, 20%, 98%);
  --color-surface: hsl(220, 20%, 100%);
  --color-text: hsl(220, 15%, 10%);
  --color-text-muted: hsl(220, 10%, 45%);
  --color-accent: hsl(220, 80%, 55%);
  --color-accent-hover: hsl(220, 80%, 48%);
  --font-display: 'Inter', sans-serif;
  --font-body: 'Inter', sans-serif;
  --radius-sm: 6px;
  --radius-md: 8px;
  --shadow-sm: 0 1px 2px hsl(220, 15%, 90%);
  --shadow-md: 0 4px 12px hsl(220, 15%, 90%);
}
```

## Macrostructure Affinity

- ✅ Workbench
- ✅ Stat-Led
- ✅ Index-First
- ❌ Manifesto (too editorial)
- ❌ Riso (too analog)

## Anti-Patterns (Cobalt-specific)

- ❌ Purple gradients (`linear-gradient(135deg, #a855f7, #3b82f6)`)
- ❌ Rounded-full buttons with gradient text
- ❌ 3-column icon cards
- ❌ Hero with centered-everything layout

## Voice

- Short labels, sentence case
- Action verbs first: "Get started", "View docs"
- No exclamation marks in headings
