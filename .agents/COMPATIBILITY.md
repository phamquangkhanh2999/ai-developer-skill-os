# 🌍 EDAOS Ecosystem Compatibility Matrix

This document tracks the certification status of adapters within the EDAOS Ecosystem.

## Adapter Contract: v1.0

| Adapter     | Contract | Runtime (Target) | L1 | L2 | L3 | L4 | ADP (Tests) | Status    |
| :---------- | :------: | :--------------- | :-: | :-: | :-: | :-: | :---: | :-------- |
| **GitHub MCP** | v1.0 | Python Reference | ✅ | ✅ | ✅ | ✅ | 8/8 | **Certified** |
| VS Code MCP | v1.0 | Planned          | - | - | - | - | - | Planned |
| OpenAI SDK  | v1.0 | Planned          | - | - | - | - | - | Planned |
| GitLab MCP  | v1.0 | Planned          | - | - | - | - | - | Planned |

## Certification Criteria

To achieve **Certified** status, an adapter MUST:
1. Implement the complete `EDAOSAdapter` interface defined in the current Contract Version.
2. Return strongly-typed objects (`Observation`, `ExecutionResult`, `HealthStatus`, `CapabilityDescriptor`).
3. Abstract the backend so that the Runtime only deals with formalized EDAOS structs.
4. Pass 100% of the `AdapterConformanceSuite` (`ADP-01` to `ADP-08`).
5. Be compatible with a Certified EDAOS Runtime (L1-L4).
