# RFC-2026-002: EDAOS Capability Marketplace

## 1. Context and Motivation
As the EDAOS Runtime reaches v15 (API Frozen), the focus shifts to ecosystem expansion. We evaluated 9 trending AI skills (Last30Days, GStack, Remotion, etc.). Instead of blindly absorbing these as monolithic scripts into `.agents/skills/`, we are introducing the **Capability Marketplace**. 

This RFC ensures EDAOS does not become a "dumping ground" for hype skills, but instead forces external plugins to conform to the **Capability Contract** before they are allowed to generate Evidence.

## 2. Capability Domains
Capabilities are categorized by their primary domain. Each domain produces a specific class of Evidence.

- **Research Intelligence** (`.capabilities/research/`): e.g., `Last30Days`
- **Engineering Intelligence** (`.capabilities/engineering/`): e.g., `GStack`
- **Design Intelligence** (`.capabilities/design/`): e.g., `Frontend Design`
- **Documentation/Visualization** (`.capabilities/documentation/`): e.g., `Understand Anything`
- **Evaluation Policy** (`.capabilities/evaluation/`): e.g., `Taste Skill`, `Stop Slop`

## 3. The Capability Contract
Every capability must define a strict YAML contract. It cannot interact with the Runtime unless it explicitly declares its Inputs, Outputs, and the Evidence it generates.

### Example: Last30Days (Research Intelligence)
```yaml
capability:
  id: market-research-last30days
  version: 1.0.0
  provider: external
  domain: research
  
  input:
    - reddit_signal (Observation)
    - youtube_signal (Observation)
    - x_signal (Observation)
    
  output:
    evidence_generated:
      type: market_trend
      confidence_threshold: 0.85
      
  risk_level: L1 # Safe, read-only analysis
  conformance: true
```

### Example: GStack (Engineering Intelligence)
```yaml
capability:
  id: engineering-gstack
  version: 1.0.0
  provider: internal-adapter
  domain: engineering
  
  input:
    - requirement_doc (Observation)
    - architecture_graph (Evidence)
    
  output:
    evidence_generated:
      type: implementation_plan
      confidence_threshold: 0.90
      
  risk_level: L3 # Modifies source code, requires L3 Governance Gate
  conformance: true
```

## 4. Rollout Strategy

We will prioritize onboarding capabilities that explicitly fit the `Evidence → Decision → Execution` pipeline:

**Batch 1 (High Priority - Strong EDAOS Fit):**
- `Last30Days` (Research Evidence)
- `GStack` (Implementation Planning)
- `Understand Anything` (Provenance Graphing)
- `Frontend Design` (Design Intelligence)

**Batch 2 (Evaluation Policies):**
- `Stop Slop` & `Taste Skill` (Will be structured as L3 Governance Policies rather than execution capabilities).

**Batch 3 (Creative Execution):**
- `Remotion` & `HyperFrame` (Deferred until the Creative Execution Adapter is built).

## 5. Architectural Integrity
By filtering popular skills through this Capability Contract, EDAOS retains its deterministic nature. External tools act purely as Data Sources (Observations) or Processing Engines (Evidence Generation), but the Final Decision and Execution are strictly governed by the Frozen EDAOS Runtime.
