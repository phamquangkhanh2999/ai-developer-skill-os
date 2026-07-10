---
name: qk-docs
category: utilities
version: 6.0.0
---

# qk-docs

## Scope
- Writing and maintaining project documentation for human readability (Execute)

## Constraints
```yaml
must:
  - Keep documentation in sync with the actual codebase
  - Use clear, accessible language
must_not:
  - Generate overly verbose or redundant docs
  - Invent features that don't exist in the code
```

## Policies
```yaml
prefer:
  - Examples and code snippets over pure text
```

## Escalation
```yaml
stop:
  - The codebase logic is too ambiguous to document accurately
```

## Output
- Markdown documentation files
```
