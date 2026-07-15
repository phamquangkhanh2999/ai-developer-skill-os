---
name: qk-bug-resolution
category: maintenance
version: 7.0.0
description: "Sửa lỗi (bugs) bằng chu trình khép kín: Quan sát -> Giả thuyết -> Bằng chứng -> Sửa."
---

# qk-bug-resolution

## Scope
- Existing defects only (Diagnose & Repair)
- Enforcing the strict Repair Loop.

## Verbs
- `[DIAGNOSE]`: Follow the `Observe -> Hypothesis -> Evidence` loop.
- `[REPAIR]`: Execute the fix only when confidence is high.

## Constraints
```yaml
must:
  - "Strictly follow the Repair Loop: Observe -> Hypothesis -> Evidence -> Fix -> Verify -> Done"
  - "Collect evidence (stack trace/logs/dependency graph) before diagnosis"
  - "Verify fix before completion"
must_not:
  - "Jump directly from Observe to Fix (No slop debugging)"
  - "Rewrite modules unnecessarily"
  - "Guess root cause without concrete evidence"
```

## Policies
```yaml
prefer:
  - "Minimal patch"
  - "Root cause resolution over symptom patching"
  - "Regression prevention via targeted tests"
```

## Escalation
```yaml
stop:
  - "Missing logs/evidence after 2 attempts to gather them"
  - "Fix requires major architectural changes"
```

## Output
- Minimal patch and Risk summary.
