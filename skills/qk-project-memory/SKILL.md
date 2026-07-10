---
name: qk-project-memory
category: core
version: 6.0.3
description: "Lưu trữ và truy xuất ngữ cảnh dự án dài hạn qua các phiên làm việc."
---

# qk-project-memory

## Scope
- Storing and retrieving long-term project context across sessions (Collect)

## Constraints
```yaml
must:
  - Organize context logically so it can be retrieved efficiently
  - Update memory artifacts when major architectural decisions are made
must_not:
  - Store sensitive user data or secrets in project memory
```

## Policies
```yaml
prefer:
  - Concise summaries over verbose logs for long-term memory
```

## Escalation
```yaml
ask:
  - To clarify contradictory information found in the project memory
```

## Output
- Updated memory artifacts
```
