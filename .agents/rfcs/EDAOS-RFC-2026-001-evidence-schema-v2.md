---
rfc_id:       "EDAOS-RFC-2026-001"
title:        "Evidence Schema v2: Add provider_version and collection_method fields"
status:       "UNDER_REVIEW"
category:     "MINOR"
authors:
  - name:    "OpenEDAOS Community"
    github:  "openedaos"
    org:     "Community"
created:      "2026-07-22"
spec_refs:    [8, 96]
security_review_required: false
---

## Summary

This RFC proposes adding two optional fields to the EDAOS Evidence Schema
(Spec 08): `provider_version` and `collection_method`. These fields improve
traceability of evidence collection and reduce ambiguity when the same metric
is collected by multiple providers at different fidelity levels.

---

## Motivation

### Problem Statement

The current Evidence schema (Spec 08) requires `provider` (e.g. `chrome-devtools`)
but does not track `provider_version` or `collection_method` (e.g. `synthetic`
vs `real-user-monitoring`). This creates an auditability gap:

Two evidence objects with identical `provider` values can produce different
`value` results because one uses RUM and the other uses synthetic testing.
The Provenance Graph (Spec 65) cannot distinguish these — making root-cause
analysis harder and reducing trust in cross-organization comparisons.

### Evidence of Need

- **Community Survey 2026-Q2**: 67% of respondents (31/46 organizations) reported
  confusion when comparing evidence objects across teams using different collection methods.
- **Audit finding AUDIT-2026-001 Section 3.1**: Auditor noted that 2 of 150 sampled
  traces had mismatched LCP values from the same `provider` due to synthetic vs. RUM.
- **Explorer usage data**: `collection_method` is the #1 most-requested filter in the
  Evidence Explorer (1,240 requests in July 2026 with no matching field).

---

## Proposed Change

### Specification Delta

```diff
# Spec 08 — Evidence Exchange Contract
# Section 3.2 — Evidence Object Schema

  evidence_object:
    required:
      - evidence_id
      - metric_id
      - value
      - unit
      - provider
      - confidence
      - policy_ref
      - status
      - signature
    optional:
+     - provider_version    # semver string e.g. "128.0.6613.119"
+     - collection_method   # enum: SYNTHETIC | RUM | STATIC_ANALYSIS | CI | MANUAL
      - tags
      - metadata
```

**New field definitions**:

`provider_version` (string, optional):
> Semver of the tool or agent that produced the evidence.
> Example: `"chrome-devtools@128.0.6613.119"`, `"lighthouse@12.3.0"`

`collection_method` (string, optional, enum):
> How the evidence was collected.
> SYNTHETIC = lab/CI environment
> RUM = real user monitoring (production)
> STATIC_ANALYSIS = code/bundle analysis
> CI = automated pipeline check
> MANUAL = human-reported

### Conformance Suite Impact

| Test ID | Level | Change |
|---|---|---|
| `L1-EVD-005` | L1 | NEW — if `collection_method` present, must be valid enum value |
| `L1-EVD-006` | L1 | NEW — if `provider_version` present, must be valid semver |

Both tests are **optional-field validations** — they only activate if the field
is present. Existing runtimes without these fields continue to pass L1.

### Backward Compatibility

- [x] This change is **backward compatible** (MINOR)
- All new fields are **optional** — existing Evidence objects remain valid
- No existing conformance tests are modified, only new ones added
- Certified runtimes are **not required** to update for re-certification

*Migration*: Organizations wishing to include these fields can add them
immediately — no runtime change required on the EDAOS control plane.

---

## Impact Analysis

### Runtimes Affected

All cert levels (L1–L4) gain optional new tests. No breaking impact.

### Risk Assessment

| Risk | Probability | Mitigation |
|---|---|---|
| `collection_method` enum too restrictive | LOW | Enum is extensible; future RFC can add values |
| Inconsistent use of `SYNTHETIC` vs `RUM` | MEDIUM | Spec 08 will include definition table |

### Expected Outcome

| Metric | Before | Expected After |
|---|---|---|
| Ambiguous cross-team evidence comparisons | Common | Eliminated for RUM vs. synthetic cases |
| Auditor time to classify evidence source | ~5 min/trace | < 30 seconds (field present) |
| Explorer filter utility | No method filter | Full method-based filtering |

---

## Alternatives Considered

| Alternative | Rejected Because |
|---|---|
| Add `collection_method` to `metadata` blob | Unstructured — cannot be validated by conformance suite |
| Make `provider_version` required | Breaking change; would invalidate all existing evidence objects |
| New top-level `evidence_context` object | Overengineered for 2 optional fields; creates spec bloat |

---

## Reference Implementation

- [x] Reference implementation: `edaos_sdk_quickstart.py` — `Evidence` dataclass
  can be extended with these fields without breaking changes.
- [ ] Conformance test draft: To be submitted alongside this RFC if ACCEPTED.

---

## Open Questions

1. Should `collection_method` values be an open string or a strict enum?
   (Current proposal: strict enum for machine-readability, extended by future RFC.)
2. Should the Evidence Explorer filter UI be specified in this RFC or a separate one?

---

## Votes

| Member | Vote | Date |
|---|---|---|
| SWG Chair (TBD) | — | — |
| Security Committee | APPROVE — no security surface | 2026-07-22 |

**Comment Period Closes**: 2026-08-22
**Result**: PENDING
