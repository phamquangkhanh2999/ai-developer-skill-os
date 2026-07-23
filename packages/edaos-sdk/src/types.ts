/**
 * EDAOS Core Type Definitions
 * Spec 08 — Evidence Exchange Contract
 * Spec 65 — Decision Provenance
 */

// ─────────────────────────────────────────────────────────────────────────────
// ENUMS
// ─────────────────────────────────────────────────────────────────────────────

export type EvidenceStatus = 'PASS' | 'FAIL' | 'WARNING'

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type ExecutionStatus =
  | 'COMMITTED'
  | 'ROLLED_BACK'
  | 'VETOED'
  | 'SKIPPED'
  | 'BLOCKED'

export type ProvenanceNodeType =
  | 'OBSERVATION'
  | 'EVIDENCE'
  | 'FINDING'
  | 'DECISION'
  | 'OUTCOME'

export type CollectionMethod =
  | 'SYNTHETIC'
  | 'RUM'
  | 'STATIC_ANALYSIS'
  | 'CI'
  | 'MANUAL'

// ─────────────────────────────────────────────────────────────────────────────
// OBSERVATION
// ─────────────────────────────────────────────────────────────────────────────

/** Raw measurement before policy evaluation */
export interface Observation {
  readonly metricId: string
  readonly value: number
  readonly unit: string
  readonly provider: string
  readonly providerVersion?: string
  readonly collectionMethod?: CollectionMethod
  readonly timestamp: string           // ISO 8601
}

// ─────────────────────────────────────────────────────────────────────────────
// EVIDENCE  (Spec 08)
// ─────────────────────────────────────────────────────────────────────────────

/** Verifiable evidence object produced by EvidenceEngine */
export interface Evidence {
  readonly evidenceId: string
  readonly observation: Observation
  readonly policyRef: string
  readonly status: EvidenceStatus
  readonly delta: number
  readonly confidence: number
  readonly signature: string           // SHA-256 hex (16 chars preview)
  readonly fails: boolean
}

// ─────────────────────────────────────────────────────────────────────────────
// POLICY
// ─────────────────────────────────────────────────────────────────────────────

export interface Policy {
  readonly policyId: string
  readonly metricId: string
  readonly threshold: number
  readonly unit: string
  readonly description?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// FINDING
// ─────────────────────────────────────────────────────────────────────────────

export interface Finding {
  readonly findingId: string
  readonly evidence: Evidence
  readonly riskLevel: RiskLevel
  readonly recommendedAction: string
}

// ─────────────────────────────────────────────────────────────────────────────
// PROVENANCE  (Spec 65)
// ─────────────────────────────────────────────────────────────────────────────

export interface ProvenanceNode {
  readonly nodeType: ProvenanceNodeType
  readonly nodeId: string
  readonly payload: string
  readonly timestamp: string           // ISO 8601
}

export interface RejectedAlternative {
  readonly action: string
  readonly rejectedBy: string
  readonly reason: string
}

// ─────────────────────────────────────────────────────────────────────────────
// EXECUTION JOURNAL  (Spec 13)
// ─────────────────────────────────────────────────────────────────────────────

export interface JournalEntry {
  readonly traceId: string
  readonly findingId: string
  readonly action: string
  readonly status: ExecutionStatus
  readonly evidenceSignature: string
  readonly agentIdentity: string
  readonly timestamp: string           // ISO 8601
  readonly note?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// EXECUTION RESULT
// ─────────────────────────────────────────────────────────────────────────────

export interface ExecutionResult {
  readonly action:     string
  readonly status:     ExecutionStatus
  readonly traceId:    string
  readonly evidence?:  Evidence         // absent for VETOED / SKIPPED / BLOCKED
  readonly message:    string
  readonly timestamp:  string           // ISO 8601
}

// ─────────────────────────────────────────────────────────────────────────────
// EDAOS CLIENT CONFIG
// ─────────────────────────────────────────────────────────────────────────────

export interface EDACOSConfig {
  /** Agent identity used in journal entries and policy permission checks */
  identity: string
  /** Certification level this instance targets (default: 'L4') */
  certLevel?: 'L1' | 'L2' | 'L3' | 'L4'
  /** Custom policy overrides */
  policies?: Policy[]
  /** Called on every journal entry (e.g. for OpenTelemetry spans) */
  onJournal?: (entry: JournalEntry) => void
}

export interface ExecuteOptions<T = unknown> {
  readonly action: string
  readonly evidence: Evidence
  fn: () => Promise<T>
  rollback?: () => Promise<void>
  readonly alternatives?: RejectedAlternative[]
}
