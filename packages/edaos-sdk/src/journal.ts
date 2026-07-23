/**
 * ExecutionJournal
 * Spec 13 — Execution Journal Contract
 *
 * Immutable, append-only signed audit trail of all decisions and executions.
 * Constitution Article 1: every mutation MUST produce a journal entry.
 * No entry can be modified or deleted after appending.
 */

import type { ExecutionStatus, JournalEntry } from './types.js'

// ─────────────────────────────────────────────────────────────────────────────
// EXECUTION JOURNAL
// ─────────────────────────────────────────────────────────────────────────────

export class ExecutionJournal {
  /** Sealed entries — no mutation allowed after append */
  private readonly entries: JournalEntry[] = []
  private traceCounter = 1000

  private readonly onAppend?: (entry: JournalEntry) => void

  constructor(options: {
    onAppend?: (entry: JournalEntry) => void
  } = {}) {
    if (options.onAppend !== undefined) {
      this.onAppend = options.onAppend
    }
  }

  // ── Write ──────────────────────────────────────────────────────────────────

  /** Append an immutable journal entry. Returns the appended entry. */
  append(params: {
    findingId:         string
    action:            string
    status:            ExecutionStatus
    evidenceSignature: string
    agentIdentity:     string
    note?:             string
  }): JournalEntry {
    const entry: JournalEntry = {
      traceId:           this.nextTrace(),
      findingId:         params.findingId,
      action:            params.action,
      status:            params.status,
      evidenceSignature: params.evidenceSignature,
      agentIdentity:     params.agentIdentity,
      timestamp:         new Date().toISOString(),
      ...(params.note !== undefined ? { note: params.note } : {}),
    } as JournalEntry

    // Freeze to enforce immutability at runtime
    Object.freeze(entry)
    this.entries.push(entry)
    this.onAppend?.(entry)
    return entry
  }

  // ── Read ───────────────────────────────────────────────────────────────────

  /** All entries (immutable snapshot) */
  all(): readonly JournalEntry[] {
    return Object.freeze([...this.entries])
  }

  /** Filter by execution status */
  byStatus(status: ExecutionStatus): readonly JournalEntry[] {
    return this.entries.filter(e => e.status === status)
  }

  /** Lookup a specific trace */
  byTraceId(traceId: string): JournalEntry | undefined {
    return this.entries.find(e => e.traceId === traceId)
  }

  /** Total count */
  get size(): number {
    return this.entries.length
  }

  // ── Analytics ──────────────────────────────────────────────────────────────

  /** Returns a summary of statuses for monitoring dashboards */
  summary(): Record<ExecutionStatus, number> {
    const counts: Record<ExecutionStatus, number> = {
      COMMITTED:   0,
      ROLLED_BACK: 0,
      VETOED:      0,
      SKIPPED:     0,
      BLOCKED:     0,
    }
    for (const e of this.entries) {
      counts[e.status]++
    }
    return counts
  }

  /** Serialize to JSON (for export to Postgres WAL, Kafka, etc.) */
  toJSON(): readonly JournalEntry[] {
    return this.all()
  }

  // ── Private ────────────────────────────────────────────────────────────────

  private nextTrace(): string {
    return `TRACE-${++this.traceCounter}`
  }
}
