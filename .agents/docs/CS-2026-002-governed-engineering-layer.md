# CS-2026-002: EDAOS — From AI Assistant to Governed Software Engineering Layer

**Status**: FROZEN (Architecture Baseline v1.2)
**Date**: July 2026
**Subject**: The transition from autonomous AI agents to evidence-governed execution.

---

## 1. The Fallacy of the Autonomous Agent

For years, the industry chased the vision of the "Autonomous Agent" — an AI system that could reason, decide, and execute changes in a codebase entirely on its own. The underlying assumption was that as AI capabilities increased, human oversight could be proportionately reduced.

This assumption failed. As AI capabilities increased, the *blast radius* of AI mistakes increased exponentially. The traditional model tightly coupled **Intelligence** with **Authority**:

```text
[Flawed Model]
AI Reasoning + Execution Authority = Autonomous Agent
```

When an agent hallucinated, its integrated authority allowed it to silently commit destructive changes. The industry responded by adding "human-in-the-loop" prompts, but these were bandaids on fundamentally flawed architectures.

---

## 2. The EDAOS Philosophy

EDAOS (Evidence-Driven Agent Operating System) introduces a paradigm shift. We abandon the pursuit of unchecked autonomy and instead build an **Evidence-Governed Operating Layer**.

Our core philosophy is defined by two laws:

1. **Capability != Authority**: Being capable of proposing a change does not grant the authority to execute it.
2. **Evidence != Execution**: All AI reasoning must be distilled into verifiable *Evidence* before a *Decision* is made.

---

## 3. The Three Independent Layers of EDAOS

To enforce these laws, EDAOS structurally isolates the system into three bounded layers:

### A. IDE Authority (Input Surfaces / Thin Clients)
IDE extensions (like VS Code or Antigravity) are stripped of all AI reasoning and permission logic. They serve strictly as **Context Collectors** and **Renderers**. An IDE can capture the AST and the developer's intent, but it cannot negotiate authority.

### B. Capability Authority (Marketplace & Certification)
AI Capabilities (e.g., `GStack`, `Understand Anything`) are stateless functions. They consume an `Observation` and produce `Evidence` and an `Execution Proposal`. They do not possess terminal execution capabilities. Every capability must pass the **Certification Gate** to prove its deterministic adherence to these constraints.

### C. Runtime Authority (Execution Boundary & MCP Gateway)
The EDAOS Runtime sits between the IDE and the Capabilities (via an MCP Gateway), and between the Capabilities and the actual File System. The Runtime owns the absolute authority to block mutations.

---

## 4. The 8-Step Governed Lifecycle

EDAOS replaces the traditional "Prompt -> Execute" cycle with an 8-step governed lifecycle:

1. **Developer Intent**: The human initiates a request via a Thin IDE Client.
2. **Observation Creation**: The IDE extracts raw context (AST, file state) into an `ObservationRequest`.
3. **Evidence Generation**: The certified capability produces cryptographically hashed `Evidence` (e.g., "Duplicate logic found").
4. **Decision Contract**: The capability formulates an explicit, traceable decision.
5. **Execution Proposal**: The capability outputs a requested mutation.
6. **Execution Boundary**: The Runtime intercepts the proposal, blocking raw execution.
7. **Human Approval**: The Runtime generates an Approval Record containing the hash of the proposal. The human developer cryptographically signs their consent.
8. **Adapter Execution**: The system adapter verifies the approval hash against the execution proposal and performs the safe mutation, logging a final Audit Record.

---

## 5. The 6 Architectural Guarantees

This architecture inherently enforces 6 immutable guarantees:

1. **Evidence Integrity**: All observations are hashed and verifiable.
2. **Capability Safety**: Malicious or uncertified capabilities are violently rejected by the Gateway.
3. **Evidence Immutability**: Tampering with context during transit invalidates the governance hash.
4. **Semantic Stability**: Breaking changes in capability versions are caught by the Validation Gate.
5. **Decision Transparency**: Every decision made by AI is explicitly recorded prior to execution.
6. **Execution Boundary**: Zero mutations occur without passing a human-gated hash validation.

---

## 6. Roadmap to Enterprise Scale (Phase E)

Because EDAOS successfully abstracted *Governance* away from both the *Client* and the *AI Capability*, the ecosystem can scale infinitely without compounding risk.

The next evolutionary steps for EDAOS involve Enterprise Scale:
- **Enterprise Policy Layer**: Allowing organizations to inject compliance rules directly into the EDAOS Runtime.
- **Audit Replay Engine**: Enabling exact deterministic replays of any decision from Observation to Execution.
- **Multi-Repository Governance**: Scaling the single-runtime model across distributed microservices.

**Verdict**: AI can participate in software engineering at scale, but its authority must remain eternally governed. EDAOS provides the structural foundation for that future.
