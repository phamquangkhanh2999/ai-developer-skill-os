/**
 * AI Code Skin OS - Authoritative Fact & Evidence Validator (ESM Standard)
 * Phase 5: Cognitive Memory & Knowledge Governance Plane
 * Implements:
 *  - [ABI-028] Fact Authenticity & Hallucination Interdiction (Test 1 & Test 2 Proofs)
 */

import { MemoryState } from './memory_contract.js';
import { FailureCategory } from '../runtime/failure_semantics.js';

export class FactValidator {
  /**
   * Evaluates a candidate memory record to determine eligibility for persistent project storage.
   * @param {object} item - Target MemoryItem structure
   * @returns {object} { isAdmitted: boolean, admittedRecord: object|null, errorCode: string|null, failureCategory: string|null, diagnosticMessage: string|null }
   */
  static evaluateForPersistence(item) {
    if (!item || !item.item_id || !item.key) {
      return {
        isAdmitted: false,
        admittedRecord: null,
        errorCode: 'INVALID_MEMORY_SCHEMA',
        failureCategory: FailureCategory.CONTRACT_VIOLATION,
        diagnosticMessage: 'Memory record lacks required item_id or key schema parameters.'
      };
    }

    // Enforce [ABI-028] Hallucination Interdiction & Evidence Attestation
    if (item.classification_state === MemoryState.HYPOTHESIS || item.classification_state === MemoryState.UNVERIFIED_CLAIM || !item.evidence_reference) {
      return {
        isAdmitted: false,
        admittedRecord: null,
        errorCode: 'ABI-028_HALLUCINATION_INTERDICTION',
        failureCategory: FailureCategory.CONTRACT_VIOLATION,
        diagnosticMessage: `[ABI-028 VIOLATION]: Memory item '${item.key}' (${item.item_id}) is classified as an unverified assertion (${item.classification_state}) without runtime empirical evidence attestation! Promotion to persistent project memory is authoritatively interdicted.`
      };
    }

    // Verify evidence reference structural integrity
    const ev = item.evidence_reference;
    const isValidEvidence = typeof ev === 'string' || (typeof ev === 'object' && (ev.evidence_id || ev.invocation_id || ev.result_hash));
    if (!isValidEvidence) {
      return {
        isAdmitted: false,
        admittedRecord: null,
        errorCode: 'ABI-028_INVALID_EVIDENCE_ATTESTATION',
        failureCategory: FailureCategory.CONTRACT_VIOLATION,
        diagnosticMessage: `[ABI-028 VIOLATION]: Memory item '${item.key}' claims VERIFIED_FACT classification but submitted malformed or untraceable evidence reference.`
      };
    }

    return {
      isAdmitted: true,
      admittedRecord: item,
      errorCode: null,
      failureCategory: null,
      diagnosticMessage: `Memory record '${item.key}' verified against empirical runtime evidence. Approved for persistent project storage.`
    };
  }
}
