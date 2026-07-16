# Layout & Space

Foundational rules for grids, spacing rhythm, and structural layout. The goal is predictable, maintainable layouts built from flow and flex/grid — never magic numbers or absolute offsets.

## 4pt Base Spacing Scale

All spacing derives from a **4px base**. Use only these steps. Do not use arbitrary values like `7px`, `13px`, `23px`.

```
4px    --space-1   tight (icon gaps, inline)
8px    --space-2   small (label→control)
12px   --space-3   control padding, list gaps
16px   --space-4   default gap between elements
20px   --space-5   card internal padding
24px   --space-6   section internal padding
32px   --space-8   gap between related blocks
40px   --space-10  large block separation
48px   --space-12  section separation
64px   --space-16  major section separation
```

```css
:root {
  --space-1: 0.25rem;  --space-2: 0.5rem;   --space-3: 0.75rem;
  --space-4: 1rem;     --space-5: 1.25rem;  --space-6: 1.5rem;
  --space-8: 2rem;     --space-10: 2.5rem;  --space-12: 3rem;
  --space-16: 4rem;
}
```

## Grid & Flexbox (NO Absolute Positioning)

Lay out with **CSS Grid** and **Flexbox**. Do not use `position: absolute` / `position: fixed` for structural layout (overlays, tooltips, and sticky headers are the only exceptions, and they must be scoped).

```css
/* Page shell */
.container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: var(--space-6);
}

/* Responsive card grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(0, 1fr));
  gap: var(--space-6);
}
```

```css
/* Inline control row */
.row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}
```

## Minimum Whitespace Between Sections

Maintain **at least 16px** (`--space-4`) of separation between distinct sections; prefer `--space-12`/`--space-16` between major page sections.

```css
section + section { margin-top: var(--space-12); }
.card { padding: var(--space-5); }
.stack > * + * { margin-top: var(--space-4); }  /* vertical rhythm */
```

## Max Content Width

- **Desktop:** cap content at **1200px**, centered.
- **Mobile:** content is **100%** width (minus safe padding). Never force desktop widths onto small screens.

```css
.container { max-width: 1200px; width: 100%; }
@media (max-width: 640px) {
  .container { max-width: 100%; padding-inline: var(--space-4); }
}
```

## No "Margin: Auto Soup"

Do not scatter `margin: auto` to push elements around. Centralize alignment through flex/grid `justify-content` / `align-items` / `gap`. `margin-inline: auto` is permitted **only** for the top-level `.container` centering.

```css
/* Bad: fighting the layout with auto margins */
.sidebar { margin-left: auto; margin-right: 12px; }

/* Good: let the grid place it */
.layout { display: grid; grid-template-columns: 240px 1fr; gap: var(--space-8); }
```

## Stack Utility Pattern

Prefer an explicit vertical stack helper over chained margins.

```css
.stack { display: flex; flex-direction: column; }
.stack-4 > * + * { margin-top: var(--space-4); }
.stack-6 > * + * { margin-top: var(--space-6); }
```

## Practical Checklist

- [ ] All spacing uses the 4pt scale tokens.
- [ ] Layout via grid/flex; no absolute positioning for structure.
- [ ] ≥16px between sections; major sections use larger gaps.
- [ ] Desktop max 1200px, mobile 100%.
- [ ] No scattered `margin: auto` hacks.
