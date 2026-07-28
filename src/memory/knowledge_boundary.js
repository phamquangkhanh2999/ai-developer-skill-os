/**
 * AI Code Skin OS - Knowledge & RAG Boundary Isolation Wrapper (ESM Standard)
 * Phase 5: Cognitive Memory & Knowledge Governance Plane
 * Implements:
 *  - [ABI-031] Untrusted RAG Engine Boundary Isolation
 *  - Supports dynamic VectorStore / RAG Engine replacement without kernel code modifications (Test 5 Proof)
 */

import { FailureCategory } from '../runtime/failure_semantics.js';

export class KnowledgeBoundary {
  constructor(initialVectorEngine, contractId = 'urn:agent-boundary:knowledge:vector-adapter') {
    this.activeEngine = initialVectorEngine;
    this.contractId = contractId;
    this.swapHistory = [];
  }

  /**
   * Replaces the active RAG retrieval engine behind an invariant semantic contract without modifying microkernel code!
   */
  swapKnowledgeEngine(newEngineDriver, reason = 'Upgraded semantic embeddings and indexing models') {
    if (!newEngineDriver || typeof newEngineDriver.retrieveChunks !== 'function') {
      throw new Error('[KNOWLEDGE BOUNDARY FAULT]: Replacement vector engine must implement retrieveChunks() interface.');
    }
    const previousVersion = this.activeEngine ? this.activeEngine.version || 'v1' : 'unknown';
    this.activeEngine = newEngineDriver;
    this.swapHistory.push({ from: previousVersion, to: newEngineDriver.version || 'v2', reason, swapped_at: new Date().toISOString() });
    return true;
  }

  /**
   * Invokes the untrusted vector store to retrieve semantic knowledge chunks.
   * Enforces [ABI-031]: Untrusted retrievers operate behind safe boundary guardrails.
   */
  async queryKnowledge(queryText, options = {}) {
    if (!this.activeEngine || typeof this.activeEngine.retrieveChunks !== 'function') {
      return {
        success: false,
        chunks: [],
        errorCode: 'MISSING_VECTOR_ENGINE',
        failureCategory: FailureCategory.INTERNAL_RUNTIME_FAILURE,
        message: 'No capable vector engine registered within KnowledgeBoundary.'
      };
    }

    try {
      const chunks = await this.activeEngine.retrieveChunks(queryText, options);
      return {
        success: true,
        chunks: Array.isArray(chunks) ? chunks : [chunks],
        engineVersion: this.activeEngine.version || 'unknown',
        contractId: this.contractId
      };
    } catch (err) {
      return {
        success: false,
        chunks: [],
        errorCode: 'RAG_RETRIEVAL_FAULT',
        failureCategory: FailureCategory.CONTRACT_VIOLATION,
        message: `[ABI-031 DEFENSE]: Untrusted RAG engine threw exception during retrieval: ${err.message}`
      };
    }
  }
}
