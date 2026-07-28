/**
 * AI Code Skin OS - Capability Compatibility & Determinism Checker (ESM Standard)
 * Phase 3: Capability Governance & Discovery Plane
 * Implements:
 *  - [ABI-008] & [ABI-014] Contract Identity & ABI Version Alignment verification
 *  - [ABI-019] Capability Determinism Classification validation
 */

export const DeterminismCategory = Object.freeze({
  DETERMINISTIC: 'deterministic',
  EXTERNALLY_DETERMINISTIC: 'externally_deterministic',
  NONDETERMINISTIC: 'nondeterministic'
});

export class CompatibilityChecker {
  constructor(activeKernelAbiVersion = '1.0.0') {
    this.activeKernelAbiVersion = activeKernelAbiVersion;
  }

  /**
   * Verifies structural compatibility and determinism classification of an extension manifest.
   * @param {object} manifest - The candidate capability manifest contract
   * @returns {object} { isCompatible: boolean, errorCode: string|null, diagnosticMessage: string|null }
   */
  evaluateCompatibility(manifest) {
    if (!manifest || !manifest.capability_manifest_id) {
      return {
        isCompatible: false,
        errorCode: 'INVALID_MANIFEST_SCHEMA',
        diagnosticMessage: 'Manifest missing mandatory identity coordinates (capability_manifest_id).'
      };
    }

    // 1. Verify ABI Version compatibility ([ABI-008])
    const requiredAbi = manifest.target_kernel_abi || manifest.capability_contract_version || '1.0.0';
    if (requiredAbi !== this.activeKernelAbiVersion) {
      return {
        isCompatible: false,
        errorCode: 'ABI_VERSION_MISMATCH',
        diagnosticMessage: `[ABI MISMATCH]: Manifest '${manifest.capability_manifest_id}' requires kernel ABI '${requiredAbi}', but active runtime engine presents KERNEL_ABI_VERSION '${this.activeKernelAbiVersion}'.`
      };
    }

    // 2. Validate Determinism Classification taxonomy ([ABI-019])
    const determinism = manifest.determinism;
    const validStrata = Object.values(DeterminismCategory);
    if (!determinism || !validStrata.includes(determinism)) {
      return {
        isCompatible: false,
        errorCode: 'ABI-019_MISSING_DETERMINISM_CLASSIFICATION',
        diagnosticMessage: `[ABI-019 VIOLATION]: Manifest '${manifest.capability_manifest_id}' must categorize valid determinism semantics from [${validStrata.join(', ')}]. Received: '${determinism}'.`
      };
    }

    return {
      isCompatible: true,
      errorCode: null,
      diagnosticMessage: `Manifest compatible with kernel ABI '${this.activeKernelAbiVersion}' under '${determinism}' determinism profile.`
    };
  }
}
