/**
 * AI Code Skin OS - Deterministic Replay Verification (HARDENING-016)
 * Proves the constitutional replay guarantee:
 * Same Input Contract + Same Runtime Constraints = Same Execution Trace (Independent of wall-clock time)
 */

import assert from 'assert';
import { KernelRuntime } from '../src/runtime/kernel.js';

console.log('👑 ========================================================================= 👑');
console.log('🚀 AI CODE SKIN OS - HARDENING-016 DETERMINISTIC REPLAY TEST SUITE STARTING...');
console.log('👑 ========================================================================= 👑\n');

// Canonical input contracts
const testIntent = {
  intent_id: 'intent-replay-atomic-001',
  business_outcome: 'Prove deterministic execution replayability',
  scope: 'AUDIT_REPLAY',
  target_environment: 'NODE_SANDBOX',
  priority: 'CRITICAL',
  contract_id: 'urn:agent-boundary:contract:intent-record',
  contract_version: '1.0.0',
  schema_version: '2020-12',
  created_at: '2026-01-01T00:00:00Z'
};

const testPolicy = {
  policy_id: 'policy-replay-atomic-001',
  parent_intent_id: 'intent-replay-atomic-001',
  cost_tier: 'TARGETED',
  resource_allowance: {
    tool_call_budget: 10,
    reasoning_burn_ceiling: 5000
  },
  safety_guardrails: {
    read_only_enforcement: true,
    forbidden_filesystem_paths: ['/root']
  },
  escalation_path: 'ABORT',
  contract_id: 'urn:agent-boundary:contract:policy-envelope',
  contract_version: '1.0.0',
  schema_version: '2020-12',
  created_at: '2026-01-01T00:00:00Z'
};

const testPlan = {
  plan_id: 'plan-replay-atomic-001',
  target_intent_id: 'intent-replay-atomic-001',
  policy_reference_id: 'policy-replay-atomic-001',
  reproducibility_hash: 'sha256:456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123',
  steps: [
    { capability_manifest_id: 'urn:agent-boundary:manifest:logger', parameters: { msg: 'Replay Step 1' } },
    { capability_manifest_id: 'urn:agent-boundary:manifest:analyzer', parameters: { mode: 'STRICT' } }
  ],
  fallback_strategy: 'ABORT',
  contract_id: 'urn:agent-boundary:contract:execution-plan',
  contract_version: '1.0.0',
  schema_version: '2020-12',
  created_at: '2026-01-01T00:00:00Z'
};

try {
  console.log('▶️ Instantiating Kernel Run A (Execution Pulse Alpha)...');
  const kernelA = new KernelRuntime(5000); // Initial Lamport tick: 5000
  const resultA = kernelA.executeLifecycle(testIntent, testPolicy, testPlan);
  const auditStreamA = kernelA.auditHistory;

  // Simulate external wall-clock progression between runs
  console.log('⏳ Simulating wall-clock time progression before Run B...');
  const delayStart = Date.now();
  while (Date.now() - delayStart < 20) { /* Brief synchronous spin loop */ }

  console.log('▶️ Instantiating Kernel Run B (Execution Pulse Beta - Separate wall-clock epoch)...');
  const kernelB = new KernelRuntime(5000); // Initial Lamport tick: 5000
  const resultB = kernelB.executeLifecycle(testIntent, testPolicy, testPlan);
  const auditStreamB = kernelB.auditHistory;

  console.log('▶️ Comparing Execution Traces across Run A and Run B...');
  assert.strictEqual(auditStreamA.length, auditStreamB.length, 'Audit streams must contain identical event count.');
  assert.strictEqual(resultA.invocation_requests.length, resultB.invocation_requests.length, 'Invocation requests must match.');

  for (let i = 0; i < auditStreamA.length; i++) {
    const recA = auditStreamA[i];
    const recB = auditStreamB[i];

    // Verify deterministic ordering without wall-clock timestamps
    assert.strictEqual(recA.sequence_number, recB.sequence_number, `Sequence mismatch at index ${i}`);
    assert.strictEqual(recA.logical_clock, recB.logical_clock, `Lamport logical clock mismatch at index ${i}`);
    assert.strictEqual(recA.event_category, recB.event_category, `Event category mismatch at index ${i}`);
    assert.strictEqual(recA.runtime_event_type, recB.runtime_event_type, `Runtime event type mismatch at index ${i}`);
    assert.strictEqual(recA.parent_evidence_id, recB.parent_evidence_id, `Parent evidence lineage mismatch at index ${i}`);

    // Verify causality lineage identity
    assert.strictEqual(recA.causality_lineage.parent_intent_id, recB.causality_lineage.parent_intent_id);
    assert.strictEqual(recA.causality_lineage.applied_policy_id, recB.causality_lineage.applied_policy_id);
    assert.strictEqual(recA.causality_lineage.executed_plan_id, recB.causality_lineage.executed_plan_id);
  }

  console.log('✅ REPLAY VERIFICATION PASSED: Run A and Run B yielded 100% identical logical clocks, sequences, lineages, and event traces!');
  console.log('🌟 HARDENING-016 PROVEN: "Same Input Contract + Same Runtime Constraints = Same Execution Trace"!\n');

  console.log('👑 ========================================================================= 👑');
  console.log('🏁 DETERMINISTIC TEST REPLAY SUITE PASSED EXCELLENTLY!');
  console.log('👑 ========================================================================= 👑\n');

} catch (error) {
  console.error('❌ REPLAY SUITE FAILED:', error.stack || error.message);
  process.exit(1);
}
