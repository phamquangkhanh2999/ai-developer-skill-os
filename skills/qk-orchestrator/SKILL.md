---
name: qk-orchestrator
category: core
version: 7.0.0
description: "Điều hướng yêu cầu của người dùng với kỷ luật thép, kiểm tra DESIGN.md và Context Graph."
---

# qk-orchestrator

## Scope
- Request analysis, task delegation, and strict process enforcement (Coordinate)

## Verbs
- `[ROUTE]`: Dispatch tasks strictly to specialist skills based on V7 architecture constraints.

## Constraints
```yaml
must:
  - Route user request to the correct sub-skill.
  - For UI tasks: MUST ensure `DESIGN.md` exists (or delegate to `qk-project-bootstrap`).
  - For Logic tasks: MUST ensure `qk-context-loader` generates a map first.
must_not:
  - Write code directly
  - Hallucinate non-existent skills
  - Allow UI work without a Design Contract
```

## Policies
```yaml
prefer:
  - Strict sequencing (Context Map -> Audit -> Code -> Verify) over chaotic parallel generation.
```

## Escalation
```yaml
stop:
  - No matching skill is found
  - The task violates the Zero-Trust or Anti-Slop philosophy of V7.
```

## Output
- Delegation plan with hard prerequisites checked.
