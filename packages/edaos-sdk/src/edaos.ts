/**
 * EDAOS — Developer-facing client
 * The single entry point for all EDAOS integrations.
 *
 * Usage:
 *   import { EDAOS } from 'edaos-sdk'
 *
 *   const edaos = new EDAOS({ identity: 'my-agent' })
 *   const ev    = await edaos.observe('LCP', 3800, 'ms')
 *   if (ev?.fails) {
 *     const result = await edaos.execute({
 *       action:   'optimize_lcp',
 *       evidence: ev,
 *       fn:       async () => { ... },
 *       rollback: async () => { ... },
 *     })
 *   }
 */

import { ControlPlane }    from './control-plane.js'
import type {
  EDACOSConfig,
  Evidence,
  ExecuteOptions,
  ExecutionResult,
  JournalEntry,
  Observation,
  Policy,
} from './types.js'

// ─────────────────────────────────────────────────────────────────────────────
// EDAOS CLIENT
// ─────────────────────────────────────────────────────────────────────────────

export class EDAOS {
  private readonly cp: ControlPlane

  constructor(config: EDACOSConfig) {
    this.cp = new ControlPlane(config)
  }

  // ── Core 3-method API ──────────────────────────────────────────────────────

  /**
   * Step 1 — Observe a metric and convert it to a governed Evidence object.
   *
   * Returns `null` when no matching policy is registered for the metric.
   * This is normal and means the metric is unregulated — no evidence, no action.
   *
   * @param metricId  The metric name, e.g. 'LCP', 'BUNDLE', 'ERRORS'
   * @param value     The measured value
   * @param unit      The unit string, e.g. 'ms', 'KB', 'count'
   * @param provider  The tool that measured it (default: 'unknown')
   */
  observe(
    metricId: string,
    value:    number,
    unit:     string,
    provider = 'unknown',
  ): Evidence | null {
    const obs: Observation = {
      metricId,
      value,
      unit,
      provider,
      timestamp: new Date().toISOString(),
    }
    return this.cp.observe(obs)
  }

  /**
   * Step 2 — Execute an action with Saga rollback safety.
   *
   * INVARIANT: `options.evidence` is required.
   * Calling execute() without evidence throws EDACOSInvariantError.
   *
   * @throws {EDACOSInvariantError} if evidence is null/undefined
   */
  async execute<T = unknown>(options: ExecuteOptions<T>): Promise<ExecutionResult> {
    if (options.evidence === null || options.evidence === undefined) {
      throw new EDACOSInvariantError(
        `Cannot execute '${options.action}' — evidence is required. ` +
        `Call edaos.observe() first. Invariant: No Evidence => No Execution.`
      )
    }
    return this.cp.execute(options)
  }

  /**
   * Human Veto — immediately halt any autonomous action.
   * Constitution Article 4: this can never be overridden by the agent.
   *
   * @param action  The action to halt
   * @param reason  Human-readable reason (logged in journal)
   */
  veto(action: string, reason: string): ExecutionResult {
    return this.cp.veto(action, reason)
  }

  // ── Introspection ──────────────────────────────────────────────────────────

  /** Returns all journal entries (immutable) */
  journal(): readonly JournalEntry[] {
    return this.cp.journal.all()
  }

  /** Returns a summary of outcomes: { COMMITTED: N, ROLLED_BACK: N, ... } */
  journalSummary(): Record<string, number> {
    return this.cp.journal.summary()
  }

  /** Returns the current provenance graph rendered as ASCII */
  provenanceTree(): string {
    return this.cp.getProvenance()?.render() ?? '[No provenance recorded yet]'
  }

  /** Returns the raw provenance JSON for storage */
  provenanceJSON(): object | null {
    return this.cp.getProvenance()?.toJSON() ?? null
  }

  /** Register a custom policy at runtime */
  registerPolicy(policy: Policy): this {
    this.cp.registerPolicy(policy)
    return this
  }

  /** The agent identity this EDAOS instance was created with */
  get identity(): string {
    return this.cp.identity
  }

  /** The target certification level */
  get certLevel(): string {
    return this.cp.certLevel
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// INVARIANT ERROR
// ─────────────────────────────────────────────────────────────────────────────

export class EDACOSInvariantError extends Error {
  readonly code = 'EDAOS_INVARIANT_VIOLATION' as const

  constructor(message: string) {
    super(message)
    this.name = 'EDACOSInvariantError'
  }
}
