# 3. Risk-based Verification

Date: 2026-07-02

## Status
Accepted

## Context
Previously, Verification Levels were hardcoded into the Skill Classification (e.g., Development skills automatically forced Level 2 Verification, meaning test suites were run regardless of the actual change). This caused conflicting behavior. For example, fixing a typo in a comment using the `qk-bug-resolution` skill would still trigger a test run, wasting time and resources. 

## Decision
We completely decoupled Verification Levels from Skill Classifications. 
Skills now only define their "Preferred Evidence Strategy". The actual depth of verification is determined strictly by the **Risk-based Verification Policy** in the Kernel (`AGENTS.md`).
- Level 0 (Low Risk): Comments, typos (Static Analysis only).
- Level 2 (Medium Risk): Logic changes (Targeted tests).
- Level 3 (High Risk): Auth, DB (Full validation).

## Consequences
- **Positive:** Agents no longer blindly run tests for trivial changes. Verification scales with the danger of the code being modified, vastly improving speed and token efficiency.
- **Negative:** Agents must use logic to evaluate the "Risk" of their own changes before deciding whether to run a test.
