'use strict';

/**
 * edaos-sdk v11.0.0
 * Evidence-Driven Autonomous Engineering SDK
 * Apache-2.0 License — https://edaos.org
 */

// src/provenance.ts
var ProvenanceGraph = class {
  constructor() {
    this.nodes = [];
    this.alternatives = [];
  }
  /**
   * Append a provenance node.
   * Required node types (Spec 65): OBSERVATION → EVIDENCE → FINDING → DECISION → OUTCOME
   */
  record(type, id, payload) {
    this.nodes.push({
      nodeType: type,
      nodeId: id,
      payload: typeof payload === "string" ? payload : JSON.stringify(payload),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  }
  /** Record a rejected alternative with mandatory reason (Spec 65 §3.4) */
  recordRejectedAlternative(alt) {
    this.alternatives.push(alt);
  }
  /** Return all nodes (immutable snapshot) */
  getNodes() {
    return [...this.nodes];
  }
  /** Return rejected alternatives */
  getRejectedAlternatives() {
    return [...this.alternatives];
  }
  /**
   * Validate completeness: all 5 mandatory node types must appear
   * for an L2 conformance-passing provenance chain.
   */
  isComplete() {
    const required = [
      "OBSERVATION",
      "EVIDENCE",
      "FINDING",
      "DECISION",
      "OUTCOME"
    ];
    const present = new Set(this.nodes.map((n) => n.nodeType));
    return required.every((t) => present.has(t));
  }
  /** Render as human-readable ASCII tree */
  render() {
    const lines = ["[PROVENANCE GRAPH]"];
    this.nodes.forEach((node, i) => {
      const connector = i < this.nodes.length - 1 ? "+--" : "\\--";
      lines.push(`  ${connector} [${node.nodeType}] ${node.nodeId}`);
    });
    if (this.alternatives.length > 0) {
      lines.push("  [REJECTED ALTERNATIVES]");
      this.alternatives.forEach((alt) => {
        lines.push(`    x-- ${alt.action} (${alt.rejectedBy}: ${alt.reason})`);
      });
    }
    return lines.join("\n");
  }
  /** Serialize to JSON for storage / transport */
  toJSON() {
    return {
      nodes: this.getNodes(),
      alternatives: this.getRejectedAlternatives()
    };
  }
};

exports.ProvenanceGraph = ProvenanceGraph;
//# sourceMappingURL=provenance.cjs.map
//# sourceMappingURL=provenance.cjs.map