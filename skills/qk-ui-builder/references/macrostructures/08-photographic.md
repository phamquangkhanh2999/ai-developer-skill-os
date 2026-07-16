# 08 — Photographic

**Fingerprint:** image-heavy, full-bleed photos, portfolios, travel, minimal chrome.

## Structure

```
+---------------------------+
|   Minimal Nav (overlay)   |
+---------------------------+
|                           |
|   [ FULL-BLEED IMAGE ]    |
|                           |
+------+------+-------------+
| img  | img  |  img        |
+------+------+-------------+
|   Caption / story text    |
+---------------------------+
```

## Rules

- Images: full-bleed or near-full-bleed, high resolution
- Nav: transparent overlay, becomes solid on scroll
- Captions: small, muted, placed under or beside image
- Limit text; let images carry the narrative
- Lazy-load below-fold images

## Typography

- Heading: display or editorial, often white over image
- Caption: 13px muted, body font
- Body: minimal, max-width 60ch

## Spacing

- Image gap: `--space-2` (8px) or 0 for bleed
- Caption margin-top: `--space-3` (12px)
- Section gap: `--space-10` (40px)

## Anti-Patterns

- ❌ Heavy UI chrome over photos
- ❌ Low-res stretched images
- ❌ Text that competes with imagery

## Theme Affinity

- ✅ Carnival, Hum
- ❌ Cobalt (too utilitarian)
