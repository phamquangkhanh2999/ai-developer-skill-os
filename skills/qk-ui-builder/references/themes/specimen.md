# Theme: Specimen

**Genre:** editorial  
**Use case:** design systems, documentation

## Axes

| Axis | Value |
|------|-------|
| Paper band | mid (30–85% lightness) |
| Display style | high-contrast-serif |
| Accent hue | neutral |

## Token Overrides

```css
:root {
  --color-background: hsl(40, 10%, 96%);
  --color-surface: hsl(40, 10%, 100%);
  --color-text: hsl(40, 15%, 8%);
  --color-text-muted: hsl(40, 5%, 45%);
  --color-accent: hsl(40, 5%, 45%);
  --color-accent-hover: hsl(40, 5%, 38%);
  --font-display: 'Playfair Display', Georgia, serif;
  --font-body: 'Source Sans 3', 'Helvetica Neue', sans-serif;
  --radius-sm: 4px;
  --radius-md: 4px;
  --shadow-sm: 0 1px 2px hsl(40, 15%, 90%);
  --shadow-md: 0 4px 12px hsl(40, 15%, 90%);
}
```

## Macrostructure Affinity

- ✅ Type Specimen
- ✅ Index-First
- ✅ Component Playground
- ❌ Marquee Hero (too playful)
- ❌ Bento Grid (too casual)

## Anti-Patterns (Specimen-specific)

- ❌ Playful illustrations or mascots
- ❌ Warm saturated accents (orange, coral)
- ❌ Rounded corners > 4px
- ❌ Gradient hero backgrounds

## Voice

- Typographic precision: "Style guide", "Type scale", "Spacing rhythm"
- Noun-first labels: "Design tokens", "Component states"
- Neutral, authoritative tone
