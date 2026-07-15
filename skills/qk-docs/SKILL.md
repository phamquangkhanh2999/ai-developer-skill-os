---
name: qk-docs
category: documentation
version: 7.0.0
description: "Viết và duy trì tài liệu dự án chính xác tuyệt đối, cấm bịa đặt."
---

# qk-docs

## Scope
- Technical documentation, Readme files, and inline comments (Execute)

## Verbs
- `[DOCUMENT]`: Synchronize documentation with the actual implementation.

## Constraints
```yaml
must:
  - "Ensure documentation matches the exact implementation in the codebase"
  - "Update documentation whenever corresponding code is changed"
must_not:
  - "Hallucinate or guess API parameters not present in the code"
  - "Write generic or useless comments (e.g., '// gets the user')"
```

## Policies
```yaml
prefer:
  - "Self-documenting code over excessive inline comments"
  - "Living documentation (e.g., Swagger/JSDoc) over isolated Markdown files"
```

## Escalation
```yaml
stop:
  - "Documentation requests conflict with actual codebase implementation"
```

## Output
- Accurate documentation files or inline comments.
