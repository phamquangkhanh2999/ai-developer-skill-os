# Routing Test: Negative Analysis (False Positive)

## Input
"Hãy giải thích tại sao API chậm"

## Expected Decision Contract
```yaml
decision:
  selected_skill: qk-research
  confidence: ">=0.75"
  workflow: research

reason:
  category: codebase-exploration
```

## Pass Criteria
- Agent MUST NOT select an action skill (like `qk-feature-delivery` or `qk-refactor`).
- Agent selects a research/exploration skill.
