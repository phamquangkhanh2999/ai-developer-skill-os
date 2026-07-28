/**
 * AI Code Skin OS - Unified Capability Governance & Discovery Catalog (ESM Standard)
 * Phase 3: Capability Governance & Discovery Plane
 * Orchestrates the full extension discovery lifecycle:
 * Registry ➔ Discovery ➔ Trust Verification ➔ Admission Decision ➔ Execution Bridge
 */

import { ManifestLoader } from './manifest_loader.js';
import { CapabilityRegistry } from './registry.js';
import { TrustEvaluator, TrustLevel } from './trust_evaluator.js';
import { CompatibilityChecker } from './compatibility_checker.js';
import { AdmissionController } from './admission_controller.js';

export class CapabilityCatalog {
  constructor(activeKernelAbiVersion = '1.0.0') {
    this.registry = new CapabilityRegistry();
    this.trustEvaluator = new TrustEvaluator();
    this.compatibilityChecker = new CompatibilityChecker(activeKernelAbiVersion);
    this.admissionController = new AdmissionController(this.registry, this.compatibilityChecker, this.trustEvaluator);
  }

  /**
   * Loads, structural-validates ([ABI-018]), and registers a capability manifest with baseline 'registered' trust level.
   */
  registerCapability(rawManifest, driverInstance) {
    const loadResult = ManifestLoader.loadAndValidate(rawManifest);
    if (!loadResult.isValid) {
      return { success: false, errorCode: loadResult.errorCode, message: loadResult.diagnosticMessage };
    }

    const admittedManifest = loadResult.admittedManifest;
    this.registry.register(admittedManifest, driverInstance);
    this.trustEvaluator.initializeTrust(admittedManifest.capability_manifest_id);

    return {
      success: true,
      manifestId: admittedManifest.capability_manifest_id,
      trustLevel: TrustLevel.REGISTERED,
      manifest: admittedManifest
    };
  }

  /**
   * Promotes trust tier sequentially per [ABI-020] zero-trust rules.
   */
  promoteTrust(manifestId, targetLevel, evidence = null) {
    return this.trustEvaluator.promoteTrust(manifestId, targetLevel, evidence);
  }

  /**
   * Enforces immediate trust downgrade or revocation upon detecting operational anomalies.
   */
  downgradeTrust(manifestId, targetLevel = TrustLevel.REGISTERED, reason = 'Anomalous behavior intercepted') {
    return this.trustEvaluator.downgradeTrust(manifestId, targetLevel, reason);
  }

  /**
   * Swaps executable implementation behind an immutable URN contract without altering Kernel state! (Test 5 Proof)
   */
  replaceImplementation(manifestId, newDriverInstance) {
    try {
      this.registry.replaceImplementation(manifestId, newDriverInstance);
      return { success: true, manifestId, status: 'IMPLEMENTATION_SWAPPED_UNDER_CONTRACT' };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }

  /**
   * Discovers and evaluates admission for an invocation target against unknown boundaries, ABI alignment, and trust gates.
   */
  discoverAndAdmit(manifestId, policyEnvelope = null, requiredTrustLevel = TrustLevel.VALIDATED) {
    return this.admissionController.evaluateAdmission(manifestId, policyEnvelope, requiredTrustLevel);
  }

  getTrustTier(manifestId) {
    return this.trustEvaluator.getTrustLevel(manifestId);
  }
}
