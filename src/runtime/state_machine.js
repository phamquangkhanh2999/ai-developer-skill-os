/**
 * AI Code Skin OS - Governed Runtime State Machine (ESM Standard)
 * Implements deterministic transition rules: (current_state, event, invariant_check) ➔ next_state
 * Complies with Invariants:
 *  - [ABI-006] Failure as a Valid State Transition
 *  - [ABI-011] Decision Traceability (every transition mandates an evidence reference)
 */

export const RuntimeState = Object.freeze({
  INITIALIZED: 'INITIALIZED',
  RUNNING: 'RUNNING',
  SUSPENDED: 'SUSPENDED',
  COMPLETED: 'COMPLETED',
  FAILED_WITH_EVIDENCE: 'FAILED_WITH_EVIDENCE',
  ARCHIVED: 'ARCHIVED'
});

export const RuntimeEvent = Object.freeze({
  START_EXECUTION: 'START_EXECUTION',
  SUSPEND_FOR_AUTHORIZATION: 'SUSPEND_FOR_AUTHORIZATION',
  RESUME_EXECUTION: 'RESUME_EXECUTION',
  COMPLETE_EXECUTION: 'COMPLETE_EXECUTION',
  FAIL_WITH_INTERDICTION: 'FAIL_WITH_INTERDICTION',
  ARCHIVE_SESSION: 'ARCHIVE_SESSION'
});

/**
 * Deterministic State Transition Map
 */
const ALLOWED_TRANSITIONS = Object.freeze({
  [RuntimeState.INITIALIZED]: {
    [RuntimeEvent.START_EXECUTION]: RuntimeState.RUNNING,
    [RuntimeEvent.FAIL_WITH_INTERDICTION]: RuntimeState.FAILED_WITH_EVIDENCE
  },
  [RuntimeState.RUNNING]: {
    [RuntimeEvent.SUSPEND_FOR_AUTHORIZATION]: RuntimeState.SUSPENDED,
    [RuntimeEvent.COMPLETE_EXECUTION]: RuntimeState.COMPLETED,
    [RuntimeEvent.FAIL_WITH_INTERDICTION]: RuntimeState.FAILED_WITH_EVIDENCE
  },
  [RuntimeState.SUSPENDED]: {
    [RuntimeEvent.RESUME_EXECUTION]: RuntimeState.RUNNING,
    [RuntimeEvent.FAIL_WITH_INTERDICTION]: RuntimeState.FAILED_WITH_EVIDENCE
  },
  [RuntimeState.COMPLETED]: {
    [RuntimeEvent.ARCHIVE_SESSION]: RuntimeState.ARCHIVED
  },
  [RuntimeState.FAILED_WITH_EVIDENCE]: {
    [RuntimeEvent.ARCHIVE_SESSION]: RuntimeState.ARCHIVED
  },
  [RuntimeState.ARCHIVED]: {}
});

export class InvariantViolationError extends Error {
  constructor(message, code) {
    super(`[INVARIANT VIOLATION - ${code}]: ${message}`);
    this.code = code;
    this.name = 'InvariantViolationError';
  }
}

/**
 * Executes a deterministic state transition.
 */
export function transition(currentState, event, evidenceReference) {
  if (!evidenceReference || !evidenceReference.evidence_id || !evidenceReference.causality_lineage) {
    throw new InvariantViolationError(
      `State transition from ${currentState} via ${event} failed: Missing valid EvidenceRecord reference.`,
      'ABI-011'
    );
  }

  const stateTransitions = ALLOWED_TRANSITIONS[currentState];
  if (!stateTransitions) {
    throw new InvariantViolationError(`Unknown current runtime state: ${currentState}`, 'STATE_MACHINE_CORRUPTION');
  }

  const nextState = stateTransitions[event];
  if (!nextState) {
    throw new InvariantViolationError(
      `Illegal FSM transition attempt: State '${currentState}' cannot accept event '${event}'.`,
      'STATE_TRANSCENDENCE_FORBIDDEN'
    );
  }

  return nextState;
}
