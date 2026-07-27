# project.yaml — Workspace Manifest for Automation Workflows (n8n / ETL)
# Schema Version 1 — EDAOS v8.2 Governed Capability Platform
schema_version: 1
manifest_version: "8.2"

project:
  name: "{{PROJECT_NAME}}"
  version: "0.1.0"
  blueprint: "automation-workflow"
  description: "Data ETL and business workflow automation pipeline driven by evidence-based evals."

  capabilities:
    - qk-project-bootstrap
    - qk-data-lifecycle
    - qk-api-lifecycle
    - qk-validation-gate
  knowledge:
    - etl-patterns
    - domain-patterns
  eval:
    scorecard: "evals/scorecard.yaml"

profiles:
  development:
    webhook_target: staging
    tools_mode: dry_run
  production:
    webhook_target: live
    tools_mode: executed_live
  testing:
    webhook_target: mock_server
    tools_mode: trace_record

features:
  registry: true
  eval: true
  planner: false
  critic: false
