/**
 * AI Code Skin OS - Governed Authority Boundary (ESM Standard)
 * Implements authoritative runtime governance over proposals:
 *  - [ABI-009] Runtime Authority Boundary & Creator != Authority
 *  - HARDENING-013: Runtime Event Stream (MutationRequested, MutationRejected)
 *  - Failure Semantics: Explicit FailureCategory assignment
 */

import { evaluateExecutionPolicy, PolicyEvaluationResult } from './policy_boundary.js';
import { FailureCategory } from './failure_semantics.js';
import { RuntimeEvent, RuntimeEventType } from './runtime_events.js';

export class MutationProposal {
  constructor({ proposalId, sourceCapabilityId, targetResource, mutationType, proposedDelta }) {
    this.proposalId = proposalId;
    this.sourceCapabilityId = sourceCapabilityId;
    this.targetResource = targetResource;
    this.mutationType = mutationType;
    this.proposedDelta = proposedDelta;
    Object.freeze(this);
  }
}

export class AuthorityDecision {
  constructor(isApproved, rejectionCode = null, evidenceRecord = null, failureCategory = null) {
    this.isApproved = isApproved;
    this.rejectionCode = rejectionCode;
    this.evidenceRecord = evidenceRecord;
    this.failureCategory = failureCategory;
    Object.freeze(this);
  }

  static approve(evidenceRecord) {
    return new AuthorityDecision(true, null, evidenceRecord);
  }

  static reject(rejectionCode, evidenceRecord, failureCategory) {
    return new AuthorityDecision(false, rejectionCode, evidenceRecord, failureCategory);
  }
}

export class AuthorityController {
  static evaluateProposal(proposal, policyEnvelope, executionContext, evidenceEmitter) {
    const lineage = {
      parent_intent_id: executionContext.getSnapshot().parent_intent_id,
      applied_policy_id: policyEnvelope.policy_id
    };

    // Emit live event pulse: MutationRequested
    const requestEvent = new RuntimeEvent(RuntimeEventType.MUTATION_REQUESTED, { proposal });

    if (proposal.targetResource === 'FROZEN_INTENT' || proposal.mutationType === 'MODIFY_INTENT') {
      const rejectEvent = new RuntimeEvent(RuntimeEventType.MUTATION_REJECTED, { reason: '[ABI-001 VIOLATION]: Intent is immutable' });
      const evidence = evidenceEmitter.emitEvidence({
        runtimeEvent: rejectEvent,
        eventCategory: 'MUTATION_REJECTED',
        failureCategory: FailureCategory.CONTRACT_VIOLATION,
        causalityLineage: lineage,
        diagnosticDetails: `[ABI-001 VIOLATION]: Capability '${proposal.sourceCapabilityId}' attempted illegal mutation upon frozen IntentRecord. Proposal rejected by Runtime Authority.`
      });
      return AuthorityDecision.reject('ABI-001_INTENT_MUTATION_FORBIDDEN', evidence, FailureCategory.CONTRACT_VIOLATION);
    }

    if (proposal.targetResource === 'FROZEN_POLICY' || proposal.mutationType === 'RELAX_POLICY') {
      const rejectEvent = new RuntimeEvent(RuntimeEventType.MUTATION_REJECTED, { reason: '[ABI-002 VIOLATION]: Policy relaxation forbidden' });
      const evidence = evidenceEmitter.emitEvidence({
        runtimeEvent: rejectEvent,
        eventCategory: 'MUTATION_REJECTED',
        failureCategory: FailureCategory.CONTRACT_VIOLATION,
        causalityLineage: lineage,
        diagnosticDetails: `[ABI-002 VIOLATION]: Capability '${proposal.sourceCapabilityId}' attempted autonomous policy relaxation. Proposal rejected by Runtime Authority.`
      });
      return AuthorityDecision.reject('ABI-002_POLICY_RELAXATION_FORBIDDEN', evidence, FailureCategory.CONTRACT_VIOLATION);
    }

    if (proposal.mutationType === 'WRITE_FILE' || proposal.mutationType === 'WRITE') {
      const policyEvaluation = evaluateExecutionPolicy(policyEnvelope, {}, { type: 'WRITE', target_path: proposal.targetResource });
      
      if (!policyEvaluation.isApproved) {
        const rejectEvent = new RuntimeEvent(RuntimeEventType.MUTATION_REJECTED, { reason: policyEvaluation.diagnosticMessage });
        const evidence = evidenceEmitter.emitEvidence({
          runtimeEvent: rejectEvent,
          eventCategory: 'POLICY_INTERDICTED',
          failureCategory: FailureCategory.POLICY_DENIED,
          causalityLineage: lineage,
          diagnosticDetails: `[POLICY GUARDRAIL INTERDICTION]: Mutation proposal rejected. ${policyEvaluation.diagnosticMessage}`
        });
        return AuthorityDecision.reject(policyEvaluation.violationCode, evidence, FailureCategory.POLICY_DENIED);
      }
    }

    const approvalEvidence = evidenceEmitter.emitEvidence({
      runtimeEvent: requestEvent,
      eventCategory: 'POLICY_AUTHORIZATION',
      causalityLineage: lineage,
      diagnosticDetails: `Mutation proposal '${proposal.proposalId}' authorized by Runtime Authority.`
    });
    return AuthorityDecision.approve(approvalEvidence);
  }
}
