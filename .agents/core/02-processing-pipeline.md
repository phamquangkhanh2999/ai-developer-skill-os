# EDAOS Core: Processing Pipeline Specification

Version: 1.1.0
Status: APPROVED
Domain: Core Architecture Specification
File: 02-processing-pipeline.md

---

## 1. Overview & Architectural Role

The **Processing Pipeline** defines the high-level business data flow of EDAOS. It models how observations flow into evidence, findings, decisions, actions, and learnings.

Rather than being a hardcoded linear script with tool-level implementations, the pipeline is evaluated as a **Processor Graph** consisting of decoupled, event-driven Processors.

```
┌─────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌──────────┐
│ Observe │ ──►│ Normalize │ ──►│ Interpret │ ──►│ Correlate │ ──►│ Evaluate │
└─────────┘    └───────────┘    └───────────┘    └───────────┘    └──────────┘
                                                                        │
                                                                        ▼
┌─────────┐    ┌───────────┐    ┌───────────┐    ┌───────────┐    ┌──────────┐
│  Learn  │ ◄──│  Validate │ ◄──│  Verify   │ ◄──│  Execute  │ ◄──│   Plan   │
└─────────┘    └───────────┘    └───────────┘    └───────────┘    └──────────┘
```

---

## 2. Business Processing Stages

### Stage 1: Observe
* **Business Purpose**: Collect uninterpreted measurements from the execution environment.
* **Consumes**: Capability Request (`capability.id`, `target_context`)
* **Produces**: `Observation` entity + `ObservationCreated` Event
* **Stage Contract**:
  - Input: Capability Contract
  - Output: Raw & Immutable Observation

---

### Stage 2: Normalize
* **Business Purpose**: Standardize heterogenous observation payloads into canonical EDAOS JSON Schemas.
* **Consumes**: `Observation` entity
* **Produces**: `Normalized Observation` entity + `ObservationNormalized` Event
* **Stage Contract**:
  - Input: Raw Payload
  - Output: Standardized Units and Schema

---

### Stage 3: Interpret
* **Business Purpose**: Evaluate Normalized Observations against active Policy thresholds.
* **Consumes**: `Normalized Observation` + `Active Policy`
* **Produces**: `Evidence` entity + `EvidenceCreated` Event
* **Stage Contract**:
  - Input: Normalized Observation + Policy Reference
  - Output: Evidence with `status` (PASS/FAIL/WARNING) and `confidence_score`

---

### Stage 4: Correlate
* **Business Purpose**: Synthesize multiple Evidences to isolate primary root-cause Findings and exonerate non-culprit components.
* **Consumes**: Array of `Evidence` entities
* **Produces**: `Finding` entity + `FindingCreated` Event
* **Stage Contract**:
  - Input: Evidences
  - Output: Root-cause Finding with culprit isolation and confidence score

---

### Stage 5: Evaluate
* **Business Purpose**: Formulate strategic Decisions by matching Findings against Rules and Policy constraints.
* **Consumes**: `Finding` entity + `Rule Contracts`
* **Produces**: `Decision` entity + `DecisionFormulated` Event
* **Stage Contract**:
  - Input: Finding + Rules
  - Output: Approved strategic Decision

---

### Stage 6: Plan
* **Business Purpose**: Translate strategic Decisions into deterministic, safe Action steps.
* **Consumes**: `Decision` entity
* **Produces**: `Action` entity (or Array of `Action` steps) + `ActionPlanned` Event
* **Stage Contract**:
  - Input: Strategic Decision
  - Output: Executable Actions with target boundaries

---

### Stage 7: Execute
* **Business Purpose**: Perform file edits, configuration changes, or API operations.
* **Consumes**: `Action` entity
* **Produces**: Execution Result + `ActionExecuted` Event
* **Stage Contract**:
  - Input: Action Step
  - Output: Execution Logs & Diff

---

### Stage 8: Verify & Validate
* **Business Purpose**: 
  - **Verification**: Empirically confirm whether the executed Action resolved the target metric failure.
  - **Validation**: Confirm that the Action did NOT introduce regressions against non-target policies (e.g., Performance fixed, but Accessibility damaged).
* **Consumes**: Executed `Action` + Original `Evidence` + Full `Policy Suite`
* **Produces**: `Outcome` entity (`status: SUCCESS | FAILURE | PARTIAL`) + `OutcomeVerified` Event
* **Stage Contract**:
  - Input: Executed Action + Re-observed Payload
  - Output: Verified and Validated Outcome

---

### Stage 9: Learn
* **Business Purpose**: Synthesize Action-Outcome trajectory into long-term Knowledge Graph memory.
* **Consumes**: `Outcome` entity + Complete Pipeline Trajectory
* **Produces**: `Learning` entity + `KnowledgePersisted` Event
* **Stage Contract**:
  - Input: Verified Outcome
  - Output: Reusable Knowledge Pattern

---

## 3. Failure Handling Architecture Matrix

EDAOS categorizes stage failures into 4 distinct handling layers: **Failure**, **Fallback**, **Recovery**, and **Escalation**.

| Stage | Primary Failure | Fallback Strategy | Recovery Policy | Escalation Path |
| :--- | :--- | :--- | :--- | :--- |
| **1. Observe** | Provider Unreachable / Timeout | Switch to alternative Provider (e.g., CLI fallback) | Retry x2 (Exponential Backoff) | Escalate to Human Gate / User |
| **2. Normalize** | Schema Mismatch / Malformed Data | Schema Repair Adapter / Default Mapper | Quarantine payload & retry parse | Log warning & skip observation |
| **3. Interpret** | Missing Policy Threshold | Apply System Default Baseline Policy | Auto-fetch policy from upstream repo | Request user policy definition |
| **4. Correlate** | Conflicting Evidences | Evidence Re-weighting Protocol | Lower Finding Confidence Score | Flag ambiguity for human review |
| **5. Evaluate** | Rule Conflict | Rule Hierarchy Check (Security > Perf) | Evaluate fallback policy branch | **Human Gate Approval Required** |
| **6. Plan** | Unsafe Action Target | Strategy Shift / Alternative Plan | Re-evaluate Decision constraints | Abort Plan & notify user |
| **7. Execute** | Execution Failure | **Saga Compensation Strategy** | Revert via Saga Compensating Actions | Halt execution & request intervention |
| **8. Verify** | Metric Unchanged / Policy Regression | Alternative Action Branch | One-Shot Fix Retry | Revert Compensation & mark FAIL |
| **9. Learn** | Knowledge Store Offline | Local Append-Only Queue (`learning_queue.jsonl`) | Re-sync on store reconnect | Log warning & continue |
