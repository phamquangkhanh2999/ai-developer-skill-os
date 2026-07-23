/**
 * ControlPlane
 * EDAOS Minimum Viable Control Plane — orchestrates all 6 subsystems.
 *
 * Enforces the master invariant end-to-end:
 *   No Evidence → No Decision → No Execution
 *
 * Internal use only. Consumer-facing API is the EDAOS class (edaos.ts).
 */

import { EvidenceEngine }  from './evidence.js'
import { ExecutionJournal } from './journal.js'
import { PolicyEngine }     from './policy.js'
import { ProvenanceGraph }  from './provenance.js'
import { SagaManager }      from './saga.js'
import type {
  EDACOSConfig,
  Evidence,
  ExecuteOptions,
  ExecutionResult,
  Finding,
  Observation,
  Policy,
} from './types.js'

// ─────────────────────────────────────────────────────────────────────────────
// CONTROL PLANE
// ─────────────────────────────────────────────────────────────────────────────

export class ControlPlane {
  readonly identity:  string
  readonly certLevel: string

  readonly evidenceEngine: EvidenceEngine
  readonly policyEngine:   PolicyEngine
  readonly sagaManager:    SagaManager
  readonly journal:        ExecutionJournal

  /** Fresh provenance graph per observation cycle */
  private currentGraph: ProvenanceGraph | null = null

  constructor(config: EDACOSConfig) {
    this.identity  = config.identity
    this.certLevel = config.certLevel ?? 'L4'

    this.evidenceEngine = new EvidenceEngine(config.policies)

    this.policyEngine = new PolicyEngine({
      privilegedRoles: ['ARCHITECT', 'ADMIN', 'PRINCIPAL'],
    })

    this.sagaManager = new SagaManager({
      onCheckpoint: action => this.log(`CHECKPOINT: ${action}`),
      onCommit:     action => this.log(`COMMITTED:  ${action}`),
      onRollback:   (action, err) => this.log(`ROLLED_BACK: ${action} — ${err.message}`),
    })

    this.journal = new ExecutionJournal(
      config.onJournal ? { onAppend: config.onJournal } : {}
    )
  }

  // ── Core pipeline ──────────────────────────────────────────────────────────

  /**
   * Convert an Observation into a signed Evidence object.
   * Returns null if no matching policy exists.
   */
  observe(obs: Observation): Evidence | null {
    const evidence = this.evidenceEngine.evaluate(obs)
    if (evidence === null) return null

    // Start a new provenance graph for this observation cycle
    this.currentGraph = new ProvenanceGraph()
    this.currentGraph.record('OBSERVATION', obs.metricId, obs.value)
    this.currentGraph.record('EVIDENCE', evidence.evidenceId, {
      status:    evidence.status,
      delta:     evidence.delta,
      signature: evidence.signature,
    })

    return evidence
  }

  /**
   * Execute an action using the full Evidence → Decision → Execution pipeline.
   * Throws EDACOSInvariantError if evidence is missing or PASS.
   */
  async execute<T>(options: ExecuteOptions<T>): Promise<ExecutionResult> {
    const { action, evidence, fn, rollback, alternatives = [] } = options

    // ── Record alternatives ─────────────────────────────────────────────────
    for (const alt of alternatives) {
      this.currentGraph?.recordRejectedAlternative(alt)
    }

    // ── Build finding ───────────────────────────────────────────────────────
    const finding = this.policyEngine.toFinding(evidence, action)

    if (finding === null) {
      // Evidence is PASS — no action needed
      const entry = this.journal.append({
        findingId:         `FND-PASS-${Date.now()}`,
        action,
        status:            'SKIPPED',
        evidenceSignature: evidence.signature,
        agentIdentity:     this.identity,
        note:              'Evidence PASS — no action required',
      })
      this.currentGraph?.record('OUTCOME', 'SKIPPED', action)
      return this.buildResult(action, 'SKIPPED', entry.traceId, evidence, 'Evidence PASS')
    }

    this.currentGraph?.record('FINDING', finding.findingId, {
      risk: finding.riskLevel,
    })

    // ── Permission gate ─────────────────────────────────────────────────────
    if (!this.policyEngine.isPermitted(finding, this.identity)) {
      const entry = this.journal.append({
        findingId:         finding.findingId,
        action,
        status:            'BLOCKED',
        evidenceSignature: evidence.signature,
        agentIdentity:     this.identity,
        note:              `CRITICAL risk — identity '${this.identity}' lacks required role`,
      })
      this.currentGraph?.record('DECISION', 'BLOCKED', this.identity)
      this.currentGraph?.record('OUTCOME', 'BLOCKED', action)
      return this.buildResult(action, 'BLOCKED', entry.traceId, evidence,
        `CRITICAL risk — human approval required`)
    }

    // ── Saga execution ──────────────────────────────────────────────────────
    this.currentGraph?.record('DECISION', action, 'APPROVED')
    const saga = await this.sagaManager.execute(action, fn, rollback)

    const entry = this.journal.append({
      findingId:         finding.findingId,
      action,
      status:            saga.status,
      evidenceSignature: evidence.signature,
      agentIdentity:     this.identity,
      ...(saga.error?.message !== undefined ? { note: saga.error.message } : {}),
    })

    this.currentGraph?.record('OUTCOME', saga.status, action)

    return this.buildResult(
      action,
      saga.status,
      entry.traceId,
      evidence,
      saga.error?.message ?? `${saga.status}`,
    )
  }

  /**
   * Human veto — immediately halt any pending action.
   * Constitution Article 4: veto can never be overridden.
   */
  veto(action: string, reason: string): ExecutionResult {
    const entry = this.journal.append({
      findingId:         `FND-VETO-${Date.now()}`,
      action,
      status:            'VETOED',
      evidenceSignature: 'HUMAN-VETO',
      agentIdentity:     this.identity,
      note:              reason,
    })
    this.currentGraph?.record('DECISION', 'VETOED', reason)
    this.currentGraph?.record('OUTCOME', 'VETOED', action)
    return this.buildResult(action, 'VETOED', entry.traceId, undefined, `Human veto: ${reason}`)
  }

  /** Returns the provenance graph for the current cycle */
  getProvenance(): ProvenanceGraph | null {
    return this.currentGraph
  }

  /** Add a custom policy at runtime */
  registerPolicy(policy: Policy): void {
    this.evidenceEngine.registerPolicy(policy)
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private buildResult(
    action:    string,
    status:    ExecutionResult['status'],
    traceId:   string,
    evidence:  Evidence | undefined,
    message:   string,
  ): ExecutionResult {
    return {
      action,
      status,
      traceId,
      ...(evidence !== undefined ? { evidence } : {}),
      message,
      timestamp: new Date().toISOString(),
    } as ExecutionResult
  }

  private log(msg: string): void {
    // Use console.debug so library consumers can suppress
    console.debug(`[EDAOS] ${this.identity} | ${msg}`)
  }
}
