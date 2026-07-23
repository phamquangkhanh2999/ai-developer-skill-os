# RFC Template
# Copy this file and rename: rfcs/EDAOS-RFC-YYYY-NNN-short-title.md

---
rfc_id:       "EDAOS-RFC-YYYY-NNN"     # Assigned by SWG
title:        "Short descriptive title"
status:       "DRAFT"                  # DRAFT | UNDER_REVIEW | ACCEPTED | REJECTED | FINAL
category:     "MINOR"                  # PATCH | MINOR | MAJOR | CONSTITUTIONAL
authors:
  - name:    ""
    github:  ""
    org:     ""
created:      "YYYY-MM-DD"
spec_refs:    []                        # Spec numbers this RFC modifies or references
security_review_required: false         # true if touching Spec 27/38/73/83/89
---

## Summary

*One paragraph. What does this RFC propose and why?*

---

## Motivation

### Problem Statement

*Describe the problem with evidence. Do not use opinion. Cite trace IDs,
benchmark results, or community reports where possible.*

### Evidence of Need

*Data backing the problem. Examples:*
- `N` organizations reported this limitation in the 2026 Community Survey
- Trace analysis shows `X%` of decisions are affected
- Current spec version produces the following measurable gap: `...`

---

## Proposed Change

### Specification Delta

*Describe exactly which spec(s) change and how. Use diff format where helpful.*

```diff
# Spec NN — [Name]

- old_field: ...
+ new_field: ...
+ new_requirement: "..."
```

### Conformance Suite Impact

*List any new or modified conformance tests required.*

| Test ID | Level | Change |
|---|---|---|
| `L1-EVD-005` | L1 | New — validates new required field |
| `L2-PRV-004` | L2 | Modified — updated assertion |

### Backward Compatibility

- [ ] This change is backward compatible (MINOR/PATCH)
- [ ] This change is breaking (MAJOR — requires Board ratification)

*Explain migration path for existing certified runtimes:*

---

## Impact Analysis

### Runtimes Affected

*List cert levels that must be updated: L1 / L2 / L3 / L4 / ENTERPRISE*

### Risk Assessment

| Risk | Probability | Mitigation |
|---|---|---|
| `...` | LOW/MEDIUM/HIGH | `...` |

### Expected Outcome

*Measurable improvement this RFC produces:*

| Metric | Before | Expected After |
|---|---|---|
| `...` | `...` | `...` |

---

## Alternatives Considered

*EDAOS provenance rules require rejected alternatives to be documented.*

| Alternative | Rejected Because |
|---|---|
| `...` | `...` |

---

## Reference Implementation

*If a proof-of-concept exists, link here. Otherwise mark as TODO.*

- [ ] Reference implementation: `TODO` / `github.com/...`
- [ ] Conformance test draft: `TODO` / attached

---

## Open Questions

*Unresolved design decisions the SWG must address:*

1. `...`
2. `...`

---

## Votes

*Filled in by SWG after public comment period closes.*

| Member | Vote | Date |
|---|---|---|
| `...` | APPROVE / REJECT / ABSTAIN | `...` |

**Result**: ACCEPTED / REJECTED on `YYYY-MM-DD`
