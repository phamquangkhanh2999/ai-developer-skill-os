---
name: qk-ui-audit
category: qa
version: 7.0.0
description: "Kiểm toán giao diện (UI) bằng checklist chống rác (Anti-slop) khắt khe."
---

# qk-ui-audit

## Scope
- UI consistency, Anti-Slop validation, accessibility, and performance auditing (Evaluate)

## Verbs
- `[AUDIT]`: Score the UI against the 57-point strict checklist (Anti-slop).

## Constraints
```yaml
must:
  - Score the UI components against `DESIGN.md` tokens.
  - Fail the audit if generic, lazy AI aesthetics are detected (e.g., default Tailwind blue/red, cluttered layouts).
  - Verify ARIA roles and contrast ratios.
  - Require micro-interactions (hover, active states) for all interactive elements.
must_not:
  - Pass the audit if the UI looks like a "cheap template".
  - Ignore mobile viewport constraints.
```

## Policies
```yaml
prefer:
  - Identifying systemic UI issues and demanding complete REDESIGN over isolated pixel tweaks.
```

## Escalation
```yaml
stop:
  - UI fails the Anti-Slop Audit (Score < 90/100). The agent MUST self-correct or ask the user to reject the code.
  - UI components completely lack semantic structure.
```

## Output
- Strict UI audit report with actionable fixes, demanding redesign if slop is detected.
