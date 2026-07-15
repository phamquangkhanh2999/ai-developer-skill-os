---
name: qk-project-bootstrap
category: fullstack
version: 7.0.0
description: "Khởi tạo dự án mới với các best practices, linters, và cấu trúc thư mục chuẩn."
---

# qk-project-bootstrap

## Scope
- Initializing new projects with best practices (Execute)

## Constraints
```yaml
must:
  - Setup linters, formatters, and standard directory structures
  - Follow the organization's existing templates if available
  - ALWAYS generate a `DESIGN.md` file in the project root to serve as the Brand Contract (Open Design standard). MUST prompt the user for design constraints if none are provided.
must_not:
  - Hardcode outdated dependency versions
  - Skip adding basic README instructions
```

## Policies
```yaml
prefer:
  - Standard tooling over custom scripts
```

## Escalation
```yaml
ask:
  - To clarify preferred framework/language if not specified
```

## Output
- Bootstrapped repository structure
```
