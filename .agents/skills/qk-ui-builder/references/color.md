# Color

Foundational rules for building a perceptually uniform, accessible color system. Colors are defined as design tokens in OKLCH and consumed via CSS custom properties.

## OKLCH Palette Construction

Build palettes in **OKLCH** (Lightness, Chroma, Hue). OKLCH keeps lightness perceptually even, so a `--color-bg-50` and `--color-bg-900` differ by the same visible amount at every step. Avoid HSL/RGB for scale generation.

```css
:root {
  --color-bg-0:   oklch(99% 0 0);      /* near white surface */
  --color-bg-50:  oklch(96% 0.005 250);
  --color-bg-100: oklch(92% 0.008 250);
  --color-bg-500: oklch(60% 0.05 250);  /* mid */
  --color-bg-900: oklch(25% 0.03 250);  /* near black surface */
}
```

Generate shades by holding hue, nudging chroma slightly, and stepping lightness in even increments (e.g. 99 → 96 → 92 → 85 → 75 → 60 → 45 → 30 → 25 → 18%).

## Token Naming

Name tokens with the pattern `--color-[role]-[shade]` so usage, not raw hue, drives selection.

```css
:root {
  --color-text:        oklch(20% 0.02 250);   /* default body text */
  --color-text-muted:  oklch(45% 0.02 250);
  --color-bg:          oklch(99% 0 0);
  --color-surface:     oklch(96% 0.005 250);
  --color-border:      oklch(88% 0.01 250);
  --color-accent:      oklch(55% 0.16 250);
  --color-accent-hover:oklch(48% 0.16 250);
  --color-success:     oklch(60% 0.14 145);
  --color-error:       oklch(58% 0.18 25);
}
```

Roles: `text`, `text-muted`, `bg`, `surface`, `border`, `accent`, `success`, `warning`, `error`. Always pair a base token with a `-hover` / `-active` variant.

## Contrast Requirements (WCAG AA)

| Element | Minimum contrast |
| --- | --- |
| Body text vs background | **4.5:1** |
| Large text (≥24px or ≥19px bold) vs background | **3:1** |
| UI components / borders vs adjacent | **3:1** |

```css
/* Safe: text at 20% L on bg at 99% L */
--color-text: oklch(20% 0.02 250);
--color-bg:   oklch(99% 0 0);   /* ~16:1, passes AA & AAA */

/* Interactive accent must also reach 3:1 against its surface */
--color-accent: oklch(55% 0.16 250);  /* check vs --color-surface */
```

Verify every text/background and component/background pair before shipping. Muted text is still text — it must hit 4.5:1.

## Dark / Light Mode Pattern

Drive both themes from one token set, swapping only the role values under a `[data-theme]` or `prefers-color-scheme` selector. Never hardcode raw colors in components.

```css
:root,
[data-theme="light"] {
  --color-bg:      oklch(99% 0 0);
  --color-surface: oklch(96% 0.005 250);
  --color-text:    oklch(20% 0.02 250);
  --color-border:  oklch(88% 0.01 250);
}

[data-theme="dark"] {
  --color-bg:      oklch(18% 0.02 250);
  --color-surface: oklch(24% 0.025 250);
  --color-text:    oklch(95% 0.005 250);
  --color-border:  oklch(40% 0.02 250);
}
```

```css
body { background: var(--color-bg); color: var(--color-text); }
.card { background: var(--color-surface); border: 1px solid var(--color-border); }
```

This guarantees contrast holds in both modes because each role is re-tuned per theme.

## Accent Footprint

The accent color (brand / call-to-action) should occupy **less than 5% of the viewport** at any time. Use it for: primary button, active link underline, focus ring, key data point. Do not paint large surfaces or full backgrounds with the accent.

```css
/* Good: small, intentional accent */
.btn-primary { background: var(--color-accent); }
a.active { border-bottom: 2px solid var(--color-accent); }

/* Bad: entire hero section is accent-colored */
.hero { background: var(--color-accent); }  /* violates <5% rule */
```

## Ban List

- **Pure `#000` / `#fff` as primary colors.** Use `oklch(18% ...)` / `oklch(99% ...)` instead — pure black/white cause harsh halation and fail comfortable contrast tuning.
- **Purple-blue gradients** (`linear-gradient(135deg, #667eea, #764ba2)` and friends) as a default decorative treatment. They read as generic/templated and reduce brand distinction.
- Rainbow or multi-hue gradients for non-data purposes.
- Color used as the *only* signal for state (always pair with text/icon — see interaction-and-states.md).

## Practical Checklist

- [ ] Palette authored in OKLCH.
- [ ] Tokens follow `--color-[role]-[shade]`.
- [ ] All text pairs ≥ 4.5:1; large/UI ≥ 3:1.
- [ ] Dark + light via token swap, no hardcoded colors.
- [ ] Accent covers < 5% of viewport.
- [ ] No pure black/white primaries, no purple-blue gradients.
