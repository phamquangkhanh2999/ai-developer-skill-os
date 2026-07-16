# 03 — Marquee Hero

**Fingerprint:** full-width hero, motion/marquee or autoplay carousel, high-contrast headline, marketing.

## Structure

```
+---------------------------+
|   Nav (transparent)       |
+---------------------------+
|                           |
|   BIG HEADLINE            |
|   subhead + CTA           |
|                           |
|  [==== marquee =====]     |
|  [ scroll / carousel ]    |
+---------------------------+
|   Trust logos / stats     |
+---------------------------+
```

## Rules

- Hero: full viewport-ish height (min 70vh) on desktop
- Marquee: infinite horizontal scroll or autoplay carousel, pausable on hover
- Headline: one dominant message, max 2 lines
- CTA: primary action, high contrast against hero bg
- Respect `prefers-reduced-motion` (disable auto-animation)

## Typography

- Heading: display style, largest scale in system
- Subhead: body or medium weight, muted
- Marquee text: mono or uppercase label

## Spacing

- Hero padding: `--space-10` (40px)
- Marquee height: 64px
- CTA margin-top: `--space-6` (24px)

## Anti-Patterns

- ❌ Multiple competing CTAs
- ❌ Autoplay that can't be paused
- ❌ Hero text low contrast over image

## Theme Affinity

- ✅ Carnival, Cobalt
- ❌ Hum (too understated for hero theater)
