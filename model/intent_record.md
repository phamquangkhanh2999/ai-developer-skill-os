# Canonical Semantic Model: IntentRecord

> **Normative Standard**: This document is written in compliance with RFC 2119 normative syntax. Key words such as `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` are to be interpreted precisely as described in BCP 14 (RFC 2119 / RFC 8174).
> **Constitutional Basis**: This canonical representation is directly derived from the core definitions set forth in [abi/kernel_contract.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/kernel_contract.md), the rights defined in [abi/ownership.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/ownership.md), the Finite State Machine in [abi/state_machine.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/state_machine.md), and behavioral invariant `[ABI-001]` in [abi/invariants.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/invariants.md).
> **Transport Agnosticism**: This semantic model explicitly defines abstract domain logic and data invariants. It MUST NOT be coupled to any serialization encoding, wire formatting, or storage schema representation.

---

## 1. Object Definition & Architectural Role

The `IntentRecord` represents the canonical semantic instantiation of an operational goal or business directive within the Governed Agent Runtime. It bridges user-facing interaction layers with internal execution planning without leaking underlying implementation mechanisms or referring to concrete capability drivers.

### 1.1 Core Constitutional Invariants
1. **Immutability Law (`[ABI-001]`)**: Immediately upon transition out of the initial draft stage into runtime evaluation, every attribute within the `IntentRecord` MUST become strictly immutable.
2. **Opaque Target Independence**: An `IntentRecord` MUST specify *what* is desired (the objective and boundary constraints) and MUST NOT mandate *how* it is executed or designate specific third-party capability drivers.
3. **Mutation Authority Exclusion**: As codified in `ownership.md`, once published across the Agent Boundary Interface (ABI), neither the runtime kernel, planning engines, nor executing drivers retain any authority to mutate this record.

---

## 2. Canonical Semantic Attributes

An conforming `IntentRecord` SHALL contain the logical semantic properties detailed in the table below:

| Semantic Attribute | Logical Domain Type | Required / Optional | Constitutional Constraint & Semantic Definition |
| :--- | :--- | :---: | :--- |
| **`intent_id`** | Universally Unique Identifier | **REQUIRED** | Immutable identity coordinate. Serves as the primary parent node in all downstream causality lineages. |
| **`creation_timestamp`** | Universal Epoch Time | **REQUIRED** | Exact chronological marker recording when the Resolver compiled the semantic intent. |
| **`lifecycle_state`** | Finite Enumeration | **REQUIRED** | MUST be set to one of: `CREATED`, `PUBLISHED`, or `FROZEN`. Governed strictly by `state_machine.md`. |
| **`primary_goal`** | Structured Text Representation | **REQUIRED** | A concrete, unambiguous statement of the desired business outcome or technical target. |
| **`scope_boundaries`** | Collection of Structural Identifiers | **REQUIRED** | Explicit architectural zones, namespace limits, or path inclusions/exclusions limiting where actions may occur. |
| **`domain_constraints`** | Collection of Operational Rules | **REQUIRED** | Absolute security, performance, or operational invariants that executing capabilities MUST NOT breach. |
| **`confidence_score`** | Decimal Fraction (`0.0` to `1.0`) | **OPTIONAL** | Quantifies the Intent Resolver's heuristic certainty regarding user intent interpretation and disambiguation. |
| **`context_references`** | Collection of Immutable Pointers | **OPTIONAL** | Historic execution IDs, prior conversation coordinates, or knowledge pointers supplied to ground the objective. |
| **`contract_version`** | Semantic Version Identifier | **REQUIRED** | Declares the active Kernel ABI contract version under which this record was synthesized. |

---

## 3. Normative Validation & Verification Rules

1. **Boundary Transition Verification**: Before accepting an `IntentRecord` into the planning plane, the runtime kernel MUST verify that `lifecycle_state` has transitioned to `PUBLISHED` or `FROZEN`. If presented in the `CREATED` state, the invocation MUST be rejected with a boundary syntax exception.
2. **Constraint Completeness**: If `scope_boundaries` is empty or ambiguous, the runtime MUST refuse automatic escalation to intensive execution classes and SHALL emit an initial suspension requesting explicit user clarification.
3. **Lineage Primacy**: Any downstream semantic artifact (`ExecutionPlan`, `EvidenceRecord`, or `CapabilityResult`) originating from this goal MUST incorporate `intent_id` as its paramount root causal ancestor.
