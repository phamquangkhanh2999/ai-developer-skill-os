# Test Case 001: LCP Performance Regression Validation

Target Skill: `qk-ui-audit` (v2.0.0)
Domain: `frontend.web`
Scenario: Hero banner image added without <link rel="preload"> tag on SSR page

---

## 1. Input Context
```yaml
target:
  page_url: "http://localhost:3000/dashboard"
  component: "src/components/HeroBanner.tsx"

scenario_params:
  asset_name: "hero-main.png"
  asset_size_bytes: 1468000
  preload_tag_present: false
```

---

## 2. Validation Step Execution

### Step A: Observation Extraction
* Provider: `chrome-devtools-provider`
* Extracted Metric: `LCP = 3800ms` (Raw Observation)

### Step B: Evidence Interpretation
* Policy: `POL-FE-PERF-CORE-01` (Target LCP $\le$ 2500ms)
* Calculated Delta: `+1300ms (+52%)` -> `Status: FAIL`

### Step C: Finding Correlation
* Culprit Isolated: `hero-main.png` render-blocking asset.

### Step D: Decision Formulation
* Strategy: `OPTIMIZE_RESOURCE_LOADING` (Preload & WebP conversion).

---

## 3. Invariant Assertions Results

| Invariant Check | Status | Verification Detail |
| :--- | :--- | :--- |
| **1. No Evidence -> No Finding** | ✅ PASS | Finding references `EVI-2026-PERF-LCP-01` |
| **2. Missing Policy Check** | ✅ PASS | Policy `POL-FE-PERF-CORE-01` correctly resolved |
| **3. Tool Substitution Equivalence** | ✅ PASS | Tested vs `lighthouse-cli-provider` (Same LCP metric structure) |
| **4. Confidence Decay** | ✅ PASS | $C_{\text{Obs}} (0.98) \ge C_{\text{Evi}} (0.95) \ge C_{\text{Fnd}} (0.90) \ge C_{\text{Dec}} (0.838)$ |
| **5. Tool Blindness** | ✅ PASS | Zero provider keywords present in Decision or Action Plan |
