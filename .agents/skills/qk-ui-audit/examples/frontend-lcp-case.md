# Executable Case Study: qk-ui-audit LCP Breach Analysis

Skill: `qk-ui-audit` (v2.0.0)
Case ID: `CASE-FE-PERF-LCP-001`
Target Component: `src/components/HeroBanner.tsx`

---

## 1. Context & Execution Log

Skill receives invocation: `./qk-ui-audit --url=http://localhost:3000/dashboard`

```text
[EDAOS Router] Resolving capabilities for qk-ui-audit...
[EDAOS Router] browser.performance -> chrome-devtools-provider (Rank: 0.94)
[EDAOS Router] ui.capture -> playwright-mcp-provider (Rank: 0.91)

[Observe Processor] Capturing runtime metrics from target...
[Normalize Processor] Observation normalized: { LCP: 3800ms, CLS: 0.02, TTFB: 210ms }

[Interpret Processor] Evaluating against POL-FE-PERF-CORE-01...
[Interpret Processor] LCP (3800ms) > Target (2500ms) -> Evidence FAIL (+52% delta, Confidence: 0.838)

[Correlate Processor] Root-cause Finding synthesized:
  Culprit: Hero main PNG asset (1.4MB) lacking <link rel="preload">
  Exonerated: ProductGrid.tsx, Header.tsx

[Rule Engine] Applied Rule 'frontend.performance.hero_render_optimization'
[Rule Engine] Formulated Decision: OPTIMIZE_RESOURCE_LOADING (Preload WebP Hero Asset)

[Planner] Generated Action Plan (ACT-2026-PRELOAD-01)
[Planner] Handoff Action Plan to `./qk-bug-resolution` for code execution.
```
