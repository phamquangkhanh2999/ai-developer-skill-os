/**
 * AI Code Skin OS - Planner Authority Boundary (ESM Standard)
 * Phase 4: Execution Orchestration & Planner Governance Plane
 * Implements:
 *  - [ABI-024] Plan Authority Boundary (Planners act as untrusted proposal engines without runtime authority)
 *  - Supports dynamic planner implementation replacement without kernel code modifications (Test 3 Proof)
 */

import { GovernedExecutionPlan } from './plan_contract.js';
import { FailureCategory } from '../runtime/failure_semantics.js';

export class PlannerBoundary {
  constructor(initialPlannerDriver, contractId = 'urn:agent-boundary:planner:default-engine') {
    this.activePlanner = initialPlannerDriver;
    this.contractId = contractId;
    this.swapHistory = [];
  }

  /**
   * Replaces the active planner engine behind an invariant semantic contract without modifying microkernel code!
   */
  swapPlannerImplementation(newPlannerDriver, reason = 'Upgraded optimization heuristics') {
    if (!newPlannerDriver || typeof newPlannerDriver.proposeSteps !== 'function') {
      throw new Error('[PLANNER BOUNDARY FAULT]: Replacement planner must implement proposeSteps() proposal interface.');
    }
    const previousVersion = this.activePlanner ? this.activePlanner.version || 'v1' : 'unknown';
    this.activePlanner = newPlannerDriver;
    this.swapHistory.push({ from: previousVersion, to: newPlannerDriver.version || 'v2', reason, swapped_at: new Date().toISOString() });
    return true;
  }

  /**
   * Invokes the untrusted planner engine to formulate a computational hypothesis, returning a frozen GovernedExecutionPlan.
   * Enforces [ABI-024]: The generated plan remains purely a proposal until admitted by the Plan Validator.
   */
  async proposePlan(intent, policy, overrideParameters = {}) {
    if (!this.activePlanner || typeof this.activePlanner.proposeSteps !== 'function') {
      return {
        success: false,
        plan: null,
        errorCode: 'MISSING_PLANNER_ENGINE',
        failureCategory: FailureCategory.INTERNAL_RUNTIME_FAILURE,
        message: 'No capable planner engine registered within PlannerBoundary.'
      };
    }

    try {
      // Untrusted planner generates candidate steps
      const proposedSteps = await this.activePlanner.proposeSteps(intent, overrideParameters);
      const planId = overrideParameters.planId || `plan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      const governedPlan = new GovernedExecutionPlan({
        planId: planId,
        targetIntentId: intent.intent_id,
        policyReferenceId: policy.policy_id,
        executionTopology: overrideParameters.topology || 'acyclic_dag',
        determinismAssurance: overrideParameters.determinism || 'verifiable_reproducible',
        steps: proposedSteps
      });

      return {
        success: true,
        plan: governedPlan,
        plannerVersion: this.activePlanner.version || 'unknown',
        contractId: this.contractId
      };
    } catch (err) {
      return {
        success: false,
        plan: null,
        errorCode: 'PLANNER_GENERATION_FAULT',
        failureCategory: FailureCategory.CONTRACT_VIOLATION,
        message: `[ABI-024 DEFENSE]: Untrusted planner threw exception during hypothesis proposal: ${err.message}`
      };
    }
  }
}
