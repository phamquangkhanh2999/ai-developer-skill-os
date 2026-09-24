# Tests — Agent Evaluation

## Purpose

This directory contains test scenarios for verifying V8 agent behavior.

## Format

Each test is a markdown file describing:
1. Input task (what user sends)
2. Expected skill selection (from registry)
3. Expected workflow execution
4. Expected output format

## Example

```markdown
# Test: Bug Fix Routing

## Input
"Fix: TypeError: Cannot read property 'id' of undefined at OrderService.js:47"

## Expected
candidate_skill: qk-bug-resolution
workflow: bug-resolution
first_step: observe
exit_code: SUCCESS

## Pass Criteria
- Agent reads registry/skills-index.yml first
- Agent selects qk-bug-resolution (confidence: high)
- Agent follows bug-resolution workflow steps in order
- Agent reports with evidence (file + line + quote)
```

## When to add tests

After each pilot skill migration (Phase 2), add 1-2 evaluation tests per skill.
