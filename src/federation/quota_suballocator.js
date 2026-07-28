/**
 * AI Code Skin OS - Federated Quota Sub-Allocator Engine (ESM Standard)
 * Phase 6: Multi-Agent Federation & Inter-Agent Governance Plane
 * Implements:
 *  - [ABI-033] Federated Quota Sub-Allocation (Child Budget <= Parent Residual Quota Allowance - Test 2 Proof)
 */

import { deepFreeze } from '../runtime/admission_boundary.js';
import { FailureCategory } from '../runtime/failure_semantics.js';

export class QuotaSuballocator {
  /**
   * Evaluates and carves out a child policy envelope from a parent runtime policy.
   * @param {object} parentPolicy - Host kernel PolicyEnvelope
   * @param {object} requestedBudget - Proposed resource allowance for delegated sub-agent
   * @returns {object} { isGranted: boolean, childPolicy: object|null, errorCode: string|null, failureCategory: string|null, diagnosticMessage: string|null }
   */
  static evaluateAndAllocate(parentPolicy, requestedBudget = {}) {
    if (!parentPolicy || !parentPolicy.policy_id || !parentPolicy.resource_allowance) {
      return {
        isGranted: false,
        childPolicy: null,
        errorCode: 'INVALID_PARENT_POLICY',
        failureCategory: FailureCategory.CONTRACT_VIOLATION,
        diagnosticMessage: 'Parent policy envelope lacks required resource_allowance definitions.'
      };
    }

    const parentBudget = parentPolicy.resource_allowance;
    const parentCalls = typeof parentBudget.tool_call_budget === 'number' ? parentBudget.tool_call_budget : 100;
    const parentTimeout = typeof parentBudget.max_timeout_ms === 'number' ? parentBudget.max_timeout_ms : 10000;

    const reqCalls = typeof requestedBudget.tool_call_budget === 'number' ? requestedBudget.tool_call_budget : 10;
    const reqTimeout = typeof requestedBudget.max_timeout_ms === 'number' ? requestedBudget.max_timeout_ms : 3000;

    // Enforce [ABI-033]: Child Budget <= Parent Residual Quota Allowance
    if (reqCalls > parentCalls || reqTimeout > parentTimeout) {
      return {
        isGranted: false,
        childPolicy: null,
        errorCode: 'ABI-033_QUOTA_OVER_ALLOCATION_INTERDICTED',
        failureCategory: FailureCategory.RESOURCE_EXHAUSTED,
        diagnosticMessage: `[ABI-033 VIOLATION]: Requested sub-agent quota (${reqCalls} calls / ${reqTimeout}ms) exceeds parent residual allowance (${parentCalls} calls / ${parentTimeout}ms). Sub-allocation decisively forbidden.`
      };
    }

    // Construct valid child policy sub-envelope
    const childPolicy = deepFreeze({
      policy_id: `subpolicy-${parentPolicy.policy_id}-${Math.random().toString(36).substring(2, 6)}`,
      parent_policy_reference: parentPolicy.policy_id,
      resource_allowance: {
        tool_call_budget: reqCalls,
        max_timeout_ms: reqTimeout,
        federation_tier: 'CHILD_SUB_AGENT_BOUNDED'
      },
      contract_id: 'urn:agent-boundary:contract:sub-policy-envelope',
      created_at: new Date().toISOString()
    });

    return {
      isGranted: true,
      childPolicy: childPolicy,
      errorCode: null,
      failureCategory: null,
      diagnosticMessage: `Sub-agent quota envelope carved cleanly. Parent residual unaffected.`
    };
  }
}
