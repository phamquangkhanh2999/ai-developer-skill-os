# Agent Boundary Interface: Ownership & Mutation Authority

> **Normative Standard**: This document is written in compliance with RFC 2119 normative syntax. Key words such as `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` are to be interpreted precisely as described in BCP 14 (RFC 2119 / RFC 8174).

---

## 1. Capability Security Model & Rationale

### 1.1 The Creator ≠ Authority Principle
In a governed agent runtime where disparate planning engines, policy resolvers, and capability drivers operate across isolated security planes, ownership MUST NOT be equated with mutation authority.

```
Creator ≠ Authority
```

An entity that instantiates or synthesizes a data object (the Creator) DOES NOT retain unrestricted authority over its mutations or validity once the object crosses the Agent Boundary Interface (ABI). Once an object is transmitted to the runtime boundary, governance over its mutation and lifecycle is transferred exclusively to the designated **Mutation Authority**.

### 1.2 Purpose of Ownership Boundaries
1. **Prevent Unregulated Side-Effects**: Capability drivers MUST NOT manipulate execution state or policy bounds independently.
2. **Guarantee Audit Integrity**: Evidence generators MUST NOT alter previously committed historical event records.
3. **Enforce Deterministic Traceability**: Every modification to mutable runtime state MUST be directly traceable to an authorized runtime state manager.

---

## 2. Normative Ownership & Mutation Authority Matrix

All core semantic objects transmitted across the Agent Boundary Interface SHALL adhere strictly to the governance rights set forth in the following matrix:

| Canonical Object | Creator | Owner | Mutation Authority | Security Law & Governance Invariants |
| :--- | :--- | :--- | :--- | :--- |
| **IntentRecord** | Intent Resolver | Runtime | **None after freeze** | The object MUST be strictly immutable immediately upon publication. Neither planners nor drivers SHALL alter its business intention. |
| **PolicyEnvelope** | Policy Source | Runtime | **Controlled governance only** | The policy MUST NOT be modified or relaxed during active execution. Only verified escalation protocols SHALL update cost allocations. |
| **ExecutionContext** | Runtime | Runtime | **Runtime state manager** | Represents an isolated Coroutine / Session Container. Only the kernel state manager SHALL mutate variables or execution status. |
| **ExecutionPlan** | Planner | Runtime | **None after approval** | Once authorized by policy verification, the plan is locked against mutation. Any execution divergence MUST terminate or escalate. |
| **CapabilityResult** | Capability Driver | Runtime | **Append-only producer** | Issued directly by the matched specialist driver. The driver MUST NOT modify existing kernel state; it SHALL only emit distinct results. |
| **EvidenceRecord** | Runtime | Audit Store | **Audit writer only** | Represents an append-only event lineage stream. Once recorded in the audit store, records MUST NOT be modified or deleted. |

---

## 3. Normative Security Invariants

### 3.1 Immutability Enforcement
1. **Intent Immutability**: Any computational node receiving an `IntentRecord` MUST treat all fields—including scope constraints and goal directives—as read-only memory. Attempts to modify an intention after initial resolver publication MUST generate an immediate boundary exception.
2. **Policy Drift Prevention**: A capability driver or execution engine MUST NOT tamper with a `PolicyEnvelope`. If resource consumption nears approved thresholds, the subsystem MUST trigger explicit escalation rather than self-authorizing expanded budgets.
3. **Plan Lock-in**: An `ExecutionPlan` authorized for execution MUST NOT be edited mid-run by the assigned capability driver. If a capability encounters unplanned obstacles, it MUST return a failed or partial `CapabilityResult` along with diagnostic evidence.

### 3.2 State Isolation
1. **Execution State Monopoly**: The `ExecutionContext` is owned and governed solely by the runtime kernel. Specialist capabilities MAY query session context parameters but MUST NOT directly inject unvalidated mutations into the shared context container.
2. **Audit Independence**: The **Audit Store** is the exclusive authority over the `EvidenceRecord` lineage repository. Neither planners nor capabilities SHALL possess write or delete permissions to historical evidence repositories.
