# Canonical Semantic Model: ExecutionPlan

> **Normative Standard**: This document is written in compliance with RFC 2119 normative syntax. Key words such as `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` are to be interpreted precisely as described in BCP 14 (RFC 2119 / RFC 8174).
> **Constitutional Basis**: This canonical representation is directly derived from [abi/kernel_contract.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/kernel_contract.md), immutability rights in [abi/ownership.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/ownership.md), and behavioral invariant `[ABI-004]` in [abi/invariants.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/invariants.md).
> **Transport Agnosticism**: This semantic model defines an abstract operational instruction blueprint. It MUST NOT be coupled to concrete JSON arrays, script syntaxes, or machine serialization structures.

---

## 1. Object Definition & Architectural Role

The `ExecutionPlan` represents the immutable, structured operational roadmap synthesized by the planning plane in response to a valid pair of `(IntentRecord, PolicyEnvelope)`. It outlines sequential execution steps, target scope constraints, and required driver qualifications, acting as an unambiguous boundary contract that instructs capability drivers on authorized tasks.

### 1.1 Core Constitutional Invariants
1. **Reproducible Determinism Law (`[ABI-004]`)**: An `ExecutionPlan` MUST be strictly reproducible when evaluated against an equivalent set of: `IntentRecord`, `PolicyEnvelope`, active `Capability Manifest Set`, and ambient `Runtime Constraints`. Any divergence resulting from real-time dynamic variations MUST be accompanied by formal diagnostic evidence explaining the structural cause.
2. **Post-Approval Immutability**: As enforced in `ownership.md`, once an `ExecutionPlan` is verified and authorized by governance oversight, its instructions and target queries MUST NOT be edited mid-run by executing capability drivers.
3. **Decoupled Planning Plane**: The architecture does not concern itself with how the planning logic operates (whether deterministic heuristics, LLM chains, or manual input). The resulting semantic plan MUST simply satisfy the required properties without assuming undeclared capability runtime internals.

---

## 2. Canonical Semantic Attributes

An conforming `ExecutionPlan` SHALL contain the logical semantic attributes detailed in the table below:

| Semantic Attribute | Logical Domain Type | Required / Optional | Constitutional Constraint & Semantic Definition |
| :--- | :--- | :---: | :--- |
| **`plan_id`** | Universally Unique Identifier | **REQUIRED** | Immutable unique identity coordinate. Required for causality lineage tracking in evidence events. |
| **`parent_intent_id`** | Universally Unique Identifier | **REQUIRED** | Mandatory causality reference pointing to the originating `IntentRecord`. |
| **`governing_policy_id`** | Universally Unique Identifier | **REQUIRED** | Mandatory causality reference pointing to the currently active `PolicyEnvelope` that authorized this plan. |
| **`execution_steps`** | Ordered Sequence of Abstract Step Objects | **REQUIRED** | An ordered list defining the operational sequence, individual task milestones, and step-level target constraints. |
| **`driver_query_criteria`** | Capability Requirement Filter | **REQUIRED** | Structural matching filters specifying required capabilities, minimum ABI versions, and expected trust tiers. |
| **`fallback_strategy`** | Structured Fallback Directives | **OPTIONAL** | Contingency actions to execute if primary capability negotiation fails or resource thresholds trigger suspension. |
| **`contract_version`** | Semantic Version Identifier | **REQUIRED** | Declares the active Kernel ABI contract version under which this plan was generated. |

---

## 3. Abstract Step Object Specification

Each step element embedded within `execution_steps` MUST contain:
1. **`step_sequence_number`**: An integer indicating order within the progression.
2. **`step_objective`**: A semantic instruction statement scoped strictly inside `parent_intent_id` boundary constraints.
3. **`target_resource_bounds`**: Explicit localization paths or domain namespaces restricting where side-effects may unfold during this step.
4. **`expected_output_type`**: Semantic category expectation for the eventual `CapabilityResult` payload.

---

## 4. Normative Verification & Enforcement Rules

1. **Plan Expiration on Policy Drift**: If an execution session undergoes escalation that results in a modified or expanded `PolicyEnvelope`, the currently executing `ExecutionPlan` MUST be suspended and re-evaluated by the planning plane under the new constraints.
2. **Strict Manifest Querying**: The `driver_query_criteria` MUST evaluate candidates purely against declarations in published Capability Manifests. The runtime kernel SHALL NOT inspect driver source implementation or bypass manifest trust validations during planning selection.
3. **Divergence Reporting**: Whenever an execution plan deviates from baseline expectations due to unavailable capabilities or modified runtime constraints, an `EvidenceRecord` MUST be immediately appended to the audit stream recording the exact root divergence causes.
