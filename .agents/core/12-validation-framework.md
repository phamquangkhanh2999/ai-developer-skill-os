# EDAOS Core: Validation Framework & Compliance Specification

Version: 1.0.0
Status: APPROVED
Domain: Core Architecture Specification
File: 12-validation-framework.md

---

## 1. Overview & Purpose

The **Validation Framework** serves as the automated testing and compliance specification for EDAOS. It proves that Core, Contracts, Plugins, Providers, and Skills remain 100% interoperable, evidence-driven, and regression-free.

It guarantees **Self-Hosting Verification**: EDAOS can evaluate, audit, and validate its own internal components using native skills (`qk-ui-audit`, `qk-project-health`).

```
┌────────────────────────────────────────────────────────────────────────┐
│                        EDAOS VALIDATION MATRIX                         │
├───────────────────────────────────┬────────────────────────────────────┤
│ 1. Contract Tests                 │ Verifies schema conformance        │
│ 2. Tool Substitution Equivalence  │ Provider A vs Provider B output    │
│ 3. Confidence Decay Verification  │ C_Obs >= C_Evi >= C_Fnd >= C_Dec   │
│ 4. Invariant Assertion Checking   │ No Evidence -> No Finding          │
│ 5. Golden Path Integration Trace  │ End-to-End Execution Flow          │
└───────────────────────────────────┴────────────────────────────────────┘
```

---

## 2. Invariant Assertion Engine

The Validation Framework executes 5 non-negotiable Invariant Tests:

### Invariant 1: No Evidence, No Finding
* **Rule**: A `Finding` entity CANNOT be synthesized directly from an `Observation` without an intervening `Evidence` evaluated against an explicit `Policy`.
* **Assertion**:
  ```python
  assert Finding.supported_by_evidences.count >= 1
  assert all(e.status in ['FAIL', 'WARNING'] for e in Finding.supported_by_evidences)
  ```

---

### Invariant 2: Missing Policy Defaults to UNKNOWN_POLICY_CONTEXT
* **Rule**: If an `Observation` is captured but no active `Policy` is resolved, the system MUST NOT emit `status: PASS`.
* **Assertion**:
  ```python
  if policy_resolved == None:
      assert Evidence.status == "UNKNOWN_POLICY_CONTEXT"
      assert Evidence.confidence == "LOW"
  ```

---

### Invariant 3: Tool Substitution Equivalence
* **Rule**: Swapping Provider A (e.g. `chrome-devtools-provider`) with Provider B (e.g. `lighthouse-cli-provider`) MUST yield structurally equivalent Level-1 `Observation` entities for the same Capability.
* **Assertion**:
  ```python
  assert Obs_ProviderA.metric_name == Obs_ProviderB.metric_name
  assert Obs_ProviderA.unit == Obs_ProviderB.unit
  ```

---

### Invariant 4: Monotonic Confidence Decay
* **Rule**: Confidence score CANNOT spontaneously increase as data passes downstream through inference stages.
* **Assertion**:
  ```python
  assert C_Observation >= C_Evidence >= C_Finding >= C_Decision >= C_Action
  ```

---

### Invariant 5: Saga Compensation Safety
* **Rule**: Every `Action` with side-effects MUST define a valid, executable `compensating_action`.
* **Assertion**:
  ```python
  if Action.has_side_effects == True:
      assert Action.compensating_action != None
  ```

---

## 3. Test Suite Taxonomy

| Test Type | Target Scope | Execution Frequency | Pass Criterion |
| :--- | :--- | :--- | :--- |
| **Contract Compliance** | `.agents/contracts/*.yml` | On Every Plugin Registration | 100% Schema Match |
| **Provider Equivalence** | `.agents/contracts/08-provider-contract.yml` | Weekly / Provider Update | Normalized Obs Match |
| **Skill Orchestration** | `.agents/skills/*/SKILL.md` | PR / Release Gate | Zero Forbidden Behaviors |
| **Self-Hosting Audit** | EDAOS System Core | Production Build Gate | Zero Policy Breaches |
