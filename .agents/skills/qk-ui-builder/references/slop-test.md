# Slop Test — 58 Anti-Slop Gates

Run this checklist AFTER every build. Every answer must be **NO**.

## Pre-Emit Self-Critique (Score 1–5 on each axis)

| Axis | Question | Score |
|------|----------|-------|
| Philosophy | Does this serve the user, or just show off? | ___ |
| Hierarchy | Is the visual hierarchy clear within 3 seconds? | ___ |
| Execution | Is every interaction polished, not just present? | ___ |
| Specificity | Does this feel made for this brief, not generic? | ___ |
| Restraint | Could anything be removed without losing meaning? | ___ |
| Variety | Would a second page feel different, not a color-swap? | ___ |

**Rule:** Any axis < 3 → revise before continuing.

---

## Visual Gates (1–7)

- [ ] **1.** No banned fonts: Inter, Roboto, Arial, system-ui as primary identity font
- [ ] **2.** No purple-blue gradients (`linear-gradient(135deg, #a855f7, #3b82f6)`)
- [ ] **3.** No gradient text (`background-clip: text`)
- [ ] **4.** No 3-equal-column icon cards
- [ ] **5.** No card-in-card layouts (card inside card inside card)
- [ ] **6.** No side-stripe cards (left border accent only)
- [ ] **7.** No centred-everything hero (all content centered with max-width)

## Structural Gates (8–9)

- [ ] **8.** No AI-template reuse (same fingerprint as prior build in project)
- [ ] **9.** Sections separated by more than whitespace (use dividers, headings, or background changes)

## Microinteraction Gates (10–19)

- [ ] **10.** No `transition-all` on interactive elements
- [ ] **11.** No `hover:scale-105` without context
- [ ] **12.** No `cubic-bezier(0.68, -0.55, 0.265, 1.55)` (bounce easing)
- [ ] **13.** No more than 2 hover effects per element
- [ ] **14.** No animating layout props (width, height, padding)
- [ ] **15.** No animated focus ring (focus state must be instant)
- [ ] **16.** No celebratory toasts/confetti on load
- [ ] **17.** No equal hover/focus tooltip delay
- [ ] **18.** No auto-rotating carousel without pause-on-hover
- [ ] **19.** No placeholder names (John Doe, Jane Smith, etc.)

## Variety Gates (20–21)

- [ ] **20.** Macrostructure stamp present in CSS comment
- [ ] **21.** Not Specimen fall-through (every brief needs a real macrostructure)

## Implementation Gates (22–27)

- [ ] **22.** No zero-chroma neutrals (`hsl(0, 0%, X%)` as primary)
- [ ] **23.** Accent color footprint < 5% of viewport
- [ ] **24.** Spacing follows scale (no off-scale values like 13px, 27px)
- [ ] **25.** Prose measure between 45–75ch
- [ ] **26.** All interactive elements have focus, active, disabled states
- [ ] **27.** Motion has `prefers-reduced-motion` fallback

## Hero Enrichment Gates (28–31)

- [ ] **28.** No autoplay-with-sound video
- [ ] **29.** No over-busy abstract background (more than 2 visual layers)
- [ ] **30.** No mixed icon libraries or emoji icons in professional UI
- [ ] **31.** No Lottie animation when CSS transition would suffice

## Diversification Gates (32–33)

- [ ] **32.** Same archetype not repeated without varied knob (size, color, layout)
- [ ] **33.** Decorative SVG/figure has `aria-hidden="true"` or meaningful `role`

## Layout-Safety Gates (34–36)

- [ ] **34.** No horizontal scroll (`overflow-x: clip` on html+body)
- [ ] **35.** No misplaced decorative text effects (text-shadow as decoration)
- [ ] **36.** Interactive bars centered (not left-aligned with unbalanced whitespace)

## Typography Gates (37–38a)

- [ ] **37.** No more than 3 font families
- [ ] **38.** No outlier font used in > 2 slots
- [ ] **38a.** No italic headers (headers use weight, not style)

## Input-State Gates (39)

- [ ] **39.** No border-width shift on focus, no border-built focus ring, no input/button height mismatch, no collapsed helper text, no opacity-only disabled

## Contrast Gates (40–41)

- [ ] **40.** WCAG 2.1 AA contrast (4.5:1 for text, 3:1 for large text)
- [ ] **41.** No ink-on-ink (same color for text and background with only opacity difference)

## Chrome Gates (42–45)

- [ ] **42.** No AI nav fingerprint (centered logo, pill nav, gradient CTA)
- [ ] **43.** No AI footer fingerprint (3 columns: Product, Company, Legal, social icons row)
- [ ] **44.** Hero fits viewport (no excessive height)
- [ ] **45.** Decorative elements have purpose or removed

## Honest Copy Gate (46)

- [ ] **46.** No invented metrics ("10x faster", "100% secure", "trusted by 10,000+")

## Re-Drawn Chrome Gate (47)

- [ ] **47.** No fake browser/phone/code/IDE chrome unless building a mockup tool

## Token Discipline Gate (48)

- [ ] **48.** No mid-render token improvisation (all values from DESIGN.md or theme)

## Responsive Clickable Gate (49)

- [ ] **49.** No two-line clickable text (buttons/links max 1 line)

## Mobile Non-Negotiables (50–57)

- [ ] **50.** Image grids use `minmax(0, 1fr)` not fixed widths
- [ ] **51.** Long words wrap (`overflow-wrap: break-word`)
- [ ] **52.** Mobile section-head collapse (h1 reduces size on small screens)
- [ ] **53.** Radio-tab scroll-jump prevented
- [ ] **54.** No tag-beside-heading on mobile (stack vertically)
- [ ] **55.** All-caps line-height collision avoided (`letter-spacing: 0.05em` minimum)
- [ ] **56.** Sticky header doesn't bleed into content
- [ ] **57.** Studied DNA not discarded (if `--study` was used, its output must be referenced)

---

## Final Gate

- [ ] **58.** Pre-emit self-critique average ≥ 3.0 on all 6 axes

**Pass condition:** All 58 gates = NO. Any YES → fix before shipping.
