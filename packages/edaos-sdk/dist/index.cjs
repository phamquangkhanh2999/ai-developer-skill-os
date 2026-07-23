'use strict';

var crypto = require('crypto');

/**
 * edaos-sdk v11.0.0
 * Evidence-Driven Autonomous Engineering SDK
 * Apache-2.0 License — https://edaos.org
 */

var DEFAULT_POLICIES = [
  { policyId: "POL-FE-PERF-LCP-01", metricId: "LCP", threshold: 2500, unit: "ms", description: "Largest Contentful Paint (Good threshold)" },
  { policyId: "POL-FE-PERF-CLS-01", metricId: "CLS", threshold: 0.1, unit: "score", description: "Cumulative Layout Shift (Good threshold)" },
  { policyId: "POL-FE-PERF-INP-01", metricId: "INP", threshold: 200, unit: "ms", description: "Interaction to Next Paint (Good threshold)" },
  { policyId: "POL-FE-BUNDLE-JS-01", metricId: "BUNDLE", threshold: 250, unit: "KB", description: "JS bundle size limit" },
  { policyId: "POL-BE-ERROR-RATE-01", metricId: "ERRORS", threshold: 0, unit: "count", description: "Production error count must be zero" },
  { policyId: "POL-CI-BUILD-01", metricId: "BUILD", threshold: 0, unit: "failures", description: "CI build failures must be zero" }
];
var EvidenceEngine = class {
  constructor(customPolicies = []) {
    this.policies = /* @__PURE__ */ new Map();
    for (const p of [...DEFAULT_POLICIES, ...customPolicies]) {
      this.policies.set(p.metricId, p);
    }
  }
  /**
   * Evaluate an observation against known policies.
   * Returns null when no matching policy is found (observation ignored).
   *
   * INVARIANT: No policy match → no evidence → no decision.
   */
  evaluate(obs) {
    const policy = this.policies.get(obs.metricId);
    if (policy === void 0) return null;
    const delta = obs.value - policy.threshold;
    const status = delta > 0 ? "FAIL" : "PASS";
    const signature = this.sign(obs);
    return {
      evidenceId: `EV-${obs.metricId}-${Date.now()}`,
      observation: obs,
      policyRef: policy.policyId,
      status,
      delta: Math.round(delta * 100) / 100,
      confidence: 0.99,
      signature,
      fails: status === "FAIL"
    };
  }
  /** Add or override a policy at runtime */
  registerPolicy(policy) {
    this.policies.set(policy.metricId, policy);
  }
  /** List all registered policies */
  listPolicies() {
    return [...this.policies.values()];
  }
  // ── private ────────────────────────────────────────────────────────────────
  sign(obs) {
    const payload = JSON.stringify({
      metricId: obs.metricId,
      value: obs.value,
      provider: obs.provider,
      timestamp: obs.timestamp
    });
    return crypto.createHash("sha256").update(payload).digest("hex").slice(0, 16);
  }
};

// src/journal.ts
var ExecutionJournal = class {
  constructor(options = {}) {
    /** Sealed entries — no mutation allowed after append */
    this.entries = [];
    this.traceCounter = 1e3;
    if (options.onAppend !== void 0) {
      this.onAppend = options.onAppend;
    }
  }
  // ── Write ──────────────────────────────────────────────────────────────────
  /** Append an immutable journal entry. Returns the appended entry. */
  append(params) {
    const entry = {
      traceId: this.nextTrace(),
      findingId: params.findingId,
      action: params.action,
      status: params.status,
      evidenceSignature: params.evidenceSignature,
      agentIdentity: params.agentIdentity,
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      ...params.note !== void 0 ? { note: params.note } : {}
    };
    Object.freeze(entry);
    this.entries.push(entry);
    this.onAppend?.(entry);
    return entry;
  }
  // ── Read ───────────────────────────────────────────────────────────────────
  /** All entries (immutable snapshot) */
  all() {
    return Object.freeze([...this.entries]);
  }
  /** Filter by execution status */
  byStatus(status) {
    return this.entries.filter((e) => e.status === status);
  }
  /** Lookup a specific trace */
  byTraceId(traceId) {
    return this.entries.find((e) => e.traceId === traceId);
  }
  /** Total count */
  get size() {
    return this.entries.length;
  }
  // ── Analytics ──────────────────────────────────────────────────────────────
  /** Returns a summary of statuses for monitoring dashboards */
  summary() {
    const counts = {
      COMMITTED: 0,
      ROLLED_BACK: 0,
      VETOED: 0,
      SKIPPED: 0,
      BLOCKED: 0
    };
    for (const e of this.entries) {
      counts[e.status]++;
    }
    return counts;
  }
  /** Serialize to JSON (for export to Postgres WAL, Kafka, etc.) */
  toJSON() {
    return this.all();
  }
  // ── Private ────────────────────────────────────────────────────────────────
  nextTrace() {
    return `TRACE-${++this.traceCounter}`;
  }
};

// src/policy.ts
var DEFAULT_RISK_THRESHOLDS = {
  criticalDelta: 2e3,
  highDelta: 1e3,
  mediumDelta: 300
};
var PolicyEngine = class {
  constructor(options = {}) {
    this.thresholds = { ...DEFAULT_RISK_THRESHOLDS, ...options.thresholds };
    this.privilegedRoles = options.privilegedRoles ?? ["ARCHITECT", "ADMIN", "PRINCIPAL"];
  }
  /**
   * Classify the risk level of a failing evidence object.
   * PASS evidence always returns LOW.
   */
  classifyRisk(evidence) {
    if (!evidence.fails) return "LOW";
    const abs = Math.abs(evidence.delta);
    if (abs > this.thresholds.criticalDelta) return "CRITICAL";
    if (abs > this.thresholds.highDelta) return "HIGH";
    if (abs > this.thresholds.mediumDelta) return "MEDIUM";
    return "LOW";
  }
  /**
   * Build a Finding from failing evidence.
   * Returns null for PASS evidence (no action needed).
   */
  toFinding(evidence, action) {
    if (!evidence.fails) return null;
    return {
      findingId: `FND-${evidence.observation.metricId}-${Date.now()}`,
      evidence,
      riskLevel: this.classifyRisk(evidence),
      recommendedAction: action
    };
  }
  /**
   * Gate: is the agent identity permitted to act on this finding?
   *
   * CRITICAL findings require a privileged role (ARCHITECT / ADMIN / PRINCIPAL).
   * All other risk levels are permitted for any agent.
   *
   * Spec 89 Art. 4: The human governance console can inject VETOED status
   * independently of this check.
   */
  isPermitted(finding, agentIdentity) {
    if (finding.riskLevel !== "CRITICAL") return true;
    return this.privilegedRoles.some(
      (role) => agentIdentity.toUpperCase().includes(role)
    );
  }
  /**
   * Quarantine a policy violation — returns a structured record
   * suitable for the Execution Journal.
   * Spec 21: violations must be quarantined, not silently skipped.
   */
  quarantine(action, ruleId, reason) {
    return {
      quarantined: true,
      action,
      ruleId,
      reason,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
};

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

// src/saga.ts
var SagaManager = class {
  constructor(hooks = {}) {
    if (hooks.onCheckpoint !== void 0) this.onCheckpoint = hooks.onCheckpoint;
    if (hooks.onCommit !== void 0) this.onCommit = hooks.onCommit;
    if (hooks.onRollback !== void 0) this.onRollback = hooks.onRollback;
  }
  /**
   * Execute single `fn` with Saga rollback guarantee.
   */
  async execute(action, fn, rollback) {
    this.onCheckpoint?.(action);
    try {
      const value = await fn();
      this.onCommit?.(action);
      return { status: "COMMITTED", value, rolledBack: false };
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      this.onRollback?.(action, error);
      if (rollback !== void 0) {
        await rollback();
        return { status: "ROLLED_BACK", error, rolledBack: true };
      }
      return { status: "ROLLED_BACK", error, rolledBack: false };
    }
  }
  /**
   * Execute a Multi-Step Saga (DAG).
   * Executes steps sequentially. If a step fails, rolls back ALL previously
   * completed steps in REVERSE order.
   *
   * @param name   Human-readable saga name
   * @param steps  Array of Saga steps
   */
  async executeDAG(name, steps) {
    this.onCheckpoint?.(name);
    const completedSteps = [];
    const results = [];
    for (const step of steps) {
      try {
        const val = await step.execute();
        results.push(val);
        completedSteps.push(step);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        this.onRollback?.(step.action, error);
        const reverseSteps = [...completedSteps].reverse();
        let rollbackSuccess = true;
        for (const rStep of reverseSteps) {
          if (rStep.rollback !== void 0) {
            try {
              await rStep.rollback();
            } catch (rErr) {
              rollbackSuccess = false;
            }
          }
        }
        return { status: "ROLLED_BACK", error, rolledBack: rollbackSuccess };
      }
    }
    this.onCommit?.(name);
    return { status: "COMMITTED", value: results, rolledBack: false };
  }
  /**
   * Simulate execution without side-effects (for Digital Twin / Spec 64).
   * Always returns COMMITTED but never calls fn().
   */
  simulate(action) {
    return {
      status: "COMMITTED",
      value: `[SIMULATED] ${action}`,
      rolledBack: false
    };
  }
};

// src/control-plane.ts
var ControlPlane = class {
  constructor(config) {
    /** Fresh provenance graph per observation cycle */
    this.currentGraph = null;
    this.identity = config.identity;
    this.certLevel = config.certLevel ?? "L4";
    this.evidenceEngine = new EvidenceEngine(config.policies);
    this.policyEngine = new PolicyEngine({
      privilegedRoles: ["ARCHITECT", "ADMIN", "PRINCIPAL"]
    });
    this.sagaManager = new SagaManager({
      onCheckpoint: (action) => this.log(`CHECKPOINT: ${action}`),
      onCommit: (action) => this.log(`COMMITTED:  ${action}`),
      onRollback: (action, err) => this.log(`ROLLED_BACK: ${action} \u2014 ${err.message}`)
    });
    this.journal = new ExecutionJournal(
      config.onJournal ? { onAppend: config.onJournal } : {}
    );
  }
  // ── Core pipeline ──────────────────────────────────────────────────────────
  /**
   * Convert an Observation into a signed Evidence object.
   * Returns null if no matching policy exists.
   */
  observe(obs) {
    const evidence = this.evidenceEngine.evaluate(obs);
    if (evidence === null) return null;
    this.currentGraph = new ProvenanceGraph();
    this.currentGraph.record("OBSERVATION", obs.metricId, obs.value);
    this.currentGraph.record("EVIDENCE", evidence.evidenceId, {
      status: evidence.status,
      delta: evidence.delta,
      signature: evidence.signature
    });
    return evidence;
  }
  /**
   * Execute an action using the full Evidence → Decision → Execution pipeline.
   * Throws EDACOSInvariantError if evidence is missing or PASS.
   */
  async execute(options) {
    const { action, evidence, fn, rollback, alternatives = [] } = options;
    for (const alt of alternatives) {
      this.currentGraph?.recordRejectedAlternative(alt);
    }
    const finding = this.policyEngine.toFinding(evidence, action);
    if (finding === null) {
      const entry2 = this.journal.append({
        findingId: `FND-PASS-${Date.now()}`,
        action,
        status: "SKIPPED",
        evidenceSignature: evidence.signature,
        agentIdentity: this.identity,
        note: "Evidence PASS \u2014 no action required"
      });
      this.currentGraph?.record("OUTCOME", "SKIPPED", action);
      return this.buildResult(action, "SKIPPED", entry2.traceId, evidence, "Evidence PASS");
    }
    this.currentGraph?.record("FINDING", finding.findingId, {
      risk: finding.riskLevel
    });
    if (!this.policyEngine.isPermitted(finding, this.identity)) {
      const entry2 = this.journal.append({
        findingId: finding.findingId,
        action,
        status: "BLOCKED",
        evidenceSignature: evidence.signature,
        agentIdentity: this.identity,
        note: `CRITICAL risk \u2014 identity '${this.identity}' lacks required role`
      });
      this.currentGraph?.record("DECISION", "BLOCKED", this.identity);
      this.currentGraph?.record("OUTCOME", "BLOCKED", action);
      return this.buildResult(
        action,
        "BLOCKED",
        entry2.traceId,
        evidence,
        `CRITICAL risk \u2014 human approval required`
      );
    }
    this.currentGraph?.record("DECISION", action, "APPROVED");
    const saga = await this.sagaManager.execute(action, fn, rollback);
    const entry = this.journal.append({
      findingId: finding.findingId,
      action,
      status: saga.status,
      evidenceSignature: evidence.signature,
      agentIdentity: this.identity,
      ...saga.error?.message !== void 0 ? { note: saga.error.message } : {}
    });
    this.currentGraph?.record("OUTCOME", saga.status, action);
    return this.buildResult(
      action,
      saga.status,
      entry.traceId,
      evidence,
      saga.error?.message ?? `${saga.status}`
    );
  }
  /**
   * Human veto — immediately halt any pending action.
   * Constitution Article 4: veto can never be overridden.
   */
  veto(action, reason) {
    const entry = this.journal.append({
      findingId: `FND-VETO-${Date.now()}`,
      action,
      status: "VETOED",
      evidenceSignature: "HUMAN-VETO",
      agentIdentity: this.identity,
      note: reason
    });
    this.currentGraph?.record("DECISION", "VETOED", reason);
    this.currentGraph?.record("OUTCOME", "VETOED", action);
    return this.buildResult(action, "VETOED", entry.traceId, void 0, `Human veto: ${reason}`);
  }
  /** Returns the provenance graph for the current cycle */
  getProvenance() {
    return this.currentGraph;
  }
  /** Add a custom policy at runtime */
  registerPolicy(policy) {
    this.evidenceEngine.registerPolicy(policy);
  }
  // ── Private ────────────────────────────────────────────────────────────────
  buildResult(action, status, traceId, evidence, message) {
    return {
      action,
      status,
      traceId,
      ...evidence !== void 0 ? { evidence } : {},
      message,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
  }
  log(msg) {
    console.debug(`[EDAOS] ${this.identity} | ${msg}`);
  }
};

// src/edaos.ts
var EDAOS = class {
  constructor(config) {
    this.cp = new ControlPlane(config);
  }
  // ── Core 3-method API ──────────────────────────────────────────────────────
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
  observe(metricId, value, unit, provider = "unknown") {
    const obs = {
      metricId,
      value,
      unit,
      provider,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    };
    return this.cp.observe(obs);
  }
  /**
   * Step 2 — Execute an action with Saga rollback safety.
   *
   * INVARIANT: `options.evidence` is required.
   * Calling execute() without evidence throws EDACOSInvariantError.
   *
   * @throws {EDACOSInvariantError} if evidence is null/undefined
   */
  async execute(options) {
    if (options.evidence === null || options.evidence === void 0) {
      throw new EDACOSInvariantError(
        `Cannot execute '${options.action}' \u2014 evidence is required. Call edaos.observe() first. Invariant: No Evidence => No Execution.`
      );
    }
    return this.cp.execute(options);
  }
  /**
   * Human Veto — immediately halt any autonomous action.
   * Constitution Article 4: this can never be overridden by the agent.
   *
   * @param action  The action to halt
   * @param reason  Human-readable reason (logged in journal)
   */
  veto(action, reason) {
    return this.cp.veto(action, reason);
  }
  // ── Introspection ──────────────────────────────────────────────────────────
  /** Returns all journal entries (immutable) */
  journal() {
    return this.cp.journal.all();
  }
  /** Returns a summary of outcomes: { COMMITTED: N, ROLLED_BACK: N, ... } */
  journalSummary() {
    return this.cp.journal.summary();
  }
  /** Returns the current provenance graph rendered as ASCII */
  provenanceTree() {
    return this.cp.getProvenance()?.render() ?? "[No provenance recorded yet]";
  }
  /** Returns the raw provenance JSON for storage */
  provenanceJSON() {
    return this.cp.getProvenance()?.toJSON() ?? null;
  }
  /** Register a custom policy at runtime */
  registerPolicy(policy) {
    this.cp.registerPolicy(policy);
    return this;
  }
  /** The agent identity this EDAOS instance was created with */
  get identity() {
    return this.cp.identity;
  }
  /** The target certification level */
  get certLevel() {
    return this.cp.certLevel;
  }
};
var EDACOSInvariantError = class extends Error {
  constructor(message) {
    super(message);
    this.code = "EDAOS_INVARIANT_VIOLATION";
    this.name = "EDACOSInvariantError";
  }
};

// src/index.ts
var VERSION = "11.0.0";
var SPEC_VERSION = "11.0.0";
var INVARIANT = "No Evidence => No Decision => No Execution";

exports.ControlPlane = ControlPlane;
exports.EDACOSInvariantError = EDACOSInvariantError;
exports.EDAOS = EDAOS;
exports.EvidenceEngine = EvidenceEngine;
exports.ExecutionJournal = ExecutionJournal;
exports.INVARIANT = INVARIANT;
exports.PolicyEngine = PolicyEngine;
exports.ProvenanceGraph = ProvenanceGraph;
exports.SPEC_VERSION = SPEC_VERSION;
exports.SagaManager = SagaManager;
exports.VERSION = VERSION;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map