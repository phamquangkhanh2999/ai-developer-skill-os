import { P as Policy, O as Observation, a as Evidence } from './types-BiXYJI6O.cjs';

/**
 * EvidenceEngine
 * Spec 03 (Tool-Blind Capability) + Spec 08 (Evidence Exchange Contract)
 *
 * Converts raw Observations into verifiable, signed Evidence objects
 * by evaluating them against registered Policy thresholds.
 */

declare class EvidenceEngine {
    private readonly policies;
    constructor(customPolicies?: Policy[]);
    /**
     * Evaluate an observation against known policies.
     * Returns null when no matching policy is found (observation ignored).
     *
     * INVARIANT: No policy match → no evidence → no decision.
     */
    evaluate(obs: Observation): Evidence | null;
    /** Add or override a policy at runtime */
    registerPolicy(policy: Policy): void;
    /** List all registered policies */
    listPolicies(): Policy[];
    private sign;
}

export { EvidenceEngine };
