# 17 — Type Specimen

**Fingerprint:** typography showcase, design system docs, font scales on display.

## Structure

```
+---------------------------+
|   Typeface name + meta    |
+------+--------------------+
| Spec |  Glyph / alphabet  |
| nav  |  Aa Bb Cc ...       |
|      |  Weight row         |
+------+--------------------+
|   Scale / line-height     |
+---------------------------+
```

## Rules

- Show full character set and key glyphs
- Display each weight (light → black) with label
- Type scale: list sizes with px/rem and usage
- Sample text: pangram + real paragraph
- Nav: jump to typeface sections

## Typography

- Specimen: the typeface itself, all sizes
- Labels: mono, 12px muted for metadata
- Sample: body font fallback noted

## Spacing

- Specimen padding: `--space-8` (32px)
- Weight row gap: `--space-4` (16px)
- Nav width: 200px

## Anti-Patterns

- ❌ Showing only one weight
- ❌ No scale reference
- ❌ Illegible specimen background

## Theme Affinity

- ✅ Lumen, Cobalt
- ❌ Hum (too quiet for showcase)
