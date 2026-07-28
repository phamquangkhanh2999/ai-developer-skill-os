/**
 * AI Code Skin OS - Phase 2.1 & 2.2 Definition of Done (Runtime Conformance Proofs)
 * Executes contract-based conformance verification against the Minimal Executable Kernel & Event Governance Layer:
 *  - Test 1: Empty Execution Proof (Runtime lives without capability plugins; Lamport clocks & event stream active)
 *  - Test 2: Policy Block Proof (Failure Contract [ABI-006] & explicit RESOURCE_EXHAUSTED FailureCategory)
 *  - Test 3: Mutation Attempt Proof (Creator != Authority & explicit CONTRACT_VIOLATION FailureCategory)
 */

import assert from 'assert';
import { KernelRuntime, ExecutionResult } from '../src/runtime/kernel.js';
import { RuntimeState } from '../src/runtime/state_machine.js';
import { FailureCategory } from '../src/runtime/failure_semantics.js';

console.log('👑 ========================================================================= 👑');
console.log('🚀 AI CODE SKIN OS - PHASE 2.2 RUNTIME CONFORMANCE & EVENT GOVERNANCE SUITE...');
console.log('👑 ========================================================================= 👑\n');

const kernel = new KernelRuntime();

const sampleIntent = {
  intent_id: 'uuid-intent-888',
  business_outcome: 'Verify Governed Runtime Lifecycle & Event Governance',
  scope: 'KERNEL_TESTING',
  target_environment: 'NODE_SANDBOX',
  priority: 'HIGH',
  contract_id: 'urn:agent-boundary:contract:intent-record',
  contract_version: '1.0.0',
  schema_version: '2020-12',
  created_at: new Date().toISOString()
};

const samplePolicy = {
  policy_id: 'uuid-policy-999',
  parent_intent_id: 'uuid-intent-888',
  cost_tier: 'TARGETED',
  resource_allowance: {
    tool_call_budget: 5,
    reasoning_burn_ceiling: 1000
  },
  safety_guardrails: {
    read_only_enforcement: true,
    forbidden_filesystem_paths: ['/etc/passwd', 'C:/Windows/System32']
  },
  escalation_path: 'DENY_ALL',
  contract_id: 'urn:agent-boundary:contract:policy-envelope',
  contract_version: '1.0.0',
  schema_version: '2020-12',
  created_at: new Date().toISOString()
};

const samplePlan = {
  plan_id: 'uuid-plan-777',
  target_intent_id: 'uuid-intent-888',
  policy_reference_id: 'uuid-policy-999',
  reproducibility_hash: 'sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  steps: [
    { capability_manifest_id: 'urn:agent-boundary:manifest:fs-reader', parameters: { path: '/tmp/test.txt' } }
  ],
  fallback_strategy: 'ABORT',
  contract_id: 'urn:agent-boundary:contract:execution-plan',
  contract_version: '1.0.0',
  schema_version: '2020-12',
  created_at: new Date().toISOString()
};

try {
  // =========================================================================
  // ✅ TEST 1: EMPTY EXECUTION & EVENT GOVERNANCE PROOF
  // =========================================================================
  console.log('▶️ Running Test 1: Empty Execution & Lamport Clock Proof...');
  const result1 = kernel.executeLifecycle(sampleIntent, samplePolicy, samplePlan);

  assert.strictEqual(result1 instanceof ExecutionResult, true, 'Result must be a first-class ExecutionResult contract.');
  assert.strictEqual(result1.status, 'SUCCESS', 'Empty execution must succeed normally.');
  assert.strictEqual(result1.final_state, RuntimeState.ARCHIVED, 'FSM must reach ARCHIVED after completing.');
  assert.ok(result1.evidence_reference, 'Must yield a valid EvidenceRecord pointer.');
  
  // HARDENING-014 (Logical Clock assertions)
  assert.strictEqual(typeof result1.evidence_reference.sequence_number, 'number', 'Evidence must include monotonic sequence_number.');
  assert.strictEqual(typeof result1.evidence_reference.logical_clock, 'number', 'Evidence must embed Lamport logical_clock tick.');
  assert.ok(result1.evidence_reference.parent_evidence_id, 'Evidence must embed parent_evidence_id causality pointer.');
  
  // HARDENING-015 (Capability Invocation Boundary assertions)
  assert.strictEqual(result1.invocation_requests.length, 1, 'Plan step must generate isolated CapabilityInvocationRequest.');
  assert.strictEqual(result1.invocation_requests[0].step_index, 0, 'Invocation request must map clean step index.');
  
  console.log('✅ TEST 1 PASSED: Minimal Kernel lives, advances Lamport clocks, & abstracts CapabilityInvocationRequest!\n');


  // =========================================================================
  // ✅ TEST 2: POLICY BLOCK & FAILURE TAXONOMY PROOF (Failure Category Validation)
  // =========================================================================
  console.log('▶️ Running Test 2: Policy Block & RESOURCE_EXHAUSTED Taxonomy Proof...');
  const result2 = kernel.executeWithPolicyCheck(sampleIntent, samplePolicy, { tool_calls: 6, reasoning_tokens: 500 });

  assert.strictEqual(result2.status, 'POLICY_BLOCKED', 'Status must report policy interdiction.');
  assert.strictEqual(result2.final_state, RuntimeState.FAILED_WITH_EVIDENCE, '[ABI-006]: FSM must transition cleanly to FAILED_WITH_EVIDENCE!');
  assert.strictEqual(result2.failure_category, FailureCategory.RESOURCE_EXHAUSTED, 'Failure must NOT be an unorganized error bucket; must tag explicit RESOURCE_EXHAUSTED!');
  assert.strictEqual(result2.evidence_reference.failure_category, FailureCategory.RESOURCE_EXHAUSTED, 'EvidenceRecord must preserve failure taxonomy.');
  console.log('✅ TEST 2 PASSED: Runtime proves "Failure is Data" with precise RESOURCE_EXHAUSTED categorization!\n');


  // =========================================================================
  // ✅ TEST 3: MUTATION ATTEMPT PROOF (Creator != Authority & CONTRACT_VIOLATION Taxonomy)
  // =========================================================================
  console.log('▶️ Running Test 3: Mutation Attempt Proof (Runtime Authority Boundary)...');
  const illegalProposal = {
    proposalId: 'prop-hack-001',
    sourceCapabilityId: 'driver-third-party-rogue',
    targetResource: 'FROZEN_INTENT',
    mutationType: 'MODIFY_INTENT',
    proposedDelta: { priority: 'LOW', business_outcome: 'Compromise system' }
  };

  const result3 = kernel.processMutationProposal(sampleIntent, samplePolicy, illegalProposal);

  assert.strictEqual(result3.status, 'MUTATION_REJECTED', 'Illegal mutation proposal must be authoritatively rejected.');
  assert.strictEqual(result3.final_state, RuntimeState.FAILED_WITH_EVIDENCE, 'FSM must shift to FAILED_WITH_EVIDENCE upon unauthorized mutation attempt.');
  assert.strictEqual(result3.failure_category, FailureCategory.CONTRACT_VIOLATION, 'Illegal mutation must tag explicit CONTRACT_VIOLATION taxonomy.');
  assert.ok(result3.diagnostics.includes('ABI-001_INTENT_MUTATION_FORBIDDEN'), 'Must flag explicit ABI-001 violation.');
  console.log('✅ TEST 3 PASSED: Runtime Authority repelled illegal mutation with explicit CONTRACT_VIOLATION taxonomy!\n');


  // =========================================================================
  // 🏆 FINAL SUMMARY REPORT
  // =========================================================================
  console.log('👑 ========================================================================= 👑');
  console.log('🏁 ALL CONFORMANCE & EVENT GOVERNANCE PROOFS VERIFIED SUCCESSFULLY!');
  console.log('🏆 PHASE 2.2 POLICY EVALUATION & EVENT GOVERNANCE LAYER IS OPERATIONAL!');
  console.log('👑 ========================================================================= 👑\n');

} catch (error) {
  console.error('❌ CONFORMANCE SUITE FAILED:', error.stack || error.message);
  process.exit(1);
}
