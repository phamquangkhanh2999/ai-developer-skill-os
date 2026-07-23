import { g as ProvenanceNodeType, R as RejectedAlternative, f as ProvenanceNode } from './types-BiXYJI6O.cjs';

/**
 * ProvenanceGraph
 * Spec 65 — Decision Provenance Graph
 *
 * Records the full reasoning lineage from Observation to Outcome.
 * Every node is immutable once appended — no retroactive editing.
 */

declare class ProvenanceGraph {
    private readonly nodes;
    private readonly alternatives;
    /**
     * Append a provenance node.
     * Required node types (Spec 65): OBSERVATION → EVIDENCE → FINDING → DECISION → OUTCOME
     */
    record(type: ProvenanceNodeType, id: string, payload: unknown): void;
    /** Record a rejected alternative with mandatory reason (Spec 65 §3.4) */
    recordRejectedAlternative(alt: RejectedAlternative): void;
    /** Return all nodes (immutable snapshot) */
    getNodes(): readonly ProvenanceNode[];
    /** Return rejected alternatives */
    getRejectedAlternatives(): readonly RejectedAlternative[];
    /**
     * Validate completeness: all 5 mandatory node types must appear
     * for an L2 conformance-passing provenance chain.
     */
    isComplete(): boolean;
    /** Render as human-readable ASCII tree */
    render(): string;
    /** Serialize to JSON for storage / transport */
    toJSON(): {
        nodes: readonly ProvenanceNode[];
        alternatives: readonly RejectedAlternative[];
    };
}

export { ProvenanceGraph };
