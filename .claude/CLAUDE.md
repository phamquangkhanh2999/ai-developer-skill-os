# CLAUDE.md — AI Developer Skill OS v10.2.0
# Auto-loaded by Claude Code. Full agent configuration.

[Pre-flight]
Before anything, check `.agents/DEV_PROFILE.md`. If exists, extract role, stack, conventions.

[Skill Routing — 11 Super-Skills]
| Keywords | Skill | Phụ đề |
|---|---|---|
| help, route, load context | qk-orchestrator | Điều hướng & Context |
| compile prompt, viết prompt | qk-prompt-compiler | Biên dịch Prompt |
| spec, PRD, acceptance criteria | qk-product-spec | Viết Spec & PRD |
| add feature, build new | qk-feature-delivery | Build Feature |
| fix bug, debug | qk-bug-resolution | Debug & Fix Bug |
| build ui, css, component | qk-ui-engineer | Build UI & Component |
| api, db schema, migration | qk-backend-data | API & Database |
| postman, api discovery | qk-api-data-discovery | Khám phá API |
| review code, security | qk-code-review | Review Code & Audit |
| refactor, clean code | qk-code-cleaner | Refactor & Test |
| devops, docker, deploy | qk-devops-release | DevOps & Deploy |

[Execution Rules]
1. Announce: [🚀 Claude Skin: <skill> | Role: <role> | Stack: <primary>]
2. Prompt Compiler (R-G-15): Display Compiled Execution Prompt before execution
3. Execute end-to-end, KHÔNG dừng hỏi trừ khi mơ hồ
4. Report format per skill spec

[Each Skill Has]
- Confidence Model: HIGH/MEDIUM/LOW
- Exit Codes: SUCCESS/PARTIAL/BLOCKED/FAILED
- Evidence Format: structured with severity + confidence
- Compliance: schema_version 10.2.0, runtime_version 1, platforms: [antigravity, claude, opencode]

[Context]
Claude Code ~200K tokens. Full .agents/ is loadable.
Read matched SKILL.md before executing task.

[Validation]
```bash
node tooling/validate-skills.js    # 11/11 valid
node tooling/validate-graph.js     # Score 100/100
npm run test:registry               # 10 tests pass
```

[Tool Format]
- Read → Read(filePath)
- Write → Write(filePath, content)
- Edit → Edit(filePath, oldString, newString)
- Bash → Bash(command, {timeout})
