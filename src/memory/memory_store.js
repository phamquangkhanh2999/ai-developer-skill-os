/**
 * AI Code Skin OS - Authoritative Persistent Memory Store (ESM Standard)
 * Phase 5: Cognitive Memory & Knowledge Governance Plane
 * Implements:
 *  - [ABI-028] Governed Fact Persistence via FactValidator
 *  - [ABI-030] Memory Mutation & Governed Eviction Contract (interdicts silent deletions; records revocation trails)
 */

import { FactValidator } from './fact_validator.js';
import { MemoryState } from './memory_contract.js';
import { FailureCategory } from '../runtime/failure_semantics.js';
import { deepFreeze } from '../runtime/admission_boundary.js';

export class MemoryStore {
  constructor() {
    this._activeMemory = new Map(); // key -> verified memory record
    this._evictionHistory = [];     // immutable trail of REVOKED_MEMORY_RECORDS
  }

  get(key) {
    return this._activeMemory.get(key) || null;
  }

  listKeys() {
    return Array.from(this._activeMemory.keys());
  }

  getEvictionHistory() {
    return this._evictionHistory;
  }

  /**
   * Commits a candidate memory item into long-term project storage after passing FactValidator gates.
   */
  commit(candidateItem) {
    const verdict = FactValidator.evaluateForPersistence(candidateItem);
    if (!verdict.isAdmitted) {
      return {
        success: false,
        errorCode: verdict.errorCode,
        failureCategory: verdict.failureCategory,
        message: verdict.diagnosticMessage
      };
    }

    this._activeMemory.set(candidateItem.key, verdict.admittedRecord);
    return {
      success: true,
      errorCode: null,
      message: `Memory item '${candidateItem.key}' committed successfully into persistent storage.`
    };
  }

  /**
   * Attempts direct silent deletion of a stored memory item by an untrusted actor.
   * Authoritatively forbidden under [ABI-030]!
   */
  directDelete(key, actor = 'untrusted_capability_or_plugin') {
    if (this._activeMemory.has(key)) {
      return {
        success: false,
        errorCode: 'ABI-030_SILENT_PURGE_FORBIDDEN',
        failureCategory: FailureCategory.CONTRACT_VIOLATION,
        message: `[ABI-030 VIOLATION]: Actor '${actor}' attempted silent un-audited purge of verified memory item '${key}'. Authoritatively forbidden! Use governedEvict with valid policy envelope.`
      };
    }
    return { success: false, errorCode: 'ITEM_NOT_FOUND', message: `Memory item '${key}' does not exist.` };
  }

  /**
   * Executes a governed eviction and archive transition under an authoritative policy contract ([ABI-030]).
   */
  governedEvict(key, policyReferenceId, reason = 'Outdated facts replaced by recent verified architecture upgrade') {
    if (!this._activeMemory.has(key)) {
      return { success: false, errorCode: 'ITEM_NOT_FOUND', message: `Cannot evict nonexistent memory item '${key}'.` };
    }

    if (!policyReferenceId || typeof policyReferenceId !== 'string') {
      return {
        success: false,
        errorCode: 'ABI-030_MISSING_POLICY_ENVELOPE',
        failureCategory: FailureCategory.POLICY_DENIED,
        message: `[ABI-030 VIOLATION]: Governed eviction of '${key}' requires mandatory policyReferenceId authorization.`
      };
    }

    const existingRecord = this._activeMemory.get(key);
    this._activeMemory.delete(key);

    // Formulate immutable revocation audit record
    const revokedRecord = deepFreeze({
      revoked_item_id: existingRecord.item_id,
      key: existingRecord.key,
      previous_value: existingRecord.value,
      original_evidence: existingRecord.evidence_reference,
      classification_state: MemoryState.REVOKED_MEMORY,
      evicted_by_policy: policyReferenceId,
      revocation_reason: reason,
      evicted_at: new Date().toISOString()
    });

    this._evictionHistory.push(revokedRecord);

    return {
      success: true,
      evictedKey: key,
      revokedRecord,
      message: `Memory item '${key}' cleanly evicted under governed policy '${policyReferenceId}'. Revocation audit trail preserved.`
    };
  }
}
