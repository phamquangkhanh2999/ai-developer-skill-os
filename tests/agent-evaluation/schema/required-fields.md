# Schema Test: Required Fields

## Input
A SKILL.md file missing the `selection` or `verification` required fields.

## Expected Decision Contract
```yaml
decision:
  action: reject_skill
  reason: "Missing required fields in schema (e.g., selection)"
```

## Pass Criteria
- A skill missing V8 required fields must fail schema validation.
- Agent should not attempt to execute a structurally invalid skill.
