# EDAOS RFC Process — Community Specification Governance

Version: 1.0.0 | Maintained by: Specification Working Group
Registry: spec.edaos.org/rfcs

---

## What is an RFC?

An EDAOS Request for Comments (RFC) is the formal mechanism for proposing
changes to the EDAOS specification (Specs 01-100+).

Every change to the specification — new spec, modification, or deprecation —
MUST go through the RFC process. There are no exceptions for Foundation members.

**RFCs are evidence objects**: they must document the problem, evidence of need,
and expected measurable outcome. Opinion-based proposals will be returned.

---

## RFC Numbering

Format: `EDAOS-RFC-YYYY-NNN`

Examples:
- `EDAOS-RFC-2026-001` — First RFC submitted in 2026
- `EDAOS-RFC-2026-042` — 42nd RFC submitted in 2026

---

## RFC States

```
DRAFT
  |
  v (submitted)
UNDER_REVIEW  ← 30-day public comment period
  |            ← Security Committee review (if applicable)
  v (WG vote)
ACCEPTED  or  REJECTED
  |
  v (Board ratification for MAJOR changes)
RATIFIED
  |
  v (implementation complete)
IMPLEMENTED
  |
  v (spec updated)
FINAL
```

---

## Change Categories & Approval Thresholds

| Category | Examples | Approval Required |
|---|---|---|
| **PATCH** | Typo fix, clarification | SWG simple majority |
| **MINOR** | New optional field, new spec | SWG simple majority + 14-day comment |
| **MAJOR** | Breaking change, invariant modification | SWG + Board ratification + 30-day comment |
| **CONSTITUTIONAL** | Master invariant, human veto, vendor neutrality | 75% Foundation referendum + 90-day comment |

---

## Submission

1. Fork `github.com/edaos-foundation/edaos-spec`
2. Copy `rfcs/RFC-TEMPLATE.md` to `rfcs/EDAOS-RFC-YYYY-NNN-short-title.md`
3. Fill in all required sections
4. Open a Pull Request — title: `RFC: EDAOS-RFC-YYYY-NNN Short Title`
5. The SWG assigns a formal RFC number within 72 hours

**Security-sensitive RFCs** (touching Spec 27, 38, 73, 83, 89) must be
submitted encrypted to security@edaos.org first.
