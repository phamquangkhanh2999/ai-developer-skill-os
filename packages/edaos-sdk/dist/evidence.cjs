'use strict';

var crypto = require('crypto');

/**
 * edaos-sdk v11.0.0
 * Evidence-Driven Autonomous Engineering SDK
 * Apache-2.0 License — https://edaos.org
 */

var DEFAULT_POLICIES = [
  { policyId: "POL-FE-PERF-LCP-01", metricId: "LCP", threshold: 2500, unit: "ms", description: "Largest Contentful Paint (Good threshold)" },
  { policyId: "POL-FE-PERF-CLS-01", metricId: "CLS", threshold: 0.1, unit: "score", description: "Cumulative Layout Shift (Good threshold)" },
  { policyId: "POL-FE-PERF-INP-01", metricId: "INP", threshold: 200, unit: "ms", description: "Interaction to Next Paint (Good threshold)" },
  { policyId: "POL-FE-BUNDLE-JS-01", metricId: "BUNDLE", threshold: 250, unit: "KB", description: "JS bundle size limit" },
  { policyId: "POL-BE-ERROR-RATE-01", metricId: "ERRORS", threshold: 0, unit: "count", description: "Production error count must be zero" },
  { policyId: "POL-CI-BUILD-01", metricId: "BUILD", threshold: 0, unit: "failures", description: "CI build failures must be zero" }
];
var EvidenceEngine = class {
  constructor(customPolicies = []) {
    this.policies = /* @__PURE__ */ new Map();
    for (const p of [...DEFAULT_POLICIES, ...customPolicies]) {
      this.policies.set(p.metricId, p);
    }
  }
  /**
   * Evaluate an observation against known policies.
   * Returns null when no matching policy is found (observation ignored).
   *
   * INVARIANT: No policy match → no evidence → no decision.
   */
  evaluate(obs) {
    const policy = this.policies.get(obs.metricId);
    if (policy === void 0) return null;
    const delta = obs.value - policy.threshold;
    const status = delta > 0 ? "FAIL" : "PASS";
    const signature = this.sign(obs);
    return {
      evidenceId: `EV-${obs.metricId}-${Date.now()}`,
      observation: obs,
      policyRef: policy.policyId,
      status,
      delta: Math.round(delta * 100) / 100,
      confidence: 0.99,
      signature,
      fails: status === "FAIL"
    };
  }
  /** Add or override a policy at runtime */
  registerPolicy(policy) {
    this.policies.set(policy.metricId, policy);
  }
  /** List all registered policies */
  listPolicies() {
    return [...this.policies.values()];
  }
  // ── private ────────────────────────────────────────────────────────────────
  sign(obs) {
    const payload = JSON.stringify({
      metricId: obs.metricId,
      value: obs.value,
      provider: obs.provider,
      timestamp: obs.timestamp
    });
    return crypto.createHash("sha256").update(payload).digest("hex").slice(0, 16);
  }
};

exports.EvidenceEngine = EvidenceEngine;
//# sourceMappingURL=evidence.cjs.map
//# sourceMappingURL=evidence.cjs.map