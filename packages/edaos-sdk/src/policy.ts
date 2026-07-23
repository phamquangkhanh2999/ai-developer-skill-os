/**
 * PolicyEngine
 * Spec 06 (Governance Policy Model) + Spec 21 (Policy Evaluator Runtime)
 *
 * Classifies risk level of findings and enforces permission gates
 * before autonomous execution is permitted.
 */

import type { Evidence, Finding, RiskLevel } from './types.js'

// ─────────────────────────────────────────────────────────────────────────────
// RISK THRESHOLDS  (configurable per deployment)
// ─────────────────────────────────────────────────────────────────────────────

export interface RiskThresholds {
  criticalDelta: number
  highDelta:     number
  mediumDelta:   number
}

const DEFAULT_RISK_THRESHOLDS: RiskThresholds = {
  criticalDelta: 2000,
  highDelta:     1000,
  mediumDelta:   300,
}

// ─────────────────────────────────────────────────────────────────────────────
// POLICY ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export class PolicyEngine {
  private readonly thresholds: RiskThresholds
  /** Identities that may act on CRITICAL findings without human gate */
  private readonly privilegedRoles: string[]

  constructor(options: {
    thresholds?: Partial<RiskThresholds>
    privilegedRoles?: string[]
  } = {}) {
    this.thresholds = { ...DEFAULT_RISK_THRESHOLDS, ...options.thresholds }
    this.privilegedRoles = options.privilegedRoles ?? ['ARCHITECT', 'ADMIN', 'PRINCIPAL']
  }

  /**
   * Classify the risk level of a failing evidence object.
   * PASS evidence always returns LOW.
   */
  classifyRisk(evidence: Evidence): RiskLevel {
    if (!evidence.fails) return 'LOW'

    const abs = Math.abs(evidence.delta)
    if (abs > this.thresholds.criticalDelta) return 'CRITICAL'
    if (abs > this.thresholds.highDelta)     return 'HIGH'
    if (abs > this.thresholds.mediumDelta)   return 'MEDIUM'
    return 'LOW'
  }

  /**
   * Build a Finding from failing evidence.
   * Returns null for PASS evidence (no action needed).
   */
  toFinding(evidence: Evidence, action: string): Finding | null {
    if (!evidence.fails) return null

    return {
      findingId:          `FND-${evidence.observation.metricId}-${Date.now()}`,
      evidence,
      riskLevel:          this.classifyRisk(evidence),
      recommendedAction:  action,
    }
  }

  /**
   * Gate: is the agent identity permitted to act on this finding?
   *
   * CRITICAL findings require a privileged role (ARCHITECT / ADMIN / PRINCIPAL).
   * All other risk levels are permitted for any agent.
   *
   * Spec 89 Art. 4: The human governance console can inject VETOED status
   * independently of this check.
   */
  isPermitted(finding: Finding, agentIdentity: string): boolean {
    if (finding.riskLevel !== 'CRITICAL') return true
    return this.privilegedRoles.some(role =>
      agentIdentity.toUpperCase().includes(role)
    )
  }

  /**
   * Quarantine a policy violation — returns a structured record
   * suitable for the Execution Journal.
   * Spec 21: violations must be quarantined, not silently skipped.
   */
  quarantine(action: string, ruleId: string, reason: string): {
    quarantined: true
    action: string
    ruleId: string
    reason: string
    timestamp: string
  } {
    return {
      quarantined: true,
      action,
      ruleId,
      reason,
      timestamp: new Date().toISOString(),
    }
  }
}
