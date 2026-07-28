/**
 * AI Code Skin OS - Governed Memory Contract Models (ESM Standard)
 * Phase 5: Cognitive Memory & Knowledge Governance Plane
 * Implements:
 *  - [ABI-028] Fact Authenticity & Hallucination Interdiction (explicit classification of memory states)
 */

import { deepFreeze } from '../runtime/admission_boundary.js';

export const MemoryState = Object.freeze({
  VERIFIED_FACT: 'VERIFIED_FACT',       // Backed by immutable runtime evidence
  HYPOTHESIS: 'HYPOTHESIS',             // Untested inference or heuristic assertion
  UNVERIFIED_CLAIM: 'UNVERIFIED_CLAIM', // Raw AI text or un-attested statement
  REVOKED_MEMORY: 'REVOKED_MEMORY'      // [ABI-030] Terminated historical record
});

export class MemoryItem {
  /**
   * Constructs a governed memory unit.
   * @param {object} config - Memory coordinates, content, classification state, and evidence attestation
   */
  constructor({ itemId, key, value, state = MemoryState.UNVERIFIED_CLAIM, evidenceReference = null, sourceUri = 'memory://ephemeral' }) {
    if (!itemId || !key) {
      throw new Error('[MEMORY GOVERNANCE FAULT]: MemoryItem requires mandatory itemId and key.');
    }

    const payload = {
      item_id: itemId,
      key: key,
      value: value,
      classification_state: state,       // [ABI-028] Mandatory explicit state classification
      evidence_reference: evidenceReference, // Required if VERIFIED_FACT
      source_uri: sourceUri,
      contract_id: 'urn:agent-boundary:contract:memory-item',
      contract_version: '1.0.0',
      schema_version: '2020-12',
      created_at: new Date().toISOString()
    };

    return deepFreeze(payload);
  }
}

export class VerifiedFactRecord extends MemoryItem {
  constructor({ itemId, key, value, evidenceReference, sourceUri = 'memory://persistent/verified' }) {
    if (!evidenceReference) {
      throw new Error('[ABI-028 VIOLATION]: VerifiedFactRecord strictly demands valid evidenceReference attestation.');
    }
    super({
      itemId,
      key,
      value,
      state: MemoryState.VERIFIED_FACT,
      evidenceReference,
      sourceUri
    });
  }
}

export class UntrustedHypothesisRecord extends MemoryItem {
  constructor({ itemId, key, value, sourceUri = 'memory://untested/ai-inference' }) {
    super({
      itemId,
      key,
      value,
      state: MemoryState.HYPOTHESIS,
      evidenceReference: null,
      sourceUri
    });
  }
}
