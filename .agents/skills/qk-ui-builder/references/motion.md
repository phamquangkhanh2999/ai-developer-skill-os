# Motion

Foundational rules for animation. Motion must feel intentional, fast, and accessible — never decorative bounce or layout-shifting transitions.

## Duration Scale

Use only these durations. Do not invent values like 250ms or 420ms.

```
100ms   micro (hover, toggle, color)
150ms   quick state change
200ms   default UI transition
300ms   panel / menu enter-exit
500ms   large surface / page-level
```

```css
:root {
  --dur-1: 100ms;
  --dur-2: 150ms;
  --dur-3: 200ms;
  --dur-4: 300ms;
  --dur-5: 500ms;
}
```

## Easing

Match easing to the direction of motion:

| Phase | Easing |
| --- | --- |
| Enter (appear) | `ease-out` |
| Exit (disappear) | `ease-in` |
| Continuous transition | `ease-in-out` |

```css
.card { transition: transform var(--dur-3) ease-out, opacity var(--dur-3) ease-out; }
.menu-close { transition: opacity var(--dur-2) ease-in; }
.theme-switch { transition: background-color var(--dur-4) ease-in-out; }
```

## Ban List

- **No bounce / overshoot easing.** Never use `cubic-bezier(0.68, -0.55, 0.265, 1.55)` or any springy curve for UI elements. It reads as unprofessional and slows perceived performance.

```css
/* BANNED */
transition: all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

- **No infinite decorative animations** (marquee, pulsing glow) unless the user explicitly asks.
- **No `transition: all`** — name the specific properties.

## prefers-reduced-motion

Respect the user's OS setting. Under `reduce`, disable transforms/opacity animations and drop durations to **0ms**.

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0ms !important;
    scroll-behavior: auto !important;
  }
}
```

Apply this once globally; do not re-introduce motion for individual elements.

## No Animating Layout Properties

Never animate `width`, `height`, `padding`, `margin`, or `top/left`. These trigger layout/paint reflows and jank. Animate only **transform** and **opacity** (compositor-only).

```css
/* Good: animate transform/opacity only */
.modal { opacity: 0; transform: translateY(8px); transition: opacity var(--dur-3) ease-out, transform var(--dur-3) ease-out; }
.modal.open { opacity: 1; transform: translateY(0); }

/* Bad: animates layout */
.panel { transition: height 300ms ease; }   /* reflows, janky */
```

For elements that change size (expand/collapse), use `transform: scaleY()` or animate `grid-template-rows: 0fr → 1fr` instead of height.

## Practical Checklist

- [ ] Durations only from the 5-step scale.
- [ ] ease-out enter / ease-in exit / ease-in-out transition.
- [ ] No bounce bezier, no `transition: all`, no infinite decoration.
- [ ] `prefers-reduced-motion` zeroes all motion.
- [ ] Only `transform` / `opacity` are animated.
