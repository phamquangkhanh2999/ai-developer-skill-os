/**
 * AI Code Skin OS - Phase 3 Capability Governance & Discovery Plane Test Suite (ESM Standard)
 * Verifies the transformation from "hardcoded extension" to a Governed Capability Ecosystem!
 * 
 * Executes 5 normative tests:
 *  - Test 1: Unknown capability rejected at discovery boundary
 *  - Test 2: Verified capability admitted under sequential promotion ([ABI-018] & [ABI-020])
 *  - Test 3: Capability ABI mismatch rejected authoritatively
 *  - Test 4: Trust downgrade enforced & illegal promotion leaps interdicted ([ABI-020])
 *  - Test 5: Capability implementation replacement behind contract without kernel code change
 */

import assert from 'assert';
import { CapabilityCatalog } from '../src/capability/capability_catalog.js';
import { TrustLevel } from '../src/capability/trust_evaluator.js';
import { FailureCategory } from '../src/runtime/failure_semantics.js';

console.log('👑 ========================================================================= 👑');
console.log('🚀 AI CODE SKIN OS - PHASE 3 CAPABILITY GOVERNANCE & DISCOVERY TEST SUITE...');
console.log('👑 ========================================================================= 👑\n');

const catalog = new CapabilityCatalog('1.0.0'); // Initialize Discovery Plane against Kernel ABI 1.0.0

// Sample manifest structure conforming to ABI-018 & ABI-019
const sampleManifest = {
  capability_manifest_id: 'urn:agent-boundary:manifest:logger-agent',
  capability_name: 'Governed Audit Logger',
  capability_contract_version: '1.0.0',
  target_kernel_abi: '1.0.0',
  determinism: 'deterministic', // [ABI-019]
  resource_requirements: {      // [ABI-018]
    cpu_budget: 15,
    memory_budget: 1024,
    execution_timeout: 500,
    external_access_scope: ['file:///tmp/audit.log']
  },
  contract_id: 'urn:agent-boundary:contract:capability-manifest',
  contract_version: '1.0.0',
  schema_version: '2020-12'
};

class DummyDriverV1 {
  constructor() { this.version = 'v1'; }
  async execute() { return { output: { impl: 'alpha_implementation' } }; }
}

class DummyDriverV2 {
  constructor() { this.version = 'v2'; }
  async execute() { return { output: { impl: 'beta_upgraded_implementation' } }; }
}

try {
  // =========================================================================
  // ✅ TEST 1: UNKNOWN CAPABILITY REJECTED (Zero-Trust Discovery Defense)
  // =========================================================================
  console.log('▶️ Running Test 1: Unknown capability rejected at discovery plane...');
  const res1 = catalog.discoverAndAdmit('urn:agent-boundary:manifest:unregistered-ghost');

  assert.strictEqual(res1.isAdmitted, false, 'Unknown capability must be authoritatively denied admission.');
  assert.strictEqual(res1.errorCode, 'UNKNOWN_CAPABILITY_REJECTED', 'Must yield accurate interdiction code.');
  assert.strictEqual(res1.failureCategory, FailureCategory.CONTRACT_VIOLATION, 'Must tag explicit CONTRACT_VIOLATION taxonomy.');
  console.log('✅ TEST 1 PASSED: Unknown capability rejected! Untrusted foreign invocation thwarted at discovery boundary.\n');


  // =========================================================================
  // ✅ TEST 2: VERIFIED CAPABILITY ADMITTED (Sequential Promotion [ABI-020])
  // =========================================================================
  console.log('▶️ Running Test 2: Verified capability admitted under sequential promotion...');
  const regOutcome = catalog.registerCapability(sampleManifest, new DummyDriverV1());
  assert.strictEqual(regOutcome.success, true, 'Manifest conforming to ABI-018 resource rules must load cleanly.');
  assert.strictEqual(regOutcome.trustLevel, TrustLevel.REGISTERED, 'Initial trust rank must start strictly at REGISTERED.');

  // Sequentially promote trust tier: REGISTERED -> VALIDATED -> SANDBOXED -> VERIFIED
  catalog.promoteTrust(sampleManifest.capability_manifest_id, TrustLevel.VALIDATED, 'Unit test pass');
  catalog.promoteTrust(sampleManifest.capability_manifest_id, TrustLevel.SANDBOXED, 'Sandbox safety checked');
  const promoOutcome = catalog.promoteTrust(sampleManifest.capability_manifest_id, TrustLevel.VERIFIED, 'Formal verification complete');
  assert.strictEqual(promoOutcome.success, true, 'Sequential promotion to VERIFIED must succeed.');

  const res2 = catalog.discoverAndAdmit(sampleManifest.capability_manifest_id, null, TrustLevel.VERIFIED);
  assert.strictEqual(res2.isAdmitted, true, 'Verified capability must gain complete execution admission.');
  assert.strictEqual(res2.driver.version, 'v1', 'Admitted payload must yield bound driver implementation.');
  console.log('✅ TEST 2 PASSED: Verified capability admitted! Sequential promotion gates satisfied flawlessly.\n');


  // =========================================================================
  // ✅ TEST 3: CAPABILITY ABI MISMATCH REJECTED (Kernel ABI Protection)
  // =========================================================================
  console.log('▶️ Running Test 3: Capability ABI mismatch rejected...');
  const futureManifest = {
    ...sampleManifest,
    capability_manifest_id: 'urn:agent-boundary:manifest:future-agent',
    target_kernel_abi: '5.0.0' // Requires unreleased future kernel ABI
  };

  catalog.registerCapability(futureManifest, new DummyDriverV1());
  catalog.promoteTrust('urn:agent-boundary:manifest:future-agent', TrustLevel.VALIDATED);

  const res3 = catalog.discoverAndAdmit('urn:agent-boundary:manifest:future-agent');
  assert.strictEqual(res3.isAdmitted, false, 'Incompatible target ABI must be denied admission.');
  assert.strictEqual(res3.errorCode, 'ABI_VERSION_MISMATCH', 'Must explicitly report ABI_VERSION_MISMATCH.');
  assert.ok(res3.diagnosticMessage.includes('requires kernel ABI \'5.0.0\''), 'Must provide diagnostic version details.');
  console.log('✅ TEST 3 PASSED: Capability ABI mismatch rejected authoritatively! Kernel version boundaries inviolable.\n');


  // =========================================================================
  // ✅ TEST 4: TRUST DOWNGRADE ENFORCED & ILLEGAL LEAPS INTERDICTED ([ABI-020])
  // =========================================================================
  console.log('▶️ Running Test 4: Trust downgrade enforced & illegal promotion leaps blocked...');
  const rogueManifest = {
    ...sampleManifest,
    capability_manifest_id: 'urn:agent-boundary:manifest:untrusted-rogue'
  };
  catalog.registerCapability(rogueManifest, new DummyDriverV1()); // Starts at REGISTERED

  // Try an illegal leap directly from REGISTERED to TRUSTED
  const illegalLeap = catalog.promoteTrust('urn:agent-boundary:manifest:untrusted-rogue', TrustLevel.TRUSTED);
  assert.strictEqual(illegalLeap.success, false, 'Arbitrary trust leaps must be forbidden under ABI-020.');
  assert.strictEqual(illegalLeap.code, 'ABI-020_ILLEGAL_TRUST_LEAP', 'Must return ABI-020 violation code.');

  // Legally promote to VALIDATED (which satisfies default admission)
  catalog.promoteTrust('urn:agent-boundary:manifest:untrusted-rogue', TrustLevel.VALIDATED);
  assert.strictEqual(catalog.discoverAndAdmit('urn:agent-boundary:manifest:untrusted-rogue').isAdmitted, true, 'Must pass when VALIDATED.');

  // Enforce runtime security downgrade to REGISTERED
  const downgrade = catalog.downgradeTrust('urn:agent-boundary:manifest:untrusted-rogue', TrustLevel.REGISTERED, 'Security anomaly detected');
  assert.strictEqual(downgrade.success, true, 'Trust downgrade must apply instantaneously.');

  // Verify subsequent admission attempt is interdicted
  const postDowngrade = catalog.discoverAndAdmit('urn:agent-boundary:manifest:untrusted-rogue', null, TrustLevel.VALIDATED);
  assert.strictEqual(postDowngrade.isAdmitted, false, 'Downgraded capability must fail subsequent admission.');
  assert.strictEqual(postDowngrade.errorCode, 'INSUFFICIENT_TRUST_HIERARCHY', 'Must enforce insufficient trust hierarchy exception.');
  console.log('✅ TEST 4 PASSED: Illegal trust leaps thwarted & runtime trust downgrade enforced immediately!\n');


  // =========================================================================
  // ✅ TEST 5: CAPABILITY REPLACEMENT WITHOUT KERNEL CHANGE (Dynamic Decoupling)
  // =========================================================================
  console.log('▶️ Running Test 5: Capability replacement without kernel code change...');
  const swapManifest = {
    ...sampleManifest,
    capability_manifest_id: 'urn:agent-boundary:manifest:swappable-engine'
  };

  // Register initial Alpha Implementation (V1)
  catalog.registerCapability(swapManifest, new DummyDriverV1());
  catalog.promoteTrust('urn:agent-boundary:manifest:swappable-engine', TrustLevel.VALIDATED);
  const initialAdmit = catalog.discoverAndAdmit('urn:agent-boundary:manifest:swappable-engine');
  assert.strictEqual(initialAdmit.driver.version, 'v1', 'Initial discovery must return V1 driver.');

  // Execute seamless runtime replacement behind invariant URN contract without touching Kernel!
  const swapOutcome = catalog.replaceImplementation('urn:agent-boundary:manifest:swappable-engine', new DummyDriverV2());
  assert.strictEqual(swapOutcome.success, true, 'Implementation swap must succeed under contract.');

  // Re-discover and verify upgraded Beta Implementation (V2)
  const upgradedAdmit = catalog.discoverAndAdmit('urn:agent-boundary:manifest:swappable-engine');
  assert.strictEqual(upgradedAdmit.driver.version, 'v2', 'Post-swap discovery must yield upgraded V2 driver without altering kernel state!');
  console.log('✅ TEST 5 PASSED: Driver implementation replaced seamlessly behind contract URN without modifying microkernel code!\n');


  // =========================================================================
  // 🏆 FINAL SUMMARY REPORT
  // =========================================================================
  console.log('👑 ========================================================================= 👑');
  console.log('🏁 ALL 5 PHASE 3 CAPABILITY GOVERNANCE & DISCOVERY PROOFS VERIFIED!');
  console.log('🌟 PROVEN: "AI Code Skin has ascended into a Governed Capability Platform."');
  console.log('👑 ========================================================================= 👑\n');

} catch (err) {
  console.error('❌ PHASE 3 SUITE FAILED:', err.stack || err.message);
  process.exit(1);
}
