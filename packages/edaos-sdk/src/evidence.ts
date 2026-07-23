/**
 * EvidenceEngine
 * Spec 03 (Tool-Blind Capability) + Spec 08 (Evidence Exchange Contract)
 *
 * Converts raw Observations into verifiable, signed Evidence objects
 * by evaluating them against registered Policy thresholds.
 */

import { createHash } from 'node:crypto'
import type { Evidence, EvidenceStatus, Observation, Policy } from './types.js'

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT BUILT-IN POLICIES
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_POLICIES: Policy[] = [
  { policyId: 'POL-FE-PERF-LCP-01',    metricId: 'LCP',    threshold: 2500, unit: 'ms',    description: 'Largest Contentful Paint (Good threshold)' },
  { policyId: 'POL-FE-PERF-CLS-01',    metricId: 'CLS',    threshold: 0.1,  unit: 'score', description: 'Cumulative Layout Shift (Good threshold)' },
  { policyId: 'POL-FE-PERF-INP-01',    metricId: 'INP',    threshold: 200,  unit: 'ms',    description: 'Interaction to Next Paint (Good threshold)' },
  { policyId: 'POL-FE-BUNDLE-JS-01',   metricId: 'BUNDLE', threshold: 250,  unit: 'KB',    description: 'JS bundle size limit' },
  { policyId: 'POL-BE-ERROR-RATE-01',  metricId: 'ERRORS', threshold: 0,    unit: 'count', description: 'Production error count must be zero' },
  { policyId: 'POL-CI-BUILD-01',        metricId: 'BUILD',  threshold: 0,    unit: 'failures', description: 'CI build failures must be zero' },
]

// ─────────────────────────────────────────────────────────────────────────────
// EVIDENCE ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export class EvidenceEngine {
  private readonly policies: Map<string, Policy>

  constructor(customPolicies: Policy[] = []) {
    this.policies = new Map()
    // Load defaults first, then allow custom policies to override
    for (const p of [...DEFAULT_POLICIES, ...customPolicies]) {
      this.policies.set(p.metricId, p)
    }
  }

  /**
   * Evaluate an observation against known policies.
   * Returns null when no matching policy is found (observation ignored).
   *
   * INVARIANT: No policy match → no evidence → no decision.
   */
  evaluate(obs: Observation): Evidence | null {
    const policy = this.policies.get(obs.metricId)
    if (policy === undefined) return null

    const delta = obs.value - policy.threshold
    const status: EvidenceStatus = delta > 0 ? 'FAIL' : 'PASS'
    const signature = this.sign(obs)

    return {
      evidenceId:  `EV-${obs.metricId}-${Date.now()}`,
      observation: obs,
      policyRef:   policy.policyId,
      status,
      delta:       Math.round(delta * 100) / 100,
      confidence:  0.99,
      signature,
      fails:       status === 'FAIL',
    }
  }

  /** Add or override a policy at runtime */
  registerPolicy(policy: Policy): void {
    this.policies.set(policy.metricId, policy)
  }

  /** List all registered policies */
  listPolicies(): Policy[] {
    return [...this.policies.values()]
  }

  // ── private ────────────────────────────────────────────────────────────────

  private sign(obs: Observation): string {
    const payload = JSON.stringify({
      metricId:  obs.metricId,
      value:     obs.value,
      provider:  obs.provider,
      timestamp: obs.timestamp,
    })
    return createHash('sha256').update(payload).digest('hex').slice(0, 16)
  }
}
