---
name: qk-context-loader
category: utilities
version: 6.0.0
---

# qk-context-loader

## Scope
- Context collection and dependency mapping (Collect)

## Constraints
```yaml
must:
  - Find and load related dependency files
must_not:
  - Modify code
  - Load entire repo or node_modules
  - Hallucinate filenames
```

## Policies
```yaml
prefer:
  - Build dependency graph
```

## Escalation
```yaml
stop:
  - Repo or files are inaccessible
```

## Output
- Context mapping
```
