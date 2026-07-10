---
name: qk-help
category: core
version: 6.0.3
description: "Hiển thị danh sách các kỹ năng hiện có và các mẹo sử dụng."
---

# qk-help

## Scope
- Displaying available skills and usage tips (Collect & Delegate)

## Constraints
```yaml
must:
  - Present information clearly and concisely
must_not:
  - Hallucinate skills that do not exist in the repository
```

## Policies
```yaml
prefer:
  - Short, actionable examples over long descriptions
```

## Escalation
```yaml
ask:
  - If the user's intent is unclear when asking for help
```

## Output
- List of available skills and usage instructions
```
