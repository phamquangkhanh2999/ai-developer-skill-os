/**
 * AI Code Skin OS - Governed Logical Clock & Ordering Guarantee (HARDENING-014)
 * Provides deterministic Lamport logical clocks and monotonic sequence ordering
 * to guarantee historical audit replay independent of real-world wall-clock timestamps.
 */

export class LogicalClock {
  constructor(initialTick = 1000) {
    this._logicalTick = initialTick;
    this._sequenceNumber = 0;
    this._lastEvidenceId = null;
  }

  get currentLogicalTick() {
    return this._logicalTick;
  }

  get currentSequence() {
    return this._sequenceNumber;
  }

  get lastEvidenceId() {
    return this._lastEvidenceId;
  }

  /**
   * Monotonically advances the logical clock and sequence counter.
   * Returns deterministic ordering coordinates.
   */
  tick(assignedEvidenceId) {
    this._sequenceNumber += 1;
    this._logicalTick += 1;
    
    const orderingMetadata = {
      sequence_number: this._sequenceNumber,
      logical_clock: this._logicalTick,
      parent_evidence_id: this._lastEvidenceId || 'GENESIS_NODE'
    };

    if (assignedEvidenceId) {
      this._lastEvidenceId = assignedEvidenceId;
    }

    return Object.freeze(orderingMetadata);
  }

  /**
   * Synchronizes clock state upon receiving external message/event pulses (Lamport clock convergence).
   */
  synchronize(externalTick) {
    if (typeof externalTick === 'number' && externalTick > this._logicalTick) {
      this._logicalTick = externalTick + 1;
    } else {
      this._logicalTick += 1;
    }
    return this._logicalTick;
  }
}
