import { E as EDACOSConfig, a as Evidence, b as ExecuteOptions, c as ExecutionResult, J as JournalEntry, P as Policy, d as ExecutionStatus, O as Observation } from './types-BiXYJI6O.js';
export { C as CollectionMethod, e as EvidenceStatus, F as Finding, f as ProvenanceNode, g as ProvenanceNodeType, R as RejectedAlternative, h as RiskLevel } from './types-BiXYJI6O.js';
import { EvidenceEngine } from './evidence.js';
import { PolicyEngine } from './policy.js';
export { RiskThresholds } from './policy.js';
import { ProvenanceGraph } from './provenance.js';

/**
 * EDAOS — Developer-facing client
 * The single entry point for all EDAOS integrations.
 *
 * Usage:
 *   import { EDAOS } from 'edaos-sdk'
 *
 *   const edaos = new EDAOS({ identity: 'my-agent' })
 *   const ev    = await edaos.observe('LCP', 3800, 'ms')
 *   if (ev?.fails) {
 *     const result = await edaos.execute({
 *       action:   'optimize_lcp',
 *       evidence: ev,
 *       fn:       async () => { ... },
 *       rollback: async () => { ... },
 *     })
 *   }
 */

declare class EDAOS {
    private readonly cp;
    constructor(config: EDACOSConfig);
    /**
     * Step 1 — Observe a metric and convert it to a governed Evidence object.
     *
     * Returns `null` when no matching policy is registered for the metric.
     * This is normal and means the metric is unregulated — no evidence, no action.
     *
     * @param metricId  The metric name, e.g. 'LCP', 'BUNDLE', 'ERRORS'
     * @param value     The measured value
     * @param unit      The unit string, e.g. 'ms', 'KB', 'count'
     * @param provider  The tool that measured it (default: 'unknown')
     */
    observe(metricId: string, value: number, unit: string, provider?: string): Evidence | null;
    /**
     * Step 2 — Execute an action with Saga rollback safety.
     *
     * INVARIANT: `options.evidence` is required.
     * Calling execute() without evidence throws EDACOSInvariantError.
     *
     * @throws {EDACOSInvariantError} if evidence is null/undefined
     */
    execute<T = unknown>(options: ExecuteOptions<T>): Promise<ExecutionResult>;
    /**
     * Human Veto — immediately halt any autonomous action.
     * Constitution Article 4: this can never be overridden by the agent.
     *
     * @param action  The action to halt
     * @param reason  Human-readable reason (logged in journal)
     */
    veto(action: string, reason: string): ExecutionResult;
    /** Returns all journal entries (immutable) */
    journal(): readonly JournalEntry[];
    /** Returns a summary of outcomes: { COMMITTED: N, ROLLED_BACK: N, ... } */
    journalSummary(): Record<string, number>;
    /** Returns the current provenance graph rendered as ASCII */
    provenanceTree(): string;
    /** Returns the raw provenance JSON for storage */
    provenanceJSON(): object | null;
    /** Register a custom policy at runtime */
    registerPolicy(policy: Policy): this;
    /** The agent identity this EDAOS instance was created with */
    get identity(): string;
    /** The target certification level */
    get certLevel(): string;
}
declare class EDACOSInvariantError extends Error {
    readonly code: "EDAOS_INVARIANT_VIOLATION";
    constructor(message: string);
}

/**
 * SagaManager
 * Spec 24 — Saga Manager & Rollback Engine
 *
 * Executes actions with guaranteed compensating rollback on any failure.
 * Enforces Zero Data Loss (Constitution Article 5).
 *
 * Pattern:
 *   CHECKPOINT → execute fn() → COMMITTED
 *                             ↓ on throw
 *                        execute rollback() → ROLLED_BACK
 */

interface SagaResult<T = unknown> {
    status: ExecutionStatus;
    value?: T;
    error?: Error;
    rolledBack: boolean;
}
interface SagaStep<T = unknown> {
    action: string;
    execute: () => Promise<T>;
    rollback?: () => Promise<void>;
}
declare class SagaManager {
    private readonly onCheckpoint?;
    private readonly onCommit?;
    private readonly onRollback?;
    constructor(hooks?: {
        onCheckpoint?: (action: string) => void;
        onCommit?: (action: string) => void;
        onRollback?: (action: string, error: Error) => void;
    });
    /**
     * Execute single `fn` with Saga rollback guarantee.
     */
    execute<T>(action: string, fn: () => Promise<T>, rollback?: () => Promise<void>): Promise<SagaResult<T>>;
    /**
     * Execute a Multi-Step Saga (DAG).
     * Executes steps sequentially. If a step fails, rolls back ALL previously
     * completed steps in REVERSE order.
     *
     * @param name   Human-readable saga name
     * @param steps  Array of Saga steps
     */
    executeDAG<T = unknown>(name: string, steps: SagaStep[]): Promise<SagaResult<T[]>>;
    /**
     * Simulate execution without side-effects (for Digital Twin / Spec 64).
     * Always returns COMMITTED but never calls fn().
     */
    simulate(action: string): SagaResult;
}

/**
 * ExecutionJournal
 * Spec 13 — Execution Journal Contract
 *
 * Immutable, append-only signed audit trail of all decisions and executions.
 * Constitution Article 1: every mutation MUST produce a journal entry.
 * No entry can be modified or deleted after appending.
 */

declare class ExecutionJournal {
    /** Sealed entries — no mutation allowed after append */
    private readonly entries;
    private traceCounter;
    private readonly onAppend?;
    constructor(options?: {
        onAppend?: (entry: JournalEntry) => void;
    });
    /** Append an immutable journal entry. Returns the appended entry. */
    append(params: {
        findingId: string;
        action: string;
        status: ExecutionStatus;
        evidenceSignature: string;
        agentIdentity: string;
        note?: string;
    }): JournalEntry;
    /** All entries (immutable snapshot) */
    all(): readonly JournalEntry[];
    /** Filter by execution status */
    byStatus(status: ExecutionStatus): readonly JournalEntry[];
    /** Lookup a specific trace */
    byTraceId(traceId: string): JournalEntry | undefined;
    /** Total count */
    get size(): number;
    /** Returns a summary of statuses for monitoring dashboards */
    summary(): Record<ExecutionStatus, number>;
    /** Serialize to JSON (for export to Postgres WAL, Kafka, etc.) */
    toJSON(): readonly JournalEntry[];
    private nextTrace;
}

/**
 * ControlPlane
 * EDAOS Minimum Viable Control Plane — orchestrates all 6 subsystems.
 *
 * Enforces the master invariant end-to-end:
 *   No Evidence → No Decision → No Execution
 *
 * Internal use only. Consumer-facing API is the EDAOS class (edaos.ts).
 */

declare class ControlPlane {
    readonly identity: string;
    readonly certLevel: string;
    readonly evidenceEngine: EvidenceEngine;
    readonly policyEngine: PolicyEngine;
    readonly sagaManager: SagaManager;
    readonly journal: ExecutionJournal;
    /** Fresh provenance graph per observation cycle */
    private currentGraph;
    constructor(config: EDACOSConfig);
    /**
     * Convert an Observation into a signed Evidence object.
     * Returns null if no matching policy exists.
     */
    observe(obs: Observation): Evidence | null;
    /**
     * Execute an action using the full Evidence → Decision → Execution pipeline.
     * Throws EDACOSInvariantError if evidence is missing or PASS.
     */
    execute<T>(options: ExecuteOptions<T>): Promise<ExecutionResult>;
    /**
     * Human veto — immediately halt any pending action.
     * Constitution Article 4: veto can never be overridden.
     */
    veto(action: string, reason: string): ExecutionResult;
    /** Returns the provenance graph for the current cycle */
    getProvenance(): ProvenanceGraph | null;
    /** Add a custom policy at runtime */
    registerPolicy(policy: Policy): void;
    private buildResult;
    private log;
}

/**
 * edaos-sdk — Public API
 *
 * Main exports:
 *   import { EDAOS, EDACOSInvariantError } from 'edaos-sdk'
 *
 * Sub-path exports (tree-shakeable):
 *   import { EvidenceEngine }  from 'edaos-sdk/evidence'
 *   import { PolicyEngine }    from 'edaos-sdk/policy'
 *   import { ProvenanceGraph } from 'edaos-sdk/provenance'
 */

declare const VERSION: "11.0.0";
declare const SPEC_VERSION: "11.0.0";
declare const INVARIANT: "No Evidence => No Decision => No Execution";

export { ControlPlane, EDACOSConfig, EDACOSInvariantError, EDAOS, Evidence, EvidenceEngine, ExecuteOptions, ExecutionJournal, ExecutionResult, ExecutionStatus, INVARIANT, JournalEntry, Observation, Policy, PolicyEngine, ProvenanceGraph, SPEC_VERSION, SagaManager, type SagaResult, VERSION };
