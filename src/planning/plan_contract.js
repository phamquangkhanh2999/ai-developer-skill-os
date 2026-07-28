/**
 * AI Code Skin OS - Governed Execution Plan Contract (ESM Standard)
 * Phase 4: Execution Orchestration & Planner Governance Plane
 * Implements:
 *  - [ABI-025] Plan Determinism Contract (declares execution topology & determinism assurance)
 *  - [ABI-026] Plan Mutation Prohibition (deep freeze immutable structure - FROZEN_PLAN)
 */

import { deepFreeze } from '../runtime/admission_boundary.js';

export class GovernedExecutionPlan {
  /**
   * Constructs and permanently freezes an execution plan structure.
   * @param {object} config - Plan properties including steps and dependency references
   */
  constructor({ planId, targetIntentId, policyReferenceId, steps = [], executionTopology = 'acyclic_dag', determinismAssurance = 'verifiable_reproducible' }) {
    if (!planId || !targetIntentId || !policyReferenceId) {
      throw new Error('[PLAN GOVERNANCE FAULT]: GovernedExecutionPlan requires mandatory planId, targetIntentId, and policyReferenceId.');
    }

    const payload = {
      plan_id: planId,
      target_intent_id: targetIntentId,
      policy_reference_id: policyReferenceId,
      execution_topology: executionTopology,         // [ABI-025] 'acyclic_dag' | 'linear_sequence'
      determinism_assurance: determinismAssurance,   // [ABI-025]
      status: 'FROZEN_PLAN',                           // [ABI-026]
      steps: steps.map((step, index) => ({
        step_id: step.step_id || `step-${index + 1}`,
        step_index: index,
        capability_manifest_id: step.capability_manifest_id || step.capability_id,
        capability_contract_version: step.capability_contract_version || '1.0.0',
        parameters: step.parameters || {},
        dependencies: Array.isArray(step.dependencies) ? step.dependencies : [],
        resource_budget: step.resource_budget || { timeout_ms: 1000, cpu_cost: 1 } // [ABI-027] preparation
      })),
      contract_id: 'urn:agent-boundary:contract:governed-execution-plan',
      contract_version: '1.0.0',
      schema_version: '2020-12',
      created_at: new Date().toISOString()
    };

    return deepFreeze(payload); // Enforce [ABI-026] Plan Mutation Prohibition
  }

  static fromHypothesis(hypothesis, targetIntentId, policyReferenceId) {
    return new GovernedExecutionPlan({
      planId: hypothesis.plan_id || `plan-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      targetIntentId: targetIntentId,
      policyReferenceId: policyReferenceId,
      executionTopology: hypothesis.execution_topology || 'acyclic_dag',
      determinismAssurance: hypothesis.determinism_assurance || 'verifiable_reproducible',
      steps: hypothesis.steps || []
    });
  }
}
