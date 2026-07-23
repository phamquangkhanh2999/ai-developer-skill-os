# EDAOS Human-AI Workforce Operating Model Guide

Version: 1.0.0
Status: APPROVED
File: 85-human-ai-operating-model.md

---

## 1. Executive Summary

This document specifies the organizational transition model for human software engineers, site reliability engineers, and software architects operating alongside the **EDAOS Autonomous Engineering Organization OS**.

```
                   HUMAN-AI WORKFORCE TRANSITION
                                 │
    ┌────────────────────────────┼────────────────────────────┐
    │                            │                            │
Developer Role               Architect Role              SRE Role
Before: Manual Coding        Before: Manual Spec Writer   Before: Manual Firefighting
After: Constraint Governor   After: Policy System Designer After: Simulation Auditor
```

---

## 2. Transition Matrix

- **Software Engineers**: Shift focus from manual syntax writing to defining high-level feature intent, setting performance policies, and auditing evidence chains.
- **Software Architects**: Shift focus from static document creation to designing formal invariants, arbitration rules, and evolutionary policies.
- **Site Reliability Engineers (SREs)**: Shift focus from manual incident firefighting to governing the Autonomous SRE Fabric (`68-autonomous-sre-fabric.yml`) and reviewing post-mortem learning loops.
