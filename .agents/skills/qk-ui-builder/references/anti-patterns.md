# Anti-Patterns: AI-Generated and Bad UI Tells

## Visual Tells (10)

### 1. Purple Gradient Everywhere
- **What it looks like:** Deep purple to light purple gradients on buttons, backgrounds, cards, and text.
- **Why it's bad:** Overused in AI-generated templates, creates visual monotony, and often clashes with accessible text contrast.
- **How to fix it:** Use brand colors with intentional gradients only. Reserve gradients for hero sections, not every component.

### 2. Three-Column Icon Cards
- **What it looks like:** Exactly three equal-width cards with a centered icon, title, and short paragraph, repeated across every section.
- **Why it's bad:** AI defaults to symmetry; real design uses asymmetric layouts based on content hierarchy.
- **How to fix it:** Vary card count and layout per section. Use 2, 4, or staggered columns based on actual feature grouping.

### 3. Card-in-Card Syndrome
- **What it looks like:** A white card containing another white card, often with a subtle shadow for the inner card.
- **Why it's bad:** Creates unnecessary visual nesting, increases cognitive load, and wastes whitespace.
- **How to fix it:** Use a single card with distinct internal sections using dividers, spacing, or typography hierarchy instead.

### 4. Glassmorphism Overload
- **What it looks like:** Heavy use of backdrop-blur, semi-transparent white overlays, and frosted glass effects on every surface.
- **Why it's bad:** Performance-heavy, reduces readability, and was a 2021 trend that AI keeps recycling.
- **How to fix it:** Use solid surfaces with subtle shadows. Reserve glassmorphism for one intentional focal element only.

### 5. Gradient Text Headlines
- **What it looks like:** Large headings with background-clip: text showing a purple-to-blue gradient.
- **Why it's bad:** Reduces legibility, especially at smaller sizes, and screams "AI template."
- **How to fix it:** Use solid, high-contrast text colors. If gradient text is used, keep it large and sparingly applied.

### 6. Infinite Hero Carousel
- **What it looks like:** A full-viewport hero with auto-advancing slides, dots navigation, and generic stock imagery.
- **Why it's bad:** Users ignore carousels (low engagement), and AI loves them because they fill space without requiring content decisions.
- **How to fix it:** Use a single, static hero with clear value proposition and a primary CTA. If multiple messages exist, use tabs or stacked sections.

### 7. Floating Blob Backgrounds
- **What it looks like:** Organic blob shapes in pastel gradients positioned absolutely behind content.
- **Why it's bad:** Adds visual noise without information, and AI-generated blobs often have poor color harmony.
- **How to fix it:** Use geometric patterns or subtle texture if background decoration is needed. Remove if it serves no purpose.

### 8. Neon Glow Effects
- **What it looks like:** Box-shadow or text-shadow with bright cyan, magenta, or green glow, especially on dark backgrounds.
- **Why it's bad:** Creates accessibility issues, eye strain, and feels dated/cyberpunk without context.
- **How to fix it:** Use subtle, low-opacity shadows for depth. Reserve glow effects for specific interactive states or dark-mode accents.

### 9. Cookie-Cutter Pricing Tables
- **What it looks like:** Three pricing cards with a highlighted middle tier, checkmark lists, and "Most Popular" badge.
- **Why it's bad:** AI defaults to this structure regardless of actual pricing model. Often hides complex pricing behind a fake choice.
- **How to fix it:** Design pricing based on actual tiers. Use tables for comparison, or cards only if 3-4 distinct plans exist with clear differentiation.

### 10. Gradient Avatars
- **What it looks like:** User avatars with initials on purple/blue gradients instead of actual photos or icons.
- **Why it's bad:** Feels impersonal and lazy. AI uses this to avoid handling image assets.
- **How to fix it:** Use actual user photos, SVG icons, or monogram avatars with a single neutral background color.

## Structural Tells (8)

### 11. AI Nav Fingerprint
- **What it looks like:** Logo left, 4-5 nav links center, "Sign In" and "Sign Up" buttons right. Every site, every time.
- **Why it's bad:** Ignores actual navigation needs. Real sites have different nav structures based on content hierarchy and user flow.
- **How to fix it:** Audit actual user journeys. Include only nav items users need. Consider dropdowns, mobile patterns, or contextual nav.

### 12. AI Footer Fingerprint
- **What it looks like:** Four columns: Product, Company, Resources, Legal. Social icons row. Newsletter signup. Copyright line.
- **Why it's bad:** Generic structure that doesn't reflect site-specific content or legal requirements.
- **How to fix it:** Include only necessary footer links. Group by actual user needs. Remove newsletter if no strategy exists.

### 13. Centered Everything
- **What it looks like:** Every section has centered text, centered buttons, centered cards. Maximum width container with `margin: 0 auto`.
- **Why it's bad:** Creates monotonous rhythm and ignores content alignment needs. Not all content benefits from center alignment.
- **How to fix it:** Left-align body text for readability. Center-align only headlines, CTAs, or short statements that benefit from it.

### 14. Max-Width Container Obsession
- **What it looks like:** Every section constrained to 1200px centered container, even full-width images and backgrounds.
- **Why it's bad:** Breaks immersion for visual content. AI applies container classes indiscriminately.
- **How to fix it:** Use full-width sections for backgrounds and images. Apply max-width only to text content and card grids.

### 15. Section Soup
- **What it looks like:** Every section has identical padding (e.g., `py-20`), creating a rhythmic, repetitive page flow.
- **Why it's bad:** No visual hierarchy. Important sections don't stand out. The page feels mechanical.
- **How to fix it:** Vary section spacing based on content importance. Hero sections need more space. Related content can be tighter.

### 16. H1-H6 Ladder
- **What it looks like:** Every page uses H1, H2, H3, H4, H5, H6 in strict sequential order without skipping.
- **Why it's bad:** Ignores actual content hierarchy. AI thinks headings must always descend sequentially.
- **How to fix it:** Use heading levels based on semantic importance. Skip levels when content structure requires it. Never use H1 more than once per page.

### 17. Infinite Scroll Landing Pages
- **What it looks like:** Long single-column pages where every section stacks vertically with no clear page boundaries.
- **Why it's bad:** Users can't gauge page length or find specific content. AI loves this because it avoids navigation design.
- **How to fix it:** Use clear section breaks, consider a sidebar/table of contents for long pages, or split into multiple pages.

### 18. Three-Point Feature Lists
- **What it looks like:** Every feature section has exactly three bullet points with checkmark icons.
- **Why it's bad:** AI defaults to "rule of three" without content justification. Real feature sets vary in length.
- **How to fix it:** List only actual features. Use 2, 4, 5, or more items as needed. Break into subsections if the list grows.

## Typography Tells (7)

### 19. Font Stack Roulette
- **What it looks like:** Using 3+ different font families across the page (e.g., Inter for body, Playfair for headings, JetBrains Mono for code, plus an icon font).
- **Why it's bad:** Creates visual chaos and slows page rendering. AI samples fonts without considering cohesion.
- **How to fix it:** Use one font family with varying weights and styles. If a second font is needed, use it for one specific purpose only.

### 20. Italic Headlines
- **What it looks like:** H1-H3 headlines rendered in italic font style for emphasis.
- **Why it's bad:** Italic reduces legibility at large sizes. AI uses it to create "variety" without understanding readability.
- **How to fix it:** Use weight (bold/black) and size for hierarchy. Reserve italic for captions, quotes, or emphasized inline text.

### 21. All-Caps Body Text
- **What it looks like:** Paragraphs or long labels rendered in uppercase letters.
- **Why it's bad:** Reduces readability by 10-20%. AI uses all-caps to make text "stand out" without understanding typography.
- **How to fix it:** Use sentence case or title case for body text. Reserve all-caps for short labels (buttons, badges, nav items).

### 22. Comic Sans / Decorative Fonts
- **What it looks like:** Comic Sans, Papyrus, or other novelty fonts used for body text or serious headings.
- **Why it's bad:** Unprofessional and difficult to read at length. AI samples fonts without context awareness.
- **How to fix it:** Use proven, readable fonts. Reserve decorative fonts for one specific, intentional element (e.g., a logo or playful CTA).

### 23. Line Height Neglect
- **What it looks like:** Body text with line-height of 1.0 to 1.2, making paragraphs feel cramped.
- **Why it's bad:** Reduces readability and increases eye strain. AI often inherits tight line-height from code defaults.
- **How to fix it:** Use line-height of 1.5 to 1.7 for body text. Tighter line-height (1.2-1.3) only for large headlines.

### 24. Letter Spacing Abuse
- **What it looks like:** Excessive letter-spacing (0.1em+) on body text or headings to "open up" the design.
- **Why it's bad:** Reduces readability and makes text feel disconnected. AI adds spacing to compensate for poor font choices.
- **How to fix it:** Use the font's default spacing. Slightly increase spacing only for all-caps text (0.05em-0.1em).

### 25. Monospace Body Text
- **What it looks like:** Body paragraphs rendered in monospace fonts like Courier or Fira Code.
- **Why it's bad:** Designed for code, not reading. Low readability for long-form content. AI confuses "developer aesthetic" with readability.
- **How to fix it:** Use proportional sans-serif or serif fonts for body text. Reserve monospace for code blocks and technical data.

## Interaction Tells (10)

### 26. Hover: Scale-105
- **What it looks like:** Every interactive element scales up 5% on hover, especially cards and buttons.
- **Why it's bad:** Causes layout shift, feels janky, and is the default AI interaction pattern with no differentiation.
- **How to fix it:** Use subtle shadow changes, color shifts, or underline animations instead. Scale only for specific focal elements.

### 27. Transition-All
- **What it looks like:** `transition: all 0.3s ease` applied to every element with a hover state.
- **Why it's bad:** Animates properties that don't need animation (like font-size or display), causing unexpected behavior and performance issues.
- **How to fix it:** Animate specific properties: `transition: box-shadow 0.2s, transform 0.2s`. Avoid animating layout properties.

### 28. Bounce Easing
- **What it looks like:** `cubic-bezier(0.68, -0.55, 0.265, 1.55)` or similar bounce effects on buttons and modals.
- **Why it's bad:** Feels unprofessional and playful in inappropriate contexts. Overused in AI-generated demos.
- **How to fix it:** Use ease-out for most interactions. Reserve bounce only for playful, game-like interfaces with clear brand intent.

### 29. Cursor: Pointer Everywhere
- **What it looks like:** `cursor: pointer` applied to cards, images, divs, and non-interactive elements.
- **Why it's bad:** Misleads users into thinking elements are clickable when they aren't.
- **How to fix it:** Apply pointer cursor only to actual links and buttons. Use default cursor for static content.

### 30. Underline on Hover for Everything
- **What it looks like:** Every text link, card, and heading gets an underline animation on hover.
- **Why it's bad:** Creates visual noise and makes it hard to distinguish actual links from decorative elements.
- **How to fix it:** Underline only text links. Use other affordances (color change, arrow icon) for cards and buttons.

### 31. Ripple Effect Overuse
- **What it looks like:** Material Design ripple effect on every button, often implemented with JavaScript.
- **Why it's bad:** Feels dated (2014 called), adds unnecessary JavaScript, and distracts from the action.
- **How to fix it:** Use subtle background-color transitions or scale effects. Remove ripple unless brand guidelines explicitly require it.

### 32. Loading Spinner on Everything
- **What it looks like:** Spinner appears for any action that takes >100ms, even for instant operations.
- **Why it's bad:** Creates perception of slowness. AI adds spinners defensively without measuring actual load times.
- **How to fix it:** Use skeleton loaders for content. Show spinners only for operations >300ms. Consider optimistic UI for fast operations.

### 33. Disabled Button Gray-Out
- **What it looks like:** Buttons turn fully gray with `opacity: 0.5` when disabled, making text unreadable.
- **Why it's bad:** Fails WCAG contrast requirements. Users can't tell if the button is disabled or broken.
- **How to fix it:** Use `opacity: 1` with reduced contrast colors. Add `cursor: not-allowed` and explain why disabled in adjacent text.

### 34. Hover Cards Everywhere
- **What it looks like:** Tooltips, popovers, and preview cards appear on hover for every link and icon.
- **Why it's bad:** Overwhelms users with information. Hover states don't work on touch devices.
- **How to fix it:** Use click or focus triggers for essential information. Reserve hover previews for image galleries or data tables only.

### 35. Animated Gradient Buttons
- **What it looks like:** Buttons with animated gradient backgrounds that shift colors continuously.
- **Why it's bad:** Distracting and reduces perceived button stability. AI loves animated gradients because they look "premium."
- **How to fix it:** Use solid colors with hover state changes. If animation is needed, use subtle pulse or glow, not shifting gradients.

## Copy Tells (5)

### 36. Lorem Ipsum
- **What it looks like:** Placeholder Latin text in headlines, paragraphs, and button labels.
- **Why it's bad:** Makes the design feel unfinished and unprofessional. AI fills space with Lorem Ipsum when lacking content strategy.
- **How to fix it:** Write real copy during design. Use realistic placeholder text that matches the actual content length and tone.

### 37. John Doe / Jane Smith
- **What it looks like:** Generic names, fake email addresses, and placeholder avatars in forms and testimonials.
- **Why it's bad:** Signals incomplete work and lacks authenticity. AI defaults to these names without context.
- **How to fix it:** Use realistic but anonymized data. For user testing, use names like "User A" or role-based labels like "Product Manager."

### 38. Invented Metrics
- **What it looks like:** "10x faster," "99.9% uptime," "500+ features" without source or context.
- **Why it's bad:** Unsubstantiated claims erode trust. AI generates impressive-sounding numbers without data backing.
- **How to fix it:** Use real, verifiable metrics. If exact numbers aren't available, use ranges or qualitative claims ("significantly faster").

### 39. Exclamation Marks Everywhere
- **What it looks like:** Headlines and CTAs ending with "!" or multiple exclamation marks (e.g., "Get Started Now!!!").
- **Why it's bad:** Feels desperate and unprofessional. AI uses exclamation marks to inject enthusiasm without substance.
- **How to fix it:** Use period for most text. Reserve exclamation marks for genuine positive moments (success messages, celebrations).

### 40. "Welcome to Our Website"
- **What it looks like:** Generic welcome headlines, taglines, and meta descriptions that could apply to any company.
- **Why it's bad:** Fails to differentiate the brand. AI generates generic copy because it lacks brand context.
- **How to fix it:** Write value-driven headlines. Answer "Why should I care?" in the first sentence. Include specific differentiators.

## Layout Tells (10)

### 41. Margin: Auto Soup
- **What it looks like:** Excessive use of `margin: auto` for centering, often combined with fixed widths that break on smaller screens.
- **Why it's bad:** Creates fragile layouts that don't adapt. AI overuses auto margins because they "just work" in demos.
- **How to fix it:** Use modern layout systems (Flexbox, Grid) with appropriate alignment properties. Avoid fixed widths with auto margins.

### 42. Horizontal Scroll
- **What it looks like:** Content overflowing viewport width, requiring horizontal scrolling on mobile or desktop.
- **Why it's bad:** Breaks user expectations and creates terrible mobile experience. AI often forgets to constrain content.
- **How to fix it:** Use responsive containers, overflow-wrap, and Flexbox/Grid wrapping. Test at 320px viewport width.

### 43. Equal-Height Card Grids
- **What it looks like:** All cards in a row forced to the same height, with large empty spaces when content varies.
- **Why it's bad:** Wastes space and creates awkward visual rhythm. AI equalizes heights for "clean" appearance.
- **How to fix it:** Let cards size naturally. Use masonry layout or staggered grids if visual alignment is needed.

### 44. Pixel-Perfect Symmetry
- **What it looks like:** Every element mirrored or perfectly aligned to a grid with zero asymmetry.
- **Why it's bad:** Feels sterile and robotic. Real design uses intentional asymmetry for visual interest.
- **How to fix it:** Introduce controlled asymmetry. Offset images, use overlapping elements, or vary card sizes within a grid.

### 45. Infinite Vertical Stack
- **What it looks like:** Content stacked in a single narrow column with max-width 600px, even on wide screens.
- **Why it's bad:** Wastes screen real estate and creates monotonous reading experience.
- **How to fix it:** Use multi-column layouts for related content. Break into side-by-side sections on desktop. Reserve single column for long-form reading.

### 46. Floated Layouts
- **What it looks like:** CSS floats used for multi-column layouts instead of Flexbox or Grid.
- **What it looks like:** Elements clearing incorrectly, collapsed parent containers, and unpredictable wrapping.
- **How to fix it:** Use Flexbox or Grid for all layout purposes. Floats should only be used for wrapping text around images.

### 47. Table-Like Div Structures
- **What it looks like:** Complex nested divs with display: table-cell used to create grid layouts.
- **Why it's bad:** Semantic meaning is lost, accessibility suffers, and responsiveness is nearly impossible.
- **How to fix it:** Use CSS Grid or Flexbox with proper semantic HTML (section, article, aside).

### 48. Z-Index Stacking Context Chaos
- **What it looks like:** Z-index values like 9999, 10000, 999999 used everywhere to fix overlapping elements.
- **Why it's bad:** Creates maintenance nightmares and unexpected stacking. AI throws high z-index values to "fix" layering.
- **How to fix it:** Establish a z-index scale (e.g., 0: base, 10: dropdown, 20: sticky, 30: modal, 40: toast). Document and enforce it.

### 49. Fixed Position Overuse
- **What it looks like:** Multiple fixed-position elements (header, sidebar, chat widget, cookie banner) competing for screen space.
- **Why it's bad:** Reduces usable viewport and creates mobile usability issues. AI adds fixed elements for "convenience."
- **How to fix it:** Limit to one primary fixed element. Use sticky positioning where appropriate. Hide non-essential fixed elements on mobile.

### 50. Whitespace Hoarding
- **What it looks like:** Excessive padding and margins everywhere, creating large empty areas without purpose.
- **Why it's bad:** Forces users to scroll excessively and dilutes content density. AI equates whitespace with "clean design."
- **How to fix it:** Use intentional whitespace. Group related elements tightly. Separate unrelated sections with generous space.

### 51. Viewport Unit Overload
- **What it looks like:** Heights set to `100vh` for every section, causing issues on mobile browsers with dynamic address bars.
- **Why it's bad:** Mobile browsers show/hide address bars, making `100vh` sections jump or overflow.
- **How to fix it:** Use `dvh` (dynamic viewport height) where supported, or let content determine height. Avoid fixed heights for main sections.

## Token Tells (5)

### 52. Hardcoded Hex Values
- **What it looks like:** Colors like `#6366f1`, `#8b5cf6`, `#a855f7` scattered throughout CSS instead of using design tokens.
- **Why it's bad:** Makes theme changes impossible. AI generates hex values because it doesn't understand design token systems.
- **How to fix it:** Define semantic tokens (color-primary, color-text, color-bg) and reference them everywhere. Use HSL for programmatic color manipulation.

### 53. Mid-Render Improvisation
- **What it looks like:** Inline styles or dynamic class names generated at runtime based on content or user input.
- **Why it's bad:** Breaks consistency and makes debugging impossible. AI improvises styles when it can't find a pattern.
- **How to fix it:** Define all styles in CSS/design tokens. Use utility classes or component variants. Never generate styles dynamically from content.

### 54. Off-Scale Spacing
- **What it looks like:** Spacing values like 13px, 27px, 41px that don't fit any established spacing scale.
- **Why it's bad:** Creates visual inconsistency and makes maintenance difficult. AI generates arbitrary values to "make it look right."
- **How to fix it:** Use a defined spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px). Adhere strictly to the scale.

### 55. Token Drift
- **What it looks like:** Similar concepts using different tokens (e.g., `color-primary` for buttons, `color-brand` for links, `color-accent` for highlights).
- **Why it's bad:** Creates confusion and inconsistency. AI invents new tokens instead of reusing existing ones.
- **How to fix it:** Audit token usage regularly. Consolidate duplicate tokens. Document token purpose and usage rules.

### 56. Magic Numbers
- **What it looks like:** Arbitrary values like `top: 37px`, `width: 273px`, `transform: rotate(7deg)` with no explanation or derivation.
- **Why it's bad:** Impossible to maintain or scale. AI generates these to "fix" visual issues without understanding the system.
- **How to fix it:** Derive all values from design tokens or calculations. If a magic number is truly needed, comment why and consider adding it to the token scale.
