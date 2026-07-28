/**
 * AI Code Skin OS - Governed Inter-Agent Delegation Contract (ESM Standard)
 * Phase 6: Multi-Agent Federation & Inter-Agent Governance Plane
 * Implements:
 *  - [ABI-032] Inter-Agent Authority Delegation Contract (prohibits transferring root kernel authority)
 */

import { deepFreeze } from '../runtime/admission_boundary.js';
import { FailureCategory } from '../runtime/failure_semantics.js';

export class GovernedDelegationContract {
  /**
   * Constructs and permanently freezes an inter-agent delegation agreement.
   * @param {object} config - Parent and child coordinates, task intent, and authority scope
   */
  constructor({ delegationId, parentAgentId, targetSubAgentId, taskScope, authorityLevel = 'BOUNDED_EXECUTION_PULSE' }) {
    if (!delegationId || !parentAgentId || !targetSubAgentId || !taskScope) {
      throw new Error('[FEDERATION GOVERNANCE FAULT]: GovernedDelegationContract demands delegationId, parentAgentId, targetSubAgentId, and taskScope.');
    }

    // Enforce [ABI-032]: Sovereign Root Kernel Authority CANNOT be delegated!
    if (authorityLevel === 'ROOT_KERNEL_AUTHORITY' || authorityLevel === 'SOVEREIGN_ROOT') {
      const err = new Error(`[ABI-032 VIOLATION]: Parent agent '${parentAgentId}' attempted illegal delegation of ${authorityLevel} to '${targetSubAgentId}'. Interdiction enforced.`);
      err.errorCode = 'ABI-032_UNAUTHORIZED_AUTHORITY_LEAP';
      err.failureCategory = FailureCategory.CONTRACT_VIOLATION;
      throw err;
    }

    const payload = {
      delegation_id: delegationId,
      parent_agent_id: parentAgentId,
      target_sub_agent_id: targetSubAgentId,
      task_scope: taskScope,
      authority_level: authorityLevel, // Must remain bounded (e.g. BOUNDED_EXECUTION_PULSE)
      contract_id: 'urn:agent-boundary:contract:delegation-agreement',
      contract_version: '1.0.0',
      schema_version: '2020-12',
      created_at: new Date().toISOString()
    };

    return deepFreeze(payload);
  }

  static formulatePulse(contract, inputParameters = {}) {
    return deepFreeze({
      pulse_id: `pulse-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      delegation_contract: contract,
      parameters: inputParameters,
      issued_at: new Date().toISOString()
    });
  }
}
