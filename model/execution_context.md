# Canonical Semantic Model: ExecutionContext

> **Normative Standard**: This document is written in compliance with RFC 2119 normative syntax. Key words such as `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` are to be interpreted precisely as described in BCP 14 (RFC 2119 / RFC 8174).
> **Constitutional Basis**: This canonical representation is directly derived from [abi/kernel_contract.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/kernel_contract.md), the runtime authority rules in [abi/ownership.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/ownership.md), the Coroutine State Machine in [abi/state_machine.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/state_machine.md), and segregation invariant `[ABI-005]` in [abi/invariants.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/invariants.md).
> **Transport Agnosticism**: This semantic model defines an abstract runtime living memory state container. It MUST NOT be coupled to concrete storage serializations, database records, or specific scripting memory representations.

---

## 1. Object Definition & Architectural Role

The `ExecutionContext` functions as an dynamic runtime coroutine state container and execution boundary envelope within the Governed Agent Runtime. Unlike static workflow pipeline input data, the context acts as a "living" session process inside which authorized capability drivers interpret execution plans and perform targeted operational steps.

### 1.1 Core Constitutional Invariants
1. **Segregation of Observability (`[ABI-005]`)**: To preserve architectural integrity and prevent structural decay into an unmaintainable monolithic "God State Object", the `ExecutionContext` MUST contain purely structural identity coordinates, active finite lifecycle status, and operational variables necessary for task continuation. It MUST NOT store observational metrics, resource consumption counters, token expenditures, or performance profiling footprints!
2. **Kernel Mutation Supremacy**: As enacted in `ownership.md`, the runtime state manager is the sole possessor of mutation authority over this object. Capability drivers MAY query active environment variables but MUST NOT inject unverified or unauthorized state mutations into the container.
3. **Lifecycle FSM Conformance**: Every instance of an `ExecutionContext` MUST progress exclusively through the valid transitions ratified in `state_machine.md`: `INITIALIZED ➔ RUNNING ➔ SUSPENDED ➔ COMPLETED ➔ ARCHIVED`.

---

## 2. Canonical Semantic Attributes

An conforming `ExecutionContext` SHALL contain the logical semantic properties detailed in the table below:

| Semantic Attribute | Logical Domain Type | Required / Optional | Constitutional Constraint & Semantic Definition |
| :--- | :--- | :---: | :--- |
| **`execution_id`** | Universally Unique Identifier | **REQUIRED** | Primary unique identity coordinate for the running coroutine container. |
| **`correlation_id`** | Universally Unique Identifier | **REQUIRED** | Umbrella correlation tracking pointer linking across related distributed tasks or multi-turn sessions. |
| **`lifecycle_state`** | Finite Enumeration | **REQUIRED** | Current FSM operating state (`INITIALIZED`, `RUNNING`, `SUSPENDED`, `COMPLETED`, or `ARCHIVED`). |
| **`bound_policy_id`** | Universally Unique Identifier | **REQUIRED** | Read-only reference pointing to the currently enforced immutable `PolicyEnvelope` governing this session. |
| **`bound_intent_id`** | Universally Unique Identifier | **REQUIRED** | Read-only reference pointing to the originating immutable `IntentRecord`. |
| **`runtime_variables`** | Key-Value Semantic Dictionary | **REQUIRED** | Active working variables, temporary memory placeholders, and environment state bindings needed for execution. |
| **`active_capability_ref`** | String Identifier | **OPTIONAL** | Identifier representing the specific capability driver actively attached to the coroutine sandbox during `RUNNING` status. |
| **`contract_version`** | Semantic Version Identifier | **REQUIRED** | Declares the active Kernel ABI contract version under which this session container operates. |

---

## 3. Normative Operational Behavior & Guardrails

1. **Suspension on Escalation**: When a task triggers a policy boundary condition requiring higher resource privileges or user clarification, the runtime state manager MUST immediately shift `lifecycle_state` from `RUNNING` to `SUSPENDED`. Active capability operations MUST freeze without executing further side-effects until clearance is formally verified.
2. **Strict Telemetry Decoupling**: If an auditing component or driver attempts to write raw execution counters or budget burn timestamps directly into `runtime_variables`, the state manager MUST reject the operation immediately, redirecting such records to the separate `ExecutionTelemetry` pipeline.
3. **Archival Cleanup**: Upon transitioning to `ARCHIVED` terminal status, all temporary storage memory within `runtime_variables` MUST be cleansed or set to read-only historical retention, preventing further coroutine re-activation.
