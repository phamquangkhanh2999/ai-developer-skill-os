/**
 * AI Code Skin OS - Phase 2.3 Capability Boundary Bridge Test Suite (ESM Standard)
 * Proves the foundational milestone:
 * "The Runtime can safely host an untrusted extension without surrendering authority."
 * 
 * Verifies 4 normative cases:
 *  - Test 1: Valid Invocation Flow (Clean execution under contract)
 *  - Test 2: Capability Attempts Mutation (Authority boundary interdiction -> REJECTED)
 *  - Test 3: Capability Timeout Isolation (Sandbox defense -> CAPABILITY_FAILURE, Runtime survives)
 *  - Test 4: Capability Version Mismatch (Contract incompatibility -> CONTRACT_VIOLATION)
 */

import assert from 'assert';
import { KernelRuntime } from '../src/runtime/kernel.js';
import { RuntimeState } from '../src/runtime/state_machine.js';
import { FailureCategory } from '../src/runtime/failure_semantics.js';
import { EchoCapabilityDriver } from '../src/capabilities/echo_capability.js';

console.log('👑 ========================================================================= 👑');
console.log('🚀 AI CODE SKIN OS - PHASE 2.3 CAPABILITY BOUNDARY BRIDGE TEST SUITE...');
console.log('👑 ========================================================================= 👑\n');

const kernel = new KernelRuntime();
const echoDriver = new EchoCapabilityDriver();

// Register deterministic echo extension under manifest ID & contract version 1.0.0
kernel.registerDriver('urn:agent-boundary:manifest:echo-driver', echoDriver, '1.0.0');

const baseIntent = {
  intent_id: 'intent-bridge-test-101',
  business_outcome: 'Verify safe untrusted extension hosting across Boundary Bridge',
  scope: 'CAPABILITY_TESTING',
  target_environment: 'NODE_SANDBOX',
  priority: 'HIGH',
  contract_id: 'urn:agent-boundary:contract:intent-record',
  contract_version: '1.0.0',
  schema_version: '2020-12',
  created_at: new Date().toISOString()
};

const basePolicy = {
  policy_id: 'policy-bridge-test-202',
  parent_intent_id: 'intent-bridge-test-101',
  cost_tier: 'TARGETED',
  resource_allowance: { tool_call_budget: 10, reasoning_burn_ceiling: 2000 },
  safety_guardrails: { read_only_enforcement: true, forbidden_filesystem_paths: ['/etc', '/root'] },
  escalation_path: 'DENY_ALL',
  contract_id: 'urn:agent-boundary:contract:policy-envelope',
  contract_version: '1.0.0',
  schema_version: '2020-12',
  created_at: new Date().toISOString()
};

async function runPhase23Suite() {
  try {
    // =========================================================================
    // ✅ TEST 1: VALID INVOCATION FLOW (Clean Execution Under Contract)
    // =========================================================================
    console.log('▶️ Running Test 1: Valid Invocation Flow...');
    const planTest1 = {
      plan_id: 'plan-valid-flow-001',
      target_intent_id: baseIntent.intent_id,
      policy_reference_id: basePolicy.policy_id,
      reproducibility_hash: 'sha256:1111111111111111111111111111111111111111111111111111111111111111',
      steps: [
        {
          capability_manifest_id: 'urn:agent-boundary:manifest:echo-driver',
          capability_contract_version: '1.0.0',
          parameters: { mode: 'ECHO', message: 'Greetings from Governed Kernel' }
        }
      ],
      fallback_strategy: 'ABORT',
      contract_id: 'urn:agent-boundary:contract:execution-plan',
      contract_version: '1.0.0',
      schema_version: '2020-12',
      created_at: new Date().toISOString()
    };

    const res1 = await kernel.executeBridgedPlan(baseIntent, basePolicy, planTest1);
    assert.strictEqual(res1.status, 'SUCCESS', 'Valid invocation must complete successfully.');
    assert.strictEqual(res1.final_state, RuntimeState.ARCHIVED, 'FSM must complete cycle to ARCHIVED.');
    assert.strictEqual(res1.capability_results.length, 1, 'Must return 1 capability result.');
    assert.strictEqual(res1.capability_results[0].declared_output.echoed_message, 'Greetings from Governed Kernel', 'Declared output mismatch.');
    assert.ok(res1.evidence_reference.sequence_number > 0, 'Evidence stream must monotonically advance via Lamport logical clocks.');
    console.log('✅ TEST 1 PASSED: Valid Invocation Flow (Intent -> Policy -> InvocationRequest -> Result -> Evidence) verified!\n');


    // =========================================================================
    // ✅ TEST 2: CAPABILITY ATTEMPTS MUTATION (Expected: REJECTED by Authority)
    // =========================================================================
    console.log('▶️ Running Test 2: Capability Attempts Mutation (Authority Defense Proof)...');
    const planTest2 = {
      plan_id: 'plan-illegal-mut-002',
      target_intent_id: baseIntent.intent_id,
      policy_reference_id: basePolicy.policy_id,
      reproducibility_hash: 'sha256:2222222222222222222222222222222222222222222222222222222222222222',
      steps: [
        {
          capability_manifest_id: 'urn:agent-boundary:manifest:echo-driver',
          capability_contract_version: '1.0.0',
          parameters: { mode: 'MUTATION_ATTEMPT', target_resource: 'FROZEN_INTENT' }
        }
      ],
      fallback_strategy: 'ABORT',
      contract_id: 'urn:agent-boundary:contract:execution-plan',
      contract_version: '1.0.0',
      schema_version: '2020-12',
      created_at: new Date().toISOString()
    };

    const res2 = await kernel.executeBridgedPlan(baseIntent, basePolicy, planTest2);
    assert.strictEqual(res2.status, 'MUTATION_REJECTED', 'Illegal mutation proposal by untrusted capability must be REJECTED.');
    assert.strictEqual(res2.final_state, RuntimeState.FAILED_WITH_EVIDENCE, 'FSM must terminalize at FAILED_WITH_EVIDENCE.');
    assert.strictEqual(res2.failure_category, FailureCategory.CONTRACT_VIOLATION, 'Must tag explicit CONTRACT_VIOLATION taxonomy.');
    assert.ok(res2.diagnostics.includes('ABI-001_INTENT_MUTATION_FORBIDDEN'), 'Must record explicit ABI-001 violation evidence.');
    console.log('✅ TEST 2 PASSED: Capability mutation proposal decisively REJECTED! Authority boundary inviolable!\n');


    // =========================================================================
    // ✅ TEST 3: CAPABILITY TIMEOUT ISOLATION (Expected: CAPABILITY_FAILURE, Runtime survives)
    // =========================================================================
    console.log('▶️ Running Test 3: Capability Timeout Isolation ([ABI-016] Sandbox Defense)...');
    const planTest3 = {
      plan_id: 'plan-timeout-hang-003',
      target_intent_id: baseIntent.intent_id,
      policy_reference_id: basePolicy.policy_id,
      reproducibility_hash: 'sha256:3333333333333333333333333333333333333333333333333333333333333333',
      steps: [
        {
          capability_manifest_id: 'urn:agent-boundary:manifest:echo-driver',
          capability_contract_version: '1.0.0',
          parameters: { mode: 'TIMEOUT_HANG', hang_ms: 2000 },
          timeout_ms: 150 // Enforce sharp 150ms timeout threshold
        }
      ],
      fallback_strategy: 'ABORT',
      contract_id: 'urn:agent-boundary:contract:execution-plan',
      contract_version: '1.0.0',
      schema_version: '2020-12',
      created_at: new Date().toISOString()
    };

    const res3 = await kernel.executeBridgedPlan(baseIntent, basePolicy, planTest3);
    assert.strictEqual(res3.status, 'TIMEOUT', 'Driver exceeding timeout must yield TIMEOUT status.');
    assert.strictEqual(res3.final_state, RuntimeState.FAILED_WITH_EVIDENCE, 'FSM must safely transition to FAILED_WITH_EVIDENCE.');
    assert.strictEqual(res3.failure_category, FailureCategory.CAPABILITY_FAILURE, '[ABI-016]: Must tag exact CAPABILITY_FAILURE taxonomy!');
    assert.ok(res3.diagnostics.includes('exceeded enforced timeout'), 'Must document sandbox timeout fault.');
    console.log('✅ TEST 3 PASSED: Driver timeout intercepted by Sandbox! Runtime survived without unhandled crash ([ABI-016])!\n');


    // =========================================================================
    // ✅ TEST 4: CAPABILITY VERSION MISMATCH (Expected: CONTRACT_VIOLATION)
    // =========================================================================
    console.log('▶️ Running Test 4: Capability Version Mismatch ([ABI-014] Verification)...');
    const planTest4 = {
      plan_id: 'plan-version-clash-004',
      target_intent_id: baseIntent.intent_id,
      policy_reference_id: basePolicy.policy_id,
      reproducibility_hash: 'sha256:4444444444444444444444444444444444444444444444444444444444444444',
      steps: [
        {
          capability_manifest_id: 'urn:agent-boundary:manifest:echo-driver',
          capability_contract_version: '99.0.0', // Incompatible version (registered is 1.0.0)
          parameters: { mode: 'ECHO' }
        }
      ],
      fallback_strategy: 'ABORT',
      contract_id: 'urn:agent-boundary:contract:execution-plan',
      contract_version: '1.0.0',
      schema_version: '2020-12',
      created_at: new Date().toISOString()
    };

    const res4 = await kernel.executeBridgedPlan(baseIntent, basePolicy, planTest4);
    assert.strictEqual(res4.status, 'VERSION_MISMATCH', 'Incompatible driver version must trigger VERSION_MISMATCH.');
    assert.strictEqual(res4.final_state, RuntimeState.FAILED_WITH_EVIDENCE, 'FSM must safely terminalize.');
    assert.strictEqual(res4.failure_category, FailureCategory.CONTRACT_VIOLATION, 'Must tag exact CONTRACT_VIOLATION taxonomy.');
    assert.ok(res4.diagnostics.includes('Capability contract version mismatch'), 'Must record clear diagnostic version details.');
    console.log('✅ TEST 4 PASSED: Incompatible capability contract version authoritatively rejected as CONTRACT_VIOLATION!\n');


    // =========================================================================
    // 🏆 FINAL SUMMARY REPORT
    // =========================================================================
    console.log('👑 ========================================================================= 👑');
    console.log('🏁 ALL 4 PHASE 2.3 CAPABILITY BOUNDARY BRIDGE PROOFS VERIFIED!');
    console.log('🌟 PROVEN: "The Runtime can safely host an untrusted extension without surrendering authority."');
    console.log('👑 ========================================================================= 👑\n');

  } catch (err) {
    console.error('❌ PHASE 2.3 SUITE FAILED:', err.stack || err.message);
    process.exit(1);
  }
}

runPhase23Suite();
