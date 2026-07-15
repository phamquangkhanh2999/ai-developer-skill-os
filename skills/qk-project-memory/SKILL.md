---
name: qk-project-memory
category: core
version: 7.0.0
description: "Lưu trữ và truy xuất ngữ cảnh dự án dài hạn qua các phiên làm việc với độ chính xác cao."
---

# qk-project-memory

## Scope
- Long-term context storage and retrieval (Plan & Collect)

## Verbs
- `[MEMORIZE]`: Store verified facts about the project.
- `[RECALL]`: Retrieve facts strictly based on recorded memory.

## Constraints
```yaml
must:
  - "Verify facts against the actual codebase before storing them"
  - "Timestamp and categorize memory entries"
must_not:
  - "Store assumptions or unverified AI hypotheses"
  - "Overwrite fundamental architectural rules without explicit user consent"
```

## Policies
```yaml
prefer:
  - "Structured data formats (JSON/Markdown) for memory storage"
```

## Escalation
```yaml
stop:
  - "Memory conflicts with the core AGENTS.md rules"
```

## Output
- Context retrieval results or stored memory artifacts.
