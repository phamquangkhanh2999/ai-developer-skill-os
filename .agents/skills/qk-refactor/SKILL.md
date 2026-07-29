---
name: qk-refactor
version: 8.0.0
status: stable
description: "Tái cấu trúc và dọn dẹp mã nguồn để dễ bảo trì hơn mà không làm thay đổi logic hoạt động bên ngoài."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

type: capability

intent:
  - refactoring
  - code-cleanup
  - complexity-reduction

complexity:
  level: medium
  criteria:
    files_affected: "2-5"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

triggers:
  - refactor
  - tái cấu trúc
  - clean up this code
  - simplify
  - reduce complexity
  - dẫn cấu trúc code

selection:
  priority: medium
  confidence_threshold: 0.80

workflow: refactor

rules:
  - global
  - coding
  - safety

tools:
  - filesystem
  - terminal

related_skills:
  - qk-engineering-standard
  - qk-project-health

knowledge_scope:
  owns:
    - refactoring-patterns
    - code-smells
  references:
    - architecture
    - coding-standards

verification:
  required: true
  strategy: refactor

examples: []
learnings: []

execution_mode: deterministic
cost: medium
latency: medium
risk: medium
side_effects: edit_files
produces: [code, report]
consumes: [source-code]

token_budget:
  max_files_read: 3
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---

# qk-refactor - Safe Refactor

> Language rule: Code, identifiers, file names → English. Explanations, summaries → Vietnamese.

## Preconditions
- [ ] Target file(s) or module(s) are specified
- [ ] Tests exist for the target code (or can be created)

On missing precondition:
  EXIT: BLOCKED
  Message: "Missing: target files or test coverage"

## Scope
- Improve internal code quality without changing external behavior
- Reduce complexity, improve naming, extract functions
- Remove dead code and duplication

## Non-Goals
- Add new functionality
- Change public API signatures
- Modify behavior or business logic

## Workflow
1. Establish baseline (current behavior + tests)
2. Plan refactor steps
3. Execute step by step
4. Verify behavior unchanged
5. Run validation gate

## Exit Codes
| Code | Meaning |
|------|---------|
| SUCCESS | Refactor complete, behavior preserved, tests pass |
| PARTIAL | Refactor done, some tests need attention |
| BLOCKED | Missing preconditions |
| FAILED | Behavior changed or tests broken |
