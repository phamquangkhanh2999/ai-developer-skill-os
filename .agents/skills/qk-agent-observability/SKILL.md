---
name: qk-agent-observability
version: 8.1.3
status: experimental
description: "Agent Observability layer for tracking decisions, routing metrics, and failure patterns."
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
---

# Agent Observability Capability
This skill enables tracking and observing the AI agent's own behavior, decisions, and accuracy metrics without interfering with application or infrastructure observability systems.
