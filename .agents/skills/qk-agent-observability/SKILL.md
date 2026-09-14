---
name: qk-agent-observability
version: 9.2.1
status: archived
description: "Lớp theo dõi (Observability) cho phép giám sát quyết định, luân chuyển và các mô hình lỗi."
platforms: [antigravity, claude-code, cursor, windsurf, kilo-code]

type: capability

intent:
  - observability
  - agent-metrics
  - decision-trace

triggers:
  - "agent observability"
  - "routing logs"
  - "skill failure"

workflow: skill-evolution

complexity:
  level: medium
  criteria:
    files_affected: "1-3"
    has_behavior_change: false
    has_external_dependency: false
    has_breaking_change: false

rules:
  - global

tools:
  - filesystem

related_skills:
  - qk-validation-gate
knowledge_scope:
  domain:
    - agent-telemetry
    - decision-tracking
    - routing-accuracy
  concepts:
    - observability-patterns
    - evaluation-metrics
  references:
    - architecture
    - scorecard          # bổ sung: file scorecard.yaml giờ nằm trong evals/ của skill này

decision_boundary:
  owns:
    - agent_decision_trace
    - routing_accuracy_metrics
    - skill_success_rate
    - failure_pattern_detection
    - feedback_loop
  does_not_own:
    - application_monitoring
    - infrastructure_monitoring
    - log_aggregation
    - uptime_monitoring
    - pass_fail_enforcement   # bổ sung: việc chấm đậu/rớt theo threshold thuộc qk-validation-gate
  conflicts_with: []

verification:
  required: true
  strategy: feature

lifecycle:
  promotion_gate:
    tests:
      minimum_pass_rate: 0.9
    usage:
      minimum_runs: 20
    conflicts:
      zero_boundary_violation: true
  demotion_gate:
    triggers:
      - repeated_failure
      - boundary_violation
      - outdated_reference
    action:
      change_status: "stable -> experimental"

selection:
  priority: medium
  confidence_threshold: 0.85

execution_mode: deterministic
cost: low
latency: fast
risk: low
side_effects: edit_files
produces: [report]
consumes: [source-code, execution-trace]

# Bổ sung: thiếu field này trong bản gốc — mọi skill phải khai báo theo global.md R-G-06.
exit_codes: [SUCCESS, BLOCKED, PARTIAL, FAILED]

token_budget:
  max_files_read: 3
  max_lines_per_read: 100
  max_shell_commands: 0
  stop_early: true
---

# Agent Observability Capability
This skill enables tracking and observing the AI agent's own behavior, decisions, and accuracy metrics without interfering with application or infrastructure observability systems.
