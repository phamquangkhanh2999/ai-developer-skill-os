# EDAOS Foundation Charter
# The Governing Body for the EDAOS Open Engineering Protocol Standard

Version: 1.0.0
Adopted: 2026-07-22
Status: RATIFIED

---

## Preamble

We, the founding members of the **EDAOS Foundation**, recognizing that software
engineering organizations increasingly depend on autonomous AI systems to build,
maintain, and evolve their software, and further recognizing that such systems must
operate under transparent, evidence-driven, and reversible governance — hereby
establish this Foundation to steward the EDAOS protocol as an open, vendor-neutral,
and globally interoperable standard.

The Foundation is governed by the principle that no entity — human or artificial —
shall act without evidence, decide without governance, or execute without the ability
to be verified and reversed.

---

## Article I — Mission & Scope

### Section 1.1 Mission

The EDAOS Foundation exists to:

1. **Maintain** the EDAOS specification as an open, version-controlled protocol standard.
2. **Certify** runtime implementations against the multi-level Conformance Test Suite.
3. **Grow** a vendor-neutral ecosystem of compatible agents, plugins, and tools.
4. **Protect** the master invariant across all certified implementations:
   `No Evidence => No Decision => No Execution`

### Section 1.2 Scope

The Foundation governs:

| Domain | Examples |
| :--- | :--- |
| Core Specification | Specs 01–36 Kernel, Contracts, Evidence Model |
| Enterprise Extensions | Specs 37–94 Compliance, Governance, Organization OS |
| Interoperability Layer | Specs 95–100 Federation, Identity Economy |
| Conformance Suite | `edaos_conformance_suite_v2.py` L1–L4 |
| Reference Runtime | `edaos_reference_runtime.py` |
| Certification Marks | EDAOS Compatible L1 / L2 / L3 / L4 |

---

## Article II — Governance Structure

```
                      EDAOS FOUNDATION BOARD
                               |
          ┌────────────────────┼────────────────────┐
          |                    |                    |
  Specification          Security             Certification
  Working Group          Committee            Committee
          |                    |                    |
  Runtime              Community             Legal &
  Maintainers          Council               Compliance
```

### Section 2.1 — Foundation Board

The Board holds ultimate stewardship of the specification and is the final authority
on all constitutional matters (Spec 89).

**Composition**: 7 seats (5 elected by Working Groups, 2 independent).
**Term**: 2 years, renewable once.
**Quorum**: 5/7 for constitutional amendments; simple majority for policy.

**Powers**:
- Ratify major version releases (vX.0)
- Approve or revoke Certification Authority status
- Override any Working Group decision with 5/7 super-majority
- Enforce the EDAOS Constitution (Spec 89, Articles 1–5)

---

### Section 2.2 — Specification Working Group (SWG)

**Mission**: Evolve the EDAOS specification. All spec changes follow this workflow:

```
RFC Submission
      |
      v
30-day Public Comment Period
      |
      v
SWG Technical Review
      |
      v
Security Committee Sign-off
      |
      v
Board Ratification
      |
      v
Release + Conformance Suite Update
```

**RFC numbering**: `EDAOS-RFC-YYYY-NNN`
**Voting**: Simple majority of active SWG members.
**Spec versioning**: Semantic versioning (`MAJOR.MINOR.PATCH`).

---

### Section 2.3 — Security Committee

**Mission**: Protect the integrity of the EDAOS trust model.

**Responsibilities**:
- Review all RFCs touching security, identity, or execution surfaces
- Maintain the Threat Model (Spec 38) and Constitution (Spec 89)
- Issue CVE disclosures for certified runtime vulnerabilities
- Revoke certification of runtimes failing security audits

**Mandatory sign-off required for**:
- Any change to Spec 27 (Zero-Trust Runtime)
- Any change to Spec 73 (Identity Federation)
- Any change to Spec 83 (Formal Verification)
- Any change to Spec 89 (Constitution)

---

### Section 2.4 — Certification Committee

**Mission**: Operate the multi-level certification program.

**Certification Marks**:

| Mark | Requirements |
| :--- | :--- |
| **EDAOS Compatible L1** | Pass L1 Evidence Exchange tests |
| **EDAOS Compatible L2** | Pass L1 + L2 Provenance tests |
| **EDAOS Compatible L3** | Pass L1–L3 Governance Compliance tests |
| **EDAOS Compatible L4** | Pass all L1–L4 including Execution Safety |
| **EDAOS Enterprise Certified** | L4 + Independent third-party audit (Spec 87) |

**Certification process**:
```
Applicant submits runtime + test results
      |
      v
Committee runs official conformance suite
      |
      v
Security Committee reviews security surface
      |
      v
Certificate issued (valid 12 months)
      |
      v
Renewal: re-run conformance on each minor release
```

---

### Section 2.5 — Runtime Maintainers

**Mission**: Maintain the reference implementation and conformance test suite.

**Repository**: `github.com/edaos-foundation/edaos-runtime`
**Release cadence**: Minor every 6 weeks; patch on-demand; major annually.

**Maintainer responsibilities**:
- Keep `edaos_reference_runtime.py` passing all L1–L4 tests
- Add conformance tests for every new spec
- Publish migration guides for breaking changes

---

### Section 2.6 — Community Council

**Mission**: Represent the broader ecosystem of developers, operators, and adopters.

**Composition**: 9 elected seats; any Foundation member may stand.
**Powers**:
- Propose RFCs to the SWG
- Request Board review of any SWG decision
- Publish ecosystem reports and adoption surveys
- Manage official community spaces (forums, Discord, mailing lists)

---

### Section 2.7 — Legal & Compliance Working Group

**Mission**: Ensure the Foundation and all certified implementations meet global
regulatory obligations.

**Scope**: EU AI Act, ISO 42001, IEEE 7000, GDPR, SOC2, NIST AI RMF.
**Output**: Annual Regulatory Alignment Report published by January 31 each year.

---

## Article III — Membership

### Section 3.1 — Membership Tiers

| Tier | Annual Contribution | Rights |
| :--- | :--- | :--- |
| **Individual** | Free | RFC submission, Community Council vote |
| **Startup** | $1,200 | All Individual + Early certification access |
| **Corporate** | $12,000 | All Startup + 1 SWG seat eligibility |
| **Strategic** | $60,000 | All Corporate + 1 Board seat eligibility |

### Section 3.2 — Code of Conduct

All members, maintainers, and contributors must uphold:

1. **Transparency**: All decisions are logged and publicly auditable.
2. **Evidence-first**: Proposals must be backed by data, not opinion.
3. **Reversibility**: Changes must include a rollback plan.
4. **Vendor-neutrality**: No single organization may hold more than 2 Board seats.

---

## Article IV — Intellectual Property

### Section 4.1 — Specification License

The EDAOS specification text is licensed under
**Creative Commons Attribution 4.0 (CC BY 4.0)**.

Anyone may implement, fork, or build upon the specification, provided attribution
is maintained and implementations do not misuse Foundation certification marks.

### Section 4.2 — Reference Implementation License

The reference runtime and conformance suite are licensed under **Apache 2.0**.

### Section 4.3 — Certification Mark Policy

The marks `EDAOS Compatible L1–L4` and `EDAOS Enterprise Certified` are
registered trademarks of the EDAOS Foundation. Use requires active certification.

---

## Article V — Constitutional Constraints (Non-negotiable)

The following constraints CANNOT be amended by any Board vote. They require a
full Foundation-wide referendum with 75% approval and a 90-day comment period:

1. **The Master Invariant** (`No Evidence => No Decision => No Execution`)
   must appear in every certified implementation.

2. **Human Ultimate Veto** (Constitution Article 4) must be preserved in
   every version of the specification.

3. **Zero Data Loss** (Constitution Article 5) — Saga rollback must be
   formally proven before any certified mutation is permitted.

4. **Vendor Neutrality** — No single entity may hold majority control over
   the Board, SWG, and Certification Committee simultaneously.

---

## Article VI — Conformance Invariant

The Foundation formally adopts as its governing invariant:

```
+----------------------------------------------------------+
|                                                          |
|   No Evidence  =>  No Decision  =>  No Execution        |
|                                                          |
|   And therefore:                                         |
|                                                          |
|   No Evidence  =>  No Trust  =>  No Federation          |
|                                                          |
+----------------------------------------------------------+
```

All Foundation activities, from specification work to certification decisions
to community governance, are evaluated against this invariant.

---

*Ratified by the EDAOS Foundation Founding Members, 2026-07-22.*
*This charter is itself version-controlled and subject to the RFC process.*
