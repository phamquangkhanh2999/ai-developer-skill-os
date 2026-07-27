# project.yaml — Workspace Manifest for RAG & Production AI Agents
# Schema Version 1 — EDAOS v8.2 Governed Capability Platform
schema_version: 1
manifest_version: "8.2"

project:
  name: "{{PROJECT_NAME}}"
  version: "0.1.0"
  blueprint: "rag-4-folder-architecture"
  description: "RAG / Production AI Agent project powered by the standard 4-folder engineering blueprint."

  # Recommended Folder Scaffolding:
  # prompts/ - System prompts, tasks, tools (version-controlled as code)
  # data/    - Immutable raw/ data and clean processed/ knowledge chunks
  # agents/  - Customized subagents, domain micro-skills, and tool configurations
  # evals/   - Quantitative tests/, traces/, and scorecards/

  capabilities:
    - qk-project-bootstrap
    - qk-ai-builder
    - qk-validation-gate
    - qk-context-loader
    - qk-docs
  knowledge:
    - architecture-standard
    - security-guidelines
  eval:
    scorecard: "evals/scorecard.yaml"

profiles:
  development:
    tools_mode: mock
    log_level: debug
  production:
    tools_mode: real_mcp
    log_level: error
  testing:
    tools_mode: trace_record
    log_level: info

features:
  registry: true
  eval: true
  planner: false
  critic: false
