# EDAOS Core: Semantic Model & System Ontology

Version: 1.0.0
Status: APPROVED
Domain: Core Architecture Specification

---

## 1. Overview & Purpose

The **Semantic Model** serves as the single source of truth for the ubiquitous language (DDD) of the Evidence-Driven AI Engineering OS (EDAOS). 

Unlike a passive glossary, this document defines an **Ontology**: a formal blueprint specifying domain entities, strict ownership (Single Producer Principle), lifecycle state transitions, relationship semantics for the Knowledge Graph, and inviolable system invariants.

---

## 2. Actors & Single Producer Principle

To eliminate data ambiguity and prevent component overlap, **each entity in the system has exactly ONE authorized Producer Actor**.

```
┌──────────────────────────┐             ┌──────────────────────────┐
│         Provider         │ ──────────► │       Observation        │
└──────────────────────────┘             └──────────────────────────┘
                                                      │
┌──────────────────────────┐                          ▼
│   Evidence Interpreter   │ ──────────► │         Evidence         │
└──────────────────────────┘             └──────────────────────────┘
                                                      │
┌──────────────────────────┐                          ▼
│    Correlation Engine    │ ──────────► │         Finding          │
└──────────────────────────┘             └──────────────────────────┘
                                                      │
┌──────────────────────────┐                          ▼
│       Rule Engine        │ ──────────► │         Decision         │
└──────────────────────────┘             └──────────────────────────┘
                                                      │
┌──────────────────────────┐                          ▼
│         Planner          │ ──────────► │          Action          │
└──────────────────────────┘             └──────────────────────────┘
                                                      │
┌──────────────────────────┐                          ▼
│         Verifier         │ ──────────► │         Outcome          │
└──────────────────────────┘             └──────────────────────────┘
                                                      │
┌──────────────────────────┐                          ▼
│     Learning Engine      │ ──────────► │         Learning         │
└──────────────────────────┘             └──────────────────────────┘
```

| Actor | Responsible For | Product Entity |
| :--- | :--- | :--- |
| **Provider Adapter** | Interfacing with raw tools/MCPs | `Observation` |
| **Evidence Interpreter** | Evaluating observations against policies | `Evidence` |
| **Correlation Engine** | Analyzing causality across multiple evidences | `Finding` |
| **Rule Engine** | Evaluating rules against findings and policies | `Decision` |
| **Planner** | Transforming decisions into execution steps | `Action` |
| **Verifier** | Measuring system state post-action | `Outcome` |
| **Learning Engine** | Extracting reusable patterns & lessons | `Learning` |
| **Policy Evaluator** | Maintaining threshold contracts | `Policy` |
| **Capability Router** | Resolving capability definitions to adapters | `Capability` |

---

## 3. Domain Concepts (Ontology Schema)

### 3.1 Observation
* **Definition**: Raw measurement, trace, or log data collected directly from an underlying tool or runtime environment.
* **Purpose**: Capture objective, uninterpreted reality.
* **Produced By**: `Provider Adapter`
* **Consumed By**: `Evidence Interpreter`
* **Invariants**: 
  - Must be **strictly immutable**.
  - Cannot infer causality or trigger actions directly.
  - Does not evaluate pass/fail criteria.
* **Schema Blueprint**:
  ```yaml
  concept: Observation
  id: OBS-YYYYMMDD-UUID
  timestamp: ISO8601
  source:
    capability: string
    provider: string
  payload:
    metric: string
    value: number | string | object
    unit: string
  ```
* **Examples**: 
  - `LCP = 3.8s`
  - `Bundle size = 612KB`
  - `Console Error: Unhandled Promise Rejection`

---

### 3.2 Evidence
* **Definition**: An Observation interpreted within a specific Policy context, yielding a validated pass/fail or threshold status.
* **Purpose**: Establish contextual relevance and non-compliance proof.
* **Produced By**: `Evidence Interpreter`
* **Consumed By**: `Correlation Engine`, `Rule Engine`
* **Invariants**: 
  - Must reference **at least one valid Observation**.
  - Must specify a `confidence_score` (0.0 to 1.0).
* **Schema Blueprint**:
  ```yaml
  concept: Evidence
  id: EVI-YYYYMMDD-UUID
  derived_from: [OBS-YYYYMMDD-UUID]
  policy_ref: POL-PERF-LCP-01
  status: PASS | FAIL | WARNING
  confidence: HIGH | MEDIUM | LOW
  delta: "+1.3s over threshold"
  ```
* **Examples**: 
  - `LCP (3.8s) exceeds Performance Policy (target < 2.5s) [Status: FAIL, Confidence: HIGH]`

---

### 3.3 Finding
* **Definition**: A diagnostic hypothesis or root cause identified by correlating multiple Evidences across time or system layers.
* **Purpose**: Isolate the underlying cause of an issue rather than masking symptoms.
* **Produced By**: `Correlation Engine`
* **Consumed By**: `Rule Engine`, `Planner`
* **Invariants**: 
  - Must reference **at least one Evidence**.
  - Must explicit exonerated components vs culprit components.
* **Schema Blueprint**:
  ```yaml
  concept: Finding
  id: FND-YYYYMMDD-UUID
  supported_by: [EVI-YYYYMMDD-UUID]
  primary_culprit: "Image CDN Render Blocking"
  exonerated_targets: ["ProductGrid.tsx"]
  root_cause_type: Network | Asset | Code | Configuration
  ```
* **Examples**: 
  - `LCP failure caused by missing <link rel="preload"> for Hero Banner WebP asset.`

---

### 3.4 Decision
* **Definition**: A high-level strategic resolution formulated by evaluating Findings against Rule and Policy constraints.
* **Purpose**: Determine *what* needs to be done to restore compliance.
* **Produced By**: `Rule Engine`
* **Consumed By**: `Planner`
* **Invariants**: 
  - Must satisfy all active Policy constraints.
  - Must reference **at least one Finding**.
* **Schema Blueprint**:
  ```yaml
  concept: Decision
  id: DEC-YYYYMMDD-UUID
  resolves_finding: FND-YYYYMMDD-UUID
  strategy: "Preload and Optimize Hero Image Asset"
  rule_applied: RUL-FE-PERF-HERO-01
  ```

---

### 3.5 Action
* **Definition**: A concrete, executable task or file modification step generated to fulfill a Decision.
* **Purpose**: Execute precise code, configuration, or environment changes.
* **Produced By**: `Planner`
* **Consumed By**: `Execution Engine`, `Verifier`
* **Invariants**: 
  - Must be fully deterministic and executable.
  - Must target explicit files or system endpoints.
* **Schema Blueprint**:
  ```yaml
  concept: Action
  id: ACT-YYYYMMDD-UUID
  fulfills_decision: DEC-YYYYMMDD-UUID
  target_file: "src/components/HeroBanner.tsx"
  operation: ADD_PRELOAD_TAG | CONVERT_IMAGE_FORMAT | REFACTOR_HOOK
  ```

---

### 3.6 Outcome
* **Definition**: Post-execution measurement verifying whether an Action successfully resolved the original Evidence failure.
* **Purpose**: Provide empirical verification of fix effectiveness.
* **Produced By**: `Verifier`
* **Consumed By**: `Learning Engine`
* **Invariants**: 
  - Must reference **at least one Action** and **one post-fix Observation**.
  - Must declare an explicit `SUCCESS` or `FAILURE` state.
* **Schema Blueprint**:
  ```yaml
  concept: Outcome
  id: OUT-YYYYMMDD-UUID
  verifies_action: ACT-YYYYMMDD-UUID
  post_observation: OBS-YYYYMMDD-NEW
  status: SUCCESS | FAILURE | PARTIAL
  metric_change: "LCP reduced from 3.8s to 1.8s (-52.6%)"
  ```

---

### 3.7 Learning
* **Definition**: Knowledge pattern synthesized from an Action-Outcome cycle, persisted for future reasoning.
* **Purpose**: Enable long-term organizational memory and continuous AI self-improvement.
* **Produced By**: `Learning Engine`
* **Consumed By**: `Rule Engine`, `Correlation Engine`
* **Invariants**: 
  - Must reference a verified `Outcome`.
  - Must contain reusable context vectors for future matchings.
* **Schema Blueprint**:
  ```yaml
  concept: Learning
  id: LRN-YYYYMMDD-UUID
  derived_from_outcome: OUT-YYYYMMDD-UUID
  pattern_key: "HERO_IMAGE_LCP_PRELOAD"
  effectiveness_score: 0.95
  lesson: "Adding rel=preload to WebP Hero images consistently fixes LCP breaches on SSR pages."
  ```

---

### 3.8 Policy
* **Definition**: Declarative constraints and threshold definitions governing compliance expectations.
* **Purpose**: Decouple domain rules from hardcoded magic numbers or enterprise environment variance.
* **Produced By**: `Policy Evaluator`
* **Consumed By**: `Evidence Interpreter`, `Rule Engine`

---

### 3.9 Capability
* **Definition**: An abstract operational interface requirement (e.g., `browser.performance`, `code.references`).
* **Purpose**: Decouple high-level skills from underlying tools, providers, and MCP implementations.
* **Produced By**: `Capability Router`
* **Consumed By**: `Provider Adapter`

---

### 3.10 Provider
* **Definition**: Concrete execution plugin, adapter, or MCP server delivering capability data.
* **Purpose**: Execute raw interactions with tool ecosystems (Playwright, DevTools, Figma, LSP, Postgres).
* **Produced By**: External Environment / MCP Host
* **Consumed By**: `Provider Adapter`

---

### 3.11 Artifact
* **Definition**: Tangible file asset (trace, log, diff image, heapdump) produced during execution.
* **Purpose**: Provide auditability and human-verifiable proof.
* **Produced By**: `Provider Adapter`, `Verifier`
* **Consumed By**: `Evidence Interpreter`, Human Auditor

---

## 4. Relationships (Knowledge Graph Edges)

Nodes in the EDAOS Knowledge Graph are connected using strictly defined semantic edge relationships:

```
[Observation] ──(supports)──► [Evidence] ──(causes)──► [Finding]
                                                         │
                                                  (resolved_by)
                                                         │
                                                         ▼
[Outcome] ──(verifies)──► [Action] ◄──(executes)─── [Decision]
    │
(yields)
    │
    ▼
[Learning]
```

| Edge Type | Source Entity | Target Entity | Description |
| :--- | :--- | :--- | :--- |
| `produced_by` | Any Entity | Actor | Identifies component provenance |
| `supports` | Observation | Evidence | Raw measurement backing an evidence claim |
| `derived_from` | Evidence | Observation | Traces evidence back to origin data |
| `violates` | Evidence | Policy | Indicates non-compliance with a policy threshold |
| `causes` | Evidence | Finding | Establishes causal connection to root cause |
| `resolved_by` | Finding | Decision | Maps root cause finding to strategic decision |
| `executes` | Decision | Action | Maps decision to concrete execution steps |
| `verifies` | Outcome | Action | Post-fix validation of executed action |
| `yields` | Outcome | Learning | Synthesizes verified outcome into knowledge |
| `contradicts` | Evidence | Finding | Invalidate a false diagnostic hypothesis |

---

## 5. Lifecycle States

Every Concept entity transitions through an explicit lifecycle state machine:

```
[Collected] ──► [Normalized] ──► [Interpreted] ──► [Validated]
                                                         │
                                                         ▼
[Archived]  ◄── [Learned]   ◄── [Verified]   ◄── [Executed] ◄── [Evaluated]
```

1. **Collected**: Raw data received by Provider.
2. **Normalized**: Payload formatted to canonical JSON schema.
3. **Interpreted**: Evaluated against Policy thresholds to produce Evidence.
4. **Validated**: Causality & confidence checked to filter false positives.
5. **Correlated**: Grouped into root-cause Findings.
6. **Evaluated**: Formulated into Decisions by Rule Engine.
7. **Approved / Executed**: Planned and executed as deterministic Actions.
8. **Verified**: Measured post-execution to yield Outcome.
9. **Learned / Archived**: Synthesized into long-term Knowledge Graph memory.

---

## 6. Core System Invariants

1. **Strict Lineage Rule**: No `Decision` can be created without an explicit `Finding` derived from `Evidence` backed by `Observation`.
2. **Immutability of Observations**: An `Observation` payload can never be modified after collection.
3. **Single Producer Rule**: Only the designated Actor for a Concept is authorized to instantiate or mutate instances of that Concept.
4. **Policy Independence**: Rules and Skills MUST NEVER hardcode threshold numbers; all thresholds must reference a `Policy`.
5. **Tool Blindness**: Rules and Capabilities MUST NEVER reference specific MCP names, tools, or vendor SDKs.
