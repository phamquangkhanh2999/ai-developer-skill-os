# EDAOS Human Governance Console Specification

Version: 1.0.0
Status: APPROVED
File: 52-human-governance-console-spec.md

---

## 1. Overview

The **EDAOS Human Governance Console** is the interactive web dashboard used by Software Architects, SREs, and Security Officers to inspect AI reasoning trails, visualize evidence graphs, approve high-risk changes, and trigger instant rollbacks.

```
                    EDAOS HUMAN GOVERNANCE CONSOLE
                                  │
    ┌─────────────────────────────┼─────────────────────────────┐
    │                             │                             │
Decision Timeline             Evidence Graph               Governance Actions
(Trace ID Audit Log)          (Observation -> Policy -> Rule)(Approve / Reject / Rollback)
```

---

## 2. Core UI Modules

### Module A: Decision Timeline & Trace Explorer
* **Function**: Renders chronological execution trails grouped by `X-EDAOS-Trace-ID`.
* **Components**: Trace Status (`APPROVED`, `BLOCKED`), Confidence Score Gauge, Latency Breakdown.

### Module B: Visual Evidence Graph
* **Function**: Renders interactive Mermaid/D3 DAG node graphs:
  - `Observation Node` (LCP 3800ms) ➔ `Policy Node` (POL-FE-PERF-CORE-01 FAIL) ➔ `Finding Node` (FND-HERO-01) ➔ `Decision Node` (OPTIMIZE_RESOURCE_LOADING).

### Module C: One-Click Action Controls
* **Action Buttons**:
  - `[APPROVE DECISION]` ➔ Promotes Action Plan to Execution Scheduler.
  - `[REJECT / BLOCK]` ➔ Quarantines finding and logs human override event.
  - `[INSTANT ROLLBACK]` ➔ Triggers Saga Compensating Action (`git checkout`).
