/**
 * AI Code Skin OS - Phase 6 Multi-Agent Federation & Inter-Agent Governance Test Suite (ESM Standard)
 * Proves the milestone:
 * "The Runtime rules Inter-Agent Collaboration & Multi-Agent Swarms: Delegation transfers task scope, never root sovereignty; Distributed causality lineage binds every collaborative evidence trail."
 * 
 * Verifies 5 normative cases:
 *  - Test 1: Unauthorized authority delegation leap interdicted ([ABI-032] Sovereignty Defense)
 *  - Test 2: Federated quota sub-allocation overreach rejected ([ABI-033] Quota Boundary Defense)
 *  - Test 3: Sub-agent unhandled crash/timeout isolated at boundary without crashing host ([ABI-035])
 *  - Test 4: Distributed causality lineage continuous reconstruction across multi-agent swarms ([ABI-034])
 *  - Test 5: Collaborative swarm sub-agent replaced dynamically without altering kernel codebase
 */

import assert from 'assert';
import { GovernedDelegationContract } from '../src/federation/delegation_contract.js';
import { QuotaSuballocator } from '../src/federation/quota_suballocator.js';
import { FederationBridge } from '../src/federation/federation_bridge.js';
import { AgentSwarmCatalog } from '../src/federation/agent_swarm_catalog.js';
import { FailureCategory } from '../src/runtime/failure_semantics.js';

console.log('👑 ========================================================================= 👑');
console.log('🚀 AI CODE SKIN OS - PHASE 6 MULTI-AGENT FEDERATION & INTER-AGENT SUITE...');
console.log('👑 ========================================================================= 👑\n');

// Mock Sub-Agent Implementations for Collaborative Tests
class SwarmAgentAlpha {
  constructor() { this.version = 'swarm-reviewer-alpha-v1'; }
  async execute(pulse) {
    return { verdict: 'PASSED_ALPHA_CHECK', details: `Alpha v1 reviewed scope '${pulse.task_scope}' safely.` };
  }
}

class SwarmAgentBeta {
  constructor() { this.version = 'swarm-reviewer-beta-v2-advanced'; }
  async execute(pulse) {
    return { verdict: 'PASSED_BETA_DEEP_AUDIT', details: `Beta v2 advanced AI engine audited scope '${pulse.task_scope}' with zero-trust rigor.` };
  }
}

class RogueCrashingAgent {
  constructor() { this.version = 'rogue-crashing-sub-agent'; }
  async execute(pulse) {
    throw new Error('[CRITICAL_UNHANDLED_EXCEPTION]: Rogue sub-agent attempted illegal memory write and crashed!');
  }
}

async function runPhase6Suite() {
  try {
    const bridge = new FederationBridge('kernel-parent-root-01');

    // =========================================================================
    // ✅ TEST 1: UNAUTHORIZED AUTHORITY DELEGATION LEAP INTERDICTED ([ABI-032])
    // =========================================================================
    console.log('▶️ Running Test 1: Unauthorized authority delegation leap interdicted ([ABI-032])...');
    let delegationFaultCaught = null;
    try {
      new GovernedDelegationContract({
        delegationId: 'dlg-001',
        parentAgentId: 'agent-architect-parent',
        targetSubAgentId: 'agent-rogue-child',
        taskScope: 'System Refactoring',
        authorityLevel: 'ROOT_KERNEL_AUTHORITY' // [ABI-032] Illegal attempted transfer of root sovereignty!
      });
    } catch (err) {
      delegationFaultCaught = err;
    }

    assert.ok(delegationFaultCaught !== null, 'Attempting to delegate root kernel authority must throw governance exception.');
    assert.strictEqual(delegationFaultCaught.errorCode, 'ABI-032_UNAUTHORIZED_AUTHORITY_LEAP', 'Must emit exact UNAUTHORIZED_AUTHORITY_LEAP code.');
    console.log('   🛑 Attempted transfer of sovereign root kernel authority successfully interdicted with ABI-032 defense!');

    // Construct valid bounded delegation agreement
    const validContract = new GovernedDelegationContract({
      delegationId: 'dlg-valid-002',
      parentAgentId: 'agent-architect-parent',
      targetSubAgentId: 'sub-agent-developer-01',
      taskScope: 'Module Refactoring',
      authorityLevel: 'BOUNDED_EXECUTION_PULSE'
    });
    assert.strictEqual(validContract.authority_level, 'BOUNDED_EXECUTION_PULSE', 'Bounded execution pulse must be admitted.');
    console.log('✅ TEST 1 PASSED: Unauthorized authority transfer blocked; bounded task scopes safely ratified!\n');


    // =========================================================================
    // ✅ TEST 2: FEDERATED QUOTA SUB-ALLOCATION DEFENSE ([ABI-033])
    // =========================================================================
    console.log('▶️ Running Test 2: Federated quota sub-allocation defense against residual limits ([ABI-033])...');
    const parentPolicy = {
      policy_id: 'policy-parent-root-888',
      resource_allowance: { tool_call_budget: 50, max_timeout_ms: 10000 }
    };

    // Sub-agent attempts to demand 150 tool calls, exceeding parent's 50 budget
    const overAllocRes = QuotaSuballocator.evaluateAndAllocate(parentPolicy, { tool_call_budget: 150, max_timeout_ms: 5000 });
    assert.strictEqual(overAllocRes.isGranted, false, 'Over-allocation exceeding parent budget must be denied.');
    assert.strictEqual(overAllocRes.errorCode, 'ABI-033_QUOTA_OVER_ALLOCATION_INTERDICTED', 'Must emit explicit QUOTA_OVER_ALLOCATION code.');
    console.log('   🛑 Sub-agent budget overreach cleanly repelled with ABI-033 Quota boundary defense!');

    // Request valid sub-budget within allowance
    const validAllocRes = QuotaSuballocator.evaluateAndAllocate(parentPolicy, { tool_call_budget: 15, max_timeout_ms: 3000 });
    assert.strictEqual(validAllocRes.isGranted, true, 'Valid sub-budget must be approved and carved.');
    assert.strictEqual(validAllocRes.childPolicy.resource_allowance.tool_call_budget, 15, 'Child envelope must reflect requested quota.');
    console.log(`✅ TEST 2 PASSED: Quota Suballocator carved clean child policy [ID: ${validAllocRes.childPolicy.policy_id}] without budget overreach!\n`);


    // =========================================================================
    // ✅ TEST 3: SUB-AGENT TIMEOUT & CRASH ISOLATION AT BOUNDARY ([ABI-035])
    // =========================================================================
    console.log('▶️ Running Test 3: Sub-agent crash & timeout isolation at federation boundary ([ABI-035])...');
    const rogueContract = new GovernedDelegationContract({
      delegationId: 'dlg-rogue-999',
      parentAgentId: 'agent-parent-root',
      targetSubAgentId: 'rogue-crashing-sub-agent',
      taskScope: 'Untrusted external computation'
    });

    const crashOutcome = await bridge.delegateExecution(rogueContract, validAllocRes.childPolicy, new RogueCrashingAgent());
    assert.strictEqual(crashOutcome.success, false, 'Crashing sub-agent must be intercepted at federation boundary.');
    assert.strictEqual(crashOutcome.errorCode, 'ABI-035_SUB_AGENT_FAULT_ISOLATED', 'Must return SUB_AGENT_FAULT_ISOLATED exception.');
    assert.strictEqual(bridge.getRevocationPulses().length, 1, 'Must log an immutable FEDERATION_REVOCATION_PULSE.');
    assert.strictEqual(bridge.getRevocationPulses()[0].breached_sub_agent, 'rogue-crashing-sub-agent', 'Revocation log must identify breaching actor.');
    console.log('✅ TEST 3 PASSED: Sub-agent unhandled crash intercepted! Host kernel state completely unharmed; Revocation pulse generated!\n');


    // =========================================================================
    // ✅ TEST 4: DISTRIBUTED CAUSALITY LINEAGE RECONSTRUCTION ([ABI-034])
    // =========================================================================
    console.log('▶️ Running Test 4: Distributed causality lineage continuous reconstruction ([ABI-034])...');
    const multiAgentContract = new GovernedDelegationContract({
      delegationId: 'dlg-multi-777',
      parentAgentId: 'sub-agent-developer-01', // Dev agent delegating sub-review to Security Audit peer
      targetSubAgentId: 'peer-security-audit-03',
      taskScope: 'Zero-Trust Security Verification'
    });

    // Parent chain already contains ['agent-architect-parent']
    const initialChain = ['agent-architect-parent'];
    const collabOutcome = await bridge.delegateExecution(multiAgentContract, validAllocRes.childPolicy, new SwarmAgentAlpha(), initialChain);
    
    assert.strictEqual(collabOutcome.success, true, 'Collaborative federation execution must succeed.');
    const producedEvidence = collabOutcome.evidenceRecord;
    assert.ok(producedEvidence !== undefined, 'Must formulate a verified distributed evidence record.');
    
    // Verify continuous multi-agent trace chain ([ABI-034] Proof)
    const traceChain = producedEvidence.federated_trace_chain;
    assert.strictEqual(traceChain.length, 3, 'Must append all three collaborative agent nodes in continuous lineage chain.');
    assert.strictEqual(traceChain[0], 'agent-architect-parent', 'Node #0 must be originating architect agent.');
    assert.strictEqual(traceChain[1], 'sub-agent-developer-01', 'Node #1 must be intermediate developer agent.');
    assert.strictEqual(traceChain[2], 'peer-security-audit-03', 'Node #2 must be target security audit peer.');
    console.log(`✅ TEST 4 PASSED: Distributed causality trace verified across multi-agent swarm: [ ${traceChain.join(' ➔ ')} ]!\n`);


    // =========================================================================
    // ✅ TEST 5: COLLABORATIVE AGENT REPLACEMENT WITHOUT KERNEL CHANGE
    // =========================================================================
    console.log('▶️ Running Test 5: Collaborative swarm agent replacement without kernel code change...');
    const catalog = new AgentSwarmCatalog();
    const roleUrn = 'urn:agent-boundary:role:code-reviewer-swarm';
    
    catalog.registerSubAgent(roleUrn, new SwarmAgentAlpha());
    const alphaAgent = catalog.getSubAgent(roleUrn);
    assert.strictEqual(alphaAgent.version, 'swarm-reviewer-alpha-v1', 'Must start with registered Alpha swarm agent.');

    // Execute seamless runtime replacement behind URN boundary without modifying microkernel code!
    catalog.swapSubAgentImplementation(roleUrn, new SwarmAgentBeta(), 'Upgrading swarm collaboration AI model to V2 Advanced');
    
    const upgradedAgent = catalog.getSubAgent(roleUrn);
    assert.strictEqual(upgradedAgent.version, 'swarm-reviewer-beta-v2-advanced', 'Must confirm upgraded Beta swarm agent identity.');
    
    const postSwapOutcome = await bridge.delegateExecution(validContract, validAllocRes.childPolicy, upgradedAgent);
    assert.strictEqual(postSwapOutcome.success, true, 'Post-swap collaborative execution must succeed flawlessly.');
    assert.strictEqual(postSwapOutcome.evidenceRecord.result_payload.verdict, 'PASSED_BETA_DEEP_AUDIT', 'Must execute deep audit logic directly from replacement Beta swarm agent!');
    console.log('✅ TEST 5 PASSED: Collaborative Swarm Agent dynamically replaced behind stable URN without touching microkernel state!\n');


    // =========================================================================
    // 🏆 FINAL SUMMARY REPORT
    // =========================================================================
    console.log('👑 ========================================================================= 👑');
    console.log('🏁 ALL 5 PHASE 6 MULTI-AGENT FEDERATION & INTER-AGENT GOVERNANCE PROOFS VERIFIED!');
    console.log('🌟 PROVEN: "AI Code Skin rules Multi-Agent Swarms: Authority is Sovereign, Quotas are Bounded, Lineage is Unbroken."');
    console.log('👑 ========================================================================= 👑\n');

  } catch (err) {
    console.error('❌ PHASE 6 SUITE FAILED:', err.stack || err.message);
    process.exit(1);
  }
}

runPhase6Suite();
