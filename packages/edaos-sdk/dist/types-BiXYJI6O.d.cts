/**
 * EDAOS Core Type Definitions
 * Spec 08 — Evidence Exchange Contract
 * Spec 65 — Decision Provenance
 */
type EvidenceStatus = 'PASS' | 'FAIL' | 'WARNING';
type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
type ExecutionStatus = 'COMMITTED' | 'ROLLED_BACK' | 'VETOED' | 'SKIPPED' | 'BLOCKED';
type ProvenanceNodeType = 'OBSERVATION' | 'EVIDENCE' | 'FINDING' | 'DECISION' | 'OUTCOME';
type CollectionMethod = 'SYNTHETIC' | 'RUM' | 'STATIC_ANALYSIS' | 'CI' | 'MANUAL';
/** Raw measurement before policy evaluation */
interface Observation {
    readonly metricId: string;
    readonly value: number;
    readonly unit: string;
    readonly provider: string;
    readonly providerVersion?: string;
    readonly collectionMethod?: CollectionMethod;
    readonly timestamp: string;
}
/** Verifiable evidence object produced by EvidenceEngine */
interface Evidence {
    readonly evidenceId: string;
    readonly observation: Observation;
    readonly policyRef: string;
    readonly status: EvidenceStatus;
    readonly delta: number;
    readonly confidence: number;
    readonly signature: string;
    readonly fails: boolean;
}
interface Policy {
    readonly policyId: string;
    readonly metricId: string;
    readonly threshold: number;
    readonly unit: string;
    readonly description?: string;
}
interface Finding {
    readonly findingId: string;
    readonly evidence: Evidence;
    readonly riskLevel: RiskLevel;
    readonly recommendedAction: string;
}
interface ProvenanceNode {
    readonly nodeType: ProvenanceNodeType;
    readonly nodeId: string;
    readonly payload: string;
    readonly timestamp: string;
}
interface RejectedAlternative {
    readonly action: string;
    readonly rejectedBy: string;
    readonly reason: string;
}
interface JournalEntry {
    readonly traceId: string;
    readonly findingId: string;
    readonly action: string;
    readonly status: ExecutionStatus;
    readonly evidenceSignature: string;
    readonly agentIdentity: string;
    readonly timestamp: string;
    readonly note?: string;
}
interface ExecutionResult {
    readonly action: string;
    readonly status: ExecutionStatus;
    readonly traceId: string;
    readonly evidence?: Evidence;
    readonly message: string;
    readonly timestamp: string;
}
interface EDACOSConfig {
    /** Agent identity used in journal entries and policy permission checks */
    identity: string;
    /** Certification level this instance targets (default: 'L4') */
    certLevel?: 'L1' | 'L2' | 'L3' | 'L4';
    /** Custom policy overrides */
    policies?: Policy[];
    /** Called on every journal entry (e.g. for OpenTelemetry spans) */
    onJournal?: (entry: JournalEntry) => void;
}
interface ExecuteOptions<T = unknown> {
    readonly action: string;
    readonly evidence: Evidence;
    fn: () => Promise<T>;
    rollback?: () => Promise<void>;
    readonly alternatives?: RejectedAlternative[];
}

export type { CollectionMethod as C, EDACOSConfig as E, Finding as F, JournalEntry as J, Observation as O, Policy as P, RejectedAlternative as R, Evidence as a, ExecuteOptions as b, ExecutionResult as c, ExecutionStatus as d, EvidenceStatus as e, ProvenanceNode as f, ProvenanceNodeType as g, RiskLevel as h };
