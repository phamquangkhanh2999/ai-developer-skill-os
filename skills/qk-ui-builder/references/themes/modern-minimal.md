# Theme: Modern Minimal

**Genre:** modern-minimal  
**Use case:** SaaS, startups, portfolios

## Axes

| Axis | Value |
|------|-------|
| Paper band | mid (30–85% lightness) |
| Display style | geometric-sans |
| Accent hue | neutral |

## Token Overrides

```css
:root {
  --color-background: hsl(220, 15%, 98%);
  --color-surface: hsl(220, 15%, 100%);
  --color-text: hsl(220, 20%, 12%);
  --color-text-muted: hsl(220, 10%, 50%);
  --color-accent: hsl(220, 15%, 45%);
  --color-accent-hover: hsl(220, 15%, 38%);
  --font-display: 'Inter', 'Helvetica Neue', sans-serif;
  --font-body: 'Inter', 'Helvetica Neue', sans-serif;
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
- ❌ Marquee Hero (too noisy)
- ❌ Manifesto (too expressive)

## Anti-Patterns (Modern Minimal-specific)

- ❌ Decorative illustrations
- ❌ Gradient buttons or backgrounds
- ❌ More than 2 font families
- ❌ Heavy drop shadows

## Voice

- Single-word actions: "Sign in", "Pricing", "Docs"
- No decorative copy
- Metrics and social proof prominent
