# Canonical Semantic Model: PolicyEnvelope

> **Normative Standard**: This document is written in compliance with RFC 2119 normative syntax. Key words such as `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` are to be interpreted precisely as described in BCP 14 (RFC 2119 / RFC 8174).
> **Constitutional Basis**: This canonical representation is directly derived from [abi/kernel_contract.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/kernel_contract.md), the authority model in [abi/ownership.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/ownership.md), and behavioral invariant `[ABI-002]` in [abi/invariants.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/invariants.md).
> **Transport Agnosticism**: This semantic model explicitly defines abstract resource governance logic and boundary budgets. It MUST NOT be coupled to any concrete serial encoding or transport wiring architecture.

---

## 1. Object Definition & Architectural Role

The `PolicyEnvelope` defines the immutable resource governance bounds, execution budgets, security guardrails, and operational escalation pathways assigned to an executing task. It acts as an authoritative runtime constraint plane that prevents unbounded tool invocation, uncontrolled reasoning expenditures, or unverified privilege escalations.

### 1.1 Core Constitutional Invariants
1. **Monotonic Policy Strictness (`[ABI-002]`)**: Once a `PolicyEnvelope` is bound to an active session within an `ExecutionContext`, its allowances and resource thresholds MUST NOT become less restrictive during execution.
2. **Controlled Mutation Authority**: A capability driver or autonomous planning agent MUST NOT self-modify or relax an established envelope. Modifying resource limits or escalating across cost tiers SHALL only occur through an authorized runtime escalation protocol ratified by external verification or explicit user interaction.
3. **Decoupled Evaluation**: The policy engine emitting this envelope MUST evaluate operational constraints based strictly on goal scope and ambient runtime parameters, remaining entirely oblivious to concrete third-party capability implementation code.

---

## 2. Normative Cost Class Tiers

To govern processing intensity and latency across varied operational requirements, every `PolicyEnvelope` MUST assign exactly one of the three normative operational cost class tiers:

| Cost Class Tier | Semantic Purpose & Operational Intent | Typical Budget Allowances & Latency Expectation | Escalation Permission |
| :---: | :--- | :--- | :--- |
| **`INSTANT`** | Zero-latency structural queries, simple linting checks, syntax transformations, or trivial metadata reading. | Low token ceiling; single-pass reasoning; highly restricted tool invocation count (often read-only). | Automatic escalation to higher tiers is **PROHIBITED** unless explicitly requested by user prompt. |
| **`TARGETED`** | Focused diagnostic investigation, isolated bug resolutions, feature additions inside explicit scope boundaries. | Moderate token ceiling; bounded multi-step tool calls; confined search recursion within declared targets. | MAY escalate to `DEEP` ONLY if explicit escalation rules match and budget reserves allow. |
| **`DEEP`** | Extensive architectural audits, multi-component refactoring, comprehensive test suite synthesis, or project health overhauls. | Maximum authorized processing budgets; deep recursion tolerances; rigorous verification gate hooks. | Represents the maximum runtime execution tier. Exceeding this boundary requires human-in-the-loop overrides. |

---

## 3. Canonical Semantic Attributes

An conforming `PolicyEnvelope` SHALL contain the logical semantic attributes detailed in the table below:

| Semantic Attribute | Logical Domain Type | Required / Optional | Constitutional Constraint & Semantic Definition |
| :--- | :--- | :---: | :--- |
| **`policy_id`** | Universally Unique Identifier | **REQUIRED** | Immutable identity coordinate. Required for causality lineage tracing in `EvidenceRecord` events. |
| **`cost_tier`** | Finite Enumeration | **REQUIRED** | MUST be set to exactly one of: `INSTANT`, `TARGETED`, or `DEEP`. |
| **`tool_call_budget`** | Unsigned Integer | **REQUIRED** | Absolute numerical ceiling governing the maximum permitted count of tool executions per session. |
| **`reasoning_burn_ceiling`** | Unsigned Integer | **REQUIRED** | Abstract numerical tolerance limit bounding total reasoning processing units or context size accumulation. |
| **`safety_guardrails`** | Collection of Security Badges | **REQUIRED** | Immutable operational constraints (e.g., read-only assertions, directory isolation rules, prohibited commands). |
| **`escalation_matrix`** | Structured Logic Matrix | **REQUIRED** | Declares valid escalation trigger thresholds, fallback strategies, and whether human intervention is mandatory. |
| **`timeout_duration`** | Unsigned Integer (Seconds) | **OPTIONAL** | Maximum wall-clock chronological lifespan authorized for continuous capability execution. |
| **`contract_version`** | Semantic Version Identifier | **REQUIRED** | Declares the active Kernel ABI contract version under which this governance envelope was established. |

---

## 4. Normative Runtime Enforcement Rules

1. **Strict Budget Interruption**: When a running task exhausts its assigned `tool_call_budget` or exceeds `reasoning_burn_ceiling`, the runtime state manager MUST immediately suspend or terminate the corresponding capability invocation, emitting a budgetary breach event into the evidence stream.
2. **Guardrail Supremacy**: If an executing capability attempts to access resources or perform actions forbidden by `safety_guardrails`, the runtime MUST reject the call at the kernel boundary immediately, regardless of remaining token or tool budgets.
3. **Imparted Lineage Binding**: Any operational decision to permit, restrict, or escalate execution MUST record the active `policy_id` directly inside all correlated causality reports.
