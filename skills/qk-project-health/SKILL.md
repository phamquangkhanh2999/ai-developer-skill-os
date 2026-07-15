---
name: qk-project-health
category: qa
version: 7.0.0
description: "Kiểm toán toàn diện Code Smells, Tech Debt, và Architecture."
---

# qk-project-health

## Scope
- Technical Debt Auditing and System Health Monitoring (Evaluate)

## Verbs
- `[AUDIT]`: Evaluate the entire project's health.

## Constraints
```yaml
must:
  - "Identify deprecated packages and security vulnerabilities"
  - "Map out technical debt explicitly"
must_not:
  - "Ignore compiler or strict-mode warnings"
  - "Hide systemic architectural flaws"
```

## Policies
```yaml
prefer:
  - "Automated static analysis tools"
  - "Actionable refactoring roadmaps"
```

## Escalation
```yaml
stop:
  - "Critical security vulnerabilities detected (CVSS High/Critical)"
```

## Output
- Health report and Tech Debt mitigation plan.
