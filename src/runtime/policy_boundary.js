/**
 * AI Code Skin OS - Governed Policy Evaluation Boundary (ESM Standard)
 * Implements authoritative budget evaluation and guardrail interdiction:
 *  - [ABI-002] Monotonic Policy Strictness
 *  - [ABI-006] Failure Contract Readiness
 */

export const CostTier = Object.freeze({
  INSTANT: 'INSTANT',
  TARGETED: 'TARGETED',
  DEEP: 'DEEP'
});

export class PolicyEvaluationResult {
  constructor(isApproved, violationCode = null, diagnosticMessage = null) {
    this.isApproved = isApproved;
    this.violationCode = violationCode;
    this.diagnosticMessage = diagnosticMessage;
    Object.freeze(this);
  }

  static pass() {
    return new PolicyEvaluationResult(true);
  }

  static fail(violationCode, diagnosticMessage) {
    return new PolicyEvaluationResult(false, violationCode, diagnosticMessage);
  }
}

export function evaluateExecutionPolicy(policyEnvelope, currentConsumption = {}, mutationProposal = null) {
  if (!policyEnvelope || !policyEnvelope.resource_allowance) {
    return PolicyEvaluationResult.fail('POLICY_ENVELOPE_CORRUPTED', 'Missing mandatory resource_allowance definitions.');
  }

  const { tool_call_budget, reasoning_burn_ceiling } = policyEnvelope.resource_allowance;

  if (currentConsumption.tool_calls && tool_call_budget !== undefined) {
    if (currentConsumption.tool_calls >= tool_call_budget) {
      return PolicyEvaluationResult.fail(
        'BUDGET_EXHAUSTION_TOOL_CALLS',
        `Operational limit reached: cumulative tool calls (${currentConsumption.tool_calls}) equal or exceed envelope budget (${tool_call_budget}).`
      );
    }
  }

  if (currentConsumption.reasoning_tokens && reasoning_burn_ceiling !== undefined) {
    if (currentConsumption.reasoning_tokens >= reasoning_burn_ceiling) {
      return PolicyEvaluationResult.fail(
        'BUDGET_EXHAUSTION_REASONING_TOKENS',
        `Operational limit reached: cumulative reasoning token burn (${currentConsumption.reasoning_tokens}) reached ceiling (${reasoning_burn_ceiling}).`
      );
    }
  }

  if (mutationProposal && policyEnvelope.safety_guardrails) {
    const { forbidden_filesystem_paths, read_only_enforcement } = policyEnvelope.safety_guardrails;

    if (read_only_enforcement === true && mutationProposal.type === 'WRITE') {
      return PolicyEvaluationResult.fail(
        'GUARDRAIL_INTERDICTION_READ_ONLY',
        `Policy imposes strict Read-Only enforcement. Attempted WRITE mutation rejected.`
      );
    }

    if (forbidden_filesystem_paths && Array.isArray(forbidden_filesystem_paths) && mutationProposal.target_path) {
      for (const forbiddenPath of forbidden_filesystem_paths) {
        if (mutationProposal.target_path.startsWith(forbiddenPath)) {
          return PolicyEvaluationResult.fail(
            'GUARDRAIL_INTERDICTION_FORBIDDEN_PATH',
            `Attempted access to restricted path '${mutationProposal.target_path}' violates safety guardrail '${forbiddenPath}'.`
          );
        }
      }
    }
  }

  return PolicyEvaluationResult.pass();
}

export function assertMonotonicStrictness(existingPolicy, proposedPolicy) {
  const oldBudget = existingPolicy.resource_allowance ? existingPolicy.resource_allowance.tool_call_budget : Infinity;
  const newBudget = proposedPolicy.resource_allowance ? proposedPolicy.resource_allowance.tool_call_budget : Infinity;

  if (newBudget > oldBudget) {
    throw new Error(
      `[ABI-002 VIOLATION]: Monotonic policy strictness breached. Cannot relax tool_call_budget from ${oldBudget} to ${newBudget}.`
    );
  }
}
