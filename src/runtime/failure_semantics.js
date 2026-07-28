/**
 * AI Code Skin OS - Governed Runtime Failure Semantics
 * Implements granular FailureCategory taxonomies to prevent FAILED_WITH_EVIDENCE
 * from becoming an unorganized error bucket.
 */

export const FailureCategory = Object.freeze({
  POLICY_DENIED: 'POLICY_DENIED',                     // Valid policy explicitly rejects action
  RESOURCE_EXHAUSTED: 'RESOURCE_EXHAUSTED',           // Budget allowances depleted (tokens, tool calls)
  CONTRACT_VIOLATION: 'CONTRACT_VIOLATION',           // Invariant boundary breach (schema L1, immutability)
  CAPABILITY_FAILURE: 'CAPABILITY_FAILURE',           // Exception generated within third-party driver sandbox
  INTERNAL_RUNTIME_FAILURE: 'INTERNAL_RUNTIME_FAILURE', // Corruption or unexpected state transition within Kernel Core
  UNKNOWN: 'UNKNOWN'                                  // Unclassified external exception
});

export class RuntimeFailure {
  constructor(category, code, diagnosticDetails) {
    if (!FailureCategory[category]) {
      throw new Error(`[KERNEL INTEGRITY FAULT]: Invalid failure category '${category}'. Must be a ratified FailureCategory.`);
    }
    this.category = category;
    this.code = code;
    this.diagnosticDetails = diagnosticDetails;
    this.timestamp = new Date().toISOString();
    Object.freeze(this);
  }

  static fromPolicyViolation(code, diagnosticDetails) {
    const isResource = code.includes('BUDGET_EXHAUSTION') || code.includes('RESOURCE');
    const category = isResource ? FailureCategory.RESOURCE_EXHAUSTED : FailureCategory.POLICY_DENIED;
    return new RuntimeFailure(category, code, diagnosticDetails);
  }

  static fromContractViolation(code, diagnosticDetails) {
    return new RuntimeFailure(FailureCategory.CONTRACT_VIOLATION, code, diagnosticDetails);
  }
}
