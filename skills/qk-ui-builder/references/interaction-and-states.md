# Interaction & States

Foundational rules for interactive element states. Every interactive control must define a complete, accessible state set — not just default and hover.

## The 8 States

Every interactive component should account for:

1. **default** — resting, ready to interact.
2. **hover** — pointer is over (pointer devices only).
3. **focus** — keyboard / programmatic focus.
4. **active** — being pressed/clicked.
5. **disabled** — not interactive, clearly shown.
6. **loading** — work in progress, feedback given.
7. **error** — invalid input or failed action, with message.
8. **success** — completed action, confirmed.

```css
.btn { /* default */ }
.btn:hover { background: var(--color-accent-hover); }
.btn:focus-visible { /* focus ring */ }
.btn:active { transform: translateY(1px); }
.btn:disabled { /* disabled */ }
```

## Focus: Visible Ring

Always provide a visible focus indicator. **Never** use `outline: none` without a replacement. Use `:focus-visible` so mouse users aren't spammed but keyboard users are clearly shown.

```css
.btn:focus { outline: none; }              /* remove default */
.btn:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  /* or a ring via box-shadow */
  box-shadow: 0 0 0 3px oklch(55% 0.16 250 / 0.4);
}
```

The focus ring must meet 3:1 contrast against adjacent colors.

## Disabled: Not Opacity-Only

A disabled control must combine **reduced opacity** with **`cursor: not-allowed`** and remain non-interactive. Opacity alone is insufficient and confusing.

```css
.btn:disabled,
.btn[aria-disabled="true"] {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;   /* or guard in JS */
}
```

Also dim/hide associated helper text appropriately, and keep the control in the a11y tree (use `aria-disabled` rather than removing the element).

## Loading: Skeleton or Spinner

While awaiting data or an action, show a **skeleton** or **spinner** — never bare "Loading..." text.

```css
/* Skeleton shimmer */
.skeleton {
  background: linear-gradient(90deg, var(--color-surface) 25%, var(--color-border) 50%, var(--color-surface) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s ease-in-out infinite;
  border-radius: 6px;
}
@keyframes shimmer { to { background-position: -200% 0; } }
```

```html
<!-- Button loading: keep label, add spinner, disable -->
<button class="btn" disabled aria-busy="true">
  <span class="spinner" aria-hidden="true"></span> Saving
</button>
```

For data regions, render skeleton placeholders preserving layout to avoid shift (see motion.md: no layout animation).

## Error: Clear Message + Retry

Error states must surface a **human-readable message** and, when recoverable, a **retry / fix action**.

```html
<div class="field error">
  <label for="email">Email</label>
  <input id="email" aria-invalid="true" aria-describedby="email-err" />
  <p id="email-err" class="error-msg">Enter a valid email like name@example.com.</p>
</div>
```

```css
.field.error input { border-color: var(--color-error); }
.error-msg { color: var(--color-error); font-size: var(--text-sm); }
```

Convey error with more than color (icon + text) for accessibility.

## Success

Confirm completed actions with a brief, non-blocking indicator. Keep it subtle and auto-dismiss where appropriate.

```css
.toast.success { background: var(--color-success); color: oklch(99% 0 0); }
```

## Practical Checklist

- [ ] All 8 states defined per interactive component.
- [ ] Focus uses `:focus-visible` ring, no naked `outline: none`.
- [ ] Disabled = opacity + `cursor: not-allowed` + inert.
- [ ] Loading uses skeleton/spinner, not text-only.
- [ ] Error shows message + retry and isn't color-only.
- [ ] Success confirmation is present and subtle.
