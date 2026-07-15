---
name: qk-context-loader
category: utilities
version: 7.0.0
description: "Tải các file liên quan và vẽ biểu đồ phụ thuộc (dependency graph) khắt khe trước khi code."
---

# qk-context-loader

## Scope
- Context collection and structural dependency mapping (Collect)
- Implementing Understand Anything's "Graphing" philosophy to prevent hallucination.

## Verbs
- `[MAP]`: Analyze file relationships and generate a topological graph or tree map of the domain logic.

## Constraints
```yaml
must:
  - Generate a Structural Map (Dependency Graph) BEFORE attempting to solve complex tasks.
  - Find and load related dependency files based strictly on the map.
must_not:
  - Modify code
  - Load entire repo or node_modules
  - Guess or hallucinate filenames or API shapes.
  - Skip the graphing phase for business logic tasks.
```

## Policies
```yaml
prefer:
  - Deterministic tracing (following imports/exports) over semantic guessing.
```

## Escalation
```yaml
stop:
  - Repo or files are inaccessible
  - Cannot determine the architectural structure (Context overflow)
```

## Output
- Explicit JSON or Markdown Topological Graph of Context
