/**
 * AI Code Skin OS - Capability Admission Controller (ESM Standard)
 * Phase 3: Capability Governance & Discovery Plane
 * Implements architectural gates:
 *  - Test 1: Unknown capability rejected at runtime discovery boundary
 *  - Test 3: Capability ABI mismatch rejected authoritatively
 *  - Test 4: Trust hierarchy enforcement & immediate interdiction of untrusted tiers
 *  - [ABI-018]: Guardrail check against PolicyEnvelope allowances prior to admission
 */

import { FailureCategory } from '../runtime/failure_semantics.js';
import { TrustLevel } from './trust_evaluator.js';

export class AdmissionController {
  constructor(registry, compatibilityChecker, trustEvaluator) {
    this.registry = registry;
    this.compatibilityChecker = compatibilityChecker;
    this.trustEvaluator = trustEvaluator;
  }

  /**
   * Evaluates admission for a candidate capability invocation against registry, ABI, trust, and policy guardrails.
   * @param {string} manifestId - Target URN manifest coordinate
   * @param {object} policyEnvelope - Active Coroutine policy envelope
   * @param {string} minimumTrustLevel - Required trust threshold (defaults to VALIDATED)
   * @returns {object} { isAdmitted: boolean, manifest: object|null, driver: object|null, errorCode: string|null, failureCategory: string|null, diagnosticMessage: string|null }
   */
  evaluateAdmission(manifestId, policyEnvelope = null, minimumTrustLevel = TrustLevel.VALIDATED) {
    // 1. Unknown Capability Interdiction (Test 1 Proof)
    if (!this.registry.isRegistered(manifestId)) {
      return {
        isAdmitted: false,
        manifest: null,
        driver: null,
        errorCode: 'UNKNOWN_CAPABILITY_REJECTED',
        failureCategory: FailureCategory.CONTRACT_VIOLATION,
        diagnosticMessage: `[ADMISSION REJECTED]: Capability '${manifestId}' is unknown to Manifest Registry. Untrusted foreign invocation denied.`
      };
    }

    const entry = this.registry.lookup(manifestId);
    const { manifest, driver } = entry;

    // 2. ABI Compatibility & Determinism Verification (Test 3 Proof)
    const compatResult = this.compatibilityChecker.evaluateCompatibility(manifest);
    if (!compatResult.isCompatible) {
      return {
        isAdmitted: false,
        manifest,
        driver: null,
        errorCode: compatResult.errorCode || 'ABI_VERSION_MISMATCH',
        failureCategory: FailureCategory.CONTRACT_VIOLATION,
        diagnosticMessage: compatResult.diagnosticMessage
      };
    }

    // 3. Trust Tier Promotion & Downgrade Enforcement (Test 4 Proof & [ABI-020])
    if (!this.trustEvaluator.satisfiesThreshold(manifestId, minimumTrustLevel)) {
      const currentTrust = this.trustEvaluator.getTrustLevel(manifestId);
      return {
        isAdmitted: false,
        manifest,
        driver: null,
        errorCode: 'INSUFFICIENT_TRUST_HIERARCHY',
        failureCategory: FailureCategory.POLICY_DENIED,
        diagnosticMessage: `[TRUST GATE INTERDICTION]: Capability '${manifestId}' holds trust tier '${currentTrust}', which fails to satisfy required execution threshold '${minimumTrustLevel}'.`
      };
    }

    // 4. Resource Allowance Guardrail Check ([ABI-018])
    if (policyEnvelope && policyEnvelope.resource_allowance && manifest.resource_requirements) {
      const policyMaxTimeout = policyEnvelope.resource_allowance.max_timeout_ms || 10000;
      if (manifest.resource_requirements.execution_timeout > policyMaxTimeout) {
        return {
          isAdmitted: false,
          manifest,
          driver: null,
          errorCode: 'ABI-018_RESOURCE_CEILING_EXCEEDED',
          failureCategory: FailureCategory.RESOURCE_EXHAUSTED,
          diagnosticMessage: `[RESOURCE INTERDICTION]: Manifest execution_timeout (${manifest.resource_requirements.execution_timeout}ms) exceeds policy ceiling (${policyMaxTimeout}ms).`
        };
      }
    }

    return {
      isAdmitted: true,
      manifest,
      driver,
      errorCode: null,
      failureCategory: null,
      diagnosticMessage: `Capability '${manifestId}' admitted under verified trust and ABI compatibility.`
    };
  }
}
