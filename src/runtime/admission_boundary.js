/**
 * AI Code Skin OS - Governed Runtime Admission Boundary (ESM Standard)
 * Implements Level 1 Schema Conformance & Constitutional Invariant checks:
 *  - [ABI-001] Intent Immutability
 *  - [ABI-007] Strict vs. Forward-Compatible Unknown Field Policy
 *  - [ABI-008] Canonical Contract Identity Binding
 */

const KERNEL_CORE_OBJECT_SCHEMAS = {
  'urn:agent-boundary:contract:intent-record': [
    'intent_id', 'business_outcome', 'scope', 'target_environment', 'priority', 'contract_version',
    'contract_id', 'schema_version', 'created_at'
  ],
  'urn:agent-boundary:contract:policy-envelope': [
    'policy_id', 'parent_intent_id', 'cost_tier', 'resource_allowance', 'safety_guardrails', 'escalation_path',
    'contract_id', 'contract_version', 'schema_version', 'created_at'
  ],
  'urn:agent-boundary:contract:execution-plan': [
    'plan_id', 'target_intent_id', 'policy_reference_id', 'reproducibility_hash', 'steps', 'fallback_strategy',
    'contract_id', 'contract_version', 'schema_version', 'created_at'
  ],
  'urn:agent-boundary:contract:evidence-record': [
    'evidence_id', 'sequence_number', 'timestamp', 'event_category', 'causality_lineage', 'contract_reference',
    'telemetry_reference_id', 'profile_reference_id', 'artifact_digests', 'diagnostic_details',
    'contract_id', 'contract_version', 'schema_version', 'created_at'
  ]
};

export class AdmissionRejectionError extends Error {
  constructor(message, invariantCode) {
    super(`[ADMISSION REJECTION - ${invariantCode}]: ${message}`);
    this.invariantCode = invariantCode;
    this.name = 'AdmissionRejectionError';
  }
}

export function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

export function admitContractObject(payload, isKernelObject = true) {
  if (!payload || typeof payload !== 'object') {
    throw new AdmissionRejectionError('Payload must be a valid structured object.', 'SCHEMA_L1_INVALID_TYPE');
  }

  if (!payload.contract_id || !payload.contract_version || !payload.schema_version || !payload.created_at) {
    throw new AdmissionRejectionError(
      'Missing mandatory canonical contract identity metadata (contract_id, contract_version, schema_version, created_at).',
      'ABI-008'
    );
  }

  if (isKernelObject) {
    const allowedFields = KERNEL_CORE_OBJECT_SCHEMAS[payload.contract_id];
    if (!allowedFields) {
      throw new AdmissionRejectionError(`Unknown Kernel Contract Identity: ${payload.contract_id}`, 'ABI-007');
    }

    const payloadFields = Object.keys(payload);
    for (const field of payloadFields) {
      if (!allowedFields.includes(field)) {
        throw new AdmissionRejectionError(
          `Strict Boundary Rejection: Undeclared property '${field}' detected in kernel core contract '${payload.contract_id}'.`,
          'ABI-007_STRICT_REJECT'
        );
      }
    }
  }

  const admittedClone = JSON.parse(JSON.stringify(payload));
  return deepFreeze(admittedClone);
}
