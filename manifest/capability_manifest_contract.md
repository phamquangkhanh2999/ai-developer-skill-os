# Agent Boundary Interface: Capability Manifest Negotiation Contract

> **Normative Standard**: This document is written in compliance with RFC 2119 normative syntax. Key words such as `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` are to be interpreted precisely as described in BCP 14 (RFC 2119 / RFC 8174).
> **Constitutional Basis**: This canonical negotiation specification is directly derived from [abi/kernel_contract.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/kernel_contract.md), authority boundaries in [abi/ownership.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/ownership.md), and version governance matrices in [abi/versioning.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/versioning.md).
> **Transport Agnosticism**: This semantic specification defines an abstract third-party driver negotiation contract. It MUST NOT be coupled to specific plugin file encoding formats or concrete machine serialization schemas.

---

## 1. Fundamental Nature: "Negotiation Contract over Metadata"

In a governed microkernel ecosystem supporting pluggable capabilities and marketplace driver deployments, a Capability Manifest is elevated above simple descriptor tags into a legally binding boundary interface:

```markdown
A Capability Manifest is not mere metadata. It is an authoritative negotiation contract.
```

1. **Opaque Selection Primacy**: The runtime Kernel and Planning Plane MUST evaluate, select, and authorize third-party capability drivers solely by interrogating their published Capability Manifests. The runtime SHALL NEVER inspect, execute, or parse underlying driver implementation source code during planning or operational negotiation!
2. **Prohibition of Undeclared Assumptions**:
   ```markdown
   Runtime MUST NOT assume undeclared capability behavior.
   ```
   If an operating capability driver attempts to invoke external tools, consume runtime memory variables, or apply filesystem side-effects outside the exact capabilities and limitations declared in its manifest, the kernel boundary MUST immediately intercept and terminate execution with a critical security violation error.

---

## 2. Canonical Manifest Attributes & Negotiation Structure

An conforming Capability Manifest SHALL contain the semantic attributes and structural blocks detailed in the table below:

| Semantic Attribute | Logical Domain Type | Required / Optional | Constitutional Constraint & Semantic Definition |
| :--- | :--- | :---: | :--- |
| **`capability_id`** | Namespaced String Identifier | **REQUIRED** | Globally unique namespaced coordinate identifying the specialist driver (e.g., `vendor/capability-name`). |
| **`contract_version`** | Semantic Version Identifier | **REQUIRED** | Semantic version number of this specific manifest release (`MAJOR.MINOR.PATCH`). |
| **`supported_scopes`** | Collection of Domain Targets | **REQUIRED** | Explicit enumeration of business problem goals, language syntaxes, or file domains this driver is qualified to execute. |
| **`required_guarantees`** | Collection of Runtime Preconditions| **REQUIRED** | Mandatory environmental capabilities, filesystem permissions, or system dependencies required from the hosting kernel. |
| **`compatibility_bounds`** | Bidirectional Compatibility Matrix| **REQUIRED** | Declares admissible Kernel ABI version ranges and required operational governance policies. |
| **`cost_profile`** | Resource Expectation Specification| **REQUIRED** | Defines compatible cost tiers, expected processing consumption intensity, and auto-escalation support flags. |
| **`trust_level`** | Security Certification Credential | **REQUIRED** | Declares active security classification and conformance verification verification badges. |
| **`limitations_disclosure`** | Collection of Constraint Assertions| **OPTIONAL** | Explicit structural admissions of unsupported architectures, file sizes, or edge cases. |

---

## 3. Bidirectional Compatibility & Governance Profile Schema

To prevent runtime failures and guarantee full interoperability between independent kernel releases and third-party drivers, the `compatibility_bounds`, `cost_profile`, and `trust_level` blocks MUST strictly conform to the following normative semantic schema:

```yaml
compatibility_bounds:
  minimum_kernel_abi: "1.0.0"       # Minimum Kernel ABI version required by this driver
  maximum_kernel_abi: "2.x.x"       # Upper boundary of tested Semantic Contract compatibility
  required_policy_features:
    - "escalation_control"
    - "budget_enforcement"

cost_profile:
  minimum_policy_tier: "TARGETED"   # Rejects invocation under trivial INSTANT budgets
  maximum_policy_tier: "DEEP"       # Tolerates extensive DEEP execution schedules
  supports_auto_escalation: false   # Explicit declaration that driver cannot self-escalate across tiers

trust_level:
  classification: "verified"        # MUST be one of: experimental, sandbox, verified, core
  verification_badges:
    - "schema_conformance_passed"
    - "behavior_invariant_passed"
    - "budget_compliance_verified"
```

---

## 4. Normative Runtime Negotiation & Enforcement Rules

1. **Bidirectional Rejection**: Just as the kernel verifies that a driver satisfies planning criteria, the driver manifest acts as a mutual check. If the active runtime kernel presents an ABI version outside `[minimum_kernel_abi, maximum_kernel_abi]` or lacks a parameter listed in `required_policy_features`, negotiation fails gracefully at the planning boundary without initiating coroutines.
2. **Trust Level Enforcement**: 
   - Drivers presenting a `trust_level.classification` of `experimental` or `sandbox` MUST be executed inside strictly isolated memory containers with read-only guardrails enforced by default.
   - Only capabilities bearing verified `schema_conformance_passed` and `behavior_invariant_passed` verification badges SHALL be cleared for complex filesystem side-effect generation under `DEEP` operational policies.
3. **Lineage Binding**: Whenever a capability driver is matched and authorized to execute an `ExecutionPlan`, its immutable `capability_id` and `contract_version` MUST be permanently recorded within the governing `ExecutionContext` and resulting `EvidenceRecord` causality lineage.
