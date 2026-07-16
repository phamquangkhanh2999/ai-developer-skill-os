# Anti-Slop Checklist — 57 Points
> Referenced by: `qk-ui-audit/SKILL.md`
> Purpose: Full inspection checklist for detecting generic AI-generated UI

---

## Category P1: Accessibility (15 pts)

| # | Check | Points | How to Verify |
|---|-------|--------|---------------|
| 1 | All images have `alt` text (non-empty, descriptive) | 2 | grep `alt=""` or `alt={` in JSX |
| 2 | Color contrast ratio ≥ 4.5:1 (text) / 3:1 (large text) | 3 | Check computed HSL values vs background |
| 3 | All interactive elements have `aria-label` if no visible text | 2 | grep for `<button>` without text content |
| 4 | Focus states are visible — `outline: none` not used without replacement | 2 | Check CSS for `outline: none` |
| 5 | Keyboard navigation works (Tab order logical) | 2 | `tabIndex` only for non-interactive elements |
| 6 | `role` attributes used for non-semantic elements (div acting as button) | 2 | grep `onClick` on non-button elements |
| 7 | Form inputs have associated `<label>` (htmlFor) | 2 | grep `<input` without surrounding `<label` |

---

## Category P2: Layout & Spacing (15 pts)

| # | Check | Points | How to Verify |
|---|-------|--------|---------------|
| 8 | No hardcoded pixel spacing — uses design token scale (4, 8, 16, 24...) | 3 | grep `padding: [0-9]px` or `margin: [0-9]px` |
| 9 | CSS Grid or Flexbox used — no `position: absolute` for layout | 2 | grep `position: absolute` in layout context |
| 10 | Consistent spacing unit (not mixing 5px, 7px, 11px random values) | 2 | Check spacing values across components |
| 11 | No `div` soup — semantic HTML used (article, section, nav, main, aside) | 2 | grep excessive `<div>` nesting |
| 12 | Component has defined max-width (not stretching to 100vw on desktop) | 2 | Check container max-width |
| 13 | Whitespace feels intentional — content is not cramped | 2 | Visual check or spacing scale adherence |
| 14 | No horizontal overflow on mobile (320px viewport) | 2 | Check for `overflow-x: hidden` band-aids |

---

## Category P3: Typography & Colors (15 pts)

| # | Check | Points | How to Verify |
|---|-------|--------|---------------|
| 15 | Font families from DESIGN.md only (no Times New Roman, Arial default) | 3 | grep `font-family:` vs DESIGN.md |
| 16 | Font sizes use token scale — no arbitrary px values | 2 | grep `font-size: [0-9]` raw values |
| 17 | Colors use DESIGN.md tokens — no hardcoded hex (#ff0000) or rgb() | 3 | grep `#[0-9a-fA-F]{3,6}` in CSS/JSX |
| 18 | No pure black (#000000) or pure white (#ffffff) — use near-black/near-white | 2 | grep `#000\|#000000\|#fff\|#ffffff` |
| 19 | Color palette is harmonious — not "rainbow slop" (5+ unrelated colors) | 2 | Count distinct hues in palette |
| 20 | Heading hierarchy correct — one `<h1>` per page, no skipping levels | 1 | grep heading tags per page |
| 21 | Line height appropriate (1.4–1.7 for body, 1.1–1.3 for headings) | 2 | Check `line-height` values |

---

## Category P4: Interactions & Animations (15 pts)

| # | Check | Points | How to Verify |
|---|-------|--------|---------------|
| 22 | Every button has hover state — color shift OR shadow change | 2 | grep `:hover` for button styles |
| 23 | Every button has focus-visible state | 2 | grep `:focus-visible` |
| 24 | Active/pressed state exists for clickable elements | 1 | grep `:active` |
| 25 | Transition duration from DESIGN.md — not raw `0.3s` everywhere | 2 | grep `transition:` vs token values |
| 26 | No janky instant state changes — all transitions ≥ 100ms, ≤ 400ms | 2 | grep transition durations |
| 27 | Animations respect `prefers-reduced-motion` | 2 | grep `prefers-reduced-motion` in CSS |
| 28 | Links have hover underline OR color change (not just cursor pointer) | 2 | grep `a:hover` styles |
| 29 | Form validation feedback uses animation (shake, pulse) not just color | 2 | Check error state CSS |

---

## Category P5: Anti-Slop Detection (15 pts)

| # | Check | Points | How to Verify |
|---|-------|--------|---------------|
| 30 | No Bootstrap/generic UI kit classes (btn-primary, card, badge) | 2 | grep `class="btn\|card\|badge\|modal"` |
| 31 | No Tailwind utility spam (> 15 classes on single element) | 2 | grep extremely long className strings |
| 32 | No Lorem Ipsum or placeholder text in production UI | 3 | grep `Lorem ipsum\|placeholder text` |
| 33 | Color palette is NOT blue-gray default (slop signature) | 2 | Check if primary color is `hsl(210, *)` Tailwind default |
| 34 | Layout is NOT a simple centered card on white background (slop template) | 2 | Structural check |
| 35 | Gradient usage is intentional — not `linear-gradient(to bottom, #fff, #f0f0f0)` | 2 | grep gradient definitions |
| 36 | No `box-shadow: 0 2px 4px rgba(0,0,0,0.1)` everywhere (Bootstrap shadow) | 2 | grep this exact shadow pattern |

---

## Category P6: Performance & Best Practices (10 pts)

| # | Check | Points | How to Verify |
|---|-------|--------|---------------|
| 37 | Images have `loading="lazy"` for below-fold content | 2 | grep `<img` without `loading` |
| 38 | No `!important` overrides (except CSS reset) | 1 | grep `!important` in component CSS |
| 39 | No inline styles except dynamic values | 2 | grep `style={{` in non-dynamic contexts |
| 40 | Component file ≤ 300 lines | 1 | Line count check |
| 41 | No unused CSS classes or dead styles | 1 | Visual code scan |
| 42 | SVG icons used instead of emoji for UI elements | 1 | grep emoji characters in JSX |
| 43 | `key` prop used correctly in lists (not index as key for dynamic lists) | 2 | grep `.map(` + check key prop |

---

## Category BONUS: Mobile & Cross-Browser (5 pts extra)

| # | Check | Points | How to Verify |
|---|-------|--------|---------------|
| 44 | Touch targets ≥ 44×44px on mobile | 1 | Check button/link dimensions |
| 45 | No hover-only interactions (mobile has no hover) | 1 | Check if critical info only on hover |
| 46 | Custom fonts have system-ui fallback | 1 | Check font-family fallback stack |
| 47 | Input types correct: email, tel, number, date (triggers correct mobile keyboard) | 1 | grep `<input type=` |
| 48 | No `position: fixed` elements blocking content on small screens | 1 | Check fixed/sticky headers/footers |

---

## Extended Checks (9 additional points for comprehensive audit)

| # | Check | Category |
|---|-------|---------|
| 49 | Loading skeleton matches actual content shape (not generic gray bars) | UX |
| 50 | Empty state has illustration + helpful action button (not just "No data") | UX |
| 51 | Error state specifies the error — not generic "Something went wrong" | UX |
| 52 | Success feedback is clear — confirmation message or visual indicator | UX |
| 53 | Destructive actions (delete) require confirmation dialog | Safety |
| 54 | Modals/dialogs have accessible `role="dialog"` + focus trap | A11y |
| 55 | Scrollable areas have visible scroll indicator | UX |
| 56 | Data tables have sortable columns if > 10 rows | UX |
| 57 | Forms have autofocus on first input (modal forms) | UX |

---

## Scoring Summary

| Category | Max Points |
|----------|-----------|
| P1 Accessibility | 15 |
| P2 Layout & Spacing | 15 |
| P3 Typography & Colors | 15 |
| P4 Interactions & Animations | 15 |
| P5 Anti-Slop Detection | 15 |
| P6 Performance | 10 |
| **Base Total** | **85** |
| BONUS Mobile | +5 |
| Extended (49–57) | +9 |
| **Maximum Possible** | **99** |

**Pass threshold: ≥ 76 / 85 base (90%) — PASS**
**Fail: < 76 / 85 — requires redesign, not patch**
