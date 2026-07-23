# EDAOS Core: Plugin Extension Points & ABI Specification

Version: 1.0.0
Status: APPROVED
Domain: Core Architecture Specification
File: 11-extension-points.md

---

## 1. Overview & Architectural Role

This document specifies the **Application Binary Interface (ABI)** and extension rules governing how Domain Plugins (e.g., `frontend.web`, `backend.service`, `security.application`) interface with EDAOS Core.

It guarantees that the Core Microkernel remains 100% domain-agnostic while granting plugins the power to safely extend capabilities, evidence schemas, policies, adapters, and learning namespaces without version lock-in or component conflict.

```
┌────────────────────────────────────────────────────────────────────────┐
│                          EDAOS MICROKERNEL CORE                        │
├────────────────────────────────────────────────────────────────────────┤
│                 PLUGIN RUNTIME MANAGER & ABI ENGINE                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
               ┌────────────────────┼────────────────────┐
               ▼                    ▼                    ▼
     ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
     │  frontend.web    │  │ backend.service  │  │ security.app     │
     │  Domain Plugin   │  │ Domain Plugin    │  │ Domain Plugin    │
     └──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## 2. Plugin Load Order & Lifecycle Hooks

Plugins are loaded deterministically by the Core **Plugin Runtime Manager** according to explicit dependency graphs and priority scores.

### Load Stages
1. **Discovery**: Scans `.agents/plugins/*/plugin.yml` manifests.
2. **Dependency Resolution**: Constructs a Topological Sort DAG of plugin dependencies.
3. **ABI Validation**: Validates `edaos_core_requirement` version compatibility.
4. **Registration**: Registers exported capabilities, evidence types, policies, and rules.
5. **Activation**: Plugin enters `Active` state; capability router updates routing table.

```yaml
LoadOrderPriority:
  system_core: 0            # System Core Initialization
  security_plugins: 10      # Security & Policy Enforcers (e.g., security.application)
  infrastructure_plugins: 20 # DevOps, CI/CD, Container Plugins
  domain_plugins: 30        # Domain Plugins (frontend.web, backend.service, mobile.native)
  custom_user_plugins: 100  # User-defined overrides
```

---

## 3. Version Negotiation & ABI Compatibility

EDAOS Core enforces strict **Semantic Versioning (SemVer 2.0)** for Plugin ABIs.

```yaml
abi_compatibility_matrix:
  core_version: "1.2.0"
  
  plugin_compatibility_rules:
    major_mismatch: "REJECT"   # Core 1.x cannot load Plugin requiring Core 2.x
    minor_mismatch: "ALLOW"    # Core 1.2 can load Plugin requiring Core 1.1
    patch_mismatch: "ALLOW"    # Core 1.2.3 can load Plugin requiring Core 1.2.0

  deprecation_policy:
    grace_period_months: 6
    log_level: "WARNING"
```

---

## 4. Capability Conflict Resolution Protocol

When multiple active plugins export the same `capability_id` (e.g., `ui.capture` exported by both `frontend.web` and `mobile.native`), the Capability Router applies the **Conflict Resolution Algorithm**:

```
                              ┌───────────────────────────┐
                              │ Capability Request Target │
                              └─────────────┬─────────────┘
                                            │
                                 (Check Explicit Domain)
                                            │
             ┌──────────────────────────────┴──────────────────────────────┐
             ▼                                                             ▼
  [Domain Specified]                                            [No Domain Specified]
  Route directly to target domain                               Calculate Score:
  (e.g., frontend.web.ui.capture)                               Score = Priority + MaturityLevel + SLA
                                                                Route to highest scoring plugin
```

### Resolution Rules
1. **Explicit Domain Tag**: If request targets `domain: frontend`, router filters out non-frontend providers.
2. **Capability Maturity Score**: Router favors higher `maturity_level` (Level 4 > Level 2).
3. **Plugin Load Priority**: Higher load priority wins in tie-breaker scenarios.

---

## 5. Evidence Extension Rules

Plugins are permitted to extend Core Base Evidence entities, subject to the **Liskov Substitution Principle**:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              BaseEvidence                              │
│ (id, category, kind, observation_ref, policy_ref, status, confidence)  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (extends)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           WebVitalEvidence                             │
│ (+ LCP, CLS, INP, TTFB, render_blocking_selector)                      │
└────────────────────────────────────────────────────────────────────────┘
```

### Inviolable Extension Rules
* ✅ **Allowed**: Adding domain-specific metric fields, severity tags, or contextual attributes.
* ❌ **Forbidden**: Renaming or removing core base fields (`evidence_id`, `status`, `confidence`).
* ❌ **Forbidden**: Overriding core `status` values (`PASS`, `FAIL`, `WARNING`).

---

## 6. Policy Precedence & Override Engine

When a Capability triggers evidence evaluation, the Policy Engine resolves policy precedence in order of decreasing specificity:

$$\text{Active Threshold} = \text{FirstMatch}(\text{ContextOverride} \to \text{ProjectPolicy} \to \text{PluginPolicy} \to \text{CoreBaseline Policy})$$

1. **Execution Context Override**: Command-line flag or explicit test-suite config.
2. **Project Policy**: Located in `.agents/policies/project-name.policy.yml`.
3. **Plugin Policy**: Bundled inside `.agents/plugins/domain.name/policies/`.
4. **Core Baseline Policy**: Located in `.agents/core/default-baseline.policy.yml`.

---

## 7. Plugin Isolation & Namespace Security

To prevent memory pollution across domain plugins, EDAOS enforces strict **Namespace Isolation**:

```yaml
NamespaceSecurity:
  learning_isolation:
    frontend: "edaos.learning.frontend.web"
    backend: "edaos.learning.backend.service"
    security: "edaos.learning.security.application"

  storage_isolation:
    artifact_path_template: ".agents/artifacts/{plugin_id}/{session_id}/"
    cache_namespace_template: "edaos_cache_{plugin_id}"

  execution_isolation:
    max_memory_mb: 1024
    max_execution_time_ms: 60000
```

* **Knowledge Memory Isolation**: Learnings synthesized in `frontend.web` (e.g., React image preload patterns) are scoped to `edaos.learning.frontend.web` and cannot pollute `backend.service` microservice database query learnings.
