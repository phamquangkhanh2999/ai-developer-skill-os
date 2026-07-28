/**
 * AI Code Skin OS - Governed Plan Validator (ESM Standard)
 * Phase 4: Execution Orchestration & Planner Governance Plane
 * Enforces authoritative validation gates prior to execution scheduling:
 *  - Test 1: Invalid plan rejected (schema faults or unresolvable step dependencies)
 *  - Test 2: Non-deterministic plan detected (cyclic loops or ambiguous ordering interdicted)
 *  - [ABI-024]: Authoritative review of untrusted planner hypotheses
 */

import { DependencyGraph } from './dependency_graph.js';
import { FailureCategory } from '../runtime/failure_semantics.js';

export class PlanValidator {
  /**
   * Validates a candidate GovernedExecutionPlan against structural, topology, and determinism invariants.
   * @param {object} plan - Target GovernedExecutionPlan structure
   * @param {object} capabilityCatalog - Optional discovery plane catalog to verify step capability existence
   * @returns {object} { isAdmitted: boolean, orderedSteps: Array, errorCode: string|null, failureCategory: string|null, diagnosticMessage: string|null }
   */
  static validatePlan(plan, capabilityCatalog = null) {
    if (!plan || !plan.plan_id || !plan.steps) {
      return {
        isAdmitted: false,
        orderedSteps: [],
        errorCode: 'INVALID_PLAN_CONTRACT',
        failureCategory: FailureCategory.CONTRACT_VIOLATION,
        diagnosticMessage: 'Plan structure lacks mandatory canonical fields or step array.'
      };
    }

    // 1. Verify Topology & Dependency Acyclicity (Test 1 & Test 2 Proof)
    const topoResult = DependencyGraph.evaluateTopology(plan.steps);
    if (!topoResult.isValid) {
      return {
        isAdmitted: false,
        orderedSteps: [],
        errorCode: topoResult.errorCode || 'TOPOLOGY_INTERDICTION',
        failureCategory: FailureCategory.CONTRACT_VIOLATION,
        diagnosticMessage: topoResult.message
      };
    }

    // 2. Validate Determinism Assurance ([ABI-025])
    const validTopologies = ['acyclic_dag', 'linear_sequence'];
    if (!plan.execution_topology || !validTopologies.includes(plan.execution_topology)) {
      return {
        isAdmitted: false,
        orderedSteps: [],
        errorCode: 'ABI-025_INVALID_TOPOLOGY_DECLARATION',
        failureCategory: FailureCategory.CONTRACT_VIOLATION,
        diagnosticMessage: `[ABI-025 VIOLATION]: Execution plan must declare execution_topology from [${validTopologies.join(', ')}].`
      };
    }

    // 3. Verify Capability Availability across Discovery Plane if catalog provided
    if (capabilityCatalog && typeof capabilityCatalog.discoverAndAdmit === 'function') {
      for (const step of topoResult.orderedSteps) {
        const disc = capabilityCatalog.discoverAndAdmit(step.capability_manifest_id);
        if (!disc.isAdmitted) {
          return {
            isAdmitted: false,
            orderedSteps: [],
            errorCode: `UNRESOLVED_STEP_CAPABILITY_${step.step_id}`,
            failureCategory: FailureCategory.CONTRACT_VIOLATION,
            diagnosticMessage: `[PLAN ADMISSION REJECTED]: Step '${step.step_id}' demands capability '${step.capability_manifest_id}', which failed discovery plane admission: ${disc.diagnosticMessage}`
          };
        }
      }
    }

    return {
      isAdmitted: true,
      orderedSteps: topoResult.orderedSteps,
      errorCode: null,
      failureCategory: null,
      diagnosticMessage: `Plan '${plan.plan_id}' authoritatively validated. Acyclic determinism guaranteed.`
    };
  }
}
