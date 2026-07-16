# AI Developer Skill OS - Specification (v7.5)

This document defines the strict contract and schema for all `SKILL.md` files in the AI Developer Skill OS. Every active skill MUST comply with this specification. The frontmatter is frozen to ensure cross-platform compatibility and deterministic agent behavior.

## 1. Frontmatter Contract (YAML)

Every `SKILL.md` must begin with this exact YAML structure. Do not add, remove, or rename fields.

```yaml
---
name: qk-[skill-name]
category: [core|frontend|backend|fullstack|security|qa|maintenance|devops|utilities]
version: X.Y.Z
description: "[One sentence — what this skill does]"
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]
execution_mode: deterministic

# Orchestrator routing metadata
cost: [low|medium|high]
latency: [fast|medium|slow]
risk: [low|medium|high]
side_effects: [edit_files|run_commands|read_only|none]
produces: [report|code|schema|plan|tokens]
consumes: [context-graph|design-md|stack-trace|json-payload|none]

token_budget:
  max_files_read: 3
  max_lines_per_read: 150
  max_shell_commands: 2
  stop_early: true

exit_codes: [SUCCESS, BLOCKED, FAILED, PARTIAL]
---
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | YES | Skill identifier, must start with `qk-` |
| `category` | enum | YES | Primary domain: `core`, `frontend`, `backend`, `fullstack`, `security`, `qa`, `maintenance`, `devops`, `utilities` |
| `version` | semver | YES | Semantic version of this skill |
| `description` | string | YES | One-sentence summary of the skill's purpose |
| `platforms` | array | YES | Supported AI platforms. Valid values: `antigravity`, `claude-code`, `cursor`, `windsurf`, `kilo-code` |
| `execution_mode` | string | YES | Must be `deterministic` for all v7.5 skills |
| `cost` | enum | YES | Token/compute cost: `low`, `medium`, `high` |
| `latency` | enum | YES | Expected execution speed: `fast`, `medium`, `slow` |
| `risk` | enum | YES | Risk level of side effects: `low`, `medium`, `high` |
| `side_effects` | enum | YES | What the skill modifies: `edit_files`, `run_commands`, `read_only`, `none` |
| `produces` | array | YES | Output artifacts: `report`, `code`, `schema`, `plan`, `tokens` |
| `consumes` | array | YES | Required inputs: `context-graph`, `design-md`, `stack-trace`, `json-payload`, `none` |
| `token_budget.max_files_read` | int | YES | Maximum files to read before stopping |
| `token_budget.max_lines_per_read` | int | YES | Maximum lines per file read operation |
| `token_budget.max_shell_commands` | int | YES | Maximum shell commands allowed |
| `token_budget.stop_early` | bool | YES | Whether to stop when confidence threshold is reached |
| `exit_codes` | array | YES | Valid exit codes for this skill |

## 2. Skill Body Structure (Markdown)

The body of the `SKILL.md` file MUST contain the following sections in order:

1. **Header:** Skill title and language rule
2. **Preconditions:** Checklist of required inputs/state before execution
3. **Scope:** What the skill explicitly does (✅) and does not do (❌)
4. **Priority Order:** P1–P4 checks with skip thresholds for token budget management
5. **Workflow:** Phased execution steps with explicit decision trees and exit conditions
6. **Confidence Model:** HIGH/MEDIUM/LOW confidence levels with actions
7. **Severity:** CRITICAL/HIGH/MEDIUM/LOW severity definitions with examples
8. **Evidence Format:** Mandatory template for all findings
9. **Retry Policy:** Retry logic with maximum attempt limits
10. **Escalation Rules:** Structured BLOCKED response format
11. **Handoff Contract:** JSON schema for `Consumes` and `Produces`
12. **Output Format:** Mandatory output template
13. **Exit Codes:** Table mapping codes to meanings

## 3. Naming Conventions

- Skill files: `skills/qk-[skill-name]/SKILL.md`
- Registry entry: `qk-[skill-name]`
- All code, identifiers, and file names: English only
- Explanations and reports: Vietnamese (match user language)

## 4. Compliance Enforcement

- All skills MUST pass `npm run lint` (which validates frontmatter against this spec)
- The `## Compliance` table at the bottom of each `SKILL.md` is deprecated and MUST be removed
- CI pipeline enforces schema compliance automatically
