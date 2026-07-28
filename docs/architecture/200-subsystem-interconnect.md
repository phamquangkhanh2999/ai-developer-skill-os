# Governed Runtime Interconnect: Subsystem Protocol & Execution Dynamics

> **Normative Standard**: This document is written in compliance with RFC 2119 normative syntax. Key words such as `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` are to be interpreted precisely as described in BCP 14 (RFC 2119 / RFC 8174).
> **Constitutional Basis**: Derived directly from [docs/architecture/100-runtime-topology.md](file:///d:/ai-code-skin-mcp/rules-skill/docs/architecture/100-runtime-topology.md) and the operational authority boundary established in [abi/invariants.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/invariants.md) (`[ABI-009]`).
> **Core Maxim**:
> ```markdown
> Phase 0 defined what the runtime is allowed to be.
> Phase 1 defines how the runtime breathes.
> ```

---

## 1. Scope & Implementation Role

This document constitutes the authoritative operational protocol binding the six Governed Runtime Boundaries together. While canonical semantic models specify static object syntax, this Interconnect Protocol regulates real-time thermodynamic interactions: how operational requests transit domain boundaries, how system failures are recorded as first-class evidence, and how mutation requests are authoritatively gated before impacting host environments.

All engine implementations MUST explicitly enforce the three normative execution workflows detailed below.

---

## 2. Normative Request Flow (Operational Lifecycle Pipeline)

Every standard capability operational assignment MUST execute sequentially through the ratified six-stage Request Flow:

```
[ IntentRecord ] 
       │  (Published & Frozen per [ABI-001])
       ▼
[ PolicyEnvelope ] 
       │  (Bound Monotonically per [ABI-002])
       ▼
[ ExecutionContext ] 
       │  (Coroutine Allocated; State Segregation Clean per [ABI-005])
       ▼
[ ExecutionPlan ] 
       │  (Introduced into Runtime Lifecycle; Reproducible per [ABI-004])
       ▼
[ CapabilityResult ] 
       │  (Driver Side-Effects Emitted via Capability Boundary)
       ▼
[ EvidenceRecord ] 
          (Causality Lineage Appended to Immutable Evidence Stream per [ABI-003])
```

### 2.1 Stage Transitions & Boundary Validation Gates
1. **Intent Generation**: The Intent Resolution Boundary publishes an immutable `IntentRecord` binding vendor-neutral URN coordinates (`urn:agent-boundary:contract:intent-record`).
2. **Policy Attachment**: The Policy Evaluation Boundary inspects the Intent, appending a read-only `PolicyEnvelope` specifying computational cost ceilings (*Instant*, *Targeted*, or *Deep*) and guardrail boundaries.
3. **Coroutine Allocation**: The Execution Coordination Boundary initializes an `ExecutionContext` state container (`FSM State: INITIALIZED ➔ RUNNING`). Quantitative observability counters are strictly excluded from memory sandbox structures (`[ABI-005]`).
4. **Plan Introduction**: An `ExecutionPlan` is introduced into the active lifecycle. The plan defines reproducible step coordinates referencing verified driver manifests.
5. **Driver Invocation**: The runtime dispatches assignments across the Capability Boundary. Capability implementations synthesize solutions, returning an explicit `CapabilityResult` payload.
6. **Lineage Commitment**: Prior to finalizing session state (`FSM State: COMPLETED`), the Execution Coordination Boundary streams an `EvidenceRecord` to the independent Audit Store, embedding exact UUID pointers linking Intent, Policy, Plan, and Result.

---

## 3. Normative Error Flow (Failure Contract Dynamics)

Operating under the foundational doctrine that *"Failure is data, not absence of data"*, unexplained host runtime crashes or unrecorded silent exceptions are strictly illegal. When an execution anomaly occurs, implementations MUST resolve the event via the standardized four-stage Error Flow:

```
[ Subsystem Failure ] 
         │  (Capability Crash / Guardrail Interdiction / Budget Exhaustion)
         ▼
[ Failure Contract Engagement ] 
         │  (Interdiction Gate Triggered per [ABI-006])
         ▼
[ Evidence Emission ] 
         │  (Diagnostic EvidenceRecord Synthesized & Posted)
         ▼
[ State Transition ] 
            (ExecutionContext FSM shifted to FAILED_WITH_EVIDENCE or POLICY_BLOCKED)
```

### 3.1 Failure Execution Mechanics
1. **Subsystem Failure Intercept**: Whether triggered by a capability syntax violation, an attempted write targeting a forbidden filesystem path, or real-time `ExecutionTelemetry` metrics equaling the `reasoning_burn_ceiling`, the runtime monitoring gate immediately arrests ongoing coroutine execution.
2. **Failure Contract Engagement**: Rather than passing unhandled exception stack traces out of the boundary, the Execution Coordination Boundary captures the exception under Invariant `[ABI-006]`.
3. **Evidence Emission**: A high-priority diagnostic `EvidenceRecord` is compiled and pushed across the Evidence Boundary. This log preserves exact causality metadata (`parent_intent_id`, `applied_policy_id`), diagnostic hash digests, and explicit error taxonomy codes explaining why operational execution was terminated.
4. **Terminal State Transition**: Only after diagnostic evidence is committed does the Coroutine State Manager transition the active `ExecutionContext` to `FAILED_WITH_EVIDENCE` (or `POLICY_BLOCKED`), terminating working registers and closing the FSM session cleanly without host process degradation.

---

## 4. Normative Authority Flow (Mutation Governance Mechanics)

To enforce the operational authority invariance defined in `[ABI-009]` (*Runtime Authority Boundary*) and Phase 0 Ownership rules (*Creator ≠ Authority*), physical host changes or internal state transformations MUST progress strictly via the mediated Authority Flow:

```
┌─────────────────────────────────────────────────────────────┐
│                      Capability Boundary                    │
└─────────────────────────────────────────────────────────────┘
                                │
                                │   proposes / requests
                                ▼
┌─────────────────────────────────────────────────────────────┐
│                 Runtime Authority (Kernel Core)             │
├─────────────────────────────────────────────────────────────┤
│   1. Validates L1 Schema & L2 Invariant Compliance          │
│   2. Interdicts against PolicyEnvelope Guardrail Scopes     │
│   3. Confirms Independent Verification Result (PASS / FAIL) │
└─────────────────────────────────────────────────────────────┘
                                │
                                │   approves / rejects
                                ▼
┌─────────────────────────────────────────────────────────────┐
│            Physical Host / Kernel State Mutation            │
└─────────────────────────────────────────────────────────────┘
```

### 4.1 Mutation Enforcement Discipline
1. **Proposals vs. Commands**: No third-party capability driver or external planning framework possesses execution command rights. All side-effect transmissions arriving from the Capability Boundary are formally processed as **Mutation Proposals**.
2. **Authoritative Gate Inspection**: The Execution Coordination Boundary (*Runtime Authority*) intercepts the proposal, subjecting it to three non-bypassable architectural gates:
   * **Gate 1**: Static syntax verification against L1 generated JSON schemas.
   * **Gate 2**: Dynamic interdiction checking against active `PolicyEnvelope` limitations (confirming target paths reside within permitted write directories and cost class allowances are unspent).
   * **Gate 3 (For DEEP operational profiles)**: Checking that an independent `VerificationResult` presenting an authentic `PASS` verdict has been certified by external testing harnesses.
3. **Execution Commitment or Rejection**: If all three governance gates succeed, the Runtime Authority enacts physical state or host mutation, concurrently registering the successful state delta inside an append-only `EvidenceRecord`. If any gate fails, the proposal is immediately discarded, no mutation occurs, and the Error Flow is initiated.
