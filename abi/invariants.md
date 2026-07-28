# Agent Boundary Interface: Behavioral Laws & Normative Invariants

> **Normative Standard**: This document is written in compliance with RFC 2119 normative syntax. Key words such as `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` are to be interpreted precisely as described in BCP 14 (RFC 2119 / RFC 8174).

---

## 1. Governance Objectives & Scope of Invariants

To guarantee interoperability across diverse implementations, prevent state corruption, and enforce runtime explainability over extended product evolutions, any implementation claiming compliance with the Governed / Microkernel Agent Runtime MUST abide by the normative invariants detailed herein. 

Violations of any specified invariant SHALL result in the immediate termination of the offending execution session and the generation of a high-priority boundary error in the audit lineage.

---

## 2. Constitutional Behavioral Invariants (ABI-001 ➔ ABI-005)

### 2.1 Invariant ABI-001: Intent Immutability
```markdown
[ABI-001]
IntentRecord MUST be immutable immediately upon publication from the Intent Resolver.
```
* **Normative Requirement**: Once an `IntentRecord` crosses the boundary plane into the runtime kernel (transitioning out of `CREATED` status), all attributes, business goals, security domain flags, and user scope parameters MUST be locked as read-only.
* **Prohibition**: No subsystem—including planners, routing engines, or capability drivers—MAY modify an established Intent. If an operation requires a broader scope or adjusted objectives, a new `IntentRecord` MUST be generated and negotiated independently.

### 2.2 Invariant ABI-002: Monotonic Policy Strictness
```markdown
[ABI-002]
PolicyEnvelope CANNOT become less restrictive during an active execution session.
```
* **Normative Requirement**: During an ongoing operational sequence, resource boundaries, tool invocation ceilings, token cost class limits (e.g., *Instant*, *Targeted*, *Deep*), and security restrictions set by the active `PolicyEnvelope` MUST act as a strict ceiling.
* **Prohibition**: Subsystems MUST NOT expand resource allotments or bypass safety rules autonomously. A transition from a restricted policy to a less restrictive policy SHALL require an explicit operational escalation that halts active driver execution until external verification or user confirmation explicitly issues a newly authorized `PolicyEnvelope`.

### 2.3 Invariant ABI-003: Sufficient & Lightweight Evidence (Evidence ≠ Replay)
```markdown
[ABI-003]
EvidenceRecord MUST provide sufficient causality lineage for audit reconstruction,
and MUST NOT contain complete execution state snapshots or raw reasoning dumps.
```
* **Normative Requirement**: The evidence ecosystem operates on the legal premise that **Evidence ≠ Replay**. An `EvidenceRecord` DOES NOT execute replay; rather, it supplies sufficient timestamps, cryptographic digests, component identifiers, and storage reference links to allow an external **Replay Reconstruction Process** to verify execution history.
* **Prohibition**: To preserve storage efficiency, privacy, and processing latency, an `EvidenceRecord` MUST NOT embed massive raw LLM prompt structures, unchecked chain-of-thought reasoning narratives, or complete filesystem state snapshots. Full execution profiling and telemetry data MUST reside within dedicated `ExecutionTelemetry` and `RuntimeProfile` repositories, referenced purely by unique identifiers within the evidence stream.

### 2.4 Invariant ABI-004: Execution Reproducibility
```markdown
[ABI-004]
ExecutionPlan MUST be reproducible under equivalent:
- IntentRecord
- PolicyEnvelope
- Capability Manifest Set
- Runtime Constraints

Non-deterministic decisions MUST emit an EvidenceRecord explaining divergence causes.
```
* **Normative Requirement**: While absolute determinism is unattainable in distributed runtime architectures where external resource availability and capability plugin states vary, the kernel planning plane MUST guarantee **reproducibility** under equivalent starting constraints.
* **Divergence Explainability**: When identical input pairs of `(IntentRecord, PolicyEnvelope)` result in diverging execution plans due to altered environmental availability or modified driver manifests, the runtime MUST emit an explicit `EvidenceRecord` entry recording the exact causal factors that motivated the architectural variance.

### 2.5 Invariant ABI-005: Clean Execution State Segregation (No God Objects)
```markdown
[ABI-005]
ExecutionContext MUST NOT store observation metrics, token cost accumulations,
tool calling counters, or performance profiling data.
```
* **Normative Requirement**: To prevent architectural decay into an unmaintainable monolithic "God State Object", the `ExecutionContext` MUST be strictly bounded to operational coroutine attributes: identity coordinates (`execution_id`, `correlation_id`), active lifecycle status (`RUNNING`, `SUSPENDED`, `COMPLETED`), and necessary working variables.
* **Segregation of Observability**: All quantitative consumption metrics, timer durations, reasoning burn ratios, and cache statistics MUST be routed exclusively to `ExecutionTelemetry` containers and analyzed via post-run `RuntimeProfile` artifacts.

### 2.6 Invariant ABI-006: Failure as a Valid State Transition (Failure Contract)
```markdown
[ABI-006]
Failure is a valid state transition. Runtime crashes without explanatory evidence are strictly prohibited.
```
* **Normative Requirement**: In an opaque microkernel runtime architecture, execution failures, parameter syntax violations, and guardrail interdictions MUST NOT trigger silent kernel crashes or raw, unexplained external host stack exceptions.
* **Controlled Termination Path**: When an operational error occurs, the active coroutine state manager MUST shift `ExecutionContext` to a formal terminal failure status (e.g., `FAILED_WITH_EVIDENCE` or `POLICY_BLOCKED`) and immediately emit an explicit diagnostic `EvidenceRecord` documenting the exact invariant breach, syntax failure, or resource exhaustion causing the halt.

### 2.7 Invariant ABI-007: Strict vs. Forward-Compatible Unknown Field Policy
```markdown
[ABI-007]
Kernel core objects MUST reject unknown fields (Strict).
Extension domain objects MUST preserve unknown fields (Forward-Compatible).
```
* **Normative Requirement for Kernel Objects (Strict Boundary)**: Core operational payload objects (`IntentRecord`, `PolicyEnvelope`, `ExecutionContext`, `ExecutionPlan`, `EvidenceRecord`) operate under absolute security hygiene. If an incoming byte sequence presents an undeclared property outside canonical schema boundaries (`additionalProperties: false`), the runtime gateway MUST immediately reject the submission with an L1 Schema Conformance error.
* **Normative Requirement for Extension Objects (Forward Compatibility)**: Capability Manifests (`CapabilityManifest`), plugin metadata descriptors, and custom capability outputs represent evolving third-party domain features. When the runtime kernel encounters an unrecognized optional attribute inside an extension object, it MUST preserve and transmit the property unchanged (`unknown field = preserve`), preventing spontaneous breakage across asynchronous vendor upgrade cycles.

### 2.8 Invariant ABI-008: Canonical Contract Identity Binding
```markdown
[ABI-008]
Every canonical object transmitted across the ABI MUST explicitly bind its Canonical Contract Identity.
```
* **Normative Requirement**: To guarantee seamless audit reproducibility decades after initial operational execution, every canonical object crossing the boundary plane MUST declare its foundational contract identity coordinates:
  ```yaml
  contract_id: "urn:agent-boundary:contract:intent-record"  # Vendor-neutral URN of canonical schema definition
  contract_version: "1.0.0"                                 # Active Semantic Contract Version (SemVer)
  schema_version: "2020-12"                                 # Target Schema Validator standard deployed
  created_at: "2026-07-28T10:18:00Z"                        # Absolute UTC timestamp of object synthesis
  ```
* **Lineage Primacy**: This immutable declaration ensures that when an evidence log re-inspects legacy execution trails (`v1`, `v2`, `v3` coexisting across multiple years), the audit replay process can unambiguously match the archived data payload against its identical historical contract schema validator without vendor branding dependencies.

### 2.9 Invariant ABI-009: Runtime Authority Boundary
```markdown
[ABI-009]
The runtime MUST remain the final authority for lifecycle transitions,
policy enforcement, and evidence acceptance.

External components MUST NOT directly mutate kernel-owned state.
```
* **Normative Requirement**: While Phase 0 established static ownership in `ownership.md`, this operational invariant transforms ownership into dynamic runtime behavior. The runtime kernel stands as the ultimate arbiter of all Coroutine state transformations, policy boundary enforcements, and audit stream admissions.
* **Interdiction of Direct Mutation**: Any attempt by external capabilities, planning plugins, or third-party monitoring adapters to bypass the Runtime Authority and directly alter memory registers within an `ExecutionContext` or append records without kernel mediation MUST result in immediate boundary termination.

### 2.10 Invariant ABI-010: Boundary Isolation
```markdown
[ABI-010]
External components MUST NOT bypass governed boundaries to access kernel-owned state.
```
* **Normative Requirement**: To prevent architectural erosion during physical code construction, explicit boundary decoupling is enforced as a strict memory isolation barrier. Capability drivers, LLM planning agents, and external third-party plugins SHALL NOT retain direct raw memory references or shared pointer structures linking to internal `ExecutionContext` containers or kernel state registers.
* **Gate Invocation Primacy**: Any interaction between an external capability and kernel-owned resources MUST progress purely via formal payload passing across ratified runtime boundary gateways.

### 2.11 Invariant ABI-011: Decision Traceability
```markdown
[ABI-011]
Every state transition MUST have a corresponding evidence reference.
```
* **Normative Requirement**: Operational silent state mutations are illegal under the *Evidence First* doctrine. No state machine within the ecosystem (whether transitioning from `INITIALIZED ➔ RUNNING`, `RUNNING ➔ COMPLETED`, or `RUNNING ➔ FAILED_WITH_EVIDENCE`) SHALL execute a transition without concurrently creating and binding a corresponding `EvidenceRecord` reference.
* **Audit Lineage Validation**: A context session exhibiting state transformation without an associated causality reference pointer (`causality_id`) SHALL be flagged as a fatal cryptographic auditing integrity fault and immediately frozen by the Runtime Authority.

### 2.12 Invariant ABI-012: No Hidden State
```markdown
[ABI-012]
Runtime components MUST NOT maintain hidden authoritative state outside
the governed execution context.
```
* **Normative Requirement**: To preserve absolute empirical replayability and post-flight reconstructability across multi-year operational audits, components executing within the runtime MUST operate without clandestine authoritative caches, undocumented side-memory registers, or persistent out-of-band state storage.
* **Context Monopoly**: All working variables and state progression parameters determining runtime routing or decision trees MUST reside visibly within the governed `ExecutionContext` or be recorded within the immutable audit stream. Any component relying upon hidden un-governed state to execute logic violates Phase 1 runtime physics.

### 2.13 Invariant ABI-013: Capability Non-Authority
```markdown
[ABI-013]
Capability execution MUST NOT possess runtime authority.

Capability MAY:
- receive invocation
- produce result
- emit declared side-effect proposal

Capability MUST NOT:
- mutate runtime state
- alter policy
- advance lifecycle
```
* **Normative Requirement**: Capabilities act strictly as external untrusted actors operating under contract. A capability invocation is strictly computationally limited to analyzing an input request payload and generating an output result or side-effect proposal. Any direct endeavor by an executing driver to adjust kernel lifecycle markers, relax resource allowances, or alter Coroutine RAM variables violates boundary sovereignty and MUST trigger authoritative termination.

### 2.14 Invariant ABI-014: Invocation Identity Binding
```markdown
[ABI-014]
Every capability invocation MUST bind:
- invocation_id
- invocation_attempt_id
- contract_id
- capability_contract_version
- parent_execution_id
```
* **Normative Requirement**: To eliminate the occurrence of orphan execution results within distributed async infrastructures and unambiguously trace retry loops across multiple operational attempts, every invocation passing across the Capability Boundary Bridge MUST structurally bind an immutable `invocation_id` and `invocation_attempt_id` paired directly with its parent kernel execution correlation pointers. Any capability result lacking verifiable identity linkage SHALL be rejected by the admission boundary.

### 2.15 Invariant ABI-015: Result Authenticity Boundary
```markdown
[ABI-015]
A CapabilityResult MUST explicitly segregate:
- Declared Output (What the capability claims to have accomplished)
- Observed Side Effect & Verification Evidence (What the runtime verifiably observes)
```
* **Normative Requirement**: The runtime SHALL NOT unconditionally accept a capability's unverified assertions regarding system mutations (e.g., assuming a file was altered merely because the tool reports success). True state mutation acknowledgment mandates empirical corroboration via runtime verification evidence or authority control inspection.

### 2.16 Invariant ABI-016: Capability Timeout Isolation
```markdown
[ABI-016]
Capability failure != Runtime failure.
The Governed Runtime MUST survive unhandled driver exceptions and execution timeouts.
```
* **Normative Requirement**: When a third-party capability exhibits computational deadlock, network hangs, or throws uncaught native exceptions, the underlying microkernel MUST NOT crash or exhibit unhandled stack dumping. The runtime boundary SHALL intercept the timeout or fault, cleanly emit a diagnostic `CAPABILITY_FAILURE` Evidence Record, and transition the active session safely to a terminal FSM state.

### 2.17 Invariant ABI-017: Logical Clock Ownership
```markdown
[ABI-017]
Capability MUST NOT create or advance runtime logical clocks.
Only Runtime Authority MAY advance logical clocks.
```
* **Normative Requirement**: To prevent causal timeline fragmentation and protect deterministic audit reconstruction (*Deterministic Decision Trace Reconstruction*), external capabilities are strictly forbidden from maintaining or incrementing Lamport atomic sequence counters. Only the central Runtime Authority possesses exclusive constitutional sovereignty over causal time advancement.

### 2.18 Invariant ABI-018: Capability Resource Declaration
```markdown
[ABI-018]
A capability manifest MUST explicitly declare its operational constraints prior to admission:
- resource_requirements:
  - cpu_budget
  - memory_budget
  - execution_timeout
  - external_access_scope
```
* **Normative Requirement**: To ensure the Governed Runtime evaluates safety guardrails before allocating compute or filesystem access, every extension must publish quantitative consumption envelopes within its registered manifest. The runtime SHALL deny execution authorization to any capability attempting operation without pre-declared resource bounds.

### 2.19 Invariant ABI-019: Capability Determinism Classification
```markdown
[ABI-019]
A capability manifest MUST categorize its operational determinism:
- determinism: [deterministic | externally_deterministic | nondeterministic]
```
* **Normative Requirement**: Because empirical decision reconstruction and replay semantics rely upon predictable computational reproducibility, external extensions are classified into explicit determinism strata (e.g., pure computation is `deterministic`, browser interaction is `externally_deterministic`, and LLM generative inference is `nondeterministic`). Audit reconstruction engines SHALL utilize this taxonomy to dictate exact replay strategies.

### 2.20 Invariant ABI-020: Capability Trust Promotion Lifecycle
```markdown
[ABI-020]
Capability trust transitions MUST progress strictly through sequential promotion gates:
registered ➔ validated ➔ sandboxed ➔ verified ➔ trusted

Skipping promotional steps or executing arbitrary trust leaps (e.g., unknown ➔ trusted) is strictly FORBIDDEN.
```
* **Normative Requirement**: Under zero-trust architecture principles, capabilities entering the discovery ecosystem do not initially possess operational trustworthiness. Every extension must successfully satisfy explicit validation and sandbox criteria at each transitional threshold. Any attempt by a driver or external adapter to bypass sequential promotion gates SHALL trigger immediate runtime interdiction and trust downgrade.

### 2.21 Invariant ABI-021: Capability Identity Attestation
```markdown
[ABI-021]
A capability manifest MUST pair its manifest identity with verifiable implementation attestation:
- manifest_identity
- implementation_identity (cryptographic fingerprint / artifact hash)
- verification_evidence
```
* **Normative Requirement**: To prevent runtime substitution attacks wherein an untrusted or altered runtime artifact masks under an approved manifest coordinate, every driver registration must submit verifiable implementation identity attestation. The admission boundary SHALL reject execution if the active runtime implementation fingerprint fails to match the manifest attestation record.

### 2.22 Invariant ABI-022: Capability Revocation Contract
```markdown
[ABI-022]
The discovery plane MUST implement an authoritative REVOKED trust terminal state:
- any trust tier ➔ revoked (upon security violation, contract expiration, or policy breach)
```
* **Normative Requirement**: When a verified or trusted extension exhibits contract violation, security breaches, or license expiration, the Governed Runtime SHALL immediately transition its trust hierarchy to `REVOKED`. A revoked capability is strictly interdicted from invocation discovery and cannot be directly re-promoted without total decommissioning and re-registration.

### 2.23 Invariant ABI-023: Capability Dependency Boundary
```markdown
[ABI-023]
Capabilities MUST explicitly declare their dependency graphs within their manifest:
- required_capabilities: [contract_id_1, contract_id_2, ...]
```
* **Normative Requirement**: Hidden runtime coupling between untrusted extensions is strictly prohibited. If a capability requires secondary capability invocations to fulfill its execution contract, these inter-dependencies must be published within the manifest. The discovery plane SHALL validate that all required capability nodes exist and hold equal or greater trust rank prior to admitting the dependent extension.

### 2.24 Invariant ABI-024: Plan Authority Boundary
```markdown
[ABI-024]
A Planner is strictly an untrusted computational proposal engine:
- Planner generates proposed ExecutionPlan from Intent
- Planner does NOT possess execution authority or resource allocation sovereignty
```
* **Normative Requirement**: Similarly to external capabilities, automated reasoning engines and planners operate strictly outside the trusted Kernel runtime authority domain. An execution plan generated by an external or LLM-based planner is purely a computational hypothesis and SHALL NOT execute until evaluated and ratified by the Plan Validator and Runtime Admission Boundary.

### 2.25 Invariant ABI-025: Plan Determinism Contract
```markdown
[ABI-025]
An ExecutionPlan MUST explicitly declare its deterministic execution invariants:
- execution_topology: [acyclic_dag | linear_sequence]
- determinism_assurance: [verifiable_reproducible | externally_dependent]
```
* **Normative Requirement**: To preserve deterministic trace reconstruction across complex orchestration workflows, every Execution Plan must structuralize its task steps into an explicitly declared Directed Acyclic Graph (DAG) or linear sequence. The Plan Validator SHALL authoritatively interdict any plan exhibiting dependency cycles, unresolvable references, or ambiguous ordering constraints.

### 2.26 Invariant ABI-026: Plan Mutation Prohibition
```markdown
[ABI-026]
Once ratified and admitted by the Plan Validator, an ExecutionPlan is permanently FROZEN.
- Dynamic runtime mutation of plan steps or parameter structures is strictly FORBIDDEN.
```
* **Normative Requirement**: Allowing executing capabilities or background tasks to dynamically alter upcoming steps within a ratified plan violates empirical auditability and policy envelopes. Once an ExecutionPlan passes admission, it is deep-frozen (`FROZEN_PLAN`). Any adaptation required during operational anomalies MUST terminate the current execution step and generate a formally governed plan replacement pulse with complete historical lineage.

### 2.27 Invariant ABI-027: Scheduler Resource Compliance
```markdown
[ABI-027]
The Execution Scheduler MUST validate per-step resource compliance prior to capability invocation:
- Step Resource Budget <= Residual Policy Envelope Allowance
```
* **Normative Requirement**: The Execution Scheduler SHALL NOT blindly dispatch task steps merely because an overall Execution Plan was admitted. Before invoking the Capability Boundary Bridge for any individual step, the scheduler must calculate real-time residual consumption against the active `PolicyEnvelope`. If the required step budget exceeds residual allowances, execution must pause or terminate under `RESOURCE_EXHAUSTED` taxonomy.

### 2.28 Invariant ABI-028: Fact Authenticity & Hallucination Interdiction
```markdown
[ABI-028]
The Cognitive Memory Plane MUST strictly separate verified empirical facts from unproven assertions:
- Memory state MUST be explicitly classified: [VERIFIED_FACT | HYPOTHESIS | UNVERIFIED_CLAIM]
- Promotion into persistent project memory REQUIRES runtime empirical evidence attestation.
```
* **Normative Requirement**: Under AI governance, unchecked LLM assertions or untrusted external conclusions constitute dangerous potential hallucinations. Any attempt to commit an unverified claim or hypothesis into the authoritative persistent `MemoryStore` without valid runtime evidence attestation SHALL trigger immediate interdiction (`ABI-028_HALLUCINATION_INTERDICTION`).

### 2.29 Invariant ABI-029: Knowledge Lineage & RAG Traceability
```markdown
[ABI-029]
Every external knowledge snippet or retrieved RAG document MUST carry verifiable causal lineage:
- source_uri
- extraction_epoch
- content_hash
- trust_rank
```
* **Normative Requirement**: To prevent RAG poisoning and preserve deterministic reconstruction of prompt engineering contexts, external knowledge retrieved by Vector Stores must embed complete provenance attestation. The RAG Pipeline SHALL automatically reject and discard any retrieved data chunks lacking verifiable lineage or falling below established trust thresholds.

### 2.30 Invariant ABI-030: Memory Mutation & Governed Eviction Contract
```markdown
[ABI-030]
Authoritative memory records are immutable by default. Direct or silent deletion is strictly FORBIDDEN.
- Eviction or modification requires formal Governed Eviction Proposals generating REVOKED_MEMORY_RECORD traces.
```
* **Normative Requirement**: Once a validated fact is admitted into the project memory repository, no external capability, plugin, or background task may perform arbitrary silent mutations or clandestine deletions. Removing or updating memory items mandates submitting a formal Governed Eviction Pulse through the runtime boundary, leaving an immutable revocation audit log for historical lineage inspection.

### 2.31 Invariant ABI-031: Untrusted RAG Engine Boundary Isolation
```markdown
[ABI-031]
Vector stores, embedders, and semantic RAG engines operate strictly as untrusted query adapters:
- RAG Engines operate outside kernel authority behind an invariant URN semantic boundary.
```
* **Normative Requirement**: Similarly to planning engines and tool drivers, retrieval engines do not hold sovereign kernel authority. The `KnowledgeBoundary` must decouple vector search implementations from core kernel logic, enabling dynamic runtime runtime replacement of RAG algorithms and models behind stable semantic coordinates without modifying a single line of kernel codebase.

### 2.32 Invariant ABI-032: Inter-Agent Authority Delegation Contract
```markdown
[ABI-032]
Delegation of execution tasks between collaborative agents MUST occur via explicit Delegation Contracts:
- Sovereign Root Kernel Authority CANNOT be transferred or delegated.
- Sub-agents operate strictly under bounded DelegationPulse read/write scopes.
```
* **Normative Requirement**: Under federated multi-agent architecture, an external or child sub-agent is an untrusted computational peer. Any attempt by a delegating capability or peer agent to transfer sovereign root kernel authority or bypass explicit contract boundaries SHALL trigger immediate interdiction (`ABI-032_UNAUTHORIZED_AUTHORITY_LEAP`).

### 2.33 Invariant ABI-033: Federated Quota Sub-Allocation
```markdown
[ABI-033]
Resource allocation to delegated sub-agents MUST remain strictly bounded by parent policy limits:
- Child Sub-Allocation Budget <= Parent Residual Quota Allowance
```
* **Normative Requirement**: A parent agent cannot delegate resource allowances greater than its own remaining operational budget. The Quota Suballocator MUST calculate residual budget envelopes in real-time prior to opening a federation bridge. Any candidate delegation demanding quota exceeding residual parent capacity SHALL be decisively rejected (`ABI-033_QUOTA_OVER_ALLOCATION_INTERDICTED`).

### 2.34 Invariant ABI-034: Distributed Causality Lineage Trace
```markdown
[ABI-034]
Collaborative execution across multi-agent swarms MUST preserve continuous causality lineage:
- federated_trace_chain: [parent_agent_id ➔ child_agent_id ➔ peer_agent_id]
```
* **Normative Requirement**: To maintain deterministic audit reconstruction across distributed agent networks, every invocation running through a federation bridge must embed an unbroken, verifiable `federated_trace_chain`. Any inter-agent pulse lacking a traceable causal link back to the originating parent intent SHALL be discarded by the boundary bridge.

### 2.35 Invariant ABI-035: Federated Trust Reciprocity & Interdiction
```markdown
[ABI-035]
Sub-agent exceptions, resource timeouts, and policy breaches MUST be isolated at the federation boundary:
- Sub-agent failure SHALL NOT crash or compromise parent kernel state.
- Policy breach triggers swarm-wide FEDERATION_REVOCATION_PULSE.
```
* **Normative Requirement**: Just as individual untrusted capabilities are contained within sandboxes, external collaborative agents in a federation must be insulated by the `FederationBridge`. Unhandled exceptions, communication timeouts, or security breaches exhibited by a sub-agent MUST be authoritatively trapped, generating an immutable revocation pulse without disrupting host kernel sovereignty.

---

## 3. Normative Causality Lineage & Contract Reference IDs

To fulfill the foundational constitutional maxim that *"Every runtime decision must be explainable from the ABI and the evidence"*, every event appended to an `EvidenceRecord` stream MUST embed both an unambiguous **Causality Lineage** chain and a formal **Contract Reference ID**:

```yaml
causality_lineage:
  parent_intent_id: "UUID-INTENT-001"
  applied_policy_id: "UUID-POLICY-002"
  executed_plan_id: "UUID-PLAN-003"
  produced_result_id: "UUID-RESULT-004"
contract_reference:
  contract_id: "urn:agent-boundary:contract:kernel-abi"
  kernel_abi_version: "1.0.0"
  capability_contract_version: "1.0.0"
```

1. **Causality Lineage**: Every runtime decision MUST explicitly reference the immutable identifiers of the Intent, Policy, and Plan that precipitated the resultant action or driver invocation.
2. **Contract Reference**: Every audit node MUST explicitly declare the exact semantic version numbers and URN coordinates of both the **Kernel ABI** and the **Capability Manifest Contract** active at the precise second of execution. This ensures that historical audit evaluations conducted years in the future can accurately reconstruct operational decisions under the specific legal and behavioral rules enforceable at the original runtime epoch.
