---
name: qk-help
category: utilities
version: 7.0.0
description: "Hiển thị danh sách các kỹ năng V7 hiện có và các lệnh khắt khe."
---

# qk-help

## Scope
- Skill discovery and usage assistance (Collect)

## Verbs
- `[HELP]`: Display strict V7 guidelines and available skills.

## Constraints
```yaml
must:
  - "List all available V7 skills and their core 'must' constraints"
  - "Emphasize the Zero-Trust and Anti-Slop philosophy"
must_not:
  - "Display outdated V6 instructions or deprecated skills"
```

## Policies
```yaml
prefer:
  - "Clear, formatted Markdown output"
```

## Escalation
```yaml
ask:
  - "If the user is looking for a skill that does not exist"
```

## Output
- List of skills and V7 usage guidelines.
