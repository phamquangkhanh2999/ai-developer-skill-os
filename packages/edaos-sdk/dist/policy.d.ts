import { a as Evidence, h as RiskLevel, F as Finding } from './types-BiXYJI6O.js';

/**
 * PolicyEngine
 * Spec 06 (Governance Policy Model) + Spec 21 (Policy Evaluator Runtime)
 *
 * Classifies risk level of findings and enforces permission gates
 * before autonomous execution is permitted.
 */

interface RiskThresholds {
    criticalDelta: number;
    highDelta: number;
    mediumDelta: number;
}
declare class PolicyEngine {
    private readonly thresholds;
    /** Identities that may act on CRITICAL findings without human gate */
    private readonly privilegedRoles;
    constructor(options?: {
        thresholds?: Partial<RiskThresholds>;
        privilegedRoles?: string[];
    });
    /**
     * Classify the risk level of a failing evidence object.
     * PASS evidence always returns LOW.
     */
    classifyRisk(evidence: Evidence): RiskLevel;
    /**
     * Build a Finding from failing evidence.
     * Returns null for PASS evidence (no action needed).
     */
    toFinding(evidence: Evidence, action: string): Finding | null;
    /**
     * Gate: is the agent identity permitted to act on this finding?
     *
     * CRITICAL findings require a privileged role (ARCHITECT / ADMIN / PRINCIPAL).
     * All other risk levels are permitted for any agent.
     *
     * Spec 89 Art. 4: The human governance console can inject VETOED status
     * independently of this check.
     */
    isPermitted(finding: Finding, agentIdentity: string): boolean;
    /**
     * Quarantine a policy violation — returns a structured record
     * suitable for the Execution Journal.
     * Spec 21: violations must be quarantined, not silently skipped.
     */
    quarantine(action: string, ruleId: string, reason: string): {
        quarantined: true;
        action: string;
        ruleId: string;
        reason: string;
        timestamp: string;
    };
}

export { PolicyEngine, type RiskThresholds };
