/**
 * AI Code Skin OS - Governed Runtime Event Model (HARDENING-013)
 * Implements intermediate active nervous system events before legal evidence committals:
 * "Event is the living stream; Evidence is the legal footprint."
 */

export const RuntimeEventType = Object.freeze({
  INTENT_PUBLISHED: 'IntentPublished',
  POLICY_EVALUATED: 'PolicyEvaluated',
  CONTEXT_INITIALIZED: 'ContextInitialized',
  PLAN_ACCEPTED: 'PlanAccepted',
  MUTATION_REQUESTED: 'MutationRequested',
  MUTATION_REJECTED: 'MutationRejected',
  EXECUTION_COMPLETED: 'ExecutionCompleted',
  FAILURE_RECORDED: 'FailureRecorded'
});

export class RuntimeEvent {
  /**
   * Represents an active operational pulse occurring within the runtime boundary.
   * @param {string} eventType - RuntimeEventType constant
   * @param {object} payload - Target operational delta or contract snapshot
   * @param {object} causalityPointers - Optional causality reference IDs
   */
  constructor(eventType, payload = {}, causalityPointers = {}) {
    if (!Object.values(RuntimeEventType).includes(eventType)) {
      throw new Error(`[EVENT GOVERNANCE ERROR]: Undeclared runtime event type '${eventType}'.`);
    }
    this.eventType = eventType;
    this.payload = payload;
    this.causalityPointers = causalityPointers;
    this.emittedAt = new Date().toISOString();
    Object.freeze(this);
  }

  /**
   * Converts the live event pulse into an EvidenceRecord submission template.
   */
  toEvidenceTemplate() {
    let category = 'POLICY_AUTHORIZATION';
    if (this.eventType === RuntimeEventType.EXECUTION_COMPLETED) {
      category = 'EXECUTION_COMPLETION';
    } else if (this.eventType === RuntimeEventType.MUTATION_REJECTED) {
      category = 'MUTATION_REJECTED';
    } else if (this.eventType === RuntimeEventType.FAILURE_RECORDED) {
      category = 'POLICY_INTERDICTED';
    } else if (this.eventType === RuntimeEventType.PLAN_ACCEPTED || this.eventType === RuntimeEventType.MUTATION_REQUESTED) {
      category = 'CAPABILITY_INVOCATION';
    }

    return {
      eventCategory: category,
      runtimeEventType: this.eventType,
      diagnosticDetails: typeof this.payload.message === 'string' ? this.payload.message : `Live Event Pulse: ${this.eventType}`,
      rawPayload: this.payload
    };
  }
}
