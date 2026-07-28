# Governed Runtime Architecture: Core Constitutional Principles

> **Normative Standard**: This document is written in compliance with RFC 2119 normative syntax. Key words such as `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` are to be interpreted precisely as described in BCP 14 (RFC 2119 / RFC 8174).
> **Architectural Mission**: While the Phase 0 Agent Boundary Interface (ABI) established static constitutional limits and data representation contracts, this architectural specification governs live physical behavior:
> ```markdown
> Phase 0 defined what the runtime is allowed to be.
> Phase 1 defines how the runtime breathes.
> ```

---

## 1. Scope & Philosophy: The Soul of the Governed Runtime

This specification purposefully defines zero software components, service topologies, or implementation languages. Instead, it codifies the six immutable philosophical principles—the living engine of physics—that govern every line of execution, planning, and evaluation occurring within the runtime environment.

Every execution engine, state manager, planning module, or capability driver claiming conformance with this ecosystem MUST strictly align its internal mechanics with these six inviolable foundational tenets.

---

## 2. The Six Constitutional Principles

### 2.1 Zero Trust Boundary
* **The Maxim**: *"Internal claims carry zero authority until validated at the boundary."*
* **Normative Rule**: The runtime MUST evaluate every data payload, manifest negotiation, and side-effect request arriving across an architectural boundary as untrusted by default. No capability driver, third-party planning framework, or LLM-generated JSON structure possesses implicit clearance. Every transaction MUST pass structural schema validation and behavioral invariant interdiction prior to Coroutine admission or OS-level deployment.

### 2.2 Intent First
* **The Maxim**: *"Action without explicit semantic intent is illegal."*
* **Normative Rule**: No calculation, network dispatch, or file modification SHALL commence within the runtime without an associated, ratified, and immutable semantic intent declaration (`IntentRecord`). The system NEVER evaluates uncontextualized terminal commands or arbitrary functions in isolation; it fulfills explicit user business outcomes governed by verifiable operational boundaries.

### 2.3 Policy First
* **The Maxim**: *"Security and financial limits pre-date execution."*
* **Normative Rule**: Authorization boundaries and budget limits (`PolicyEnvelope`) MUST be bound to the operational context BEFORE capability drivers are engaged. A policy envelope is monotonic and uncompromising; it MUST NOT be relaxed mid-flight to accommodate an expensive or failing capability. If an operational budget or guardrail ceiling is breached, execution halts instantaneously.

### 2.4 Evidence First
* **The Maxim**: *"If a decision cannot be causally proven, it did not legally happen."*
* **Normative Rule**: Observability is not an optional afterthought or debug toggle. The creation of append-only historical proof (`EvidenceRecord`) is integrated into the structural life cycle of every state transition. Following the doctrine that *"Failure is data, not absence of data"*, the runtime evaluates both successful operations and terminal exceptions (`FAILED_WITH_EVIDENCE`) as vital causally-linked milestones requiring explicit cryptographic recordation.

### 2.5 Explicit Authority
* **The Maxim**: *"Creator never equals Authority."*
* **Normative Rule**: Reaffirming the foundational axiom established in Phase 0 (`Creator ≠ Authority`), the runtime kernel stands as the supreme arbiter of lifecycle progression and evidence acceptance (`[ABI-009]`). No individual component that generates a proposal—whether an Intent Resolver, Policy Engine, or Capability Driver—possesses the legal right to self-certify its own outputs or force lifecycle transformations upon neighbor domains.

### 2.6 Controlled Mutation
* **The Maxim**: *"State changes only through mediated gate checks."*
* **Normative Rule**: Direct external memory writes targeting kernel-owned session containers (`ExecutionContext`) are strictly interdicted. State evolution MUST progress solely through mediated lifecycle state transitions overseen by authoritative runtime gatekeepers. Any component attempting autonomous state mutation outside established governance protocol incurs immediate interdiction and eviction from active routing tables.
