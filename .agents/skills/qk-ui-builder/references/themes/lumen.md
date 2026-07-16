# Theme: Lumen

**Genre:** tech  
**Use case:** AI tools, developer products, dashboards

## Axes

| Axis | Value |
|------|-------|
| Paper band | dark (<30% lightness) |
| Display style | mono |
| Accent hue | cool (200–300°) |

## Token Overrides

```css
:root {
  --color-background: hsl(220, 20%, 8%);
  --color-surface: hsl(220, 20%, 12%);
  --color-text: hsl(220, 10%, 88%);
  --color-text-muted: hsl(220, 10%, 55%);
  --color-accent: hsl(200, 100%, 60%);
  --color-accent-hover: hsl(200, 100%, 65%);
  --font-display: 'JetBrains Mono', monospace;
  --font-body: 'Inter', sans-serif;
  --radius-sm: 4px;
  --radius-md: 6px;
  --shadow-sm: 0 1px 2px hsl(0, 0%, 0%);
  --shadow-md: 0 4px 12px hsl(0, 0%, 0%);
}
```

## Macrostructure Affinity

- ✅ Workbench
- ✅ Component Playground
- ✅ Stat-Led
- ❌ Manifesto (too editorial)
- ❌ Letter (too personal)

## Anti-Patterns (Lumen-specific)

- ❌ Serif fonts
- ❌ Warm color accents
- ❌ Excessive border-radius (> 8px)
- ❌ Large hero images

## Voice

- Concise, technical but accessible
- Action-oriented: "Deploy", "Connect", "Query"
- Code snippets welcome
