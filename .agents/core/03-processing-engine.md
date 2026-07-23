# EDAOS Core: Processing Engine Architecture

Version: 1.0.0
Status: APPROVED
Domain: Core Architecture Specification
File: 03-processing-engine.md

---

## 1. Overview & Engine Philosophy

The **EDAOS Processing Engine** transforms static workflow definitions into a dynamic, event-driven, resilient **Processor Graph**. 

Rather than executing a hardcoded linear script, the engine evaluates decoupled **Processors** that communicate via an asynchronous **Event Bus**, manage **Confidence Propagation**, enforce **Human Gates**, execute **Saga Compensations**, and apply **Idempotent Retry Policies**.

```
                           ┌───────────────────────────┐
                           │         Event Bus         │
                           └───────────────────────────┘
                                ▲        ▲        ▲
                                │        │        │ (Pub / Sub Events)
                       ┌────────┴────────┴────────┴────────┐
                       │                                   │
┌──────────────────────┴──────┐                   ┌────────┴────────────────────┐
│    Observation Processor    │                   │     Evidence Processor      │
├─────────────────────────────┤                   ├─────────────────────────────┤
│ Consumes: CapabilityReq     │ ───(Confidence)──►│ Consumes: Obs + Policy      │
│ Produces: Observation       │   Propagation     │ Produces: Evidence          │
└─────────────────────────────┘                   └─────────────────────────────┘
                                                                 │
                                                          (Confidence Check)
                                                                 │
                                                                 ▼
                                                  ┌─────────────────────────────┐
                                                  │         Human Gate          │
                                                  │ (If Confidence < Threshold) │
                                                  └─────────────────────────────┘
```

---

## 2. Processor Contract Specification

Every stage in the EDAOS Processing Engine is implemented as a standalone **Processor** conforming to a strict contract:

```yaml
ProcessorSpec:
  id: string
  name: string
  
  consumes:
    - entity_type: string
      min_confidence: number # 0.0 to 1.0

  produces:
    - entity_type: string
    - event_type: string

  requires:
    - capability | policy | context

  guarantees:
    - idempotency: true | false
    - immutable_output: true | false
    - confidence_decay_max: number

  failure_policy:
    retry:
      max_attempts: integer
      backoff: fixed | exponential
      initial_delay_ms: integer
    fallback:
      strategy: string
    compensation:
      strategy: string
    escalation:
      path: human_gate | abort | log_warning
```

---

## 3. Event Model (Event-Driven Engine)

EDAOS is strictly **Event-Driven**. Processors do not directly invoke downstream processors; they publish domain events to the **Event Bus**.

```
[Provider] ──► ObservationCreated ──► [Evidence Processor]
                                              │
                                              ▼
[Correlation Processor] ◄── EvidenceCreated ──┘
          │
          ▼
    FindingCreated ──► [Rule Engine Processor]
                               │
                               ▼
                        DecisionApproved ──► [Planner Processor]
                                                    │
                                                    ▼
   [Verifier] ◄── ActionExecuted ◄── ActionPlanned ─┘
       │
       ▼
OutcomeVerified ──► [Learning Engine Processor]
```

### Core Domain Events
* `ObservationCreated`: Emitted when raw measurements are successfully captured.
* `ObservationNormalized`: Emitted when raw data passes schema standardization.
* `EvidenceCreated`: Emitted when an observation is evaluated against policy thresholds.
* `FindingCreated`: Emitted when root-cause diagnosis is synthesized.
* `DecisionFormulated`: Emitted when a strategic decision is formulated by the Rule Engine.
* `DecisionApproved`: Emitted when a decision passes policy checks or Human Gate approval.
* `ActionPlanned`: Emitted when deterministic execution steps are planned.
* `ActionExecuted`: Emitted when an action is executed.
* `CompensationExecuted`: Emitted when a Saga compensating action is triggered due to execution failure.
* `OutcomeVerified`: Emitted when post-execution verification finishes.
* `KnowledgePersisted`: Emitted when a learning pattern is written to Knowledge Memory.

---

## 4. Confidence Propagation Engine

Confidence in EDAOS decays as data passes through inference and correlation stages. The engine dynamically tracks **Confidence Score ($C$)** across the processor chain.

$$C_{\text{Next}} = C_{\text{Current}} \times (1 - \text{DecayFactor}) \times \text{SourceReliability}$$

### Example Decay Chain
```
Observation (C = 0.95) 
  └─► Evidence (C = 0.92) 
        └─► Finding (C = 0.81) 
              └─► Decision (C = 0.78) 
                    └─► Action (C = 0.76)
```

### Confidence Threshold Gates
* **High Confidence ($C \ge 0.85$)**: Fully autonomous execution permitted.
* **Medium Confidence ($0.65 \le C < 0.85$)**: Autonomous execution permitted with mandatory post-verification logging.
* **Low Confidence ($C < 0.65$)**: **AUTOMATIC HUMAN GATE TRIGGERED**. Pipeline pauses until human signoff or supplementary observation is gathered.

---

## 5. Saga Compensation Strategy

For operations modifying external systems, databases, files, or network services, EDAOS implements the **Saga Pattern** rather than assuming simple Git rollbacks.

Each `Action` MUST define a corresponding **Compensating Action**:

```yaml
ActionStep:
  id: ACT-001
  type: MODIFY_FILE
  payload:
    file: "src/components/HeroBanner.tsx"
    diff: "... diff content ..."
  
  compensating_action:
    type: REVERT_FILE_DIFF
    payload:
      file: "src/components/HeroBanner.tsx"
      restore_hash: "a8f9c2e"

ActionStep:
  id: ACT-002
  type: HTTP_POST_CONFIG
  payload:
    url: "https://api.system/config"
    body: { "cache": "disabled" }

  compensating_action:
    type: HTTP_POST_CONFIG
    payload:
      url: "https://api.system/config"
      body: { "cache": "enabled" }
```

### Compensation Execution Flow
1. If Stage 7 (Execute) or Stage 8 (Verify) fails, the **Saga Execution Manager** intercepts the failure.
2. It iterates backward through the list of completed Actions in reverse order ($ACT_N \dots ACT_1$).
3. Executes each step's `compensating_action`.
4. Emits `CompensationExecuted` event and halts safely.

---

## 6. Retry Policy & Idempotency Engine

To survive transient tool timeouts, network blips, or provider unreliability, Processors execute under an **Idempotent Retry Policy**:

```yaml
RetryPolicy:
  max_attempts: 3
  backoff_strategy: EXPONENTIAL
  initial_delay_ms: 500
  max_delay_ms: 8000
  backoff_multiplier: 2.0
  jitter: true
  
  idempotency:
    key_generator: "sha256(processor_id + input_entity_id + payload_hash)"
    store_ttl_seconds: 3600
```

* **Idempotency Guarantee**: If a processor is retried, the `key_generator` ensures duplicate execution calls return the cached output without re-executing side-effects.

---

## 7. Human Gate Architecture

The **Human Gate** is a first-class engine primitive that safely pauses pipeline execution and requests explicit human signoff under controlled conditions.

### Human Gate Trigger Conditions
1. **Low Confidence Score**: $C < 0.65$.
2. **Rule Hierarchy Conflict**: Equal-priority rules in conflict.
3. **High-Risk Operations**: File deletions, database schema migrations, production deployments.
4. **Policy Enforcement**: Enterprise policy explicitly mandates manual signoff (`human_approval_required: true`).

```
                              ┌───────────────────────────┐
                              │  Pipeline Processing...   │
                              └─────────────┬─────────────┘
                                            │
                                    (Check Conditions)
                                            │
                                            ▼
                              ┌───────────────────────────┐
                              │ Trigger Human Gate Modal  │
                              └─────────────┬─────────────┘
                                            │
                             ┌──────────────┴──────────────┐
                             ▼                             ▼
                     [User Approves]               [User Rejects]
                             │                             │
                             ▼                             ▼
                  Resume Execution Flow             Trigger Saga
                                                Compensation & Abort
```

---

## 8. Processor Graph Capabilities (Parallel, Fork, Merge)

Because EDAOS is structured as a **Processor Graph**, it supports complex non-linear execution patterns:

* **Parallel Execution**: Execute `ObservationProcessor(Browser)` and `ObservationProcessor(DevTools)` simultaneously.
* **Fork & Join**: Fork processing into `PerformanceAnalysis` and `AccessibilityAnalysis`, then merge Evidences at the `CorrelationProcessor`.
* **Conditional Execution**: Skip `DesignProcessor` if target files contain no UI components.

```
                         ┌──► [Perf Observation Processor] ──┐
                         │                                   │
[Capability Request] ───┤                                   ├──► [Correlation Engine]
                         │                                   │
                         └──► [A11y Observation Processor] ──┘
```
