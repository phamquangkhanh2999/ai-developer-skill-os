---
name: qk-feature-delivery
category: fullstack
version: 7.0.0
description: "Phát triển tính năng mới tuân thủ biểu đồ bối cảnh và Khế ước Thiết kế (DESIGN.md)."
---

# qk-feature-delivery

## Scope
- New capabilities (Plan & Execute)
- Fullstack delivery conforming to V7 Anti-Slop and Graphing requirements.

## Verbs
- `[DELIVER]`: Orchestrate the creation of a feature end-to-end.

## Constraints
```yaml
must:
  - "For logic: MUST demand a Structural Map (Dependency Graph) from qk-context-loader before coding"
  - "For UI: MUST strictly adhere to DESIGN.md and Anti-Slop aesthetics"
  - "Clarify requirements if ambiguous"
  - "Implement complete end-to-end flow"
must_not:
  - "Mix refactoring into feature work"
  - "Ignore backward compatibility"
  - "Emit generic 'AI-slop' UI or unverified logic"
```

## Policies
```yaml
prefer:
  - "Plan before implementing"
  - "Cover UI loading/error states"
  - "Self-audit against DESIGN.md and Context Graph"
```

## Escalation
```yaml
stop:
  - "Requirements are ambiguous"
  - "DESIGN.md or Context Graph is missing/unavailable"
ask:
  - "Before adding heavy dependencies"
```

## Output
- Feature implementation conforming to V7 quality standards.
