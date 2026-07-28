# Canonical Semantic Model: EvidenceRecord

> **Normative Standard**: This document is written in compliance with RFC 2119 normative syntax. Key words such as `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` are to be interpreted precisely as described in BCP 14 (RFC 2119 / RFC 8174).
> **Constitutional Basis**: This canonical representation is directly derived from [abi/kernel_contract.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/kernel_contract.md), Audit Store authority rights in [abi/ownership.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/ownership.md), the Append-Only Stream rules in [abi/state_machine.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/state_machine.md), and lightweight audit invariant `[ABI-003]` in [abi/invariants.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/invariants.md).
> **Transport Agnosticism**: This semantic model defines an abstract historical audit trail event contract. It MUST NOT be coupled to concrete logging frameworks, serial byte formats, or specific immutable storage architectures.

---

## 1. Object Definition & Architectural Role

The `EvidenceRecord` represents an individual immutable node within the continuous, append-only historical audit event stream of the Governed Agent Runtime. It preserves undeniable proof of runtime decisions, policy boundary enforcement, capability selections, and execution outcomes without incurring massive memory storage penalties.

### 1.1 Core Constitutional Invariants
1. **Sufficient Evidence Law (`[ABI-003]`)**: The evidence model operates under the constitutional decree that **Evidence ≠ Replay**. An `EvidenceRecord` MUST provide sufficient causality lineage identifiers, timestamps, cryptographic digests, and external resource pointers to permit an external **Replay Reconstruction Process** to verify operational history. It MUST NOT contain complete execution state snapshots, voluminous raw prompt dumps, or unstructured chain-of-thought reasoning logs!
2. **Audit Store Authority & Append-Only Stream**: As codified in `ownership.md` and `state_machine.md`, an `EvidenceRecord` is strictly owned and governed by an independent **Audit Store**. Neither planning planes, policy engines, nor executing capability drivers possess write-after-append or deletion permissions over committed historical records.
3. **Mandatory Causality & Contract Lineage**: Every emitted record MUST explicitly bind its decision footprints to precise parental causality IDs and declare the exact historical contract versions enforceable at the moment of execution.

---

## 2. Canonical Semantic Attributes

An conforming `EvidenceRecord` event node SHALL contain the logical semantic properties detailed in the table below:

| Semantic Attribute | Logical Domain Type | Required / Optional | Constitutional Constraint & Semantic Definition |
| :--- | :--- | :---: | :--- |
| **`evidence_id`** | Universally Unique Identifier | **REQUIRED** | Immutable identity coordinate for this discrete historical audit event node. |
| **`sequence_number`** | Monotonically Increasing Integer | **REQUIRED** | Sequential tracking number ensuring continuous stream ordering without lineage gaps. |
| **`timestamp`** | Universal Epoch Time | **REQUIRED** | Absolute chronological marker capturing the precise moment of audit event commitment. |
| **`event_category`** | Finite Enumeration | **REQUIRED** | Categorization of event type (e.g., `POLICY_AUTHORization`, `CAPABILITY_INVOCATION`, `ESCALATION_TRIGGER`, `EXECUTION_COMPLETION`). |
| **`causality_lineage`** | Structured Lineage Container | **REQUIRED** | Mandatory collection of root parent identifiers linkingIntent, Policy, Plan, and Result. |
| **`contract_reference`** | Structured Contract Identifier | **REQUIRED** | Mandatory declaration of active Kernel ABI and Capability Contract version numbers. |
| **`telemetry_reference_id`** | Universally Unique Identifier | **OPTIONAL** | Unique link referencing quantitative consumption data in `ExecutionTelemetry`. |
| **`profile_reference_id`** | Universally Unique Identifier | **OPTIONAL** | Unique link referencing post-run empirical analytics in `RuntimeProfile`. |
| **`artifact_digests`** | Collection of Cryptographic Hashes | **OPTIONAL** | Cryptographic hash digests (e.g., SHA-256) proving the structural integrity of generated filesystem side-effects without embedding actual files. |

---

## 3. Normative Causality & Contract Reference Schema

To fully satisfy the explainability mandate that *"Every runtime decision must be explainable from the ABI and the evidence"*, the internal semantic structures for `causality_lineage` and `contract_reference` MUST contain:

```yaml
causality_lineage:
  parent_intent_id: "UUID-INTENT-REQUIRED"
  applied_policy_id: "UUID-POLICY-REQUIRED"
  executed_plan_id: "UUID-PLAN-OPTIONAL_UNTIL_INVOKED"
  produced_result_id: "UUID-RESULT-OPTIONAL_UNTIL_COMPLETION"

contract_reference:
  kernel_abi_version: "REQUIRED_SEMVER_STRING"
  capability_contract_version: "REQUIRED_SEMVER_STRING"
```

---

## 4. Normative Audit & Verification Rules

1. **Replay Lineage Continuity**: Any external evaluation engine traversing the historical evidence stream MUST verify that sequence numbers increment monotonically without missing steps or broken cryptographic hashes. A detected discontinuity MUST be flagged as an acute boundary tamper event.
2. **Prohibition of Raw Payload Bloat**: If a runtime component attempts to submit an `EvidenceRecord` containing unstructured megabyte-scale prompt narratives or full workspace file copies, the audit store MUST reject the submission, requiring the producer to generate an independent artifact in external storage and submit solely its cryptographic hash in `artifact_digests`.
3. **Audit Trail Decoupling**: Historical evidence MUST remain accessible for compliance review, profiling, or marketplace driver auditing even after the associated living coroutines (`ExecutionContext`) have been formally terminated or purged from active RAM.
