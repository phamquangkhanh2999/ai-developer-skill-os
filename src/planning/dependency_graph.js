/**
 * AI Code Skin OS - Plan Dependency Graph & Cycle Detection Engine (ESM Standard)
 * Phase 4: Execution Orchestration & Planner Governance Plane
 * Implements:
 *  - DAG topological sorting and execution ordering (Test 4 Proof)
 *  - Cycle detection & non-deterministic execution topology interdiction (Test 2 & ABI-025)
 *  - Missing dependency rejection (Test 1 & ABI-023)
 */

export class DependencyGraph {
  /**
   * Evaluates the structural integrity and acyclic topology of an array of plan steps.
   * @param {Array} steps - List of governed execution steps
   * @returns {object} { isValid: boolean, orderedSteps: Array, errorCode: string|null, message: string|null }
   */
  static evaluateTopology(steps = []) {
    if (!Array.isArray(steps) || steps.length === 0) {
      return { isValid: false, orderedSteps: [], errorCode: 'EMPTY_PLAN', message: 'Execution plan contains no executable steps.' };
    }

    const stepMap = new Map();
    const adjList = new Map();

    for (const step of steps) {
      if (!step.step_id || !step.capability_manifest_id) {
        return { isValid: false, orderedSteps: [], errorCode: 'INVALID_STEP_SCHEMA', message: 'Plan step missing required step_id or capability_manifest_id.' };
      }
      stepMap.set(step.step_id, step);
      adjList.set(step.step_id, []);
    }

    // Populate edges and verify dependency resolution (Test 1 Proof)
    for (const step of steps) {
      if (Array.isArray(step.dependencies)) {
        for (const depId of step.dependencies) {
          if (!stepMap.has(depId)) {
            return {
              isValid: false,
              orderedSteps: [],
              errorCode: 'UNRESOLVABLE_DEPENDENCY',
              message: `[INVALID PLAN REJECTED]: Step '${step.step_id}' references unknown dependency step ID '${depId}'.`
            };
          }
          // Edge from depId -> step_id
          adjList.get(depId).push(step.step_id);
        }
      }
    }

    // Perform cycle detection and topological sorting via Kahn's algorithm or DFS (Test 2 Proof)
    const inDegree = new Map();
    for (const key of stepMap.keys()) inDegree.set(key, 0);

    for (const [u, neighbors] of adjList.entries()) {
      for (const v of neighbors) {
        inDegree.set(v, inDegree.get(v) + 1);
      }
    }

    const queue = [];
    // To guarantee determinism, sort starting nodes alphabetically by step_id
    for (const [key, degree] of inDegree.entries()) {
      if (degree === 0) queue.push(key);
    }
    queue.sort();

    const orderedSteps = [];
    let visitedCount = 0;

    while (queue.length > 0) {
      const currentId = queue.shift();
      orderedSteps.push(stepMap.get(currentId));
      visitedCount++;

      const neighbors = adjList.get(currentId) || [];
      neighbors.sort(); // Deterministic edge evaluation
      for (const v of neighbors) {
        inDegree.set(v, inDegree.get(v) - 1);
        if (inDegree.get(v) === 0) {
          queue.push(v);
        }
      }
      queue.sort();
    }

    // If visited count != total steps, a cyclic graph was intercepted!
    if (visitedCount !== steps.length) {
      return {
        isValid: false,
        orderedSteps: [],
        errorCode: 'CYCLIC_DEPENDENCY_DETECTED',
        message: '[ABI-025 VIOLATION]: Execution plan topology exhibits non-deterministic cyclic dependency loop! Interdiction enforced.'
      };
    }

    return {
      isValid: true,
      orderedSteps,
      errorCode: null,
      message: `Acyclic DAG verified. Topological execution sequence: [${orderedSteps.map(s => s.step_id).join(' ➔ ')}]`
    };
  }
}
