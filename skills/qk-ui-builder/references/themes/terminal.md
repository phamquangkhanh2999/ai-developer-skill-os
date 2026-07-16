# Theme: Terminal

**Genre:** tech  
**Use case:** CLI tools, developer tools, terminals

## Axes

| Axis | Value |
|------|-------|
| Paper band | dark (0–30% lightness) |
| Display style | mono |
| Accent hue | phosphor green (120–150°) |

## Token Overrides

```css
:root {
  --color-background: hsl(220, 15%, 4%);
  --color-surface: hsl(220, 15%, 8%);
  --color-text: hsl(120, 30%, 75%);
  --color-text-muted: hsl(120, 10%, 45%);
  --color-accent: hsl(120, 60%, 55%);
  --color-accent-hover: hsl(120, 60%, 48%);
  --font-display: 'JetBrains Mono', 'Fira Code', monospace;
  --font-body: 'JetBrains Mono', 'Fira Code', monospace;
  --radius-sm: 0px;
  --radius-md: 0px;
  --shadow-sm: none;
  --shadow-md: none;
}
```

## Macrostructure Affinity

- ✅ Workbench
- ✅ Component Playground
- ✅ Stat-Led
- ❌ Manifesto (too expressive)
- ❌ Photographic (too visual)

## Anti-Patterns (Terminal-specific)

- ❌ Serif or display fonts
- ❌ Warm accent hues
- ❌ Decorative shadows or borders
- ❌ Smooth transitions/animations

## Voice

- Command-line syntax: `$ npm install`, `> init()`
- Terse, imperative: "Run", "Deploy", "Configure"
- Status codes and badges
