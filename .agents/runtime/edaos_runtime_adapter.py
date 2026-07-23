#!/usr/bin/env python3
"""
EDAOS v15 — Agent Runtime Adapter (with Identity Layer & Auto-Loader)
Skill → MCP Binding Layer

Đây là "EDAOS Spine" — kết nối Skill Layer (brain) với MCP Layer (hands)
thông qua Evidence Gate, Policy Check, Provenance Recording và Execution Journal.

Invariant: No Evidence => No MCP Call => No Execution
Provenance: Observation Hash -> Evidence Hash -> Decision Hash -> Execution Hash -> Signature

STATUS: FEATURE COMPLETE
API: FROZEN
"""

import json
import hashlib
import time
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional, List, Dict
from types import MappingProxyType

from identity_provider import IdentityProvider, SimulatedEd25519Provider
from registry_loader import RegistryLoader, MCPCapabilityChecker, RegistryValidationError

# ─────────────────────────────────────────────────────────────────────────────
# DATA TYPES
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class Evidence:
    evidence_id:   str
    skill:         str
    evidence_type: str
    source:        str
    payload:       str
    confidence:    float         # 0.0 – 1.0
    timestamp:     str
    obs_hash:      str
    evidence_hash: str

    @property
    def sufficient(self) -> bool:
        return self.confidence >= 0.8

@dataclass
class DecisionRecord:
    decision_id:         str
    skill:               str
    intent:              str
    evidence_ids:        list[str]
    evidence_hash:       str           # Link to previous stage
    mcp_calls_planned:   list[str]
    alternatives_rejected: list[dict]
    approved_by:         str           # "AUTO" | "HUMAN:name"
    timestamp:           str
    decision_hash:       str           = ""

@dataclass
class JournalEntry:
    trace_id:    str
    skill:       str
    intent:      str
    mcp_call:    str
    status:      str                   # COMMITTED | ROLLED_BACK | BLOCKED | VETOED | SKIPPED
    evidence_id: str
    decision_id: str
    decision_hash: str
    execution_hash: str
    agent:       str
    timestamp:   str
    note:        Optional[str] = None
    # Identity & Signature
    principal_id: str = ""
    public_key:   str = ""
    signature:    str = ""

@dataclass
class RoutingResult:
    status:      str
    trace_id:    str
    skill:       str
    intent:      str
    evidence:    Optional[Evidence]
    decision:    Optional[DecisionRecord]
    journal_entry: Optional[JournalEntry]
    message:     str


# ─────────────────────────────────────────────────────────────────────────────
# EVIDENCE COLLECTOR
# ─────────────────────────────────────────────────────────────────────────────

class EvidenceCollector:
    """Gathers evidence for a skill from available providers."""

    def collect(self, skill: str, evidence_type: str, source: str, payload: str,
                confidence: float = 0.9) -> Evidence:
        ts  = datetime.now(timezone.utc).isoformat()
        
        # 1. Observation Hash (Raw data)
        obs_hash = hashlib.sha256(payload.encode()).hexdigest()
        
        # 2. Evidence Hash (Contextualized observation)
        ev_content = f"{obs_hash}:{skill}:{evidence_type}:{source}:{confidence}:{ts}"
        evidence_hash = hashlib.sha256(ev_content.encode()).hexdigest()
        
        return Evidence(
            evidence_id   = f"EV-{skill.upper()[:6]}-{int(time.time()*1000)%100000}",
            skill         = skill,
            evidence_type = evidence_type,
            source        = source,
            payload       = payload,
            confidence    = confidence,
            timestamp     = ts,
            obs_hash      = obs_hash,
            evidence_hash = evidence_hash,
        )


# ─────────────────────────────────────────────────────────────────────────────
# PROVENANCE RECORDER
# ─────────────────────────────────────────────────────────────────────────────

class ProvenanceRecorder:
    def __init__(self, base_path: Path):
        self.decisions_dir = base_path / "decisions"
        self.decisions_dir.mkdir(parents=True, exist_ok=True)

    def record(self, record: DecisionRecord) -> Path:
        # 3. Decision Hash (Intent + Evidence Hash + Execution Plan)
        plan_str = ",".join(record.mcp_calls_planned)
        dec_content = f"{record.decision_id}:{record.intent}:{record.evidence_hash}:{plan_str}:{record.timestamp}"
        record.decision_hash = hashlib.sha256(dec_content.encode()).hexdigest()

        path = self.decisions_dir / f"{record.decision_id}.yml"
        content = f"""# EDAOS Decision Record
decision_id:   {record.decision_id}
skill:         {record.skill}
intent:        "{record.intent}"
approved_by:   {record.approved_by}
timestamp:     {record.timestamp}

hashes:
  evidence_hash: {record.evidence_hash}
  decision_hash: {record.decision_hash}

evidence_ids:
{chr(10).join(f'  - {e}' for e in record.evidence_ids)}

mcp_calls_planned:
{chr(10).join(f'  - {c}' for c in record.mcp_calls_planned)}

alternatives_rejected:
{chr(10).join(f'  - action: {a["action"]}' + chr(10) + f'    reason: {a["reason"]}' for a in record.alternatives_rejected) or '  []'}
"""
        path.write_text(content, encoding="utf-8")
        return path


# ─────────────────────────────────────────────────────────────────────────────
# EXECUTION JOURNAL
# ─────────────────────────────────────────────────────────────────────────────

class ExecutionJournal:
    def __init__(self, base_path: Path):
        self.journal_path = base_path / "journal.jsonl"
        self.journal_path.parent.mkdir(parents=True, exist_ok=True)

    def append(self, entry: JournalEntry) -> None:
        with self.journal_path.open("a", encoding="utf-8") as f:
            f.write(json.dumps(asdict(entry)) + "\n")

    def read_all(self) -> list[dict]:
        if not self.journal_path.exists():
            return []
        return [json.loads(line) for line in self.journal_path.read_text().splitlines() if line.strip()]

    def summary(self) -> dict[str, int]:
        entries = self.read_all()
        counts: dict[str, int] = {}
        for e in entries:
            counts[e["status"]] = counts.get(e["status"], 0) + 1
        return counts


# ─────────────────────────────────────────────────────────────────────────────
# EDAOS RUNTIME ADAPTER
# ─────────────────────────────────────────────────────────────────────────────

class EDACOSRuntimeAdapter:
    def __init__(
        self, 
        execution_base: str = ".execution", 
        identity: Optional[IdentityProvider] = None,
        registry_search_paths: Optional[List[str]] = None,
        manifest_path: str = "registry.manifest.yml"
    ):
        self._frozen = False
        
        base = Path(execution_base)
        self.collector  = EvidenceCollector()
        self.capability_checker = MCPCapabilityChecker()
        self.provenance = ProvenanceRecorder(base)
        self.journal    = ExecutionJournal(base)
        self.identity   = identity or SimulatedEd25519Provider()
        self._trace_n   = 1000

        # Auto-Load Plugin Registry and Freeze
        search_paths = registry_search_paths or ["skills", ".agents/runtime/skills"]
        self.loader = RegistryLoader(search_paths, manifest_path, MCPCapabilityChecker.AVAILABLE_PROVIDERS)
        self.capability_registry: MappingProxyType = self.loader.load_and_freeze()
        
        # API FROZEN
        self._frozen = True

    def __setattr__(self, key, value):
        if getattr(self, "_frozen", False) and key != "_trace_n":
            raise RuntimeError(f"EDAOS Runtime is API FROZEN. Cannot mutate '{key}'.")
        super().__setattr__(key, value)

    def route_skill(
        self,
        skill:           str,
        intent:          str,
        evidence:        Optional[Evidence] = None,
        alternatives:    Optional[list[dict]] = None,
    ) -> RoutingResult:
        trace_id = self._next_trace()
        ts       = datetime.now(timezone.utc).isoformat()

        if skill not in self.capability_registry:
            return self._result("BLOCKED", trace_id, skill, intent, evidence, None, None, f"Unknown skill '{skill}'")

        if evidence is None:
            return self._result("BLOCKED", trace_id, skill, intent, None, None, None,
                                "[INVARIANT] No Evidence => No MCP Call => No Execution")

        if not evidence.sufficient:
            return self._result("BLOCKED", trace_id, skill, intent, evidence, None, None,
                                f"Evidence confidence {evidence.confidence:.0%} < 80%")

        reg         = self.capability_registry[skill]
        mcp_calls   = self.capability_checker.resolve_calls(reg["capabilities"])
        call_labels = [f"{c.provider}.{c.tool}" for c in mcp_calls]

        decision = DecisionRecord(
            decision_id           = f"DEC-{skill.upper()[:6]}-{int(time.time()*1000)%100000}",
            skill                 = skill,
            intent                = intent,
            evidence_ids          = [evidence.evidence_id],
            evidence_hash         = evidence.evidence_hash,
            mcp_calls_planned     = call_labels,
            alternatives_rejected = alternatives or [],
            approved_by           = "AUTO",
            timestamp             = ts,
        )
        self.provenance.record(decision)

        needs_human = any(c.requires_approval for c in mcp_calls)
        if needs_human:
            decision.approved_by = "PENDING_HUMAN"
            entry = self._build_journal_entry(trace_id, skill, intent, call_labels, "BLOCKED", evidence, decision,
                                              note="Requires human approval")
            self.journal.append(entry)
            return self._result("BLOCKED", trace_id, skill, intent, evidence, decision, entry,
                                "Human approval required")

        # Execute
        entry = self._build_journal_entry(trace_id, skill, intent, call_labels, "COMMITTED", evidence, decision)
        self.journal.append(entry)

        return self._result("COMMITTED", trace_id, skill, intent, evidence, decision, entry,
                            f"Routed to MCP: {', '.join(call_labels)}")

    def collect_evidence(self, skill: str, evidence_type: str, source: str, payload: str, confidence: float = 0.9) -> Evidence:
        return self.collector.collect(skill, evidence_type, source, payload, confidence)

    def _next_trace(self) -> str:
        self._trace_n += 1
        return f"TRACE-{self._trace_n}"

    def veto(self, trace_id: str, skill: str, reason: str) -> JournalEntry:
        entry = self._build_journal_entry(trace_id, skill, "VETOED", [], "VETOED", None, None, note=reason)
        # Human veto uses the system's identity representing the governance layer
        entry.agent = "HUMAN"
        self.journal.append(entry)
        return entry

    def _build_journal_entry(self, trace_id, skill, intent, calls, status, evidence, decision, note=None):
        ts = datetime.now(timezone.utc).isoformat()
        calls_str = ", ".join(calls)
        ev_id = evidence.evidence_id if evidence else "N/A"
        dec_id = decision.decision_id if decision else "N/A"
        dec_hash = decision.decision_hash if decision else "N/A"
        
        # 4. Execution Hash (Status + MCP Calls + Decision Hash)
        exec_content = f"{status}:{calls_str}:{dec_hash}:{ts}"
        exec_hash = hashlib.sha256(exec_content.encode()).hexdigest()

        # 5. Final Journal Signature (Sign the Execution Hash)
        principal = self.identity.authenticate()
        pub_key = self.identity.get_public_key()
        signature = self.identity.sign(exec_hash)

        return JournalEntry(
            trace_id       = trace_id,
            skill          = skill,
            intent         = intent,
            mcp_call       = calls_str,
            status         = status,
            evidence_id    = ev_id,
            decision_id    = dec_id,
            decision_hash  = dec_hash,
            execution_hash = exec_hash,
            agent          = "EDAOS-RUNTIME-ADAPTER",
            timestamp      = ts,
            note           = note,
            principal_id   = principal,
            public_key     = pub_key,
            signature      = signature
        )

    def _result(self, status, trace_id, skill, intent, evidence, decision, journal_entry, message):
        return RoutingResult(status, trace_id, skill, intent, evidence, decision, journal_entry, message)

