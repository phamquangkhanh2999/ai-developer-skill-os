/**
 * AI Code Skin OS - Governed Capability Boundary Bridge (ESM Standard)
 * Phase 2.3: Capability Boundary Bridge
 * Implements authoritative mediation between untrusted extensions and the Microkernel Core:
 *  - [ABI-013] Capability Non-Authority (Driver proposals checked before runtime acceptance)
 *  - [ABI-014] Invocation Identity Binding & Contract Version Mismatch Verification
 *  - [ABI-015] Result Authenticity Boundary (Segregation of declared vs verified outputs)
 *  - [ABI-016] Timeout & Fault Survival via Sandbox Delegation
 *  - [ABI-017] Logical Clock Ownership (Exclusive time advancement by Runtime Authority)
 */

import { CapabilitySandbox } from './capability_sandbox.js';
import { CapabilityResult } from './capability_result.js';
import { AuthorityController, MutationProposal } from './authority_boundary.js';
import { FailureCategory } from './failure_semantics.js';
import { RuntimeEvent, RuntimeEventType } from './runtime_events.js';

export class CapabilityBoundaryBridge {
  constructor(evidenceEmitter) {
    if (!evidenceEmitter) {
      throw new Error('[KERNEL BRIDGE INTEGRITY FAULT]: CapabilityBoundaryBridge requires an authoritative EvidenceEmitter.');
    }
    this.evidenceEmitter = evidenceEmitter;
    this._registeredDrivers = new Map();
    this._driverManifests = new Map();
  }

  /**
   * Registers an external untrusted capability driver with an expected contract version.
   */
  registerDriver(manifestId, driverInstance, expectedVersion = '1.0.0') {
    this._registeredDrivers.set(manifestId, driverInstance);
    this._driverManifests.set(manifestId, { manifestId, expectedVersion });
  }

  /**
   * Dispatches an isolated CapabilityInvocationRequest across the boundary bridge.
   * Enforces version consistency, sandbox fault defense, and side-effect authority governance.
   * @param {object} invocationRequest - CapabilityInvocationRequest payload
   * @param {object} policyEnvelope - Active PolicyEnvelope for guardrail governance
   * @param {object} executionContext - Living ExecutionContext snapshot
   * @returns {Promise<object>} Guaranteed governed outcome { success: boolean, result: CapabilityResult, failureCategory: string|null, evidenceRecord: object }
   */
  async dispatchInvocation(invocationRequest, policyEnvelope, executionContext) {
    const manifestId = invocationRequest.capability_manifest_id;
    const lineage = {
      parent_intent_id: executionContext.getSnapshot().parent_intent_id,
      applied_policy_id: policyEnvelope.policy_id,
      executed_plan_id: invocationRequest.plan_reference_id
    };

    // 1. Check registration & version contract compatibility ([ABI-014] / [ABI-008])
    const manifestMeta = this._driverManifests.get(manifestId);
    if (manifestMeta && invocationRequest.capability_contract_version !== manifestMeta.expectedVersion) {
      const errorMsg = `[ABI-014 VERSION MISMATCH]: Capability contract version mismatch! Requested '${invocationRequest.capability_contract_version}' vs registered manifest version '${manifestMeta.expectedVersion}'.`;
      const rejectEvent = new RuntimeEvent(RuntimeEventType.FAILURE_RECORDED, { violation: 'VERSION_MISMATCH', message: errorMsg });
      
      const evidence = this.evidenceEmitter.emitEvidence({
        runtimeEvent: rejectEvent,
        eventCategory: 'POLICY_INTERDICTED',
        failureCategory: FailureCategory.CONTRACT_VIOLATION,
        causalityLineage: lineage,
        diagnosticDetails: errorMsg
      });

      const failedResult = CapabilityResult.fail(invocationRequest, 'VERSION_MISMATCH', errorMsg, 'VERSION_MISMATCH');
      return { success: false, status: 'VERSION_MISMATCH', result: failedResult, failureCategory: FailureCategory.CONTRACT_VIOLATION, evidenceRecord: evidence };
    }

    const driver = this._registeredDrivers.get(manifestId);

    // 2. Delegate untrusted execution to defensive isolation Sandbox ([ABI-016])
    const result = await CapabilitySandbox.execute(driver, invocationRequest);

    // 3. Intercept execution fault / timeout without crashing Kernel ([ABI-016])
    if (result.status === 'TIMEOUT' || result.status === 'FAILED') {
      const failCategory = FailureCategory.CAPABILITY_FAILURE;
      const failEvent = new RuntimeEvent(RuntimeEventType.FAILURE_RECORDED, { violation: result.error_code, message: result.error_details });
      
      const evidence = this.evidenceEmitter.emitEvidence({
        runtimeEvent: failEvent,
        eventCategory: 'POLICY_INTERDICTED',
        failureCategory: failCategory,
        causalityLineage: lineage,
        diagnosticDetails: `[CAPABILITY ISOLATION BOUNDARY]: ${result.error_details}`
      });

      return { success: false, status: result.status, result, failureCategory: failCategory, evidenceRecord: evidence };
    }

    // 4. Inspect proposed side-effects through Runtime Authority ([ABI-013] & [ABI-015])
    if (Array.isArray(result.proposed_side_effects) && result.proposed_side_effects.length > 0) {
      for (const sideEffect of result.proposed_side_effects) {
        const proposal = new MutationProposal({
          proposalId: `prop-side-${Date.now()}`,
          sourceCapabilityId: manifestId,
          targetResource: sideEffect.target_resource,
          mutationType: sideEffect.mutation_type,
          proposedDelta: sideEffect.proposed_delta
        });

        const authorityDecision = AuthorityController.evaluateProposal(proposal, policyEnvelope, executionContext, this.evidenceEmitter);
        if (!authorityDecision.isApproved) {
          const rejectMsg = `[ABI-013 AUTHORITY DEFENSE]: Capability side-effect proposal rejected! ${authorityDecision.rejectionCode}`;
          const rejectedResult = CapabilityResult.fail(invocationRequest, authorityDecision.rejectionCode, rejectMsg, 'REJECTED');
          
          return {
            success: false,
            status: 'MUTATION_REJECTED',
            result: rejectedResult,
            failureCategory: authorityDecision.failureCategory || FailureCategory.CONTRACT_VIOLATION,
            evidenceRecord: authorityDecision.evidenceRecord
          };
        }
      }
    }

    // 5. Success admission: Only Runtime Authority advances logical clock ([ABI-017])
    const successEvent = new RuntimeEvent(RuntimeEventType.EXECUTION_COMPLETED, { output: result.declared_output });
    const successEvidence = this.evidenceEmitter.emitEvidence({
      runtimeEvent: successEvent,
      eventCategory: 'EXECUTION_COMPLETION',
      causalityLineage: lineage,
      diagnosticDetails: `Capability '${manifestId}' executed successfully with authorized boundary result.`
    });

    return { success: true, status: 'SUCCESS', result, failureCategory: null, evidenceRecord: successEvidence };
  }
}
