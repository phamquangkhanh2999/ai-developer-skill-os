/**
 * AI Code Skin OS - Governed Execution Context Container (ESM Standard)
 * Implements Coroutine living state isolation and constitutional checks:
 *  - [ABI-005] Clean Execution State Segregation
 *  - [ABI-010] Boundary Isolation
 *  - [ABI-012] No Hidden State
 */

import { RuntimeState, transition, InvariantViolationError } from './state_machine.js';

const FORBIDDEN_GOD_OBJECT_KEYS = new Set([
  'tokens_consumed',
  'reasoning_tokens',
  'tool_calls_count',
  'duration_ms',
  'memory_dump',
  'telemetry_trace',
  'cpu_utilization'
]);

export class ExecutionContext {
  constructor(executionId, parentIntentId, policyReferenceId) {
    if (!executionId || !parentIntentId || !policyReferenceId) {
      throw new Error('ExecutionContext requires executionId, parentIntentId, and policyReferenceId.');
    }

    this._state = {
      execution_id: executionId,
      correlation_id: `corr-${executionId}`,
      parent_intent_id: parentIntentId,
      policy_reference_id: policyReferenceId,
      fsm_state: RuntimeState.INITIALIZED,
      active_plan_id: null,
      working_variables: {},
      created_at: new Date().toISOString()
    };
  }

  get fsmState() {
    return this._state.fsm_state;
  }

  getSnapshot() {
    return JSON.parse(JSON.stringify(this._state));
  }

  executeStateTransition(event, evidenceReference) {
    this._state.fsm_state = transition(this._state.fsm_state, event, evidenceReference);
    return this._state.fsm_state;
  }

  introduceExecutionPlan(planId) {
    if (this._state.fsm_state !== RuntimeState.RUNNING) {
      throw new InvariantViolationError(
        'Can only introduce ExecutionPlan while FSM is in RUNNING status.',
        'LIFECYCLE_PROGRESSION_ERROR'
      );
    }
    this._state.active_plan_id = planId;
  }

  setWorkingVariable(key, value) {
    if (this._state.fsm_state === RuntimeState.COMPLETED || this._state.fsm_state === RuntimeState.ARCHIVED || this._state.fsm_state === RuntimeState.FAILED_WITH_EVIDENCE) {
      throw new InvariantViolationError(
        `Cannot mutate working variables in terminal FSM state: ${this._state.fsm_state}`,
        'MUTATION_OF_TERMINAL_CONTEXT_FORBIDDEN'
      );
    }

    if (FORBIDDEN_GOD_OBJECT_KEYS.has(key) || key.startsWith('telemetry_') || key.startsWith('metric_')) {
      throw new InvariantViolationError(
        `[ABI-005 VIOLATION]: ExecutionContext cannot store telemetry or resource tracking metric '${key}'. Route metrics to ExecutionTelemetry!`,
        'ABI-005_GOD_OBJECT_PREVENTION'
      );
    }

    this._state.working_variables[key] = value;
  }
}
