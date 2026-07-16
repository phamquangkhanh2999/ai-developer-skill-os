# 14 — Narrative Workflow

**Fingerprint:** vertical scroll, step-by-step progression, progress indicator, one primary action per screen.

## Structure

```
+---------------------+
|     Progress Bar    |
+---------------------+
|                     |
|   Step Content      |
|   (text + media)    |
|   [Primary Action]  |
+---------------------+
|   Skip / Back       |
+---------------------+
```

## Rules

- Max 1 primary action per step
- Progress bar always visible
- Steps must have clear entry/exit criteria
- Support keyboard navigation (Enter = next, Backspace = back)

## Typography

- Heading: display style, 1 per step
- Body: body font, max-width 65ch
- Helper text: muted color, 14px

## Spacing

- Step padding: `--space-8` (32px)
- Action margin-top: `--space-6` (24px)
- Progress bar height: 4px

## Anti-Patterns

- ❌ Multiple CTAs per step
- ❌ Progress bar that doesn't reflect actual state
- ❌ Steps that require going back to change data

## Theme Affinity

- ✅ Hum, Cobalt
- ⚠️ Carnival (can work but needs restraint)
