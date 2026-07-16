# 19 — Map / Diagram

**Fingerprint:** architecture diagrams, org charts, flows, node-and-edge layouts.

## Structure

```
+---------------------------+
|   Legend + zoom controls  |
+---------------------------+
|                           |
|   [ node ] -- [ node ]    |
|        \     /            |
|        [ node ]           |
|                           |
+---------------------------+
|   Side panel (node info)  |
+---------------------------+
```

## Rules

- Nodes: clear shapes with labels, consistent styling
- Edges: directional arrows, avoid crossing when possible
- Legend: explains node/edge types
- Zoom/pan: required for complex diagrams
- Side panel: details on node select

## Typography

- Heading: display for diagram title
- Node label: 13px medium, legible on node bg
- Legend: 12px muted

## Spacing

- Node padding: `--space-3` (12px)
- Edge spacing: auto-layout with min gap
- Panel width: 280px

## Anti-Patterns

- ❌ Overlapping nodes/edges
- ❌ Unlabeled connections
- ❌ No zoom on large diagrams

## Theme Affinity

- ✅ Lumen, Cobalt
- ❌ Carnival (distracts from structure)
