# Agent Boundary Interface: Object State Machines & Lifecycles

> **Normative Standard**: This document is written in compliance with RFC 2119 normative syntax. Key words such as `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` are to be interpreted precisely as described in BCP 14 (RFC 2119 / RFC 8174).

---

## 1. Lifecycle Governance & Rationale

To maintain predictable execution physics and support verifiable audit replay across heterogeneous deployments, all canonical semantic objects circulating within the Agent Boundary Interface (ABI) MUST obey well-defined finite state machines (FSM). 

Subsystems communicating across the kernel boundary SHALL NOT transmit or consume objects that violate valid state transition paths.

---

## 2. IntentRecord Lifecycle State Machine

The `IntentRecord` captures user or autonomous operational intentions. Its lifecycle MUST proceed unidirectionally without backward regressions:

```
[ CREATED ]
     │
     │  Resolver validation complete
     ▼
[ PUBLISHED ]
     │
     │  Kernel evaluation & commitment
     ▼
[ FROZEN ] ──(Terminated / Immutable Forever)
```

### 2.1 Normative State Rules
1. **CREATED**: An initial transient draft formed by the Intent Resolver. In this state, scope restrictions and target domains MAY be adjusted. The object MUST NOT be transferred across the runtime boundary in the `CREATED` state.
2. **PUBLISHED**: Once validated against basic syntax rules, the Intent Resolver transited the object to `PUBLISHED` and injects it into the ABI boundary. Upon entering this state, the intentional scope MUST NOT be expanded.
3. **FROZEN**: When the runtime accepts the intent and initiates policy evaluations or execution planning, the `IntentRecord` transitions to `FROZEN`. A `FROZEN` record is strictly immutable. Subsystems MUST NOT transition an object from `FROZEN` back to `PUBLISHED` or `CREATED`.

---

## 3. ExecutionContext Lifecycle State Machine

The `ExecutionContext` functions as an isolated living state container (coroutine session box) for active task executions:

```
             ┌─────────────────────────┐
             ▼                         │
[ INITIALIZED ] ──> [ RUNNING ] <───> [ SUSPENDED ]
                         │                 │
                         ├─────────────────┘
                         ▼
             ┌───────────┴───────────┐
             ▼                       ▼
      [ COMPLETED ]         [ FAILED_WITH_EVIDENCE ]
             │                       │
             └───────────┬───────────┘
                         ▼
                   [ ARCHIVED ]
```

### 3.1 Normative State Rules
1. **INITIALIZED**: The kernel allocates a session UUID, attaches a valid `PolicyEnvelope`, and establishes initial execution variables. No external capabilities SHALL be executed during initialization.
2. **RUNNING**: The context actively interprets an `ExecutionPlan` and manages communications with Capability Drivers. Variable state within the container MAY be updated exclusively by authorized runtime state managers.
3. **SUSPENDED**: If an operation encounters an authorization threshold requiring privilege escalation, user clarification, or external resource availability, the context MUST transition to `SUSPENDED`. Active driver calls MUST freeze or abort cleanly. Once clarification or expanded policy clearance is authorized, the state transitions back to `RUNNING`.
4. **COMPLETED**: Reached when all assigned capability tasks execute successfully. In this state, normal operations terminate and variables transition to read-only status.
5. **FAILED_WITH_EVIDENCE (Failure Contract)**: In compliance with Invariant `[ABI-006]`, operational error transitions (e.g., budget exhaustion, unrecoverable capability crash, or guardrail interdiction) are strictly recognized as valid lifecycle transitions rather than unhandled host runtime crashes! Upon entering `FAILED_WITH_EVIDENCE`, the state manager MUST instantaneously attach a critical diagnostic `EvidenceRecord` documenting the precise root failure cause before authorizing transition to archival.
6. **ARCHIVED**: The terminal state. The container is stripped of transient memory structures and persisted strictly as historical reference for subsequent session correlations or empirical runtime profiling.

---

## 4. EvidenceRecord Append-Only Event Stream

The `EvidenceRecord` DOES NOT follow a typical mutable state machine. Instead, it MUST be structured as a strictly progressive, continuous Append-Only Event Stream:

```
[ STREAM INITIALIZED ]
        │
        ▼  Append event_001 (Intent committed)
[ STREAM HEAD : 001 ]
        │
        ▼  Append event_002 (Policy matched & driver invoked)
[ STREAM HEAD : 002 ]
        │
        ▼  Append event_003 (Execution completed & verification reference ID recorded)
[ STREAM HEAD : 003 (CLOSED) ]
```

### 4.1 Normative Stream Rules
1. **Monotonically Increasing Sequence**: Each historical event committed to the evidence stream MUST receive a sequential, unique sequence identifier and timestamp.
2. **Immutability of Committed Nodes**: Once an event node (e.g., `event_001`) is committed to the stream, its cryptographic hash and causal reference pointers MUST NOT be altered or excised.
3. **Replay Continuity**: Any audit re-construction process MUST be able to traverse the stream from inception to stream head without encountering breaks in causality lineage or missing sequence steps.
