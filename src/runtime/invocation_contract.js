/**
 * AI Code Skin OS - Capability Invocation Boundary & Identity Binding (HARDENING-015 & ABI-014)
 * Establishes explicit contract intermediary between ExecutionPlan and CapabilityResult:
 * ExecutionPlan ➔ CapabilityInvocationRequest ➔ CapabilityResult
 * Pre-Phase-3 Hardening: Includes invocation_attempt_id to support unambiguous retry reconstruction.
 */

import { deepFreeze } from './admission_boundary.js';

export class CapabilityInvocationRequest {
  /**
   * Constructs a strictly isolated invocation request from an execution plan step.
   * Prevents capability implementations from coupling with root Kernel execution plans.
   */
  constructor({ invocationId, invocationAttemptId = 'attempt-1', parentExecutionId, planReferenceId, stepIndex, capabilityManifestId, capabilityContractVersion = '1.0.0', parametersSlice, timeoutMs = 5000 }) {
    if (!invocationId || !planReferenceId || typeof stepIndex !== 'number' || !capabilityManifestId) {
      throw new Error('[INVOCATION BOUNDARY ERROR]: CapabilityInvocationRequest requires mandatory parameters (invocationId, planReferenceId, stepIndex, capabilityManifestId).');
    }

    const payload = {
      invocation_id: invocationId,
      invocation_attempt_id: invocationAttemptId,
      parent_execution_id: parentExecutionId || 'kernel-session-default',
      plan_reference_id: planReferenceId,
      step_index: stepIndex,
      capability_manifest_id: capabilityManifestId,
      capability_contract_version: capabilityContractVersion,
      parameters_slice: parametersSlice || {},
      timeout_ms: timeoutMs,
      contract_id: 'urn:agent-boundary:contract:capability-invocation-request',
      contract_version: '1.0.0',
      schema_version: '2020-12',
      created_at: new Date().toISOString()
    };

    return deepFreeze(payload);
  }

  static fromPlanStep(planId, stepIndex, stepConfig, parentExecutionId = 'session-root', attemptId = 'attempt-1') {
    return new CapabilityInvocationRequest({
      invocationId: `invoc-${Date.now()}-${stepIndex}-${Math.random().toString(36).substring(2, 6)}`,
      invocationAttemptId: attemptId,
      parentExecutionId: parentExecutionId,
      planReferenceId: planId,
      stepIndex: stepIndex,
      capabilityManifestId: stepConfig.capability_manifest_id || 'urn:agent-boundary:manifest:default-driver',
      capabilityContractVersion: stepConfig.capability_contract_version || '1.0.0',
      parametersSlice: stepConfig.parameters || {},
      timeoutMs: stepConfig.timeout_ms || 5000
    });
  }
}
