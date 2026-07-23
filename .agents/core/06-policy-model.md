# EDAOS Core: Policy Engine & Model Specification

Version: 1.0.0
Status: APPROVED
Domain: Core Architecture Specification
File: 06-policy-model.md

---

## 1. Overview & Architectural Role

The **Policy Engine & Model** defines the declarative rules and thresholds that transform objective observations into contextualized evidence:

$$\text{Evidence} = \text{Observation} + \text{Policy} + \text{Context}$$

Policy decouples rules and skills from hardcoded "magic numbers" or environment-specific thresholds. By isolating Policy into an independent system layer, EDAOS allows different projects (e.g., Mobile Web vs Enterprise Admin Dashboard) to enforce vastly different quality gates without modifying a single line of Skill logic or Processor code.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        POLICY HIERARCHY MATRIX                         │
├────────────────────────────────────────────────────────────────────────┤
│ 1. System Baseline Policy   (System Defaults, e.g., default-perf.yml)  │
│        ▲                                                               │
│        │ (inherits / overrides)                                        │
│ 2. Enterprise Policy        (Org-wide Standards, e.g., vtv-corp.yml)  │
│        ▲                                                               │
│        │ (inherits / overrides)                                        │
│ 3. Project Policy           (App-specific Targets, e.g., adwatch.yml)  │
│        ▲                                                               │
│        │ (inherits / overrides)                                        │
│ 4. Environment Context      (Dev / Staging / Production Overrides)    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Canonical Policy Schema (Policy Anatomy)

All policies in EDAOS conform to a standardized, versioned YAML schema:

```yaml
policy_id: POL-FE-PERF-CORE-01
version: 1.2.0
name: MobileWebCoreVitalsPolicy
domain: frontend
category: Performance

metadata:
  description: "Strict performance compliance targets for mobile web dashboard"
  author: "Architecture Team"
  effective_date: "2026-07-22"

target_scope:
  file_patterns: ["src/components/**/*.tsx", "src/pages/**/*.tsx"]
  tags: ["mobile", "client-side-rendered"]

enforcement_level: STRICT # STRICT (Block CI/CD) | WARNING (Log & Notify) | ADVISORY (Info only)

thresholds:
  - metric: LCP
    unit: seconds
    target: 2.5
    warning: 3.5
    critical: 5.0
    operator: LESS_THAN_OR_EQUAL

  - metric: CLS
    unit: ratio
    target: 0.10
    warning: 0.25
    critical: 0.50
    operator: LESS_THAN_OR_EQUAL

  - metric: BundleJS
    unit: KB
    target: 250
    warning: 400
    critical: 800
    operator: LESS_THAN_OR_EQUAL

evaluation_rule:
  expression: "LCP <= threshold.target AND CLS <= threshold.target AND BundleJS <= threshold.target"
  confidence_weight: 1.0
```

---

## 3. Policy Inheritance & Override Cascade

EDAOS supports multi-level **Policy Inheritance**. Child policies inherit all thresholds from parent policies and override only specific metrics:

```yaml
# Project Policy File: .agents/edaos/policies/adwatch-dashboard.policy.yml
extends: "POL-FE-PERF-CORE-01" # Inherits from System Core Performance Policy
version: 1.0.0
name: AdWatchAdminDashboardPolicy

# Override only the BundleJS threshold for Desktop Admin Dashboard
overrides:
  thresholds:
    - metric: BundleJS
      unit: KB
      target: 600 # Relaxed from 250KB to 600KB for rich admin analytics dashboard
      warning: 800
      critical: 1200

  enforcement_level: WARNING # Downgraded to WARNING for staging environment
```

### Resolution Order Algorithm
When evaluating an Observation, the **Policy Evaluator** resolves thresholds in order of specificity:
1. `Environment Context Override` (Highest priority)
2. `Project Policy`
3. `Enterprise Policy`
4. `System Baseline Policy` (Lowest priority fallback)

---

## 4. Policy Evaluator Engine

The **Policy Evaluator Engine** parses Normalized Observations and active Policy schemas to calculate evidence status and deviation metrics.

```
┌────────────────────────────────────────────────────────────────────────┐
│                        POLICY EVALUATOR ENGINE                         │
├───────────────────────────────────┬────────────────────────────────────┤
│ INPUT                             │ OUTPUT                             │
│ - Normalized Observation (LCP=3.8s)│ - Evidence Entity                  │
│ - Active Resolved Policy          │ - Status: FAIL                     │
│ - Execution Context               │ - Deviation Delta: +1.3s (+52%)    │
│                                   │ - Severity: HIGH                   │
└───────────────────────────────────┴────────────────────────────────────┘
```

### Evaluation Logic & Operators
The evaluator supports standard mathematical and logical comparison operators:
* `LESS_THAN_OR_EQUAL` ($\le$)
* `GREATER_THAN_OR_EQUAL` ($\ge$)
* `EQUALS` ($=$)
* `BETWEEN` ($[min, max]$)
* `CONTAINS` (String / Array match)
* `MATCHES_REGEX` (Pattern matching)

---

## 5. Policy Bundles

Complex applications require evaluating multiple domain policies simultaneously. EDAOS groups related policies into **Policy Bundles**:

```yaml
bundle_id: BND-FE-FULL-SUITE-01
name: FrontendProductionReleasePolicyBundle
version: 2.0.0

policies:
  - ref: "POL-FE-PERF-CORE-01"      # Performance Policy
  - ref: "POL-FE-A11Y-AA-01"        # Accessibility AA Policy
  - ref: "POL-FE-SEC-OWASP-01"      # Security OWASP Policy
  - ref: "POL-FE-VISUAL-DIFF-01"    # Visual Regression Policy

aggregation_policy:
  fail_fast: false                  # Evaluate all policies before returning
  composite_status:
    strict_mode: true               # If any policy in bundle is FAIL, bundle status is FAIL
```

---

## 6. Dynamic Hot Reloading & Policy Governance

Policies in EDAOS are **declarative data files**, not compiled code.

* **Hot Reloading**: Policy files can be modified in `.agents/edaos/policies/` and instantly reloaded by the Policy Engine without restarting the AI agent, rebuilding plugins, or altering Skills.
* **Audit Trail**: Every evaluated `Evidence` entity stores the exact `policy_id` and `version` hash used during evaluation, ensuring 100% reproducible audit trails for compliance.
