# Skill Classifications (Intent-Based Policies)

Skills are classified into behavioral groups that define their **Primary Objective** and **Preferred Evidence Strategy**.

*Note: Actual verification depth is NOT determined by the skill itself, but must strictly follow the **Risk-based Verification Policy** defined in `AGENTS.md`.*

## 1. Static Analysis Skills
*e.g., Code Review, Project Health, Architecture, Documentation*
- **Primary Goal:** Audit, analyze, or document without altering system behavior.
- **Preferred Behavior:** Prefer static analysis (`read_file`, `grep_search`). Do not execute code or run test suites unless explicitly requested to validate the audit.

## 2. Development Skills
*e.g., Feature Delivery, Refactor, Bug Resolution*
- **Primary Goal:** Modify existing behavior or implement new features safely.
- **Preferred Behavior:** Apply localized changes. Gather targeted evidence. Avoid speculative full-project validation; verify only what is affected.

## 3. Validation Skills
*e.g., Validation Gate, CI Check, Release*
- **Primary Goal:** Ensure code quality, security, and build stability before release.
- **Preferred Behavior:** Exhaustive scanning. Running automated checks and full builds is encouraged to satisfy the validation gate.

## 4. Maintenance Skills
*e.g., System Evolution, Dependency Update*
- **Primary Goal:** Upgrade system foundations safely with a rollback strategy.
- **Preferred Behavior:** Inspect changelogs and compatibility carefully before updating. Run full system verifications post-update to ensure stability.
