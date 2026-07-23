# Test 1: Bug Fix Routing

## Input
"Fix login crash after token expired"

## Expected Behavior

- **Candidate Skill:** `qk-bug-resolution`
- **Workflow:** `bug-resolution`
- **Related Skill:** `qk-validation-gate`

## Pass Criteria
1. Agent reads `registry/skills-index.yml` first.
2. Agent selects `qk-bug-resolution` (confidence: high).
3. Agent follows the `bug-resolution` workflow steps in order.
4. Agent exits with `SUCCESS` or `PARTIAL` reporting with evidence.
