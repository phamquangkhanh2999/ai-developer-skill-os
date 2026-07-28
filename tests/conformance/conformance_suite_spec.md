# Agent Boundary Interface: 3-Tier Conformance Suite Specification

> **Normative Standard**: This document is written in compliance with RFC 2119 normative syntax. Key words such as `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` are to be interpreted precisely as described in BCP 14 (RFC 2119 / RFC 8174).
> **Constitutional Basis**: This conformance specification is directly derived from [abi/kernel_contract.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/kernel_contract.md), immutability rights in [abi/ownership.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/ownership.md), state machines in [abi/state_machine.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/state_machine.md), and behavioral laws in [abi/invariants.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/invariants.md).

---

## 1. Conformance Strategy & Rationale: Testing at the Boundary

In an extensible microkernel runtime supporting opaque third-party capability plugins, traditional internal code unit testing is structurally insufficient for guaranteeing platform reliability. A driver may pass isolated unit tests yet corrupt core kernel coroutines or leak unbounded reasoning budgets when executed in distributed production environments.

Therefore, testing governance within this runtime architecture MUST operate exclusively at the **Interface Boundary Level**:
```markdown
We test boundary behavior, not internal plugin syntax.
```

Any runtime engine or third-party capability driver claiming full compatibility with the Governed Agent Runtime MUST successfully pass all applicable tiers within this 3-Tier Conformance Suite.

---

## 2. Normative Conformance Levels (Level 1 ➔ Level 3)

### 2.1 Level 1 (L1): Schema Conformance & Syntax Integrity
* **Target Focus**: Static verification of data payloads, manifest syntaxes, and type integrity across all canonical semantic objects (`IntentRecord`, `PolicyEnvelope`, `ExecutionContext`, `ExecutionPlan`, `CapabilityResult`, `EvidenceRecord`, `CapabilityManifest`).
* **Normative Requirement**: Every data byte crossing the Agent Boundary Interface MUST validate completely against the static schema validators stored in `schemas/generated/*.schema.json`.
* **Failure Condition**: Any submission presenting malformed Universally Unique Identifiers (UUIDs), out-of-bounds numerical fractions, unparsed epoch timestamps, or undeclared properties (`"additionalProperties": false` breaches) SHALL trigger an L1 Conformance Exception, aborting evaluation prior to Coroutine creation.
* **Earned Credential Badge**: Drivers completing L1 static verification receive the `"schema_conformance_passed"` credential badge inside their manifest.

### 2.2 Level 2 (L2): Behavioral Invariant & State Machine Conformance
* **Target Focus**: Dynamic operational execution within controlled sandbox harnesses to verify strict adherence to constitutional behavioral laws and lifecycle transitions.
* **Normative Requirement**: Conformance harnesses MUST subject active candidate drivers to stress scenarios designed to verify:
  1. **Intent Immutability (`[ABI-001]`)**: Attempted operational writes targeting a frozen `IntentRecord` MUST fail and raise appropriate boundary security errors.
  2. **Monotonic Policy Strictness (`[ABI-002]`)**: Any attempt by a capability to autonomously expand resource limits or escalate cost tiers mid-execution without explicit user clarification authorization MUST be interdicted by the state manager.
  3. **Lifecycle Validity (`state_machine.md`)**: Context session transitions MUST never violate directionality (e.g., reverting a `COMPLETED` coroutine back to `RUNNING`).
  4. **Mutation Authority Alignment (`ownership.md`)**: Verification that third-party capability drivers strictly act as append-only producers without deleting or altering established `EvidenceRecord` lineage chains.
* **Earned Credential Badge**: Capabilities passing dynamic operational invariants receive the `"behavior_invariant_passed"` credential badge.

### 2.3 Level 3 (L3): Budget Compliance & Guardrail Enforcement
* **Target Focus**: Rigorous evaluation of resource governance, operational cost tiers (*Instant*, *Targeted*, *Deep*), and absolute security guardrail interdiction under high-load processing conditions.
* **Normative Requirement**: Conformance harnesses SHALL inject restrictive test policies (`PolicyEnvelope`) containing stringent ceilings for `tool_call_budget` and `reasoning_burn_ceiling`, alongside strict `safety_guardrails` (e.g., read-only filesystem restrictions, prohibited network destinations).
  1. **Instantaneous Budget Interdiction**: When cumulative operational counters in `ExecutionTelemetry` equal the designated envelope ceiling, the testing harness MUST confirm that the capability driver immediately suspends or transitions cleanly to a `POLICY_BLOCKED` status without leaking unverified physical side-effects.
  2. **Guardrail Supremacy**: Simulated driver requests attempting to read/write inside restricted filesystem paths declared in `safety_guardrails` MUST receive immediate kernel boundary rejection.
* **Earned Credential Badge**: Drivers proving fault-tolerant budgetary discipline receive the `"budget_compliance_verified"` credential badge.

---

## 3. Conformance Execution Pipeline & Verification Linking

To preserve strict architectural decoupling between physical execution operations and independent quality auditing, conformance test results MUST NOT be embedded directly into capability outputs (`CapabilityResult`). Instead, all conformance evaluation runs MUST emit standardized **Verification Results** (`verification_result.md`) linked into the historical audit stream via UUID references:

```
[ Capability Manifest & Payload ] ──> Evaluated against ──> [ L1 / L2 / L3 Conformance Suite ]
                                                                       │
                                                                       ▼
                                                             [ VerificationResult ]
                                                                       │
                                                                       ▼  Reference via UUID in
                                                             [ Historical EvidenceRecord ]
```
