# EDAOS Core: Resource State Machine Specification

Version: 1.0.0
Status: APPROVED
Domain: Core Architecture Specification
File: 04-state-machine.md

---

## 1. Overview & Architectural Philosophy

In EDAOS, **Processors are Stateless**; state is owned exclusively by **Resources**. 

Instead of a monolithic system state machine, each core Domain Concept (`Observation`, `Evidence`, `Finding`, `Decision`, `Action`, `Outcome`, `Learning`) maintains its own versioned, **Resource-Centric State Machine**.

Transitions are **strictly Event-Driven**, guarded by explicit **Preconditions (Guards)**, protected by **Invariants**, and extensible via **Microkernel Extension Points**.

```
                           ┌───────────────────────────┐
                           │       Domain Event        │
                           └─────────────┬─────────────┘
                                         │
                                         ▼
                           ┌───────────────────────────┐
                           │      Transition Guard     │
                           │ (Confidence, Precondition)│
                           └─────────────┬─────────────┘
                                         │
                                  (Guard Satisfied)
                                         │
                                         ▼
┌──────────────────┐       ┌───────────────────────────┐       ┌──────────────────┐
│  State: Current  │ ────► │    Transition Execution   │ ────► │   State: Target  │
└──────────────────┘       └───────────────────────────┘       └──────────────────┘
```

---

## 2. Transition Contract Schema

All state transitions in EDAOS conform to a standardized contract:

```yaml
TransitionContract:
  id: string
  entity_type: Observation | Evidence | Finding | Decision | Action | Outcome | Learning
  from_state: string
  to_state: string

  trigger_event: string

  guards:
    - condition: string
      fail_reason: string

  postconditions:
    - condition: string

  emitted_events:
    - event_type: string
```

---

## 3. Resource State Machines

### 3.1 Observation State Machine
* **States**: `Created` ➔ `Collected` ➔ `Normalized` ➔ `Archived`

```yaml
states: [Created, Collected, Normalized, Archived]

transitions:
  - id: TRANS-OBS-01
    from: Created
    to: Collected
    trigger_event: ObservationCreated
    guards:
      - condition: "payload.is_not_null == true"
    emitted_events: [ObservationCollected]

  - id: TRANS-OBS-02
    from: Collected
    to: Normalized
    trigger_event: ObservationNormalized
    guards:
      - condition: "payload.conforms_to_schema == true"
    emitted_events: [ObservationReady]

  - id: TRANS-OBS-03
    from: Normalized
    to: Archived
    trigger_event: PipelineCompleted
    emitted_events: [ObservationArchived]

illegal_transitions:
  - from: Created
    to: Normalized  # Cannot bypass Collected
  - from: Created
    to: Archived    # Cannot archive raw uncollected data
```

---

### 3.2 Evidence State Machine
* **States**: `Draft` ➔ `Interpreted` ➔ `Validated` ➔ `Correlated` ➔ `Expired`

```yaml
states: [Draft, Interpreted, Validated, Correlated, Expired]

transitions:
  - id: TRANS-EVI-01
    from: Draft
    to: Interpreted
    trigger_event: EvidenceInterpreted
    guards:
      - condition: "derived_from_observation != null"
      - condition: "policy_ref != null"

  - id: TRANS-EVI-02
    from: Interpreted
    to: Validated
    trigger_event: EvidenceValidated
    guards:
      - condition: "confidence_score >= 0.5"

  - id: TRANS-EVI-03
    from: Validated
    to: Correlated
    trigger_event: FindingCreated

  - id: TRANS-EVI-04
    from: "*"
    to: Expired
    trigger_event: EvidenceTTLStale

illegal_transitions:
  - from: Draft
    to: Correlated  # Must be Interpreted and Validated first
```

---

### 3.3 Finding State Machine
* **States**: `Candidate` ➔ `Confirmed` ➔ `Rejected` ➔ `Superseded`

```yaml
states: [Candidate, Confirmed, Rejected, Superseded]

transitions:
  - id: TRANS-FND-01
    from: Candidate
    to: Confirmed
    trigger_event: FindingCorrelated
    guards:
      - condition: "supporting_evidences.count >= 1"

  - id: TRANS-FND-02
    from: Candidate
    to: Rejected
    trigger_event: EvidenceContradicted
    guards:
      - condition: "contradicting_evidence.confidence > primary_evidence.confidence"

  - id: TRANS-FND-03
    from: Confirmed
    to: Superseded
    trigger_event: NewerFindingDiscovered
```

---

### 3.4 Decision State Machine
* **States**: `Draft` ➔ `Approved` ➔ `Rejected` ➔ `Expired` ➔ `Executed`

```yaml
states: [Draft, Approved, Rejected, Expired, Executed]

transitions:
  - id: TRANS-DEC-01
    from: Draft
    to: Approved
    trigger_event: DecisionEvaluated
    guards:
      - condition: "policy_check == PASS"
      - condition: "human_gate_approval == APPROVED || confidence >= 0.85"

  - id: TRANS-DEC-02
    from: Draft
    to: Rejected
    trigger_event: HumanGateRejected

  - id: TRANS-DEC-03
    from: Approved
    to: Executed
    trigger_event: ActionsSuccessfullyExecuted
```

---

### 3.5 Action State Machine
* **States**: `Planned` ➔ `Ready` ➔ `Executing` ➔ `Succeeded` | `Compensated` | `Failed`

```yaml
states: [Planned, Ready, Executing, Succeeded, Compensated, Failed]

transitions:
  - id: TRANS-ACT-01
    from: Planned
    to: Ready
    trigger_event: ActionPlanned
    guards:
      - condition: "target_resource_lock == GRANTED"
      - condition: "compensating_action_defined == TRUE"

  - id: TRANS-ACT-02
    from: Ready
    to: Executing
    trigger_event: ActionExecutionStarted

  - id: TRANS-ACT-03
    from: Executing
    to: Succeeded
    trigger_event: ActionExecutionCompleted
    guards:
      - condition: "execution_exit_code == 0"

  - id: TRANS-ACT-04
    from: Executing
    to: Compensated
    trigger_event: ExecutionFailedAndRolledBack
    guards:
      - condition: "saga_compensation_completed == TRUE"

  - id: TRANS-ACT-05
    from: Executing
    to: Failed
    trigger_event: ExecutionFailedUnrecoverable

illegal_transitions:
  - from: Planned
    to: Succeeded    # Cannot succeed without Executing
  - from: Executing
    to: Compensated  # Cannot enter Compensated without executing Saga compensation
```

---

### 3.6 Outcome State Machine
* **States**: `Observed` ➔ `Verified` ➔ `Validated` ➔ `Closed`

```yaml
states: [Observed, Verified, Validated, Closed]

transitions:
  - id: TRANS-OUT-01
    from: Observed
    to: Verified
    trigger_event: PostObservationCaptured
    guards:
      - condition: "target_metric_improved == TRUE"

  - id: TRANS-OUT-02
    from: Verified
    to: Validated
    trigger_event: RegressionCheckPassed
    guards:
      - condition: "non_target_policies_regressed == FALSE"

  - id: TRANS-OUT-03
    from: Validated
    to: Closed
    trigger_event: OutcomePersisted
```

---

### 3.7 Learning State Machine
* **States**: `Pending` ➔ `Persisted` ➔ `Indexed` ➔ `Activated`

```yaml
states: [Pending, Persisted, Indexed, Activated]

transitions:
  - id: TRANS-LRN-01
    from: Pending
    to: Persisted
    trigger_event: LearningSynthesized

  - id: TRANS-LRN-02
    from: Persisted
    to: Indexed
    trigger_event: KnowledgeVectorEmbedded

  - id: TRANS-LRN-03
    from: Indexed
    to: Activated
    trigger_event: MemoryPatternMatched
```

---

## 4. State Invariants

State Invariants define non-negotiable assertions that MUST hold true while a Resource remains in a given state.

| Resource | State | Invariant Assertion |
| :--- | :--- | :--- |
| **Observation** | `Normalized` | Payload MUST conform to canonical JSON Schema & standardized units. |
| **Evidence** | `Interpreted` | MUST reference $\ge 1$ immutable Observation and $\ge 1$ Policy threshold. |
| **Finding** | `Confirmed` | MUST reference $\ge 1$ Validated Evidence and contain isolated culprit targets. |
| **Decision** | `Approved` | MUST satisfy Policy checks AND Human Gate approval (if $C < 0.65$). |
| **Action** | `Executing` | MUST hold a target resource lock and have a defined `compensating_action`. |
| **Action** | `Compensated` | MUST reference a failed execution trace and completed Saga rollback events. |
| **Outcome** | `Validated` | Target metric MUST be verified AND zero regression on non-target policies. |

---

## 5. Versioning & Microkernel Plugin Extension Points

Core State Machines are defined at `version: 1.0.0`. Domain Plugins (Frontend, Backend, Mobile, DevOps) can attach **Sub-States** and **Custom Guards** via extension points without modifying Core specs:

```yaml
PluginExtension:
  target_resource: Outcome
  domain_plugin: frontend
  
  extended_states:
    - VisualVerified
    - AccessibilityValidated

  custom_guards:
    - name: VisualDiffThresholdGuard
      target_transition: TRANS-OUT-02
      condition: "pixel_diff_percentage <= policy.visual_diff_max"
```
