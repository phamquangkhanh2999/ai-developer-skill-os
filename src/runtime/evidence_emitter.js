/**
 * AI Code Skin OS - Governed Evidence Emission Pipeline (ESM Standard)
 * Implements continuous audit stream and constitutional requirements:
 *  - [ABI-003] Append-Only Event Stream & "Evidence ≠ Replay"
 *  - [ABI-008] Canonical Contract Identity Binding
 *  - [ABI-011] Decision Traceability provider
 *  - HARDENING-013 & HARDENING-014: Runtime Event bridge & Lamport Logical Clock atomic ordering
 */

import crypto from 'crypto';
import { deepFreeze } from './admission_boundary.js';
import { LogicalClock } from './logical_clock.js';
import { RuntimeEvent, RuntimeEventType } from './runtime_events.js';

export class EvidenceEmitter {
  constructor(streamId = 'audit-stream-main', initialLogicalTick = 1000) {
    this.streamId = streamId;
    this._eventLog = [];
    this._logicalClock = new LogicalClock(initialLogicalTick);
  }

  get streamHistory() {
    return this._eventLog.slice();
  }

  get currentClockTick() {
    return this._logicalClock.currentLogicalTick;
  }

  /**
   * Emits an immutable EvidenceRecord node into the audit stream, binding monotonic clock lineage.
   * @param {object} params - { eventCategory, causalityLineage, diagnosticDetails, rawContentToDigest, runtimeEvent, failureCategory }
   * @returns {object} Immutable EvidenceRecord artifact
   */
  emitEvidence({ eventCategory, causalityLineage, diagnosticDetails = null, rawContentToDigest = null, runtimeEvent = null, failureCategory = null }) {
    if (!causalityLineage || !causalityLineage.parent_intent_id || !causalityLineage.applied_policy_id) {
      throw new Error('[ABI-011 VIOLATION]: Cannot emit EvidenceRecord without mandatory causality lineage pointers.');
    }

    // Determine event parameters from RuntimeEvent if provided (HARDENING-013)
    let finalCategory = eventCategory || 'POLICY_AUTHORIZATION';
    let eventType = 'StandardKernelOp';
    let details = diagnosticDetails;

    if (runtimeEvent instanceof RuntimeEvent) {
      const template = runtimeEvent.toEvidenceTemplate();
      finalCategory = eventCategory || template.eventCategory;
      eventType = template.runtimeEventType;
      details = diagnosticDetails || template.diagnosticDetails;
      if (!rawContentToDigest && template.rawPayload) {
        rawContentToDigest = template.rawPayload;
      }
    }

    // Generate deterministic Lamport ordering coordinates (HARDENING-014)
    const nextSequence = this._logicalClock.currentSequence + 1;
    const evidenceId = `ev-uuid-${nextSequence}-${this._logicalClock.currentLogicalTick + 1}`;
    const clockMetadata = this._logicalClock.tick(evidenceId);
    
    const artifactDigests = [];
    if (rawContentToDigest) {
      const hash = crypto.createHash('sha256').update(typeof rawContentToDigest === 'string' ? rawContentToDigest : JSON.stringify(rawContentToDigest)).digest('hex');
      artifactDigests.push(`sha256:${hash}`);
    }

    const evidenceRecord = {
      evidence_id: evidenceId,
      sequence_number: clockMetadata.sequence_number,
      logical_clock: clockMetadata.logical_clock,
      parent_evidence_id: clockMetadata.parent_evidence_id,
      timestamp: new Date().toISOString(),
      event_category: finalCategory,
      runtime_event_type: eventType,
      failure_category: failureCategory || null,
      causality_lineage: { ...causalityLineage },
      contract_reference: {
        contract_id: 'urn:agent-boundary:contract:kernel-abi',
        kernel_abi_version: '1.0.0',
        capability_contract_version: '1.0.0'
      },
      diagnostic_details: details,
      artifact_digests: artifactDigests,
      contract_id: 'urn:agent-boundary:contract:evidence-record',
      contract_version: '1.0.0',
      schema_version: '2020-12',
      created_at: new Date().toISOString()
    };

    const frozenRecord = deepFreeze(evidenceRecord);
    this._eventLog.push(frozenRecord);
    return frozenRecord;
  }
}
