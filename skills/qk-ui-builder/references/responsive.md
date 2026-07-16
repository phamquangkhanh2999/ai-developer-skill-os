# Responsive

Foundational rules for building layouts that adapt across screen sizes without breaking, horizontal scroll, or un-tappable controls.

## Breakpoints

Use this standard scale. Build **mobile-first** (base styles = small screens, then enhance upward).

```
sm   640px
md   768px
lg   1024px
xl   1280px
```

```css
/* mobile-first: base = mobile, then min-width queries */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

## Mobile: Stack Vertically

On small screens, lay content out in a **single vertical column**. Never require horizontal scrolling for core content.

```css
.layout {
  display: grid;
  grid-template-columns: 1fr;          /* stacked on mobile */
  gap: var(--space-6);
}
@media (min-width: 768px) {
  .layout { grid-template-columns: 240px 1fr; }  /* sidebar + content */
}
```

```css
/* Guard against accidental horizontal overflow */
html, body { overflow-x: hidden; max-width: 100%; }
img, video, table { max-width: 100%; }
```

## Touch Targets: Min 44×44px

Every interactive control must be at least **44×44px** to be comfortably tappable. Don't let padding shrink the hit area below this.

```css
.btn, .nav-link, .icon-button {
  min-height: 44px;
  min-width: 44px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2) var(--space-4);
}
```

## Fluid Typography with clamp()

Use `clamp()` for headings/hero text so type scales smoothly between breakpoints without abrupt jumps.

```css
h1 {
  /* min 32px, preferred 5vw, max 64px */
  font-size: clamp(2rem, 5vw, 4rem);   /* 32px → 64px */
}
h2 {
  font-size: clamp(1.5rem, 3vw, 2rem); /* 24px → 32px */
}
```

Keep body text near `--text-base` (16px) for readability; reserve clamp() for display sizes.

## Image Grids: minmax(0, 1fr)

For responsive image/card grids, use `minmax(0, 1fr)` so items shrink properly and never overflow. Fixed-width columns break on mobile.

```css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(0, 1fr));
  gap: var(--space-4);
}
@media (min-width: 640px)  { .gallery { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .gallery { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
```

```css
.gallery img { width: 100%; height: 100%; object-fit: cover; display: block; }
```

## Desktop Container

Cap desktop content at 1200px and center (see layout-and-space.md). On mobile it becomes 100% width with safe padding.

```css
.container {
  width: 100%;
  max-width: 1200px;
  margin-inline: auto;
  padding-inline: var(--space-4);
}
@media (min-width: 768px) { .container { padding-inline: var(--space-6); } }
```

## Practical Checklist

- [ ] Mobile-first with sm/md/lg/xl breakpoints.
- [ ] Mobile stacks vertically; no horizontal scroll.
- [ ] All tap targets ≥ 44×44px.
- [ ] Display type uses `clamp()` for fluid scaling.
- [ ] Image/card grids use `minmax(0, 1fr)`.
- [ ] Desktop content capped at 1200px.
