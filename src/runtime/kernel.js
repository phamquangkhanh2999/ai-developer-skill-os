/**
 * AI Code Skin OS - Governed Kernel Runtime Core (ESM Standard)
 * Phase 2.3: Capability Boundary Bridge & Extension Execution Engine
 * Implements:
 *  - Failure Semantics: Granular FailureCategory tag on all failures
 *  - HARDENING-013 to 017: Lamport Logical Clocks, Event models, Replay guarantees
 *  - Capability Boundary Bridge integration for safe extension hosting
 */

import { admitContractObject, deepFreeze } from './admission_boundary.js';
import { evaluateExecutionPolicy } from './policy_boundary.js';
import { ExecutionContext } from './execution_context.js';
import { EvidenceEmitter } from './evidence_emitter.js';
import { AuthorityController, MutationProposal } from './authority_boundary.js';
import { RuntimeEvent as FSMEvent, RuntimeState } from './state_machine.js';
import { FailureCategory } from './failure_semantics.js';
import { RuntimeEvent, RuntimeEventType } from './runtime_events.js';
import { CapabilityInvocationRequest } from './invocation_contract.js';
import { CapabilityBoundaryBridge } from './capability_bridge.js';

export class ExecutionResult {
  constructor({ status, finalState, evidenceReference, causalityLineage, diagnostics = null, failureCategory = null, invocationRequests = [], capabilityResults = [] }) {
    this.status = status;
    this.final_state = finalState;
    this.evidence_reference = evidenceReference;
    this.causality_lineage = causalityLineage;
    this.diagnostics = diagnostics;
    this.failure_category = failureCategory;
    this.invocation_requests = invocationRequests;
    this.capability_results = capabilityResults;
    Object.freeze(this);
  }
}

export class KernelRuntime {
  constructor(initialTick = 1000) {
    this.evidenceEmitter = new EvidenceEmitter('audit-stream-kernel', initialTick);
    this.capabilityBridge = new CapabilityBoundaryBridge(this.evidenceEmitter);
    this._activeSessions = new Map();
  }

  get auditHistory() {
    return this.evidenceEmitter.streamHistory;
  }

  registerDriver(manifestId, driverInstance, expectedVersion = '1.0.0') {
    this.capabilityBridge.registerDriver(manifestId, driverInstance, expectedVersion);
  }

  executeLifecycle(rawIntent, rawPolicy, rawPlan = null) {
    const admittedIntent = admitContractObject(rawIntent, true);
    const admittedPolicy = admitContractObject(rawPolicy, true);

    const sessionId = `sess-${Date.now()}`;
    let lineage = {
      parent_intent_id: admittedIntent.intent_id,
      applied_policy_id: admittedPolicy.policy_id
    };

    const intentEvent = new RuntimeEvent(RuntimeEventType.INTENT_PUBLISHED, { intent_id: admittedIntent.intent_id });
    const policyEvent = new RuntimeEvent(RuntimeEventType.POLICY_EVALUATED, { policy_id: admittedPolicy.policy_id });
    
    const initEvidence = this.evidenceEmitter.emitEvidence({
      runtimeEvent: policyEvent,
      eventCategory: 'POLICY_AUTHORIZATION',
      causalityLineage: lineage,
      diagnosticDetails: 'Kernel initialized Coroutine session with admitted Intent and Policy contracts.'
    });

    const context = new ExecutionContext(sessionId, admittedIntent.intent_id, admittedPolicy.policy_id);
    this._activeSessions.set(sessionId, { context, policy: admittedPolicy, intent: admittedIntent });

    const initContextEvent = new RuntimeEvent(RuntimeEventType.CONTEXT_INITIALIZED, { session_id: sessionId });
    const startEvidence = this.evidenceEmitter.emitEvidence({
      runtimeEvent: initContextEvent,
      eventCategory: 'CAPABILITY_INVOCATION',
      causalityLineage: lineage,
      diagnosticDetails: 'State transitioning from INITIALIZED to RUNNING.'
    });
    context.executeStateTransition(FSMEvent.START_EXECUTION, startEvidence);

    const invocationRequests = [];
    if (rawPlan) {
      const admittedPlan = admitContractObject(rawPlan, true);
      context.introduceExecutionPlan(admittedPlan.plan_id);
      
      lineage = {
        ...lineage,
        executed_plan_id: admittedPlan.plan_id
      };

      const planEvent = new RuntimeEvent(RuntimeEventType.PLAN_ACCEPTED, { plan_id: admittedPlan.plan_id });
      this.evidenceEmitter.emitEvidence({
        runtimeEvent: planEvent,
        eventCategory: 'CAPABILITY_INVOCATION',
        causalityLineage: lineage,
        diagnosticDetails: `Execution Plan ${admittedPlan.plan_id} accepted into active coroutine.`
      });

      if (Array.isArray(admittedPlan.steps)) {
        admittedPlan.steps.forEach((stepConfig, index) => {
          const invocationReq = CapabilityInvocationRequest.fromPlanStep(admittedPlan.plan_id, index, stepConfig, sessionId);
          invocationRequests.push(invocationReq);
        });
      }
    }

    const completionEvent = new RuntimeEvent(RuntimeEventType.EXECUTION_COMPLETED, { status: 'SUCCESS' });
    const completionEvidence = this.evidenceEmitter.emitEvidence({
      runtimeEvent: completionEvent,
      eventCategory: 'EXECUTION_COMPLETION',
      causalityLineage: lineage,
      diagnosticDetails: 'Coroutine execution completed normally. Zero side-effects emitted.'
    });
    context.executeStateTransition(FSMEvent.COMPLETE_EXECUTION, completionEvidence);
    context.executeStateTransition(FSMEvent.ARCHIVE_SESSION, completionEvidence);
    this._activeSessions.delete(sessionId);

    return new ExecutionResult({
      status: 'SUCCESS',
      finalState: context.fsmState,
      evidenceReference: completionEvidence,
      causalityLineage: lineage,
      diagnostics: 'Empty execution lifecycle proven successfully.',
      invocationRequests
    });
  }

  /**
   * Asynchronously executes an admitted execution plan by routing steps across the Capability Boundary Bridge.
   * Proves that the runtime can safely host an untrusted extension without surrendering authority!
   */
  async executeBridgedPlan(rawIntent, rawPolicy, rawPlan) {
    const admittedIntent = admitContractObject(rawIntent, true);
    const admittedPolicy = admitContractObject(rawPolicy, true);
    const admittedPlan = admitContractObject(rawPlan, true);

    const sessionId = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const lineage = {
      parent_intent_id: admittedIntent.intent_id,
      applied_policy_id: admittedPolicy.policy_id,
      executed_plan_id: admittedPlan.plan_id
    };

    const initEvent = new RuntimeEvent(RuntimeEventType.CONTEXT_INITIALIZED, { message: 'Bridged Execution Starting' });
    const initEvidence = this.evidenceEmitter.emitEvidence({
      runtimeEvent: initEvent,
      eventCategory: 'POLICY_AUTHORIZATION',
      causalityLineage: lineage
    });

    const context = new ExecutionContext(sessionId, admittedIntent.intent_id, admittedPolicy.policy_id);
    this._activeSessions.set(sessionId, { context, policy: admittedPolicy, intent: admittedIntent });
    context.executeStateTransition(FSMEvent.START_EXECUTION, initEvidence);
    context.introduceExecutionPlan(admittedPlan.plan_id);

    const capabilityResults = [];
    const invocationRequests = [];

    for (let i = 0; i < (admittedPlan.steps || []).length; i++) {
      const stepConfig = admittedPlan.steps[i];
      const invocationReq = CapabilityInvocationRequest.fromPlanStep(admittedPlan.plan_id, i, stepConfig, sessionId);
      invocationRequests.push(invocationReq);

      const bridgeOutcome = await this.capabilityBridge.dispatchInvocation(invocationReq, admittedPolicy, context);
      if (bridgeOutcome.result) {
        capabilityResults.push(bridgeOutcome.result);
      }

      if (!bridgeOutcome.success) {
        // [ABI-016 / ABI-013]: Authoritative Failure Transition
        context.executeStateTransition(FSMEvent.FAIL_WITH_INTERDICTION, bridgeOutcome.evidenceRecord);
        this._activeSessions.delete(sessionId);
        
        return new ExecutionResult({
          status: bridgeOutcome.status,
          finalState: context.fsmState,
          evidenceReference: bridgeOutcome.evidenceRecord,
          causalityLineage: lineage,
          diagnostics: bridgeOutcome.result.error_details || `Capability step ${i} interdiction: ${bridgeOutcome.status}`,
          failureCategory: bridgeOutcome.failureCategory || FailureCategory.CAPABILITY_FAILURE,
          invocationRequests,
          capabilityResults
        });
      }
    }

    const completeEvent = new RuntimeEvent(RuntimeEventType.EXECUTION_COMPLETED, { steps_executed: invocationRequests.length });
    const completeEvidence = this.evidenceEmitter.emitEvidence({
      runtimeEvent: completeEvent,
      eventCategory: 'EXECUTION_COMPLETION',
      causalityLineage: lineage,
      diagnosticDetails: 'All capability invocations completed under runtime governance.'
    });

    context.executeStateTransition(FSMEvent.COMPLETE_EXECUTION, completeEvidence);
    context.executeStateTransition(FSMEvent.ARCHIVE_SESSION, completeEvidence);
    this._activeSessions.delete(sessionId);

    return new ExecutionResult({
      status: 'SUCCESS',
      finalState: context.fsmState,
      evidenceReference: completeEvidence,
      causalityLineage: lineage,
      diagnostics: 'Bridged plan executed successfully.',
      invocationRequests,
      capabilityResults
    });
  }

  executeWithPolicyCheck(rawIntent, rawPolicy, simulatedConsumption = {}, mutationRequest = null) {
    const admittedIntent = admitContractObject(rawIntent, true);
    const admittedPolicy = admitContractObject(rawPolicy, true);

    const sessionId = `sess-${Date.now()}`;
    const lineage = {
      parent_intent_id: admittedIntent.intent_id,
      applied_policy_id: admittedPolicy.policy_id
    };

    const initEvent = new RuntimeEvent(RuntimeEventType.POLICY_EVALUATED, { message: 'Checking resource budgets & safety guardrails' });
    const initEvidence = this.evidenceEmitter.emitEvidence({
      runtimeEvent: initEvent,
      eventCategory: 'POLICY_AUTHORIZATION',
      causalityLineage: lineage
    });
    
    const context = new ExecutionContext(sessionId, admittedIntent.intent_id, admittedPolicy.policy_id);
    context.executeStateTransition(FSMEvent.START_EXECUTION, initEvidence);

    const evalResult = evaluateExecutionPolicy(admittedPolicy, simulatedConsumption, mutationRequest);
    if (!evalResult.isApproved) {
      const isResourceExhausted = evalResult.violationCode && (evalResult.violationCode.includes('BUDGET') || evalResult.violationCode.includes('EXHAUSTION'));
      const failCategory = isResourceExhausted ? FailureCategory.RESOURCE_EXHAUSTED : FailureCategory.POLICY_DENIED;

      const failEvent = new RuntimeEvent(RuntimeEventType.FAILURE_RECORDED, { violation: evalResult.violationCode, message: evalResult.diagnosticMessage });
      const failEvidence = this.evidenceEmitter.emitEvidence({
        runtimeEvent: failEvent,
        eventCategory: 'POLICY_INTERDICTED',
        failureCategory: failCategory,
        causalityLineage: lineage,
        diagnosticDetails: `[POLICY INTERDICTION - ${evalResult.violationCode}]: ${evalResult.diagnosticMessage}`
      });

      context.executeStateTransition(FSMEvent.FAIL_WITH_INTERDICTION, failEvidence);
      
      return new ExecutionResult({
        status: 'POLICY_BLOCKED',
        finalState: context.fsmState,
        evidenceReference: failEvidence,
        causalityLineage: lineage,
        diagnostics: evalResult.diagnosticMessage,
        failureCategory: failCategory
      });
    }

    const passEvent = new RuntimeEvent(RuntimeEventType.EXECUTION_COMPLETED, { status: 'POLICY_VERIFIED' });
    const passEvidence = this.evidenceEmitter.emitEvidence({
      runtimeEvent: passEvent,
      eventCategory: 'EXECUTION_COMPLETION',
      causalityLineage: lineage,
      diagnosticDetails: 'Policy evaluation passed.'
    });
    context.executeStateTransition(FSMEvent.COMPLETE_EXECUTION, passEvidence);
    return new ExecutionResult({ status: 'SUCCESS', finalState: context.fsmState, evidenceReference: passEvidence, causalityLineage: lineage });
  }

  processMutationProposal(rawIntent, rawPolicy, proposalConfig) {
    const admittedIntent = admitContractObject(rawIntent, true);
    const admittedPolicy = admitContractObject(rawPolicy, true);

    const sessionId = `sess-${Date.now()}`;
    const lineage = {
      parent_intent_id: admittedIntent.intent_id,
      applied_policy_id: admittedPolicy.policy_id
    };

    const initEvent = new RuntimeEvent(RuntimeEventType.CONTEXT_INITIALIZED, { message: 'Evaluating Mutation Proposal' });
    const initEvidence = this.evidenceEmitter.emitEvidence({
      runtimeEvent: initEvent,
      eventCategory: 'POLICY_AUTHORIZATION',
      causalityLineage: lineage
    });
    const context = new ExecutionContext(sessionId, admittedIntent.intent_id, admittedPolicy.policy_id);
    context.executeStateTransition(FSMEvent.START_EXECUTION, initEvidence);

    const proposal = new MutationProposal(proposalConfig);
    const authorityDecision = AuthorityController.evaluateProposal(proposal, admittedPolicy, context, this.evidenceEmitter);

    if (!authorityDecision.isApproved) {
      context.executeStateTransition(FSMEvent.FAIL_WITH_INTERDICTION, authorityDecision.evidenceRecord);
      
      return new ExecutionResult({
        status: 'MUTATION_REJECTED',
        finalState: context.fsmState,
        evidenceReference: authorityDecision.evidenceRecord,
        causalityLineage: lineage,
        diagnostics: `Mutation Proposal Rejected: ${authorityDecision.rejectionCode}`,
        failureCategory: authorityDecision.failureCategory || FailureCategory.CONTRACT_VIOLATION
      });
    }

    return new ExecutionResult({ status: 'MUTATION_APPROVED', finalState: context.fsmState, evidenceReference: authorityDecision.evidenceRecord, causalityLineage: lineage });
  }
}
