/**
 * ProvenanceGraph
 * Spec 65 — Decision Provenance Graph
 *
 * Records the full reasoning lineage from Observation to Outcome.
 * Every node is immutable once appended — no retroactive editing.
 */

import type { ProvenanceNode, ProvenanceNodeType, RejectedAlternative } from './types.js'

// ─────────────────────────────────────────────────────────────────────────────
// PROVENANCE GRAPH
// ─────────────────────────────────────────────────────────────────────────────

export class ProvenanceGraph {
  private readonly nodes: ProvenanceNode[] = []
  private readonly alternatives: RejectedAlternative[] = []

  /**
   * Append a provenance node.
   * Required node types (Spec 65): OBSERVATION → EVIDENCE → FINDING → DECISION → OUTCOME
   */
  record(type: ProvenanceNodeType, id: string, payload: unknown): void {
    this.nodes.push({
      nodeType:  type,
      nodeId:    id,
      payload:   typeof payload === 'string' ? payload : JSON.stringify(payload),
      timestamp: new Date().toISOString(),
    })
  }

  /** Record a rejected alternative with mandatory reason (Spec 65 §3.4) */
  recordRejectedAlternative(alt: RejectedAlternative): void {
    this.alternatives.push(alt)
  }

  /** Return all nodes (immutable snapshot) */
  getNodes(): readonly ProvenanceNode[] {
    return [...this.nodes]
  }

  /** Return rejected alternatives */
  getRejectedAlternatives(): readonly RejectedAlternative[] {
    return [...this.alternatives]
  }

  /**
   * Validate completeness: all 5 mandatory node types must appear
   * for an L2 conformance-passing provenance chain.
   */
  isComplete(): boolean {
    const required: ProvenanceNodeType[] = [
      'OBSERVATION', 'EVIDENCE', 'FINDING', 'DECISION', 'OUTCOME',
    ]
    const present = new Set(this.nodes.map(n => n.nodeType))
    return required.every(t => present.has(t))
  }

  /** Render as human-readable ASCII tree */
  render(): string {
    const lines: string[] = ['[PROVENANCE GRAPH]']
    this.nodes.forEach((node, i) => {
      const connector = i < this.nodes.length - 1 ? '+--' : '\\--'
      lines.push(`  ${connector} [${node.nodeType}] ${node.nodeId}`)
    })
    if (this.alternatives.length > 0) {
      lines.push('  [REJECTED ALTERNATIVES]')
      this.alternatives.forEach(alt => {
        lines.push(`    x-- ${alt.action} (${alt.rejectedBy}: ${alt.reason})`)
      })
    }
    return lines.join('\n')
  }

  /** Serialize to JSON for storage / transport */
  toJSON(): { nodes: readonly ProvenanceNode[]; alternatives: readonly RejectedAlternative[] } {
    return {
      nodes:        this.getNodes(),
      alternatives: this.getRejectedAlternatives(),
    }
  }
}
