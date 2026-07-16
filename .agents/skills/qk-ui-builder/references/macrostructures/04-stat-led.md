# 04 — Stat-Led

**Fingerprint:** metrics-first, big numbers above the fold, analytics dashboards, KPI summaries.

## Structure

```
+---------------------------+
|   Title + Date Range      |
+------+------+------+------+
|  KPI |  KPI |  KPI |  KPI |
|  123 |  45% |  8.2 |  99  |
+------+------+------+------+
|   Primary Chart / Table   |
|   (trend, breakdown)      |
+---------------------------+
|   Secondary charts row    |
+---------------------------+
```

## Rules

- KPI row: 4 cards on desktop, 2 on tablet, 1 on mobile
- Each KPI: value (display), label (muted), delta (up/down color)
- Primary chart: spans full width below KPIs
- Delta: green for positive, red for negative, semantic colors only

## Typography

- Heading: display weight, tabular-nums for values
- KPI value: largest scale, tabular-nums
- Labels: 13px muted uppercase

## Spacing

- KPI gap: `--space-4` (16px)
- Card padding: `--space-5` (20px)
- Section gap: `--space-6` (24px)

## Anti-Patterns

- ❌ Decorative number animation without context
- ❌ Mixing units without labels
- ❌ Charts without axis or legend

## Theme Affinity

- ✅ Cobalt, Lumen
- ⚠️ Hum (needs stronger number contrast)
