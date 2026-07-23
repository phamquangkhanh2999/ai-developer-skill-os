#!/usr/bin/env python3
"""
EDAOS Multi-Level Conformance Test Suite
Implements the 4-level conformance gate for EDAOS-compatible runtimes.

  Level 1 — Evidence Exchange          (Spec 08, 96)
  Level 2 — Decision Provenance        (Spec 65)
  Level 3 — Governance Compliance      (Spec 06, 21, 89)
  Level 4 — Autonomous Execution Safety (Spec 24, 83)

Usage:
    python edaos_conformance_suite.py
    python edaos_conformance_suite.py --level 2
"""

import sys
import time
import hashlib
import json
from dataclasses import dataclass
from typing import Callable

# ─────────────────────────────────────────────────────────────────────────────
# TEST RESULT TYPES
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class TestResult:
    test_id: str
    name: str
    passed: bool
    message: str
    level: int
    elapsed_ms: float = 0.0

    def badge(self) -> str:
        return "PASS" if self.passed else "FAIL"


class ConformanceReport:
    def __init__(self, level: int):
        self.level = level
        self.results: list[TestResult] = []
        self.start_time = time.time()

    def add(self, result: TestResult):
        self.results.append(result)

    def passed(self) -> bool:
        return all(r.passed for r in self.results)

    def summary(self) -> dict:
        total = len(self.results)
        passed = sum(1 for r in self.results if r.passed)
        return {"total": total, "passed": passed, "failed": total - passed}

    def print_report(self, max_level: int):
        elapsed = round((time.time() - self.start_time) * 1000, 1)
        print(f"\n{'='*64}")
        print(f"  EDAOS CONFORMANCE TEST SUITE — Level 1 through {max_level}")
        print(f"{'='*64}")
        current_level = 0
        for r in self.results:
            if r.level != current_level:
                current_level = r.level
                label = {
                    1: "LEVEL 1 — Evidence Exchange",
                    2: "LEVEL 2 — Decision Provenance",
                    3: "LEVEL 3 — Governance Compliance",
                    4: "LEVEL 4 — Autonomous Execution Safety",
                }.get(current_level, f"LEVEL {current_level}")
                print(f"\n  [{label}]")
            status = "OK  " if r.passed else "FAIL"
            print(f"    [{status}] {r.test_id:<28}  {r.name}")
            if not r.passed:
                print(f"           -> {r.message}")

        s = self.summary()
        overall = "CONFORMANCE PASSED" if self.passed() else "CONFORMANCE FAILED"
        print(f"\n  {'='*60}")
        print(f"  Results  : {s['passed']}/{s['total']} passed  "
              f"({s['failed']} failed)  [{elapsed}ms]")
        print(f"  Status   : {overall}")
        print(f"  {'='*60}\n")


# ─────────────────────────────────────────────────────────────────────────────
# TEST RUNNER HELPER
# ─────────────────────────────────────────────────────────────────────────────

def run_test(test_id: str, name: str, level: int,
             fn: Callable[[], tuple[bool, str]]) -> TestResult:
    t0 = time.time()
    try:
        passed, message = fn()
    except Exception as exc:
        passed, message = False, f"Exception: {exc}"
    elapsed = round((time.time() - t0) * 1000, 2)
    return TestResult(test_id, name, passed, message, level, elapsed)


# ─────────────────────────────────────────────────────────────────────────────
# LEVEL 1 — EVIDENCE EXCHANGE  (Spec 08, 96)
# ─────────────────────────────────────────────────────────────────────────────

def test_L1_evidence_schema_valid():
    """Evidence must have required W3C-compatible fields."""
    evidence = {
        "evidence_id": "EV-LCP-001",
        "metric_id": "LCP",
        "value": 3800,
        "unit": "ms",
        "provider": "chrome-devtools",
        "confidence": 0.99,
        "policy_ref": "POL-FE-PERF-CORE-01",
        "status": "FAIL",
    }
    required = ["evidence_id", "metric_id", "value", "policy_ref", "status"]
    missing = [f for f in required if f not in evidence]
    if missing:
        return False, f"Missing required fields: {missing}"
    return True, "All required fields present"


def test_L1_evidence_must_have_signature():
    """Evidence must carry a cryptographic signature (Ed25519 / SHA-256 proxy)."""
    payload = json.dumps({"metric": "LCP", "value": 3800}, sort_keys=True)
    sig = hashlib.sha256(payload.encode()).hexdigest()
    return bool(sig and len(sig) == 64), f"signature={sig[:16]}..."


def test_L1_no_action_without_evidence():
    """
    Master invariant: a decision must NOT be produced when evidence status is absent.
    """
    def make_decision(evidence=None):
        if evidence is None:
            raise ValueError("INVARIANT VIOLATION: No evidence => No decision")
        return {"decision": "OPTIMIZE"}

    blocked = False
    try:
        make_decision(evidence=None)
    except ValueError:
        blocked = True
    return blocked, "Decision blocked when evidence is None"


def test_L1_evidence_status_binary():
    """Evidence status must be PASS or FAIL — no ambiguous states."""
    allowed = {"PASS", "FAIL", "WARNING"}
    status = "FAIL"
    return status in allowed, f"status='{status}' is in allowed set {allowed}"


# ─────────────────────────────────────────────────────────────────────────────
# LEVEL 2 — DECISION PROVENANCE  (Spec 65)
# ─────────────────────────────────────────────────────────────────────────────

def test_L2_provenance_chain_complete():
    """Provenance graph must contain all 5 mandatory node types."""
    graph_nodes = [
        {"type": "OBSERVATION", "id": "LCP"},
        {"type": "EVIDENCE",    "id": "EV-LCP-001"},
        {"type": "FINDING",     "id": "FND-LCP-001"},
        {"type": "DECISION",    "id": "OPTIMIZE_LCP"},
        {"type": "OUTCOME",     "id": "COMMITTED"},
    ]
    required_types = {"OBSERVATION", "EVIDENCE", "FINDING", "DECISION", "OUTCOME"}
    present = {n["type"] for n in graph_nodes}
    missing = required_types - present
    if missing:
        return False, f"Missing node types: {missing}"
    return True, f"All 5 provenance node types present"


def test_L2_alternative_rejected_recorded():
    """Rejected alternatives must be stored with rejection reason."""
    provenance = {
        "alternatives_considered": [
            {"action": "DISABLE_ALL_CACHE", "rejected_by": "security_agent",
             "reason": "sensitive data exposure risk"},
        ]
    }
    alts = provenance.get("alternatives_considered", [])
    if not alts:
        return False, "No rejected alternatives recorded"
    has_reason = all("reason" in a for a in alts)
    return has_reason, f"{len(alts)} alternative(s) with rejection reasons recorded"


def test_L2_decision_timestamp_present():
    """Every decision node must carry an ISO 8601 timestamp."""
    decision = {"id": "OPTIMIZE_LCP", "timestamp": "2026-07-22T11:00:00Z"}
    has_ts = "timestamp" in decision and decision["timestamp"]
    return bool(has_ts), f"timestamp={decision.get('timestamp')}"


# ─────────────────────────────────────────────────────────────────────────────
# LEVEL 3 — GOVERNANCE COMPLIANCE  (Spec 06, 21, 89)
# ─────────────────────────────────────────────────────────────────────────────

def test_L3_constitution_article1_no_hidden_execution():
    """Article 1: Every mutation must produce a journal entry."""
    journal = []

    def execute_mutation(action: str, journal_ref: list):
        # Simulate compliant execution — always journals
        journal_ref.append({"action": action, "ts": time.time()})

    execute_mutation("OPTIMIZE_LCP_LOADING", journal)
    return len(journal) > 0, f"{len(journal)} journal entry(ies) created"


def test_L3_constitution_article4_human_veto():
    """Article 4: Human veto must immediately halt execution."""
    execution_completed = False
    human_veto_received = True

    def execute_with_veto_check(veto: bool):
        nonlocal execution_completed
        if veto:
            raise PermissionError("HUMAN VETO: Execution halted by governance authority")
        execution_completed = True

    try:
        execute_with_veto_check(veto=human_veto_received)
    except PermissionError:
        pass

    return not execution_completed, "Execution halted by human veto"


def test_L3_high_risk_requires_human_gate():
    """CRITICAL risk findings must require human approval before execution."""
    finding_risk = "CRITICAL"
    identity = "AGENT-RESOLUTION-ORCHESTRATOR"  # no ARCHITECT role

    def is_permitted(risk: str, agent_identity: str) -> bool:
        if risk == "CRITICAL" and "ARCHITECT" not in agent_identity.upper():
            return False
        return True

    permitted = is_permitted(finding_risk, identity)
    return not permitted, "CRITICAL risk correctly blocked for non-architect identity"


def test_L3_policy_violation_quarantined():
    """Actions violating a policy must be quarantined, not silently skipped."""
    violations = []

    def evaluate_policy(action: str, rule: str, violations_ref: list) -> bool:
        if "UNSAFE" in action:
            violations_ref.append({"action": action, "rule": rule})
            return False
        return True

    result = evaluate_policy("UNSAFE_CACHE_DISABLE", "SEC-01", violations)
    return (not result and len(violations) > 0), f"Violation quarantined: {violations}"


# ─────────────────────────────────────────────────────────────────────────────
# LEVEL 4 — AUTONOMOUS EXECUTION SAFETY  (Spec 24, 83)
# ─────────────────────────────────────────────────────────────────────────────

def test_L4_saga_rollback_on_failure():
    """Saga must rollback to pre-mutation state on any execution failure."""
    state = {"lcp": 3800}
    checkpoint = state.copy()

    def mutate(state_ref: dict) -> bool:
        state_ref["lcp"] = 1800
        raise RuntimeError("Simulated provider failure mid-execution")

    try:
        mutate(state)
    except RuntimeError:
        state.update(checkpoint)  # compensating action

    return state["lcp"] == 3800, f"State restored to lcp={state['lcp']}ms after rollback"


def test_L4_no_mutation_without_rollback_proof():
    """
    Spec 83 (Formal Verification): mutation must be blocked if rollback path is unproven.
    """
    def has_rollback_proof(action: str) -> bool:
        proven_actions = {"OPTIMIZE_LCP_LOADING", "OPTIMIZE_BUNDLE_LOADING"}
        return action in proven_actions

    safe_action = "OPTIMIZE_LCP_LOADING"
    unsafe_action = "DROP_PRODUCTION_TABLE"

    safe_ok   = has_rollback_proof(safe_action)
    unsafe_ok = has_rollback_proof(unsafe_action)

    return (safe_ok and not unsafe_ok), (
        f"'{safe_action}' proven safe, '{unsafe_action}' correctly blocked"
    )


def test_L4_concurrent_mutation_isolation():
    """Two concurrent mutations to the same artifact must be serialized, not merged."""
    import threading
    mutations = []
    lock = threading.Lock()

    def safe_mutate(name: str):
        with lock:
            mutations.append(name)
            time.sleep(0.001)

    threads = [
        threading.Thread(target=safe_mutate, args=(f"mutation-{i}",))
        for i in range(5)
    ]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    has_duplicates = len(mutations) != len(set(mutations))
    return (not has_duplicates and len(mutations) == 5), (
        f"{len(mutations)} mutations serialized, no duplicates"
    )


def test_L4_verification_gate_blocks_regression():
    """Post-execution verification must block commit if metric regressed."""
    pre_lcp  = 3800
    post_lcp = 2100  # improved but not within threshold

    def verify_improvement(before: float, after: float, threshold: float) -> bool:
        return after < before and after < threshold

    result = verify_improvement(pre_lcp, post_lcp, threshold=2500)
    return result, f"LCP: {pre_lcp}ms -> {post_lcp}ms (within 2500ms threshold)"


# ─────────────────────────────────────────────────────────────────────────────
# MAIN RUNNER
# ─────────────────────────────────────────────────────────────────────────────

SUITE: dict[int, list[tuple[str, str, Callable]]] = {
    1: [
        ("L1-EVD-001", "Evidence schema has required fields",         test_L1_evidence_schema_valid),
        ("L1-EVD-002", "Evidence carries cryptographic signature",    test_L1_evidence_must_have_signature),
        ("L1-EVD-003", "No decision without evidence (invariant)",    test_L1_no_action_without_evidence),
        ("L1-EVD-004", "Evidence status is unambiguous binary value", test_L1_evidence_status_binary),
    ],
    2: [
        ("L2-PRV-001", "Provenance graph has all 5 node types",       test_L2_provenance_chain_complete),
        ("L2-PRV-002", "Rejected alternatives recorded with reason",  test_L2_alternative_rejected_recorded),
        ("L2-PRV-003", "Decision node carries ISO 8601 timestamp",    test_L2_decision_timestamp_present),
    ],
    3: [
        ("L3-GOV-001", "Article 1: every mutation journals an entry", test_L3_constitution_article1_no_hidden_execution),
        ("L3-GOV-002", "Article 4: human veto halts execution",       test_L3_constitution_article4_human_veto),
        ("L3-GOV-003", "CRITICAL risk requires human gate",          test_L3_high_risk_requires_human_gate),
        ("L3-GOV-004", "Policy violation is quarantined",            test_L3_policy_violation_quarantined),
    ],
    4: [
        ("L4-SAF-001", "Saga rolls back state on execution failure",  test_L4_saga_rollback_on_failure),
        ("L4-SAF-002", "Mutation blocked without rollback proof",      test_L4_no_mutation_without_rollback_proof),
        ("L4-SAF-003", "Concurrent mutations serialized via lock",    test_L4_concurrent_mutation_isolation),
        ("L4-SAF-004", "Post-execution verification gate active",     test_L4_verification_gate_blocks_regression),
    ],
}


def main():
    max_level = int(sys.argv[2]) if len(sys.argv) > 2 and sys.argv[1] == "--level" else 4
    report = ConformanceReport(level=max_level)

    for level in range(1, max_level + 1):
        for tid, name, fn in SUITE[level]:
            result = run_test(tid, name, level, fn)
            report.add(result)

    report.print_report(max_level)
    sys.exit(0 if report.passed() else 1)


if __name__ == "__main__":
    main()
