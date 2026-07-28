# Governed Runtime Topology: Architectural Boundary & Subsystem Map

> **Normative Standard**: This document is written in compliance with RFC 2119 normative syntax. Key words such as `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` are to be interpreted precisely as described in BCP 14 (RFC 2119 / RFC 8174).
> **Constitutional Basis**: Derived directly from the foundational tenets established in [docs/architecture/000-core-principles.md](file:///d:/ai-code-skin-mcp/rules-skill/docs/architecture/000-core-principles.md) and the operational authority invariants locked in [abi/invariants.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/invariants.md) (`[ABI-009]`).

---

## 1. Topological Vision: Six Governed Runtime Boundaries

To guarantee that implementation components remain replaceable across multi-year technology evolution without breaking boundary compatibility, the runtime topology is structured not as monolithic code layers, but as **Six Explicit Governance Boundaries**. 

Each boundary isolates a dedicated responsibilities domain, enforcing strict validation intercepts before permitting state transits across domain gates:

```
                    Interaction Boundary
                            │
                            ▼
                 ┌────────────────────┐
                 │  Intent Boundary   │
                 └────────────────────┘
                            │
                            ▼
                 ┌────────────────────┐
                 │  Policy Boundary   │
                 └────────────────────┘
                            │
                            ▼
                 ┌────────────────────┐
                 │ Execution Runtime  │
                 │    Boundary        │
                 └────────────────────┘
                            │
              ┌─────────────┴─────────────┐
              ▼                           ▼
     Capability Boundary          Evidence Boundary
```

---

## 2. Normative Specification of Runtime Boundaries

### 2.1 Interaction Boundary
* **Domain Responsibility**: Serves as the outer defensive perimeter receiving unparsed conversational user dialogues, CLI parameters, UI triggers, or webhook payload signals.
* **Operational Constraint**: The Interaction Boundary operates with ZERO privileged kernel access. It MUST NOT directly query capability registries, invoke physical driver tools, or construct execution containers. Its sole output authority is passing cleaned human or automation input streams downstream toward intent resolution.

### 2.2 Intent Resolution Boundary
* **Domain Responsibility**: Converts amorphous interaction signals into mathematically rigorous, immutable business goals (`IntentRecord`).
* **Operational Constraint**: Positioned architecturally *before* runtime orchestration, this boundary acts as an independent synthesis engine. Once an `IntentRecord` transitions to a `PUBLISHED` state, it immediately freezes (`[ABI-001]`). The Intent Boundary MUST NOT initiate task scheduling or allocate computational resources.

### 2.3 Policy Evaluation Boundary
* **Domain Responsibility**: Evaluates ratified Intent targets against operational budgets, authorization clearance scopes, and security guardrail configurations to compile a immutable `PolicyEnvelope` (assigning *Instant*, *Targeted*, or *Deep* tier parameters).
* **Operational Constraint**: In accordance with the *Policy First* doctrine, this evaluation occurs entirely agnostic of downlevel execution mechanics or capability implementations. Once attached to an intent, the policy envelope operates monotonically; it CANNOT be modified or made less restrictive during subsequent task execution (`[ABI-002]`).

### 2.4 Execution Coordination Boundary
* **Domain Responsibility**: Functions as the authoritative living kernel core (*Runtime State Machine*). It allocates coroutine session sandboxes (`ExecutionContext`), introduces operational roadmaps into active lifecycles, and mediates real-time execution flows.
* **ABI Neutrality Invariant**: To preserve long-term ABI neutrality, architectural topology strictly decouples planning algorithms from the state engine:
  ```markdown
  ExecutionPlan is introduced into runtime lifecycle.
  ```
  *(We deliberately exclude phrases such as "Planner creates ExecutionPlan" to ensure that heuristic algorithms, LLM synthesis planners, or deterministic schedule tables remain freely swappable).*
* **State Supremacy**: In direct alignment with Invariant `[ABI-009]`, the Execution Coordination Boundary stands as the exclusive runtime authority empowered to execute FSM transitions (`RUNNING ➔ COMPLETED` or `RUNNING ➔ FAILED_WITH_EVIDENCE`). External components MUST NEVER directly mutate registers inside an `ExecutionContext`.

### 2.5 Capability Boundary
* **Domain Responsibility**: Governs the extensible, opaque plug-in ecosystem where third-party capability drivers perform domain specialized analysis, file mutations, or tool invocations.
* **Operational Constraint**: Communication across the Capability Boundary occurs strictly through standardized manifest negotiations (`capability_manifest_contract.md`). The Execution Coordination Boundary reads driver contracts without assuming undeclared behaviors. Capability executions emit purely domain side-effects via `CapabilityResult`, while quantitative cost observation metrics are routed directly to independent telemetry interceptors (`[ABI-005]`).

### 2.6 Evidence Boundary
* **Domain Responsibility**: Regulates the continuous, immutable audit lineage stream (`EvidenceRecord`), real-time consumption telemetry (`ExecutionTelemetry`), and third-party QA conformance validations (`VerificationResult`).
* **Operational Constraint**: Adhering to *Evidence First* and *Zero Self-Certification*, the Evidence Boundary operates entirely independent of the Capability Boundary. Capability drivers MUST NOT write directly into historical audit logs. Every emitted entry is validated by runtime governance, cryptographically digested, and appended to the causality trail (`Evidence ≠ Replay`), guaranteeing irrepudiable post-flight rebuild capabilities and explainability.
