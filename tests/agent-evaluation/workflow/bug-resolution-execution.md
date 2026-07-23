# Workflow Execution Test: Bug Resolution

## Context
Agent is already routed to `qk-bug-resolution` and workflow `bug-resolution` is loaded.

## Input
"Lỗi crash app khi open settings"

## Expected Workflow Outputs
The agent must generate outputs corresponding to the defined workflow steps:

1. **Step: observe**
   - Output: `symptom_report`
2. **Step: hypothesize**
   - Output: `ranked_causes`
3. **Step: evidence**
   - Output: `confirmed_root_cause`
4. **Step: patch**
   - Output: `changed_files`
5. **Step: verify**
   - Output: `verification_report`

## Pass Criteria
- Agent executes steps sequentially as state transitions.
- Each step explicitly produces its defined output.
