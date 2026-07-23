# Test 3: Ambiguous Request Handling

## Input
"Improve authentication code"

## Expected Behavior

- **Action:** Request clarification
- **Clarification points:** Refactor? Bug fix? Add feature?

## Pass Criteria
1. Agent does NOT blindly guess or select a high-impact skill without clarity.
2. Agent asks the user for clarification before proceeding.
3. Agent exits with `BLOCKED` if no clarification is provided, citing missing preconditions.
