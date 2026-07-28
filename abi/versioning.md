# Agent Boundary Interface: Version Governance & Compatibility Matrix

> **Normative Standard**: This document is written in compliance with RFC 2119 normative syntax. Key words such as `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` are to be interpreted precisely as described in BCP 14 (RFC 2119 / RFC 8174).

---

## 1. Evolution Strategy & Semantic Contract Versioning

To safeguard third-party capability developers, marketplace ecosystems, and long-term production installations against spontaneous breakage, all contracts defined within this Agent Boundary Interface (ABI) MUST adhere to **Semantic Contract Versioning**, formatted as `MAJOR.MINOR.PATCH` (e.g., `1.0.0`).

### 1.1 Normative Versioning Rules
1. **MAJOR Version Bumps (`x.0.0`)**: MUST be incremented whenever a breaking semantic change occurs. A breaking change includes:
   - Removing or altering the semantic definition of an existing mandatory field in any canonical object contract (`IntentRecord`, `PolicyEnvelope`, etc.).
   - Re-defining or expanding the normative scope of any behavioral invariant set forth in `invariants.md`.
   - Modifying rights within the `Mutation Authority Matrix` defined in `ownership.md`.
2. **MINOR Version Bumps (`1.x.0`)**: MUST be incremented whenever backward-compatible semantic functionality is introduced. A MINOR change includes:
   - Adding a new optional field or optional negotiation metadata property to a canonical object model or Capability Manifest.
   - Introducing an optional verification or reporting badge in the execution telemetry schema.
   - Existing capability drivers built against version `1.0.x` MUST continue to operate seamlessly on a runtime enforcing ABI version `1.1.x` without code modifications.
3. **PATCH Version Bumps (`1.0.x`)**: MUST be reserved exclusively for editorial clarifications, commentary elaboration, formatting improvements, or typo corrections that do not alter operational data shapes, invariants, or runtime behaviors in any way.

---

## 2. Kernel vs. Capability Driver Semantic Compatibility Matrix

When evaluating driver deployment or dispatching execution plans, the runtime kernel and the specialist driver SHALL negotiate operational capability according to the normative compatibility matrix below:

| Active Kernel ABI Version | Declared Capability Driver ABI | Interoperability Status | Normative Governance Rule |
| :---: | :---: | :---: | :--- |
| **1.0.x** | **1.0.x** | ✅ **Fully Compatible** | Optimal operating state. Exact match in semantic definitions and invariants. |
| **1.1.x** | **1.0.x** | ✅ **Backward Compatible** | Kernel upgraded with optional fields; legacy driver operates safely under baseline `1.0` constraints. |
| **1.0.x** | **1.1.x** | ⚠️ **Conditional Support** | Driver declares newer MINOR version than Kernel. Runtime MUST reject unless driver explicitly declares compatibility fallback to `1.0` via its manifest bounds. |
| **2.0.x** | **1.x.x** | ❌ **Incompatible** | Kernel contains breaking Major semantic changes. Driver MUST NOT be invoked without upgrading to a `2.0`-compliant contract. |
| **1.x.x** | **2.0.x** | ❌ **Incompatible** | Driver requires newer Major ABI than legacy Kernel can enforce. Execution MUST be aborted immediately. |

---

## 3. Normative Deprecation Windows & Lifecycle Protection

To guarantee architectural stability across multi-year software product lifespans, deprecating any active ABI feature or object field MUST proceed through a controlled two-phase sunsetting window:

1. **Phase 1: Deprecation Announcement (MINOR Release)**  
   When a structural feature or optional parameter is deemed obsolete, it MUST first be formally marked as `DEPRECATED` in a subsequent MINOR release (e.g., `1.2.0`). During this phase:
   - The runtime kernel MUST continue to parse, validate, and execute the deprecated field without breaking capability execution.
   - The runtime MAY emit diagnostic warning badges inside `ExecutionTelemetry` advising driver maintainers to migrate away from the deprecated feature.
2. **Phase 2: Formal Removal (MAJOR Release)**  
   A feature marked as `DEPRECATED` SHALL NOT be completely purged from canonical models or schema validators until the release of the next MAJOR ABI version (e.g., `2.0.0`). 
   - Once a MAJOR release is deployed, any legacy payload presenting the excised property MUST be treated as an invalid contract syntax error, preventing driver invocation at the boundary plane.
