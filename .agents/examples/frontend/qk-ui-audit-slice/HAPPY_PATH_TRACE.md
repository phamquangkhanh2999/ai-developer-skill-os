# EDAOS Vertical Slice: qk-ui-audit End-to-End Golden Path Trace

Domain: Frontend Web
Plugin: `frontend.web`
Skill: `qk-ui-audit`
Target: `http://localhost:3000/dashboard`

---

## 1. Trigger User Intent
User invokes: `./qk-ui-audit --url=http://localhost:3000/dashboard`

---

## 2. Step-by-Step Executable Trajectory

### Step 1: Capability Resolution
`qk-ui-audit` Skill requests capabilities:
- `browser.performance` (Min maturity: 3)
- `ui.capture` (Min maturity: 2)

Capability Router resolves providers:
- `browser.performance` ➔ `chrome-devtools-provider` (Rank Score: 0.94)
- `ui.capture` ➔ `playwright-mcp-provider` (Rank Score: 0.91)

---

### Step 2: Observation Collection & Normalization
* **Provider**: `chrome-devtools-provider`
* **Raw Payload**: Chrome DevTools Trace JSON
* **Normalized Observation (Level 1)**:
  ```json
  {
    "observation_id": "OBS-2026-FE-001",
    "metrics": {
      "LCP": 3800,
      "CLS": 0.02,
      "TTFB": 210
    },
    "units": { "LCP": "ms", "CLS": "ratio", "TTFB": "ms" },
    "source_provider": "chrome-devtools-provider"
  }
  ```

---

### Step 3: Policy Evaluation & Evidence Generation
* **Active Policy**: `POL-FE-PERF-CORE-01` (Target LCP $\le$ 2500ms)
* **Evaluator Output (Level 2 Evidence)**:
  ```json
  {
    "evidence_id": "EVI-2026-PERF-LCP-01",
    "derived_from": ["OBS-2026-FE-001"],
    "policy_ref": "POL-FE-PERF-CORE-01",
    "status": "FAIL",
    "deviation_delta": "+1300ms (+52%)",
    "confidence_breakdown": {
      "measurement": 0.98,
      "interpretation": 0.95,
      "correlation": 0.90,
      "composite": 0.838
    }
  }
  ```

---

### Step 4: Correlation & Root-Cause Finding
* **Correlation Engine Output (Level 3 Finding)**:
  ```json
  {
    "finding_id": "FND-2026-HERO-BLOCK",
    "supported_by": ["EVI-2026-PERF-LCP-01"],
    "type": "render_blocking_asset",
    "primary_culprit": "Hero Banner image 'hero-main.png' (1.4MB) lacking <link rel='preload'>",
    "exonerated_targets": ["ProductGrid.tsx", "Header.tsx"]
  }
  ```

---

### Step 5: Rule Evaluation & Strategic Decision
* **Active Rule**: `frontend.performance.hero_render_optimization`
* **Rule Engine Output (Decision)**:
  ```json
  {
    "decision_id": "DEC-2026-OPT-HERO-01",
    "decision_type": "OPTIMIZE_RESOURCE_LOADING",
    "strategy_summary": "Add rel=preload tag and convert hero asset to modern WebP format",
    "risk_level": "LOW",
    "human_gate_required": false
  }
  ```

---

### Step 6: Planning & Action Execution
* **Planner Output**:
  ```yaml
  ActionStep:
    id: ACT-2026-PRELOAD-01
    target_file: "src/components/HeroBanner.tsx"
    operation: ADD_PRELOAD_TAG
    compensating_action: REVERT_FILE_DIFF
  ```
* **Execution Engine**: Code updated safely.

---

### Step 7: Post-Fix Verification & Validation
* **Target Metric Verification**: LCP re-observed at **1800ms** (Target $\le$ 2500ms -> **PASS**).
* **Non-Target Policy Validation**: CLS (0.02) and Accessibility (A11y AA) -> **PASS (Zero Regression)**.
* **Outcome**: `SUCCESS`.

---

### Step 8: Knowledge Synthesis (Learning)
* **Learning Engine Output (Level 4 Insight)**:
  ```json
  {
    "learning_id": "LRN-2026-FE-HERO-01",
    "pattern_key": "HERO_IMAGE_LCP_PRELOAD",
    "learning_namespace": "edaos.learning.frontend.web",
    "lesson": "Preloading WebP hero banners on React SSR pages reduced LCP by 52.6% (3800ms -> 1800ms) with zero visual regression."
  }
  ```
