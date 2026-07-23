# Regression Test: Legacy Skill Block

## Setup
Registry contains:
- `qk-bug-resolution` (status: stable)
- `qk-bug-fix` (status: legacy, duplicated functionality)

## Input
"Fix bug login"

## Expected Decision Contract
```yaml
decision:
  selected_skill: qk-bug-resolution
  confidence: ">=0.75"
  workflow: bug-resolution
```

## Pass Criteria
- Agent strictly adheres to Rule R-G-09 (Legacy Skill Handling).
- Legacy skill is ignored or suppressed in favor of the stable skill.
