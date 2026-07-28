/**
 * AI Code Skin OS - Governed Execution Scheduler (ESM Standard)
 * Phase 4: Execution Orchestration & Planner Governance Plane
 * Implements:
 *  - Test 4: Execution order preserved strictly according to dependency DAG topology
 *  - [ABI-027] Scheduler Resource Compliance (per-step runtime allowance validation)
 */

import { PlanValidator } from './plan_validator.js';
import { FailureCategory } from '../runtime/failure_semantics.js';
import { RuntimeState } from '../runtime/state_machine.js';

export class ExecutionScheduler {
  constructor(kernelRuntime) {
    this.kernel = kernelRuntime;
    this.executionTrace = [];
  }

  /**
   * Orchestrates the execution of a validated execution plan, enforcing dependency order and resource budgets.
   * @param {object} intent - Target IntentRecord
   * @param {object} policy - Active PolicyEnvelope
   * @param {object} plan - Target GovernedExecutionPlan
   * @returns {object} { status: string, final_state: string, execution_trace: Array, capability_results: Array, error_code: string|null }
   */
  async scheduleAndExecute(intent, policy, plan) {
    // 1. Authoritative Plan Validation Gate
    const valResult = PlanValidator.validatePlan(plan);
    if (!valResult.isAdmitted) {
      return {
        status: valResult.errorCode || 'PLAN_REJECTED',
        final_state: RuntimeState.FAILED_WITH_EVIDENCE,
        execution_trace: [],
        capability_results: [],
        error_code: valResult.errorCode,
        failure_category: valResult.failureCategory || FailureCategory.CONTRACT_VIOLATION,
        diagnostic: valResult.diagnosticMessage
      };
    }

    const orderedSteps = valResult.orderedSteps;
    const capabilityResults = [];
    const stepExecutionOrder = [];

    // Calculate initial budget allowances
    let remainingCalls = policy.resource_allowance ? (policy.resource_allowance.tool_call_budget || 100) : 100;

    for (const step of orderedSteps) {
      // 2. Enforce [ABI-027] Scheduler Resource Compliance
      if (remainingCalls <= 0) {
        return {
          status: 'RESOURCE_EXHAUSTED',
          final_state: RuntimeState.FAILED_WITH_EVIDENCE,
          execution_trace: stepExecutionOrder,
          capability_results: capabilityResults,
          error_code: 'ABI-027_STEP_RESOURCE_EXHAUSTED',
          failure_category: FailureCategory.RESOURCE_EXHAUSTED,
          diagnostic: `[ABI-027 VIOLATION]: Residual tool call allowance exhausted before scheduling step '${step.step_id}'.`
        };
      }

      // Decrement step budget allowance
      remainingCalls -= 1;
      stepExecutionOrder.push(step.step_id);

      // Dispatch via existing Kernel CapabilityBoundaryBridge to maintain isolation & authority!
      if (this.kernel && typeof this.kernel.executeBridgedPlan === 'function') {
        const stepPlanSlice = {
          plan_id: `${plan.plan_id}-slice-${step.step_id}`,
          target_intent_id: intent.intent_id,
          policy_reference_id: policy.policy_id,
          steps: [step]
        };

        const res = await this.kernel.executeBridgedPlan(intent, policy, stepPlanSlice);
        if (res.capability_results && res.capability_results.length > 0) {
          capabilityResults.push(res.capability_results[0]);
        }

        if (res.status !== 'SUCCESS') {
          return {
            status: res.status,
            final_state: res.final_state,
            execution_trace: stepExecutionOrder,
            capability_results: capabilityResults,
            error_code: res.diagnostics ? res.diagnostics[0] : 'STEP_EXECUTION_FAULT',
            failure_category: res.failure_category,
            diagnostic: `Step '${step.step_id}' aborted during execution.`
          };
        }
      } else {
        // Simulated direct scheduling for unit tests lacking Kernel attachment
        capabilityResults.push({
          step_id: step.step_id,
          status: 'SUCCESS',
          declared_output: { execution_sequence: stepExecutionOrder.length }
        });
      }
    }

    return {
      status: 'SUCCESS',
      final_state: RuntimeState.ARCHIVED,
      execution_trace: stepExecutionOrder,
      capability_results: capabilityResults,
      error_code: null,
      failure_category: null,
      diagnostic: `Plan executed cleanly. Order preserved: [${stepExecutionOrder.join(' ➔ ')}]`
    };
  }
}
