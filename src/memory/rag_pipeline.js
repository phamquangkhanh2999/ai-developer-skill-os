/**
 * AI Code Skin OS - Governed RAG Retrieval Pipeline & Lineage Filter (ESM Standard)
 * Phase 5: Cognitive Memory & Knowledge Governance Plane
 * Implements:
 *  - [ABI-029] Knowledge Lineage & RAG Traceability (interdicts untraceable or low-trust chunks - Test 3 Proof)
 *  - Coordinating vector retrieval via KnowledgeBoundary ([ABI-031])
 */

import { FailureCategory } from '../runtime/failure_semantics.js';

export class RagPipeline {
  /**
   * Retrieves and authoritatively filters RAG documents against lineage attestation and trust rank requirements.
   * @param {string} queryText - Semantic query string
   * @param {object} knowledgeBoundary - Instance of KnowledgeBoundary
   * @param {number} minTrustRank - Minimum accepted trust rank threshold (default: 2 = VALIDATED)
   * @returns {object} { success: boolean, admittedChunks: Array, rejectedChunks: Array, errorCode: string|null }
   */
  static async retrieveGovernedContext(queryText, knowledgeBoundary, minTrustRank = 2) {
    if (!knowledgeBoundary || typeof knowledgeBoundary.queryKnowledge !== 'function') {
      return {
        success: false,
        admittedChunks: [],
        rejectedChunks: [],
        errorCode: 'INVALID_KNOWLEDGE_BOUNDARY',
        failureCategory: FailureCategory.INTERNAL_RUNTIME_FAILURE,
        message: 'RagPipeline demands a valid KnowledgeBoundary adapter.'
      };
    }

    const queryOutcome = await knowledgeBoundary.queryKnowledge(queryText);
    if (!queryOutcome.success) {
      return {
        success: false,
        admittedChunks: [],
        rejectedChunks: [],
        errorCode: queryOutcome.errorCode || 'RAG_QUERY_ABORTED',
        failureCategory: queryOutcome.failureCategory || FailureCategory.CONTRACT_VIOLATION,
        message: queryOutcome.message
      };
    }

    const rawChunks = queryOutcome.chunks || [];
    const admittedChunks = [];
    const rejectedChunks = [];

    for (const chunk of rawChunks) {
      // Enforce [ABI-029] Mandatory Lineage Attestation Coordinates
      const hasUri = typeof chunk.source_uri === 'string' && chunk.source_uri.length > 0;
      const hasEpoch = typeof chunk.extraction_epoch === 'string' || typeof chunk.timestamp === 'string';
      const hasHash = typeof chunk.content_hash === 'string' && chunk.content_hash.length > 0;
      const hasRank = typeof chunk.trust_rank === 'number';

      if (!hasUri || !hasEpoch || !hasHash || !hasRank) {
        rejectedChunks.push({
          chunk_id: chunk.chunk_id || 'unknown_chunk',
          reason: 'ABI-029_MISSING_LINEAGE_ATTESTATION',
          diagnostic: `[ABI-029 VIOLATION]: Chunk '${chunk.chunk_id || 'anonymous'}' lacks required provenance lineage (source_uri, extraction_epoch, content_hash, trust_rank). Interdiction enforced.`
        });
        continue;
      }

      // Verify Trust Rank against Minimum Acceptance Threshold
      if (chunk.trust_rank < minTrustRank) {
        rejectedChunks.push({
          chunk_id: chunk.chunk_id,
          reason: 'ABI-029_INSUFFICIENT_RAG_TRUST',
          diagnostic: `[ABI-029 VIOLATION]: Chunk '${chunk.chunk_id}' from '${chunk.source_uri}' holds trust_rank ${chunk.trust_rank}, below required threshold (${minTrustRank}). Rejected to prevent context poisoning.`
        });
        continue;
      }

      // Admitted verified chunk
      admittedChunks.push({
        chunk_id: chunk.chunk_id,
        content: chunk.content,
        source_uri: chunk.source_uri,
        extraction_epoch: chunk.extraction_epoch || chunk.timestamp,
        content_hash: chunk.content_hash,
        trust_rank: chunk.trust_rank,
        verified_by_rag: true
      });
    }

    return {
      success: true,
      admittedChunks,
      rejectedChunks,
      totalRetrieved: rawChunks.length,
      engineVersion: queryOutcome.engineVersion,
      message: `RAG retrieval complete. Admitted ${admittedChunks.length} verified chunk(s); interdicted ${rejectedChunks.length} untraceable/low-trust chunk(s).`
    };
  }
}
