# Ambiguity Resolution Test

## Input
"Tối ưu hệ thống hiện tại"

## Expected Decision Contract
```yaml
decision:
  selected_skill: null
  confidence: "low"
  action: request_clarification

clarification:
  - Performance?
  - Code quality?
  - Architecture?
  - Cost?
```

## Pass Criteria
- Agent MUST NOT blindly select a high-impact skill.
- Agent identifies that confidence is below threshold.
- Agent outputs a request for clarification presenting possible paths.
