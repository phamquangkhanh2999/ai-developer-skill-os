# Theme: Midnight

**Genre:** atmospheric  
**Use case:** luxury, premium products

## Axes

| Axis | Value |
|------|-------|
| Paper band | dark (0–30% lightness) |
| Display style | classical-serif |
| Accent hue | cool (180–260°) |

## Token Overrides

```css
:root {
  --color-background: hsl(220, 20%, 6%);
  --color-surface: hsl(220, 20%, 10%);
  --color-text: hsl(220, 10%, 92%);
  --color-text-muted: hsl(220, 5%, 55%);
  --color-accent: hsl(220, 40%, 65%);
  --color-accent-hover: hsl(220, 40%, 58%);
  --font-display: 'Cormorant Garamond', 'Times New Roman', serif;
  --font-body: 'Crimson Text', Georgia, serif;
  --radius-sm: 2px;
  --radius-md: 4px;
  --shadow-sm: 0 1px 2px hsl(220, 20%, 2%);
  --shadow-md: 0 4px 12px hsl(220, 20%, 2%);
}
```

## Macrostructure Affinity

- ✅ Photographic
- ✅ Quote-Led
- ✅ Narrative Workflow
- ❌ Stat-Led (too data-dense)
- ❌ Component Playground (too utilitarian)

## Anti-Patterns (Midnight-specific)

- ❌ Bright saturated colors
- ❌ Geometric sans-serif fonts
- ❌ Card-in-card nesting
- ❌ Grid-based feature lists

## Voice

- Evocative adjectives: "Timeless", "Curated", "Exceptional"
- Short declarative sentences
- No bullet points in hero sections
