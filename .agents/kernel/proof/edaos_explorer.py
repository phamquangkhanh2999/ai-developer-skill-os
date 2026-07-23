#!/usr/bin/env python3
"""
EDAOS Public Evidence Explorer
Equivalent of explorer.edaos.org — inspect the full evidence chain,
decision DAG, certification status, and compliance history of any repository.

Usage:
    python edaos_explorer.py
    python edaos_explorer.py --repo company/project-x
    python edaos_explorer.py --trace TRACE-1001
    python edaos_explorer.py --dag company/project-x
    python edaos_explorer.py --cert company/project-x
"""

import sys
import json
import hashlib
import time
from dataclasses import dataclass, field
from typing import Literal, Optional

# ─────────────────────────────────────────────────────────────────────────────
# SIMULATED DATA STORE  (production: Qdrant vector DB + Postgres WAL)
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class EvidenceNode:
    trace_id: str
    metric: str
    value: float
    unit: str
    threshold: float
    status: Literal["PASS", "FAIL"]
    provider: str
    timestamp: str
    signature: str
    delta: float

@dataclass
class DecisionNode:
    trace_id: str
    action: str
    triggered_by: str          # evidence_id
    approved_by: str           # identity / "AUTO"
    risk_level: str
    outcome: str               # COMMITTED | ROLLED_BACK | VETOED | BLOCKED
    alternatives_rejected: list[str]
    timestamp: str

@dataclass
class RepositoryProfile:
    repo: str
    org: str
    cert_level: str
    cert_expires: str
    spec_version: str
    runtime_version: str
    total_decisions: int
    total_evidence: int
    compliance_score_pct: float
    last_event: str
    evidence_chain: list[EvidenceNode]
    decision_dag: list[DecisionNode]
    incidents: list[dict]


# ─────────────────────────────────────────────────────────────────────────────
# SYNTHETIC REPOSITORY DATA
# ─────────────────────────────────────────────────────────────────────────────

def make_sig(trace: str, metric: str) -> str:
    return hashlib.sha256(f"{trace}{metric}".encode()).hexdigest()[:16]


REPOS = {
    "acme/frontend-platform": RepositoryProfile(
        repo="acme/frontend-platform",
        org="Acme Corp",
        cert_level="L4",
        cert_expires="2027-07-22",
        spec_version="11.0.0",
        runtime_version="11.0.0",
        total_decisions=14800,
        total_evidence=18200,
        compliance_score_pct=99.4,
        last_event="2026-07-22T09:00:00Z",
        evidence_chain=[
            EvidenceNode("TRACE-1001", "LCP",    3800, "ms",  2500, "FAIL",
                         "chrome-devtools", "2026-07-22T08:00:00Z",
                         make_sig("TRACE-1001","LCP"), +1300),
            EvidenceNode("TRACE-1001", "LCP",    1900, "ms",  2500, "PASS",
                         "chrome-devtools", "2026-07-22T08:05:00Z",
                         make_sig("TRACE-1001","LCP2"), -600),
            EvidenceNode("TRACE-1003", "BUNDLE", 380,  "KB",  250,  "FAIL",
                         "webpack-analyzer","2026-07-22T08:10:00Z",
                         make_sig("TRACE-1003","BUNDLE"), +130),
            EvidenceNode("TRACE-1004", "CLS",    0.05, "score",0.1, "PASS",
                         "lighthouse",      "2026-07-22T08:15:00Z",
                         make_sig("TRACE-1004","CLS"), -0.05),
        ],
        decision_dag=[
            DecisionNode("TRACE-1001", "optimize_lcp_loading",
                         "EV-LCP-FAIL", "AUTO",
                         "HIGH", "COMMITTED",
                         ["disable_all_cache — rejected: security risk"],
                         "2026-07-22T08:01:00Z"),
            DecisionNode("TRACE-1003", "split_bundle_chunks",
                         "EV-BUNDLE-FAIL", "AUTO",
                         "LOW", "COMMITTED",
                         ["monolith_rebuild — rejected: high risk"],
                         "2026-07-22T08:11:00Z"),
        ],
        incidents=[
            {"id": "INC-001", "metric": "LCP", "at": "2026-07-22T08:00Z",
             "mttr_hours": 1.4, "resolved_by": "AUTO", "saga": "COMMITTED"},
        ],
    ),
    "fintech/api-gateway": RepositoryProfile(
        repo="fintech/api-gateway",
        org="FinTech Ltd",
        cert_level="L4",
        cert_expires="2027-07-22",
        spec_version="11.0.0",
        runtime_version="11.0.0",
        total_decisions=20100,
        total_evidence=24500,
        compliance_score_pct=99.8,
        last_event="2026-07-22T09:30:00Z",
        evidence_chain=[
            EvidenceNode("TRACE-2001","ERRORS",12,"count",0,"FAIL",
                         "prometheus","2026-07-22T08:40:00Z",
                         make_sig("TRACE-2001","ERRORS"),+12),
            EvidenceNode("TRACE-2001","ERRORS", 0,"count",0,"PASS",
                         "prometheus","2026-07-22T09:30:00Z",
                         make_sig("TRACE-2001","ERRORS2"),0),
        ],
        decision_dag=[
            DecisionNode("TRACE-2001","restart_unhealthy_pods",
                         "EV-ERRORS-FAIL","AUTO",
                         "HIGH","ROLLED_BACK",
                         ["scale_up — rejected: cost threshold"],
                         "2026-07-22T08:41:00Z"),
            DecisionNode("TRACE-2001","restart_unhealthy_pods_v2",
                         "EV-ERRORS-FAIL","AUTO",
                         "HIGH","COMMITTED",
                         [],
                         "2026-07-22T08:50:00Z"),
        ],
        incidents=[
            {"id":"INC-002","metric":"ERRORS","at":"2026-07-22T08:40Z",
             "mttr_hours":1.7,"resolved_by":"AUTO","saga":"COMMITTED"},
        ],
    ),
}


# ─────────────────────────────────────────────────────────────────────────────
# RENDERING
# ─────────────────────────────────────────────────────────────────────────────

W = 66

def hr(c="-"):
    print("  " + c * (W - 2))

def section(title: str):
    print(f"\n  [ {title} ]")
    hr()


def render_evidence_chain(chain: list[EvidenceNode]):
    section("EVIDENCE CHAIN")
    for i, ev in enumerate(chain):
        connector = "+--" if i < len(chain) - 1 else "\\--"
        status_sym = "FAIL" if ev.status == "FAIL" else "PASS"
        delta_sym  = f"{ev.delta:+.1f}{ev.unit}"
        print(f"  {connector} [{status_sym}] trace={ev.trace_id}  "
              f"{ev.metric}={ev.value}{ev.unit} "
              f"(thr={ev.threshold})  delta={delta_sym}")
        print(f"       sig={ev.signature}  ts={ev.timestamp}")


def render_decision_dag(dag: list[DecisionNode]):
    section("DECISION DAG")
    for i, d in enumerate(dag):
        connector = "+--" if i < len(dag) - 1 else "\\--"
        print(f"  {connector} [{d.outcome:<12}] trace={d.trace_id}")
        print(f"       action  : {d.action}")
        print(f"       trigger : {d.triggered_by}")
        print(f"       approved: {d.approved_by}  risk={d.risk_level}")
        print(f"       ts      : {d.timestamp}")
        for alt in d.alternatives_rejected:
            print(f"       rejected: {alt}")


def render_cert(profile: RepositoryProfile):
    section("CERTIFICATION STATUS")
    print(f"  Cert Level    : {profile.cert_level}")
    print(f"  Spec Version  : EDAOS {profile.spec_version}")
    print(f"  Runtime       : v{profile.runtime_version}")
    print(f"  Expires       : {profile.cert_expires}")
    print(f"  Compliance    : {profile.compliance_score_pct}%")
    print(f"  Total Evidence: {profile.total_evidence:,}")
    print(f"  Total Decision: {profile.total_decisions:,}")
    print(f"  Last Event    : {profile.last_event}")


def render_incidents(profile: RepositoryProfile):
    section("INCIDENT HISTORY")
    if not profile.incidents:
        print("  No incidents recorded.")
        return
    for inc in profile.incidents:
        print(f"  [{inc['id']}]  metric={inc['metric']}  at={inc['at']}")
        print(f"    MTTR: {inc['mttr_hours']}h  resolved_by={inc['resolved_by']}"
              f"  saga={inc['saga']}")


def render_repo(profile: RepositoryProfile):
    print()
    hr("=")
    print(f"  {'EDAOS EVIDENCE EXPLORER':^{W-2}}")
    print(f"  {'explorer.edaos.org':^{W-2}}")
    hr("=")
    print(f"\n  Repository  : {profile.repo}")
    print(f"  Organization: {profile.org}")

    render_cert(profile)
    render_evidence_chain(profile.evidence_chain)
    render_decision_dag(profile.decision_dag)
    render_incidents(profile)

    print()
    hr("=")
    print(f"  Invariant: No Evidence => No Trust => No Federation")
    hr("=")
    print()


def render_trace(trace_id: str):
    """Find and display a specific trace across all repos."""
    print(f"\n  SEARCHING TRACE: {trace_id}")
    hr()
    found = False
    for profile in REPOS.values():
        for ev in profile.evidence_chain:
            if ev.trace_id == trace_id:
                print(f"  Repo     : {profile.repo}")
                print(f"  Metric   : {ev.metric} = {ev.value}{ev.unit}")
                print(f"  Status   : {ev.status}  delta={ev.delta:+.1f}{ev.unit}")
                print(f"  Provider : {ev.provider}")
                print(f"  sig      : {ev.signature}")
                print(f"  ts       : {ev.timestamp}")
                found = True
        for d in profile.decision_dag:
            if d.trace_id == trace_id:
                print(f"  Decision : {d.action}  [{d.outcome}]")
                print(f"  Approved : {d.approved_by}  risk={d.risk_level}")
    if not found:
        print(f"  [NOT FOUND] No records for trace '{trace_id}'")


# ─────────────────────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────────────────────

def main():
    args = sys.argv[1:]

    if "--repo" in args:
        idx  = args.index("--repo")
        repo = args[idx + 1] if idx + 1 < len(args) else ""
        # fuzzy match
        match = next((p for k, p in REPOS.items() if repo in k), None)
        if match:
            render_repo(match)
        else:
            print(f"  [NOT FOUND] No repo matching '{repo}'")
            print(f"  Available: {', '.join(REPOS.keys())}")

    elif "--trace" in args:
        idx = args.index("--trace")
        tid = args[idx + 1] if idx + 1 < len(args) else ""
        render_trace(tid)

    elif "--cert" in args:
        idx  = args.index("--cert")
        repo = args[idx + 1] if idx + 1 < len(args) else ""
        match = next((p for k, p in REPOS.items() if repo in k), None)
        if match:
            print(f"\n  Repo: {match.repo}")
            render_cert(match)
        else:
            print(f"  [NOT FOUND] '{repo}'")

    elif "--dag" in args:
        idx  = args.index("--dag")
        repo = args[idx + 1] if idx + 1 < len(args) else ""
        match = next((p for k, p in REPOS.items() if repo in k), None)
        if match:
            print(f"\n  Repo: {match.repo}")
            render_decision_dag(match.decision_dag)
        else:
            print(f"  [NOT FOUND] '{repo}'")

    else:
        # Default: show all repos summary
        print("\n  EDAOS EVIDENCE EXPLORER — All Repositories")
        hr("=")
        for profile in REPOS.values():
            print(f"\n  {profile.repo}  [{profile.cert_level}]  "
                  f"decisions={profile.total_decisions:,}  "
                  f"compliance={profile.compliance_score_pct}%")
        print()
        render_repo(list(REPOS.values())[0])


if __name__ == "__main__":
    main()
