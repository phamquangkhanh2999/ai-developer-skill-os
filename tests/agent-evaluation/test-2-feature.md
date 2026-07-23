# Test 2: Feature Delivery Routing

## Input
"Add OAuth login support"

## Expected Behavior

- **Context Loader:** `qk-context-loader` (Runs first to build context)
- **Primary Skill:** `qk-feature-delivery`
- **Verification:** `qk-validation-gate`

## Pass Criteria
1. Agent realizes it needs context and invokes `qk-context-loader`.
2. Agent transitions to `qk-feature-delivery` after context is built.
3. Agent follows the `feature-delivery` workflow (requirements → context → design → implement).
4. Agent uses `qk-validation-gate` for verification before concluding.
