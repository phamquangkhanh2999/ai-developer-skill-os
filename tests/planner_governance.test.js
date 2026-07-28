/**
 * AI Code Skin OS - Phase 4 Execution Orchestration & Planner Governance Test Suite (ESM Standard)
 * Proves the foundational milestone:
 * "The Runtime not only governs who is allowed to execute, but governs why an execution plan is permitted to exist and operate."
 * 
 * Verifies 5 normative cases:
 *  - Test 1: Invalid plan rejected (Unresolvable dependencies or schema defects)
 *  - Test 2: Non-deterministic plan detected (Cyclic dependency interdiction - ABI-025)
 *  - Test 3: Planner replacement without kernel code change (Dynamic proposal decoupling - ABI-024)
 *  - Test 4: Execution order preserved strictly according to acyclic dependency topology
 *  - Test 5: Plan explanation reconstructed authoritatively directly from empirical execution trace evidence
 */

import assert from 'assert';
import { GovernedExecutionPlan } from '../src/planning/plan_contract.js';
import { PlannerBoundary } from '../src/planning/planner_boundary.js';
import { PlanValidator } from '../src/planning/plan_validator.js';
import { ExecutionScheduler } from '../src/planning/execution_scheduler.js';
import { PlanExplainer } from '../src/planning/plan_explainer.js';
import { FailureCategory } from '../src/runtime/failure_semantics.js';

console.log('👑 ========================================================================= 👑');
console.log('🚀 AI CODE SKIN OS - PHASE 4 PLANNER GOVERNANCE & ORCHESTRATION TEST SUITE...');
console.log('👑 ========================================================================= 👑\n');

const baseIntent = { intent_id: 'intent-plan-test-001', business_outcome: 'Verify Governed Planner Plane' };
const basePolicy = { policy_id: 'policy-plan-test-002', resource_allowance: { tool_call_budget: 50, max_timeout_ms: 10000 } };

class PlannerAlpha {
  constructor() { this.version = 'alpha-v1'; }
  async proposeSteps() {
    return [
      { step_id: 'alpha-step-1', capability_manifest_id: 'urn:agent-boundary:manifest:default-driver', dependencies: [] },
      { step_id: 'alpha-step-2', capability_manifest_id: 'urn:agent-boundary:manifest:default-driver', dependencies: ['alpha-step-1'] }
    ];
  }
}

class PlannerBeta {
  constructor() { this.version = 'beta-v2-upgraded'; }
  async proposeSteps() {
    return [
      { step_id: 'beta-root', capability_manifest_id: 'urn:agent-boundary:manifest:default-driver', dependencies: [] },
      { step_id: 'beta-transform', capability_manifest_id: 'urn:agent-boundary:manifest:default-driver', dependencies: ['beta-root'] },
      { step_id: 'beta-audit', capability_manifest_id: 'urn:agent-boundary:manifest:logger-agent', dependencies: ['beta-transform'] }
    ];
  }
}

async function runPhase4Suite() {
  try {
    // =========================================================================
    // ✅ TEST 1: INVALID PLAN REJECTED (Unresolvable Dependencies & Structural Defects)
    // =========================================================================
    console.log('▶️ Running Test 1: Invalid plan rejected at validation boundary...');
    const invalidPlan = new GovernedExecutionPlan({
      planId: 'plan-invalid-dep-101',
      targetIntentId: baseIntent.intent_id,
      policyReferenceId: basePolicy.policy_id,
      steps: [
        { step_id: 'step-orphan', capability_manifest_id: 'urn:agent-boundary:manifest:default-driver', dependencies: ['step-nonexistent-ghost-999'] }
      ]
    });

    const res1 = PlanValidator.validatePlan(invalidPlan);
    assert.strictEqual(res1.isAdmitted, false, 'Plan containing unresolvable dependency must be denied admission.');
    assert.strictEqual(res1.errorCode, 'UNRESOLVABLE_DEPENDENCY', 'Must yield accurate interdiction error code.');
    assert.strictEqual(res1.failureCategory, FailureCategory.CONTRACT_VIOLATION, 'Must tag explicit CONTRACT_VIOLATION taxonomy.');
    console.log('✅ TEST 1 PASSED: Invalid plan containing unresolvable dependency decisively rejected!\n');


    // =========================================================================
    // ✅ TEST 2: NON-DETERMINISTIC PLAN DETECTED ([ABI-025] Cyclic Loop Interdiction)
    // =========================================================================
    console.log('▶️ Running Test 2: Non-deterministic cyclic plan detected ([ABI-025] Proof)...');
    const cyclicPlan = new GovernedExecutionPlan({
      planId: 'plan-cyclic-loop-202',
      targetIntentId: baseIntent.intent_id,
      policyReferenceId: basePolicy.policy_id,
      steps: [
        { step_id: 'loop-node-A', capability_manifest_id: 'urn:agent-boundary:manifest:default-driver', dependencies: ['loop-node-B'] },
        { step_id: 'loop-node-B', capability_manifest_id: 'urn:agent-boundary:manifest:default-driver', dependencies: ['loop-node-A'] }
      ]
    });

    const res2 = PlanValidator.validatePlan(cyclicPlan);
    assert.strictEqual(res2.isAdmitted, false, 'Plan exhibiting cyclic dependency loop must be authoritatively interdicted.');
    assert.strictEqual(res2.errorCode, 'CYCLIC_DEPENDENCY_DETECTED', 'Must explicitly tag CYCLIC_DEPENDENCY_DETECTED error.');
    assert.ok(res2.diagnosticMessage.includes('non-deterministic cyclic dependency'), 'Must report diagnostic topology error.');
    console.log('✅ TEST 2 PASSED: Non-deterministic cyclic plan intercepted and forbidden under [ABI-025]!\n');


    // =========================================================================
    // ✅ TEST 3: PLANNER REPLACEMENT WITHOUT KERNEL CHANGE ([ABI-024] Dynamic Swapping)
    // =========================================================================
    console.log('▶️ Running Test 3: Planner replacement without kernel code change...');
    const plannerBoundary = new PlannerBoundary(new PlannerAlpha());

    const alphaOutcome = await plannerBoundary.proposePlan(baseIntent, basePolicy);
    assert.strictEqual(alphaOutcome.success, true, 'Alpha planner hypothesis generation must succeed.');
    assert.strictEqual(alphaOutcome.plan.steps.length, 2, 'Initial Alpha hypothesis must propose 2 steps.');
    assert.strictEqual(alphaOutcome.plannerVersion, 'alpha-v1', 'Must bind alpha-v1 planner coordinate.');

    // Execute seamless runtime replacement of planning engine behind contract without touching kernel!
    plannerBoundary.swapPlannerImplementation(new PlannerBeta(), 'Swapping to upgraded heuristic optimizer');
    const betaOutcome = await plannerBoundary.proposePlan(baseIntent, basePolicy);
    assert.strictEqual(betaOutcome.success, true, 'Post-swap Beta proposal generation must succeed.');
    assert.strictEqual(betaOutcome.plan.steps.length, 3, 'Upgraded Beta hypothesis must propose 3 steps without modifying microkernel!');
    assert.strictEqual(betaOutcome.plannerVersion, 'beta-v2-upgraded', 'Must confirm upgraded Beta version signature.');
    console.log('✅ TEST 3 PASSED: Planner engine replaced behind contract without altering microkernel state!\n');


    // =========================================================================
    // ✅ TEST 4: EXECUTION ORDER PRESERVED (DAG Topological Scheduling & [ABI-027])
    // =========================================================================
    console.log('▶️ Running Test 4: Execution order preserved strictly according to dependency DAG...');
    const outOfOrderPlan = new GovernedExecutionPlan({
      planId: 'plan-order-verify-404',
      targetIntentId: baseIntent.intent_id,
      policyReferenceId: basePolicy.policy_id,
      steps: [
        // Intentionally scrambled array order: C -> B -> A
        { step_id: 'step-C-finish', capability_manifest_id: 'urn:agent-boundary:manifest:default-driver', dependencies: ['step-B-process'] },
        { step_id: 'step-B-process', capability_manifest_id: 'urn:agent-boundary:manifest:default-driver', dependencies: ['step-A-init'] },
        { step_id: 'step-A-init', capability_manifest_id: 'urn:agent-boundary:manifest:default-driver', dependencies: [] }
      ]
    });

    const scheduler = new ExecutionScheduler(null); // Standalone scheduling proof
    const schedResult = await scheduler.scheduleAndExecute(baseIntent, basePolicy, outOfOrderPlan);

    assert.strictEqual(schedResult.status, 'SUCCESS', 'Valid DAG plan must complete execution cleanly.');
    assert.deepStrictEqual(
      schedResult.execution_trace,
      ['step-A-init', 'step-B-process', 'step-C-finish'],
      'Scheduler must authoritatively preserve topological order regardless of array insertion arrangement!'
    );
    console.log(`✅ TEST 4 PASSED: Execution sequence strictly preserved: [${schedResult.execution_trace.join(' ➔ ')}]!\n`);


    // =========================================================================
    // ✅ TEST 5: PLAN EXPLANATION RECONSTRUCTED FROM EVIDENCE (Empirical Audit Proof)
    // =========================================================================
    console.log('▶️ Running Test 5: Plan explanation reconstructed authoritatively from evidence traces...');
    const explainerResult = PlanExplainer.reconstructExplanation(outOfOrderPlan, schedResult);

    assert.strictEqual(explainerResult.isValidExplanation, true, 'Reconstruction from completed trace must yield valid explanation.');
    assert.ok(explainerResult.narrative.length >= 4, 'Narrative must contain constitution and detailed step evaluations.');
    assert.ok(explainerResult.summary.includes('0 dependency deviations'), 'Summary must attest to deterministic trace consistency.');
    
    console.log('📜 [RECONSTRUCTED NARRATIVE EVIDENCE]:');
    for (const line of explainerResult.narrative) {
      console.log(`   ${line}`);
    }
    console.log('\n✅ TEST 5 PASSED: Plan explanation accurately reconstructed from historical runtime evidence without re-executing steps!\n');


    // =========================================================================
    // 🏆 FINAL SUMMARY REPORT
    // =========================================================================
    console.log('👑 ========================================================================= 👑');
    console.log('🏁 ALL 5 PHASE 4 PLANNER GOVERNANCE & ORCHESTRATION PROOFS VERIFIED!');
    console.log('🌟 PROVEN: "AI Code Skin rules both who executes and why plans are permitted to exist."');
    console.log('👑 ========================================================================= 👑\n');

  } catch (err) {
    console.error('❌ PHASE 4 SUITE FAILED:', err.stack || err.message);
    process.exit(1);
  }
}

runPhase4Suite();
