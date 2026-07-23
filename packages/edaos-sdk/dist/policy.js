/**
 * edaos-sdk v11.0.0
 * Evidence-Driven Autonomous Engineering SDK
 * Apache-2.0 License — https://edaos.org
 */

// src/policy.ts
var DEFAULT_RISK_THRESHOLDS = {
  criticalDelta: 2e3,
  highDelta: 1e3,
  mediumDelta: 300
};
var PolicyEngine = class {
  constructor(options = {}) {
    this.thresholds = { ...DEFAULT_RISK_THRESHOLDS, ...options.thresholds };
    this.privilegedRoles = options.privilegedRoles ?? ["ARCHITECT", "ADMIN", "PRINCIPAL"];
  }
  /**
   * Classify the risk level of a failing evidence object.
   * PASS evidence always returns LOW.
   */
  classifyRisk(evidence) {
    if (!evidence.fails) return "LOW";
    const abs = Math.abs(evidence.delta);
    if (abs > this.thresholds.criticalDelta) return "CRITICAL";
    if (abs > this.thresholds.highDelta) return "HIGH";
    if (abs > this.thresholds.mediumDelta) return "MEDIUM";
    return "LOW";
  }
  /**
   * Build a Finding from failing evidence.
   * Returns null for PASS evidence (no action needed).
   */
  toFinding(evidence, action) {
    if (!evidence.fails) return null;
    return {
      findingId: `FND-${evidence.observation.metricId}-${Date.now()}`,
      evidence,
      riskLevel: this.classifyRisk(evidence),
      recommendedAction: action
    };
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
  isPermitted(finding, agentIdentity) {
    if (finding.riskLevel !== "CRITICAL") return true;
    return this.privilegedRoles.some(
      (role) => agentIdentity.toUpperCase().includes(role)
    );
  }
  /**
   * Quarantine a policy violation — returns a structured record
   * suitable for the Execution Journal.
   * Spec 21: violations must be quarantined, not silently skipped.
   */
  quarantine(action, ruleId, reason) {
    return {
      quarantined: true,
      action,
      ruleId,
      reason,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
};

export { PolicyEngine };
//# sourceMappingURL=policy.js.map
//# sourceMappingURL=policy.js.map