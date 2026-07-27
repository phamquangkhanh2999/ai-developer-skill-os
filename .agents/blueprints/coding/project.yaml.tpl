# project.yaml — Workspace Manifest for Software Coding Projects
# Schema Version 1 — EDAOS v8.2 Governed Capability Platform
schema_version: 1
manifest_version: "8.2"

project:
  name: "{{PROJECT_NAME}}"
  version: "0.1.0"
  blueprint: "standard-software-coding"
  description: "Clean, streamlined software engineering architecture with automated quality gating."

  capabilities:
    - qk-project-bootstrap
    - qk-code-review
    - qk-engineering-standard
    - qk-bug-resolution
    - qk-validation-gate
  knowledge:
    - clean-code-metrics
    - design-intelligence
  eval:
    scorecard: "evals/scorecard.yaml"

profiles:
  development:
    linter_strictness: standard
    tools_mode: local_fs
  production:
    linter_strictness: maximum
    tools_mode: ci_gated
  testing:
    linter_strictness: standard
    tools_mode: unit_mock

features:
  registry: true
  eval: true
  planner: false
  critic: false
