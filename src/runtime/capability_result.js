/**
 * AI Code Skin OS - Governed Capability Result Contract (ESM Standard)
 * Implements Pre-Phase-2.3 & Pre-Phase-3 Hardening requirements:
 *  - [ABI-014] Invocation Identity Binding (binds invocation_id, invocation_attempt_id, parent_execution_id)
 *  - [ABI-015] Result Authenticity Boundary (segregates Declared Output vs. Observed Side Effect)
 */

import { deepFreeze } from './admission_boundary.js';

export class CapabilityResult {
  /**
   * Constructs an immutable CapabilityResult contract.
   * @param {object} config - { invocationId, invocationAttemptId, parentExecutionId, capabilityContractVersion, status, declaredOutput, proposedSideEffects, verificationEvidence, errorCode, errorDetails }
   */
  constructor({ invocationId, invocationAttemptId = 'attempt-1', parentExecutionId, capabilityContractVersion = '1.0.0', status = 'SUCCESS', declaredOutput = {}, proposedSideEffects = [], verificationEvidence = null, errorCode = null, errorDetails = null }) {
    if (!invocationId || !parentExecutionId) {
      throw new Error('[ABI-014 VIOLATION]: CapabilityResult must structurally bind invocationId and parentExecutionId.');
    }

    const payload = {
      result_id: `res-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      invocation_id: invocationId,
      invocation_attempt_id: invocationAttemptId,
      parent_execution_id: parentExecutionId,
      status: status, // 'SUCCESS', 'FAILED', 'TIMEOUT', 'VERSION_MISMATCH', 'REJECTED'
      declared_output: declaredOutput || {},
      proposed_side_effects: Array.isArray(proposedSideEffects) ? proposedSideEffects : [proposedSideEffects],
      verification_evidence: verificationEvidence,
      error_code: errorCode,
      error_details: errorDetails,
      contract_id: 'urn:agent-boundary:contract:capability-result',
      capability_contract_version: capabilityContractVersion,
      contract_version: '1.0.0',
      schema_version: '2020-12',
      created_at: new Date().toISOString()
    };

    return deepFreeze(payload);
  }

  static success(invocationRequest, declaredOutput = {}, proposedSideEffects = [], verificationEvidence = null) {
    return new CapabilityResult({
      invocationId: invocationRequest.invocation_id,
      invocationAttemptId: invocationRequest.invocation_attempt_id || 'attempt-1',
      parentExecutionId: invocationRequest.parent_execution_id || 'kernel-session-root',
      capabilityContractVersion: invocationRequest.capability_contract_version || '1.0.0',
      status: 'SUCCESS',
      declaredOutput,
      proposedSideEffects,
      verificationEvidence
    });
  }

  static fail(invocationRequest, errorCode, errorDetails, status = 'FAILED') {
    return new CapabilityResult({
      invocationId: invocationRequest.invocation_id,
      invocationAttemptId: invocationRequest.invocation_attempt_id || 'attempt-1',
      parentExecutionId: invocationRequest.parent_execution_id || 'kernel-session-root',
      capabilityContractVersion: invocationRequest.capability_contract_version || '1.0.0',
      status: status,
      errorCode,
      errorDetails
    });
  }
}
