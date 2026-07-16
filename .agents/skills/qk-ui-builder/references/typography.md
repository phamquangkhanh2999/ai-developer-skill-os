# Typography

Foundational rules for font selection, type scale, and textual hierarchy. These rules exist to guarantee readable, professional, and consistent type across every generated UI.

## The 2+1 Rule

Use **at most 2 font families + 1 monospace** per project. Exceeding this causes visual noise and slows load time.

- **Display / Heading family** (1): used for titles, hero text.
- **Body / UI family** (1): used for paragraphs, labels, controls.
- **Monospace** (1, optional): used for code, IDs, numeric tables, logs.

```css
:root {
  --font-display: "Playfair Display", Georgia, serif;
  --font-body: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}
```

If you only need one family, the body family can double as the display family. Do not introduce a third decorative family.

## Font Catalog

Pick from this approved catalog. Prefer fonts that share the same optical quality and load reliably via Google Fonts or system fallbacks.

| Family | Role | Notes |
| --- | --- | --- |
| Inter | Body / UI | Neutral, legible at small sizes. Default choice. |
| Source Serif 4 | Display / Body | Serif companion to Inter; good for reading-heavy UI. |
| Playfair Display | Display | High-contrast serif for hero/editorial headings. |
| JetBrains Mono | Mono | Developer-friendly monospace. |
| Poppins | Display / UI | Geometric, friendly; use sparingly. |
| Roboto / Roboto Flex | Body / UI | Safe system-adjacent alternative. |
| IBM Plex Sans / Mono | Body / Mono | Corporate, consistent pairing. |

Pairing examples that work:
- **Inter + Playfair Display + JetBrains Mono** (editorial + code)
- **Inter + Source Serif 4 + JetBrains Mono** (clean + reading)
- **Poppins + Inter + JetBrains Mono** (friendly branding)

## Type Scale

Use only these sizes. Do not invent intermediate sizes.

```
12px   caption / meta
14px   small text / secondary
16px   body (base)
18px   lead / intro paragraph
24px   h3 / section title
32px   h2 / page title
48px   h1 / hero
64px   display / marketing hero
```

```css
:root {
  --text-xs: 0.75rem;   /* 12px */
  --text-sm: 0.875rem;  /* 14px */
  --text-base: 1rem;    /* 16px */
  --text-lg: 1.125rem;  /* 18px */
  --text-xl: 1.5rem;    /* 24px */
  --text-2xl: 2rem;     /* 32px */
  --text-3xl: 3rem;     /* 48px */
  --text-4xl: 4rem;     /* 64px */
}
```

## Line Height

| Content | Line height |
| --- | --- |
| Body text | **1.5** |
| Headings (h1–h3) | **1.2** |
| Tight display (64px) | 1.1 |

```css
p, li, label { line-height: 1.5; }
h1, h2, h3 { line-height: 1.2; }
```

## Hierarchy

Establish hierarchy with **size + weight + color**, not decoration.

```css
h1 { font-family: var(--font-display); font-size: var(--text-3xl); font-weight: 700; }
h2 { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 600; }
h3 { font-family: var(--font-body);    font-size: var(--text-xl);  font-weight: 600; }
body { font-family: var(--font-body);   font-size: var(--text-base); font-weight: 400; }
.meta { font-size: var(--text-sm); color: var(--color-text-muted); }
```

Keep weight range tight: 400 (body), 500/600 (emphasis), 700 (headings). Avoid 900 unless for a single display word.

## Prose Measure

Constrain reading width for paragraphs to **45–75 characters** (`ch`).

```css
.prose {
  max-width: 65ch;
  font-size: var(--text-base);
  line-height: 1.5;
}
```

For multi-column or card text, keep each text block within this measure. Never let body copy stretch across a full 1200px container.

## Ban List

Do **not** use these as an identity or UI font:

- Comic Sans
- Papyrus
- Bradley Hand
- Any `cursive` generic family used as a primary brand font
- Other "novelty" fonts that undermine legibility

System fallbacks (`system-ui`, `sans-serif`, `serif`, `monospace`) are allowed only as graceful degradation, never as the chosen aesthetic.

## Practical Checklist

- [ ] At most 2 families + 1 mono.
- [ ] Sizes only from the 8-step scale.
- [ ] Body line-height 1.5, headings 1.2.
- [ ] Prose capped at 65ch.
- [ ] No banned novelty fonts.
