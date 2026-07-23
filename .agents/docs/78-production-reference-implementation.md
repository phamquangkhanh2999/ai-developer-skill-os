# EDAOS Production Reference Implementation Guide

Version: 8.0.0
Status: APPROVED
File: 78-production-reference-implementation.md

---

## 1. Overview

This document specifies the concrete production repository layout for **EDAOS v8.0**, bridging open-source core libraries with enterprise-grade platform deployments.

```
                         EDAOS REPOSITORY STRUCTURE
                                     │
    ┌────────────────────────────────┼────────────────────────────────┐
    │                                │                                │
edaos/control-plane              edaos/sdk                        edaos/dashboard
(Event Bus, Scheduler, Router)   (TS, Python, Go SDKs)            (Human Governance Web UI)
```

---

## 2. Open Source vs Enterprise Packaging

- **Community Core (`edaos-community`)**: Open-source core kernel, CLI, SDK, and baseline evidence policies.
- **Enterprise Platform (`edaos-enterprise`)**: Multi-Tenant isolation, Security RBAC, Incident Auto-Remediation SRE Fabric, and SOC2/ISO 27001 Compliance engines.
