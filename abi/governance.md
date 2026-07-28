# Agent Boundary Interface: Contract Governance Authority & RFC Process

> **Normative Standard**: This document is written in compliance with RFC 2119 normative syntax. Key words such as `MUST`, `MUST NOT`, `REQUIRED`, `SHALL`, `SHALL NOT`, `SHOULD`, `SHOULD NOT`, `RECOMMENDED`, `MAY`, and `OPTIONAL` are to be interpreted precisely as described in BCP 14 (RFC 2119 / RFC 8174).
> **Constitutional Basis**: While [abi/versioning.md](file:///d:/ai-code-skin-mcp/rules-skill/abi/versioning.md) establishes normative semantic numbering semantics (`MAJOR.MINOR.PATCH`), version numbering rules do not equate to a governance process. This constitutional charter establishes explicit human and architectural oversight authority over ABI evolution:
> ```markdown
> Versioning rule != Governance process
> ```

---

## 1. Constitutional Authority & Separation of Powers

To prevent arbitrary alteration of established boundary contracts during operational scaling, authority over the Agent Boundary Interface (ABI) is vested exclusively in the **Contract Governance Authority (CGA)** (typically comprising the Core Architecture Board and lead platform maintainers).

1. **Exclusive Ratification Power**: No individual developer, autonomous AI coding agent, or third-party extension vendor possesses unilateral authority to commit modifications to any artifact residing within the `abi/`, `model/`, `manifest/`, or `schemas/` directories.
2. **Mandatory Peer Audit**: Any attempted PR or commit altering constitutional normative text MUST undergo explicit human review and authorization by designated members of the CGA before merging into protected production branches.

---

## 2. The Architecture RFC (Request for Comments) Workflow

Whenever an evolving operational capability or runtime extension necessitates structural changes to an established boundary contract, the modification MUST proceed through the formalized 4-Phase Architecture RFC Workflow:

```
[ Phase 1: RFC Draft ] ➔ [ Phase 2: Open Peer Audit ] ➔ [ Phase 3: CGA Ratification ] ➔ [ Phase 4: CI Schema Generation ]
```

1. **Phase 1: RFC Draft**: The proposer authors an architectural RFC proposal detailing required changes to canonical domain attributes or behavioral laws, accompanied by explicit analysis of potential breaking backward compatibility across active capability ecosystems.
2. **Phase 2: Open Peer Audit**: The draft RFC undergoes mandatory public architectural critique and risk modeling across affected third-party driver vendors and internal kernel developers.
3. **Phase 3: CGA Ratification**: The Contract Governance Authority formally evaluates the evidence. If approved, the RFC status transitions to `APPROVED_FOR_MIGRATION`, authorizing edits exclusively upon canonical `.md` model specifications.
4. **Phase 4: CI Schema Generation**: In strict compliance with `schemas/generation_rules.md`, automated CI build generators synthesize new target validation schemas (`.schema.json`). Manual edits to generated schemas remain strictly forbidden during migration.

---

## 3. Major Releases & Controlled Migration Windows

When an approved architecture RFC mandates a breaking **MAJOR** version change (e.g., transitioning from ABI `1.x.x` to `2.0.0`), the CGA MUST govern rollout across third-party capability marketplaces through a controlled migration window:

1. **Dual-Contract Coexistence Period**: Upon publishing a MAJOR contract release, the hosting runtime kernel MUST maintain a dual-protocol gateway capable of evaluating both the deprecating legacy ABI (`1.x.x`) and the newly ratified ABI (`2.0.0`) for a defined deprecation grace window (RECOMMENDED minimum: 90 calendar days or 2 feature release cycles).
2. **Marketplace Advisory Telemetry**: During the coexistence window, legacy capability drivers communicating over older contracts SHALL execute normally but MUST trigger explicit warning telemetry badges inside `ExecutionTelemetry` advising ecosystem maintainers of impending contract sunset dates.
3. **Formal Purge Gate**: Once the announced migration window lapses, the CGA issues a formal termination order. Subsequent runtime releases SHALL purge legacy parsing bridges, after which un-migrated capabilities SHALL be rejected immediately at the L1 Schema Conformance boundary.
