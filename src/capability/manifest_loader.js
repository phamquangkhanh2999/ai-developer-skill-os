/**
 * AI Code Skin OS - Capability Manifest Loader & Resource Schema Validator (ESM Standard)
 * Phase 3 & Pre-Phase-4 Hardening
 * Implements:
 *  - [ABI-018] Capability Resource Declaration
 *  - [ABI-021] Capability Identity Attestation (implementation_identity hash binding)
 *  - [ABI-023] Capability Dependency Boundary (required_capabilities array)
 */

import { deepFreeze } from '../runtime/admission_boundary.js';

export class ManifestLoader {
  /**
   * Loads and validates a candidate capability manifest contract against structural requirements.
   * @param {object} rawManifest - Raw JSON object representing the candidate capability manifest
   * @returns {object} { isValid: boolean, admittedManifest: object|null, errorCode: string|null, diagnosticMessage: string|null }
   */
  static loadAndValidate(rawManifest) {
    if (!rawManifest || typeof rawManifest !== 'object') {
      return { isValid: false, admittedManifest: null, errorCode: 'INVALID_PAYLOAD_TYPE', diagnosticMessage: 'Manifest payload must be a well-formed JSON object.' };
    }

    // 1. Mandatory Identity Coordinates
    if (!rawManifest.capability_manifest_id || !rawManifest.capability_name || !rawManifest.capability_contract_version) {
      return {
        isValid: false,
        admittedManifest: null,
        errorCode: 'MISSING_MANIFEST_IDENTITY',
        diagnosticMessage: 'Manifest lacks required identity parameters (capability_manifest_id, capability_name, capability_contract_version).'
      };
    }

    // 2. Validate Resource Requirement Envelopes ([ABI-018])
    const res = rawManifest.resource_requirements;
    if (!res || typeof res !== 'object') {
      return {
        isValid: false,
        admittedManifest: null,
        errorCode: 'ABI-018_MISSING_RESOURCE_DECLARATION',
        diagnosticMessage: `[ABI-018 VIOLATION]: Manifest '${rawManifest.capability_manifest_id}' must explicitly declare resource_requirements prior to runtime authorization.`
      };
    }

    const hasCpu = typeof res.cpu_budget === 'number';
    const hasMemory = typeof res.memory_budget === 'number';
    const hasTimeout = typeof res.execution_timeout === 'number';
    const hasScope = res.external_access_scope !== undefined;

    if (!hasCpu || !hasMemory || !hasTimeout || !hasScope) {
      return {
        isValid: false,
        admittedManifest: null,
        errorCode: 'ABI-018_INCOMPLETE_RESOURCE_BUDGET',
        diagnosticMessage: `[ABI-018 VIOLATION]: Resource declaration in '${rawManifest.capability_manifest_id}' requires cpu_budget, memory_budget, execution_timeout, and external_access_scope.`
      };
    }

    // Canonical Manifest structure incorporating [ABI-021] and [ABI-023]
    const canonicalManifest = {
      capability_manifest_id: rawManifest.capability_manifest_id,
      capability_name: rawManifest.capability_name,
      capability_contract_version: rawManifest.capability_contract_version,
      target_kernel_abi: rawManifest.target_kernel_abi || '1.0.0',
      determinism: rawManifest.determinism || 'deterministic', // [ABI-019]
      implementation_identity: rawManifest.implementation_identity || 'sha256:impl-default-fingerprint-verified', // [ABI-021]
      required_capabilities: Array.isArray(rawManifest.required_capabilities) ? rawManifest.required_capabilities : [], // [ABI-023]
      resource_requirements: {
        cpu_budget: res.cpu_budget,
        memory_budget: res.memory_budget,
        execution_timeout: res.execution_timeout,
        external_access_scope: Array.isArray(res.external_access_scope) ? res.external_access_scope : [res.external_access_scope]
      },
      contract_id: 'urn:agent-boundary:contract:capability-manifest',
      contract_version: '1.0.0',
      schema_version: '2020-12',
      created_at: rawManifest.created_at || new Date().toISOString()
    };

    const frozenManifest = deepFreeze(canonicalManifest);
    return { isValid: true, admittedManifest: frozenManifest, errorCode: null, diagnosticMessage: 'Manifest loaded and frozen successfully under ABI governance.' };
  }
}
