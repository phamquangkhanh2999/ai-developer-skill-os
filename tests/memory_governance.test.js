/**
 * AI Code Skin OS - Phase 5 Cognitive Memory & Knowledge Governance Test Suite (ESM Standard)
 * Proves the foundational milestone:
 * "The Runtime not only rules execution and planning, but governs Cognitive Memory and Knowledge: strictly storing and serving verified facts, authoritatively forbidding unproven AI hypotheses and RAG hallucinations."
 * 
 * Verifies 5 normative cases:
 *  - Test 1: Unverified hypothesis rejected from persistent memory ([ABI-028] Hallucination Defense)
 *  - Test 2: Verified fact backed by runtime evidence admitted into long-term persistence ([ABI-028])
 *  - Test 3: RAG lineage traceability and low-trust chunk interdiction ([ABI-029])
 *  - Test 4: Governed memory eviction vs. silent deletion interdiction ([ABI-030])
 *  - Test 5: Vector Store knowledge engine replacement without kernel code modifications ([ABI-031])
 */

import assert from 'assert';
import { MemoryState, MemoryItem, VerifiedFactRecord, UntrustedHypothesisRecord } from '../src/memory/memory_contract.js';
import { FactValidator } from '../src/memory/fact_validator.js';
import { MemoryStore } from '../src/memory/memory_store.js';
import { KnowledgeBoundary } from '../src/memory/knowledge_boundary.js';
import { RagPipeline } from '../src/memory/rag_pipeline.js';
import { FailureCategory } from '../src/runtime/failure_semantics.js';

console.log('👑 ========================================================================= 👑');
console.log('🚀 AI CODE SKIN OS - PHASE 5 MEMORY & KNOWLEDGE GOVERNANCE TEST SUITE...');
console.log('👑 ========================================================================= 👑\n');

// Mock Vector Store Engines for Test 3 and Test 5 Proofs
class VectorStoreAlpha {
  constructor() { this.version = 'alpha-rag-v1'; }
  async retrieveChunks(query) {
    return [
      // Chunk A: Clean, verified, traceable lineage & high trust rank
      { chunk_id: 'chunk-verified-001', content: 'AI Code Skin relies on immutable ABI contracts.', source_uri: 'file:///docs/abi.md', extraction_epoch: '2026-07-28T10:00:00Z', content_hash: 'sha256:abc8891', trust_rank: 5 },
      // Chunk B: Poisoned RAG snippet missing provenance coordinates
      { chunk_id: 'chunk-untraceable-002', content: 'Unverified internet claim about system shortcuts.', source_uri: '', extraction_epoch: '', content_hash: '', trust_rank: 4 },
      // Chunk C: Low trust rank below acceptance threshold
      { chunk_id: 'chunk-low-trust-003', content: 'Draft hypothesis on unverified module capabilities.', source_uri: 'file:///drafts/ideas.txt', extraction_epoch: '2026-07-28T10:05:00Z', content_hash: 'sha256:def5542', trust_rank: 1 }
    ];
  }
}

class VectorStoreBeta {
  constructor() { this.version = 'beta-rag-v2-advanced'; }
  async retrieveChunks(query) {
    return [
      { chunk_id: 'beta-chunk-100', content: 'Upgraded Beta vector search confirms zero-trust architecture.', source_uri: 'file:///docs/architecture/200.md', extraction_epoch: '2026-07-28T11:00:00Z', content_hash: 'sha256:xyz9900', trust_rank: 5 }
    ];
  }
}

async function runPhase5Suite() {
  try {
    const memoryStore = new MemoryStore();

    // =========================================================================
    // ✅ TEST 1: UNVERIFIED HYPOTHESIS REJECTED FROM PERSISTENCE ([ABI-028])
    // =========================================================================
    console.log('▶️ Running Test 1: Unverified hypothesis rejected from persistent memory ([ABI-028])...');
    const hypothesisRecord = new UntrustedHypothesisRecord({
      itemId: 'mem-hyp-001',
      key: 'system_max_threads_prediction',
      value: 'AI predicts 1024 threads based on heuristic inference.'
    });

    const commitRes1 = memoryStore.commit(hypothesisRecord);
    assert.strictEqual(commitRes1.success, false, 'Unverified AI hypothesis must be forbidden from persistent memory.');
    assert.strictEqual(commitRes1.errorCode, 'ABI-028_HALLUCINATION_INTERDICTION', 'Must emit explicit HALLUCINATION_INTERDICTION error code.');
    assert.ok(commitRes1.message.includes('without runtime empirical evidence attestation'), 'Must output diagnostic warning.');
    console.log('✅ TEST 1 PASSED: Unverified hypothesis & AI claim authoritatively interdicted from memory repository!\n');


    // =========================================================================
    // ✅ TEST 2: VERIFIED FACT ADMITTED INTO PERSISTENCE ([ABI-028] Proof)
    // =========================================================================
    console.log('▶️ Running Test 2: Verified fact backed by runtime evidence admitted into persistence...');
    const verifiedFact = new VerifiedFactRecord({
      itemId: 'mem-fact-002',
      key: 'kernel_abi_version_confirmed',
      value: '1.0.0-FROZEN',
      evidenceReference: { evidence_id: 'ev-proof-888', invocation_id: 'invoc-test-core-001', result_hash: '0x7b9921ef' }
    });

    const commitRes2 = memoryStore.commit(verifiedFact);
    assert.strictEqual(commitRes2.success, true, 'Verified fact carrying empirical evidence must be admitted.');
    const storedItem = memoryStore.get('kernel_abi_version_confirmed');
    assert.ok(storedItem !== null, 'Item must reside safely inside MemoryStore.');
    assert.strictEqual(storedItem.classification_state, MemoryState.VERIFIED_FACT, 'Must maintain VERIFIED_FACT invariant state.');
    console.log(`✅ TEST 2 PASSED: Verified fact successfully stored in persistence: [Key: ${storedItem.key} -> Value: ${storedItem.value}]!\n`);


    // =========================================================================
    // ✅ TEST 3: RAG LINEAGE TRACEABILITY & LOW-TRUST INTERDICTION ([ABI-029])
    // =========================================================================
    console.log('▶️ Running Test 3: RAG lineage traceability and low-trust chunk interdiction ([ABI-029])...');
    const knowledgeBoundary = new KnowledgeBoundary(new VectorStoreAlpha());

    const ragOutcome = await RagPipeline.retrieveGovernedContext('architecture rules', knowledgeBoundary, 2);
    assert.strictEqual(ragOutcome.success, true, 'RAG extraction pipeline must complete successfully.');
    assert.strictEqual(ragOutcome.totalRetrieved, 3, 'Vector engine proposed 3 initial candidates.');
    assert.strictEqual(ragOutcome.admittedChunks.length, 1, 'Only 1 clean, traceable, high-trust chunk must be admitted.');
    assert.strictEqual(ragOutcome.rejectedChunks.length, 2, '2 untraceable/low-trust chunks must be authoritatively interdicted!');
    assert.strictEqual(ragOutcome.rejectedChunks[0].reason, 'ABI-029_MISSING_LINEAGE_ATTESTATION', 'Must identify missing lineage coordinates.');
    assert.strictEqual(ragOutcome.rejectedChunks[1].reason, 'ABI-029_INSUFFICIENT_RAG_TRUST', 'Must intercept low trust rank.');
    console.log(`✅ TEST 3 PASSED: RAG Pipeline purified retrieved context: Admitted ${ragOutcome.admittedChunks.length} chunk, Interdicted ${ragOutcome.rejectedChunks.length} unverified chunks!\n`);


    // =========================================================================
    // ✅ TEST 4: GOVERNED MEMORY EVICTION VS SILENT PURGE FORBIDDEN ([ABI-030])
    // =========================================================================
    console.log('▶️ Running Test 4: Governed memory eviction vs silent deletion interdiction ([ABI-030])...');
    
    // Attempt silent direct deletion by untrusted capability
    const deleteTry = memoryStore.directDelete('kernel_abi_version_confirmed', 'rogue-cleanup-plugin');
    assert.strictEqual(deleteTry.success, false, 'Silent un-audited memory purge must fail authoritatively.');
    assert.strictEqual(deleteTry.errorCode, 'ABI-030_SILENT_PURGE_FORBIDDEN', 'Must throw exact silent purge interdiction code.');
    console.log('   🛑 Silent un-audited memory deletion successfully repelled with ABI-030 defense!');

    // Execute formal Governed Eviction under an authorized Policy Envelope
    const evictRes = memoryStore.governedEvict('kernel_abi_version_confirmed', 'policy-memory-eviction-auth-777', 'System rebooting architecture to newer epoch');
    assert.strictEqual(evictRes.success, true, 'Governed memory eviction must succeed when presented with valid policy authorization.');
    assert.strictEqual(memoryStore.get('kernel_abi_version_confirmed'), null, 'Item must be cleanly removed from active memory map.');
    
    const history = memoryStore.getEvictionHistory();
    assert.strictEqual(history.length, 1, 'Revocation audit trail must record exactly 1 historical transition.');
    assert.strictEqual(history[0].classification_state, MemoryState.REVOKED_MEMORY, 'Revoked log must hold terminal REVOKED_MEMORY classification.');
    console.log(`✅ TEST 4 PASSED: Governed eviction completed cleanly; immutable revocation audit record preserved in history!\n`);


    // =========================================================================
    // ✅ TEST 5: KNOWLEDGE ENGINE REPLACEMENT WITHOUT KERNEL CHANGE ([ABI-031])
    // =========================================================================
    console.log('▶️ Running Test 5: Vector store knowledge engine replacement without kernel code change ([ABI-031])...');
    
    // Current boundary runs Alpha engine
    assert.strictEqual(knowledgeBoundary.activeEngine.version, 'alpha-rag-v1', 'Must begin with alpha vector engine.');

    // Execute seamless runtime replacement of knowledge engine behind URN contract without touching kernel or pipeline code!
    knowledgeBoundary.swapKnowledgeEngine(new VectorStoreBeta(), 'Upgrading to semantic embeddings engine v2');
    
    const betaRagOutcome = await RagPipeline.retrieveGovernedContext('zero-trust verification', knowledgeBoundary);
    assert.strictEqual(betaRagOutcome.success, true, 'Post-swap RAG pipeline query must succeed.');
    assert.strictEqual(betaRagOutcome.engineVersion, 'beta-rag-v2-advanced', 'Must confirm upgraded Beta vector engine identity.');
    assert.strictEqual(betaRagOutcome.admittedChunks[0].chunk_id, 'beta-chunk-100', 'Must serve high-trust results directly from swapped Beta store!');
    console.log('✅ TEST 5 PASSED: RAG Vector engine dynamically replaced behind contract without modifying microkernel state!\n');


    // =========================================================================
    // 🏆 FINAL SUMMARY REPORT
    // =========================================================================
    console.log('👑 ========================================================================= 👑');
    console.log('🏁 ALL 5 PHASE 5 COGNITIVE MEMORY & KNOWLEDGE GOVERNANCE PROOFS VERIFIED!');
    console.log('🌟 PROVEN: "AI Code Skin rules Cognitive Memory and Knowledge: Fact requires Evidence; Hallucinations die at the threshold."');
    console.log('👑 ========================================================================= 👑\n');

  } catch (err) {
    console.error('❌ PHASE 5 SUITE FAILED:', err.stack || err.message);
    process.exit(1);
  }
}

runPhase5Suite();
