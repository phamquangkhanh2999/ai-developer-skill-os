# EDAOS Unified Command-Line Interface (CLI) Specification

Version: 1.0.0
Status: APPROVED
Domain: Kernel CLI Interface
File: 26-edaos-cli-spec.md

---

## 1. Overview

The **EDAOS Unified CLI** (`edaos`) provides a single, intuitive entrypoint for human engineers and CI/CD pipelines to interact with the EDAOS Self-Evolving AI Engineering OS.

```bash
                          edaos CLI
                              │
  ┌─────────┬─────────┬───────┴─┬─────────┬─────────┬─────────┐
  │         │         │         │         │         │         │
 init     audit   diagnose  optimize   evolve   release   health
```

---

## 2. Command Reference

### `edaos init`
* **Purpose**: Initializes `.agents/` workspace structure, loads baseline policies, and registers active domain plugins.
* **Usage**:
  ```bash
  edaos init --plugin=frontend.web --policy=strict
  ```

---

### `edaos audit`
* **Purpose**: Triggers `qk-ui-audit` or `qk-engineering-standard` to capture observations, evaluate evidence against policies, and report findings.
* **Usage**:
  ```bash
  edaos audit --url=http://localhost:3000/dashboard
  edaos audit --scope=src/components/admin/
  ```

---

### `edaos diagnose`
* **Purpose**: Correlates multiple evidences into root-cause findings and exonerates non-culprits.
* **Usage**:
  ```bash
  edaos diagnose --finding-id=FND-2026-HERO-BLOCK
  ```

---

### `edaos optimize`
* **Purpose**: Triggers `qk-performance-tuner` to select an optimization strategy, generate an Action Plan, and delegate code modifications.
* **Usage**:
  ```bash
  edaos optimize --strategy=lcp_image_loading --target=HeroBanner.tsx
  ```

---

### `edaos evolve`
* **Purpose**: Invokes `16-rule-evolution-engine` and `17-policy-feedback-loop` to inspect system history and propose rule/policy upgrades.
* **Usage**:
  ```bash
  edaos evolve --proposals
  edaos evolve --promote=PROP-RUL-2026-001
  ```

---

### `edaos release`
* **Purpose**: Triggers `qk-production-release` to run the 8-Gate Release Quality Checklist and deploy safely to production.
* **Usage**:
  ```bash
  edaos release --candidate=v2.4.0-rc1 --env=production
  ```

---

### `edaos health`
* **Purpose**: Triggers `qk-project-health` and `18-system-self-health` to output the 6D Project Health Score and OS Self-Diagnostics.
* **Usage**:
  ```bash
  edaos health --report=json
  ```
