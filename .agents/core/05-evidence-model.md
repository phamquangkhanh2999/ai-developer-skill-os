# EDAOS Core: Measurement & Evidence System Specification

Version: 1.0.0
Status: APPROVED
Domain: Core Architecture Specification
File: 05-evidence-model.md

---

## 1. Overview & Architectural Role

The **Measurement & Evidence System** forms the empirical foundation of EDAOS. It establishes the rigid transformation framework that converts raw, noisy execution signals into validated evidence, composite findings, and reusable organizational insights.

This system guarantees that EDAOS remains strictly **Evidence-Driven**, eliminating guesswork, magic numbers, and tool lock-in.

```
┌────────────────────────────────────────────────────────────────────────┐
│ LEVEL 0: SIGNAL         (Chrome Trace, HAR, Screenshot, Lighthouse)    │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼
┌────────────────────────────────────────────────────────────────────────┐
│ LEVEL 1: OBSERVATION    (Fact without interpretation: LCP = 3.8s)      │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼ (+ Policy & Context)
┌────────────────────────────────────────────────────────────────────────┐
│ LEVEL 2: EVIDENCE       (LCP 3.8s vs Policy 2.5s -> Status: FAIL)        │
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼ (Evidence Composition)
┌────────────────────────────────────────────────────────────────────────┐
│ LEVEL 3: FINDING        (Diagnostic Hypothesis: Hero Image Render Block)│
└────────────────────────────────────────────────────────────────────────┘
                                   │
                                   ▼ (Synthesis across projects)
┌────────────────────────────────────────────────────────────────────────┐
│ LEVEL 4: INSIGHT        (Knowledge: Hero Preload reduces LCP by 41%)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. The 5 Abstraction Levels

### Level 0 — Signal
* **Definition**: Raw, unparsed data streams or files emitted directly by underlying providers and MCPs.
* **Examples**: `trace.json`, `network.har`, `screenshot.png`, `React Fiber dump`, `Console log stream`.
* **State**: Unprocessed. Signal carries no domain meaning until parsed.

---

### Level 1 — Observation
* **Definition**: Standardized, objective metrics extracted from Signals. Represents **uninterpreted facts**.
* **Invariant**: Must specify metric name, value, unit, timestamp, and source provider.
* **Examples**: 
  - `LCP = 3.8s`
  - `Bundle Size = 842 KB`
  - `DOM Layout Shift Count = 14`

---

### Level 2 — Evidence
* **Definition**: An Observation evaluated strictly against a **Policy Contract** within an explicit execution context.
* **Formula**: $\text{Evidence} = \text{Observation} + \text{Policy} + \text{Context}$
* **Invariant**: Cannot exist without an explicit `policy_ref` and `status` (PASS | FAIL | WARNING).
* **Examples**:
  - `LCP (3.8s) vs Performance Policy (2.5s) -> Status: FAIL`

---

### Level 3 — Finding
* **Definition**: Diagnostic root-cause hypothesis synthesized from one or more composed Evidences.
* **Examples**:
  - `Hero Banner asset lacks <link rel="preload"> tag, causing 1.3s render delay.`

---

### Level 4 — Insight
* **Definition**: Cross-project organizational knowledge pattern extracted by the Learning Engine.
* **Examples**:
  - `WebP conversion + preload tag consistently reduces LCP by ~41% on SSR React pages.`

---

## 3. Provider-Independent Taxonomy

Evidence categories in EDAOS are strictly **Provider-Independent**. Processors and Skills interact with categories, never tool names.

| Category | Domain Scope | Example Evidence Types |
| :--- | :--- | :--- |
| **Performance** | Core Web Vitals, Latency, CPU, Memory | `LCP`, `INP`, `CLS`, `TTFB`, `MemoryLeak` |
| **Accessibility** | ARIA, Contrast, Keyboard, Screen Reader | `ColorContrast`, `MissingAltText`, `FocusTrapping` |
| **Security** | Vulnerabilities, Injection, Auth, CORS | `XSSRisk`, `UnsanitizedInput`, `PolicyViolation` |
| **Visual** | Layout, Diff, Responsiveness, Overflows | `PixelDiffOverflow`, `ComponentMisalignment` |
| **Runtime** | Unhandled Exceptions, Promise Rejections | `ConsoleError`, `UncaughtException` |
| **Network** | Payload, Caching, Headers, Waterfalls | `UncompressedAsset`, `CacheControlMissing` |
| **Code Quality** | Complexity, Smells, Duplication, Debt | `CyclomaticComplexity`, `DeadCode` |
| **Architecture** | Component Dependencies, Circular Refs | `CircularDependency`, `LayerViolation` |
| **Dependency** | Vulnerable Packages, Version Drift | `OutdatedPackage`, `VulnerableDependency` |
| **UX** | Interaction Delays, Cumulative Shift | `LayoutShiftTrigger`, `ClickLatency` |

---

## 4. Canonical Evidence Contract

All Evidences emitted by the system conform to a unified contract schema:

```yaml
EvidenceContract:
  evidence_id: EVI-2026-PERF-0981
  category: Performance
  kind: LCPBreach

  observation_ref: OBS-2026-00412
  policy_ref: POL-FE-PERF-01

  status: FAIL # PASS | FAIL | WARNING | UNKNOWN
  severity: HIGH # CRITICAL | HIGH | MEDIUM | LOW | INFO

  confidence_breakdown:
    measurement_confidence: 0.98   # Provider accuracy
    interpretation_confidence: 0.95 # Policy alignment accuracy
    correlation_confidence: 0.88    # Diagnostic link accuracy
    composite_confidence: 0.82      # Product of all three

  scope:
    file: "src/components/HeroBanner.tsx"
    selector: "div.hero-banner > img"
    line_range: "42-58"

  artifact_refs:
    - ART-SCREENSHOT-001
    - ART-TRACE-002

  timestamp: "2026-07-22T10:03:00Z"
```

---

## 5. Evidence Bundles & Composition

Skills in EDAOS do not consume isolated Evidences. They consume **Evidence Bundles** to evaluate holistic system health.

```
                    ┌──────────────────────────┐
                    │    Performance Bundle    │
                    └────────────┬─────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         ▼                       ▼                       ▼
   [LCP Evidence]         [CLS Evidence]          [INP Evidence]
```

### Composition Engine
Multiple Evidences can be combined using logical Operators (`AND`, `OR`, `WEIGHTED_SUM`) to synthesize a single `Finding`:

$$\text{Finding}_{\text{CLS\_Issue}} = \text{Evidence}_{\text{CLS\_FAIL}} \land \text{Evidence}_{\text{LayoutShift\_Present}} \land \text{Evidence}_{\text{ImageDimensions\_Missing}}$$

---

## 6. 3-Tier Confidence Breakdown

Confidence is not a single arbitrary scalar. EDAOS evaluates a **3-Tier Confidence Model**:

$$C_{\text{Composite}} = C_{\text{Measurement}} \times C_{\text{Interpretation}} \times C_{\text{Correlation}}$$

1. **Measurement Confidence ($C_{\text{Measurement}}$)**: Accuracy of the raw Provider/MCP tool (e.g., Chrome DevTools = 0.99, Static Regex = 0.70).
2. **Interpretation Confidence ($C_{\text{Interpretation}}$)**: Fidelity of the match between Observation and Policy scope.
3. **Correlation Confidence ($C_{\text{Correlation}}$)**: Statistical or structural likelihood that the Evidence directly causes the observed failure.

---

## 7. Artifact as a First-Class Resource

Artifacts are independent, versioned system Resources that exist outside of Evidence schemas. Evidences only reference Artifact UUIDs.

```yaml
ArtifactResource:
  id: ART-SCREENSHOT-001
  type: SCREENSHOT | TRACE | HAR | VIDEO | DOM_SNAPSHOT | DIFF_IMAGE
  mime_type: "image/png"
  uri: "file:///artifacts/screenshots/hero-lcp-diff.png"
  size_bytes: 412980
  checksum: "sha256:8f4c2..."
  lifecycle_state: PERSISTED # CREATED | PERSISTED | ARCHIVED | PURGED
  created_at: "2026-07-22T10:03:00Z"
```

---

## 8. Summary Matrix

| Level | Entity | Responsibilities | Key Invariant |
| :--- | :--- | :--- | :--- |
| **Level 0** | Signal | Raw data emission | Unparsed & Tool-specific |
| **Level 1** | Observation | Objective metric measurement | Fact without interpretation |
| **Level 2** | Evidence | Policy compliance evaluation | Requires $\ge 1$ Policy & Observation |
| **Level 3** | Finding | Diagnostic root-cause correlation | Synthesized from Evidence Bundles |
| **Level 4** | Insight | Cross-project learning synthesis | Produced by Learning Engine |
