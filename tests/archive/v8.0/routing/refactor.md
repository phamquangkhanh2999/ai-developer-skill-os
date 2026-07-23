# Routing Test: Refactor

## Input
"Refactor lại file user-service.ts cho clean code hơn"

## Expected Decision Contract
```yaml
decision:
  selected_skill: qk-engineering-standard  # Currently legacy/unmigrated, but should be the eventual target
  confidence: ">=0.75"
  workflow: refactor

reason:
  category: code-quality
```

## Pass Criteria
- Observable output matches the decision contract.
- Does NOT expose internal reasoning (chain-of-thought) in final output.
