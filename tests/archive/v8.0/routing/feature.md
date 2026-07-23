# Routing Test: Feature Delivery

## Input
"Xây dựng module quản lý người dùng với phân quyền"

## Expected Decision Contract
```yaml
decision:
  selected_skill: qk-feature-delivery
  confidence: ">=0.85"
  workflow: feature-delivery

reason:
  category: feature-building
```

## Pass Criteria
- Observable output matches the decision contract.
- Does NOT expose internal reasoning (chain-of-thought) in final output.
