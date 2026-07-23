# Routing Test: Bug Fix

## Input
"API login trả lỗi 500 khi refresh token"

## Expected Decision Contract
```yaml
decision:
  selected_skill: qk-bug-resolution
  confidence: ">=0.65"
  workflow: bug-resolution

reason:
  category: bug-fixing
```

## Pass Criteria
- Observable output matches the decision contract.
- Does NOT expose internal reasoning (chain-of-thought) in final output.
