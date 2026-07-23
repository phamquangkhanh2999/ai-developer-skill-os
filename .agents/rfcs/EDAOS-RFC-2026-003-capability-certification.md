# EDAOS-RFC-2026-003: Capability Certification Pipeline

## 1. Purpose
The Certification Authority Layer exists to transition the EDAOS Capability Marketplace from a "catalog of rules" to a governed admission system. **Certification is not a permission grant. Certification is a proof-backed trust state.**

Capabilities are not inherently trusted because they are popular or useful. They are certified because they mathematically prove their outputs, strictly observe their permission boundaries, and subject themselves to continuous auditability.

## 2. Certification State Machine
Certification is a dynamic lifecycle, not a static boolean state. 

```text
                 submitted
                    |
                    v
                 sandbox
                    |
                    v
              schema_check
              /          \
          failed        passed
            |              |
            v              v
        rejected     provenance_check
                           |
                    /              \
                failed            passed
                  |                 |
                  v                 v
              rejected        permission_audit
                                     |
                              /              \
                          failed            passed
                            |                 |
                            v                 v
                       rejected       golden_flow_test
                                               |
                                      /                 \
                                  failed              passed
                                    |                   |
                                    v                   v
                               rejected             certified
                                                        |
                                                        v
                                                  periodic_audit
                                                        |
                                        +---------------+---------------+
                                        |                               |
                                      valid                           drift
                                        |                               |
                                        v                               v
                                    continue                     re-certification
```

## 3. Governance Policies
The pipeline strictly enforces 4 foundational policies:
- **Schema Compliance**: No schema adherence, no entry.
- **Evidence Integrity**: Provenance hash-chains must mathematically trace back to raw observations.
- **Permission Isolation**: Principle of Least Privilege. Output boundaries are strictly enforced.
- **Semantic Stability**: Version upgrades must not alter the canonical meaning of evidence artifacts.

## 4. Certification Artifacts
### Certification Report
Upon completion of the pipeline, a `certification_report.yaml` is generated. It explicitly details the `ValidationResult` of every test, embedding cryptographic evidence of the capability's compliance to ensure the Authority itself is auditable.

### Registry Record
The `registry.yaml` updates the capability's status from `sandbox` to `certified`, marking the exact certification timestamp and pipeline policy version used during validation.

## 5. Lifecycle Management
- **Certification**: Initial intake into the ecosystem.
- **Version Upgrade**: Triggers a partial re-certification specifically testing for Semantic Drift.
- **Re-certification**: Required upon failure of a Periodic Audit.
- **Revocation**: Immediate delisting and removal of trust if malicious drift is detected in production.
