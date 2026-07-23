/**
 * edaos-sdk — Public API
 *
 * Main exports:
 *   import { EDAOS, EDACOSInvariantError } from 'edaos-sdk'
 *
 * Sub-path exports (tree-shakeable):
 *   import { EvidenceEngine }  from 'edaos-sdk/evidence'
 *   import { PolicyEngine }    from 'edaos-sdk/policy'
 *   import { ProvenanceGraph } from 'edaos-sdk/provenance'
 */

// ── Developer-facing client (recommended entry point) ─────────────────────
export { EDAOS, EDACOSInvariantError }  from './edaos.js'

// ── Core subsystems (for advanced / custom runtimes) ──────────────────────
export { EvidenceEngine }  from './evidence.js'
export { PolicyEngine }    from './policy.js'
export { ProvenanceGraph } from './provenance.js'
export { SagaManager }     from './saga.js'
export { ExecutionJournal } from './journal.js'
export { ControlPlane }    from './control-plane.js'

// ── All types ─────────────────────────────────────────────────────────────
export type {
  // Enums
  EvidenceStatus,
  RiskLevel,
  ExecutionStatus,
  ProvenanceNodeType,
  CollectionMethod,

  // Domain objects
  Observation,
  Evidence,
  Policy,
  Finding,
  ProvenanceNode,
  RejectedAlternative,
  JournalEntry,
  ExecutionResult,

  // Config
  EDACOSConfig,
  ExecuteOptions,
} from './types.js'

// ── SagaManager types ─────────────────────────────────────────────────────
export type { SagaResult }      from './saga.js'
export type { RiskThresholds }  from './policy.js'

// ── Version metadata ──────────────────────────────────────────────────────
export const VERSION      = '11.0.0' as const
export const SPEC_VERSION = '11.0.0' as const
export const INVARIANT    = 'No Evidence => No Decision => No Execution' as const
