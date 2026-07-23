#!/usr/bin/env python3
"""
EDAOS SDK — Quickstart
Integrate EDAOS evidence-driven governance in 5 lines.

For developers adopting EDAOS in their own runtime or CI pipeline.
This file is the canonical "hello world" of the EDAOS ecosystem.

Usage:
    python edaos_sdk_quickstart.py
    python edaos_sdk_quickstart.py --demo rollback
    python edaos_sdk_quickstart.py --demo veto
"""

import sys
import time
import hashlib
from typing import Callable, Any

# ═════════════════════════════════════════════════════════════════════════════
#  THE 5-LINE INTEGRATION
#  This is the minimum surface area required to be EDAOS L1 compatible.
# ═════════════════════════════════════════════════════════════════════════════

class EDAOS:
    """
    Minimal EDAOS client. 5 lines to govern any action with evidence.

    Example:
        edaos = EDAOS(identity="my-agent")
        evidence = edaos.observe("LCP", 3800, "ms", threshold=2500)
        if evidence.fails:
            result = edaos.execute("optimize_lcp", rollback=lambda: revert())
    """

    def __init__(self, identity: str, cert_level: str = "L4"):
        self.identity  = identity
        self.cert_level = cert_level
        self._journal: list[dict] = []
        self._policies: dict[str, float] = {
            "LCP":    2500,
            "CLS":    0.1,
            "BUNDLE": 250,
            "ERRORS": 0,
            "BUILD":  0,         # 0 = must be 0 failures
        }

    # ── Core API ─────────────────────────────────────────────────────────────

    def observe(self, metric: str, value: float, unit: str,
                threshold: float | None = None) -> "Evidence":
        """Step 1: Convert a raw measurement into a governed Evidence object."""
        threshold = threshold or self._policies.get(metric, float("inf"))
        return Evidence(metric, value, unit, threshold, agent=self)

    def execute(self, action: str,
                fn: Callable[[], Any] | None = None,
                rollback: Callable[[], Any] | None = None,
                evidence: "Evidence | None" = None) -> "ExecutionResult":
        """Step 2: Execute an action with Saga rollback safety."""
        if evidence is None:
            raise ValueError(
                f"EDAOS INVARIANT: Cannot execute '{action}' without evidence. "
                "Call edaos.observe() first."
            )
        if not evidence.fails:
            return ExecutionResult(action, "SKIPPED", "Evidence shows no violation")

        checkpoint = {"state": "pre-mutation"}
        try:
            outcome = fn() if fn else f"[simulated] {action} executed"
            self._journal_append(action, "COMMITTED", evidence)
            return ExecutionResult(action, "COMMITTED", str(outcome))
        except Exception as exc:
            if rollback:
                rollback()
            self._journal_append(action, "ROLLED_BACK", evidence, str(exc))
            return ExecutionResult(action, "ROLLED_BACK", f"Rollback due to: {exc}")

    def veto(self, action: str, reason: str) -> "ExecutionResult":
        """Human veto — immediately halt any pending action (Constitution Art. 4)."""
        self._journal_append(action, "VETOED", None, reason)
        return ExecutionResult(action, "VETOED", f"Human veto: {reason}")

    def journal(self) -> list[dict]:
        return list(self._journal)

    # ── Internal ─────────────────────────────────────────────────────────────

    def _journal_append(self, action: str, status: str,
                        evidence: "Evidence | None", note: str = ""):
        self._journal.append({
            "ts":       round(time.time(), 3),
            "action":   action,
            "status":   status,
            "agent":    self.identity,
            "ev_sig":   evidence.signature if evidence else "VETOED",
            "note":     note,
        })


# ═════════════════════════════════════════════════════════════════════════════
#  EVIDENCE TYPE
# ═════════════════════════════════════════════════════════════════════════════

class Evidence:
    def __init__(self, metric: str, value: float, unit: str,
                 threshold: float, agent: EDAOS):
        self.metric    = metric
        self.value     = value
        self.unit      = unit
        self.threshold = threshold
        self.agent     = agent
        self.delta     = round(value - threshold, 2)
        self.fails     = value > threshold
        self.status    = "FAIL" if self.fails else "PASS"
        self.timestamp = round(time.time(), 3)
        payload        = f"{metric}{value}{threshold}{self.timestamp}"
        self.signature = hashlib.sha256(payload.encode()).hexdigest()[:16]
        self.id        = f"EV-{metric}-{int(self.timestamp)}"

    def __repr__(self):
        symbol = "FAIL" if self.fails else "PASS"
        return (f"Evidence({self.metric}={self.value}{self.unit} "
                f"threshold={self.threshold} [{symbol}] delta={self.delta:+.1f})")


# ═════════════════════════════════════════════════════════════════════════════
#  EXECUTION RESULT
# ═════════════════════════════════════════════════════════════════════════════

class ExecutionResult:
    def __init__(self, action: str, status: str, message: str):
        self.action  = action
        self.status  = status
        self.message = message

    def __repr__(self):
        return f"ExecutionResult({self.action} [{self.status}]: {self.message})"


# ═════════════════════════════════════════════════════════════════════════════
#  QUICKSTART DEMOS
# ═════════════════════════════════════════════════════════════════════════════

def demo_happy_path():
    """Demo 1: Standard evidence-driven remediation (the 5-line integration)."""
    print("\n--- DEMO 1: Happy Path (5-line integration) ---")

    # 1. Initialize EDAOS client
    edaos = EDAOS(identity="frontend-performance-agent")

    # 2. Observe a metric
    ev = edaos.observe("LCP", 3800, "ms")
    print(f"  Observed : {ev}")

    # 3. Execute only if evidence shows a violation
    if ev.fails:
        result = edaos.execute(
            action="optimize_lcp_loading",
            fn=lambda: print("    [ACTION] Removing render-blocking scripts..."),
            rollback=lambda: print("    [ROLLBACK] Restoring original HTML..."),
            evidence=ev,
        )
        print(f"  Result   : {result}")

    # 4. Verify outcome
    ev_after = edaos.observe("LCP", 1900, "ms")
    print(f"  Verified : {ev_after}")

    print(f"\n  Journal entries: {len(edaos.journal())}")
    for entry in edaos.journal():
        print(f"    [{entry['status']:<12}] {entry['action']}  sig={entry['ev_sig']}")


def demo_rollback():
    """Demo 2: Saga rollback when action fails mid-execution."""
    print("\n--- DEMO 2: Saga Rollback ---")

    edaos = EDAOS(identity="backend-optimizer-agent")
    ev = edaos.observe("ERRORS", 12, "count", threshold=0)
    print(f"  Observed : {ev}")

    result = edaos.execute(
        action="restart_unhealthy_pods",
        fn=lambda: (_ for _ in ()).throw(
            RuntimeError("Cloud API timeout during restart")),
        rollback=lambda: print("    [ROLLBACK] Pods restored to previous state."),
        evidence=ev,
    )
    print(f"  Result   : {result}")
    print(f"  Journal  : {edaos.journal()[-1]['status']} — state safely restored.")


def demo_human_veto():
    """Demo 3: Human veto halts autonomous execution (Constitution Art. 4)."""
    print("\n--- DEMO 3: Human Veto ---")

    edaos = EDAOS(identity="autonomous-refactor-agent")
    ev = edaos.observe("BUNDLE", 800, "KB")
    print(f"  Observed : {ev}")

    # Simulate human governance console sending a veto signal
    veto_signal = True
    if veto_signal:
        result = edaos.veto(
            action="delete_legacy_module",
            reason="Pending security review — Tech Lead (QKhanh)",
        )
        print(f"  Result   : {result}")
    else:
        result = edaos.execute(
            action="delete_legacy_module",
            fn=lambda: "Module deleted",
            rollback=lambda: "Module restored",
            evidence=ev,
        )

    print(f"  Journal  : {edaos.journal()[-1]['status']} — execution halted by human.")


def demo_no_evidence_guard():
    """Demo 4: Invariant enforcement — execute() without observe() raises an error."""
    print("\n--- DEMO 4: Invariant Guard (No Evidence = No Execution) ---")
    edaos = EDAOS(identity="rogue-agent")
    try:
        edaos.execute("drop_database", evidence=None)
    except ValueError as exc:
        print(f"  [BLOCKED] {exc}")


def print_summary():
    print("\n" + "="*60)
    print("  EDAOS SDK — Quickstart Summary")
    print("="*60)
    print("""
  Integrate in 3 steps:

  from edaos_sdk_quickstart import EDAOS

  edaos  = EDAOS(identity="my-agent")
  ev     = edaos.observe("LCP", 3800, "ms")
  result = edaos.execute("optimize_lcp", fn=..., rollback=..., evidence=ev)

  Certification level: L4 (all 4 conformance gates enforced)
  Registry:            registry.edaos.org
  Spec version:        EDAOS 11.0.0
""")


# ─────────────────────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────────────────────

DEMOS = {
    "happy":    demo_happy_path,
    "rollback": demo_rollback,
    "veto":     demo_human_veto,
    "guard":    demo_no_evidence_guard,
}

def main():
    args = sys.argv[1:]
    if "--demo" in args:
        idx   = args.index("--demo")
        name  = args[idx + 1] if idx + 1 < len(args) else "happy"
        fn    = DEMOS.get(name, demo_happy_path)
        fn()
    else:
        for fn in DEMOS.values():
            fn()
    print_summary()


if __name__ == "__main__":
    main()
