/**
 * AI Code Skin OS - Capability Trust Evaluator & Lifecycle Engine (ESM Standard)
 * Phase 3 & Pre-Phase-4 Hardening
 * Implements:
 *  - [ABI-020] Capability Trust Promotion Lifecycle (sequential promotion gates)
 *  - [ABI-022] Capability Revocation Contract (REVOKED trust terminal state)
 */

export const TrustLevel = Object.freeze({
  REVOKED: 'revoked', // [ABI-022]
  UNKNOWN: 'unknown',
  REGISTERED: 'registered',
  VALIDATED: 'validated',
  SANDBOXED: 'sandboxed',
  VERIFIED: 'verified',
  TRUSTED: 'trusted'
});

const TRUST_RANK = {
  [TrustLevel.REVOKED]: -1,
  [TrustLevel.UNKNOWN]: 0,
  [TrustLevel.REGISTERED]: 1,
  [TrustLevel.VALIDATED]: 2,
  [TrustLevel.SANDBOXED]: 3,
  [TrustLevel.VERIFIED]: 4,
  [TrustLevel.TRUSTED]: 5
};

export class TrustEvaluator {
  constructor() {
    this._trustStore = new Map();
    this._auditLog = [];
  }

  getTrustLevel(manifestId) {
    return this._trustStore.get(manifestId) || TrustLevel.UNKNOWN;
  }

  getTrustRank(manifestId) {
    return TRUST_RANK[this.getTrustLevel(manifestId)] ?? 0;
  }

  initializeTrust(manifestId) {
    if (!this._trustStore.has(manifestId)) {
      this._trustStore.set(manifestId, TrustLevel.REGISTERED);
      this._auditLog.push({ manifestId, from: TrustLevel.UNKNOWN, to: TrustLevel.REGISTERED, reason: 'Initial registration admission', timestamp: new Date().toISOString() });
    }
    return this.getTrustLevel(manifestId);
  }

  /**
   * Promotes trust strictly through sequential promotion gates ([ABI-020]).
   * Interdicts any attempts to promote a REVOKED capability without total decommissioning ([ABI-022]).
   */
  promoteTrust(manifestId, targetLevel, verificationEvidence = null) {
    const currentLevel = this.getTrustLevel(manifestId);

    if (currentLevel === TrustLevel.REVOKED) {
      return {
        success: false,
        code: 'ABI-022_REVOKED_INTERDICTION',
        message: `[ABI-022 VIOLATION]: Capability '${manifestId}' holds terminal trust state REVOKED. Direct re-promotion is strictly interdicted!`
      };
    }

    const currentRank = TRUST_RANK[currentLevel];
    const targetRank = TRUST_RANK[targetLevel];

    if (targetRank <= 0 || targetRank === undefined) {
      return { success: false, code: 'INVALID_TARGET_LEVEL', message: `Target level '${targetLevel}' is not a recognized promotional tier.` };
    }

    if (currentLevel === TrustLevel.UNKNOWN && targetLevel !== TrustLevel.REGISTERED) {
      return {
        success: false,
        code: 'ABI-020_ILLEGAL_TRUST_LEAP',
        message: `[ABI-020 VIOLATION]: Cannot promote unregistered capability directly from unknown to '${targetLevel}'. Sequential promotion mandatory.`
      };
    }

    if (targetRank !== currentRank + 1) {
      return {
        success: false,
        code: 'ABI-020_ILLEGAL_TRUST_LEAP',
        message: `[ABI-020 VIOLATION]: Illegal trust leap attempted from '${currentLevel}' (rank ${currentRank}) directly to '${targetLevel}' (rank ${targetRank}). Strict sequential gate promotion required!`
      };
    }

    this._trustStore.set(manifestId, targetLevel);
    this._auditLog.push({ manifestId, from: currentLevel, to: targetLevel, evidence: verificationEvidence, timestamp: new Date().toISOString() });
    return { success: true, from: currentLevel, to: targetLevel };
  }

  /**
   * Enforces an immediate trust downgrade upon detecting operational anomalies.
   */
  downgradeTrust(manifestId, targetLevel = TrustLevel.REGISTERED, reason = 'Governance violation anomaly') {
    const currentLevel = this.getTrustLevel(manifestId);
    const currentRank = TRUST_RANK[currentLevel];
    const targetRank = TRUST_RANK[targetLevel];

    if (targetRank >= currentRank || currentLevel === TrustLevel.REVOKED) {
      return { success: false, code: 'INVALID_DOWNGRADE', message: 'Downgrade target must be lower than current trust rank and capability must not be revoked.' };
    }

    this._trustStore.set(manifestId, targetLevel);
    this._auditLog.push({ manifestId, from: currentLevel, to: targetLevel, reason, type: 'DOWNGRADE', timestamp: new Date().toISOString() });
    return { success: true, from: currentLevel, to: targetLevel, reason };
  }

  /**
   * Enforces authoritative terminal REVOKED state upon security breaches or contract violations ([ABI-022]).
   */
  revokeTrust(manifestId, reason = 'Security violation or expired compliance') {
    const currentLevel = this.getTrustLevel(manifestId);
    this._trustStore.set(manifestId, TrustLevel.REVOKED);
    this._auditLog.push({ manifestId, from: currentLevel, to: TrustLevel.REVOKED, reason, type: 'REVOKE', timestamp: new Date().toISOString() });
    return { success: true, from: currentLevel, to: TrustLevel.REVOKED, reason };
  }

  /**
   * Verifies whether an extension satisfies the minimum required trust rank for execution admission.
   */
  satisfiesThreshold(manifestId, requiredLevel) {
    const requiredRank = TRUST_RANK[requiredLevel] ?? 0;
    const currentRank = this.getTrustRank(manifestId);
    if (currentRank < 0) return false; // REVOKED never satisfies threshold
    return currentRank >= requiredRank;
  }
}
